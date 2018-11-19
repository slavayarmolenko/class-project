import React from 'react';
import ReactTable from 'react-table';
import axios from 'axios';
import {URLs} from '../utils/URLs.js';

class Companies extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            dataLoaded: false,
            errorText: ''
        };

    }
    componentDidMount() {
        axios.get(URLs.services.COMPANY, { params: { companyType: this.props.companyType }})
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
        const columns = [
            {
                Header: 'Name',
                accessor: 'name', // String-based value accessors!
                Cell: (props) => <Link to={URLs.pages.ATTORNEY + props.row.id}>{props.value}</Link>
            }, {
                Header: 'description',
                accessor: 'description',
            },
            {
                Header: 'Delete',
                accessor: 'id',
                className: 'center',
                Cell: (props) => <Button onClick={() => {
                    this.handleOpenConfirmDialog(props.row.id);
                }}>x</Button>
            },
        ];
        
 
        return (
                    <ReactTable
                        data={this.state.data}
                        columns={columns}
                        pageSize="10"
                        />
                )
    }

}
export default Companies;