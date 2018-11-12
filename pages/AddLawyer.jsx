import React from 'react';
import { Redirect } from "react-router-dom";
import red from '@material-ui/core/colors/red';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import axios from 'axios';


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
                english: true,
                spanish: false,
                russian: false,
                address: '',
            },
            errorText: '',
            redirectToList: false
        };
        this.logged = true;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
 
    handleSubmit() {
        this.setState({ errorText: '' });
        axios.post('/api/lawyers', this.state.lawyer)
                .then(result => {
                    if (result.success) {
                        this.goToList();
                    } else {
                        this.setState({
                            errorText: error.response.statusText,
                        });
                    }
                })
                .catch(error => {
                    
                    this.setState({
                        errorText: error.response.statusText,
                    });
                });
    }

    goToList() {
        this.setState({redirectToList: true});
    }
    
    render() {
        const { uzvername, name, email, password, repeatPassword, 
            description, zip, english, spanish, russian, address} = this.state.lawyer;
        const errorText = this.state.errorText;
        const red300 = red['500'];
 
        const errStyle = {
            color: red300,
        };

        if (!this.logged) {
            return <Redirect to='/login'  />;
        }
        if (this.state.redirectToList) {
            return <Redirect to='/lawyers'  />;
        }
        return (
            <div className="container">
            <h1>Create Lawyer</h1>
            <ValidatorForm 
                onSubmit={this.handleSubmit}
                onError={errors => console.log(errors)}
            >   
                <div style={errStyle}>{errorText}</div>
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
                <Checkbox 
                        onChange={this.handleChange}
                        name="english"
                        value="1"
                        checked={english}
                /><InputLabel htmlFor="english">English</InputLabel>
                
                    <Checkbox 
                        label="Speak Spanish"
                        onChange={this.handleChange}
                        checked={spanish}
                        name="spanish"
                        value="1"

                /><InputLabel>Spanish</InputLabel>
                    <Checkbox 
                        label="Speak Russian"
                        onChange={this.handleChange}
                        name="russian"
                        checked={russian}
                        value="1"
                /><InputLabel>Russian</InputLabel></div>

                <Button type="submit" color="primary" variant="contained">Submit</Button>
            </ValidatorForm>
            </div>
                   );
    }
}
export default AddLawyer;