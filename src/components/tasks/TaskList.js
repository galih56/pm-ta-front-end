
import React, { useState, useEffect, useContext } from 'react';
import {
 Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core/';
import moment from 'moment';

const TaskList = (props) => {
    const [rows, setRows] = useState([]);
    const handleDetailTaskOpen = props.handleDetailTaskOpen;

    useEffect(() => {
        setRows(props.data);
    }, [props.data]);

    return (
        <React.Fragment>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Task</TableCell>
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
        </React.Fragment>
    );
}
export default TaskList;