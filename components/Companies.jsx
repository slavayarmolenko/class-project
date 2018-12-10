import React from 'react';
import ReactTable from 'react-table';
import axios from 'axios';
import {URLs} from '../utils/URLs.js';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { common } from '../utils/common.js';

class Companies extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            dataLoaded: false,
            errorText: ''
        };
        this._isMounted = false;

    }
    componentDidMount() {
        this._isMounted = true;
        axios.get(URLs.services.COMPANY, { params: { companyType: this.props.companyType }})
            .then(result => {
                if (!common.processError(result, this, 'retrieving companies list')) {
                    this.setState({
                        data: result.data.data,
                        dataLoaded: true
                    });
                }
            })
            .catch(error => {
                common.processError(error, this, 'retrieving companies list');

            });
    }
    componentWillUnmount() {
        this._isMounted = false;
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