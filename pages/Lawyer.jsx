import React from 'react';
import { Redirect } from "react-router-dom";
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import ExtendableMultiSelect from './../components/ExtendableMultiSelect.jsx';
import axios from 'axios';
import {URLs} from './../utils/URLs.js';
//import DownshiftMultiple from '../components/DownshiftMultiple.jsx';

class Lawyer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lawyer: {
                id: this.props.id,
                uzvername: '',
                name: '',
                email: '',
                password: '',
                repeatPassword: '',
                description: '',
                zip: '',        
                address: '',
                languages: [],
                services: [],
            },
            errorText: '',
            redirectToList: false,
            logged: true,
            isNew: this.props.id ? false : true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePropChange = this.handlePropChange.bind(this);
        this._isMounted = false;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
        this._isMounted = true;
        // custom rule will have name 'isPasswordMatch'
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.lawyer.password) {
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
        if (!this.state.isNew) {
            this.getLawyerById(this.props.id);
        }
    }
    handleChange(event) {
        const { lawyer } = this.state;
        
        if (event.target.type === 'checkbox') {
            lawyer[event.target.name] = event.target.checked;
        } else {
            lawyer[event.target.name] = event.target.value;
        }
        this.setState({ lawyer });
    }
    
    handlePropChange(event) {
        var propname = event.target.name;
        this.setState({ [propname]: event.target.value });
    }
    handleSubmit() {
        this.setState({ errorText: '' });
        axios.post(URLs.services.LAWYER, this.state.lawyer)
                .then(result => {
                    if (result.data.success) {
                        this.goToList();
                    } else {
                        this.setState({
                            errorText: result.data.errMessage
                        });
                    }
                })
                .catch(error => {
                    
                    this.setState({
                        errorText: error.response.statusText
                    });
                });
    }
    getLawyerById() {
        axios.get(URLs.services.LAWYER, { params: { id: this.props.id } })
                .then(result => {
                    if (!this._isMounted) {
                        return;
                    }
                    if (result.data.success) {
                        result.data.data.repeatPassword = '';
                        result.data.data.password = '';
                        this.setState({ lawyer: result.data.data });
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
    goToList() {
        this.setState({redirectToList: true});
    }
    render() {
        const { uzvername, name, email, password, repeatPassword,
            description, zip, languages, address,
            services} = this.state.lawyer;
        const errorText = this.state.errorText;
        const isNew = this.state.isNew;
        const logged = this.state.logged;
        

        if (this.state.redirectToList) {
            return <Redirect to='/attorneys'  />;
        }
        return (
          <div className="container pageContent">
            <h1>{ isNew ? 'Create Attorney' : 'Attorney'}</h1>
            <ValidatorForm 
                onSubmit={this.handleSubmit}
                onError={errors => console.log(errors)}
                readOnly={true}
            >   
                {logged ? 
                <div>
                    <div>
                    <TextValidator
                        label="Username"
                        onChange={this.handleChange}
                        readOnly={true}
                        name="uzvername"
                        type="text"
                        validators={['required']}
                        errorMessages={['this field is required']}
                        value={uzvername}
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
                        
                    /><TextValidator
                        label="Repeat password"
                        onChange={this.handleChange}
                        name="repeatPassword"
                        type="password"
                        validators={['isPasswordMatch', 'required']}
                        errorMessages={['password mismatch', 'this field is required']}
                        value={repeatPassword}
                        style={{marginLeft: '15px'}}
                    /></div>
                </div> : '' }
                <div><TextValidator
                    label="Full Name"
                    onChange={this.handleChange}
                    name="name"
                    type="text"
                    validators={['required']}
                    errorMessages={['this field is required']}
                    value={name}
                /></div>
                <div><TextValidator
                    label="E-Mail"
                    onChange={this.handleChange}
                    name="email"
                    type="email"
                    value={email}
                    validators={['required', 'isEmail']}
                    errorMessages={['this field is required', 'email is not valid']}
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
                /></div>
                <div><TextValidator
                    label="Zip Code"
                    onChange={this.handleChange}
                    name="zip"
                    type="text"
                    value={zip}
                    validators={['required', 'isZip']}
                    errorMessages={['this field is required', 'Zip Code is not valid']}
                /></div>
                <div><TextValidator
                    label="Address"
                    onChange={this.handleChange}
                    name="address"
                    type="text"
                    validators={[]}
                    errorMessages={[]}
                    value={address || ''}
                    fullWidth={true}
                /></div>
                <div>
                    <ExtendableMultiSelect
                        id="select-languages"
                        label="Languages speaking"
                        helperText="Please, select/add languages you speak"
                        value={languages}
                        name="languages"
                        onChange={this.handleChange}
                        getItemsUrl={URLs.services.LANGUAGES}
                    />
                </div>    
                <div>
                    <ExtendableMultiSelect
                        id="select-services"
                        label="Offer Services"
                        helperText="Please, select/add services you offer"
                        value={services}
                        name="services"
                        onChange={this.handleChange}
                        getItemsUrl={URLs.services.SERVICES}
                    ></ExtendableMultiSelect>
                </div>
                <div className="error">{errorText}</div>
                {
                    logged ? <Button type="submit" color="primary" variant="contained">Submit</Button> : ''
                }
            </ValidatorForm>
            </div>
                   );
        }
    //}

}
export default Lawyer;