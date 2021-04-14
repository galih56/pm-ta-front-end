import React, { useState, useEffect } from 'react';
import useGlobalState from './../../hooks/GlobalState';
import { useHistory, useLocation } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Login from './Login';
import Register from './Register';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box p={3}>{children}</Box>
            )}
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: { flexGrow: 1, backgroundColor: theme.palette.background.paper, },
    paper: { marginTop: theme.spacing(8), display: 'flex', flexDirection: 'column', alignItems: 'center', },
    avatar: { margin: theme.spacing(1), marginTop: '1em', backgroundColor: theme.palette.secondary.main, },
    form: { width: '100%', /* Fix IE 11 issue.*/  marginTop: theme.spacing(1), },
    submit: { margin: theme.spacing(3, 0, 2), },
    container: { padding: theme.spacing(3) }
}));

const AuthPage = (props) => {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    let history = useHistory();
    let location = useLocation();
    let global = useGlobalState();
    const handleChange = (event, newValue) => setValue(newValue);

    useEffect(() => {
        if (global.state.authenticated === true) {
            if (location.state) {
                if (location.state.previous) history.push(location.state.previous);
                else history.push('/');
            } else {
                history.push('/');
            }
        }
    }, [])

    return (
        <React.Fragment>
            <Dialog
                fullScreen
                open={true}
                aria-labelledby="Login Dialog"
            >
                <DialogTitle>{"Sign In"}</DialogTitle>
                <DialogContent>
                    <Container component="main" className={classes.container} >
                        <CssBaseline />
                        <div className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Tabs value={value} onChange={handleChange} aria-label="Authentication Page">
                                <Tab label="Login" {...a11yProps(0)} />
                                <Tab label="Register" {...a11yProps(1)} />
                            </Tabs>
                            <TabPanel value={value} index={0}>
                                <Login classes={classes}></Login>
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <Register classes={classes}></Register>
                            </TabPanel>
                        </div>
                    </Container>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
export default AuthPage;