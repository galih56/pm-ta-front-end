import React, { useState, useContext, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/core/Autocomplete';
import axios from 'axios';


const SelectTag = (props) => {
    const isEditing = props.isEdit;
    const defaultValue = props.defaultValue;
    const global = useContext(UserContext);
    const handleValueChange = props.onChange;
    const [data, setData] = useState([]);
    const history = useHistory();
    
    const fetchData = () => {
        if (window.navigator.onLine) {
            const config = { mode: 'no-cors', crossdomain: true, }
            const url = 'http://localhost:1337/tag/';
            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.get(url, {}, config)
                .then(result => {
                    setData(result.data);
                }).catch(error => {
                    const payload = { error: error, snackbar: null, dispatch: global.dispatch, history: history }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });
                });
        } else {
            const tags = JSON.parse(localStorage.getItem('tags'));
            setData(tags);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    if (isEditing) {
        return (
            <Autocomplete
                multiple
                onChange={(event, arrValues) => { handleValueChange(arrValues) }}
                filterOptions={(options, params) => {
                    options=options.filter(function(item){
                        if(item.title.toLowerCase().includes(params.inputValue.toLowerCase()))
                            return item;
                    })
                    if (params.inputValue !== '') {
                        options.unshift({
                            inputNewTag: params.inputValue,
                            title: `Add "${params.inputValue}"`,
                        });
                    }
                    return options;
                }}
                selectOnFocus
                handleHomeEndKeys
                options={data}
                getOptionLabel={option => {
                    if (typeof option === 'string') return option;
                    if (option.inputValue) return option.inputValue;
                    return option.title;
                }}
                renderTags={(value, getTagProps) =>{
                    return value.map((option, index) => (
                        <Chip variant="outlined" label={option.title} {...getTagProps({ index })} />
                    ))
                }}
                style={{ width: '100%' }}
                freeSolo
                renderInput={(params) => (
                    <TextField {...params} variant="standard" label="Place tags to categorize cards" />
                )}
                defaultValue={defaultValue}
            />
        );
    } else {
        return (
            <>
                {defaultValue.map((item) => {
                    return <Chip key={item.id} label={item.title} style={{ margin: '0.5em' }} />
                })}
            </>
        )
    }
}


export default SelectTag;
