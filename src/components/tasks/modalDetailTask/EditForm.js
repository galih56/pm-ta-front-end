
import 'fontsource-roboto';
import React,{useState} from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Attachments from './Attachments';
import Subtasks from './Subtask/Subtasks';
import ActivityLog from './ActivityLog';
import MemberList from './MemberList';
import DatePicker from '@material-ui/lab/DatePicker';
import SelectTag from '../../widgets/SelectTag';
import StatusChip from './../../widgets/StatusChip';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';


const OpenEditForm = ({ isEdit, data, setData,detailProject }) => {
    const useStyles = makeStyles((theme) => ({
        textfield: { marginTop: theme.spacing(1), width: '100%' },
        textField: { marginLeft: theme.spacing(1), marginRight: theme.spacing(1), },
    }));
    const classes = useStyles();
    if (isEdit) {
        return (
            <Grid container spacing={2} style={{ paddingLeft: 4, paddingRight: 4 }} >
                <Grid  item lg={12} md={12} sm={12} xs={12} container spacing={2} >
                    <Grid item lg={6} md={6} sm={6} xs={12} >
                        <TextField variant="standard"
                            label="Title : "
                            defaultValue={data.title}
                            onChange={(e) => {
                                setData({ ...data, title: e.target.value })
                            }}
                            style={{ width: '100%' }}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12} >
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
                <Grid item lg={12} md={12} sm={12} xs={12} container>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker value={data.actualStart} 
                                label="Start : "
                                ampm={false}
                                renderInput={(params) => <TextField {...params} variant="standard" />}
                                onChange={(value)=>{
                                    setData({ ...data,actualStart : value })
                                }}/>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker 
                            value={data.actualEnd} 
                            label="End : "
                            ampm={false}
                            renderInput={(params) => <TextField {...params} variant="standard" />}
                            onChange={(value)=>{
                                setData({ ...data,actualEnd : value })
                            }}/>
                        </LocalizationProvider>
                    </Grid>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} >
                    <TextField variant="standard"
                        label="Description : "
                        multiline rows={4}
                        defaultValue={data.description} className={classes.textfield}
                        onChange={(e) => {
                            setData({ ...data, description: e.target.value })
                        }} />
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
               {!data.isSubtask?(
                <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Subtasks isEdit={isEdit} detailTask={data} detailProject={detailProject} 
                            onCreate={(newSubtasks)=>{
                                setData({...data,subtasks:newSubtasks});
                            }}
                        />
                    </Grid>
                ):<></>}
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <SelectTag defaultValue={data.tags} onChange={(tags) => {
                        setData({...data,tags:tags})
                    }} isEdit={isEdit} />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <MemberList detailProject={detailProject} data={data} setData={setData} isEdit={isEdit}/>
                </Grid>
            </Grid>
        )
    } else {
        return (
            <Grid container spacing={2} style={{ paddingLeft: 4, paddingRight: 4 }} >
                <Grid item lg={6} md={6} sm={6} xs={12} >
                    <Typography style={{ whiteSpace: 'noWrap',margin:'0.4em' }}>Start : {data.start ? moment(data.start).format('DD MMM YYYY') : ''}</Typography>
                    <Typography style={{ whiteSpace: 'noWrap',margin:'0.4em' }}>End : {data.end ? moment(data.end).format('DD MMM YYYY') : ''}</Typography>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12} >
                    <Typography style={{ whiteSpace: 'noWrap',margin:'0.4em' }}>Actual Start : {data.actualStart ? moment(data.actualStart).format('DD MMM YYYY') : ''}<StatusChip status={data.startLabel}/></Typography>
                    <Typography style={{ whiteSpace: 'noWrap',margin:'0.4em' }}>Actual End : {data.actualEnd ? moment(data.actualEnd).format('DD MMM YYYY') : ''}<StatusChip status={data.endLabel}/></Typography>
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
               {!data.isSubtask?(
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Subtasks detailTask={data} detailProject={detailProject} isEdit={isEdit} />
                </Grid>
                ):<></>}
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <SelectTag defaultValue={data.tags} onChange={(tags) => console.log(tags)} isEdit={isEdit}></SelectTag>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <MemberList detailProject={detailProject} data={data} setData={setData} isEdit={isEdit}/>
                </Grid>
            </Grid>
        )
    }
}
export default OpenEditForm;

