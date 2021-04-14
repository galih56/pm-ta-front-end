import React, { useState, useContext, useEffect, memo } from 'react';
import clsx from 'clsx'; import 'fontsource-roboto';
import Footer from './Footer'; import UserMenu from './auth/UserMenu';
import { BrowserRouter as Router, Route, Switch, withRouter, Redirect } from "react-router-dom";
import { MainListItems, SecondaryListItems } from './NavItems';
import { AppBar, List, Badge, Grid, Drawer, Divider, Container, Typography, IconButton, CssBaseline, Toolbar } from '@material-ui/core/';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'; import NotificationsIcon from '@material-ui/icons/Notifications'; import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import styleConfig from './Theme';
import UserContext from '../context/UserContext';

const useStyles = makeStyles((theme) => (styleConfig(theme)));

const Layout = (props) => {
    const classes = useStyles();
    const windowWidth = window.innerWidth;
    const [drawerOpen, setDrawerOpen] = useState(true);
    const global = useContext(UserContext);

    useEffect(() => {
        if (windowWidth <= 765) handleDrawerClose();
        global.dispatch({ type: 'remember-authentication' });
    }, [])
    
    const handleDrawerOpen = () => setDrawerOpen(true);

    const handleDrawerClose = () => setDrawerOpen(false);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Router>
                <AppBar position="absolute" className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}
                    style={{ zIndex: 701 }}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            className={clsx(classes.menuButton, drawerOpen && classes.menuButtonHidden)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>Pro-M</Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <UserMenu></UserMenu>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    style={{ zIndex: 700 }}
                    classes={{
                        paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose),
                    }}
                    open={drawerOpen} >
                    <div className={classes.toolbarIcon}>
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <List component="nav">
                        <MainListItems />
                    </List>
                    <Divider />
                    <List component="nav">
                        <SecondaryListItems />
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            {props.children}
                            <Footer />
                        </Grid>
                    </Container>
                </main>
            </Router>
        </div>
    )
};

export default memo(Layout);


