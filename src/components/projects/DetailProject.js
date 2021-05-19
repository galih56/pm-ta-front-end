import React, { useState, useEffect, useContext, lazy, Suspense, useCallback } from 'react';
import { Link, useHistory, Switch, Route, BrowserRouter as Router, useLocation, withRouter } from "react-router-dom";
import { Paper, Tabs, Tab, Grid, Button, Box } from '@material-ui/core/';
import ModalDetailTask from '../tasks/modalDetailTask/ModalDetailTask';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import UserContext from '../../context/UserContext';
import AddIcon from '@material-ui/icons/Add';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const ModalCreateList = lazy(() => import('./ModalCreateList'));
const ModalCreateMeeting = lazy(() => import('./../meetings/ModalCreateMeeting'));
const ModalDetailMeeting = lazy(() => import('./../meetings/ModalDetailMeeting/ModalDetailMeeting'));
const Board = lazy(() => import('../widgets/board/Kanban'));
const GanttChart = lazy(() => import('../widgets/GanttChart'));
const Calendar = lazy(() => import('../widgets/Calendar'));
const Files = lazy(() => import('../widgets/Files'));
const EventTimeline = lazy(() => import('../widgets/EventTimeline'));
const ProjectInformations = lazy(() => import('../projects/ProjectInformations'));
const MemberList = lazy(() => import('./members/MemberList'));
const RoleList = lazy(() => import('./roles/RoleList'));
const Repositories = lazy(() => import('./github/Repositories'));

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {children}
        </Box>
    );
}

const useStyles = makeStyles((theme) => (
    { root: { flexGrow: 1, backgroundColor: theme.palette.background.paper },
    tabPanel:{ 
    padding: '0.5em',
    minHeight:'500px !important'} 
}));

const getDataFromGlobalState = (globalState, projectId) => {
    var data = null;
    globalState.projects.forEach(project => {
        if (project.id == projectId)
            data = project;
    });
    return data
}

const getCurrentTabIndex = (location, history, projectId) => {
    var tabIndex = 0;
    var currentUrl = location.pathname;
    currentUrl = currentUrl.split('/');
    var currentTab = currentUrl[currentUrl.length - 1];

    switch (currentTab) {
        case `board`:
            tabIndex = 0;
            break;
        case `gantt`:
            tabIndex = 1;
            break;
        case `timeline`:
            tabIndex = 2;
            break;
        case `meeting`:
            tabIndex = 3;
            break;
        case `files`:
            tabIndex = 4;
            break;
        case `others`:
            tabIndex = 5;
            break;
        default:
            history.push(`/projects/${projectId}/board`);
            tabIndex = 0;
            break;
    }
    return tabIndex;
}

const clickedTaskInitialState={ projectId: null, listId: null, taskId: null };
const clickedMeetingInitialState={
    id: null, name: null, type: null, size: null, source: null,
    icon: null, path: null, createdAt: null, updatedAt: null, user:null,
    link:''
};

const DetailProject = (props) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    let global = useContext(UserContext);
    let history = useHistory();
    let location = useLocation();
    const { match: { params } } = props;
    const [detailProject, setDetailData] = useState({ id: null, title: null, description: null, columns: [], members: [], createdAt: '', updatedAt: '' });
    const [showModalCreateList, setShowModalCreateList] = useState(false);
    const [showModalCreateMeeting, setShowModalCreateMeeting] = useState(false);
    const [tabState, setTabState] = useState(getCurrentTabIndex(location, history, params.id));
    const [detailTaskOpen, setDetailTaskOpen] = useState(false)
    const [detailMeetingOpen, setDetailMeetingOpen] = useState(false)
    const [clickedTask, setClickedTask] = useState(clickedTaskInitialState);
    const [clickedMeeting, setClickedMeeting] = useState(clickedMeetingInitialState);

    const handleSnackbar = (message, variant) => enqueueSnackbar(message, { variant });

    const handleStoreList = (list) => {
        //Disipakan untuk offline exp nantinya
        //Ditunda dulu
        // global.dispatch({ type: 'store-list', payload: list });
    }

    const getDetailProject = () => {
        if (window.navigator.onLine) {
            const config = { mode: 'no-cors', crossdomain: true }
            const url = process.env.REACT_APP_BACK_END_BASE_URL + 'project/' + params.id;
            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.get(url, {}, config)
                .then((result) => {
                    const data = result.data;
                    global.dispatch({ type: 'store-detail-project', payload: data })
                    setDetailData(data);
                }).catch((error) => {
                    const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: null }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });
                });
        } else {
            handleSnackbar(`You're currently offline. Please check your internet connection.`, 'warning');
            setDetailData(getDataFromGlobalState(global.state, params.id));
        }
    }

    useEffect(() => {
        const query = new URLSearchParams(props.location.search);
        const paramTaskId = query.get('task_id');
        const paramMeetingId = query.get('meeting_id');
        if (paramTaskId) handleDetailTaskOpen({ ...clickedTask, taskId: paramTaskId, open: true });
        if (paramMeetingId) handleDetailMeetingOpen({ meeting:{
            id:paramMeetingId,...clickedMeeting
        }, open: true });
        getDetailProject();
    }, []);

    const handleModalCreateList = (open) => setShowModalCreateList(open);
    const handleModalCreateMeeting = (open) => setShowModalCreateMeeting(open);

    const handleChange = (event, newValue) => setTabState(newValue);

    const handleDetailTaskOpen = (taskInfo) => {
        const { listId, taskId, open } = taskInfo;
        setDetailTaskOpen(open);
        setClickedTask({ projectId: params.id, listId: listId, taskId: taskId });
    };

    const handleDetailMeetingOpen = (meetingInfo) => {
        setDetailMeetingOpen(meetingInfo.open);
        setClickedMeeting({ ...meetingInfo.meeting });
    };

    const showModalDetailTask = useCallback(() => {
        if (clickedTask.taskId != null && clickedTask.taskId !== undefined && detailTaskOpen == true) {
            return (
                <ModalDetailTask
                    open={detailTaskOpen}
                    closeModalDetailTask={() => {
                        handleDetailTaskOpen(clickedTaskInitialState)
                    }}
                    refreshDetailProject={getDetailProject}
                    projectId={params.id}
                    initialState={clickedTask} />
            )
        }
    }, [clickedTask]);

    const showModalDetailMeeting = useCallback(() => {
        if (clickedMeeting.id != null && clickedMeeting.id !== undefined && detailMeetingOpen == true) {
            return (
                <ModalDetailMeeting
                    open={detailMeetingOpen}
                    closeModal={() =>handleDetailMeetingOpen({
                        meeting:clickedMeetingInitialState, 
                        open: false 
                    })}
                    refreshDetailProject={getDetailProject}
                    detailProject={detailProject}
                    initialState={clickedMeeting} />
            )
        }
    }, [clickedMeeting]);

    return (
        <Router>
            <div className={classes.root}>
                <Paper>
                    <Tabs
                        value={tabState}
                        onChange={handleChange} >
                        <Tab component={Link} label="Board" to={`board`} />
                        <Tab component={Link} label="Gantt" to={`gantt`} />
                        <Tab component={Link} label="Timeline" to={`timeline`} />
                        <Tab component={Link} label="Meeting" to={`meeting`} />
                        <Tab component={Link} label="Files" to={`files`} />
                        <Tab component={Link} label="Others" to={`others`} />
                    </Tabs>
                </Paper>
                <Suspense fallback={<LinearProgress />}>
                    <Switch>
                        <Route
                            path={`/projects/:id/board`}
                            render={() => {
                                return (
                                    <TabPanel
                                        value={tabState}
                                        index={0}
                                        style={{ padding: '0.5em' }}
                                    >
                                        <Grid container>
                                            <Grid item xl={12} md={12} sm={12} xs={12} >
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={()=>handleModalCreateList(true)}
                                                    style={{ marginBottom: '1em' }}
                                                    startIcon={<AddIcon />}> Add new list </Button>
                                                <Board detailProject={detailProject} handleDetailTaskOpen={handleDetailTaskOpen} refreshDetailProject={getDetailProject}/>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                )
                            }} />
                        <Route
                            path={`/projects/:id/gantt`}
                            render={() => {
                                return (
                                    <TabPanel
                                        value={tabState}
                                        index={1}
                                        className={classes.tabPanel}>
                                        <Grid container >   
                                            <Grid item xl={12} md={12} sm={12} xs={12} >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={()=>handleModalCreateList(true)}
                                                style={{ marginBottom: '1em' }}
                                                startIcon={<AddIcon />}> Add new list </Button>
                                            <GanttChart detailProject={detailProject} handleDetailTaskOpen={handleDetailTaskOpen} />
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                )
                            }} />
                        <Route
                            path={"/projects/:id/timeline"}
                            render={() => {
                                return (
                                    <TabPanel
                                        value={tabState}
                                        index={2}
                                        style={{ padding: '0.5em' }}>
                                        <Grid container >   
                                            <Grid item xl={12} md={12} sm={12} xs={12} >
                                                <EventTimeline detailProject={detailProject} handleDetailTaskOpen={handleDetailTaskOpen} />
                                            </Grid>
                                        </Grid>
                                        
                                    </TabPanel>
                                )
                            }} />
                        <Route
                            path={"/projects/:id/meeting"}
                            render={() => {
                                return (
                                    <TabPanel
                                        value={tabState}
                                        index={3}
                                        style={{ padding: '0.5em' }}>
                                        <Grid container >   
                                            <Grid item xl={12} md={12} sm={12} xs={12} >
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={()=>handleModalCreateMeeting(true)}
                                                    style={{ marginBottom: '1em' }}
                                                    startIcon={<AddIcon />}> Create new meeting </Button>
                                                <Calendar detailProject={detailProject} handleDetailMeetingOpen={handleDetailMeetingOpen} />
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                )
                            }} />
                        <Route
                            path={"/projects/:id/files"}
                            render={() => {
                                return (
                                    <TabPanel
                                        value={tabState}
                                        index={4}
                                        style={{ padding: '0.5em' }}>
                                        <Grid container >   
                                            <Grid item xl={12} md={12} sm={12} xs={12} >
                                                <Files projectId={detailProject.id} handleDetailTaskOpen={handleDetailTaskOpen} />
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                )
                            }} />
                        <Route
                            path={"/projects/:id/others"}
                            render={() => {
                                return (
                                    <TabPanel
                                        value={tabState}
                                        index={5}
                                        style={{ padding: '0.5em' }}>
                                        <Grid item xl={12} md={12} sm={12} xs={12} >
                                            <ProjectInformations detailProject={detailProject} />
                                            <Repositories/>
                                        </Grid>
                                        <Grid container >    
                                            <Grid item xl={7} md={7} sm={12} xs={12} >
                                                <MemberList projectId={params.id} data={detailProject.members} handleDetailTaskOpen={handleDetailTaskOpen} />
                                            </Grid>
                                            <Grid item xl={5} md={5} sm={12} xs={12} >
                                                <RoleList projectId={params.id} />
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                )
                            }} />
                    </Switch>
                    <ModalCreateList
                        handleStoreList={handleStoreList}
                        refreshDetailProject={getDetailProject}
                        projectId={params.id}
                        open={showModalCreateList}
                        handleOpen={()=>handleModalCreateList(true)}
                        handleClose={()=>handleModalCreateList(false)} />
                    <ModalCreateMeeting
                        refreshDetailProject={getDetailProject}
                        projectId={params.id}
                        open={showModalCreateMeeting}
                        handleOpen={()=>handleModalCreateMeeting(true)}
                        handleClose={()=>handleModalCreateMeeting(false)} />
                    {showModalDetailTask()}
                    {showModalDetailMeeting()}
                </Suspense>
            </div>
        </Router>
    );
}


export default DetailProject;