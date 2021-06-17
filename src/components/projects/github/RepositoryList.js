import React,{ useState,useContext,useEffect} from 'react';
import UserContext from './../../../context/UserContext'
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import NewRepositoryForm from './NewRepositoryForm';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ModalRepositoryInformation from './ModalRepositoryInformation';
import GithubLoginButton from './GithubLoginButton';
import Typography from '@material-ui/core/Typography';
import { Icon, InlineIcon } from '@iconify/react';
import githubIcon from '@iconify-icons/logos/github-icon';

const RepositoryList=({projectId})=>{
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const global=useContext(UserContext);
    const snackbar = (message, variant) => enqueueSnackbar(message, { variant });
    const [repos,setRepos]=useState([]);
    const [clickedRepo,setClickedRepo]=useState({
        owner_name:'',
        repository_name:'',
        open:false
    })
    const getRepositories=()=>{
        const config = { mode: 'no-cors', crossdomain: true, }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + 'project/'+projectId+'/github-repository';
        axios.defaults.headers.common['Authorization'] = 'Bearer '+global.state.githubAuth.access_token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.get(url, {}, config)
            .then((result) => {
                setRepos(result.data) 
            });
    }

    const deleteRepository=(id) => {
        const config = { mode: 'no-cors', crossdomain: true, }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + 'github-repository/'+id;
        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.delete(url,{}, config)
        .then(result => {
            setRepos(repos.filter((item)=>{
                if(item.id!=id) return item
            }))
            snackbar(`Data was deleted`, 'success'); 
        }).catch((error) => {
            const payload = { error: error, snackbar: snackbar, dispatch: global.dispatch, history: history }
            global.dispatch({ type: 'handle-fetch-error', payload: payload });
        });
    }
    useEffect(()=>{
        getRepositories();
    },[projectId]);
    
    return (
        <>
            <Grid container>
                <Grid item xl={12} md={12} sm={12} xs={12} style={{paddingLeft:'1em',paddingBottom:'0.5em'}}>
                    <Typography variant="h6" align="left" > <Icon icon={githubIcon} /> Github Repositories</Typography>
                    <GithubLoginButton/>
                    <br/>
                    <Typography variant="body2">Login with github account to get repository informations</Typography>
                   
                </Grid>
                <Grid item xl={12} md={12} sm={12} xs={12} style={{paddingLeft:'1em'}} > 
                    <NewRepositoryForm projectId={projectId}
                        onSave={(newRepo)=>{
                            setRepos([...repos,newRepo]);
                        }}/>
                </Grid>
                <Grid item xl={12} md={12} sm={12} xs={12} >
                    <List component="nav" aria-label="repository list">
                        {
                            repos.map((repo)=>{
                                return(
                                    <ListItem key={repo.id} style={ {cursor: 'pointer' }}
                                            onClick={()=>{
                                                setClickedRepo({
                                                    owner_name:repo.owner_name,
                                                    repository_name:repo.repository_name,
                                                    open:true
                                                })
                                            }} >
                                        <ListItemText primary={`${repo.owner_name}/${repo.repository_name}`} />
                                        <ListItemSecondaryAction>
                                        <IconButton 
                                            onClick={()=>{
                                            deleteRepository(repo.id) 
                                            }} 
                                            edge="start" aria-label={`remove repository ${repo.owner_name}/${repo.repository_name}`}>
                                            <DeleteIcon />
                                        </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            })
                        }
                    
                    </List>
                    <ModalRepositoryInformation initialState={clickedRepo} handleClose={()=>{
                        setClickedRepo({
                            owner_name:'',
                            repository_name:'',
                            open:false
                        })
                    }}/>
                </Grid>
            </Grid>
        </>
    )
}

export default RepositoryList;