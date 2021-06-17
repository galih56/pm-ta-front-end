import React,{useState,useEffect} from 'react';
import CanvasJSReact from '../../assets/js/canvasjs.react';
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

const restructureTaskData=(lists,prop1,prop2)=>{
    var estimations=[];
    var realizations=[];

    for (let i = 0; i < lists.length; i++) {
        const list = lists[i];
        for (let j = 0; j < list.cards.length; j++) {
            const task = list.cards[j];
            var estimationDate=moment(task[prop1]).valueOf();
            var realizationDate=moment(task[prop2]).valueOf();
            estimations.push({  id:task.id, title:task.title, progress:task.progress,  y:estimationDate, label: task.title, start: task.start, end: task.end, startLabel: task.startLabel, endLabel: task.endLabel });
            realizations.push({ id:task.id, title:task.title, progress:task.progress,  y:realizationDate,  label: task.title, start: task.start, end: task.end, startLabel: task.startLabel, endLabel: task.endLabel})
            
            for (let k = 0; k < task.cards.length; k++) {
                const subtask = task.cards[k];
                estimationDate=moment(subtask[prop1]).valueOf();
                realizationDate=moment(subtask[prop2]).valueOf();
                estimations.push({  id:subtask.id, title:subtask.title, progress:subtask.progress, y:estimationDate,  label: subtask.title, start: task.start, end: task.end, startLabel: task.startLabel, endLabel: task.endLabel});
                realizations.push({ id:subtask.id, title:subtask.title, progress:subtask.progress, y:realizationDate,   label: subtask.title, start: task.start, end: task.end, startLabel: task.startLabel, endLabel: task.endLabel})    
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

const LineChartTask=({data,title})=> {
    const [options,setOptions]=useState(null);

    useEffect(()=>{
        setOptions({
            animationEnabled: true,
            zoomEnabled: true,
            axisX: {
                title: "Dates"
            },
            axisY: {
                title: "Estimations",
                titleFontColor: "#6D78AD",
                lineColor: "#6D78AD",
                labelFontColor: "#6D78AD",
                tickColor: "#6D78AD",                   
                labelFormatter: function(e){
                    return moment(e.value).format('DD-MM-YYYY');
                }
            },
            axisY2: {
                title: "Realizations",
                titleFontColor: "#51CDA0",
                lineColor: "#51CDA0",
                labelFontColor: "#51CDA0",
                tickColor: "#51CDA0",                 
                labelFormatter: function(e){
                    return '';
                }
            },
            toolTip: {
                shared: true,
                contentFormatter: function ( e ) {
                    var title=e.entries[0].dataPoint.title;  
                    var progress=e.entries[0].dataPoint.progress;  
                    var start=e.entries[0].dataPoint.start;  
                    var end=e.entries[0].dataPoint.end;  
                    var actualStart=e.entries[0].dataPoint.actualStart;  
                    var actualEnd=e.entries[0].dataPoint.actualEnd;  
                    var y1=e.entries[0].dataPoint.y;  
                    start=moment(start).format('DD-MM-YYYY');
                    end=moment(end).format('DD-MM-YYYY');
                    actualStart=moment(actualStart).format('DD-MM-YYYY');
                    actualEnd=moment(actualEnd).format('DD-MM-YYYY');
                    return (
                        `<div>
                            ${title} (${(progress?progress:0)}%)
                            <br/>
                            Estimation : ${start} -${end}
                            <br/>
                            Realization : ${actualStart} - ${actualEnd}
                        </div>`
                    )
                }
            },
            data: [{
                type: "spline",
                name: `${title} estimations `,
                showInLegend: true,
                dataPoints: data.estimations
            },
            {
                type: "spline",
                name: `${title} realizations `,
                axisYType: "secondary",
                showInLegend: true,
                dataPoints: data.realizations
            }]
        })
    },[])
  
    return (
        <div>
            {options?<CanvasJSReact.CanvasJSChart options = {options}/>:<></>}
        </div>
    );
}
export default LineChartTask