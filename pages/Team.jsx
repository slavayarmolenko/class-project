import React from 'react';
import ReactTable from 'react-table';
import 'whatwg-fetch';

class Team extends React.Component {
    constructor() {
        super();

        this.state = {
            data: [],
            dataLoaded: false
        };

    }
    render() {
        console.log('render team');
        const columns = [{
                Header: 'Name',
                accessor: 'name' // String-based value accessors!
            }, {
                Header: 'Role',
                accessor: 'role',
                Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
            }];
        var self = this;
        fetch('/api/team')
                .then(function (res) {
                    console.log('Getting response');
                    console.log(res);
                    return res.json();
                })
                .then(function (team) {
                    console.log('Getting json');
                    console.log(team);
                    if(!self.state.dataLoaded){
                        self.setState({data : team.data, dataLoaded: true });
                    }
                });
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