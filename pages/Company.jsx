import React from 'react';
import { Redirect } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import ExtendableMultiSelect from './../components/ExtendableMultiSelect.jsx';
import axios from 'axios';
import {URLs} from './../utils/URLs.js';
//import DownshiftMultiple from '../components/DownshiftMultiple.jsx';

class Company extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            company: {
                id: this.props.id,
                name: '',
                email: '',
                description: '',
                zip: '',        
                address: '',
                types: []
            },
            errorText: '',
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
            this.getCompanyById(this.props.id);
        }
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
    handleSubmit() {
        this.setState({ errorText: '' });
        axios.post(URLs.services.COMPANY, this.state.company)
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
    getCompanyById() {
        axios.get(URLs.services.COMPANY, { params: { id: this.props.id } })
                .then(result => {
                    if (!this._isMounted) {
                        return;
                    }
                    if (result.data.success) {
                        result.data.data.types = [];
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
    goToList() {
        this.props.history.goBack();
    }
    render() {
        const { name, email, 
            description, zip, address,
            types} = this.state.company;
        const errorText = this.state.errorText;
        const isNew = this.state.isNew;
        const logged = this.state.logged;        

        if (!logged && isNew) {
            this.goToList();
        }
        return (
          <div className="container pageContent">
            <h1>{ isNew ? 'Create Company' : 'Company'}</h1>
            <ValidatorForm 
                onSubmit={this.handleSubmit}
                onError={errors => console.log(errors)}
                readOnly={true}
            >   
                <div><TextValidator
                    label="Full Name"
                    onChange={this.handleChange}
                    name="name"
                    type="text"
                    validators={['required', 'maxStringLength:255']}
                    errorMessages={['this field is required', 'exceeds 255 symbols in length']}
                    value={name}
                    fullWidth={true}
                    inputProps={{readOnly: !logged }}
                    InputLabelProps={logged? {} :{shrink: !logged}}
                /></div>
                <div><TextValidator
                    label="E-Mail"
                    onChange={this.handleChange}
                    name="email"
                    type="email"
                    value={email}
                    fullWidth={true}
                    validators={['required', 'isEmail', 'maxStringLength:100']}
                    errorMessages={['this field is required', 'email is not valid', 'exceeds 100 symbols in length']}
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
                    validators={['maxStringLength:255']}
                    errorMessages={['exceeds 255 symbols in length']}
                    value={address || ''}
                    fullWidth={true}
                    inputProps={{readOnly: !logged }}
                    InputLabelProps={logged? {} :{shrink: !logged}}
                /></div>
                <div>
                    <ExtendableMultiSelect
                        id="select-type"
                        label="Company Type"
                        helperText="Please, select company type"
                        value={types}
                        name="languages"
                        onChange={this.handleChange}
                        getItemsUrl={URLs.services.COMPANY_TYPES}
                        readOnly={!logged}
                    />
                </div>    
                <div className="error">{errorText}</div>
                <div className="buttons">
                    <Button type="button" variant="contained" onClick={this.goToList.bind(this)}>&lt;Back</Button>
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
export default Company;