
import 'fontsource-roboto';
import React,{useEffect,useState} from 'react';
import {useHistory} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { ZoomMtg } from "@zoomus/websdk";
import { useSnackbar } from 'notistack';
import axios from 'axios'

const Zoom = ({meeting}) => {
    ZoomMtg.setZoomJSLib("https://source.zoom.us/1.7.10/lib", "/av");
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
    var zmmtg_root=document.getElementById('zmmtg-root');
    if(zmmtg_root) zmmtg_root.style.backgroundColor="#fafafa";
     
    const [code,setCode]=useState('');
    const [accessToken,setAccessToken]=useState('');
    const { enqueueSnackbar } = useSnackbar();
    const snackbar = (message, variant) => enqueueSnackbar(message, { variant });
    const history=useHistory();

    let meetConfig = {
        apiKey: process.env.REACT_APP_ZOOM_API_SDK_KEY,
        apiSecret: process.env.REACT_APP_ZOOM_API_SDK_SECRET,
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
    function createMeeting(){
        const config = { mode: 'no-cors', crossdomain: true }
        const url = `https://api.zoom.us/v2/users/${global.state.email}/meetings`;
        const body ={
            /*  Pass necessary details like start_time in UTC, topic, agenda, duration */
        }
        
        try {
            axios.defaults.headers.common['Authorization'] =`Bearer ${accessToken}`;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.post(url, body, config)
                .then((result) => {
                    console.log(result)
                }).catch((error) => {
                    const payload = { error: error, snackbar: snackbar, dispatch: global.dispatch, history: history }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });
                });
        } catch (error) {
            snackbar('Failed to send request', 'error');
        }
    }

    useEffect(() => {
        /*
        ZoomMtg.generateSignature({
          meetingNumber: meetConfig.meetingNumber,
          apiKey: meetConfig.apiKey,
          apiSecret: meetConfig.apiSecret,
          success: function (res) {
            console.log("res", res);
          },
        });
        */
    }, []);

    useEffect(()=>{
        if (code) {
            const url = `https://api.zoom.us/v2/users/${global.state.email}/meetings`;
            try {
                axios.defaults.headers.common['Authorization'] =`Bearer ${accessToken}`;
                axios.defaults.headers.post['Content-Type'] = 'application/json';
                axios.post(url, JSON.stringify({ code: code }), {})
                    .then((result) => {
                        console.log(result)
                    }).catch((error) => {
                        const payload = { error: error, snackbar: snackbar, dispatch: global.dispatch, history: history }
                        global.dispatch({ type: 'handle-fetch-error', payload: payload });
                    });
            } catch (error) {
                snackbar('Failed to send request', 'error');
            }
          }
    },[code])
    return(
        <Grid item xl={12} lg={12} md={12} sm={12} align={'center'} >
            <a href={`https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_ZOOM_API_OAUTH_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BACK_END_BASE_URL}zoom-authentication`}> Connect Zoom </a>
        </Grid>
    )
}

export default Zoom;