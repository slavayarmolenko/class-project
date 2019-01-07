import React from 'react';
import { Redirect } from "react-router-dom";
import {URLs} from '../utils/URLs.js';
import styles from './ViewPost.module.scss';
import { Link } from "react-router-dom";

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
        this.goToUserPosts = this.goToUserPosts.bind(this);
    }
    
    goToUserPosts() {
        this.setState({ redirectTo: URLs.pages.TEAM });
    }
    goToUserProfile() {
        this.setState({ redirectTo: URLs.pages.USER });
    }
    render() {
        const { id, subject, imageURL, body, userID, author, createdAt } = this.props;
        const isAuthor = this.props.isAuthor;        
        if (this.state.redirectTo) {
            return <Redirect to={this.state.redirectTo}  />;
        }
        return (
            <div className={styles.post}>
                <h3>{subject}</h3>
                <h4 className={styles.author}>{author}</h4>, <div className={styles.createdAt}>{createdAt}</div>
                
                <div className={styles.body}>
                    {imageURL && <img src={imageURL} className={styles.photo} /> }
                    {body}
                </div>
                <div className="buttons">
                    <Link to={URLs.pages.BLOG + userID}>{'View author blog'}</Link>
                    <Link to={URLs.pages.USER + userID}>{'View author profile'}</Link>
                    {isAuthor && 
                        <Link to={URLs.pages.POST + id}>Edit Post</Link>
                    }
                </div>
            </div>
                   );
        }
    //}

}


export default ViewPost;
