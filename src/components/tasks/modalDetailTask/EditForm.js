
import 'fontsource-roboto';
import React from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Typography } from '@material-ui/core/';
import Attachments from './Attachments';
import Checklist from './Checklist';
import ActivityLog from './ActivityLog';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DateTimePicker from '@material-ui/lab/DateTimePicker';

import SelectTag from '../../widgets/SelectTag';
// import SaveIcon from '@material-ui/icons/Save';

const OpenEditForm = ({ isEdit, data, setData }) => {
    const useStyles = makeStyles((theme) => ({
        textfield: { marginTop: theme.spacing(1), width: '100%' },
        textField: { marginLeft: theme.spacing(1), marginRight: theme.spacing(1), },
    }));
    const classes = useStyles();
    if (isEdit) {
        return (
            <Grid container spacing={2} style={{ paddingLeft: 4, paddingRight: 4 }} >
                <Grid item lg={6} md={6} sm={6} xs={12} >
                    <TextField variant="standard"
                        label="Title : "
                        defaultValue={data.title}
                        onChange={(e) => {
                            setData({ ...data, title: e.target.value })
                        }}
                        style={{ width: '100%' }}
                    />
                    <TextField variant="standard"
                        label="Description : "
                        multiline rows={4}
                        defaultValue={data.description} className={classes.textfield}
                        onChange={(e) => {
                            setData({ ...data, description: e.target.value })
                        }} />
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12} >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker   
                            renderInput={(props) => <TextField {...props}  variant="standard"/>}
                            value={data.start}
                            ampm={false}
                            onChange={newValue=>  setData({ ...data, start: newValue}) }/>
                        <span style={{ marginLeft: '0.5em', marginRight: '0.5em' }}> to </span>
                        <DateTimePicker   
                            renderInput={(props) => <TextField {...props} variant="standard"/>}
                            value={data.end}
                            ampm={false}
                            onChange={newValue=> setData({ ...data, end: newValue }) }/>   
                    </LocalizationProvider>
                    <Grid container spacing={2} >
                        <Grid item lg={6} md={6} sm={6} xs={6} >
                            <TextField variant="standard"
                                label="Label : "
                                defaultValue={data.label}
                                onChange={(e) => {
                                    setData({ ...data, label: e.target.value });
                                }}
                                className={classes.textfield}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} >
                            <TextField variant="standard"
                                label="Progress : (%)"
                                value={data.progress}
                                onChange={(e) => {
                                    setData({ ...data, progress: e.target.value });
                                }}
                                className={classes.textfield}
                                type="number"
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Typography>Attachments : </Typography>
                    <Attachments
                        data={data.attachments}
                        isEdit={isEdit}
                        taskId={data.id}
                        projectId={data.projectId}
                        listId={data.listId}
                    ></Attachments>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Checklist isEdit={isEdit} data={data} />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <SelectTag defaultValue={data.tags} onChange={(tags) => console.log(tags)} isEdit={isEdit} />
                </Grid>
                {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                    <ActivityLog data={data} ></ActivityLog>
                </Grid> */}
            </Grid>
        )
    } else {
        return (
            <Grid container spacing={2} style={{ paddingLeft: 4, paddingRight: 4 }} >
                <Grid item lg={6} md={6} sm={6} xs={12} >
                    <Typography style={{ whiteSpace: 'noWrap' }}>Start : {data.start ? moment(data.start).format('DD MMM YYYY') : ''}</Typography>
                    <Typography style={{ whiteSpace: 'noWrap' }}>End : {data.end ? moment(data.end).format('DD MMM YYYY') : ''}</Typography>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Typography>Description : </Typography>
                    <Typography variant="body2">{data.description}</Typography>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Typography>Attachments : </Typography>
                    <Attachments
                        data={data.attachments}
                        taskId={data.id}
                        projectId={data.projectId}
                        listId={data.listId}>
                    </Attachments>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Checklist data={data} isEdit={isEdit}></Checklist>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <SelectTag defaultValue={data.tags} onChange={(tags) => console.log(tags)} isEdit={isEdit}></SelectTag>
                </Grid>
                {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                    <ActivityLog data={data} isEdit={isEdit}></ActivityLog>
                </Grid> */}
            </Grid>
        )
    }
}
export default OpenEditForm;