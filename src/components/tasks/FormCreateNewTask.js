import react,{useState,useContext,useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import MobileDateRangePicker from '@material-ui/lab/MobileDateRangePicker';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import SelectTag from './../widgets/SelectTag';
import UserSearchBar from '../widgets/UserSearchBar';
import moment from 'moment';
import axios from 'axios';
import UserContext from './../../context/UserContext';

const FormCreateNewTask=({classes,newTask,setNewTask,handleAddNewTask,detailProject,isSubtask})=>{
    const global=useContext(UserContext);
    const handleTagChanges = (tags) => setNewTask({ ...newTask, tags: tags });
    const [dateRange, setDateRange] = useState([null, null]);
    
    useEffect(()=>{
        setNewTask({...newTask,isSubtask:isSubtask});
    },[]);
    
    return (
        <Grid container spacing={2} style={{ paddingLeft: "1em", paddingRight: "1em",paddingTop:"1em" }} component="form" 
            onSubmit={(e) => { 
                e.preventDefault(); 
                handleAddNewTask();
            }} >
            <Grid item lg={6} md={6} sm={6} xs={12}>
                <TextField
                    label="Title : "
                    onChange={
                        (e) => { 
                            setNewTask({ ...newTask, title: e.target.value }); 
                        }
                    }
                    placeholder={"Example : Redesigning UI"}
                    style={{ width: '100%' }}
                    variant="standard" 
                    required
                />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={12}>
                <TextField
                    label="Progress : (%)"
                    onChange={(e) => {
                        setNewTask({ ...newTask, progress: e.target.value });
                    }}
                    className={classes.textfield}
                    type="number"
                    variant="standard" 
                    required
                />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12} container>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDateRangePicker
                         required
                         startText="Start : "
                        endText="End : "
                        value={dateRange}
                        onChange={(newValue) => {
                            var start= newValue[0];
                            var end= newValue[1];
                            setDateRange(newValue)
                            if(start){
                                start=moment(newValue[0]).format('YYYY-MM-DD HH:mm:ss'); 
                                setNewTask({ ...newTask,start : start })
                            }
                            if(end){ 
                                end=moment(newValue[1]).format('YYYY-MM-DD HH:mm:ss');
                                setNewTask({ ...newTask,end : end })
                            }
                        }}
                        renderInput={(startProps, endProps) => (
                        <>
                            <TextField {...startProps} variant="standard" required />
                            <Box sx={{ mx: 2 }}> to </Box>
                            <TextField {...endProps}  variant="standard"  required/>
                        </>
                        )}
                    />
                </LocalizationProvider>  
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <UserSearchBar 
                    detailProject={detailProject}
                    exceptedUsers={[ {
                        id:global.state.id,
                        name:global.state.name,
                        username:global.state.username,
                        email:global.state.email
                    }]} 
                    onChange={(users)=>{
                        setNewTask({...newTask,members:[...users]});
                    }}
                />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <SelectTag onChange={handleTagChanges} isEdit={true} defaultValue={[]}/>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography>Description : </Typography>
                <TextField 
                    variant="standard" 
                    multiline 
                    rows={4}
                    style={{ width: '100%' }}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value }) } />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <Button type="submit" variant="contained" color="primary">Add</Button>
            </Grid>
        </Grid>
    )
}
export default FormCreateNewTask;