import React,{useState,useEffect} from 'react';
import CanvasJSReact from '../../assets/js/canvasjs.react';
import moment from 'moment';
function compareDataPointXAscend(dataPoint1, dataPoint2) {
    return dataPoint1.x - dataPoint2.x;
}

function compareDataPointYDescend(dataPoint1, dataPoint2) {
    return dataPoint2.y - dataPoint1.y;
}

const LineChart=({detailProject,title,handleDetailTaskOpen})=> {
    const [data,setData]=useState({
        estimations : [],
        realizations : []
    })
    useEffect(()=>{
        var tasks=restructureTaskData(detailProject.columns,'start','actualStart');
        setData(tasks);
    },[])

    
    const restructureTaskData=(lists,prop1,prop2)=>{
        var estimations=[];
        var realizations=[];
            
        const dataPointOnClick=function(e){
            var dp=e.dataPoint
            handleDetailTaskOpen({taskId:dp.id,...dp,open:true})
        }
        for (let i = 0; i < lists.length; i++) {
            const list = lists[i];
            for (let j = 0; j < list.cards.length; j++) {
                const task = list.cards[j];
                var estimationDate=moment(task[prop1]);
                var realizationDate=moment(task[prop2]);
                estimations.push({  id:task.id, title:task.title, progress:task.progress,x: estimationDate.valueOf(), y:estimationDate.valueOf(), start: task.start, end: task.end, actualStart: task.actualStart, actualEnd: task.actualEnd, click:dataPointOnClick });
                realizations.push({ id:task.id, title:task.title, progress:task.progress,x:realizationDate.valueOf(),  y:realizationDate.valueOf(),  start: task.start, end: task.end, actualStart: task.actualStart, actualEnd: task.actualEnd, click:dataPointOnClick})
                
                for (let k = 0; k < task.cards.length; k++) {
                    const subtask = task.cards[k];
                    estimationDate=moment(subtask[prop1]);
                    realizationDate=moment(subtask[prop2]);
                    estimations.push({  id:subtask.id, title:subtask.title, progress:subtask.progress, x: estimationDate.valueOf(), y:estimationDate.valueOf(), start: task.start, end: task.end, actualStart: task.actualStart, actualEnd: task.actualEnd, click:dataPointOnClick});
                    realizations.push({ id:subtask.id, title:subtask.title, progress:subtask.progress,x: realizationDate.valueOf(), y:realizationDate.valueOf(), start: task.start, end: task.end, actualStart: task.actualStart, actualEnd: task.actualEnd, click:dataPointOnClick})    
                } 
            } 
        }  
        const results= {
            estimations:estimations,
            realizations:realizations,
        }
        console.log({results})
        return results;
    }
    var options = {
        animationEnabled: true,
		zoomEnabled: true,
        axisX: {
            title: "Dates",
            labelFormatter: function ( e ) {       
                return moment(e.value).format('DD-MM-YYYY');
             }  
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
                var task_title=e.entries[0].dataPoint.title;  
                var progress=e.entries[0].dataPoint.progress;  
                var start=e.entries[0].dataPoint.start;  
                var actualStart=e.entries[0].dataPoint.actualStart;  
                var end=e.entries[0].dataPoint.end;  
                var actualEnd=e.entries[0].dataPoint.actualEnd;
                start=moment(start).format('DD-MM-YYYY');
                actualStart=moment(actualStart).format('DD-MM-YYYY');
                end=moment(end).format('DD-MM-YYYY');
                actualEnd=moment(actualEnd).format('DD-MM-YYYY');
                return (
                    `<div>
                        ${task_title} (${(progress?progress:0)}%) <br/>
                        Planned to ${title} at ${start} <br/>
                        Realization ${title} at ${actualStart} <br/>
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
    }
       
       options.data[0].dataPoints.sort(compareDataPointXAscend);   
       options.data[1].dataPoints.sort(compareDataPointXAscend);   
    return (
        <div>
            <CanvasJSReact.CanvasJSChart options = {options}
                /* onRef = {ref => this.chart = ref} */
            />
        </div>
    );
}
export default LineChart