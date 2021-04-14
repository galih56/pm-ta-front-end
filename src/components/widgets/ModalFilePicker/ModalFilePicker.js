import React, { useContext } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import UserContext from '../../../context/UserContext';
import CloseIcon from '@material-ui/icons/Close';
import Files from './../Files';
import 'fontsource-roboto';

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


export default function ModalChooseFile(props) {
    var {open,projectId,closeModal,onPick}=props;
    const global = useContext(UserContext);
    
    return (
        <Dialog aria-labelledby="Choose File" open={open} maxWidth='lg' fullWidth={true}>
            <DialogTitle onClose={
                () => {
                    closeModal(false);
                }} > Choose file </DialogTitle>
            <DialogContent>
                <Files projectId={projectId} onPick={onPick}/>
            </DialogContent>
        </Dialog>
    );
}
