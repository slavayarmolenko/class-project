import React from 'react';
import {USER} from '../actions/entities';
import {URLs} from './../utils/URLs.js';
import {connect} from 'react-redux';
import {getItems} from '../actions/itemsActions';
import PropTypes from 'prop-types';
import {errors} from '../api/errorTypes';
import ViewMember from '../components/ViewMember.jsx';
import {common} from './../utils/common'


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
        const logged = this.props.logged && (this.props.loggedUserID.toString()=== this.props.userID); 
        
        const items = common.isArray(this.props.data) ? this.props.data : [];
        
        return (
                <div className="container pageContent">
                    <h1>Team members</h1>
                    <div className="error">{errorText}</div>
                    {!items.length && <div>No users found.</div>}
                    <div className="members">
                        {items.map(item => (
                            <ViewMember
                                key={item.id}
                                id={item.id}
                                name={item.name} 
                                imageURL={item.imageURL} 
                                role={item.role}
                                //body={item.body} 
                                //createdAt={item.createdAt} 
                                //userID={item.userID} 
                            />
                            ))}
                    </div>
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
