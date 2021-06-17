import 'fontsource-roboto';
import React, { useEffect, useContext, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import UserContext from '../../../context/UserContext';
import CloseIcon from '@material-ui/icons/Close';
import { useSnackbar } from 'notistack';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import GithubLoginButton from './GithubLoginButton';
import Link from '@material-ui/core/Link';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
    root: { margin: 0, padding: theme.spacing(2) },
    closeButton: { 
        position: 'absolute !important', 
        right: theme.spacing(1), 
        top: theme.spacing(1), 
        color: theme.palette.grey[500]
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
  }));

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                <CloseIcon />
            </IconButton>
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: { padding: theme.spacing(2) },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: { margin: 0, padding: theme.spacing(1) },
}))(MuiDialogActions);

export default function ModalRepositoryInformation(props) {
    var { initialState } = props;
    var closeModal = props.handleClose;
    const [repositoryInformation,setRepositoryInformation]=useState({
        name: "", full_name: "", html_url:'',description:'',
        owner : { login:'' }
    });
    const [ commits, setCommits ]=useState([]);
    const [ issues, setIssues ]=useState([]);
    const global = useContext(UserContext);
    const classes = useStyles();

    useEffect(()=>{
        getRepositoryInfo();
        console.log(initialState);
    },[initialState])

    const getRepositoryInfo = () => {
        setCommits([]);
        setIssues([]);
        const config = { mode: 'no-cors', crossdomain: true, }
        const url = `https://api.github.com/repos/${initialState.owner_name}/${initialState.repository_name}`;
        axios.defaults.headers.common['Authorization'] = 'Bearer '+global.state.githubAuth.access_token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.get(url, {}, config)
            .then((result) => {
                setRepositoryInformation(result.data)
                getRepositoryIssues();
                getRepositoryCommits();
            }).catch((error) => {
                if(error.status==401) global.dispatch({ type: 'store-github-auth', payload: { githubAuth:{ code:'',  authenticated:false,  access_token:'',  scope:null } } });
            });
    }
    const getRepositoryIssues=()=>{
        const config = { mode: 'no-cors', crossdomain: true, }
        const url = `https://api.github.com/repos/${initialState.owner_name}/${initialState.repository_name}/issues`;
        axios.defaults.headers.common['Authorization'] = 'Bearer '+global.state.githubAuth.access_token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.get(url, {}, config)
            .then((result) => {
                setIssues(result.data)
            }).catch((error) => console.log('getRepositoryIssues : ',error));
    }
    const getRepositoryCommits=()=>{
        const config = { mode: 'no-cors', crossdomain: true, }
        const url = `https://api.github.com/repos/${initialState.owner_name}/${initialState.repository_name}/commits`;
        axios.defaults.headers.common['Authorization'] = 'Bearer '+global.state.githubAuth.access_token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.get(url, {}, config)
            .then((result) => {
                setCommits(result.data)
            }).catch((error) => console.log('getRepositoryCommits : ',error));
    }
    
    return (
        <Dialog aria-labelledby="Detail repository" open={initialState.open} fullWidth={true} maxWidth={'md'}>
            <DialogTitle onClose={
                () => {
                    closeModal(false);
                }} > {repositoryInformation.full_name?repositoryInformation.full_name:"Detail repository"} </DialogTitle>
            
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xl={12} md={12} sm={12} xs={12} >
                        <GithubLoginButton/>
                        <br/>
                        {repositoryInformation.full_name?"":"Authentication is required"}
                    </Grid>
                    <Grid item xl={6} md={6} sm={6} xs={6} >
                        <Typography gutterBottom variant="body2">Commits</Typography>
                        <List className={classes.root}>
                        {
                            commits.map(
                                (commit, index) => {
                                    return (
                                        <React.Fragment>
                                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar alt={commit.author.login} src={commit.author.avatar_url} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={ 
                                                        <Link href={commit.html_url} target="_blank">
                                                            {commit.commit.message}
                                                        </Link>
                                                    }
                                                    secondary={
                                                        commit.author.login
                                                    }
                                                    />
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                        </React.Fragment>
                                    )
                                }
                            )
                        }
                        </List>
                    </Grid>
                    <Grid item xl={6} md={6} sm={6} xs={6} >
                        <Typography gutterBottom variant="h5">Issues</Typography>
                        <List className={classes.root}>
                        {
                            issues.map(
                                (issue, index) => {
                                    return (
                                        <React.Fragment>
                                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar alt={issue.user.login} src={issue.user.avatar_url} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Link href={issue.html_url} target="_blank">
                                                            {issue.title}
                                                        </Link>
                                                    }
                                                    secondary={issue.user.login}
                                                    />
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                        </React.Fragment>
                                    )
                                }
                            )
                        }
                        </List>
                    </Grid>
                </Grid>
            </DialogContent>
            {/* 
                <DialogActions>
                    <Button color="primary">Create</Button>
                </DialogActions> 
            */}
        </Dialog>
    );
}
