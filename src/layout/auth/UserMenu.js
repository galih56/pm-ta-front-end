import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import { Menu, MenuItem, IconButton, Badge, ListItemText } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import UserContext from '../../context/UserContext';
import PersonIcon from '@material-ui/icons/Person';
import LogoutConfirmDialog from './LogoutConfirmDialog';

const StyledMenu = withStyles({
    paper: { border: '1px solid #d3d4d5' },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

const UserMenu = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openLogoutDialog, setLogoutDialog] = useState(false);
    const handleMenuOpen = (event) => { setAnchorEl(event.currentTarget); };
    const handleMenuClose = () => { setAnchorEl(null); };
    const handleLogoutDialogClose = () => { setLogoutDialog(false); };
    const global = useContext(UserContext);
    let history = useHistory();

    const handleHistory = (dest) => history.push(dest);

    useEffect(() => {
        global.dispatch({ type: 'check-authentication', payload: { history: history } });
    }, []);

    const checkRole = () => {
        if (global.state.occupation) return (
            <ListItemText>
                {global.state.username}
                <br />
                {global.state.email}
                <br />
                {global.state.occupation.name}
            </ListItemText>
        )
        else return (
            <ListItemText>
                {global.state.username}
                <br />
                {global.state.email}
            </ListItemText>
        )
    }

    return (
        <React.Fragment>
            <IconButton color="inherit" onClick={handleMenuOpen}>
                <Badge color="secondary"> <PersonIcon /> </Badge>
            </IconButton>
            <StyledMenu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <UserContext.Consumer>
                    {
                        () => {
                            // console.log('UserMenu : ', global.state, global.state.authenticated);
                            if (global.state.authenticated) {
                                return (
                                    <React.Fragment>
                                        <StyledMenuItem>
                                            {checkRole()}
                                        </StyledMenuItem>
                                        <StyledMenuItem onClick={() => { setLogoutDialog(true); }}>
                                            <ListItemText primary="Logout" />
                                        </StyledMenuItem>
                                        <LogoutConfirmDialog open={openLogoutDialog} handleDialogClose={handleLogoutDialogClose} handleHistory={handleHistory} />
                                    </React.Fragment>
                                )
                            } else {
                                return (
                                    <React.Fragment>
                                        <StyledMenuItem>
                                            <Link to='/auth' >
                                                <ListItemText primary="Login/Register" />
                                            </Link>
                                        </StyledMenuItem>
                                    </React.Fragment>
                                )
                            }
                        }
                    }
                </UserContext.Consumer>
            </StyledMenu>
        </React.Fragment>
    );
}
export default UserMenu;