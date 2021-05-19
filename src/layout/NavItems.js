import React, { useContext } from 'react';
import UserContext from '../context/UserContext';
import { Link } from "react-router-dom";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import AssignmentIcon from '@material-ui/icons/Assignment';


export const MainListItems = () => (
    <React.Fragment>
        <ListItem button component={Link} to="/projects" >
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText>
                Home
            </ListItemText>
        </ListItem>
        <ListItem button component={Link} to="/teams" >
            <ListItemIcon>
                <PeopleIcon />
            </ListItemIcon>
            <ListItemText> Teams </ListItemText>
        </ListItem>
        <ListItem button component={Link} to="/reports" >
            <ListItemIcon>
                <BarChartIcon />
            </ListItemIcon>
            <ListItemText>Reports
            </ListItemText>
        </ListItem>
    </React.Fragment >
);

export const SecondaryListItems = () => {
    let global = useContext(UserContext);
    const showRestrictedAccess = () => {
        return (
            <React.Fragment>
                <ListSubheader inset>Restricted Access</ListSubheader>
                <ListItem button component={Link} to="/users" >
                    <ListItemIcon>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText> Users </ListItemText>
                </ListItem>
            </React.Fragment>
        )
    }
    return (
        <React.Fragment>
            {showRestrictedAccess()}
            {/* 
            <ListSubheader inset>Saved reports</ListSubheader>
            <ListItem button component={Link} to="/my-tasks" >
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Last quarter" />
            </ListItem>
            <ListItem button component={Link} to="/my-tasks" >
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Year-end sale" />
            </ListItem> 
            */}
        </React.Fragment>
    )
};

{/* 
<ListItem button component={Link} to="/my-tasks" >
    <ListItemIcon>
        <LayersIcon />
    </ListItemIcon>
    <ListItemText>Integrations</ListItemText>
</ListItem>  
*/}