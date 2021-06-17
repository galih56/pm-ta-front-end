import React,{useState,useEffect} from 'react';
import Grid from '@material-ui/core/Typography';
import Typography from '@material-ui/core/Typography';
import LineChart from '../widgets/LineChart';
import LineChartTask from '../widgets/LineChartTask';
import moment from 'moment';

const groupByStatus=(tasks)=>{
    var mulaiCepat=[];
    var selesaiCepat=[];
    var mulaiTepatWaktu=[];
    var selesaiTepatWaktu=[];
    var selesaiCepat=[];
    var mulaiTelat=[];
    var selesaiTelat=[];
    var belumDilaksanakan=[];
    var belumSelesai=[];
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];    
        switch (task.startLabel.toLowerCase()) {
            case 'mulai lebih cepat':
                mulaiCepat.push(task)
                break;
            case 'mulai tepat waktu':
                mulaiTepatWaktu.push(task)
                break;
            case 'mulai terlambat':
                mulaiTelat.push(task);
                break;
            case 'belum dilaksanakan' || 'belum dilakukan':
                belumDilaksanakan.push(task)
                break;
            default:
                belumDilaksanakan.push(task)
                break;
        }   
        switch (task.endLabel.toLowerCase()) {
            case 'selesai lebih cepat':
                selesaiCepat.push(task)
                break;
            case 'selesai tepat waktu':
                selesaiTepatWaktu.push(task)
                break;
            case 'selesai terlambat':
                selesaiTelat.push(task)
                break;
            case 'belum selesai':
                belumSelesai.push(task);
                break;
            default:
                belumSelesai.push(task);
                break;
        }
    }
    return {
        mulaiCepat : mulaiCepat,
        selesaiCepat : selesaiCepat,
        mulaiTepatWaktu : mulaiTepatWaktu,
        selesaiTepatWaktu : selesaiTepatWaktu,
        selesaiCepat : selesaiCepat,
        mulaiTelat : mulaiTelat,
        selesaiTelat : selesaiTelat,
        belumDilaksanakan : belumDilaksanakan,
        belumSelesai : belumSelesai
    }
}


const Overview=({detailProject,refreshDetailProject,handleDetailTaskOpen})=>{
    const [groupedTasks,setGroupedTasks]=useState({
        mulaiCepat : [], selesaiCepat : [], mulaiTepatWaktu : [], selesaiTepatWaktu : [],
        selesaiCepat : [], mulaiTelat : [], selesaiTelat : [], belumDilaksanakan : [], belumSelesai : []
    })
    const [starts,setStarts]=useState({ estimations:[], realizations: [] });
    const [ends,setEnds]=useState({ estimations:[], realizations: [] });

    const dataPointOnClick=function(e){
        var dp=e.dataPoint
        handleDetailTaskOpen({taskId:dp.id,...dp,open:true})
    }
    
    const restructureTaskData=(lists,prop1,prop2)=>{
        var estimations=[];
        var realizations=[];
    
        for (let i = 0; i < lists.length; i++) {
            const list = lists[i];
            for (let j = 0; j < list.cards.length; j++) {
                const task = list.cards[j];
                var estimationDate=moment(task[prop1]);
                var realizationDate=moment(task[prop2]);
                estimations.push({  id:task.id, title:task.title, progress:task.progress,x: estimationDate.valueOf(), y:estimationDate.valueOf(), start: task.start, end: task.end, actualStart: task.actualStart, actualEnd: task.actualEnd, click:dataPointOnClick , startLabel: task.startLabel, endLabel: task.endLabel});
                realizations.push({ id:task.id, title:task.title, progress:task.progress,x:realizationDate.valueOf(),  y:realizationDate.valueOf(),  start: task.start, end: task.end, actualStart: task.actualStart, actualEnd: task.actualEnd, click:dataPointOnClick , startLabel: task.startLabel, endLabel: task.endLabel})
                
                for (let k = 0; k < task.cards.length; k++) {
                    const subtask = task.cards[k];
                    estimationDate=moment(subtask[prop1]);
                    realizationDate=moment(subtask[prop2]);
                    estimations.push({  id:subtask.id, title:subtask.title, progress:subtask.progress, x: estimationDate.valueOf(), y:estimationDate.valueOf(), start: task.start, end: task.end, actualStart: task.actualStart, actualEnd: task.actualEnd, click:dataPointOnClick , startLabel: task.startLabel, endLabel: task.endLabel});
                    realizations.push({ id:subtask.id, title:subtask.title, progress:subtask.progress,x: realizationDate.valueOf(), y:realizationDate.valueOf(), start: task.start, end: task.end, actualStart: task.actualStart, actualEnd: task.actualEnd, click:dataPointOnClick , startLabel: task.startLabel, endLabel: task.endLabel})    
                } 
            } 
        }
        const groupedTasks=groupByStatus(estimations)
        const results= {
            estimations:estimations,
            realizations:realizations,
            groupedTasks:groupedTasks
        }
        
        return results;
    }

    useEffect(()=>{
        if(!detailProject) refreshDetailProject()
        var startsData=restructureTaskData(detailProject.columns,'start','actualStart');
        var endsData=restructureTaskData(detailProject.columns,'end','actualEnd');
        setStarts({ estimations:startsData.estimations, realizations:startsData.realizations });
        setEnds({ estimations:endsData.estimations, realizations:endsData.realizations })
        setGroupedTasks(startsData.groupedTasks);
    },[])

    return(
        <Grid container>
            <Grid item xl={12} md={12} sm={12} xs={12} >
                <Typography variant="h5">Tasks overview : </Typography>
            </Grid>
            <Grid item xl={12} md={12} sm={12} xs={12} >
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <Typography variant="body1">Total tasks : </Typography>
                            </td>
                            <td> 
                                <Typography variant="body1">{starts.estimations.length}</Typography>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Typography variant="body1">Belum dilaksanakan : </Typography>
                            </td>
                            <td> 
                                <Typography variant="body1">{groupedTasks.belumDilaksanakan.length}</Typography> 
                            </td>
                            <td>
                                <Typography variant="body1">Belum selesai : </Typography>
                            </td>
                            <td> 
                                <Typography variant="body1">{groupedTasks.belumSelesai.length}</Typography> 
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Typography variant="body1">Mulai lebih cepat : </Typography>
                            </td>
                            <td>
                                <Typography variant="body1">{groupedTasks.mulaiCepat.length}</Typography>
                            </td>
                            <td>
                                <Typography variant="body1">Selesai lebih cepat : </Typography>
                            </td>
                            <td>
                                <Typography variant="body1">{groupedTasks.mulaiCepat.length}</Typography> 
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Typography variant="body1">Selesai tepat waktu : </Typography>
                            </td>
                            <td>
                                <Typography variant="body1">{groupedTasks.mulaiTepatWaktu.length}</Typography> 
                                </td>
                            <td>
                                <Typography variant="body1">Mulai tepat waktu : </Typography>
                            </td>
                            <td> 
                                <Typography variant="body1">{groupedTasks.mulaiTepatWaktu.length}</Typography> 
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Typography variant="body1">Mulai terlambat : </Typography>
                            </td>
                            <td> 
                                <Typography variant="body1">{groupedTasks.mulaiTelat.length}</Typography>  
                            </td>
                            <td>
                                <Typography variant="body1">Selesai terlambat : </Typography>
                            </td>
                            <td> 
                                <Typography variant="body1">{groupedTasks.selesaiTelat.length}</Typography>   
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Grid>
            <Grid item xl={12} md={12} sm={12} xs={12} style={{marginTop:'1em'}}>
                <Typography variant="body2">Starts : </Typography>
                <LineChart projectId={detailProject.id} data={starts} title={'Starts'}  handleDetailTaskOpen={handleDetailTaskOpen}/>  
            </Grid>
            <Grid item xl={12} md={12} sm={12} xs={12} >
                <Typography variant="body2">Ends : </Typography>
                <LineChart projectId={detailProject.id} data={ends} title={'Ends'}  handleDetailTaskOpen={handleDetailTaskOpen}/>  
            </Grid>
        </Grid>
    )
}
export default Overview;