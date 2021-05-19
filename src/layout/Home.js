import React, { useEffect,useState,useContext } from "react";
import {useHistory} from 'react-router-dom';
import UserContext from './../context/UserContext';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import TaskTable from '../components/tasks/TaskTable';
import ProjectList from '../components/projects/ProjectList';
import { makeStyles } from '@material-ui/core/styles';

import styleConfig from './Theme';

const useStyles = makeStyles((theme) => (styleConfig(theme)));

const Home = (props) => {
    const classes = useStyles();
    const [taskListOpen, setTaskListOpen] = useState(true);
    const [projectListOpen, setProjectListOpen] = useState(true);

    const handleTaskListOpen = () => setTaskListOpen(!taskListOpen);

    const handleProjectListOpen = () => setProjectListOpen(!projectListOpen);

    const handleChange = (event) => { }

    const global=useContext(UserContext);
    const history =useHistory();

    useEffect(()=>{
        const queryParams = new URLSearchParams(history.location.search)
        console.log('queryParams : ',queryParams,history.location.search);
        if (queryParams.has('code')) {
            var codeResponse=queryParams.get('code');
            global.dispatch({type:'store-github-auth',payload:{code:codeResponse}})
        }
    },[])
    

    return (
        <React.Fragment>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <ListItem button dense font="small" onClick={handleProjectListOpen} style={{ paddingBottom: '1.2em' }}> {projectListOpen ? <ExpandLess /> : <ExpandMore />}Your projects </ListItem>
                    <Collapse in={projectListOpen} timeout="auto">
                        <ProjectList></ProjectList>
                    </Collapse>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <ListItem button dense font="small" onClick={handleTaskListOpen} style={{ paddingBottom: '1.2em' }}> {taskListOpen ? <ExpandLess /> : <ExpandMore />}Task Due Soon </ListItem>
                    <Collapse in={taskListOpen} timeout="auto">
                        <TaskTable></TaskTable>
                    </Collapse>
                </Paper>
            </Grid>
        </React.Fragment >
    )
};

export default Home;
