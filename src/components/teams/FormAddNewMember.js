import React,{useState,useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import { useSnackbar } from 'notistack';
import UserContext from '../../context/UserContext';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Dialog, IconButton, Typography, } from '@material-ui/core/';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import UserSearchBar from '../widgets/UserSearchBar';

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

const FormAddNewMember=({teamId,open,closeModal,onCreate})=>{
    const global=useContext(UserContext);
    const [users,setUsers]=useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const snackbar = (message, variant) =>  enqueueSnackbar(message, { variant });

    const formCreateOnSubmit=()=>{
        const body = { teamId:teamId, users: users }
        const config = { mode: 'no-cors', crossdomain: true }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + `team/${teamId}`;
        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.post(url, body, config)
            .then((result) => {
                onCreate(result.data);
                snackbar(`A new list successfully created`, 'success');
            }).catch((error) => {
                const payload = { error: error, snackbar: snackbar, dispatch: global.dispatch, history: null }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }

    return(
        <Dialog aria-labelledby="Create a member" open={open} fullWidth={true} maxWidth="xs">
            <DialogTitle onClose={
                () => {
                    closeModal();
                }} > Add new member </DialogTitle>
            <DialogContent dividers>
                <form onSubmit={(e)=>{
                        e.preventDefault();
                        formCreateOnSubmit();
                    }}>
                    <Grid  container spacing={2}>
                        <Grid lg={12} md={12} sm={12} xs={12} item>
                            <UserSearchBar 
                                exceptedUsers={[]} 
                                onChange={(values)=> setUsers(values.map((value)=>value.id))}
                            />
                        </Grid>
                        <Grid xs={12} sm={12} md={12} lg={12} lg={12} item>
                            <Button type="submit" variant="contained" color="primary">Add</Button>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default FormAddNewMember;