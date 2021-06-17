import React, { useState } from "react";
import {Link} from 'react-router-dom'
import { Paper, Grid, ListItem, Collapse } from '@material-ui/core/';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import UserTable from './UserTable';
import OccupationInformation from './../occupations/OccupationInformation';
import { makeStyles } from '@material-ui/core/styles';
import styleConfig from '../../layout/Theme';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => (styleConfig(theme)));

const UserInformation = (props) => {
    const classes = useStyles();
    const [userTableOpen, setUserTableOpen] = useState(true);
    const [occupationTableOpen, setOccupationTableOpen] = useState(true);
    const handleUserTableOpen = () => setUserTableOpen(!userTableOpen);
    const handleOccupationTableOpen = () => setOccupationTableOpen(!occupationTableOpen);

    return (
        <React.Fragment>
                <Grid lg={12} md={12} sm={12} xs={12} item>
                    <Paper className={classes.paper}>
                        <Grid container>
                            <Grid lg={12} md={12} sm={12} xs={12} item>
                                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="teams">
                                    <Button component={Link}  color="primary"
                                        to="/">
                                        Projects
                                    </Button>
                                    <Typography color="textPrimary">Users</Typography>
                                </Breadcrumbs>
                            </Grid>
                            <Grid lg={12} md={12} sm={12} xs={12} item>
                                <ListItem button dense font="small" onClick={handleUserTableOpen} style={{ paddingBottom: '1.2em' }}> {userTableOpen ? <ExpandLess /> : <ExpandMore />}Users</ListItem>
                                <Collapse in={userTableOpen} timeout="auto">
                                    <UserTable />
                                </Collapse>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid lg={12} md={12} sm={12} xs={12} item>
                    <Paper className={classes.paper}>
                        <ListItem button dense font="small" onClick={handleOccupationTableOpen} style={{ paddingBottom: '1.2em' }}> {occupationTableOpen ? <ExpandLess /> : <ExpandMore />}Occupations</ListItem>
                        <Collapse in={occupationTableOpen} timeout="auto">
                            <OccupationInformation />
                        </Collapse>
                    </Paper>
                </Grid>
        </React.Fragment>
    )
};

export default UserInformation;
