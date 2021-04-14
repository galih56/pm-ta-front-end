import React, { useState, useEffect } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export default function SelectRole(props) {
    const [options, setOptions] = useState([]);
    const handleChange = props.onChange;

    useEffect(() => {
        setOptions(props.data.filter((option) => {
            if (option.name != 'Project Creator') return option;
        }));
    }, [props.data]);

    const checkIfEmpty = () => {
        if (options.length > 0) {
            return options.map((option) => {
                return (<MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>);
            });
        } else return <MenuItem>No options found</MenuItem>
    }

    return (
        <>
            <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select onChange={(event) => handleChange(event.target.value)} >
                    {checkIfEmpty()}
                </Select>
            </FormControl>
        </>
    );
}
