import React from 'react';
import ReactTable from 'react-table';
import { Link } from "react-router-dom";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { URLs } from '../utils/URLs.js';
import ConfirmationDialog from './../components/ConfirmDialog.jsx';


class Lawyers extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            dataLoaded: false,
            errorText: '',
            filter: {
                distance: 10,
                usersZip: '',
                units: 'mil',
            },
            pageSize: 10,
            confirmDeleteDialogOpen: false,
            allServices: [{id: 0, name: 'DACA'},{id:1, name:'Family Reunion'}, {id:2, name: 'Deportation'}],
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeFilter = this.handleChangeFilter.bind(this);
        this.changePageSize = this.changePageSize.bind(this);
        this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
        this.handleOpenConfirmDialog = this.handleOpenConfirmDialog.bind(this);
        this.deleteLawyerId = 0;
        this._isMounted = false;
    }
    componentDidMount() {
        this._isMounted = true;
        ValidatorForm.addValidationRule('isZip', (value) => {
            if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value)) {
                return true;
            }
            return false;
        });

        axios.get(URLs.services.LAWYER)
            .then(result => {
                if (this._isMounted) {
                    this.setState({
                        data: result.data.data,
                        dataLoaded: true
                    });
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
    handleChangeFilter(event) {
        const { filter } = this.state;
        
        if (event.target.type === 'checkbox') {
            filter[event.target.name] = event.target.checked;
        } else {
            filter[event.target.name] = event.target.value;
        }
        this.setState({ filter });
    }
    handleSubmit(event) {
        event.preventDefault();
        this.setState({ errorText: '' });
        let data = {
            params: this.state.filter
        };
        if (data.usersZip !== '' && data.distance !== '' && data.description !== '') {
            axios.get(URLs.services.LAWYER, data)
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



        } else {
            alert('Some data is not filled');
        }
    }
    render() {
        const errorText = this.state.errorText;

        const {distance, usersZip, units } = this.state.filter;

        const columns = [
            {
                Header: 'Name',
                accessor: 'name', // String-based value accessors!
                Cell: (props) => <Link to={URLs.pages.ATTORNEY + props.row.id}>{props.value}</Link>
            }, {
                Header: 'E-mail',
                accessor: 'email',
            }, {
                Header: 'Description',
                accessor: 'description'
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
                        <div className="filter">
                            <ValidatorForm 
                                onSubmit={this.handleSubmit}
                                onError={errors => console.log(errors)}
                            >   
                                <div className="error">{errorText}</div>
                                <div><TextValidator
                                    label="Zip Code"
                                    onChange={this.handleChangeFilter}
                                    name="usersZip"
                                    type="text"
                                    value={usersZip}
                                    validators={['required', 'isZip']}
                                    errorMessages={['this field is required', 'Zip Code is not valid']}
                                /></div>
                                <div>
                                    <TextValidator
                                    label="Distance"
                                    onChange={this.handleChangeFilter}
                                    name="distance"
                                    type="number"
                                    validators={['required', 'isNumber']}
                                    errorMessages={['this field is required', 'distance should be numeric']}
                                    value={distance}/>
                                </div>
                                <div>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Units</FormLabel>
                                        <RadioGroup
                                            aria-label="Units"
                                            name="units"
                                            value={units}
                                            onChange={this.handleChangeFilter}
                                            row
                                        >
                                            <FormControlLabel value="mil" control={<Radio />} label="Miles" />
                                            <FormControlLabel value="km" control={<Radio />} label="Km" />
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                                <Button type="submit" color="primary" variant="contained">Filter</Button>
                            </ValidatorForm>
                            
                        </div>
                        <div className="result">
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