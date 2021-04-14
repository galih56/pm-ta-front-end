
import 'fontsource-roboto';
import React, { memo } from 'react';
import ModalDeleteConfirm from './ModalDeleteConfirm';
import { Button } from '@material-ui/core/';

const dialogActionButtons = ({ isEdit, saveChanges, setEditMode, deleteTask, deleteConfirmOpen, setDeleteConfirmOpen, closeModal }) => {
    if (isEdit) {
        return (
            <React.Fragment>
                <Button onClick={() => setEditMode(false)} color="primary"> Cancel </Button>
                <Button onClick={
                    () => { saveChanges(); setEditMode(false); }
                } variant="contained" color="primary"> Save</Button>
                <Button onClick={
                    () => { setDeleteConfirmOpen(true); }
                } variant="contained" color="secondary">Delete</Button>
                <ModalDeleteConfirm
                    open={deleteConfirmOpen}
                    handleDelete={() => { deleteTask(); setDeleteConfirmOpen(false); closeModal(); }}
                    handleClose={() => { setDeleteConfirmOpen(false); closeModal(); }}>
                </ModalDeleteConfirm>
            </React.Fragment>
        )
    } else {
        return (
            <React.Fragment>
                <Button onClick={() => setEditMode(true)} color="primary">Edit</Button>
            </React.Fragment>
        )
    }
}
export default memo(dialogActionButtons)