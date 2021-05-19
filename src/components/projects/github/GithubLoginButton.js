import React,{useContext,useEffect} from 'react';
import UserContext from './../../../context/UserContext'
import { useHistory } from 'react-router-dom';
import GitHubLogin from 'react-github-login';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useSnackbar } from 'notistack';
// import { OauthReceiver, OauthSender } from 'react-oauth-flow';
import GitHubIcon from '@material-ui/icons/GitHub';

// import LoginGithub from 'react-login-github';

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
        }

        const url = `https://github.com/login/oauth/access_token?client_id=${body.client_id}`;
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        axios.post(url, body)
            .then((result) => {
                console.log(result.data)
            }).catch((error) => {
                console.log(error)
            });
    };
    const onFailure = response =>{
        console.log(response)
    };

    const getAccessToken = () => {
        const body = {
            client_id: process.env.REACT_APP_GITHUB_API_CLIENT_ID,
            client_secret: process.env.REACT_APP_GITHUB_API_SECRET,
            code: global.state.githubAuth.code
          }
        console.log(body)
        const url = `https://github.com/login/oauth/access_token?`;
        axios.post(url, body)
            .then((result) => {
                console.log(result.data)
            }).catch((error) => {
                const payload = { error: error, snackbar: snackbar, dispatch: global.dispatch, history: history }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    };

    useEffect(()=>{
        if('code' in global.state.githubAuth){
            getAccessToken() 
        }else{
            console.log('github code not found')
        }
    },[])
    return (
        <>
            <a href={`https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env.REACT_APP_GITHUB_API_CLIENT_ID}`}>
            Connect to github</a>
            {/*         
            <GitHubLogin 
                clientId={process.env.REACT_APP_GITHUB_API_CLIENT_ID}
                clientSecret={process.env.REACT_APP_GITHUB_API_SECRET}
                redirectUri="localhost:1337/github-redirect"//required, {process.env.REACT_APP_FRONT_END_BASE_URL}  unless you want to get "code not found" error message
                onSuccess={onSuccess}
                onFailure={onFailure} 
                buttonText={"Connect with github"}/>
            <LoginGithub  
                clientId={process.env.REACT_APP_GITHUB_API_CLIENT_ID}
                redirectUri="localhost:1337/github-redirect"
                onSuccess={onSuccess}
                onFailure={console.log}/>
            <OauthReceiver
                authorizeUrl="https://github.com/login/oauth/authorize"
                clientId={process.env.REACT_APP_GITHUB_API_CLIENT_ID}
                clientSecret={process.env.REACT_APP_GITHUB_API_SECRET}
                onAuthSuccess={console.log}
                onAuthError={console.log}
                redirectUri="http:localhost:3000"
                render={({ url }) => <Button variant="primary">Connect to Github</Button>}
            /> */}
        </>
    )
}

export default GithubLoginButton;