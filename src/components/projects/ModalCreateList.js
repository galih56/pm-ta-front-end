import React, { useEffect, useContext, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Grid, Button, Dialog, IconButton, Typography, TextField, } from '@material-ui/core/';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { useHistory } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import CloseIcon from '@material-ui/icons/Close';
import 'fontsource-roboto';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import { useSnackbar } from 'notistack';

const styles = (theme) => ({
    root: { margin: 0, padding: theme.spacing(2) },
    closeButton: { position: 'absolute !important', right: theme.spacing(1), top: theme.spacing(1), color: theme.palette.grey[500], },
});

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

const DialogActions = withStyles((theme) => ({
    root: { margin: 0, padding: theme.spacing(1) },
}))(MuiDialogActions);

const useStyles = makeStyles((theme) => ({
    root: { display: 'flex', flexWrap: 'wrap' },
    margin: { margin: theme.spacing(1) },
    formControl: { minWidth: 120, },
    selectEmpty: { marginTop: theme.spacing(2), },
}));


export default function ModalCreateList(props) {
    const classes = useStyles();
    var open = props.open;
    var projectId = props.projectId;
    var closeModal = props.handleClose;
    const history = useHistory();
    // const handleStoreList = props.handleStoreList; nanti dipakai waktu offline mode udah bisa
    const refreshData = props.refreshDetailProject;
    const [title, setTitle] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const global = useContext(UserContext);

    const handleSnackbar = (message, variant) =>  enqueueSnackbar(message, { variant });

    const submitData = () => {
        const body = {
            title: title,
            projects_id: projectId,
            cards: []
        }
        if (!window.navigator.onLine) {
            handleSnackbar(`You are currently offline`, 'warning');
        }
        const config = { mode: 'no-cors', crossdomain: true }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + 'list/';

        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.post(url, body, config)
            .then((result) => {
                setTitle('');
                closeModal();
                refreshData();
                global.dispatch({ type: 'create-new-list', payload: result.data });
                handleSnackbar(`A new list successfully created`, 'success');
            }).catch((error) => {
                const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: history }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }

    const checkIfAuthenticated = () => {
        if (global.state.authenticated === true) {
            return (
                <React.Fragment>
                    <DialogContent dividers>
                        <Grid container spacing={2} style={{ paddingLeft: 3, paddingRight: 3 }} >
                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                <TextField variant="standard"
                                    label="Title : "
                                    placeholder="example : List A"
                                    className={classes.textfield}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{ width: '100%' }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={submitData} color="primary">Create</Button>
                    </DialogActions>
                </React.Fragment>
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
        <Dialog aria-labelledby="Create a list" open={open}>
            <DialogTitle onClose={
                () => {
                    closeModal(false);
                }} > Create a new list </DialogTitle>
            {
                checkIfAuthenticated()
            }
        </Dialog>
    );
}
