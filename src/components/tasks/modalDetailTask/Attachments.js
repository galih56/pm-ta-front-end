import React, { useState, useEffect, useContext, memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import { DropzoneDialog } from 'material-ui-dropzone';
import DescriptionIcon from '@material-ui/icons/Description';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import GoogleDriveButton from './GoogleDriveClient';
import ModalDeleteConfirm from './ModalDeleteConfirm';
import ModalFilePicker from './../../widgets/ModalFilePicker/ModalFilePicker';
import UserContext from '../../../context/UserContext';
import { useSnackbar } from 'notistack';
import axios from 'axios';

import PlayButtonIcon from './../../../assets/icons/play-button.svg';
const useStyles = makeStyles((theme) => ({
    root: { width: '100%', backgroundColor: theme.palette.background.paper, },
}));

const HandlePreviewIconDZ = (fileObject, classes) => {
    const { type } = fileObject.file
    const iconProps = { className: classes.image }

    if (type.startsWith("video/")) return <PlayButtonIcon {...iconProps} />

    switch (type) {
        case "application/msword":
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return <DescriptionIcon {...iconProps} />
        case "application/pdf":
            return <PictureAsPdfIcon {...iconProps} />
        default:
            return <AttachFileIcon {...iconProps} />
    }
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

const Attachments = (props) => {
    const classes = useStyles();
    var isEditing = props.isEdit;
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [chooseFileModalOpen, setChooseFileModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const { taskId, projectId, listId } = props;
    const global = useContext(UserContext);
    const [toBeDeletedFile, setToBeDeletedFile] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    var payload = { projectId: projectId, listId: listId, taskId: taskId }

    const { enqueueSnackbar } = useSnackbar();

    const handleSnackbar = (message, variant) => enqueueSnackbar(message, { variant });

    useEffect(() => {
        setData(props.data);
    }, [props.data])

    const showEditButtons = () => {
        if (isEditing) {
            return (
                <ListItem button>
                    <ListItemText primary={`Add new attachment`} />
                    <IconButton edge="end" aria-label="Choose existing file" onClick={()=>{
                        setChooseFileModalOpen(true)
                    }}>
                        <AttachFileIcon/>
                    </IconButton>
                    <IconButton edge="end" aria-label="Add new attachment" onClick={() => { setUploadModalOpen(true) }}>
                        <PublishRoundedIcon />
                    </IconButton>
                    <GoogleDriveButton payload={payload} snackbar={handleSnackbar}></GoogleDriveButton>
                    <DropzoneDialog
                        cancelButtonText={"Cancel"} submitButtonText={"Submit"}
                        maxFileSize={10000000} open={uploadModalOpen}
                        onClose={() => setUploadModalOpen(false)}
                        onSave={(files) => { onUploadFiles(files, global, handleSnackbar, setUploadModalOpen, payload, setData, data) }}
                        showFileNamesInPreview={true}
                        getPreviewIcon={HandlePreviewIconDZ}
                        showAlerts={false}
                    />
                </ListItem>
            )
        } else return (<></>)
    }
    return (
        <>
            <List className={classes.root}>
                {showEditButtons()}
                {data.map((item) => {
                    return (
                        <ListItem key={item.id} style={{ width: '100%' }}>
                            <ListItemText primary={`${item.name}`} />
                            <ListItemSecondaryAction>
                                <IconButton component="a" target="_blank" href={item.source=='upload'?`${process.env.REACT_APP_BACK_END_BASE_URL}files/${item.files_id}/download`:item.path}>
                                    <GetAppIcon fontSize="small" />
                                </IconButton >
                                {showDeleteButton(isEditing, item.id, setDeleteConfirmOpen, setToBeDeletedFile)}
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })}
            </List>                        
            {/* <PublishRoundedIcon /> */}
            <ModalFilePicker 
                open={chooseFileModalOpen} 
                projectId={projectId} 
                handleClose={()=> setChooseFileModalOpen(false) }
                onPick={(file)=> handleFilePick(file,global,handleSnackbar,setChooseFileModalOpen,payload,setData,data) }/>
            <ModalDeleteConfirm
                open={deleteConfirmOpen}
                handleClose={() => setDeleteConfirmOpen(false)}
                handleDelete={() => {
                    payload = { id: toBeDeletedFile, taskId: taskId, projectId: projectId, listId: listId }
                    deleteFile(global, payload, handleSnackbar, setDeleteConfirmOpen, setData, data);
                }} />
        </>
    );
}

const showDeleteButton = (isEdit, itemId, setDeleteConfirmOpen, setToBeDeletedFile) => {
    if (isEdit) {
        return (
            <IconButton edge="end" aria-label="Delete" onClick={() => { 
                setDeleteConfirmOpen(true); 
                setToBeDeletedFile(itemId) 
            }}>
                <DeleteIcon fontSize="small" />
            </IconButton >
        )
    } else return (<></>)
}

const onUploadFiles = async (attachments, global, snackbar, setOpen, payload, setData, data) => {
    if (!window.navigator.onLine) {
        snackbar(`You are currently offline`, 'warning');
    } else {
        attachments=attachments.map(async (attachment) => {
            var name=attachment.name; 
            var size=attachment.size;
            var type=attachment.type;
            var base64=await getBase64(attachment);
            return {
                name:name, size:size, type:type, base64:base64
            };
        });
        attachments=await Promise.all(attachments);

        var body={
            taskId:payload.taskId,
            userId:global.state.id,
            source:'upload',
            files:attachments
        }
        handleAddAttachment(body,  global, snackbar,setOpen, payload,  setData, data)
        
    }
}

const handleFilePick = async (file, global, snackbar,setOpen, payload,  setData, data) => {
    if (!window.navigator.onLine) {
        snackbar(`You are currently offline`, 'warning');
    } else {
        var body={
            taskId:payload.taskId,
            userId:global.state.id,
            source:'pick',
            fileId:file.id
        }
        handleAddAttachment(body,  global, snackbar,setOpen, payload,  setData, data)
        
    }
}

const handleAddAttachment=(body,  global, snackbar,setOpen, payload,  setData, data)=>{
    const url = process.env.REACT_APP_BACK_END_BASE_URL + 'task-attachments/';
    const config = { mode: 'no-cors', crossdomain: true, }
    axios.defaults.headers.common['Authorization'] = global.state.token;
    axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

    axios.post(url, body, config)
    .then((result) => {
        payload.data=result.data;
        setData([...data, ...payload.data]);
        setOpen(false);
        global.dispatch({ type: 'create-new-attachments', payload: payload })
    }).catch((error) => {
        const payload = { error: error, snackbar: snackbar, dispatch: global.dispatch, history: null }
        global.dispatch({ type: 'handle-fetch-error', payload: payload });
    });
}

const deleteFile = (global, payload, snackbar, setConfirmOpen, setData, data) => {
    const config = { mode: 'no-cors', crossdomain: true }
    const url = `${process.env.REACT_APP_BACK_END_BASE_URL}task-attachments/${payload.id}`;
    global.dispatch({ type: 'remove-attachment', payload: payload });
    axios.defaults.headers.common['Authorization'] = global.state.token;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.delete(url, {}, config)
        .then((result) => {
            snackbar(`Data has been deleted`, 'success');
            setConfirmOpen(false);
            setData(data.filter((item) => { if (item.id != payload.id) return item }));
            global.dispatch({ type: 'remove-attachment', payload: payload });
        }).catch((error) => {
            const payload = { error: error, snackbar: snackbar, dispatch: global.dispatch, history: null }
            global.dispatch({ type: 'handle-fetch-error', payload: payload });
        });
}
export default memo(Attachments);
