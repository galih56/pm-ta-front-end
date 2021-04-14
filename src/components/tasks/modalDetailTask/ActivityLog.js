import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function createData(id, description, datetime) {
    return { description, datetime };
}

const rows = [
    createData(0, 'User A has uploaded a file', '20 Dec 2020'),
    createData(1, 'User A has created a new checklist', '29 Dec 2020'),
    createData(2, 'User B has created a new checklist', '29 Dec 2020'),
    createData(3, 'User C has updated a task (Redesign UI/UX)', '29 Dec 2020'),
];


const activityList = () => {
    return (
        <Table size="small" aria-label="Activity Log">
            <TableHead>
                <TableRow>
                    <TableCell>Activity</TableCell>
                    <TableCell align="right">Datetime</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row, i) => (
                    <TableRow key={i}>
                        <TableCell component="th"> {row.description} </TableCell>
                        <TableCell align="right">{row.datetime}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
export default activityList;