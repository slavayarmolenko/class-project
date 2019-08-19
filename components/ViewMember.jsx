import React from 'react';
import { Redirect } from "react-router-dom";
import {URLs} from '../utils/URLs.js';
import styles from './ViewPost.module.scss';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';

import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {USER} from '../actions/entities';
import {DELETE_ITEM} from '../actions/types';

import {errors} from '../api/errorTypes';

class ViewMember extends React.Component {
    constructor(props) {
        /*
        props contains properties: id, subject, imageURL, body, createdAt, userID, author, isAuthor
        */
        super(props);
        this.state = {
            errorText: '',
            redirectTo: '',
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors.length > this.props.errors.length) {
            const lastErr = nextProps.errors[nextProps.errors.length - 1];
            if (lastErr.entity === USER) {
                if (lastErr.errCode === errors.UNAUTHORIZED) {
                    this.setState({ redirectTo: URLs.pages.LOGIN});
                } else {
                    this.setState({ errorText: 'Error while ' + 
                        (lastErr.action === DELETE_ITEM ? 'deleting' : 'retrieving') +
                        'users: ' + lastErr.text 
                    });
                    
                }
                return;
            }
            
        }
    }
    
    goToUserPosts() {
        this.setState({ redirectTo: URLs.pages.BLOG });
    }
    goToUserProfile() {
        this.setState({ redirectTo: URLs.pages.USER + this.props.userID });
    }
    getIsAuthor() {
        return this.props.logged && (this.props.loggedUserID === this.props.id);
    }
    render() {
        const { id, name, imageURL, role} = this.props;      
        if (this.state.redirectTo) {
            return <Redirect to={this.state.redirectTo}  />;
        }
        return (
            <div className={styles.post}>
                <h3>{name}</h3>
                <h4 className={styles.author}>{role}</h4>
                
                <div className={styles.body}>

                    {imageURL && <div><img src={imageURL} className={styles.photo} /></div> }
                </div>
                <div className="buttons">
                    <Link to={URLs.pages.BLOG + id}>{'View user blog'}</Link>
                    <Link to={URLs.pages.USER + id}>{'View user profile'}</Link>
                </div>
            </div>
                   );
        }
    //}

}

ViewMember.propTypes = {
    logged: PropTypes.bool.isRequired,
    errors: PropTypes.array.isRequired,
    loggedUserID: PropTypes.number.isRequired,

    id: PropTypes.number.isRequired, 
    role: PropTypes.string, 
    imageURL: PropTypes.string, 
    name:PropTypes.string,
};
const mapStateToProps = state => ({
    logged: state.login.logged || false,
    errors: state.errors || [],
    results: state.results || [],
    loggedUserID: state.login.userID
});
export default connect(mapStateToProps)(ViewMember);