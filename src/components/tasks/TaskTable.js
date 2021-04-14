import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import ModalDetailTask from './modalDetailTask/ModalDetailTask';
import UserContext from '../../context/UserContext';
import { visuallyHidden } from '@material-ui/utils';
import moment from 'moment';
import axios from 'axios';
import { useSnackbar } from 'notistack';

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
    { id: 'title', align: 'left', disablePadding: true, label: 'Title' },
    { id: 'deadline', align: 'right', disablePadding: false, label: 'Start - End' },
    { id: 'project', align: 'right', disablePadding: false, label: 'Project' },
    { id: 'creator', align: 'right', disablePadding: false, label: 'Creator' },
];

const useStyles = makeStyles((theme) => ({
    root: { width: '100%', },
    paper: { width: '100%', marginBottom: theme.spacing(2), },
    sortSpan: visuallyHidden,
}));

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;

    const createSortHandler = (property) => (event) => onRequestSort(event, property);

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox"></TableCell>
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

export default function EnhancedTable() {
    const classes = useStyles();
    const [rows, setRows] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('end');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [clickedTask, setClickedTask] = useState({ projectId: null, listId: null, taskId: null });
    const [modalOpen, setModalOpen] = useState(false);
    let history=useHistory();

    let global = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const handleSnackbar = (message, variant) => enqueueSnackbar(message, { variant });

    const getTasks = () => {
        const config = { mode: 'no-cors', crossdomain: true, }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + 'user/' + global.state.id + '/tasks';
        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.get(url, {}, config)
            .then((result) => {
                setRows(result.data);
            }).catch((error) => {
                const payload = { error: error, snackbar: null, dispatch: global.dispatch, history: null }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }


    const handleModalOpen = (taskInfo) => {
        const { projectId, listId, taskId, open } = taskInfo;
        setModalOpen(open);
        setClickedTask({ projectId: projectId, listId: listId, taskId: taskId });
    }

    const showModalDetailTask = () => {
        if (clickedTask.taskId != null && clickedTask.taskId !== undefined && modalOpen == true) {
            return (
                <ModalDetailTask
                    open={modalOpen}
                    closeModalDetailTask={() => {
                        handleModalOpen({ projectId: null, listId: null, taskId: null, open: false })
                    }}
                    projectId={clickedTask.projectId}
                    data={clickedTask} />
            )
        }
    }

    const handleCompleteTask = (taskId, isChecked) => {
        var oldRows = rows;
        var newRows = rows.map((row) => {
            if (row.id == taskId) row.complete = isChecked;
            return row;
        });
        setRows(newRows);
        const body = { id: taskId, complete: isChecked };
        if (window.navigator.onLine) {
            const config = { mode: 'no-cors', crossdomain: true }
            const url = process.env.REACT_APP_BACK_END_BASE_URL + `task/${taskId}`;
            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.patch(url, body, config)
                .then((result) => {
                    handleSnackbar(`Data has been updated`, 'success');
                }).catch((error) => {
                    setRows(oldRows);
                    const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: history }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });
                });
        } else {

        }
    }
    useEffect(() => {
        getTasks();
    }, []);

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

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table className={classes.table} aria-labelledby="tableTitle" size={'small'} >
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
                                    if (row.progress >= 100) row.complete = true;
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox" key={row.title}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    onChange={(event) => {
                                                        var checked = event.target.checked;
                                                        handleCompleteTask(row.id, checked)
                                                    }}
                                                    checked={row.complete}
                                                />
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none" style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    handleModalOpen({
                                                        projectId: row.list.project.id,
                                                        listId: row.list.id,
                                                        taskId: row.id,
                                                        open: true
                                                    });
                                                }}>
                                                {row.title} ({row.progress}%)
                                            </TableCell>
                                            <TableCell align="right">{row.start ? moment(row.start).format('DD MMM YYYY') : ''} - {row.end ? moment(row.end).format('DD MMM YYYY') : ''}</TableCell>
                                            <TableCell align="right">
                                                <Link to={`/projects/${row.project.id}/`} style={{ textDecoration: 'none', color: 'black' }}>
                                                    {row.project.title}
                                                </Link>
                                            </TableCell>
                                            <TableCell align="right">{row.creator.name}</TableCell>
                                        </TableRow>
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
            </Paper>
            {showModalDetailTask()}
        </div>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};