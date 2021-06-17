import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid, List, ListItem, ListItemSecondaryAction,
    IconButton, Typography, Button,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core';
import ModalCreateSubtask from '../../ModalCreateSubtask';
import FormCreateNewTask from '../../FormCreateNewTask';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import axios from 'axios';
import UserContext from '../../../../context/UserContext';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import ModalDetailSubtask from './ModalDetailSubtask';

const useStyles = makeStyles((theme) => ({
    root: { width: '100%', backgroundColor: theme.palette.background.paper, },
}));

const Subtasks = (props) => {
    var isEditing = props.isEdit;
    const classes = useStyles();
    const parentTask = props.detailTask.id;
    const {detailProject,onCreate}=props;
    const { listId } = props.detailTask;
    const global = useContext(UserContext);
    var initialStateNewTask= {
        id: '', title: '', description: '', projectId:detailProject.id,
        label: '', progress: 0, start: null, end: null, 
        actualStart: null, actualEnd: null, creator:null,
        tags: [],  creator: global.state.id,
        isSubtask:true, parentTask:parentTask
    }
    
    var initialStateClickedTask={
        id: null, projectId:detailProject.id ,  title: '', description: '', 
        label: '', complete: false, progress: 0
    }
    const [data, setData] = useState([]);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [showCreateSubtaskForm, setShowCreateSubtaskForm] = useState(false);
    const [newTask,setNewTask]=useState(initialStateNewTask);   
    // const [clickedTask,setClickedTask]=useState(initialStateClickedTask);
    // const [showDetail,setShowDetail]=useState(false);
    
    const { enqueueSnackbar } = useSnackbar();
    const handleSnackbar = (message, variant) => enqueueSnackbar(message, { variant });
    
    useEffect(() => {
        setData(props.detailTask.cards);
    }, [props.detailTask]);

    // const showModalDetailSubtask =() => {
    //     if (clickedTask.id && clickedTask.id!==null && clickedTask.id!=='' && showDetail == true) {
    //         return (
    //             <ModalDetailSubtask
    //                 open={showDetail}
    //                 closeModal={() => {
    //                     setClickedTask(initialStateClickedTask)
    //                     setShowDetail(false)
    //                 }}
    //                 detailProject={{
    //                     id:detailProject.id,
    //                     members:detailProject.members,
    //                 }}
    //                 initialState={clickedTask} 
    //                 onDelete={()=>{
    //                     var newArr = data.filter((item) => {
    //                         if (item.id != clickedTask.id) return item
    //                     });
    //                     setData(newArr)
    //                 }}
    //                 />
    //         )
    //     }
    // }

    const handleAddNewTask=()=>{
        if (window.navigator.onLine) {
            const config = { mode: 'no-cors', crossdomain: true }
            const url = process.env.REACT_APP_BACK_END_BASE_URL + `task`;
            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.post(url, newTask, config)
                .then((result) => {
                    setData([...data,result.data]);
                    setShowCreateSubtaskForm(false);
                    onCreate([...data,result.data])
                }).catch((error) => {
                    error = { ...error };
                    const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: null }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });
                });
        }
    }

    const handleRemoveSubtask = (subtaskId) => {
        const config = { mode: 'no-cors', crossdomain: true }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + `task/${subtaskId}`;

        if (window.navigator.onLine) {
            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.delete(url, {}, config)
                .then((result) => {
                    var newArr = data.filter((item) => {
                        if (item.id != subtaskId) return item
                    });
                    setData(newArr)
                }).catch((error) => {
                    error = { ...error };
                    const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: null }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });
                });
        } 
    }

    const buttonShowCreateSubtask = (isEdit) => {
        if (isEdit) {
            return (
                <Grid xl={12} md={12} sm={12} xs={12} item>
                    <Button onClick={()=>{
                        setShowCreateSubtaskForm(true);
                    }} color="primary">Create</Button>
                    {(()=>{
                        if(showCreateSubtaskForm){
                            return (
                                <ModalCreateSubtask 
                                open={showCreateSubtaskForm} 
                                handleClose={()=>{
                                    setShowCreateSubtaskForm(false);
                                }}>
                                    <FormCreateNewTask
                                        classes={classes} 
                                        newTask={newTask} 
                                        setNewTask={setNewTask}
                                        handleAddNewTask={handleAddNewTask}
                                        detailProject={detailProject}
                                        isSubtask={true}
                                    />
                                </ModalCreateSubtask>
                            )
                        }
                    })()}
                </Grid>
            );
        }
    }

    const showActionButton = (isEdit, subtaskId) => {
        if (isEdit) {
            return (
                <React.Fragment>
                    <IconButton aria-label="Delete" onClick={() => setDeleteConfirmOpen(true)}>
                        <CancelRoundedIcon fontSize="small" />
                    </IconButton>
                    <DeleteConfirmDialog
                        open={deleteConfirmOpen}
                        handleClose={() => setDeleteConfirmOpen(false)}
                        handleConfirm={() => handleRemoveSubtask(subtaskId)}></DeleteConfirmDialog>
                </React.Fragment>
            )
        }
    }


    return (
        <React.Fragment>
            <Grid container>
                <Typography>Subtasks : </Typography>
                {buttonShowCreateSubtask(isEditing)}
            </Grid>
            <List className={classes.root} dense={true}>
                {data.map((item) => {
                    return (
                        <ListItem size="small" key={Number(item.id)} dense={true}
                        >
                            <Grid container>
                                <Grid item xl={6} md={6} sm={12} xs={12} 
                                    style={{cursor:'pointer'}}
                                    onClick={()=>{
                                        console.log(item)
                                        // setShowDetail(true) 
                                        // setClickedTask(item);
                                    }}
                                >
                                    <span  > 
                                        {item.title} ({item.progress}%)
                                        <br />Start : {item.end ? moment(item.end).format('DD MMM YYYY hh:mm') : ''}
                                        <br />End : {item.end ? moment(item.end).format('DD MMM YYYY hh:mm') : ''}
                                    </span>
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
            {/* {showModalDetailSubtask()} */}
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
export default Subtasks;