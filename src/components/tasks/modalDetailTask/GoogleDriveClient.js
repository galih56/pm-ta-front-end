import React, { useState, useEffect, useContext, memo } from 'react';
import UserContext from '../../../context/UserContext';
import { Dialog, AppBar, Toolbar, Button, Slide, IconButton } from '@material-ui/core';
// import { gapi } from 'gapi-script';
import { Icon, InlineIcon } from '@iconify/react';
import googleDrive from '@iconify-icons/mdi/google-drive';
import axios from 'axios';
import GooglePicker from 'react-google-picker';
const GoogleDriveButton = (props) => {
    const handleSnackbar = props.snackbar;
    const global = useContext(UserContext);
    const payload = props.payload;

    var developerKey = process.env.REACT_APP_GOOGLE_API_KEY;
    var clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    var appId = "tugas-akhir-288302";
    var scope = ['https://www.googleapis.com/auth/drive.readonly'];

    function createPicker(google, oauthToken) {
        console.log('createPicker : ',google,oauthToken)
        if (google && oauthToken) {
            var view = new google.picker.View(google.picker.ViewId.DOCS);
            view.setMimeTypes("image/png,image/jpeg,image/jpg,application/pdf,application/zip");
            var picker = new google.picker.PickerBuilder()
                .enableFeature(google.picker.Feature.MINE_ONLY)
                .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
                .setAppId(appId)
                .setOAuthToken(oauthToken)
                .addView(view)
                .addView(new google.picker.DocsUploadView()).hideTitleBar()
                .setDeveloperKey(developerKey)
                .hideTitleBar()
                .setCallback((data)=>pickerCallback(data,google))
                .build();
            picker.setVisible(true);
        }
    }

    function pickerCallback(data,google) {
        if (data.action == google.picker.Action.PICKED) {
            var body = {
                userId: global.state.id,
                taskId: payload.taskId,
                source: 'google-drive',
                files: data.docs
            }
            if (!window.navigator.onLine) handleSnackbar(`You are currently offline`, 'warning');

            const config = { mode: 'no-cors', crossdomain: true }
            const url = process.env.REACT_APP_BACK_END_BASE_URL + 'task-attachments/';
            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.post(url, body, config)
                .then((result) => {
                    Object.assign(payload, { data: result.data });
                    global.dispatch({ type: 'create-new-attachments', payload: payload })
                    handleSnackbar(`Data has been updated`, 'success');
                }).catch((error) => {
                    const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: null }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });
                });
        }
    }
    return (
        <React.Fragment>
            {/* <IconButton onClick={() => { loadPicker() }}>
                <Icon icon={googleDrive} />
            </IconButton> */}
            <GooglePicker 
                clientId={clientId}
                developerKey={developerKey}
                scope={scope}
                onChange={data => console.log('on change:', data)}
                onAuthFailed={data =>{ 
                    console.log('on auth failed:', data)
                }}
                multiselect={true}
                navHidden={true}
                authImmediate={false}
                // mimeTypes={['image/png', 'image/jpeg', 'image/jpg']}
                viewId={'DOCS'}
                createPicker={createPicker}
        >
                <IconButton>
                    <Icon icon={googleDrive} />
                </IconButton>
            </GooglePicker>
        </React.Fragment>
    )
}
export default memo(GoogleDriveButton);