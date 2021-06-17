
import React, { useState, useEffect, useContext } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { makeStyles } from '@material-ui/core/styles';
import { visuallyHidden } from '@material-ui/utils';
import moment from 'moment';

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
     { id: 'deadline', align: 'left', disablePadding: false, label: 'Start - End' },
     { id: 'creator', align: 'left', disablePadding: false, label: 'Creator' },
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
 
const TaskList = (props) => {
    const [rows, setRows] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('end');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const handleDetailTaskOpen = props.handleDetailTaskOpen;
    const classes = useStyles();
    const projectId=props.projectId;

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
    
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    return (
        <React.Fragment>
            <TableContainer>
                <Table size="small">
                    <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((task) => (
                            <TableRow key={task.id} style={{ cursor: 'pointer' }}
                            onClick={() => handleDetailTaskOpen({ taskId: task.id, open: true })}
                            >
                                <TableCell component="th" scope="row">
                                    {task.title}
                                </TableCell>
                                <TableCell>
                                    {task.start ? moment(task.start).format('DD MMM YYYY') : ''} - {task.end ? moment(task.end).format('DD MMM YYYY') : ''}
                                    {(task.actualStart && task.actualEnd)?(
                                        <>
                                            <br/>
                                            Actual start/end : 
                                            {task.actualStart ? moment(task.actualStart).format('DD MMM YYYY') : ''} - {task.actualEnd ? moment(task.actualEnd).format('DD MMM YYYY') : ''}
                                        </>
                                    ):''}
                                    
                                </TableCell>
                                <TableCell>
                                    {(typeof task.creator =='object')?task.creator.name:'-'}
                                </TableCell>
                            </TableRow>
                        ))}
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
        </React.Fragment>
    );
}
export default TaskList;