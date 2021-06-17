import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import UserContext from '../../context/UserContext';
import ModalCreateProject from './ModalCreateProject';

const ProjectList = ({data}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const global = useContext(UserContext);
    let history = useHistory();

    const openModalCreateProject = () => setModalOpen(true);

    useEffect(() => {
        global.dispatch({ type: 'remember-authentication' });
        if (!global.state.authenticated === true) history.push('/auth');
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid item xl={3} md={3} sm={3} xs={4} >
                <Card >
                    <CardActionArea style={{ height: '100%' }} onClick={openModalCreateProject}>
                        <CardContent align="center" component='div' >
                            <AddIcon />
                            <Typography variant="body2" align="center" style={{ marginTop: '1em', lineHeight: '1em' }}><strong>New Project</strong></Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <ModalCreateProject open={modalOpen} closeModal={() => setModalOpen(false)}></ModalCreateProject>
            {
                data.map(
                    (row, index) => {
                        return (
                            <Grid item xl={3} md={3} sm={4} xs={4} key={row.id}>
                                <Link to={`/projects/${row.id}/`} style={{ textDecoration: 'none' }}>
                                    <Card style={{ height: '100%' }}>
                                        <CardActionArea style={{ height: '100%' }}>
                                            <CardContent component='div' align='center'>
                                                <Typography gutterBottom variant="h6" align="center"> {row.title} </Typography>
                                                <Typography variant="body2" color="textSecondary" component="p" style={{ marginTop: '1em', lineHeight: '1em' }}>
                                                    {row.description?substringDots(row.description):''}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Link>
                            </Grid>
                        )
                    }
                )
            }
        </Grid >
    );
}
const substringDots = (text) => {
    if (text.length > 60) {
        text = text.substring(0, 60) + " ...";;
    }
    return text
}
export default ProjectList;