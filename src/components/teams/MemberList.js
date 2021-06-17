import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Alert from '@material-ui/lab/Alert';
import FormAddNewMember from './FormAddNewMember';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
    root: { width: '100%', backgroundColor: theme.palette.background.paper, },
    inline: { display: 'inline', },
}));
const MemberList = ({teamId,data}) => {
    const classes = useStyles();
    const [openFormCreate,setOpenFormCreate]=useState(false);
    const [rows,setRows]=useState([])

    const removeMember=(member)=>{
        setRows(rows.filter((row)=>{
            if(row.id!=member.id) return row;
        }));
    }
    
    useEffect(()=> {
        setRows(data)
        console.log('memberlist : ',data);
    },[data])
    return (
        <React.Fragment>
            <Typography variant="h6">Members</Typography>
            <Button onClick={()=>setOpenFormCreate(true)}>Add a new member</Button>
            <FormAddNewMember open={openFormCreate} 
                teamId={teamId}
                closeModal={()=>setOpenFormCreate(false)}
                onCreate={(newMember)=>{
                    setRows([...rows,newMember])
                }}/>
            <List className={classes.root}>
                {rows.length?rows.map(function(member){
                    return(    
                        <>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    {member.profilePicturePath?
                                        <Avatar alt={"Photo profile " + member.name} src={`${process.env.REACT_APP_BACK_END_BASE_URL}/${member.profilePicturePath}`}/>:
                                        <Avatar alt={"Photo profile " + member.name} className={classes.photoProfileBg}>{member.name.charAt(0).toUpperCase()}</Avatar>}
                                </ListItemAvatar>
                                <ListItemText
                                    primary={member.name} 
                                    secondary={
                                        <React.Fragment>
                                            {member.occupation?(
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    className={classes.inline}
                                                    color="textPrimary"
                                                > {member.occupation.name}  </Typography>
                                            ):<></>}
                                            {member.email}
                                        </React.Fragment>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="Remove" onClick={()=>removeMember(member)}>
                                        <CancelIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </>
                   )
                }):(<Alert severity="info">Please add new member.</Alert>)}
            </List>
        </React.Fragment>
    );
}

export default MemberList;
