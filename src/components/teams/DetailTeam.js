import React from 'react';
import {  useTheme, makeStyles } from '@material-ui/core/styles';
import {
    Grid, Paper, Button, Typography, useMediaQuery,
    TextField, Divider
} from '@material-ui/core/';
import MemberList from './MemberList';
import ProjectList from './ProjectList';
import 'fontsource-roboto';



const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        margin: '1em',
    },
    margin: {
        margin: theme.spacing(1),
    },
}));

export default function ModalDetailTeam(props) {
    const classes = useStyles();
    var open = props.open;
    const [isEditing, setIsEditing] = React.useState(false);

    const theme = useTheme();

    const handleEditingMode = (bool = false) => setIsEditing(bool);

    return (
        <div className={classes.root}>
            <Paper style={{ padding: '1em' }}>
                {actionButtons(isEditing, saveChanges, handleEditingMode)}
                <Divider />
                {OpenEditForm(isEditing)}
            </Paper>
        </div >
    );
}

const actionButtons = (isEdit, saveChanges, setEditMode) => {
    if (isEdit) {
        return (
            <React.Fragment>
                <Button onClick={
                    () => {
                        setEditMode(false);
                    }
                } color="primary"> Cancel </Button>

                <Button onClick={
                    () => {
                        saveChanges();
                        setEditMode(false);
                    }
                } color="primary"> Save changes </Button>
            </React.Fragment>
        )
    } else {
        return (
            <React.Fragment>
                <Button onClick={
                    () => setEditMode(true)
                } color="primary">Edit</Button>
            </React.Fragment>
        )
    }

}

const OpenEditForm = (isEdit) => {
    const useStyles = makeStyles((theme) => ({
        textfield: {
            marginTop: theme.spacing(1),
            width: '100%'
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
    }));

    const classes = useStyles();
    if (isEdit) {
        return (
            <Grid container spacing={2} style={{ paddingLeft: 4, paddingRight: 4 }} >
                <Grid item lg={6} md={6} sm={12} xs={12} >
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} style={{ marginTop: '1em' }}>
                    <TextField
                        type="text"
                        defaultValue="Team 1"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Typography variant="h6">Description : </Typography>
                    <TextField
                        multiline
                        rows={4}
                        defaultValue="Etiam mollis molestie turpis ac blandit. Morbi id ex condimentum, faucibus purus gravida, laoreet odio. Phasellus rhoncus, mi vel mollis luctus, felis neque semper magna, ut porta nunc ante a purus."
                        className={classes.textfield}
                    />
                    <Divider style={{ marginTop: '1em' }} />
                    <MemberList></MemberList>
                    <Divider style={{ marginTop: '1em' }} />
                    <ProjectList></ProjectList>
                </Grid>
            </Grid>
        )
    } else {
        return (
            <Grid container spacing={2} style={{ paddingLeft: 4, paddingRight: 4 }} >
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Typography variant="h5" style={{ marginTop: '1em' }}>Team 1</Typography>
                    <Typography variant="h6" style={{ marginTop: '1em' }}>Description : </Typography>
                    <Typography variant="body2">Etiam mollis molestie turpis ac blandit. Morbi id ex condimentum, faucibus purus gravida, laoreet odio. Phasellus rhoncus, mi vel mollis luctus, felis neque semper magna, ut porta nunc ante a purus. Fusce sit amet placerat felis, eget accumsan sem.</Typography>
                    <Divider style={{ marginTop: '1em' }} />
                    <MemberList></MemberList>
                    <Divider style={{ marginTop: '1em' }} />
                    <ProjectList></ProjectList>
                </Grid>
            </Grid>
        )
    }
}


const saveChanges = () => {

}