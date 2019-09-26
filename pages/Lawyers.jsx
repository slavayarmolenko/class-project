import React from 'react';
import ReactTable from 'react-table';
import { Link } from "react-router-dom";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { URLs } from '../utils/URLs.js';
import ConfirmationDialog from './../components/ConfirmDialog.jsx';
import LawyerFilter from './../components/LawyerFilter.jsx';
import {connect} from 'react-redux';
import {getItems, deleteItem} from '../actions/itemsActions';
import {ATTORNEY} from '../actions/entities';
import PropTypes from 'prop-types';
import {DELETE_ITEM, GET_ITEMS} from '../actions/types';
import {errors} from '../api/errorTypes';
//import { access } from 'fs';


class Lawyers extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            dataLoaded: false,
            errorText: '',
            filter: {},
            pageSize: 10,
            confirmDeleteDialogOpen: false
        };
        this.handleChangeFilter = this.handleChangeFilter.bind(this)
        this.changePageSize = this.changePageSize.bind(this);
        this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
        this.handleOpenConfirmDialog = this.handleOpenConfirmDialog.bind(this);
        this.deleteLawyerId = 0;
        this._isMounted = false;
        this.checkLogin = this.checkLogin.bind(this);
    }
    componentWillMount() {
        this.props.getItems(ATTORNEY);
    }
    componentDidMount() {
        this._isMounted = true;
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
    deleteLawyer(deleteLawyerId) {
        var { filter } = this.state;
        this.props.deleteItem(ATTORNEY, deleteLawyerId, filter);
    }
    handleChangeFilter(filter) {
        this.handleSubmit(filter);
        this.setState({ filter: filter });
    }
    handleSubmit(filter) {
        this.setState({ errorText: '' });
        let data = filter;
        this.props.getItems(ATTORNEY, data);
    }
    checkLogin(){
        axios.get("/api/login")
            .then(result => {
                alert(result.data.logged);
            })
    }
    componentWillReceiveProps(nextProps) {
        if ((nextProps.errors.length > this.props.errors.length)) {
            const lastErr = nextProps.errors[nextProps.errors.length - 1];
            if (lastErr.entity === ATTORNEY) {
                if (lastErr.errCode === errors.UNAUTHORIZED) {
                    return (<Redirect to={URLs.pages.LOGIN} />);
                } else {
                    this.setState({ errorText: 'Error while ' + 
                        (lastErr.action === DELETE_ITEM ? 'deleting' : 'retrieving') +
                        'attorneys: ' + lastErr.text 
                    });
                }
            }
        }
    }
    render() {
        const errorText = this.state.errorText;
        const logged = this.props.logged;
        const data = this.props.data instanceof Array ? this.props.data : [];
        var distanceHeader = "Distance (" +  this.state.filter.units + ")";
        
        const columns = [
            {
                Header: 'Image',
                accessor: 'url',
                width: 50,
        
                Cell: (props) => <img src={props.row.url} height={20}/>
            },
            {
                Header: 'Name',
                accessor: 'name', // String-based value accessors!
                Cell: (props) => <Link to={URLs.pages.ATTORNEY + props.row.id}>{props.value}</Link>
            }, {
                Header: distanceHeader,
                accessor: 'distance',
            }, {
                Header: 'E-mail',
                accessor: 'email'
            },
            {
                Header: 'Delete',
                show: logged,
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
                            {logged && (
                                <div className="buttons"> 
                                    <Button component={Link} to={URLs.pages.CREATE_ATTORNEY} color="primary" variant="outlined">Create Attorney</Button>
                                </div>
                            ) }
                            <ReactTable
                                data={data}
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

Lawyers.propTypes = {
    getItems: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,

    data: PropTypes.array.isRequired, 
    logged: PropTypes.bool.isRequired,
    errors: PropTypes.array.isRequired
};
const mapStateToProps = state => ({
    data: state.attorney.items || [],
    logged: state.login.logged || false,
    errors: state.errors || []
});
export default connect(mapStateToProps, { getItems, deleteItem })(Lawyers);
