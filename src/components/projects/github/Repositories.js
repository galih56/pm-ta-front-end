import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import UserContext from '../../../context/UserContext';
import axios from 'axios';
import GithubLoginButton from './GithubLoginButton';

const Repositories = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const global = useContext(UserContext);
    let history = useHistory();

    const openModalCreateProject = () => setModalOpen(true);
    const getRepositories = () => {
        const config = { mode: 'no-cors', crossdomain: true, }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + 'user/' + global.state.id + '/project';
        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.get(url, {}, config)
            .then((result) => {
                global.dispatch({ type: 'store-projects', payload: result.data });
            }).catch((error) => {
                const payload = { error: error, snackbar: null, dispatch: global.dispatch, history: null }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }

    useEffect(() => {
        global.dispatch({ type: 'remember-authentication' });
        if (global.state.authenticated === true) getRepositories();
        else history.push('/auth');
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid item xl={12} md={12} sm={12} xs={12} >
               <GithubLoginButton/>
            </Grid>
        </Grid >
    );
}
export default Repositories;