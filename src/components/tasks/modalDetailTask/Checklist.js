import React, { useState, useEffect, useContext, memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid, FormControlLabel, List, ListItem, ListItemSecondaryAction,
    Checkbox, IconButton, Typography, Button, TextField,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DateTimePicker from '@material-ui/lab/DateTimePicker';
import CommentIcon from '@material-ui/icons/Comment';
import EventNoteRoundedIcon from '@material-ui/icons/EventNoteRounded';
import PeopleIcon from '@material-ui/icons/People';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import CreateIcon from '@material-ui/icons/Create';
import axios from 'axios';
import UserContext from '../../../context/UserContext';
import { useSnackbar } from 'notistack';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    root: { width: '100%', backgroundColor: theme.palette.background.paper, },
}));

const CheckList = (props) => {
    var isEditing = props.isEdit;
    const classes = useStyles();
    const taskId = props.data.id;
    const { projectId, listId, checklists } = props.data;
    const [data, setData] = useState([]);
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const global = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const handleSnackbar = (message, variant) => enqueueSnackbar(message, { variant });

    useEffect(() => {
        setData(checklists);
    }, [checklists]);

    const handleToggleChecklist = (choosenItemID) => {
        let body = { id: choosenItemID, isChecked: false }
        var newData = data.map((item) => {
            if (item.id == choosenItemID) {
                if (item.isChecked == true) item.isChecked = false;
                else item.isChecked = true;
                body.isChecked = item.isChecked;
            }
            return item
        });
        setData(newData);
        global.dispatch({ type: 'store-checklists', payload: { projectId: projectId, listId: listId, taskId: taskId, data: newData } });

        if (window.navigator.onLine) {
            const config = { mode: 'no-cors', crossdomain: true }
            const url = process.env.REACT_APP_BACK_END_BASE_URL + `task/${taskId}/checklist/${choosenItemID}`;
            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.patch(url, body, config)
                .then((result) => { }).catch((error) => {
                    error = { ...error };
                    const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: null }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });
                });
        }
    }

    const handleCreateChecklist = () => {
        const body = { id: Date.now(), projectId: projectId, listId: listId, taskId: taskId, title: title, isChecked: false, deadline: deadline };
        const config = { mode: 'no-cors', crossdomain: true }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + `task/${taskId}/checklist`;

        if (window.navigator.onLine) {
            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.post(url, body, config)
                .then((result) => {
                    setTitle('');
                    var newArr = [...data];
                    newArr.push(result.data);
                    setData(newArr)
                    global.dispatch({ type: 'create-task-checklist', payload: result.data });
                    setDeleteConfirmOpen(false);
                }).catch((error) => {
                    error = { ...error };
                    const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: null }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });
                });
        } else {
            global.dispatch({ type: 'create-task-checklist', payload: body })
        }
    }

    const handleRemoveChecklist = (checklistId) => {
        const config = { mode: 'no-cors', crossdomain: true }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + `task/${taskId}/checklist/${checklistId}`;

        if (window.navigator.onLine) {
            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.delete(url, {}, config)
                .then((result) => {
                    var newArr = data.filter((item) => {
                        if (item.id != checklistId) return item
                    });
                    setData(newArr)
                    global.dispatch({ type: 'remove-checklist', payload: checklistId });
                }).catch((error) => {
                    error = { ...error };
                    const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: null }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });
                });
        } else {
            global.dispatch({ type: 'remove-checklist', payload: checklistId });
        }
    }

    const CreateChecklistForm = (isEdit, projectId, listId, taskId, title) => {
        if (isEdit) {
            return (
                <Grid xl={12} md={12} sm={12} xs={12} item>
                    <Grid container>
                        <Grid item xl={12} md={12} sm={12} xs={12} >
                            <TextField variant="standard" onChange={(e) => setTitle(e.target.value)} placeholder="Type new checklist title" />
                            <Button onClick={handleCreateChecklist}>Create</Button>
                        </Grid>
                        <Grid item xl={12} md={12} sm={12} xs={12} >
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    renderInput={(params) => (
                                        <TextField {...params} margin="normal" variant="standard" />
                                    )}
                                    value={deadline}
                                    onChange={(newValue) => {
                                        setDeadline(newValue);
                                    }}
                                    ampm={false}
                                    format="YYYY-MM-DD HH:mm"
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </Grid >
            );
        }
    }

    const showActionButton = (isEdit, checklistId) => {
        if (isEdit) {
            return (
                <React.Fragment>
                    {/* 
                    <IconButton aria-label="Coments">
                        <CommentIcon fontSize="small" />
                    </IconButton>
                    <IconButton aria-label="Members">
                        <PeopleIcon fontSize="small" />
                    </IconButton>
                    <IconButton aria-label="DueDate">
                        <EventNoteRoundedIcon fontSize="small" />
                    </IconButton> 
                    */}
                    <IconButton aria-label="Delete" onClick={() => setDeleteConfirmOpen(true)}>
                        <CancelRoundedIcon fontSize="small" />
                    </IconButton>
                    <DeleteConfirmDialog
                        open={deleteConfirmOpen}
                        handleClose={() => setDeleteConfirmOpen(false)}
                        handleConfirm={() => handleRemoveChecklist(checklistId)}></DeleteConfirmDialog>
                </React.Fragment>
            )
        }
    }


    return (
        <React.Fragment>
            <Grid container>
                <Typography>Checklist : </Typography>
                {CreateChecklistForm(isEditing, projectId, listId, taskId, title)}
            </Grid>
            <List className={classes.root} dense={true}>
                {data.map((item) => {
                    return (
                        <ListItem size="small" key={Number(item.id)} dense={true}>
                            <Grid container>
                                <Grid item xl={6} md={6} sm={12} xs={12}>
                                    <FormControlLabel
                                        onChange={() => { handleToggleChecklist(item.id); console.log(item); }}
                                        control={
                                            <Checkbox
                                                checked={item.isChecked}
                                                inputProps={{ 'aria-labelledby': item.id }}
                                                fontSize="small"
                                            />
                                        }
                                        label={item.title}
                                    /><br />Deadline : {item.deadline ? moment(item.deadline).format('DD MMM YYYY hh:mm') : ''}
                                </Grid>
                                <Grid item xl={6} md={6} sm={12} xs={12}>
                                    <ListItemSecondaryAction>
                                        {showActionButton(isEditing, item.id)}
                                    </ListItemSecondaryAction>
                                </Grid>
                            </Grid>
                        </ListItem>
                    )
                })}
            </List >
        </React.Fragment>
    );
}

const DeleteConfirmDialog = (props) => {
    const open = props.open;
    const handleClose = props.handleClose;
    const handleConfirm = props.handleConfirm;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle style={{ cursor: 'move' }}>Are you sure you want to delete this?</DialogTitle>
            <DialogContent>
                <DialogContentText>Data will be deleted permanently</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose} color="primary">Cancel</Button>
                <Button onClick={handleConfirm} color="primary"> Confirm </Button>
            </DialogActions>
        </Dialog>
    );
}
export default memo(CheckList);