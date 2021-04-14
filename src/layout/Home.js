import React, { useState, useEffect, useContext } from "react";
import { Paper, Grid, ListItem, Collapse, Checkbox } from '@material-ui/core/';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import TaskTable from '../components/tasks/TaskTable';
import ProjectList from '../components/projects/ProjectList';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import UserContext from '../context/UserContext';

import styleConfig from './Theme';

const useStyles = makeStyles((theme) => (styleConfig(theme)));

const Home = (props) => {
    const classes = useStyles();
    const [taskListOpen, setTaskListOpen] = useState(true);
    const [projectListOpen, setProjectListOpen] = useState(true);

    const handleTaskListOpen = () => setTaskListOpen(!taskListOpen);

    const handleProjectListOpen = () => setProjectListOpen(!projectListOpen);

    const handleChange = (event) => { }

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
