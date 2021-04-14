import React, { useContext, useState } from 'react';
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
import { useSnackbar } from 'notistack';
import UserSearchbar from './../widgets/UserSearchBar';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import TimePicker from '@material-ui/lab/TimePicker';
import moment from 'moment';
import Alert from '@material-ui/core/Alert';

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


export default function ModalCreateMeeting(props) {
    const classes = useStyles();
    var open = props.open;
    var projectId = props.projectId;
    var closeModal = props.handleClose;
    const history = useHistory();
    const refreshData = props.refreshDetailProject;
    const [title, setTitle] = useState('');
    const [date,setDate]=useState('');
    const [start, setStart] = useState(null);
    const [end,setEnd] = useState(null);
    const [timeRangeWarning,setTimeRangeWarning]=useState(false);
    const [members, setMembers] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const global = useContext(UserContext);

    const handleSnackbar = (message, variant) =>  enqueueSnackbar(message, { variant });

    const clearState=()=>{
        setTitle('');
        setStart('');
        setEnd('');
        setTimeRangeWarning(false);
        setMembers([]);
        closeModal();
    }

    const submitData = () => {
        if(!moment(start,'HH:mm:ss').isBefore(moment(end,'HH:mm:ss'))) {setTimeRangeWarning(true); return;}
        else setTimeRangeWarning(false);
        
        var datetime_start=moment(date).format('YYYY-MM-DD')+' '+moment(start).format('HH:mm:ss');
        var datetime_end=moment(date).format('YYYY-MM-DD')+' '+moment(end).format('HH:mm:ss');
        const body = {
            title: title,  start:datetime_start,  end:datetime_end,  projects_id: projectId,  
            members: members,  users_id: global.state.id
        }
        if (!window.navigator.onLine)  handleSnackbar(`You are currently offline`, 'warning');
        const config = { mode: 'no-cors', crossdomain: true }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + 'meeting/';

        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.post(url, body, config)
            .then((result) => {
                clearState();
                refreshData();
                // global.dispatch({ type: 'create-new-meeting', payload: result.data });
                handleSnackbar(`A new meeting successfuly created`, 'success');
            }).catch((error) => {
                const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: history }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }

    const checkIfAuthenticated = () => {
        if (global.state.authenticated === true) {
            return (
                <React.Fragment>
                    <DialogContent dividers >
                        <Grid container spacing={2} style={{ paddingLeft: 3, paddingRight: 3 }} >
                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                <TextField variant="standard"
                                    label="Title : "
                                    placeholder="example : Meeting X"
                                    className={classes.textfield}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{ width: '100%' }}
                                    required
                                />
                            </Grid>
                            <Grid item container spacing={2} lg={12} md={12} sm={12} xs={12} >
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Grid item lg={6} md={6} sm={12} xs={12} >
                                        <TextField
                                            onChange={(value)=>setDate(value.target.value)}
                                            style={{width:'100%'}}
                                            label="Date"
                                            type="date"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="standard"
                                            required
                                        />
                                    </Grid> 
                                    <Grid item container spacing={2}  lg={6} md={6} sm={12} xs={12} >
                                        <Grid item lg={6} md={6} sm={6} xs={6} >
                                            <TimePicker
                                                onChange={value=> setStart(value)} 
                                                value={start}
                                                label="Start"
                                                variant="standard"
                                                InputLabelProps={{ shrink: true }}
                                                inputProps={{  step: 300 }}
                                                renderInput={(params) => <TextField {...params}  variant={'standard'}/>}
                                                ampm={false}
                                                required
                                            />
                                        </Grid> 
                                        <Grid item lg={6} md={6} sm={6} xs={6} >
                                            <TimePicker
                                                    value={end}
                                                    label="End"
                                                    variant="standard"
                                                    onChange={value=>setEnd(value)}
                                                    InputLabelProps={{ shrink: true }}
                                                    inputProps={{  step: 300 }}
                                                    renderInput={(params) => <TextField {...params}  variant={'standard'}/>}
                                                    ampm={false}
                                                    required
                                                />
                                        </Grid> 
                                    </Grid>
                                </LocalizationProvider>
                            </Grid> 
                            <Grid item  lg={12} md={12} sm={12} xs={12} >
                                <UserSearchbar onChange={(value) => setMembers(value)} exceptedUsers={[]}/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button type={'submit'} color="primary">Create</Button>
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
        <Dialog aria-labelledby="Create a meeting" open={open} component="form" 
                onSubmit={(e) => { 
                    e.preventDefault(); 
                    submitData();
                }}>
            <DialogTitle onClose={
                () => {
                    closeModal(false);
                }} > Create a new meeting </DialogTitle>
            {timeRangeWarning? <Alert severity="warning">Start time must be earlier than end time</Alert>:null}
            {
                checkIfAuthenticated()
            }
        </Dialog>
    );
}
