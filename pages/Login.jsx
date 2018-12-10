import React from 'react';
import { login } from '../actions/loginActions';
import { Redirect } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { URLs } from '../utils/URLs.js';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { LOG_IN } from '../actions/types';


class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            errorText: '',
            login: '',
            password: '',
            ssid: '',
            redirect: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

    }
    handleSubmit(event) {
        event.preventDefault();
        this.props.login({ login: this.state.login, password: this.state.password });

    }
    componentWillReceiveProps(nextProps) {
        if ((nextProps.results.length > this.props.results.length) && nextProps.results[nextProps.results.length - 1].success) {
            var lastResult = nextProps.results[nextProps.results.length - 1];
            if (lastResult.success && lastResult.type === LOG_IN) {
                this.state.redirect = true;
            }
        }
        if (nextProps.errors.length > this.props.errors.length) {
            this.setState({ errorText: 'Error while saving changes: ' + nextProps.errors[nextProps.errors.length - 1].text });
        }
    }
    render() {

        const { login, password } = this.state;

        const errorText = this.state.errorText;

        if (this.state.redirect) {
            return <Redirect to={URLs.pages.ATTORNEYS} />;
        } else {
            return (
                <div className="container pageContent">
                    <ValidatorForm
                        onSubmit={this.handleSubmit}
                        onError={errors => console.log(errors)}
                        readOnly={true}
                    >
                        <div>
                            <div>
                                <TextValidator
                                    label="Username"
                                    onChange={this.handleChange}
                                    readOnly={true}
                                    name="login"
                                    type="text"
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    value={login}
                                />
                            </div><div>
                                <TextValidator
                                    label="Password"
                                    onChange={this.handleChange}
                                    name="password"
                                    type="password"
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    value={password}

                                /></div>
                        </div>
                        <div className="error">{errorText}</div>
                        <div className="buttons">
                            <Button type="submit" color="primary" variant="contained">Log In</Button>
                        </div>
                    </ValidatorForm>
                </div>
            );
        }
    }

}
Login.propTypes = {
    login: PropTypes.func.isRequired,

    logged: PropTypes.bool.isRequired,
    results: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired
};
const mapStateToProps = state => ({
    logged: state.login.logged,
    results: state.login.results,
    errors: state.login.errors
});
export default connect(mapStateToProps, { login })(Login);
