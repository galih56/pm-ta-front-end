import axios from 'axios';
import React, { useEffect, useContext, useState, useCallback } from 'react';
import { useHistory } from "react-router-dom";
import UserContext from '../../../../context/UserContext';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import DialogActionButtons from '../DialogActionButtons';
import TaskProgress from '../TaskProgress';
import EditForm from '../EditForm';
import 'fontsource-roboto';
import { useSnackbar } from 'notistack';

// https://stackoverflow.com/questions/35352638/react-how-to-get-parameter-value-from-query-string
const styles = (theme) => ({
    root: { margin: 0, padding: theme.spacing(2), },
    closeButton: { position: 'absolute !important', right: theme.spacing(1), top: theme.spacing(1), color: theme.palette.grey[500], },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: { padding: theme.spacing(2), },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: { margin: 0, padding: theme.spacing(1), },
}))(MuiDialogActions);

export default function ModalDetailSubtask(props) {
    const {taskId } = props.initialState;
    const open = props.open;
    const closeModal = props.closeModal;
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const global = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    
    const [data, setData] = useState({
        id: taskId, projectId: '', listId: '',
        title: '', description: '', label: '', complete: false, progress: 0,
        start:null,end:null,actualStart:null,actualEnd:null, startLabel:'',endLabel:'',
        createdAt: '', updatedAt: '', list: null, tags: [], members: [],
        cards: [], logs: [], comments: [], attachments: [],creator:null,isSubtask:true
    });

    const [isEditing, setIsEditing] = useState(false);
    const handleSnackbar = (message, variant) => enqueueSnackbar(message, { variant });
    const handleEditingMode = (bool = false) => setIsEditing(bool);

    const getDetailTask = useCallback(() => {
        if (window.navigator.onLine) {
            const config = { mode: 'no-cors', crossdomain: true, }
            const url = process.env.REACT_APP_BACK_END_BASE_URL + 'task/' + taskId;
            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.get(url, {}, config)
                .then((result) => {
                    setData({ ...data, ...result.data });
                    const payload = {data: result };
                    global.dispatch({ type: 'store-detail-task', payload: payload })
                }).catch((error) => {
                    const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: null }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });
                });
        } else handleSnackbar(`You are currently offline. Couldn't retrieve related data from local storage`, 'warning');
    }, [ taskId]);

    useEffect(() => {
        setTimeout(() => getDetailTask(), 100);
    }, [])

    useEffect(() => {
        if (data.complete == true) setData({ ...data, progress: 100 });
    }, [data.complete]);

    const saveChanges = () => {
        let body = data;
        if (window.navigator.onLine) {
            const config = { mode: 'no-cors', crossdomain: true }
            const url = process.env.REACT_APP_BACK_END_BASE_URL + `task/${data.id}`;
            try {
                axios.defaults.headers.common['Authorization'] = global.state.token;
                axios.defaults.headers.post['Content-Type'] = 'application/json';
                axios.patch(url, body, config)
                    .then((result) => {
                        const payload = {  data: data };
                        setData(result.data)
                        handleSnackbar(`Data has been updated`, 'success');
                    }).catch((error) => {
                        const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: history }
                        global.dispatch({ type: 'handle-fetch-error', payload: payload });
                    });
            } catch (error) {
                handleSnackbar('Failed to send request', 'error');
            }
        } else {

        }
    }

    const handleCompleteTask = (event) => {
        const body = { id: taskId, complete: event.target.checked };
        const config = { mode: 'no-cors', crossdomain: true }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + `task/${data.id}`;
        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.patch(url, body, config)
            .then((result) => {
                const payload = {  data: data };
                setData({...data,complete:result.data.complete})
                global.dispatch({ type: 'store-detail-task', payload: payload });
                handleSnackbar(`Data has been updated`, 'success');
            }).catch((error) => {
                const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: history }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }

    const deleteTask = () => {
        if (window.navigator.onLine) {
            const config = { mode: 'no-cors', crossdomain: true }
            const url = process.env.REACT_APP_BACK_END_BASE_URL + `task/${taskId}`;
            try {
                axios.defaults.headers.common['Authorization'] = global.state.token;
                axios.defaults.headers.post['Content-Type'] = 'application/json';
                axios.delete(url, {}, config)
                    .then((result) => {
                        global.dispatch({ type: 'remove-task', payload: data });
                        handleSnackbar(`Data has been deleted`, 'success');
                        if(props.onDelete)props.onDelete(data.list,taskId)
                    }).catch((error) => {
                        const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: history }
                        global.dispatch({ type: 'handle-fetch-error', payload: payload });
                    });
            } catch (error) {
                handleSnackbar('Failed to send request', 'error')
            }
        } else {
            global.dispatch({ type: 'remove-task', payload: data });
        }
    }
    
    return (
        <Dialog  aria-labelledby="Modal Task Detail" open={open} style={{ zIndex: '750' }}
            maxWidth={'lg'} fullwidth={"true"}>
            <DialogTitle onClose={() => {
                closeModal();
            }}>
                {data.title} {data.label ? `(${data.label})` : ''}
                <br/>
                {data.creator?<span style={{fontSize:'0.7em'}}>Created by : {data.creator.name}</span>:null}
                <br />
                <FormControlLabel
                    control={<Checkbox onChange={handleCompleteTask} fontSize="small" checked={data.complete} />}
                    label={`Complete`}
                />
                <TaskProgress value={data.progress}></TaskProgress>
            </DialogTitle>
            <DialogContent dividers>    
                <EditForm
                    isEdit={isEditing}
                    data={data}
                    setData={setData}
                    detailProject={props.detailProject}
                />
                <br/>
            </DialogContent>
            <DialogActions>
                <DialogActionButtons
                    isEdit={isEditing}
                    saveChanges={saveChanges}
                    setEditMode={handleEditingMode}
                    deleteTask={deleteTask}
                    deleteConfirmOpen={deleteConfirmOpen}
                    setDeleteConfirmOpen={setDeleteConfirmOpen}
                    closeModal={closeModal}
                > </DialogActionButtons>
            </DialogActions>
        </Dialog>
    );
}

