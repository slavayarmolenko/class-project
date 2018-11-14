import React from 'react';
import { Redirect } from "react-router-dom";
import red from '@material-ui/core/colors/red';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import axios from 'axios';

import ExtendableMultiSelect from './../components/ExtendableMultiSelect.jsx';


class AddLawyer extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            lawyer: {
                uzvername: '',
                name: '',
                email: '',
                password: '',
                description: '',
                zip: '',        
                address: '',
                languages: [],
                services: [],
            },
            allLanguages: [{id: 0, name: 'English'},{id:1, name:'Spanish'}, {id:2, name: 'Russian'}],
            allServices: [{id: 0, name: 'DACA'},{id:1, name:'Family Reunion'}, {id:2, name: 'Deportation'}],
            errorText: '',
            redirectToList: false,
            logged: true
        };
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePropChange = this.handlePropChange.bind(this);
    }
    componentDidMount() {
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
        axios.post('/api/lawyers', this.state.lawyer)
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
        this.setState({redirectToList: true});
    }
    
    render() {
        const { uzvername, name, email, password, repeatPassword, 
            description, zip, address,
            languages, services} = this.state.lawyer;
        const errorText = this.state.errorText;
        const red300 = red['500'];
 
        const errStyle = {
            color: red300,
        };

        if (!this.state.logged) {
            return <Redirect to='/login'  />;
        }
        if (this.state.redirectToList) {
            return <Redirect to='/lawyers'  />;
        }
        return (
            <div className="container pageContent">
            <h1>Create Lawyer</h1>
            <ValidatorForm 
                onSubmit={this.handleSubmit}
                onError={errors => console.log(errors)}
            >   
                <div>
                <TextValidator
                    label="Username"
                    onChange={this.handleChange}
                    name="uzvername"
                    type="text"
                    validators={['required']}
                    errorMessages={['this field is required']}
                    value={uzvername}
                /></div>
                <div>
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
                    type="number"
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
                    value={address}
                    fullWidth={true}
                /></div>
                <div>
                    <ExtendableMultiSelect
                        label="Languages speaking"
                        items={this.state.allLanguages}
                        value={languages}
                        name="languages"
                        onChange={this.handleChange}
                        getItemsUrl=""
                    />
                </div>    
                <div>
                    <ExtendableMultiSelect
                        label="Offer Services"
                        items={this.state.allServices}
                        value={services}
                        name="services"
                        onChange={this.handleChange}
                        getItemsUrl=""
                    ></ExtendableMultiSelect>
                </div>
                <div style={errStyle}>{errorText}</div>
                <Button type="submit" color="primary" variant="contained">Submit</Button>
            </ValidatorForm>
            </div>
                   );
    }
}
export default AddLawyer;