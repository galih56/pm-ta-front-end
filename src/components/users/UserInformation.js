import React, { useState } from "react";
import { Paper, Grid, ListItem, Collapse } from '@material-ui/core/';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import UserTable from './UserTable';
import OccupationInformation from './../occupations/OccupationInformation';
import { makeStyles } from '@material-ui/core/styles';
import styleConfig from '../../layout/Theme';

const useStyles = makeStyles((theme) => (styleConfig(theme)));

const UserInformation = (props) => {
    const classes = useStyles();
    const [userTableOpen, setUserTableOpen] = useState(true);
    const [occupationTableOpen, setOccupationTableOpen] = useState(true);
    const handleUserTableOpen = () => setUserTableOpen(!userTableOpen);
    const handleOccupationTableOpen = () => setOccupationTableOpen(!occupationTableOpen);

    return (
        <React.Fragment>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <ListItem button dense font="small" onClick={handleUserTableOpen} style={{ paddingBottom: '1.2em' }}> {userTableOpen ? <ExpandLess /> : <ExpandMore />}Users</ListItem>
                    <Collapse in={userTableOpen} timeout="auto">
                        <UserTable />
                    </Collapse>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <ListItem button dense font="small" onClick={handleOccupationTableOpen} style={{ paddingBottom: '1.2em' }}> {occupationTableOpen ? <ExpandLess /> : <ExpandMore />}Occupations</ListItem>
                    <Collapse in={occupationTableOpen} timeout="auto">
                        <OccupationInformation />
                    </Collapse>
                </Paper>
            </Grid>
        </React.Fragment >
    )
};

export default UserInformation;
