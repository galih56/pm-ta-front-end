import React, { useState, useCallback, useEffect, memo } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Gantt from 'ibm-gantt-chart';
import GanttChart from 'ibm-gantt-chart-react';
import 'ibm-gantt-chart/dist/ibm-gantt-chart.css';
  
export default function Chart(props){
  const data = [
    {
      id: 'NURSES+Anne',
      name: 'Anne',
      activities: [
        {
          id: 'SHIFTS+Emergency+Monday+2+8',
          name: 'Emergency',
          start: 1474880400000,
          end: 1474902000000,
        },
      ],
    },
    {
      id: 'NURSES+Bethanie',
      name: 'Bethanie',
      activities: [],
    },
    {
      id: 'NURSES+Betsy',
      name: 'Betsy',
      activities: [
        {
          id: 'SHIFTS+Emergency+Wednesday+12+18',
          name: 'Emergency',
          start: 1475089200000,
          end: 1475110800000,
        },
        {
          id: 'SHIFTS+Emergency+Saturday+12+20',
          name: 'Emergency',
          start: 1475348400000,
          end: 1475377200000,
        },
        {
          id: 'SHIFTS+Consultation+Friday+8+12',
          name: 'Consultation',
          start: 1475247600000,
          end: 1475262000000,
        },
      ],
    },
    {
      id: 'NURSES+Cathy',
      name: 'Cathy',
      activities: [
        {
          id: 'SHIFTS+Emergency+Sunday+20+2',
          name: 'Emergency',
          start: 1475463600000,
          end: 1475485200000,
        },
        {
          id: 'SHIFTS+Emergency+Saturday+12+20',
          name: 'Emergency',
          start: 1475348400000,
          end: 1475377200000,
        },
        {
          id: 'SHIFTS+Emergency+Monday+18+2',
          name: 'Emergency',
          start: 1474938000000,
          end: 1474966800000,
        },
      ],
    },
    {
      id: 'NURSES+Cindy',
      name: 'Cindy',
      activities: [
        {
          id: 'SHIFTS+Emergency+Saturday+20+2',
          name: 'Emergency',
          start: 1475377200000,
          end: 1475398800000,
        },
        {
          id: 'SHIFTS+Consultation+Friday+8+12',
          name: 'Consultation',
          start: 1475247600000,
          end: 1475262000000,
        },
        {
          id: 'SHIFTS+Consultation+Tuesday+8+12',
          name: 'Consultation',
          start: 1474988400000,
          end: 1475002800000,
        },
      ],
    },
  ];
  const config = {
    data: {
      resources: { data: data,  activities: 'activities', name: 'name',  id: 'id' },
      activities: { start: 'start', end: 'end', name: 'name' },
    },
    
    toolbar: [ 
      'title', 'search', 'separator', 
      {
        type: 'button',
        text: 'Refresh',
        fontIcon: 'fa fa-refresh fa-lg',
        onclick: function(ctx) {
          ctx.gantt.draw();
        },
      },
      'fitToContent',
      'zoomIn',
      'zoomOut',
    ],
    title: 'Simple Gantt', // Title for the Gantt to be displayed in the toolbar
  };
  useEffect(()=>{
    console.log(GanttChart)
    setTimeout(()=>{
      new Gantt('gantt', config);
      var ganttBody=document.getElementsByClassName('gantt-body');
      console.log(ganttBody)
      if(ganttBody.length) ganttBody[0].style.minHeight='400px !important'; 
    },0);
  },[])
  return (
    <div id="gantt" style={{height:'100% !important'}}></div>
  );
}