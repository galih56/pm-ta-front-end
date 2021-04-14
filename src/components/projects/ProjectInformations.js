import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Button, Typography, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core/';
import { DateTimePicker } from "@material-ui/pickers";
import UserContext from '../../context/UserContext';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import moment from 'moment';

const ProjectInfo = (props) => {
    const global = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const [isEditing, setIsEditing] = useState(false);
    const [detailProject, setDetailProject] = useState({ id: null, title: '', description: '', columns: [], createdAt: '', updatedAt: '', estimationDeadline: null });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    let history = useHistory();

    useEffect(() => {
        setDetailProject(props.detailProject);
    }, [props.detailProject])

    const handleSnackbar = (message, variant) => enqueueSnackbar(message, { variant });

    const saveChanges = () => {
        const config = { mode: 'no-cors', crossdomain: true }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + 'project/' + detailProject.id;
        try {
            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.patch(url, detailProject, config)
                .then((result) => {
                    handleSnackbar(`Data has been changed`, 'success');
                }).catch((error) => {
                    const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: history }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });
                });
        }
        catch (error) {
            console.log(error)
            handleSnackbar(`Server Error`, 'error');
        }

        if (!window.navigator.onLine) {
            handleSnackbar(`You are currently offline`, 'warning');
            // handleStoreList(body); //Untuk offline mode
        }
    }

    const handleRemoveProject = (projectId) => {
        const config = { mode: 'no-cors', crossdomain: true }
        const url = `${process.env.REACT_APP_BACK_END_BASE_URL}project/${projectId}`;
        if (window.navigator.onLine) {
            try {
                axios.defaults.headers.common['Authorization'] = global.state.token;
                axios.defaults.headers.post['Content-Type'] = 'application/json';
                axios.delete(url, {}, config)
                    .then((result) => {
                        global.dispatch({ type: 'remove-project', payload: projectId });
                        handleSnackbar(`Data has been deleted successfuly`, 'success');
                        history.push('/project');
                    }).catch((error) => {
                        const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: history }
                        global.dispatch({ type: 'handle-fetch-error', payload: payload });
                    });
            }
            catch (error) {
                handleSnackbar('Failed to send request');
            }
        } else {
            //Store delayed request
            // global.dispatch({ type: 'remove-checklist', payload: checklistId });
        }
    }
    const checkIfEditing = (isEdit) => {
        if (isEdit) {
            return (
                <React.Fragment>
                    <Grid item xl={6} md={6} sm={6} xs={12} style={{ padding: '1em' }}>
                        <TextField
                            label="Title : "
                            value={detailProject.title}
                            onChange={(e) => {
                                setDetailProject({ ...detailProject, title: e.target.value })
                            }}
                            style={{ width: '90%' }}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12} style={{ padding: '1em' }}>
                        <DateTimePicker
                            variant="inline"
                            label="Estimation Deadline : "
                            value={detailProject.estimationDeadline ? moment(detailProject.estimationDeadline).format('YYYY-MM-DD HH:mm') : null}
                            format="YYYY-MM-DD HH:mm"
                            style={{ width: '75%' }}
                        />
                    </Grid>
                    <Grid item xl={12} md={12} sm={12} xs={12} style={{ padding: '1em' }}>
                        <Typography>Description : </Typography>
                        <TextField variant="standard" multiline rows={4}
                            style={{ width: '90%' }}
                            defaultValue={detailProject.description}
                            onChange={(e) => {
                                setDetailProject({ ...detailProject, description: e.target.value })
                            }} />
                    </Grid>
                    <Grid item container xl={8} md={8} sm={8} xs={8} style={{ padding: '1em' }}
                        justify="flex-start"
                        alignItems="baseline"
                    >
                        <Button onClick={() => { setIsEditing(false) }} style={{ marginRight: '1.5em' }}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={() => saveChanges()} style={{ marginRight: '3em' }}> Save </Button>
                    </Grid>
                    <Grid item container xl={4} md={4} sm={4} xs={4} style={{ padding: '1em' }}
                        justify="flex-end"
                        alignItems="baseline"
                    >
                        <Button variant="contained" color="secondary" onClick={() => setDeleteConfirmOpen(true)} > Delete </Button>
                    </Grid>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <Grid item xl={6} md={6} sm={6} xs={12} style={{ padding: '1em' }}>
                        <Typography variant="h5">{detailProject.title}</Typography>
                    </Grid>
                    <Grid item xl={6} md={6} sm={6} xs={12} style={{ padding: '1em' }}>
                        <Typography variant="body1" >Estimation Deadline : {detailProject.estimationDeadline ? moment(detailProject.estimationDeadline).format('YYYY-MM-DD HH:mm') : null}</Typography>
                    </Grid>
                    <Grid item xl={12} md={12} sm={12} xs={12} style={{ padding: '1em' }}>
                        <Typography variant="body1" >{detailProject.description}</Typography>
                    </Grid>
                    <Grid item xl={12} md={12} sm={12} xs={12} style={{ padding: '1em' }}>
                        <Button onClick={() => { setIsEditing(true) }} variant="contained" color="primary">Edit</Button>
                    </Grid>
                </React.Fragment>
            )
        }
    }
    return (
        <>
            <Grid container>
                {checkIfEditing(isEditing)}
            </Grid >
            <DeleteConfirmDialog
                open={deleteConfirmOpen}
                handleClose={() => { setDeleteConfirmOpen(false); }}
                handleConfirm={() => handleRemoveProject(detailProject.id)}></DeleteConfirmDialog>
        </ >
    )
}

const DeleteConfirmDialog = (props) => {
    const open = props.open;
    const handleClose = props.handleClose;
    const handleConfirm = props.handleConfirm;
    const global = useContext(UserContext);
    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle style={{ cursor: 'move' }}>Are you sure you want to delete this project?</DialogTitle>
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
export default ProjectInfo