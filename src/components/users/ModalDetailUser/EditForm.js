
import 'fontsource-roboto';
import React, { useEffect, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Typography, Avatar, Select, FormControl, MenuItem, FormControlLabel, InputLabel, Checkbox } from '@material-ui/core/';
import DoneIcon from '@material-ui/icons/Done';
import UserContext from '../../../context/UserContext';
import moment from 'moment';
import axios from 'axios';
import Chip from '@material-ui/core/Chip';
// import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles((theme) => ({
    textfield: { marginTop: theme.spacing(1), width: '100%' },
    textField: { marginLeft: theme.spacing(1), marginRight: theme.spacing(1) },
    photoProfileBg: { backgroundColor: '#616161' }
}));

const OpenEditForm = ({ isEdit, data, setData }) => {
    const classes = useStyles();
    const [occupations, setOccupations] = useState([]);
    let global = useContext(UserContext);

    const getOccupations = () => {
        const config = { mode: 'no-cors', crossdomain: true, }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + 'occupation';
        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.get(url, {}, config)
            .then((result) => {
                setOccupations(result.data);
            }).catch((error) => {
                const payload = { error: error, snackbar: null, dispatch: global.dispatch, history: null }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }

    useEffect(() => {
        getOccupations();
    }, [])

    if (isEdit) {
        return (
            <Grid container spacing={2} style={{ paddingLeft: 4, paddingRight: 4 }} >
                <Grid item lg={12} md={12} sm={12} xs={12} align="center">
                    <FormControlLabel
                        label={"Verified"}
                        control={
                            <Checkbox
                                checked={data.verified}
                                onChange={(e) => setData({ ...data, verified: e.target.checked })}
                            />
                        }
                        className={classes.textfield}
                    />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} align="center">
                    <TextField
                        defaultValue={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        style={{ width: '100%' }}
                        variant="standard"
                    />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} align="center">
                    <TextField
                        defaultValue={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        className={classes.textfield}
                        variant="standard"
                    />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} align="center">
                    <FormControl className={classes.textfield} >
                        <InputLabel>Occupations</InputLabel>
                        <Select onChange={e => {
                            setData({ ...data, occupation: e.target.value });
                        }}
                            defaultValue={data.occupation.id}>
                            {
                                occupations.map((occupation, index) => (<MenuItem value={occupation.id} key={occupation.id}>{occupation.name}</MenuItem>))
                            } 
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        )
    } else {
        return (
            <Grid container spacing={2} style={{ paddingLeft: 4, paddingRight: 4 }} >
                <Grid item lg={12} md={12} sm={12} xs={12} align="center">
                    {data.profilePicturePath?
                        <Avatar alt={"Photo profile " + data.name} src={`${process.env.REACT_APP_BACK_END_BASE_URL}/${data.profilePicturePath}`}/>:
                        <Avatar alt={"Photo profile " + data.name} className={classes.photoProfileBg}>{data.name.charAt(0).toUpperCase()}</Avatar>}
                    <Typography variant="h6">{data.name}</Typography>
                    <Typography variant="body2">{data.email}</Typography>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} align="center">
                    {data.occupation ? <Typography variant="body2">{data.occupation.name}</Typography> : <></>}
                    {data.verified ?
                        <Chip component="span" variant="outlined" size="small" label="Verified" deleteIcon={<DoneIcon />} style={{ outlineColor: '#4CAF50', color: '#4CAF50', backgroundColor: '#B9F6CA' }} /> :
                        <Chip component="span" variant="outlined" size="small" label="Unverified" style={{ outlineColor: '#D50000', color: '#D50000', backgroundColor: '#FFEBEE' }} />}
                    <Typography variant="body2">Last login : {data.last_login ? moment(data.last_login).format('DD MMM YYYY') : ''}</Typography>
                </Grid>
            </Grid>
        )
    }
}
export default OpenEditForm;