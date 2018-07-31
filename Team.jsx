import React from 'react';
import ReactTable from 'react-table';
import 'whatwg-fetch'; 

class Team extends React.Component {
    constructor() {
      super();
      var self = this;
      this.state = {
         data:[]
      };
          fetch('/team')
            .then(res => res.json())
            .then(team => this.setState({ data: team.data }));
        /*var xhttp = new XMLHttpRequest();
       xhttp.onreadystatechange = function() {
           console.log(xhttp.responseText.length);
           console.log('Team members:');
           console.log(JSON.parse(xhttp.responseText));
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var data = JSON.parse(xhttp.responseText);
          self.setState({ data: data });
        }
      };
      xhttp.open("GET", "http://localhost:3000/team", true);
      xhttp.send();*/
    }
    render() {
        
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
                data={this.state.data}
                columns={columns}
                pageSize="10"
                />
            </div>
        )
    }
 
}
export default Team;