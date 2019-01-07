import React from 'react';
import { Redirect } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import UploadImageField from '../components/UploadImageField.jsx';
import {URLs} from '../utils/URLs.js';

import {getItem, updateItem} from '../actions/itemsActions';
import {getLogged} from '../actions/loginActions';

import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {POST} from '../actions/entities';
import {UPDATE_ITEM} from '../actions/types';
import {errors} from '../api/errorTypes';

class EditPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: {
                id: this.props.id,
                userID: 0, 
                subject: '', 
                body: '', 
                imageID: '',
                author: '',
                createdAt: ''
            },
            errorText: '',
            redirectTo: '',
            isNew: this.props.id ? false : true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePropChange = this.handlePropChange.bind(this);
        this.onChangePhoto = this.onChangePhoto.bind(this);
        this._isMounted = false;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentWillMount() {
        this._isMounted = true;
        // custom rule will have name 'isPasswordMatch'
        if (!this.state.isNew) {
            this.props.getItem(POST, this.props.id);
        } else {
            this.props.getLogged();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.post.id && this.props.id && (nextProps.post.id.toString() === this.props.id.toString())) {
            this.setState({post: nextProps.post });
        }
        if (nextProps.errors.length > this.props.errors.length) {
            const lastErr = nextProps.errors[nextProps.errors.length - 1];
            if (lastErr.entity === POST) {
                if (lastErr.errCode === errors.UNAUTHORIZED) {
                    this.goToLogin();
                } else {
                    this.setState({ errorText: 'Error while saving changes: ' + lastErr.text });
                }
            }
        }
        if ((nextProps.results.length > this.props.results.length) && nextProps.results[nextProps.results.length - 1].success) {
            var lastResult = nextProps.results[nextProps.results.length - 1];
            if ((lastResult.entity === POST) && (lastResult.action === UPDATE_ITEM)) {
                this.goToList();
            }
        }
    }
    handleChange(event) {
        const { post } = this.state;
        
        if (event.target.type === 'checkbox') {
            post[event.target.name] = event.target.checked;
        } else {
            post[event.target.name] = event.target.value;
        }
        this.setState({ post });
    }
    
    handlePropChange(event) {
        var propname = event.target.name;
        this.setState({ [propname]: event.target.value });
    }
    handleSubmit() {
        this.setState({ errorText: '' });
        var post = {...this.state.post, userID: this.props.loggedUserID, type: 'post'};
        this.props.updateItem(POST, post);
    }
    
    onChangePhoto(imageID) {
        const { post } = this.state;
        post['imageID'] = imageID;
        this.setState({ post });
    }
    goToList() {
        this.setState({ redirectTo: URLs.pages.POSTS });
    }
    goToLogin() {
        this.setState({ redirectTo: URLs.pages.LOGIN });
    }
    render() {
        const { id, subject, body, author, imageURL, createdAt } = this.state.post;
        const errorText = this.state.errorText;
        const isNew = this.state.isNew;
        const logged = this.props.logged && (isNew || (this.props.loggedUserID.toString() === this.props.post.userID));        

        if (!logged) {
            return <Redirect to={URLs.pages.LOGIN}  />;
        }
        
        return (
          <div className="container pageContent">
            <h1>{ isNew ? 'Create a Post' : 'Edit a Post'}</h1>
            <ValidatorForm 
                onSubmit={this.handleSubmit}
                onError={errors => console.log(errors)}
                readOnly={true}
            >   
                <div><UploadImageField readOnly={!logged} url={imageURL} onChange={this.onChangePhoto}></UploadImageField></div>
                <div>{author || ''}</div>
                <div>{createdAt || ''}</div>
                <div><TextValidator
                    label="Subject"
                    onChange={this.handleChange}
                    name="subject"
                    type="text"
                    validators={['maxStringLength:255']}
                    errorMessages={['exceeds 255 symbols in length']}
                    value={subject || ''}
                    fullWidth={true}
                    inputProps={{readOnly: !logged }}
                    InputLabelProps={logged? {} :{shrink: !logged}}
                /></div>
                <div><TextValidator
                    label="Body"
                    onChange={this.handleChange}
                    name="body"
                    type="text"
                    value={body || ''}
                    multiline={true}
                    validators={['maxStringLength:2000']}
                    errorMessages={['About message length exceeds 2000 symbols']}
                    fullWidth={true}
                    inputProps={{readOnly: !logged }}
                    InputLabelProps={logged? {} :{shrink: !logged}}
                /></div>
                
                
                <div className="error">{errorText}</div>
                <div className="buttons">
                    <Button type="button" variant="contained" onClick={this.goToList.bind(this)}>Back to the List</Button>
                    {
                        logged && 
                        <Button type="submit" color="primary" variant="contained">{isNew ? 'Create': 'Save'}</Button>
                    }
                </div>
            </ValidatorForm>
            </div>
                   );
        }
    //}

}

EditPost.propTypes = {
    getItem: PropTypes.func.isRequired, 
    updateItem: PropTypes.func.isRequired, 
    getLogged: PropTypes.func.isRequired, 
    
    post: PropTypes.object,
    logged: PropTypes.bool.isRequired,
    loggedUserID: PropTypes.number.isRequired,
    results: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired
};
const mapStateToProps = state => ({
    post: state.post.item,
    logged: state.login.logged,
    loggedUserID: state.login.userID,
    results: state.results,
    errors: state.errors
});
export default connect(mapStateToProps, { getItem, updateItem, getLogged })(EditPost);
