import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Dialog, IconButton, Typography, } from '@material-ui/core/';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
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

const DialogActions = withStyles((theme) => ({
    root: { margin: 0, padding: theme.spacing(1) },
}))(MuiDialogActions);

const useStyles = makeStyles((theme) => ({
    root: { display: 'flex', flexWrap: 'wrap' },
    margin: { margin: theme.spacing(1) },
    formControl: { minWidth: 120, },
    selectEmpty: { marginTop: theme.spacing(2), },
}));


export default function ModalCreateSubtask({open,handleClose,children}) {
    return (
        <Dialog aria-labelledby="Create a subtask" open={open}>
            <DialogTitle onClose={
                () => {
                    handleClose();
                }} > Create a new subtask </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </Dialog>
    );
}
