import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell, TableContainer, TablePagination,
    TableHead, TableRow, TableSortLabel, Paper, Chip
} from '@material-ui/core';
import ModalDetailUser from './ModalDetailUser/ModalDetailUser';
import UserContext from '../../context/UserContext';
import { visuallyHidden } from '@material-ui/utils';
import moment from 'moment';
import axios from 'axios';
import DoneIcon from '@material-ui/icons/Done';

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
    { id: 'last_login', align: 'right', disablePadding: false, label: 'Last login' },
];

const useStyles = makeStyles((theme) => ({
    root: { width: '100%', paddingLeft: '1em', paddingTop: '1em' },
    paper: { width: '100%', marginBottom: theme.spacing(2), },
    sortSpan: visuallyHidden,
}));

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;

    const createSortHandler = (property) => (event) => onRequestSort(event, property);

    return (
        <TableHead>
            <TableRow>
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
                                    {order === 'asc' ? 'sorted descending' : 'sorted ascending'}
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
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [clickedUser, setClickedUser] = useState({ id: null, name: '', email: '' });
    const [modalOpen, setModalOpen] = useState(false);

    let global = useContext(UserContext);

    const getUsers = () => {
        const config = { mode: 'no-cors', crossdomain: true, }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + 'user';
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

    function handleUserUpdate(data, action) {
        var newRows = [];
        switch (action) {
            case 'update':
                newRows = rows.map((row => {
                    if (row.id == data.id) return data
                    return row
                }));
                break;
            case 'delete':
                newRows = rows.filter((row => {
                    if (row.id != data.id) return row
                }));
                break;
            default:
                newRows = rows;
                break;
        }
        setRows(newRows)
    }

    const handleModalOpen = (data) => {
        const { user, open } = data;
        setModalOpen(open);
        setClickedUser(user);
    }

    const showModalDetailUser = () => {
        if (clickedUser.id != null && clickedUser.id !== undefined && modalOpen == true) {
            return (
                <ModalDetailUser
                    open={modalOpen} id={clickedUser.id} initialState={clickedUser}
                    closeModal={() => handleModalOpen({ user: { id: null, name: '', email: '' }, open: false })}
                    onUpdate={handleUserUpdate}
                />
            )
        }
    }

    useEffect(() => {
        getUsers();
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <div className={classes.root}>
            <TableContainer>
                <Table className={classes.table} aria-labelledby="tableTitle" size={'small'} padding="default" >
                    <EnhancedTableHead classes={classes} order={order} orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                    />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <TableRow hover key={row.id}>
                                        <TableCell component="th" scope="row" style={{ cursor: 'pointer' }}
                                            onClick={() => handleModalOpen({ user: row, open: true })}>
                                            {row.name} ({row.email})
                                            <br />
                                            {row.verified ?
                                                <Chip variant="outlined" size="small"
                                                    label="Verified" deleteIcon={<DoneIcon />}
                                                    style={{ outlineColor: '#4CAF50', color: '#4CAF50', backgroundColor: '#B9F6CA' }} /> :
                                                <Chip variant="outlined" size="small"
                                                    label="Unverified"
                                                    style={{ outlineColor: '#D50000', color: '#D50000', backgroundColor: '#FFEBEE' }} />}
                                        </TableCell>
                                        <TableCell align="left">{row.occupation.name}</TableCell>
                                        <TableCell align="right">{row.last_login ? moment(row.last_login).format('DD MMM YYYY') : ''}</TableCell>
                                    </TableRow>
                                );
                            })}
                        {emptyRows > 0 && (<TableRow style={{ height: (53) * emptyRows }} > <TableCell colSpan={6} /> </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                page={page}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {showModalDetailUser()}
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