import React, { useState, useContext } from 'react';
import UserContext from '../../context/UserContext';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const SignUp = (props) => {
    const classes = props.classes;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [inputRequireAlert, setInputRequireAlert] = useState(false);
    const [passwordConfirmAlert, setPasswordConfirmAlert] = useState(false);
    const [offlineAlert, setOfflineAlert] = useState(false);
    let [userExists, setUserExists] = useState(false);
    let [signUpSuccess, setSignUpSuccess] = useState(false);
    let global = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const handleSnackbar = (message, variant) => enqueueSnackbar(message, { variant });

    const handleSubmit = (e) => {
        e.preventDefault();
        const body = {
            name: username,
            password: password,
            confirmation: confirmPassword,
            phoneNumber: phoneNumber,
            email: email
        }
        if (username.trim() === '' || password.trim() === '' || phoneNumber.trim() === '' || email.trim() === '') {
            setInputRequireAlert(true);
            return;
        } else {
            setInputRequireAlert(false);
        }
        if (password === confirmPassword) {
            setPasswordConfirmAlert(false);
        } else {
            setPasswordConfirmAlert(true);
            return;
        }
        const config = {
            mode: 'no-cors', crossdomain: true, headers: { 'Content-Type': 'application/json' }
        };
        if (!window.navigator.onLine) {
            setOfflineAlert(true);
        } else {
            setOfflineAlert(false);
        }
        axios.post(process.env.REACT_APP_BACK_END_BASE_URL + 'user', body, config)
            .then((result) => {
                if (result.data.success === true) {
                    setSignUpSuccess(true);
                    setUserExists(false);
                    setUsername('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    setPhoneNumber('');
                } else {
                    setSignUpSuccess(false);
                    setUserExists(false);
                }
            }).catch((error) => {
                if (error.response) if (error.response.status === 409) setUserExists(true);
                const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: null }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
                setSignUpSuccess(false);
            });
    }
    return (
        <React.Fragment>
            { passwordConfirmAlert ? <Alert severity="error" > Password and confirm password does not match</Alert> : null}
            { inputRequireAlert ? <Alert severity="error" >Please complete the form</Alert> : null}
            { userExists ? <Alert severity="warning" >Email : <strong>{email} </strong>already in use</Alert> : null}
            { signUpSuccess ? <Alert severity="success" ><strong>Success</strong><br />You are now registered</Alert> : null}
            { offlineAlert ? <Alert severity="warning" >You're currently offline. Please check your internet connection</Alert> : null}
            <form className={classes.form} style={{ textAlign: 'center' }} onSubmit={handleSubmit}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Name"
                    name="name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value) }
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    value={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value) }
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={phoneNumber}
                    type="tel"
                    onChange={(e) => setPhoneNumber(e.target.value) }
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value) }
                    autoComplete="current-password"
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="confirm-password"
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value) }
                    autoComplete="current-password"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={handleSubmit}
                > Sign Up  </Button>
            </form>
        </React.Fragment>
    );
}
export default SignUp;