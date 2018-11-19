import React from 'react';
import ReactTable from 'react-table';
import { Link } from "react-router-dom";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { ValidatorForm} from 'react-material-ui-form-validator';
import { URLs } from '../utils/URLs.js';
import ConfirmationDialog from './../components/ConfirmDialog.jsx';
import LawyerFilter from './../components/LawyerFilter.jsx';


class Lawyers extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            dataLoaded: false,
            errorText: '',
            filter: {},
            pageSize: 10,
            confirmDeleteDialogOpen: false,
            allServices: [{id: 0, name: 'DACA'},{id:1, name:'Family Reunion'}, {id:2, name: 'Deportation'}],
        };
        this.handleChangeFilter = this.handleChangeFilter.bind(this)
        this.changePageSize = this.changePageSize.bind(this);
        this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
        this.handleOpenConfirmDialog = this.handleOpenConfirmDialog.bind(this);
        this.deleteLawyerId = 0;
        this._isMounted = false;
    }
    componentDidMount() {
        this._isMounted = true;
        axios.get(URLs.services.LAWYER)
            .then(result => {
                if (this._isMounted) {
                    if (result.data.success) {
                        this.setState({
                            data: result.data.data,
                            dataLoaded: true
                        });
                    } else {
                        this.setState({
                            errorText: result.data.errMessage,
                            dataLoaded: false
                        });
                    }
                }
            })
            .catch(error => {
                this.setState({
                    errorText: 'Error: ' + error.response.statusText,
                    dataLoaded: false
                });

            });



    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    changePageSize(pageSize, pageIndex) {
        this.setState({pageSize: pageSize});
    }

    handleOpenConfirmDialog(deleteLawyerId) {
        this.deleteLawyerId = deleteLawyerId;
        this.setState({ confirmDeleteDialogOpen: true });
    }
    handleConfirmDelete(confirmed) {
        this.setState({ confirmDeleteDialogOpen: false});
        if (confirmed && this.deleteLawyerId) {
            this.deleteLawyer(this.deleteLawyerId);
        }
    }
    deleteLawyer() {
        var { filter } = this.state.filter;
        axios.delete(URLs.services.LAWYER, {params: {id: this.deleteLawyerId, filter}})
                .then(result => {
                    this.setState({
                        data: result.data.data,
                        dataLoaded: true
                    });

                })
                .catch(error => {
                    this.setState({
                        errorText: error.response.statusText,
                        dataLoaded: false
                    });

                });
    }
    handleChangeFilter(event, filter) {
        event.preventDefault();
        this.handleSubmit(filter);
        this.setState(filter);
    }
    handleSubmit(filter) {
        this.setState({ errorText: '' });
        let data = {
            params: filter
        };
        axios.get(URLs.services.LAWYER, data)
            .then(result => {
                if (result.data.success) {
                    this.setState({
                        data: result.data.data,
                        dataLoaded: true
                    });
                } else {
                    this.setState({
                        errorText: result.data.errMessage,
                        dataLoaded: false
                    });
                }
            })
            .catch(error => {
                this.setState({
                    errorText: error.response.statusText,
                    dataLoaded: false
                });

            });
    }
    render() {
        const errorText = this.state.errorText;

        const columns = [
            {
                Header: 'Name',
                accessor: 'name', // String-based value accessors!
                Cell: (props) => <Link to={URLs.pages.ATTORNEY + props.row.id}>{props.value}</Link>
            }, {
                Header: 'Zip',
                accessor: 'zip',
            }, {
                Header: 'E-mail',
                accessor: 'email'
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
                <div className="container pageContent">
                    <h1>Attorneys</h1>
                    <div className="filtered-layout">
                        <LawyerFilter onChange={this.handleChangeFilter}></LawyerFilter>
                        <div className="result">
                            <div className="error">{errorText}</div>
                            <ReactTable
                                data={this.state.data}
                                columns={columns}
                                pageSize={this.state.pageSize}
                                onPageSizeChange={this.changePageSize}
                            />
                        </div>
                        <ConfirmationDialog
                            open={this.state.confirmDeleteDialogOpen}
                            onClose={this.handleConfirmDelete}
                            title="Confirm delete"
                            text="Do you want to delete the attorney?"
                        />
                    </div>
                </div>
            );
        //}
    }

}
export default Lawyers;