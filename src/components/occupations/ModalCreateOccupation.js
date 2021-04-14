import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import 'fontsource-roboto';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Grid, Button, Dialog, IconButton, TextField } from '@material-ui/core/';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import UserContext from '../../context/UserContext';
import CloseIcon from '@material-ui/icons/Close';
import { useSnackbar } from 'notistack';
import OccupationSearchBar from './../widgets/OccupationSearchBar';

const styles = (theme) => ({
    root: { margin: 0, padding: theme.spacing(2) },
    closeButton: { position: 'absolute !important', right: theme.spacing(1), top: theme.spacing(1), color: theme.palette.grey[500], },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle className={classes.root} {...other}>
            <span style={{ marginRight: '2em' }}>{children}</span>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null
            }
        </MuiDialogTitle >
    );
});

const DialogContent = withStyles((theme) => ({
    root: { padding: theme.spacing(1) },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: { margin: 0, padding: theme.spacing(1) },
}))(MuiDialogActions);

const useStyles = makeStyles((theme) => ({
    root: { display: 'flex', flexWrap: 'wrap' },
    margin: { margin: theme.spacing(1) },
}));

export default function ModalCreateOccupation(props) {
    const classes = useStyles();
    var open = props.open;
    var closeModal = props.closeModal;
    const { enqueueSnackbar } = useSnackbar();

    const [name, setName] = useState('');
    const [children, setChildren] = useState('');
    const global = useContext(UserContext);
    const history = useHistory();

    const handleSnackbar = (message, variant) => enqueueSnackbar(message, { variant });
    const submitData = () => {
        const body = { name: name, children: children }
        const config = { mode: 'no-cors', crossdomain: true }
        if (!window.navigator.onLine) handleSnackbar(`You are currently offline`, 'warning');
        else {
            const url = process.env.REACT_APP_BACK_END_BASE_URL + 'occupation';
            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.post(url, body, config)
                .then((result) => {
                    setName('');
                    setChildren([]);
                    handleSnackbar(`A new occupation successfuly created`, 'success');
                    closeModal();
                    props.onCreate(result.data);
                }).catch((error) => {
                    const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: history }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });
                });
        }
    }
    const checkIfAuthenticated = () => {
        if (global.state.authenticated === true) {
            return (
                <React.Fragment>
                    <DialogContent dividers>
                        <Grid container spacing={2} style={{ paddingLeft: 3, paddingRight: 3 }} >
                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                <TextField
                                    variant="standard"
                                    label="Name : "
                                    placeholder="example : Administration System, CEO"
                                    className={classes.textfield}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{ width: '100%' }}
                                />
                                <OccupationSearchBar label={"Search lower occupations"} onChange={value => setChildren(value)} exceptedData={[]} defaultValue={[]} />
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
        <Dialog aria-labelledby="Create a occupation" open={open} className={classes.dialog}
            maxWidth={'md'} fullwidth={"true"}>
            <DialogTitle onClose={() => closeModal()}>Create a occupation</DialogTitle>
            { checkIfAuthenticated(global, classes)}
        </Dialog>
    );
}
