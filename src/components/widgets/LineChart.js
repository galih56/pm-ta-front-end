import React,{useState,useEffect} from 'react';
import CanvasJSReact from '../../assets/js/canvasjs.react';
import moment from 'moment';

function compareDataPointXAscend(dataPoint1, dataPoint2) {
    return dataPoint1.x - dataPoint2.x;
}

function compareDataPointYDescend(dataPoint1, dataPoint2) {
    return dataPoint2.y - dataPoint1.y;
}

const LineChart=({data,title})=> {
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
                        Plan : ${start} - ${end}<br/>
                        Realization : ${actualStart} - ${actualEnd} <br/>
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