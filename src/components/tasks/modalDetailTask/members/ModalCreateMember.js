import 'fontsource-roboto';
import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Grid, Button, Dialog, IconButton, Typography, TextField, } from '@material-ui/core/';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import UserContext from '../../../context/UserContext';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import UserSearchBar from '../../widgets/UserSearchBar';
const styles = (theme) => ({
    root: { margin: 0, padding: theme.spacing(2) },
    closeButton: { position: 'absolute', right: theme.spacing(1), top: theme.spacing(1), color: theme.palette.grey[500], },
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


export default function ModalCreateMember(props) {
    const classes = useStyles();
    var open = props.open;
    var projectId = props.projectId;
    var closeModal = props.handleClose;
    const history = useHistory();
    const refreshData = props.handleRefreshData;
    const [newMembers, setnewMembers] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const global = useContext(UserContext);

    useEffect(() => {
        //componentDidMount
        return () => {
            // componentWillUnmount
        }
    }, []);

    const handleSnackbar = (message, variant) => enqueueSnackbar(message, { variant });

    const submitData = () => {
        if (!window.navigator.onLine) handleSnackbar(`You are currently offline`, 'warning');

        const body = { projectId: projectId, members: newMembers }
        const config = { mode: 'no-cors', crossdomain: true }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + 'member/';
        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.post(url, body, config)
            .then((result) => {
                if (result.status == 200) {
                    // global.dispatch({ type: 'create-new-member', payload: result.data });
                    handleSnackbar(`New members successfuly created`, 'success');
                }
                else handleSnackbar(`Error : status ${error.status}`, 'warning');
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
                                <UserSearchBar onChange={(value) => setnewMembers(value)} />
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
        <Dialog aria-labelledby="Create a new member" open={open} fullWidth={true} maxWidth={'md'}>
            <DialogTitle onClose={
                () => {
                    closeModal(false);
                }} > Create a new member </DialogTitle>
            {
                checkIfAuthenticated()
            }
        </Dialog>
    );
}
