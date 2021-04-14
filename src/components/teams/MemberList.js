import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: { width: '100%', backgroundColor: theme.palette.background.paper, },
    inline: { display: 'inline', },
}));


var users = [
    {
        id: 1, username: 'Galih Indra W.',
        role: {
            id: 1,
            role_name: 'Project Manager'
        }
    },
    {
        id: 2, username: 'Tikus teman kucing',
        role: {
            id: 1,
            role_name: 'Programmer'
        }
    }
]

const MemberList = (props) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Typography variant="h6">Members</Typography>
            <List className={classes.root}>
                <ListItem alignItems="flex-start">
                    {/* <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar> */}
                    <ListItemText
                        primary="Brunch this weekend?"
                        secondary={
                            <React.Fragment>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.inline}
                                    color="textPrimary"
                                > Ali Connors  </Typography>
                                {" — I'll be in your neighborhood doing errands this…"}
                            </React.Fragment>
                        }
                    />
                </ListItem>
                <Divider variant="inset" component="li" />

            </List>
        </React.Fragment>
    );
}

export default MemberList;
