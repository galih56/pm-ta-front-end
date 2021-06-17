import react from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import moment from 'moment'
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const data = [{ id: 1, title: 'Conan the Barbarian', summary: 'Orphaned boy Conan is enslaved after his village is destroyed...',  year: '1982', image: 'http://conan.image.png' } ...];
const columns = [
  {
    name: 'Title',
    sortable: true,
    cell: row => (
            <div>
              <div style={{ fontWeight: 700 }}>
                {row.title}
              </div>
              {row.summary}
            </div>
        ),
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
    title="Arnold Movies"
    columns={columns}
    data={data}
    selectableRows
    selectableRowsComponent={Checkbox}
    selectableRowsComponentProps={{ inkDisabled: true }}
    sortIcon={ChevronRightIcon}
    onSelectedRowsChange={handleChange}
    expandableRows
    expandableRowsComponent={<ExpandableComponent />}/>
  ) 
}
export default Table;