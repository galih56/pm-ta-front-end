import React,{useState,useContext, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';
import UserContext from '../../context/UserContext';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Dialog, IconButton, Typography, } from '@material-ui/core/';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { Chip, Autocomplete } from '@material-ui/core';
import axios from 'axios';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const styles = (theme) => ({
    root: { margin: 0, padding: theme.spacing(2) },
    closeButton: { position: 'absolute !important', right: theme.spacing(1), top: theme.spacing(1), color: theme.palette.grey[500], },
});

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

const FormAddNewProject=({teamId,open,closeModal,onCreate})=>{
    const global=useContext(UserContext);
    const [team,setTeam]=useState();
    const [project,setProject]=useState();
    const [projects, setProjects] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const snackbar = (message, variant) =>  enqueueSnackbar(message, { variant });

    const getProjects = () => {
        let url =''
        if(global.state.occupation=='System administrator' || global.state.occupation=='CEO') url = process.env.REACT_APP_BACK_END_BASE_URL + 'user/' + global.state.id + '/project';
        else url = process.env.REACT_APP_BACK_END_BASE_URL + 'project';
        const config = { mode: 'no-cors', crossdomain: true, }
        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.get(url, {}, config)
            .then((result) => {
                setProjects(result.data)
            }).catch((error) => {
                const payload = { error: error, snackbar: null, dispatch: global.dispatch, history: null }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }
    
    useEffect(()=>{
        getProjects();
    },[])

    const formCreateOnSubmit=()=>{
        const body = {
            team:teamId,
            project:project 
        }
        const config = { mode: 'no-cors', crossdomain: true }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + 'team-member';
        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.post(url, body, config)
            .then((result) => {
                onCreate(result.data);
                snackbar(`A new list successfully created`, 'success');
            }).catch((error) => {
                const payload = { error: error, snackbar: snackbar, dispatch: global.dispatch, history: null }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }

    return(
        <Dialog aria-labelledby="Add new project to the team" open={open}>
            <DialogTitle onClose={
                () => {
                    closeModal();
                }} > Add a project to the team</DialogTitle>
            <DialogContent dividers>
                <form onSubmit={(e)=>{
                        e.preventDefault();
                        formCreateOnSubmit();
                    }}>
                    <Grid  container spacing={2}>
                        <Grid lg={12} md={12} sm={12} xs={12} item>
                            <Select
                                onChange={(value)=>{
                                    setProject(value)
                                }} style={{width:'100%'}}
                                >
                                    {projects.map(function(item){
                                        return(<MenuItem value={item.id} key={item.id}>{item.title}</MenuItem>)
                                    })}
                                </Select>
                        </Grid>
                        <Grid xs={12} sm={12} md={12} lg={12} lg={12} item>
                            <Button type="submit" variant="contained" color="primary">Add</Button>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default FormAddNewProject;