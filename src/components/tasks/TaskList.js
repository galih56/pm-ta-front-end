
import React, { useState, useEffect, useContext } from 'react';
import {
    Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from '@material-ui/core/';
import moment from 'moment';

const TaskList = (props) => {
    const [rows, setRows] = useState([]);
    const handleDetailTaskOpen = props.handleDetailTaskOpen;

    useEffect(() => {
        setRows(props.data);
    }, [props.data]);

    return (
        <Grid container>
            <Grid xs={12} sm={12} md={12} lg={12} lg={12} item style={{ padding: '1em' }}>
                <Typography variant="h6" component="div"> Tasks </Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Start - End</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell component="th" scope="row" style={{ cursor: 'pointer' }}
                                    onClick={() => handleDetailTaskOpen({ projectId: task.list.project.id, listId: task.list.id, taskId: task.id, open: true })}>
                                    {task.title}
                                </TableCell>
                                <TableCell>{task.start ? moment(task.start).format('DD MMM YYYY') : ''} - {task.end ? moment(task.end).format('DD MMM YYYY') : ''}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Grid>
        </Grid >
    );
}
export default TaskList;