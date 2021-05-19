
import 'fontsource-roboto';
import React,{useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import GoogleCalendar from '../../widgets/GoogleCalendar';

const OpenEditForm = ({ isEdit, data, setData ,detailProject,saveChanges}) => {
    if (isEdit) {
        return (   
            <Grid container spacing={2} style={{ paddingLeft: 4, paddingRight: 4 }} >
                <Grid item lg={12} md={12} sm={12} xs={12} align="center">
                    <TextField
                        defaultValue={data.title}
                        onChange={(e) => setData({ ...data, title: e.target.value })}
                        style={{ width: '100%' }}
                        variant={'standard'}
                    />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} align="center">
                    <TextField variant="standard"
                        label="Description : "
                        multiline 
                        rows={4}
                        defaultValue={data.description}
                        onChange={(e) => {
                            setData({ ...data, description: e.target.value })
                        }} 
                        style={{ width: '100%' }}
                    />
                </Grid>
                <GoogleCalendar meeting={data} detailProject={detailProject} saveChanges={saveChanges}/>
            </Grid>
        )
    } else {
        return (
            <Grid container spacing={2} style={{ paddingLeft: 4, paddingRight: 4 }} >
                <Grid item lg={12} md={12} sm={12} xs={12} align="center">
                    <Typography variant="body2">{data.title}</Typography>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12} >
                    <Typography style={{ whiteSpace: 'noWrap' }}>Date : {data.start ? moment(data.start).format('YYYY-MM-DD') : ''}</Typography>
                    <Typography style={{ whiteSpace: 'noWrap' }}>Start : {data.start ? moment(data.start ).format('HH:mm') : ''}</Typography>
                    <Typography style={{ whiteSpace: 'noWrap' }}>End : {data.end ? moment(data.end).format('HH:mm') : ''}</Typography>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Typography>Description : </Typography>
                    <Typography variant="body2">{data.description}</Typography>
                </Grid>

            </Grid>
        )
    }
}
export default OpenEditForm;

