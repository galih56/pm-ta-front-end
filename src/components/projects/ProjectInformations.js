import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import UserContext from '../../context/UserContext';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import moment from 'moment';
import MobileDateRangePicker from '@material-ui/lab/MobileDateRangePicker';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';

const ProjectInfo = (props) => {
    const global = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const [isEditing, setIsEditing] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);
    const [detailProject, setDetailProject] = useState({ 
        id: null, title: '', description: '', columns: [], 
        createdAt: '', updatedAt: '', start:null, end:null,
        actualStart: null,actualEnd: null 
    });
    
    useEffect(() => {
        setDetailProject(props.detailProject);
    }, [props.detailProject])

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    let history = useHistory();

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
                    setIsEditing(false)
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
        try {
            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.delete(url, {}, config)
                .then((result) => {
                    global.dispatch({ type: 'remove-project', payload: projectId });
                    handleSnackbar(`Data has been deleted successfuly`, 'success');
                    history.push('/');
                }).catch((error) => {
                    const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: history }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });
                });
        }
        catch (error) {
            handleSnackbar('Failed to send request');
        }
    }

    const checkIfEditing = (isEdit) => {
        if (isEdit) {
            return (
                <React.Fragment>
                    <Grid item xl={5} md={5} sm={5} xs={12} style={{ padding: '1em' }}>
                        <TextField
                            label="Title : "
                            value={detailProject.title}
                            onChange={(e) => {
                                setDetailProject({ ...detailProject, title: e.target.value })
                            }}
                            style={{ width: '90%' }}
                            variant="standard" 
                        />
                    </Grid>
                    <Grid item lg={7} md={7} sm={7} xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <MobileDateRangePicker
                                required
                                startText="Actual Start : "
                                endText="Actual End : "
                                value={dateRange}
                                onChange={(newValue) => {
                                    var start= newValue[0];
                                    var end= newValue[1];
                                    setDateRange(newValue)
                                    if(start){
                                        start=moment(newValue[0]).format('YYYY-MM-DD HH:mm:ss'); 
                                        setDetailProject({ ...detailProject, actualStart : start })
                                    }
                                    if(end){ 
                                        end=moment(newValue[1]).format('YYYY-MM-DD HH:mm:ss');
                                        setDetailProject({ ...detailProject, actualEnd : end })
                                    }
                                }}
                                renderInput={(startProps, endProps) => (
                                <>
                                    <TextField {...startProps} variant="standard" required />
                                    <Box sx={{ mx: 2 }}> to </Box>
                                    <TextField {...endProps}  variant="standard"  required/>
                                </>
                                )}
                            />
                        </LocalizationProvider>  
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
                        {detailProject.start ? (
                                <Typography variant="body1" >Start : {moment(detailProject.start).format('YYYY-MM-DD HH:mm') }</Typography>
                            ): null} 
                        {detailProject.end ? (
                                <Typography variant="body1" >End : {moment(detailProject.end).format('YYYY-MM-DD HH:mm') }</Typography>
                            ): null} 
                        {detailProject.actualStart ? (
                                <Typography variant="body1" >Actual Start : {moment(detailProject.actualStart).format('YYYY-MM-DD HH:mm') }</Typography>
                            ): null}
                        {detailProject.actualEnd ? (
                                <Typography variant="body1" >Actual End : {moment(detailProject.actualEnd).format('YYYY-MM-DD HH:mm') }</Typography>
                            ): null}
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