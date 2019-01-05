import React from 'react';
import ReactTable from 'react-table';
import { Link } from "react-router-dom";
import {USER} from '../actions/entities';
import {URLs} from './../utils/URLs.js';
import {connect} from 'react-redux';
import {getItems} from '../actions/itemsActions';
import PropTypes from 'prop-types';
import {errors} from '../api/errorTypes';


class Team extends React.Component {
    constructor() {
        super();

        this.state = {
            data: [],
            dataLoaded: false,
            errorText: ''
        };

    }
    componentWillMount() {
        this.props.getItems(USER);
    }
    componentWillReceiveProps(nextProps) {
        if ((nextProps.errors.length > this.props.errors.length)) {
            const lastErr = nextProps.errors[nextProps.errors.length - 1];
            if (lastErr.entity === USER) {
                if (lastErr.errCode === errors.UNAUTHORIZED) {
                    return (<Redirect to={URLs.pages.LOGIN} />);
                } else {
                    this.setState({ errorText: 'Error while retrieving team members: ' + lastErr.text });
                }
            }
        }
    }
    render() {
        const errorText = this.state.errorText;
        const columns = [
            {
                Header: 'Name',
                accessor: 'name', // String-based value accessors!
                Cell: (props) => <Link to={URLs.pages.TEAM + props.row.id}>{props.value}</Link>
            }, {
                Header: 'Role',
                accessor: 'role',
            }, {
                Header: 'E-mail',
                accessor: 'email',
                show: false
            },
            {
                show: false,
                accessor: 'id'
            },
        ];
        
 
        return (
                <div className="container pageContent">
                    <h1>CLASS Team</h1>
                    <div className="error">{errorText}</div>
                    <ReactTable
                        data={this.props.data}
                        columns={columns}
                        pageSize="10"
                        />
                </div>
                )
    }

}
Team.propTypes = {
    getItems: PropTypes.func.isRequired,

    data: PropTypes.array.isRequired, 
    logged: PropTypes.bool.isRequired,
    errors: PropTypes.array.isRequired
};
const mapStateToProps = state => ({
    data: state.user.items || [],
    logged: state.login.logged || false,
    errors: state.errors || []
});
export default connect(mapStateToProps, { getItems })(Team);
