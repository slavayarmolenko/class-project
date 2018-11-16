import React from 'react';
import ReactTable from 'react-table';
import axios from 'axios';
import {URLs} from './../utils/URLs.js';

class Partners extends React.Component {
    constructor() {
        super();

        this.state = {
            data: [],
            dataLoaded: false,
            errorText: ''
        };

    }
    componentDidMount() {
        axios.get(URLs.services.PARTNER)
            .then(result => {
                this.setState({
                    data: result.data.data,
                    dataLoaded: true
                });
            })
            .catch(error => {
                this.setState({
                    errorText: 'Error: ' + error.response.statusText,
                    dataLoaded: false
                });

            });
    }
    render() {
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
                <div className="container pageContent">
                    <h1>Partners</h1>
                    <div className="error">{this.state.errorText}</div>
                    <ReactTable
                        data={this.state.data}
                        columns={columns}
                        pageSize="10"
                        />
                </div>
                )
    }

}
export default Partners;