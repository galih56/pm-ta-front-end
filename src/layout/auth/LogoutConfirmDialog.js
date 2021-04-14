import React from 'react';
import useGlobalState from './../../hooks/GlobalState';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import { useSnackbar } from 'notistack';


export default function LogoutConfirmDialog(props) {
    const open = props.open;
    const handleClose = props.handleDialogClose;
    const handleHistory = props.handleHistory;
    const global = useGlobalState();
    const { enqueueSnackbar } = useSnackbar();
    const handleSnackbar = (message, variant) => enqueueSnackbar(message, { variant });

    const handleConfirm = () => {
        const config = {
            mode: 'no-cors', crossdomain: true, headers: { 'Content-Type': 'application/json' }
        }
        axios.post(process.env.REACT_APP_BACK_END_BASE_URL + 'logout', {}, config)
            .then((result) => {
                global.dispatch({ type: 'logout' });
                handleClose();
                handleHistory('/auth');
            }).catch((error) => {
                const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: null }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }

    return (
        <Dialog open={open} onClose={handleClose} >
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent>
                <DialogContentText>After you sign out. You can only receive notifications from Email.</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>Cancel</Button>
                <Button onClick={handleConfirm} variant="contained" color="primary"> Confirm </Button>
            </DialogActions>
        </Dialog>
    );
}