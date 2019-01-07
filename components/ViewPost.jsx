import React from 'react';
import { Redirect } from "react-router-dom";
import {URLs} from '../utils/URLs.js';
import styles from './ViewPost.module.scss';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';

import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {POST} from '../actions/entities';
import {DELETE_ITEM} from '../actions/types';

import {errors} from '../api/errorTypes';

class ViewPost extends React.Component {
    constructor(props) {
        /*
        props contains properties: id, subject, imageURL, body, createdAt, userID, author, isAuthor
        */
        super(props);
        this.state = {
            errorText: '',
            redirectTo: '',
        };
        this.deletePost = this.deletePost.bind(this);
    }

    deletePost() {
        if (this.getIsAuthor()) {
            this.props.deletePost(this.props.id);
        } else {
            this.setState({ redirectTo: URLs.props.LOGIN});
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors.length > this.props.errors.length) {
            const lastErr = nextProps.errors[nextProps.errors.length - 1];
            if (lastErr.entity === POST) {
                if (lastErr.errCode === errors.UNAUTHORIZED) {
                    this.setState({ redirectTo: URLs.pages.LOGIN});
                } else {
                    this.setState({ errorText: 'Error while ' + 
                        (lastErr.action === DELETE_ITEM ? 'deleting' : 'retrieving') +
                        'attorneys: ' + lastErr.text 
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
        return this.props.logged && (this.props.loggedUserID === this.props.userID);
    }
    render() {
        const { id, subject, imageURL, body, userID, author, createdAt } = this.props;
        const isAuthor = this.getIsAuthor();        
        if (this.state.redirectTo) {
            return <Redirect to={this.state.redirectTo}  />;
        }
        return (
            <div className={styles.post}>
                {isAuthor && <Button className={styles.deleteBtn} onClick={this.deletePost}>X</Button> }
                <h3>{subject}</h3>
                <h4 className={styles.author}>{author}</h4>, <div className={styles.createdAt}>{createdAt}</div>
                
                <div className={styles.body}>

                    {imageURL && <div><img src={imageURL} className={styles.photo} /></div> }
                    {body}
                </div>
                <div className="buttons">
                    <Link to={URLs.pages.BLOG + userID}>{'View author blog'}</Link>
                    <Link to={URLs.pages.USER + userID}>{'View author profile'}</Link>
                    {isAuthor && <Link to={URLs.pages.POST + id}>Edit Post</Link>}
                </div>
            </div>
                   );
        }
    //}

}

ViewPost.propTypes = {
    logged: PropTypes.bool.isRequired,
    errors: PropTypes.array.isRequired,
    loggedUserID: PropTypes.number.isRequired,

    id: PropTypes.number.isRequired, 
    subject: PropTypes.string, 
    imageURL: PropTypes.string, 
    body: PropTypes.string, 
    createdAt: PropTypes.string, 
    userID: PropTypes.number,
    author:PropTypes.string,
    deletePost: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
    data: state.post.items || [],
    logged: state.login.logged || false,
    errors: state.errors || [],
    results: state.results || [],
    loggedUserID: state.login.userID
});
export default connect(mapStateToProps)(ViewPost);