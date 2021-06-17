import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import UserContext from '../../../context/UserContext';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import FormCreateNewTask from './../../tasks/FormCreateNewTask';

const styles = (theme) => ({
    root: { margin: 0, padding: theme.spacing(2) },
    closeButton: { position: 'absolute !important', right: theme.spacing(1), top: theme.spacing(1), color: theme.palette.grey[500], },
});

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other} >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

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

const useStyles = makeStyles((theme) => ({
    root: { display: 'flex', flexWrap: 'wrap' },
    margin: { margin: theme.spacing(1) },
    formControl: { minWidth: 120, },
    selectEmpty: { marginTop: theme.spacing(2), },
}));

const getListDetail = (globalState, laneId) => {
    const projects = globalState.projects;
    if(projects){
        for (let j = 0; j < projects.length; j++) {
            const columns = projects[j].columns;
            for (let i = 0; i < columns.length; i++) {
                if (columns[i].id == laneId) {
                    const column = columns[i];
                    return column;
                }
            }
        }
        return null;
    }
}

const EditLaneForm = (props) => {
    const classes = useStyles();
    const { laneId, onAdd, onCancel,detailProject } = props;
    const [modalOpen, setModalOpen] = useState(true);
    const history = useHistory();
    const initLaneState = { 
        id: null, title: '', 
        project: null
    };
    const initCardState = {
        id: null, title: '', description: '', 
        label: '', progress: 0, start: null, end: null, 
        tags: [], listId: laneId,creator:null ,members:[]
    };
    const [laneDetail, setLaneDetail] = useState(initLaneState);
    const [newCard, setNewCard] = useState(initCardState);
    const [isDeletingLane, setIsDeletingLane] = useState(false);
    const [tabState, setTabState] = useState(0);
    const global = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();

    const handleTabChanges = (event, newValue) => setTabState(newValue);

    const handleAddCard = () => onAdd(newCard);

    const handleSnackbar = (message, variant) => enqueueSnackbar(message, { variant });

    useEffect(() => {
        const detailList = getListDetail(global.state, laneId);
        if (detailList) setLaneDetail(detailList);
    }, [])

    const updateLane = () => {
        const body = {
            id: laneDetail.id,
            title: laneDetail.title,
            project: laneDetail.project,
        }
        if (window.navigator.onLine) {
            const config = { mode: 'no-cors', crossdomain: true }
            const url = 'http://localhost:1337/list/' + laneDetail.id;
            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.patch(url, body, config)
                .then((result) => {
                    handleSnackbar(`Data has been updated`, 'success');
                    global.dispatch({ type: 'update-list', payload: body });
                }).catch((error) => {
                    const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: history }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });    
                });
        }
        else {
            handleSnackbar(`You are currently offline`, 'warning');
        }
    }

    const deleteList = () => {
        if (window.navigator.onLine) {
            const config = { mode: 'no-cors', crossdomain: true }
            const url = 'http://localhost:1337/list/' + laneDetail.id;
            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.delete(url, { id: laneDetail.id }, config)
            .then((result) => {
                handleSnackbar(`Data has been deleted`, 'success');
                setModalOpen(false);
                global.dispatch({ type: 'remove-list', payload: laneDetail });
            }).catch((error) => {
                const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: history };
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
        } else {
            handleSnackbar(`You are currently offline`, 'warning');
        }
    }
    const checkIfDeletingList = (isDeletingLane) => {
        if (isDeletingLane) {
            return (
                <Grid item lg={12} md={12} sm={12} xs={12} style={{ marginTop: '1em' }}>
                    <Typography variant="body2">Data will be permanently deleted. Are you sure?</Typography>
                    <br />
                    <Button onClick={() => setIsDeletingLane(false)}>Cancel</Button>
                    <Button onClick={()=>deleteList()} variant="contained" color="secondary">Delete</Button>
                </Grid>
            );
        } else {
            return (
                <Grid item lg={12} md={12} sm={12} xs={12} style={{ marginTop: '1em' }}>
                    <Button onClick={() => setIsDeletingLane(true)} variant="contained" color="secondary" style={{ marginRight: '1.5em' }}>Delete</Button>
                    <Button variant="contained" color="primary" type="submit">Save</Button>
                </Grid>
            );
        }
    }

    const checkIfAuthenticated = () => {
        if (global.state.authenticated === true) {
            return (
                <DialogContent dividers>
                    <Tabs value={tabState} onChange={handleTabChanges} >
                        <Tab label="Edit Lane" />
                        <Tab label="Add new card" />
                    </Tabs>
                    <TabPanel value={tabState} index={0}>
                        <Grid container spacing={2} 
                            style={{ paddingLeft: "1em", paddingRight: "1em",paddingTop:"1em" }} 
                            component="form" 
                                onSubmit={(e) => { 
                                    e.preventDefault();
                                    updateLane() 
                                }}>
                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                <TextField
                                    label="Title : "
                                    placeholder="example : List A"
                                    value={laneDetail.title}
                                    onChange={(e) => setLaneDetail({ ...laneDetail, title: e.target.value })}
                                    style={{ width: '100%' }}
                                    variant="standard" 
                                />
                            </Grid>
                            {checkIfDeletingList(isDeletingLane)}
                        </Grid>
                    </TabPanel>
                    <TabPanel value={tabState} index={1}>
                        <FormCreateNewTask 
                            classes={classes} 
                            newTask={newCard} 
                            setNewTask={setNewCard}
                            handleAddNewTask={handleAddCard}
                            detailProject={detailProject}
                            isSubtask={false}
                        />
                    </TabPanel>
                </DialogContent >
            )
        } else {
            return (
                <DialogContent dividers>
                    <Alert severity="warning">Your action requires authentication. Please sign in.</Alert>
                </DialogContent>
            )
        }
    }
    return (
        <React.Fragment>
            <Dialog aria-labelledby="Create a project" open={modalOpen}>
                <DialogTitle onClose={
                    () => {
                        onCancel();
                        setModalOpen(false);
                    }}>Edit Lane</DialogTitle>
                { checkIfAuthenticated(global, classes) }
            </Dialog>
        </React.Fragment>
    )
}
export default EditLaneForm;