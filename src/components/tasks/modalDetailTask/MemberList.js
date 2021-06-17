import {useState,useContext,useEffect} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import UserContext from '../../../context/UserContext';
import { makeStyles } from '@material-ui/core/styles';
import UserSearchBar from '../../widgets/UserSearchBar';
import axios from 'axios';
import {useSnackbar} from 'notistack'

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%', maxWidth: '36ch', backgroundColor: theme.palette.background.paper,
    },
    photoProfileBg: { backgroundColor: '#616161' }
}));

const findProjectMember=(userId=null,projectMembers=[])=>{
    var user=null;
    for (let i = 0; i < projectMembers.length; i++) {
        const member = projectMembers[i];
        if(member.id==userId){ user=member; break;}
    }
}

const MemberList=({isEdit,data,setData,detailProject})=>{
    const global = useContext(UserContext);
    const [members,setMembers]=useState([]);
    const [newMembers,setNewMembers]=useState([])
    const { enqueueSnackbar } = useSnackbar();
    const handleSnackbar = (message, variant) => enqueueSnackbar(message, { variant });
    const classes = useStyles();
    
    useEffect(()=>{
        setMembers(data.members);
    },[data.members])

    const addMembers = (body) => {
        const config = { mode: 'no-cors', crossdomain: true }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + `task-member`;
        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.post(url, body, config)
            .then((result) => {
                const payload = { projectId: data.projectId, listId: data.listId, data: data };
                setData({...data,members:[...data.members,...result.data]});
                global.dispatch({ type: 'store-detail-task', payload: payload });
                handleSnackbar(`Data has been updated`, 'success');
            }).catch((error) => {
                const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: null }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }
    
    const removeMember = (user) => {
        const config = { mode: 'no-cors', crossdomain: true }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + `task-member/${user.task_member_id}`;
        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.delete(url, {id:user.task_member_id}, config)
            .then((result) => {
                const payload = { projectId: data.projectId, listId: data.listId, data: data };
                setData({...data,complete:result.data.complete})
                global.dispatch({ type: 'store-detail-task', payload: payload });
                var newMemberList=members.filter(function(member){
                    if(member.task_member_id!=user.task_member_id) return member;
                });
                setMembers(newMemberList);
                setData({...data,members:newMemberList});
                handleSnackbar(`Data has been updated`, 'success');
            }).catch((error) => {
                const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: null }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }

    return(
        <>
        <Grid container>
         {isEdit?(
             <>
                 <Grid item lg={12} md={12} sm={12} xs={12} style={{marginTop:'0.5em'}}>
                    <Typography>Assigned to : </Typography>
                 </Grid>
                 <Grid item lg={12} md={12} sm={12} xs={12}>
                    <UserSearchBar 
                        detailProject={detailProject}
                        exceptedUsers={[...data.members,data.creator]} 
                        onChange={(users)=>{
                            setNewMembers(users);
                        }}
                    />
                 </Grid>
                 <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Button style={{float:'right'}} onClick={()=>{
                        addMembers( { taskId: data.id, users:newMembers });
                        }} color="primary" >Invite</Button>
                 </Grid>
            </>):(
                 <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Typography>Assigned to : </Typography>
                 </Grid>
                 )}
             </Grid>
            <List>
                {members.map((member)=>{
                    return(
                        <>
                            <ListItem alignItems="flex-start" key={member.id} >
                                <ListItemAvatar>
                                    {member.profilePicturePath?
                                    <Avatar alt={"Photo profile " + member.name} src={`${process.env.REACT_APP_BACK_END_BASE_URL}/${member.profilePicturePath}`}/>:
                                    <Avatar alt={"Photo profile " + member.name} className={classes.photoProfileBg}>{member.name.charAt(0).toUpperCase()}</Avatar>}
                                </ListItemAvatar>
                                <ListItemText
                                    primary={member.name}
                                    secondary={
                                        <>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                color="textPrimary"
                                            >
                                                {member.role.name}
                                            </Typography>
                                            <br/>
                                            {member.email}
                                        </>
                                    }

                                />
                                {isEdit?(<ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="Remove" onClick={()=>removeMember(member)}>
                                        <CancelIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>):<></>}
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </>
                    )
                })}
            </List>

        </>
    )
}
export default MemberList;