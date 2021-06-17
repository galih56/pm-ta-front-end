import React,{useState,useContext,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {  useTheme, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import MemberList from './MemberList';
import ProjectList from './ProjectList';
import UserContext from './../../context/UserContext';
import 'fontsource-roboto';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        margin: '1em',
    },
    margin: {
        margin: theme.spacing(1),
    },
}));

export default function DetailTeam(props) {
    const classes = useStyles();
    const global=useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState({
        id:'', name:"", description:'',
        users:[],projects:[]
    });
    const { match: { params } } = props;
    const handleEditingMode = (bool = false) => setIsEditing(bool);

    const getDetailTeam=()=>{
        const config = { mode: 'no-cors', crossdomain: true, }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + 'team/'+params.id;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.get(url, {}, config)
            .then((result) => {
                setData(result.data);
            }).catch((error) => {
                const payload = { error: error, snackbar: null, dispatch: global.dispatch, history: null }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }

    useEffect(()=>{
        getDetailTeam();
    },[]);

    return (
        <Paper style={{ padding: '1em',width:'100%' }}>
            <Grid container spacing={2}>
                
                <Grid item xl={12} lg={12} md={12} sm={12}>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="teams">
                        <Button component={Link}  color="primary"
                            to="/teams">
                            Teams
                        </Button>
                        <Typography color="textPrimary">{data.name}</Typography>
                    </Breadcrumbs>
                </Grid>
                <Grid item xl={12} lg={12} md={12} sm={12}>
                    <Typography variant="h4">{data.name}</Typography>
                </Grid>
                <Grid item xl={12} lg={12} md={12} sm={12}>
                    <ProjectList teamId={params.id} data={data.projects}/>
                </Grid>
                <Grid item xl={12} lg={12} md={12} sm={12}>
                    <MemberList teamId={params.id} data={data.users}/>
                </Grid>
            </Grid>
        </Paper>
    );
}
