import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import 'fontsource-roboto';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import UserContext from '../../context/UserContext';
import { DateTimePicker } from "@material-ui/pickers";
import CloseIcon from '@material-ui/icons/Close';
import { useSnackbar } from 'notistack';
import moment from 'moment';

const styles = (theme) => ({
    root: { margin: 0, padding: theme.spacing(2) },
    closeButton: { position: 'absolute !important', right: theme.spacing(1), top: theme.spacing(1), color: theme.palette.grey[500], },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
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
    root: { padding: theme.spacing(2) },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: { margin: 0, padding: theme.spacing(1) },
}))(MuiDialogActions);

const useStyles = makeStyles((theme) => ({
    root: { display: 'flex', flexWrap: 'wrap' },
    margin: { margin: theme.spacing(1) },
}));

export default function ModalCreateProject(props) {
    const classes = useStyles();
    var open = props.open;
    var closeModal = props.closeModal;
    const { enqueueSnackbar } = useSnackbar();

    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [estimationDeadline, setEstimationDeadline] = React.useState(null);
    const global = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        if (estimationDeadline === '') setEstimationDeadline(null);
    }, [estimationDeadline]);

    const handleSnackbar = (message, variant) => enqueueSnackbar(message, { variant });

    const submitData = () => {
        const body = {
            title: title,
            description: description,
            estimationDeadline: estimationDeadline,
            users_id: global.state.id,
        }
        const config = {
            mode: 'no-cors', crossdomain: true,
        }
        if (!window.navigator.onLine) {
            handleSnackbar(`You are currently offline`, 'warning');
        } else {
            const url = process.env.REACT_APP_BACK_END_BASE_URL + 'user/' + global.state.id + '/project';

            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.post(url, body, config)
                .then((result) => {
                    if (result.status === 200) {
                        global.dispatch({ type: 'create-new-project', payload: result.data })
                        setTitle('');
                        setDescription('');
                        handleSnackbar(`A new project successfuly created`, 'success');
                        closeModal();
                    }
                    else {
                        handleSnackbar(`Error : status ${result.status}`, 'warning');
                    }
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
                            <Grid item lg={6} md={6} sm={6} xs={12} >
                                <TextField variant="standard"
                                    label="Title : "
                                    placeholder="example : Project A"
                                    className={classes.textfield}
                                    onChange={(e) => setTitle(e.target.value) }
                                    style={{ width: '100%' }}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={12} >
                                <DateTimePicker
                                    label="Estimation Deadline : "
                                    format="YYYY-MM-DD HH:mm"
                                    value={estimationDeadline ? moment(estimationDeadline).format('YYYY-MM-DD HH:mm') : null}
                                    onChange={(value) => {
                                        setEstimationDeadline(moment(value).format('YYYY-MM-DD HH:mm'))
                                    }}
                                    ampm={false}
                                    renderInput={(props) => <TextField {...props}  variant="standard"/>}
                                />
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TextField variant="standard"
                                    label="Description : "
                                    placeholder="Example : Project A is a cool project"
                                    className={classes.textfield}
                                    onChange={(e) => setDescription(e.target.value) }
                                    multiline
                                    style={{ width: '100%' }}
                                    rows={4}
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
        <Dialog aria-labelledby="Create a project" open={open}>
            <DialogTitle onClose={
                () => { closeModal(); }}>Create a Project</DialogTitle>
            {
                checkIfAuthenticated(global, classes)
            }
        </Dialog>
    );
}
