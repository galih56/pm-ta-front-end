import React, { useEffect,useState,useContext } from "react";
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import TaskTable from '../components/tasks/TaskTable';
import ProjectList from '../components/projects/ProjectList';
import { makeStyles } from '@material-ui/core/styles';
import UserContext from './../context/UserContext';
import axios from 'axios';
import styleConfig from './Theme';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles((theme) => (styleConfig(theme)));

const Home = (props) => {
    const classes = useStyles();
    const [taskListOpen, setTaskListOpen] = useState(true);
    const [projectListOpen, setProjectListOpen] = useState(true);
    const [tasks, setTasks] = useState([]);

    const handleTaskListOpen = () => setTaskListOpen(!taskListOpen);

    const handleProjectListOpen = () => setProjectListOpen(!projectListOpen);

    const global=useContext(UserContext);
    const history =useHistory();

    useEffect(()=>{
        const queryParams = new URLSearchParams(history.location.search)
        if (queryParams.has('code')) {
            var codeResponse=queryParams.get('code');
            global.dispatch({type:'store-github-auth',payload:{code:codeResponse}})
        }
        getProjects();
        getTasks();
    },[])
    
    const getProjects = () => {
        let url =''
        if(global.state.occupation=='System administrator' || global.state.occupation=='CEO'){
            url = process.env.REACT_APP_BACK_END_BASE_URL + 'user/' + global.state.id + '/project';
        }else{
            url = process.env.REACT_APP_BACK_END_BASE_URL + 'project';
        }
        const config = { mode: 'no-cors', crossdomain: true, }
        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.get(url, {}, config)
            .then((result) => {
                global.dispatch({ type: 'store-projects', payload: result.data });
            }).catch((error) => {
                const payload = { error: error, snackbar: null, dispatch: global.dispatch, history: null }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }

    const getTasks = () => {
        const config = { mode: 'no-cors', crossdomain: true, }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + 'user/' + global.state.id + '/tasks';
        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.get(url, {}, config)
            .then((result) => {
                setTasks(result.data);
            }).catch((error) => {
                const payload = { error: error, snackbar: null, dispatch: global.dispatch, history: null }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }


    return (
        <React.Fragment>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <ListItem button dense font="small" onClick={handleProjectListOpen} 
                    style={{ paddingBottom: '1.2em' }}> {projectListOpen ? <ExpandLess /> : <ExpandMore />}Your projects </ListItem>
                    <Collapse in={projectListOpen} timeout="auto">
                        <ProjectList data={global.state.projects}></ProjectList>
                    </Collapse>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <ListItem button dense font="small" onClick={handleTaskListOpen} 
                        style={{ paddingBottom: '1.2em' }}> {taskListOpen ? <ExpandLess /> : <ExpandMore />}Task Due Soon </ListItem>
                    <Collapse in={taskListOpen} timeout="auto">
                        <TaskTable data={tasks}/>
                    </Collapse>
                </Paper>
            </Grid>
        </React.Fragment >
    )
};

export default Home;
