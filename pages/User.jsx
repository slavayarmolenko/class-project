import React from 'react';
import { Link, Redirect } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import UploadImageField from '../components/UploadImageField.jsx';
import { URLs } from '../utils/URLs.js';

import { getItem, updateItem } from '../actions/itemsActions';
import { getLogged } from '../actions/loginActions';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { USER } from '../actions/entities';
import { UPDATE_ITEM } from '../actions/types';
import { errors } from '../api/errorTypes';

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                id: this.props.id,
                uzvername: '',
                name: '',
                email: '',
                password: '',
                repeatPassword: '',
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
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.user.password) {
                return false;
            }
            return true;
        });
        ValidatorForm.addValidationRule('isZip', (value) => {
            if (!value) {
                return true;
            }
            if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value)) {
                return true;
            }
            return false;
        });
        if (!this.state.isNew) {
            this.props.getItem(USER, this.props.id);
        } else {
            this.props.getLogged();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user.id && this.props.id && (nextProps.user.id.toString() === this.props.id.toString())) {
            var user = {
                ...nextProps.user,
                repeatPassword: '',
                password: ''
            }
            this.setState({ user: user });
        }
        if (nextProps.errors.length > this.props.errors.length) {
            const lastErr = nextProps.errors[nextProps.errors.length - 1];
            if (lastErr.entity === USER) {
                if (lastErr.errCode === errors.UNAUTHORIZED) {
                    this.goToLogin();
                } else {
                    this.setState({ errorText: 'Error while saving changes: ' + lastErr.text });
                }
            }
        }
        if ((nextProps.results.length > this.props.results.length) && nextProps.results[nextProps.results.length - 1].success) {
            var lastResult = nextProps.results[nextProps.results.length - 1];
            if ((lastResult.entity === USER) && (lastResult.action === UPDATE_ITEM)) {
                this.goToList();
            }
        }
    }
    handleChange(event) {
        const { user } = this.state;

        if (event.target.type === 'checkbox') {
            user[event.target.name] = event.target.checked;
        } else {
            user[event.target.name] = event.target.value;
        }
        this.setState({ user });
    }

    handlePropChange(event) {
        var propname = event.target.name;
        this.setState({ [propname]: event.target.value });
    }
    handleSubmit() {
        this.setState({ errorText: '' });
        this.props.updateItem(USER, this.state.user);
    }

    onChangePhoto(imageID) {
        const { user } = this.state;
        user['imageID'] = imageID;
        this.setState({ user });
    }
    goToList() {
        this.setState({ redirectTo: URLs.pages.TEAM });
    }
    goToLogin() {
        this.setState({ redirectTo: URLs.pages.LOGIN });
    }
    render() {
        const { username, name, email, password, repeatPassword, role, subject, body, url, message, subj } = this.state.user;
        const errorText = this.state.errorText;
        const isNew = this.state.isNew;
        const logged = this.props.logged && (this.props.id === this.props.userID.toString());

        if (!logged && isNew) {
            return <Redirect to={this.state.redirectTo} />;
        }
        if (this.state.redirectTo) {
            return <Redirect to={this.state.redirectTo} />;
        }
        if (!logged) {
            return (
                <div className="container pageContent">

                    <div><h1>{name}</h1></div>
                    <div><h2>{role}</h2></div>
                    <div className="flex-container">
                        <div className="flex-left"><img src={url} className="photo" width="100%" /></div>
                        <div className="flex-right"><div></div>
                            <div>{subject}</div>
                            <ValidatorForm
                                onSubmit={this.handleSubmit}
                                onError={errors => console.log(errors)}
                                readOnly={false}
                            >
                                <div><TextValidator
                                    label="Subject: "
                                    onChange={this.handleChange}
                                    name="subj"
                                    type="text"
                                    validators={['required', 'maxStringLength:255']}
                                    errorMessages={['this field is required', 'exceeds 255 symbols in length']}
                                    value={subj || ''}
                                    fullWidth={true}
                                    inputProps={{ readOnly: false }}
                                // InputLabelProps={logged ? {} : { shrink: !logged }}
                                /></div>
                                <div><TextValidator
                                    label="Text"
                                    onChange={this.handleChange}
                                    name="message"
                                    type="text"
                                    value={message || ''}
                                    fullWidth={true}
                                    inputProps={{ readOnly: false }}
                                //InputLabelProps={logged ? {} : { shrink: !logged }}
                                /></div>
                                <div className="buttons">
                                    <Button type="submit" color="primary" variant="contained">{'Send'}</Button>
                                    <Link to={URLs.pages.BLOG + this.props.id}>{'View blog'}</Link>
                                </div>
                            </ValidatorForm>
                        </div>
                    </div>
                    <div className="description">{body}</div>
                    <Button type="button" variant="contained" onClick={this.goToList.bind(this)}>Back to the List</Button>


                </div>

            );
        } else {
            return (
                <div className="container pageContent">
                    <h1>{isNew ? 'Create a Team member' : 'Team Member'}</h1>
                    <ValidatorForm
                        onSubmit={this.handleSubmit}
                        onError={errors => console.log(errors)}
                        readOnly={true}
                    >
                        {logged &&
                            <div>
                                <div>
                                    <TextValidator
                                        label="Username"
                                        onChange={this.handleChange}
                                        readOnly={true}
                                        name="username"
                                        type="text"
                                        validators={['required', 'maxStringLength:50']}
                                        errorMessages={['this field is required', 'exceeds 50 symbols in length']}
                                        value={username || ''}
                                        InputLabelProps={{}}
                                    />
                                </div><div>
                                    <TextValidator
                                        label="Password"
                                        onChange={this.handleChange}
                                        name="password"
                                        type="password"
                                        validators={isNew ? ['required', 'maxStringLength:50'] : []}
                                        errorMessages={['this field is required', 'exceeds 50 symbols in length']}
                                        value={password}

                                    /><TextValidator
                                        label="Repeat password"
                                        onChange={this.handleChange}
                                        name="repeatPassword"
                                        type="password"
                                        validators={isNew ? ['isPasswordMatch', 'required'] : ['isPasswordMatch']}
                                        errorMessages={isNew ? ['password mismatch', 'this field is required'] : ['password mismatch']}
                                        value={repeatPassword}
                                        style={{ marginLeft: '15px' }}
                                    /></div>
                            </div>
                        }
                        <div><UploadImageField readOnly={!logged} url={url} onChange={this.onChangePhoto}></UploadImageField></div>
                        <div><TextValidator
                            label="Full Name"
                            onChange={this.handleChange}
                            name="name"
                            type="text"
                            validators={['required', 'maxStringLength:255']}
                            errorMessages={['this field is required', 'exceeds 255 symbols in length']}
                            value={name || ''}
                            fullWidth={true}
                            inputProps={{ readOnly: !logged }}
                            InputLabelProps={logged ? {} : { shrink: !logged }}
                        /></div>
                        {logged &&
                            <div><TextValidator
                                label="E-Mail"
                                onChange={this.handleChange}
                                name="email"
                                type="email"
                                value={email || ''}
                                fullWidth={true}
                                validators={['isEmail', 'maxStringLength:100']}
                                errorMessages={['email is not valid', 'exceeds 100 symbols in length']}
                                inputProps={{ readOnly: !logged }}
                                InputLabelProps={logged ? {} : { shrink: !logged }}
                            /></div>
                        }
                        <div><TextValidator
                            label="Role"
                            onChange={this.handleChange}
                            name="role"
                            type="text"
                            validators={['required', 'maxStringLength:255']}
                            errorMessages={['this field is required', 'exceeds 255 symbols in length']}
                            value={role || ''}
                            fullWidth={true}
                            inputProps={{ readOnly: !logged }}
                            InputLabelProps={logged ? {} : { shrink: !logged }}
                        /></div>
                        {logged &&
                            <div><TextValidator
                                label="Short subject/Slogan"
                                onChange={this.handleChange}
                                name="subj"
                                type="text"
                                validators={['maxStringLength:255']}
                                errorMessages={['exceeds 255 symbols in length']}
                                value={subj || ''}
                                fullWidth={true}
                                inputProps={{ readOnly: !logged }}
                                InputLabelProps={logged ? {} : { shrink: !logged }}
                            /></div>
                        }
                        <div><TextValidator
                            label={logged ? "About" : (subject || "About")}
                            onChange={this.handleChange}
                            name="body"
                            type="text"
                            value={body || ''}
                            multiline={true}
                            validators={['maxStringLength:2000']}
                            errorMessages={['About message length exceeds 2000 symbols']}
                            fullWidth={true}
                            inputProps={{ readOnly: !logged }}
                            InputLabelProps={logged ? {} : { shrink: !logged }}
                        /></div>


                        <div className="error">{errorText}</div>
                        <div className="buttons">
                            <Button type="button" variant="contained" onClick={this.goToList.bind(this)}>Back to the List</Button>
                            {
                                logged &&
                                <Button type="submit" color="primary" variant="contained">{isNew ? 'Create' : 'Save'}</Button>
                            }
                            <Link to={URLs.pages.BLOG + this.props.id}>{'View blog'}</Link>
                        </div>
                    </ValidatorForm>
                </div>
            );
        }
    }
    //}

}

User.propTypes = {
    getItem: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired,
    getLogged: PropTypes.func.isRequired,

    user: PropTypes.object,
    logged: PropTypes.bool.isRequired,
    userID: PropTypes.number.isRequired,
    results: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired
};
const mapStateToProps = state => ({
    user: state.user.item,
    logged: state.login.logged,
    userID: state.login.userID,
    results: state.results,
    errors: state.errors
});
export default connect(mapStateToProps, { getItem, updateItem, getLogged })(User);
