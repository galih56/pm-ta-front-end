import { GanttComponent,Inject,Edit,Selection,Sort ,ContextMenu,ColumnsDirective, ColumnDirective} from '@syncfusion/ej2-react-gantt';
import './../../assets/css/syncfusion-gantt.css';
import * as React from 'react';
import moment from 'moment';

class GanttChart extends React.Component {
    constructor(props) {
        super(props);
        this.taskFields = {
            id: 'id', name: 'title', startDate: 'start', endDate:'end',
            duration: 'duration', progress: 'progress', child: 'cards',
        };
        this.splitterSettings = {
            position: "30%"
        };
        this.palette = ["#E94649", "#F6B53F", "#6FAAB0", "#C4C24A"];
    }
    
    customizeCell(args){
        if (args.column.field == "Progress") {
            if (args.data.Progress < 10)
                args.cell.style.backgroundColor = "lightgreen";
            else
                args.cell.style.backgroundColor = "yellow";
        }
    }
    rowDataBound(args){
        if (args.data.TaskID == 4)
            args.row.style.backgroundColor = "red";
    }
    render() {
        return(
            <GanttComponent 
                dataSource={this.props.detailProject.columns} 
                height="450px" 
                taskFields={this.taskFields}
                allowSort={true}
                recordDoubleClick={(row)=>{
                    if(!row.rowData.taskData.isList){
                        this.props.handleDetailTaskOpen({
                            open:true,
                            taskId:row.rowData.taskData.id
                        })
                    }
                }}
                splitterSettings={this.splitterSettings}
                queryCellInfo={this.customizeCell.bind(this)}
                rowDataBound={this.rowDataBound.bind(this)}
            >
                <Inject services={[Selection, Sort ]}/>
                <ColumnsDirective>
                        <ColumnDirective field='title' width='300'></ColumnDirective>
                        <ColumnDirective field='start' width='100'></ColumnDirective>
                        <ColumnDirective field='end' width='100'></ColumnDirective>
                        <ColumnDirective field='progress' width='70'></ColumnDirective>
                        <ColumnDirective field='duration' width='70'></ColumnDirective>
                </ColumnsDirective>
            </GanttComponent>     
        )
};
}

export default GanttChart