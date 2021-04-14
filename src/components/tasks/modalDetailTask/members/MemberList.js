import React, { useState, useEffect, useContext, useCallback } from 'react';
import UserContext from '../../../../context/UserContext';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell, TableContainer, TablePagination,
    TableHead, TableRow, TableSortLabel, Typography, Paper, Box,
    Collapse, IconButton, Grid, Button
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import FilterListIcon from '@material-ui/icons/FilterList';
import { visuallyHidden } from '@material-ui/utils';
import { useSnackbar } from 'notistack';
import ModalDetailUser from '../../../users/ModalDetailUser/ModalDetailUser';
import TaskList from '../../TaskList';
import moment from 'moment';
import axios from 'axios';
import ModalCreateMember from './ModalCreateMember';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'name', align: 'left', disablePadding: true, label: 'Name' },
    { id: 'role', align: 'left', disablePadding: false, label: 'Role' },
    { id: 'last login', align: 'right', disablePadding: false, label: 'Last login' },
];

const useStyles = makeStyles((theme) => ({
    root: { width: '100%', padding: '1em' },
    sortSpan: visuallyHidden,
}));

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => onRequestSort(event, property);

    return (
        <TableHead>
            <TableRow>
                <TableCell></TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.sortSpan}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function EnhancedTable(props) {
    const classes = useStyles();
    const handleDetailTaskOpen = props.handleDetailTaskOpen;
    const projectId = props.projectId;
    let initStateUser = { id: null, name: '', email: '', role: { id: null, name: '' } }
    const [clickedUser, setClickedUser] = useState(initStateUser);
    const [modalOpen, setModalOpen] = useState(false);
    const [newMemberOpen, setNewMemberOpen] = useState(false);

    const [rows, setRows] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('end');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    let global = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const handleSnackbar = (message, variant) => enqueueSnackbar(message, { variant });

    const handleModalOpen = (user, open) => {
        setModalOpen(open);
        setClickedUser(user);
    }

    const showUserProfile = () => {
        if (clickedUser.id != null && clickedUser.id !== undefined && modalOpen == true) {
            return (
                <ModalDetailUser
                    open={modalOpen}
                    closeModal={() => {
                        handleModalOpen(initStateUser, false)
                    }}
                    initialState={clickedUser} />
            )
        }
    }

    useEffect(() => {
        setRows(props.data);
    }, [props.data]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <div className={classes.root}>
            <Grid>
                <Typography variant="h6">Members  <Button color="primary" component="span" onClick={() => setNewMemberOpen(true)}>+ Add new member</Button></Typography>
            </Grid>
            <TableContainer>
                <Table className={classes.table} aria-labelledby="tableTitle" size={'medium'} >
                    <EnhancedTableHead
                        classes={classes}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                    />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <Row key={row.id} data={row} handleDetailTaskOpen={handleDetailTaskOpen} />
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: (53) * emptyRows }} >
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <ModalCreateMember projectId={projectId} open={newMemberOpen} handleClose={() => setNewMemberOpen(true)} />
            {showUserProfile()}
        </div>
    );
}

function Row(props) {
    const { data, handleDetailTaskOpen } = props;
    const [open, setOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    let global = useContext(UserContext);

    const getTasks = (id) => {
        const config = { mode: 'no-cors', crossdomain: true, }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + 'user/' + id + '/tasks';
        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.get(url, {}, config)
            .then((result) => {
                setTasks(result.data);
            }).catch((error) => {
                const payload = { error: error, snackbar: null, dispatch: global.dispatch, history: null }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }

    return (
        <React.Fragment>
            <TableRow
                hover key={data.id}
            >
                <TableCell>
                    <IconButton aria-label="expand row" size="small"
                        onClick={() => {
                            getTasks(data.id);
                            setOpen(!open);
                        }}
                    > {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />} </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" style={{ cursor: 'pointer' }}
                    onClick={() => {
                        handleModalOpen(row, true);
                    }}> {data.name} <br />({data.email}) </TableCell>
                <TableCell>{data.role.name}</TableCell>
                <TableCell align="right">
                    {data.last_login ? moment(data.last_login).format('DD MMM YYYY') : ''}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto">
                        <TaskList data={tasks} handleDetailTaskOpen={handleDetailTaskOpen} />
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};