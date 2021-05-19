import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { Chip, Autocomplete } from '@material-ui/core';
import axios from 'axios';
import UserContext from '../../context/UserContext';


export default function UserSearchbar(props) {
    const { projectId, taskId, checklistId, exceptedUsers } = props;
    const handleValueChanges = props.onChange;
    const [users, setUsers] = useState([]);
    const [options, setOptions] = useState([]);
    let global = useContext(UserContext);
    let history = useHistory();

    const getUsers = () => {
        const config = { mode: 'no-cors', crossdomain: true, }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + 'user';
        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.get(url, {}, config)
            .then((result) => {
                setUsers(result.data);
            }).catch((error) => {
                const payload = { error: error, snackbar: null, dispatch: global.dispatch, history: null }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }

    useEffect(() => {
        getUsers();
    }, []);

    function checkExistingMember(id, arr) {
        var exists = false;
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            if('user' in item){
                if (id == item.user.id) {
                    exists = true;
                    break;
                }
            }
            if (id == item.id) {
                exists = true;
                break;
            }
        }
        return exists;
    }

    useEffect(() => {
        global.dispatch({ type: 'check-authentication', payload: { history: history } });
        var filteredOptions = users.filter((option) => { 
            if (!checkExistingMember(option.id, exceptedUsers)
                && !'administrator sistem'.includes(option.name.toLowerCase())) return option;
        });
        filteredOptions = filteredOptions.map((option) => {
            const firstLetter = option.name[0].toUpperCase();
            return { firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter, ...option }
        });
        setOptions(filteredOptions);
    }, [users]);

    return (
        <Autocomplete
            multiple
            freeSolo
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => `${option.name} - (${option.email})`}
            style={{ width: '100%' }}
            renderInput={(params) => <TextField {...params} label="Search Users" variant="standard"/>}
            onChange={(event, options) => handleValueChanges(options)}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip variant="outlined" label={option.name} {...getTagProps({ index })} />
                ))
            }
        />
    );
}
