import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";

import Grid from '@material-ui/core/Grid';
import {
    Card,
    CardActionArea,
    CardActions,
    CardMedia,
    CardContent
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const data = [
    {
        id: 1,
        title: 'Lorem ipsum',
        description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
        image_url: 'https://github.com/tkrkt/text2png/raw/master/img/exampleText.png',
    },
    {
        id: 2,
        title: 'Vestibulum sed lorem neque',
        description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
        image_url: 'https://github.com/tkrkt/text2png/raw/master/img/exampleText.png',
    },
    {
        id: 3,
        title: 'Ut sagittis quis justo in mollis',
        description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
        image_url: 'https://github.com/tkrkt/text2png/raw/master/img/exampleText.png',
    },
    {
        id: 4,
        title: 'Ujusto in mollis',
        description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
        image_url: 'https://github.com/tkrkt/text2png/raw/master/img/exampleText.png',
    }
];


const projectList = () => {
    return (
        <React.Fragment>
            <Typography variant="h6">Projects</Typography>
            <Grid container spacing={1}>
                {data.map((row, index) => (
                    <Grid item xl={4} md={4} sm={4} xs={4} key={row.id}>
                        <Link to={`project/` + row.id} style={{ textDecoration: 'none' }}>
                            <Card style={{ height: '100%' }}>
                                <CardActionArea>
                                    <CardMedia
                                        image={row.image_url}
                                        title={row.title}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="h5" align="left" style={{ height: '100%' }}> {row.title} </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {row.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </React.Fragment>
    );
}
export default projectList;