import 'fontsource-roboto';
import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from "react-router-dom";
import UserContext from '../../../context/UserContext';
import { withStyles } from '@material-ui/core/styles';
import { Dialog, IconButton, Typography } from '@material-ui/core/';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import DialogActionButtons from './DialogActionButtons';
import EditForm from './EditForm';

// https://stackoverflow.com/questions/35352638/react-how-to-get-parameter-value-from-query-string
const styles = (theme) => ({
    root: { margin: 0, padding: theme.spacing(2), },
    closeButton: { position: 'absolute !important', right: theme.spacing(1), top: theme.spacing(1), color: theme.palette.grey[500], },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle className={classes.root} {...other}>
            <Typography  variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: { padding: theme.spacing(2) },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: { margin: 0, padding: theme.spacing(1) }
}))(MuiDialogActions);

export default function ModalDetailOccupation(props) {
    const open = props.open;
    const closeModal = props.closeModal;
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const global = useContext(UserContext);
    const history = useHistory();
    const [data, setData] = useState({ id: null, name: '', color: '', bgColor: '', parents: [], children: [], root: false, isHighlight: false });
    const [isEditing, setIsEditing] = useState(false);
    const handleEditingMode = (bool = false) => setIsEditing(bool);

    const { enqueueSnackbar } = useSnackbar();
    const handleSnackbar = (message, variant) => enqueueSnackbar(message, { variant });

    useEffect(() => {
        setData(props.initialState);
    }, [props.initialState]);

    const saveChanges = () => {
        let body = data;
        if (window.navigator.onLine) {
            const config = { mode: 'no-cors', crossdomain: true }
            const url = process.env.REACT_APP_BACK_END_BASE_URL + `occupation/${props.initialState.id}`;
            try {
                axios.defaults.headers.common['Authorization'] = global.state.token;
                axios.defaults.headers.post['Content-Type'] = 'application/json';
                axios.patch(url, body, config)
                    .then((result) => {
                        handleSnackbar(`Data has been updated`, 'success');
                        props.onUpdate(result.data);
                    }).catch((error) => {
                        const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: history }
                        global.dispatch({ type: 'handle-fetch-error', payload: payload });
                    });
            } catch (error) {
                handleSnackbar('Failed to send request', 'error');
            }
        }
    }

    const deleteOccupation = () => {
        if (window.navigator.onLine) {
            const config = { mode: 'no-cors', crossdomain: true }
            const url = process.env.REACT_APP_BACK_END_BASE_URL + `occupation/${data.id}`;
            try {
                axios.defaults.headers.common['Authorization'] = global.state.token;
                axios.defaults.headers.post['Content-Type'] = 'application/json';
                axios.delete(url, {}, config)
                    .then((result) => {
                        handleSnackbar(`Data has been deleted`, 'success');
                        props.onDelete(data);
                    }).catch((error) => {
                        const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: history }
                        global.dispatch({ type: 'handle-fetch-error', payload: payload });
                    });
            } catch (error) {
                handleSnackbar('Failed to send request', 'error')
            }
        }
    }

    return (
        <Dialog onClose={closeModal} open={open} maxWidth={'lg'} fullwidth={"true"}>
            <DialogTitle onClose={closeModal}>Occupation</DialogTitle>
            <DialogContent dividers>
                <EditForm isEdit={isEditing} data={data} setData={setData}> </EditForm>
            </DialogContent>
            <DialogActions>
                <DialogActionButtons
                    isEdit={isEditing}
                    saveChanges={saveChanges}
                    setEditMode={handleEditingMode}
                    deleteOccupation={deleteOccupation}
                    deleteConfirmOpen={deleteConfirmOpen}
                    setDeleteConfirmOpen={setDeleteConfirmOpen}
                    closeModal={closeModal}
                > </DialogActionButtons>
            </DialogActions>
        </Dialog>
    );
}
