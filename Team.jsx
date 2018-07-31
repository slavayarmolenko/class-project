import React from 'react';
import ReactTable from 'react-table';

class Team extends React.Component {
    render() {
        const data = [{name: "Slava", role:"UI programmer/God, just god"},{name:"Vika", role:"CEO"}];
const columns = [{
    Header: 'Name',
    accessor: 'name' // String-based value accessors!
  }, {
    Header: 'Role',
    accessor: 'role',
    Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
  }]
        return (
            <div>
                <ReactTable
                data={data}
                columns={columns}
                pageSize="10"
                />
            </div>
        )
    }
 
}
export default Team;