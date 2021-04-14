
import 'fontsource-roboto';
import React,{useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import axios from 'axios';
import { ZoomMtg } from "@zoomus/websdk";

const OpenEditForm = ({ isEdit, data, setData }) => {

    let apiKeys = {
        apiKey: process.env.REACT_APP_ZOOM_API_SDK_KEY,
        apiSecret: process.env.REACT_APP_ZOOM_API_SDK_SECRET,
    };
    let meetConfig = {
        apiKey: apiKeys.apiKey,
        meetingNumber: "71289544336",
        userName: "Example",
        userEmail: "example@example.com", // must be the attendee email address
        passWord: "0hZeCd",
        role: 0,
    };

    function joinMeeting(signature, meetConfig) {
        ZoomMtg.init({
          leaveUrl: "https://zoom.us/",
          isSupportAV: true,
          success: function (success) {
            console.log("Init Success ", success);
            ZoomMtg.join({
              meetingNumber: meetConfig.meetingNumber,
              userName: meetConfig.userName,
              signature: signature,
              apiKey: meetConfig.apiKey,
              passWord: meetConfig.passWord,
    
              success: (success) => {
                console.log(success);
              },
    
              error: (error) => {
                console.log(error);
              },
            });
          },
        });
      }
      useEffect(() => {
        ZoomMtg.setZoomJSLib("https://source.zoom.us/1.7.10/lib", "/av");
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareJssdk();
    
        /**
         * You should not visible api secret key on frontend
         * Signature must be generated on server
         * https://marketplace.zoom.us/docs/sdk/native-sdks/web/essential/signature
         */
        ZoomMtg.generateSignature({
          meetingNumber: meetConfig.meetingNumber,
          apiKey: meetConfig.apiKey,
          apiSecret: apiKeys.apiSecret,
          role: meetConfig.role,
          success: function (res) {
            console.log("res", res);
    
            setTimeout(() => {
              joinMeeting(res.result, meetConfig);
            }, 1000);
          },
        });
      }, []);
    
    useEffect(()=>{
      ZoomMtg.setZoomJSLib("https://source.zoom.us/1.7.10/lib", "/av");
      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareJssdk();
    })
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
                    <Typography style={{ whiteSpace: 'noWrap' }}>Start : {data.start ? moment(data.start ).format('HH:mm:ss') : ''}</Typography>
                    <Typography style={{ whiteSpace: 'noWrap' }}>End : {data.end ? moment(data.end).format('HH:mm:ss') : ''}</Typography>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Typography>Description : </Typography>
                    <Typography variant="body2">{data.description}</Typography>
                </Grid>
                <a href={`https://zoom.us/oauth/authorize?response_type=code&client_id=ZcNV0xhTQtu_MZOUp8XfMw&redirect_uri=${process.env.REACT_APP_BACK_END_BASE_URL}meeting/respond-to-zoom`}> Connect Zoom </a>
            </Grid>
        )
    }
}
export default OpenEditForm;

