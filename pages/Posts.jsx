import React from 'react';

import { Link } from "react-router-dom";
import {POST} from '../actions/entities';
import {URLs} from '../utils/URLs.js';
import {connect} from 'react-redux';
import {getItems, deleteItem} from '../actions/itemsActions';
import PropTypes from 'prop-types';
import {errors} from '../api/errorTypes';
import ViewPost from '../components/ViewPost.jsx';


class Posts extends React.Component {
    constructor() {
        super();

        this.state = {
            data: [],
            dataLoaded: false,
            errorText: ''
        };
        this.deletePost = this.deletePost.bind(this);
    }

    deletePost(postId) {
        this.deleteItem(POST, postId, {userID: this.props.userID});
    }
    componentWillMount() {
        this.props.getItems(POST);
    }
    componentWillReceiveProps(nextProps) {
        if ((nextProps.errors.length > this.props.errors.length)) {
            const lastErr = nextProps.errors[nextProps.errors.length - 1];
            if (lastErr.entity === POST) {
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
        const items = this.props.data;
        const logged = this.props.logged;
        
        return (
                <div className="container pageContent">
                    <h1>Blog</h1>
                    <div className="error">{errorText}</div>
                    {logged && <Link to={URLs.pages.CREATE_POST}>Create a new post</Link> }
                    {!items.length && <div>This user does not have any posts yet.</div>}
                    <div className="posts">
                        {items.map(item => (
                            <ViewPost
                                key={item.id}
                                id={item.id}
                                subject={item.subject} 
                                imageURL={item.imageURL} 
                                body={item.body} 
                                createdAt={item.createdAt} 
                                userID={item.userID} 
                                author={item.author} 
                                deletePost={this.deletePost}
                            />
                            ))}
                    </div>
                </div>
                )
    }

}
Posts.propTypes = {
    getItems: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,

    data: PropTypes.array.isRequired, 
    logged: PropTypes.bool.isRequired,
    errors: PropTypes.array.isRequired,
    userID: PropTypes.number.isRequired,
};
const mapStateToProps = state => ({
    data: state.post.items || [],
    logged: state.login.logged || false,
    errors: state.errors || [],
    userID: state.login.userID
});
export default connect(mapStateToProps, { getItems, deleteItem })(Posts);
