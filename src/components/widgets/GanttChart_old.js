import React, { useState, useCallback, useEffect, memo } from 'react';
import moment from 'moment';
import GSTC from 'gantt-schedule-timeline-calendar';
import { Plugin as TimelinePointer } from 'gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as Selection } from 'gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js';
// import { Plugin as ItemResizing } from 'gantt-schedule-timeline-calendar/dist/plugins/item-resizing.esm.min.js';
// import { Plugin as ItemMovement } from 'gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js';
import { Plugin as ProgressBar } from 'gantt-schedule-timeline-calendar/dist/plugins/progress-bar.esm.min.js';
// import { Plugin as DependencyLines } from 'gantt-schedule-timeline-calendar/dist/plugins/dependency-lines.esm.min.js';
// import { Plugin as CalendarScroll } from 'gantt-schedule-timeline-calendar/dist/plugins/calendar-scroll.esm.min.js';
import 'gantt-schedule-timeline-calendar/dist/style.css';

let gstc, state;
const GSTCID = GSTC.api.GSTCID;
const columnsFromDB = [
    {
        id: GSTCID('label'),
        data: 'label',
        sortable: 'label',
        isHTML: false,
        expander: true,
        width: 180,
        header: {
            content: 'Label',
        },
    },
];


function GanttChart(props) {
    const handleDetailTaskOpen = props.handleDetailTaskOpen;

    useEffect(() => {
        var elm = document.getElementById('gantt-chart-wrapper');
        if (elm) initializeGSTC(elm, props.detailProject);
        console.log('Data update (ganttchart) : ', props.detailProject);
    }, [props.detailProject.columns]);

    //converts kanban columns into gantt chart rows
    const getRows = (data) => {
        var rows = [];
        var columns = data.columns;
        const detailProject = props.detailProject
        var projectStart = detailProject.createdAt;
        // const newItem = {
        //     id: GSTCID(detailProject.title),
        //     label: detailProject.title,
        //     rowId: GSTCID(detailProject.id + '-' + detailProject.title),
        //     time: {
        //         start: GSTC.api
        //             .date()
        //             .startOf('day')
        //             .valueOf(detailProject.createdAt),
        //         // end: GSTC.api
        //         //     .date(card.dueOn)
        //         //     .endOf('day')
        //         //     .valueOf()
        //     }
        // }
        // console.log(newItem, projectStart, moment(projectStart).format('YYYY-MM-DD HH:mm'))
        // items.push(newItem);
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            const newRow = {
                id: column.id,
                label: column.title,
                
            };
            rows.push(newRow);
        }
        return rows;
    }


    const getItems = (data) => {
        var items = [];
        var columns = data.columns;
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            const cards = column.cards;
            for (let j = 0; j < cards.length; j++) {
                const card = cards[j];
                if (card.complete == true) card.progress = 100;
                const newItem = {
                    id: card.id,
                    label: card.title,
                    rowId: column.id,
                    progress: card.progress,
                    time: {
                        start: GSTC.api
                            .date(card.start)
                            .startOf('day')
                            .valueOf(),
                        end: GSTC.api
                            .date(card.end)
                            .endOf('day')
                            .valueOf()
                    }
                }
                items.push(newItem);
            }
        }
        return items;
    }

    function fromArray(array) {
        const GSTCID = GSTC.api.GSTCID; // [IMPORTANT] every id must be wrapped by this function
        const resultObj = {};
        for (const item of array) {
            item.id = GSTCID(item.id);
            if ('rowId' in item) {
                item.rowId = GSTCID(item.rowId);
            }
            if ('parentId' in item) {
                item.parentId = GSTCID(item.parentId);
            }
            resultObj[item.id] = item;
        }
        return resultObj;
    }

    function initializeGSTC(element, data) {
        const config = {
            licenseKey:
                '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',
            plugins: [TimelinePointer(), Selection(), ProgressBar()], /* ItemResizing(), ItemMovement()*/
            list: {
                columns: {
                    data: fromArray(columnsFromDB)
                },
                rows: fromArray(getRows(data)),
                expander: {
                    padding: 5,
                    size: 5
                }
            },
            chart: {
                items: fromArray(getItems(data)),
            },
            actions: {
                'chart-timeline-items-row-item': [onItemClick],
            },
        };
        state = GSTC.api.stateFromConfig(config);
        gstc = GSTC({
            element,
            state,
        });
    }

    function onItemClick(element, data) {
        function onClick(event) {
            var taskId = data.item.id.replace("gstcid-", '');
            var listId = data.item.rowId.replace("gstcid-", '');
            handleDetailTaskOpen({ projectId: props.detailProject.id, listId: listId, taskId: taskId, open: true });
        }
        element.addEventListener('click', onClick);
        return {
            update(element, newData) { data = newData;/*data from parent scope updated*/ },
            destroy(element, data) { element.removeEventListener('click', onClick); },
        };
    }

    return (
        <React.Fragment>
            <div className="App">
                <div className="gstc-wrapper" id="gantt-chart-wrapper"></div>
            </div>
        </React.Fragment>
    );
}

export default memo(GanttChart);
