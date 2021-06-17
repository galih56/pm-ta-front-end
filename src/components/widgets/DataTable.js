import react from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import moment from 'moment'

const data = [
  { 
    id: 1, 
    title: 'Conan the Barbarian', 
    summary: 'Orphaned boy Conan is enslaved after his village is destroyed',  
    year: '1982' 
  } 
];
/*
const ExpandableRow = ({ row }) => (
  <div>
    {row.childrenTasks.map((child)=>{
      
    })}
  </div>
);
*/
const columns = [
  {
    name: 'Title',
    sortable: true,
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
    right: true,
  },
];

const handleChange = (state) => {
  // You can use setState or dispatch with something like Redux so we can use the retrieved data
  console.log('Selected Rows: ', state.selectedRows);
};

const Table=()=>{
  return (
    <DataTable
      title=""
      columns={columns}
      data={data}
      onSelectedRowsChange={handleChange}
    />
  ) 
}
export default Table;