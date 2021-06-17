import React, { createContext } from 'react';

const initState = {
    token: '', authenticated: false,
    id: '', username: '', email: '', phoneNumber: '',
    profilePicturePath: '', occupations: null, projects: [], 
    delayedRequest: [], googleAuth: null, 
    githubAuth:{
        code:'',  authenticated:false,  access_token:'',  scope:null
    }, 
};

const getAuthDataFromStorage = () => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));
    if (!auth || !user) return initState;
    const data = { ...auth, ...user };
    return data;
}

const storeAuthData = (payload) => {
    const auth = { token: payload.token, authenticated: true, };
    const user = {
        id: payload.user.id,
        username: payload.user.name,
        email: payload.user.email,
        last_login: payload.user.last_login,
        phoneNumber: payload.user.phoneNumber,
        profilePicturePath: payload.user.profilePicturePath,
        occupations: payload.user.occupations,
        projects: [], delayedRequest: [], googleAuth: null, 
        githubAuth:{
            code:'',  authenticated:false,  access_token:'',  scope:null
        }, 
    }
    localStorage.setItem("auth", JSON.stringify(auth));
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user };
}

const storeGoogleAuth = (payload, state) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));
    user.googleAuth = payload;
    localStorage.setItem("auth", JSON.stringify(auth));
    localStorage.setItem("user", JSON.stringify(user));
    const data = { ...auth, ...user };
    return data
}


const storeGithubAuth = (payload, state) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));
    user.githubAuth = payload;
    localStorage.setItem("auth", JSON.stringify(auth));
    localStorage.setItem("user", JSON.stringify(user));
    const data = { ...auth, ...user };
    return data
}

const removeGithubAuth=(payload,state)=>{
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));
    user.githubAuth = {
        code:'',  authenticated:false,  access_token:'',  scope:null
    };
    localStorage.setItem("auth", JSON.stringify(auth));
    localStorage.setItem("user", JSON.stringify(user));
    const data = { ...auth, ...user };
    return data
    
}
const resetState = () => {
    const auth = { token: '', authenticated: false };
    const user = {
        id: '', username: '', email: '',
        phoneNumber: '', profilePicturePath: '', occupation: null, 
        last_login: '', projects: [], delayedRequest: [],
        githubAuth:{
            code:'',  authenticated:false,  access_token:'',  scope:null
        }, 
    }
    localStorage.setItem("auth", JSON.stringify(auth));
    localStorage.setItem("user", JSON.stringify(user));
    return { ...auth, ...user }
}

const runDelayedHTTPRequest = () => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.delayedRequest) {

    }
}

const context = createContext();
export default context;
export { initState, resetState, getAuthDataFromStorage, storeAuthData, 
    runDelayedHTTPRequest, storeGoogleAuth,storeGithubAuth ,removeGithubAuth};