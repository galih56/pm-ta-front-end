import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import 'fontsource-roboto';
import Layout from "./layout/Layout";
import UserContext, {
    initState, resetState, getAuthDataFromStorage,
    storeAuthData, runDelayedHTTPRequest, 
    storeGoogleAuth, storeGithubAuth, removeGithubAuth
} from './context/UserContext';
import { createNewList, removeList, updateList } from './context/ListsReducer';
import { storeMeetings,createNewMeeting, storeDetailMeeting, removeMeeting, updateMeeting } from './context/MeetingsReducer';
import { storeProjects, storeDetailProject, createNewProject, removeProject } from './context/ProjectsReducer';
import {
    createNewTask, storeDetailTask, moveCard, removeTask,
    storeChecklists, createNewChecklist, removeChecklist,
    createNewAttachments, removeAttachment
} from './context/TasksReducer';
import { SnackbarProvider } from 'notistack';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { LinearProgress } from '@material-ui/core/';
import './index.css';

const Home = React.lazy(() => import("./layout/Home"));
const TeamList = React.lazy(() => import("./components/teams/TeamList"));
const DetailProject = React.lazy(() => import("./components/projects/DetailProject"));
const DetailTeam = React.lazy(() => import("./components/teams/DetailTeam"));
const TaskList = React.lazy(() => import("./components/tasks/TaskList"));
const UserInformation = React.lazy(() => import("./components/users/UserInformation"));
const ModalAuthentication = React.lazy(() => import("./layout/auth/ModalAuthentication"));

const checkAuthentication = (payload, state) => {
    const { history } = payload;
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (auth) {
        if (!auth.authenticated) {
            history.push('/auth');
        }
    } else history.push('/auth');
    return state;
}

const handleFetchError = (payload, state) => {
    const { error, snackbar, dispatch, history } = payload;
    try {
        if (error.response) {
            // Request made and server responded
            switch (error.response.status) {
                case 401:
                    if (snackbar) snackbar(`Please login before updating any data`, 'warning');
                        dispatch({ type: 'logout' });
                    if (history) history.push('/auth');
                    break;
                case 409:
                    var message = '';
                    if ('data' in error.response) message = `${error.response.data}`;
                    else message = `${error.response.statusText}`;
                    if (snackbar) snackbar(`${message}`, 'warning');
                    break;
                default:
                    if (snackbar) snackbar(`Server Error : ${error.response.statusText} (${error.response.status})`, 'error');
                    break;
            }
        } else if (error.request) {
            if (snackbar) snackbar(`Server is not responding`, 'error');
        } else {
            if (snackbar) snackbar(`Client Error : ${error.message}`, 'error');
        }
    } catch (errors) {
        console.log('Catch Errors : ', errors);
    }
    return state;
}

const reducer = (state, action) => {
    const payload = action.payload;
    switch (action.type) {
        case 'authenticate':
            return storeAuthData(payload);
        case 'remember-authentication':
            return getAuthDataFromStorage();
        case 'store-google-auth':
            return storeGoogleAuth(payload, state);
        case 'store-github-auth':
            return storeGithubAuth(payload, state);
        case 'remove-github-auth':
            return removeGithubAuth(payload, state);
        case 'store-projects':
            return storeProjects(state, payload);
        case 'store-detail-project':
            return storeDetailProject(payload);
        case 'create-new-project':
            return createNewProject(payload);
        case 'remove-project':
            return removeProject(payload);
        case 'create-new-list':
            return createNewList(payload);
        case 'update-list':
            return updateList(payload); 
        case 'remove-list':
            return (payload);
        case 'create-new-task':
            return createNewTask(payload);
        case 'store-detail-task':
            return storeDetailTask(payload);
        case 'remove-task':
            return removeTask(payload);
        case 'store-checklists':    
            return storeChecklists(payload);
        case 'create-task-checklist':
            return createNewChecklist(payload);
        case 'remove-checklist':
            return removeChecklist(payload);
        case 'create-new-attachments':
            return createNewAttachments(payload);
        case 'remove-attachment':
            return removeAttachment(payload);
        case 'store-detail-meeting':
            return storeDetailMeeting(payload);
        case 'create-new-meeting':
            return createNewMeeting(payload);
        case 'update-meeting':
            return updateMeeting(payload); 
        case 'remove-meeting':
            return removeMeeting(payload);
        case 'logout':
            return resetState();
        case 'handle-fetch-error':
            return handleFetchError(payload, state);
        case 'run-delayed-http-request':
            return runDelayedHTTPRequest(state);
        case 'check-authentication':
            return checkAuthentication(payload, state);
        default:
            console.log('Default switch : ',action,state);
    }
}

function RemoveTrailingSlashes({ path }) {
    return (
        <>
            {/* https://github.com/ReactTraining/react-router/issues/4841#issuecomment-523625186 */}
            {/* Removes trailing slashes */}
            <Route path={`/${path}*(/+)`} exact strict ><Redirect to={`/${path}`} /></Route>
            {/* Removes duplicate slashes in the middle of the URL */}
            <Route
                path={`/${path}(.*//+.*)`}
                exact
                strict
                render={({ match }) => (
                    <Redirect to={`/${match.params.url.replace(/\/\/+/, "/")}`} />
                )}
            />

        </>
    )
}

const App = () => {
    //using array destructuring
    const [state, dispatch] = useReducer(reducer, initState);

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            <SnackbarProvider maxSnack={5}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <Router>
                        <Layout>
                            <React.Suspense fallback={<LinearProgress />}>
                                <Switch>
                                    <Route path='/' exact ><Redirect to='/projects' /></Route>
                                    {/* passing props ke component melalui route gak bisa langsung, jadi harus pakai anon function ke props render yg dimiliki component Route */}
                                    <Route path="/my-tasks" render={(props) => (<TaskList {...props} ></TaskList>)} />
                                    <Route path="/users" render={(props) => (<UserInformation {...props} ></UserInformation>)} />
                                    <Route path='/auth' render={(props) => (<ModalAuthentication />)} />
                                    <Route path={'/projects'} render={(props) => {
                                        const { match: { path } } = props;
                                        return (
                                            <>
                                                <Route path={`${path}/:id`} component={DetailProject} />
                                                <Route path={`${path}`} exact component={Home} />
                                                {/* <RemoveTrailingSlashes path={path}/> */}
                                            </>
                                        )
                                    }} />
                                    <Route path='/teams' render={(props) => {
                                        const { match: { path } } = props;
                                        return (
                                            <>
                                                <Route path={`${path}/:id`} component={DetailTeam} />
                                                <Route path={`${path}`} exact component={TeamList} />
                                            </>
                                        )
                                    }} />
                                </Switch>
                            </React.Suspense>
                        </Layout>
                    </Router>
                </MuiPickersUtilsProvider>
            </SnackbarProvider>
        </UserContext.Provider>

    );
}
const root_element = document.getElementById('root');
ReactDOM.render(<App />, root_element);