
import 'fontsource-roboto';
import React, { useEffect, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import UserContext from '../../../../context/UserContext';
import { Grid, Typography, Avatar } from '@material-ui/core/';
import moment from 'moment';
import SelectRole from '../../../widgets/SelectRole';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    textfield: { marginTop: theme.spacing(1), width: '100%' },
    textField: { marginLeft: theme.spacing(1), marginRight: theme.spacing(1) },
    photoProfileBg: { backgroundColor: '#616161' }
}));

const OpenEditForm = ({ isEdit, data, setData}) => {
    const classes = useStyles();
    const [roles,setRoles]=useState([]);
    const global = useContext(UserContext);

    const getRoles = () => {
        const config = { mode: 'no-cors', crossdomain: true, }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + 'memberrole';
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.get(url, {}, config)
            .then((result) => {
                setRoles(result.data);
            }).catch((error) => {
                const payload = { error: error, snackbar: null, dispatch: global.dispatch, history: null }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }

    useEffect(()=>{
        getRoles();
    },[]);
    
    if (isEdit) {
        return (
            <Grid container spacing={2} style={{ paddingLeft: 3, paddingRight: 3 }} >
                <Grid item lg={12} md={12} sm={12} xs={12} align="center">
                    <Avatar alt={"Photo profile " + data.name} className={classes.photoProfileBg}>{data.name.charAt(0).toUpperCase()}</Avatar>
                    <Typography variant="h6">{data.name}</Typography>
                    <Typography variant="body2">{data.email}</Typography>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} align="center">
                    {data.occupation ? <Typography variant="body2">{data.occupation.name}</Typography> : <></>}
                        <Typography variant="body2">Last login : {data.last_login ? moment(data.last_login).format('DD MMM YYYY') : ''}</Typography>

                        <SelectRole data={roles} onChange={
                            (value)=>{
                                var selectedRole=roles.filter(function(role){
                                    if(value==role.id) return role;
                                })
                                if(selectedRole.length){
                                    console.log('selectedRole : ',selectedRole[0]);
                                    setData({...data,role:selectedRole[0]})
                                }
                                else alert('Role not found')
                            }
                        } defaultValue={data.role}/>
                </Grid>
            </Grid>
        )
    } else {
        return (
            <Grid container spacing={2} style={{ paddingLeft: 4, paddingRight: 4 }} >
                <Grid item lg={12} md={12} sm={12} xs={12} align="center">
                    <Avatar alt={"Photo profile " + data.name} className={classes.photoProfileBg}>{data.name.charAt(0).toUpperCase()}</Avatar>
                    <Typography variant="h6">{data.name}</Typography>
                    <Typography variant="body2">{data.email}</Typography>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} align="center">
                    {data.occupation ? <Typography variant="body2">{data.occupation.name}</Typography> : <></>}
                    <Typography variant="body2">Last login : {data.last_login ? moment(data.last_login).format('DD MMM YYYY') : ''}</Typography>
                    {data.role ? <Typography variant="body2">Role : {data.role.name}</Typography> : <></>}
               </Grid>
            </Grid>
        )
    }
}
export default OpenEditForm;