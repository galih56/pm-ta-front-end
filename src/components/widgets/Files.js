import React, { useEffect, useState,memo } from 'react';
import useGlobalState from './../../hooks/GlobalState';
import { Link, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { red } from '@material-ui/core/colors';
import ExcelIcon from './../../assets/icons/excel.svg';
import MultipleImagesIcon from './../../assets/icons/multiple-images.svg';
import PDFIcon from './../../assets/icons/pdf.svg';
import TextIcon from './../../assets/icons/text.svg';
import WordIcon from './../../assets/icons/word.svg';
import ZipIcon from './../../assets/icons/zip.svg';
import FilesIcon from './../../assets/icons/files.svg';
import PlayButtonIcon from './../../assets/icons/play-button.svg';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import Alert from '@material-ui/core/Alert';

const useStyles = makeStyles((theme) => ({
    root: { maxWidth: 345 },
    media: {
        height: 0, paddingTop: '40%',  backgroundPosition: 'center', 
        backgroundSize: 'auto !important', marginTop: '0.5em', marginBottom: '0.5em',
    },
    expand: { transform: 'rotate(0deg)',  marginLeft: 'auto', 
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    avatar: { backgroundColor: red[500] },
}));

const CustomCard = ({ classes, file, handleDetailTaskOpen,handleDeleteModalOpen,setChoosenFileId,onPick}) => {
    const location = useLocation(); 
    const [anchorPopover, setAnchorPopover] = useState();
    const handleClick = (event) => setAnchorPopover(event.currentTarget);
    const handleClose = () => setAnchorPopover(null);

    const open = Boolean(anchorPopover);
    const id = open ? 'file-popover' : undefined;

    var file_url = process.env.REACT_APP_BACK_END_BASE_URL;
    if (file.source == 'upload') file_url += file.path
    if (file.source == 'google-drive') file_url = file.path;

    var srcCardMedia = null;
    srcCardMedia = file.type.split('/');
    switch (srcCardMedia[0]) {
        case 'image':
            srcCardMedia = MultipleImagesIcon;
            if (file.source == 'upload' || file.source == 'google-drive') srcCardMedia = file_url;
            break;
        case 'application':
            srcCardMedia = FilesIcon;
            if (srcCardMedia[1] == 'pdf') srcCardMedia = PDFIcon;
            if (srcCardMedia[1] == 'msword' || srcCardMedia[1] == 'vnd.openxmlformats-officedocument.wordprocessingml.document') srcCardMedia = WordIcon;
            if (srcCardMedia[1] == 'vnd.ms-excel' || srcCardMedia[1] == 'vnd.openxmlformats-officedocument.spreadsheetml.sheet') srcCardMedia = ExcelIcon;
            if (srcCardMedia[1] == 'zip' || srcCardMedia[1] == 'x-7z-compressed' || srcCardMedia[1] == 'vnd.rar') srcCardMedia = ZipIcon;
            break;
        case 'text':
            srcCardMedia = TextIcon;
            break;
        case 'video':
            srcCardMedia = PlayButtonIcon;
            break;
        case 'audio':
            srcCardMedia = PlayButtonIcon;
            break;
        default:
            srcCardMedia = FilesIcon;
            break;
    }
    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}> {file.user_name.charAt(0).toUpperCase()} </Avatar>
                }
                action={
                    <IconButton onClick={handleClick}>
                        <MoreVertIcon />
                    </IconButton>
                }
                title={file.file_name + ', Uploaded by : ' + file.user_name}
                subheader={moment(file.createdAt).format('MMMM Do YYYY, h:mm a')}
            />
            <Popover
                id={id} open={open} anchorEl={anchorPopover} onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}
                transformOrigin={{ vertical: 'top', horizontal: 'center'}}
            >
                <List dense={true}>
                    <ListItem button onClick={()=>onPick(file)}>
                        <ListItemIcon>
                            <AttachFileIcon />
                        </ListItemIcon>
                        <ListItemText primary="Pick" />
                    </ListItem> 
                </List>
            </Popover>
            <CardMedia className={classes.media} image={srcCardMedia} />
            <CardContent>
                <Typography variant="body1" color="textSecondary" component="p">
                    {(() => {
                        if(handleDetailTaskOpen){
                            let pathname = location.pathname;
                            let searchParams = new URLSearchParams(location.search);
                            searchParams.set('task_id', file.tasks_id);
                            return (<>
                                Task: <Link to={{ pathname: pathname, search: searchParams.toString() }}
                                    onClick={() => {
                                        handleDetailTaskOpen({ projectId: file.projects_id, listId: file.lists_id, taskId: file.tasks_id, open: true });
                                    }}>
                                    {file.task_title}
                                </Link>
                            </>)
                        }else{
                            return (<></>)
                        }
                    })()}
                </Typography>
            </CardContent>
        </Card>
    )
}
const Files = (props) => {
    let global = useGlobalState();
    const classes = useStyles();
    const { projectId, handleDetailTaskOpen,onPick} = props;
    const [files, setFiles] = useState([]);
    const [deleteModalOpen,setDeleteModalOpen]=useState(false);
    const [choosenFileId,setChoosenFileId]=useState(null);
    const handleDeleteModalClose=()=> setDeleteModalOpen(false);
    
    const { enqueueSnackbar } = useSnackbar();
    const handleSnackbar = (message, variant) => enqueueSnackbar(message, { variant });
    const getFiles = () => {
        if (window.navigator.onLine) {
            const config = { mode: 'no-cors', crossdomain: true }
            const url = process.env.REACT_APP_BACK_END_BASE_URL + 'project/' + projectId + '/files';
            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.get(url, {}, config)
                .then((result) => {
                    const data = result.data;
                    setFiles(data);
                }).catch((error) => {
                    const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: null }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });
                });
        } else {
            handleSnackbar(`You're currently offline. Please check your internet connection.`, 'warning');
        }
    }

    const handleDelete = (id) => {
        if (window.navigator.onLine) {
            const config = { mode: 'no-cors', crossdomain: true }
            const url = process.env.REACT_APP_BACK_END_BASE_URL + 'files/' + id;
            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.delete(url, {}, config)
                .then((result) => {
                    const data = result.data;
                    setChoosenFileId(null)
                }).catch((error) => {
                    const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: null }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });
                });
        } else {
            handleSnackbar(`You're currently offline. Please check your internet connection.`, 'warning');
        }
    }

    useEffect(() => {
        if (projectId) getFiles();
    }, [projectId])

    return (
        <Grid container spacing={2}>
            {(()=>{
                if(files.length){
                    return(
                        <>
                        {
                            files.map(file => (
                                <Grid item key={file.id}>
                                    <CustomCard 
                                        file={file} 
                                        classes={classes} 
                                        handleDetailTaskOpen={handleDetailTaskOpen} 
                                        handleDeleteModalOpen={setDeleteModalOpen} 
                                        setChoosenFileId={setChoosenFileId}
                                        onPick={onPick}
                                        />
                                </Grid>
                            ))
                        }
                        </>
                    )
                }else{
                    return(
                        <Grid xl={12} lg={12} sm={12} xs={12}>
                            <Alert severity="info" style={{margin:'1em',padding:'auto'}}>No files have been uploaded to this project yet</Alert>
                        </Grid>
                    )
                }
               
            })()}
            <ModalDeleteConfirm 
                open={deleteModalOpen} 
                handleClose={handleDeleteModalClose} 
                handleDelete={()=>handleDelete(choosenFileId)}/>
        </Grid>
    )
};

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
                <Button onClick={handleClose}> Cancel </Button>
                <Button onClick={handleDelete} variant='contained' color="primary"> Confirm </Button>
            </DialogActions>
        </Dialog>
    );
}
export default Files;