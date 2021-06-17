import React,{useContext,useEffect} from 'react';
import UserContext from './../../../context/UserContext'
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import GitHubIcon from '@material-ui/icons/GitHub';

// import LoginGithub from 'react-login-github';
// import { OauthReceiver, OauthSender } from 'react-oauth-flow';
// import GitHubLogin from 'react-github-login';

const GithubLoginButton=()=>{
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const global=useContext(UserContext);
    const snackbar = (message, variant) => enqueueSnackbar(message, { variant });
    
    const getAccessToken = () => {
        const body = {
            client_id: process.env.REACT_APP_GITHUB_API_CLIENT_ID,
            client_secret: process.env.REACT_APP_GITHUB_API_SECRET,
            code: global.state.githubAuth.code,
        }
        
        const url = `${process.env.REACT_APP_BACK_END_BASE_URL}get-github-access-token`;
        axios.post(url, body)
            .then((result) => {
                global.dispatch({type: 'store-github-auth',payload:{
                    code:body.code,
                    ...result.data
                }})
            }).catch((error) => {
                console.log('getAccessToken : ',error)
            });
    };

    const getGithubUserInfo=()=>{
        const config = { mode: 'no-cors', crossdomain: true, }
        const url = 'https://api.github.com/user';
        axios.defaults.headers.common['Authorization'] = 'Bearer '+global.state.githubAuth.access_token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.get(url, {}, config)
            .then((result) => {
                global.dispatch({
                    type: 'store-github-auth',
                    payload:{
                        ...result.data,
                        authenticated:true,
                        access_token:global.state.githubAuth.access_token,
                        code:global.state.githubAuth.code
                    }
                })
            }).catch((error) => {
                console.log('getGithubUserInfo : ',error)
                if(error.status==401) global.dispatch({ type: 'store-github-auth', payload: { githubAuth:{ code:'',  authenticated:false,  access_token:'',  scope:null } } });
            });
    }
    useEffect(()=>{
        if(global.state.githubAuth){
            if(global.state.githubAuth.code) getAccessToken();
            else console.log('github code not found');
        }else console.log('githubAuth is null')

        if(global.state.githubAuth.access_token && !global.state.githubAuth.login){
            getGithubUserInfo();
        }
    },[]);
    
    return (
        <>
            {(()=>{
                if(global.state.githubAuth.login){
                    return(
                        <Button onClick={()=>{
                            global.dispatch({type:'remove-github-auth'})
                        }}>Disconnect from github</Button>
                    )
                }
                return(
                    <>
                        <a href={`https://github.com/login/oauth/authorize?scope=read:user,repo&client_id=${process.env.REACT_APP_GITHUB_API_CLIENT_ID}`}>
                    Connect to github</a>
                    </>            
                )
                
            })()}
        </>
    )
}

export default GithubLoginButton;