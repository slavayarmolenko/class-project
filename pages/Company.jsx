import React from 'react';
import { Redirect } from "react-router-dom";
import red from '@material-ui/core/colors/red';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import axios from 'axios';
import {URLs} from '../utils/URLs.js';

import ExtendableMultiSelect from '../components/ExtendableMultiSelect.jsx';


class AddLawyer extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            company: {
                id: this.props.id,
                name: '',
                email: '',
                description: '',
                zip: '',        
                address: '',
            },
            errorText: '',
            redirectToList: false,
            isNew: this.props.id ? false : true,
            logged: true
        };
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePropChange = this.handlePropChange.bind(this);
        this._isMounted = false;
    }
    componentDidMount() {
        this._isMounted = true;
        // custom rule will have name 'isPasswordMatch'
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.company.password) {
                return false;
            }
            return true;
        });
        ValidatorForm.addValidationRule('isZip', (value) => {
            if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value)) {
                return true;
            }
            return false;
        });
        if (this.isNew) {
            this.getLawyerById(this.props.id);
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    handleChange(event) {
        const { company } = this.state;
        
        if (event.target.type === 'checkbox') {
            company[event.target.name] = event.target.checked;
        } else {
            company[event.target.name] = event.target.value;
        }
        this.setState({ company });
    }
    handlePropChange(event) {
        var propname = event.target.name;
        this.setState({ [propname]: event.target.value });
    }
    getCompanyById() {
        axios.get(URLs.services.COMPANY, { params: { id: this.props.id } })
                .then(result => {
                    if (!this._isMounted) {
                        return;
                    }
                    if (result.data.success) {
                        this.setState({ company: result.data.data });
                    } else {
                        this.setState({
                            errorText: 'Error: ' + result.data.errMessage
                        });
                    }
                })
                .catch(error => {
                    this.setState({
                        errorText: 'Error: ' + error.response.statusText,
                    });
                });
    }

    handleSubmit() {
        this.setState({ errorText: '' });
        axios.post(URLs.services.COMPANY, this.state.company)
                .then(result => {
                    if (result.data.success) {
                        this.goToList();
                    } else {
                        this.setState({
                            errorText: 'Could not create an attorney: ' + result.data.errMessage
                        });
                    }
                })
                .catch(error => {
                    
                    this.setState({
                        errorText: 'Error: ' + error.response.statusText,
                    });
                });
    }

    goToList() {
        this.goBack.bind(this);
    }
    goBack() {
        this.props.history.goBack();
    }
    
    render() {
        const { name, email,  
            description, zip, address} = this.state.company;
        const errorText = this.state.errorText;
        const isNew = this.state.isNew;
        const logged = this.state.logged;

        if (!logged && isNew) {
            return <Redirect to={URLs.pages.LOGIN}  />;
        }
        if (this.state.redirectToList) {
            this.goBack.bind(this);
        }
        return (
            <div className="container pageContent">
            <h1>{this.isNew ? 'Create Company' : 'Company'}</h1>
            <ValidatorForm 
                onSubmit={this.handleSubmit}
                onError={errors => console.log(errors)}
            >   
                <div><TextValidator
                    label="Full Name"
                    onChange={this.handleChange}
                    name="name"
                    type="text"
                    validators={['required']}
                    errorMessages={['this field is required']}
                    value={name}
                    inputProps={{readOnly: !logged }}
                    InputLabelProps={logged? {} :{shrink: !logged}}
                /></div>
                <div><TextValidator
                    label="E-Mail"
                    onChange={this.handleChange}
                    name="email"
                    type="email"
                    value={email}
                    validators={['required', 'isEmail']}
                    errorMessages={['this field is required', 'email is not valid']}
                    inputProps={{readOnly: !logged }}
                    InputLabelProps={logged? {} :{shrink: !logged}}
                /></div>
                <div><TextValidator
                    label="Description"
                    onChange={this.handleChange}
                    name="description"
                    type="text"
                    value={description}
                    multiline={true}
                    validators={['maxStringLength:255']}
                    errorMessages={['Description length exceeds 255 symbols']}
                    fullWidth={true}
                    inputProps={{readOnly: !logged }}
                    InputLabelProps={logged? {} :{shrink: !logged}}
                /></div>
                <div><TextValidator
                    label="Zip Code"
                    onChange={this.handleChange}
                    name="zip"
                    type="text"
                    value={zip}
                    validators={['required', 'isZip']}
                    errorMessages={['this field is required', 'Zip Code is not valid']}
                    inputProps={{readOnly: !logged }}
                    InputLabelProps={logged? {} :{shrink: !logged}}
                /></div>
                <div><TextValidator
                    label="Address"
                    onChange={this.handleChange}
                    name="address"
                    type="text"
                    validators={[]}
                    errorMessages={[]}
                    value={address}
                    fullWidth={true}
                    inputProps={{readOnly: !logged }}
                    InputLabelProps={logged? {} :{shrink: !logged}}
                /></div>
                <div className="error">{errorText}</div>
                <div className="buttons">
                    <Button type="button" color="secondary" vatiant="container" onClick={this.goBack.bind(this)}>Go Back</Button>
                    {
                        logged ? <Button type="submit" color="primary" variant="contained">Submit</Button> : ''
                    }
                </div>
            </ValidatorForm>
            </div>
                   );
    }
}
export default AddLawyer;