import React from 'react';
import ReactTable from 'react-table';
import axios from 'axios';

class Team extends React.Component {
    constructor() {
        super();

        this.state = {
            data: [],
            dataLoaded: false
        };

    }
    componentDidMount() {
        axios.get('/api/team')
            .then(result => {
                this.setState({
                    data: result.data.data,
                    dataLoaded: true
                });
            })
            .catch(error => {
                console.log('error::');
                console.log('bebebe:' + error);
                this.setState({
                    error: error.Error,
                    dataLoaded: false
                });

            });
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
        
 
        return (
                <div className="container">
                    <h1>Team</h1>
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