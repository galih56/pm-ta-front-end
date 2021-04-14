
import React, {memo } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core/';


const ModalDeleteConfirm = (props) => {
    const open = props.open;
    const handleClose = props.handleClose;
    const handleDelete = props.handleDelete;

    return (
        <Dialog open={open} onClose={handleClose} >
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent>
                <DialogContentText>Data will be deleted permanently.</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleDelete} variant='contained' color="primary"> Confirm </Button>
            </DialogActions>
        </Dialog>
    );
}
export default memo(ModalDeleteConfirm)