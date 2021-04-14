import React,{useContext} from 'react';
import UserContext from './../../../context/UserContext'
import { useHistory } from 'react-router-dom';
import GitHubLogin from 'react-github-login';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { OauthReceiver, OauthSender } from 'react-oauth-flow';

const GithubLoginButton=()=>{
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const global=useContext(UserContext);
    const snackbar = (message, variant) => enqueueSnackbar(message, { variant });
    const onSuccess = response => {
        const body = { 
            client_id: process.env.REACT_APP_GITHUB_API_CLIENT_ID, 
            client_secret: process.env.REACT_APP_GITHUB_API_SECRET, 
            code:response.code,
            redirect_uri:'http://localhost:1337/',
        }
        console.log(body);
        if (!window.navigator.onLine) snackbar(`You are currently offline`, 'warning');
        else {
            const url = `https://github.com/login/oauth/access_token?client_id=${body.client_id}`;
            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
            axios.post(url, body)
                .then((result) => {
                    console.log(result.data)
                }).catch((error) => {
                    const payload = { error: error, snackbar: snackbar, dispatch: global.dispatch, history: history }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });
                });
        }
    };
    const onFailure = response =>{
        console.log(response)
    };
    return (
        <GitHubLogin 
        clientId={process.env.REACT_APP_GITHUB_API_CLIENT_ID}
        clientSecret={process.env.REACT_APP_GITHUB_API_SECRET}
        redirectUri={`${process.env.REACT_APP_BACK_END_BASE_URL}github-oauth-callback`} //required, unless you want to get "code not found" error message
        onSuccess={onSuccess}
        onFailure={onFailure}/>
       
        /*
        <OauthReceiver
            authorizeUrl="https://github.com/login/oauth/authorize"
            clientId={process.env.REACT_APP_GITHUB_API_CLIENT_ID}
            clientSecret={process.env.REACT_APP_GITHUB_API_SECRET}
            onAuthSuccess={console.log}
            onAuthError={console.log}
            redirectUri="http:localhost:3000"
            render={({ url }) => <Button variant="primary">Connect to Github</Button>}
        />
        */
    )
}

export default GithubLoginButton;