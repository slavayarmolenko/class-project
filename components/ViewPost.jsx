import React from 'react';
import { Redirect } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import UploadImageField from './UploadImageField.jsx';
import {URLs} from '../utils/URLs.js';
import styles from './ViewPost.module.scss';
import { Link } from "react-router-dom";

import {USER} from '../actions/entities';
import {UPDATE_ITEM} from '../actions/types';
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
        this.goToUserPosts = this.goToUserPost.bind(this);
    }
    
    goToUserPosts() {
        this.setState({ redirectTo: URLs.pages.TEAM });
    }
    goToUserProfile() {
        this.setState({ redirectTo: URLs.pages.USER });
    }
    render() {
        const { id, subject, imageURL, body, createdAt, userID, author } = this.props;
        const isAuthor = this.props.isAuthor;        
        if (this.state.redirectTo) {
            return <Redirect to={this.state.redirectTo}  />;
        }
        return (
            <div className={styles.viewPost}>
                <div className={styles.createdAt}>{createdAt}</div>
                <h3>{subject}</h3>
                <h4 className={styles.author}>{author}</h4>
                <div className={styles.body}>
                    {imageURL && <img src={imageURL} className={styles.photo} /> }
                    {body}
                </div>
                <div className="buttons">
                    <Link to={URLs.pages.BLOG + props.userID}>{'View '+ author + ' post'}</Link>
                    <Link to={URLs.pages.USER + props.userID}>{'View '+ author + ' profile'}</Link>
                    {isAuthor && 
                        <Link to={URLs.pages.POST + props.id}>Edit Post</Link>
                    }
                </div>
            </div>
                   );
        }
    //}

}


export default ViewPost;
