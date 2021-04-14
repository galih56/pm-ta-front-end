import React from 'react';
import { Link } from "react-router-dom";
import DetailTeam from './DetailTeam';
import {
    Grid, Paper,
    Table, TableBody, TableCell, TableHead, TableRow,
    Checkbox,
    Typography
} from '@material-ui/core/';

const rows = [
    { id: 0, name: 'Team 1', description: 'Lorem ipsum dolor set amet' },
    { id: 1, name: 'Team 2', description: 'Lorem ipsum dolor set amet' },
    { id: 2, name: 'Team 3', description: 'Lorem ipsum dolor set amet' },
    { id: 3, name: 'Team 4', description: 'Lorem ipsum dolor set amet' },
];

function preventDefault(event) {
    event.preventDefault();
}

export default function TeamTable() {
    const handleChange = () => { }

    const onHoveredStyle = { cursor: 'pointer' };
    return (
        <Grid container spacing={2}>
            <Grid xs={12} sm={12} md={12} lg={12} lg={12} item>
                <Paper style={{ padding: '1em' }}>
                    <Typography variant="h5">Teams</Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.id} style={onHoveredStyle}>
                                    <TableCell>
                                        <Typography variant="body2" display="block">
                                            <Link to={`team/` + row.id} style={{ textDecoration: 'none', color: 'black' }}>
                                                <strong>{row.name}</strong><br />
                                                {row.description}
                                            </Link>
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>
        </Grid >
    );
}


