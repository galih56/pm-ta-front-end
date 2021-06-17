import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import AddIcon from '@material-ui/icons/Add';
import FormAddNewProject from './FormAddNewProject';

const ProjectList = ({teamId,data}) => {
    const [openFormCreate,setOpenFormCreate]=useState(false);
    const [rows,setRows]=useState([]);

    useEffect(()=>{
        setRows(data)
    },[data]);

    return (
        <React.Fragment>
            <Typography variant="h6">Projects</Typography>
            <Grid container spacing={1}>
                <Grid item xl={3} md={3} sm={3} xs={4} >
                    <Card >
                        <CardActionArea style={{ height: '100%' }} 
                            onClick={(newValue)=> setOpenFormCreate(true)}>
                            <CardContent align="center" component='div' >
                                <AddIcon />
                                <Typography variant="body2" align="center" 
                                    style={{ marginTop: '1em', lineHeight: '1em' }}>
                                        <strong>Add a project</strong>
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <FormAddNewProject 
                    open={openFormCreate} 
                    closeModal={() => setOpenFormCreate(false)} 
                    onCreate={(newValue)=> setRows([...rows,newValue])}/>

                {rows.map((row, index) => (
                    <Grid item xl={3} md={3} sm={6} xs={6} key={row.id}>
                        <Link to={`/project/` + row.id} style={{ textDecoration: 'none' }}>
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
export default ProjectList;