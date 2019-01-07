import React from 'react';

import { Link } from "react-router-dom";
import {POST} from '../actions/entities';
import {URLs} from './../utils/URLs.js';
import {connect} from 'react-redux';
import {getItems, deleteItem} from '../actions/itemsActions';
import PropTypes from 'prop-types';
import {errors} from '../api/errorTypes';
import ViewPost from '../components/ViewPost.jsx';


class Blog extends React.Component {
    constructor() {
        super();

        this.state = {
            data: [],
            dataLoaded: false,
            errorText: ''
        };
        this.deletePost = this.deletePost.bind(this);
    }
    componentWillMount() {
        this.props.getItems(POST, {userID: this.props.userID});
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
    deletePost(postId) {
        this.deleteItem(POST, postId, {userID: this.props.userID});
    }
    render() {
        const errorText = this.state.errorText;
        const logged = this.props.logged && (this.props.loggedUserID.toString()=== this.props.userID); 
        const items = this.props.data;
        
        return (
                <div className="container pageContent">
                    <h1>Blog</h1>
                    <div className="error">{errorText}</div>
                    {logged && <Link to={URLs.pages.CREATE_POST}>Create a new post</Link> }
                    <Link to={URLs.pages.POSTS}>View All Posts</Link>
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
                            />
                            ))}
                    </div>
                </div>
                )
    }

}
Blog.propTypes = {
    getItems: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,

    data: PropTypes.array.isRequired, 
    logged: PropTypes.bool.isRequired,
    errors: PropTypes.array.isRequired,
    loggedUserID: PropTypes.number.isRequired,

    userID: PropTypes.string.isRequired
};
const mapStateToProps = state => ({
    data: state.post.items || [],
    logged: state.login.logged || false,
    errors: state.errors || [],
    loggedUserID: state.login.userID
});
export default connect(mapStateToProps, { getItems })(Blog);
