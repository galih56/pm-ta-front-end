import React, { useContext } from 'react';
import { withStyles, useTheme, makeStyles } from '@material-ui/core/styles';
import { MenuItem, FormControl, Select, InputLabel } from '@material-ui/core/';
import UserContext from './UserContext';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));
const selectProjects = (props) => {
    let global = useContext(UserContext);
    const classes = useStyles();

    const handleSelectChange = props.handleSelectChange;

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="select-project">Projects</InputLabel>
            <Select
                labelId="select-project"
                value={projectId}
                onChange={handleSelectChange}
                className={classes.selectEmpty}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {
                    global.state.projects.map(
                        (project, index) => {
                            return (<MenuItem value={project.id} key={project.id}>{project.title}</MenuItem>);
                        }
                    )
                }
            </Select>
        </FormControl>
    )
}
export default selectProjects;