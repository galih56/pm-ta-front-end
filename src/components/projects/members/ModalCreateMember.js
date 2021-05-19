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
import SelectRole from '../../widgets/SelectRole';

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

export default function ModalCreateMember(props) {
    var { open, projectId, exceptedUsers,onCreate } = props;
    var closeModal = props.handleClose;
    const history = useHistory();
    const [newMembers, setNewMembers] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [roles, setRoles] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const global = useContext(UserContext);

    const getRoles = () => {
        const config = { mode: 'no-cors', crossdomain: true, }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + 'memberrole';
        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.get(url, {}, config)
            .then(result => setRoles(result.data)).catch((error) => {
                const payload = { error: error, snackbar: null, dispatch: global.dispatch, history: null }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
        console.log('getRoles')
    }

    useEffect(() => {
        getRoles();
    }, [open]);

    const handleSnackbar = (message, variant) => enqueueSnackbar(message, { variant });

    const submitData = () => {
        if (!window.navigator.onLine) handleSnackbar(`You are currently offline`, 'warning');
        if (newMembers.length <= 0 || !selectedRole) setShowAlert(true);
        else setShowAlert(false);
        
        if (!showAlert) {
            const body = { projectId: projectId, members: newMembers, roleId: selectedRole }
            const config = { mode: 'no-cors', crossdomain: true }
            const url = process.env.REACT_APP_BACK_END_BASE_URL + 'member/';
            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.post(url, body, config)
                .then((result) => {
                    console.log('create members ',result.data)
                    // global.dispatch({ type: 'create-new-member', payload: result.data });
                    onCreate(result.data)
                    handleSnackbar(`New members successfuly created`, 'success');
                    setNewMembers([]);
                    closeModal();
                }).catch((error) => {
                    const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: history }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });
                });
        }
        
    }

    const checkIfAuthenticated = () => {
        if (global.state.authenticated === true) {
            return (
                <>
                    <DialogContent dividers>
                        <Grid container spacing={2} style={{ paddingLeft: 3, paddingRight: 3 }} >
                            {showValidation()}
                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                <UserSearchBar 
                                    onChange={(value) => setNewMembers(value)} 
                                    exceptedUsers={exceptedUsers.map(function(member){
                                        return {...member.user,role:member.role}
                                    })} />
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                <SelectRole onChange={(value) => setSelectedRole(value)} data={roles} />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={submitData} color="primary">Create</Button>
                    </DialogActions>
                </>
            )
        } else {
            return (
                <DialogContent dividers>
                    <Alert severity="warning">Your action requires authentication. Please sign in.</Alert>
                </DialogContent>
            )
        }
    }

    const showValidation = () => {
        if ((newMembers.length <= 0 || !selectedRole) && showAlert) {
            return (
                <Grid item lg={12} md={12} sm={12} xs={12} >
                    <Alert severity="warning" >Please fill all the required inputs</Alert>
                </Grid>
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
