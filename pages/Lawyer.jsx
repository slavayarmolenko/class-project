import React from 'react';
import { Redirect } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import ExtendableMultiSelect from './../components/ExtendableMultiSelect.jsx';
import UploadImageField from './../components/UploadImageField.jsx';
import { URLs } from '../utils/URLs.js';

import { getItem, updateItem, getItems } from '../actions/itemsActions';
import { getLogged } from '../actions/loginActions';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { LANGUAGE, SERVICE, ATTORNEY } from '../actions/entities';
import { UPDATE_ITEM } from '../actions/types';
import { errors } from '../api/errorTypes';
//import { stat } from 'fs';


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
                company: '',
                website: '',
                imageURL: ''
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
            if (value !== this.state.lawyer.password) {
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
            this.props.getItem(ATTORNEY, this.props.id);
        } else {
            this.props.getLogged();
        }
        if (!this.props.languages.length) {
            this.props.getItems(LANGUAGE);
        }
        if (!this.props.services.length) {
            this.props.getItems(SERVICE);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.lawyer.id && this.props.id && (nextProps.lawyer.id.toString() === this.props.id.toString())) {
            var lawyer = {
                ...nextProps.lawyer,
                repeatPassword: '',
                password: ''
            }
            this.setState({ lawyer: lawyer });
        }
        if (nextProps.errors.length > this.props.errors.length) {
            const lastErr = nextProps.errors[nextProps.errors.length - 1];
            if (lastErr.entity === ATTORNEY) {
                if (lastErr.errCode === errors.UNAUTHORIZED) {
                    this.goToLogin();
                } else {
                    this.setState({ errorText: 'Error while saving changes: ' + lastErr.text });
                }
            }
        }
        if ((nextProps.results.length > this.props.results.length) && nextProps.results[nextProps.results.length - 1].success) {
            var lastResult = nextProps.results[nextProps.results.length - 1];
            if ((lastResult.entity === ATTORNEY) && (lastResult.action === UPDATE_ITEM)) {
                this.goToList();
            }
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
        this.props.updateItem(ATTORNEY, this.state.lawyer);
    }

    onChangePhoto(imageID) {
        const { lawyer } = this.state;
        lawyer['imageID'] = imageID;
        this.setState({ lawyer });
    }

    goToList() {
        this.setState({ redirectTo: URLs.pages.ATTORNEYS });
    }
    goToLogin() {
        this.setState({ redirectTo: URLs.pages.LOGIN });
    }
    render() {
        const { uzvername, name, email, password, repeatPassword,
            description, zip, languages, address,
            services, imageURL, company, website, phone, city } = this.state.lawyer;
        const errorText = this.state.errorText;
        const isNew = this.state.isNew;
        const logged = this.props.logged;

        if (!logged && isNew) {
            return <Redirect to={URLs.pages.LOGIN} />;
        }
        if (this.state.redirectTo) {
            return <Redirect to={this.state.redirectTo} />;
        }
        var allServices = this.props.services;
        var allLanguages = this.props.languages;

        var servicesLi = services.map(function(serviceId){
            return allServices.find(function(element) {
                if(element.id){
                return (element.id==serviceId);
                } else return "";
            });
        }).map(function (service) {
            try{
            return <li> 
                {service.name}
            </li>;
            } catch (err){
                console.log(err)
            }
        });
        var languagesLi = languages.map(function(languageId){
            return allLanguages.find(function(language) {
                return (language.id==languageId);
            });
        }).map(function (language) {
            try{
            return <li> 
                {language.name}
            </li>;
            }catch (err) {
                console.log(err);
            }
        });
        console.log("Services:");
        console.log(services);
        if(!logged){
        return (
            <div className="container pageContent">
                
                    <div><h1>{name}</h1></div>
                    <div><h2>{company}</h2></div>
                    <div className="flex-container">
                        <div className="flex-left"><img src={imageURL} className="photo" width="100%" /></div>
                        <div className="flex-right">
                            <div>{address}</div>
                            <div>{city + " " + zip}</div>
                            <div><p></p>{phone}<p></p></div>
                            <div><a href= {email}>{email}</a></div>
                            <div><p></p><a href={"https://www." + website}>{website}</a></div>
                        </div>
                    </div>
                    <div className="description">{description}</div>
                    <div className="flex-container">
                    <div className="flex-left"><h4>Services:</h4><ul>{servicesLi}</ul></div>
                    <div className="flex-right"><h4>Languages:</h4><ul>{languagesLi}</ul></div>
                    </div>

                </div>

        );
        } else {
       
        return (
            <div className="container pageContent">
                <h1>{isNew ? 'Create Attorney' : name}</h1>
                <h2>{company ? company : ''}</h2>
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
                                    name="uzvername"
                                    type="text"
                                    validators={['required', 'maxStringLength:50']}
                                    errorMessages={['this field is required', 'exceeds 50 symbols in length']}
                                    value={uzvername}
                                />
                            </div><div><TextValidator
                                label="Full Name"
                                onChange={this.handleChange}
                                name="name"
                                type="text"
                                validators={['required', 'maxStringLength:255']}
                                errorMessages={['this field is required', 'exceeds 255 symbols in length']}
                                value={name}
                                fullWidth={logged}
                                inputProps={{ readOnly: !logged }}
                                InputLabelProps={logged ? {} : { shrink: !logged }}
                                className={!logged && "readOnly-input"}
                            /></div>
                            <div>
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
                    <UploadImageField align="left" readOnly={!logged} url={imageURL} onChange={this.onChangePhoto} className="leftImage" ></UploadImageField>
                    <div><TextValidator
                        label="E-Mail"
                        onChange={this.handleChange}
                        name="email"
                        type="email"
                        value={email}
                        fullWidth={logged}
                        validators={['required', 'isEmail', 'maxStringLength:100']}
                        errorMessages={['this field is required', 'email is not valid', 'exceeds 100 symbols in length']}
                        inputProps={{ readOnly: !logged }}
                        InputLabelProps={logged ? {} : { shrink: !logged }}
                        className={!logged && "readOnly-input"}
                    /></div>
                    <div><TextValidator
                        label="Phone"
                        onChange={this.handleChange}
                        name="phone"
                        type="phone"
                        value={phone}
                        fullWidth={logged}
                        validators={['maxStringLength:20']}
                        errorMessages={['this field is required', 'phone is not valid', 'exceeds 20 symbols in length']}
                        inputProps={{ readOnly: !logged }}
                        InputLabelProps={logged ? {} : { shrink: !logged }}
                        className={!logged && "readOnly-input"}
                    /></div>
                    <div><TextValidator
                        label="Description"
                        onChange={this.handleChange}
                        name="description"
                        type="text"
                        value={description || ''}
                        multiline={true}
                        errorMessages={['Description length exceeds 255 symbols']}
                        fullWidth={logged}
                        inputProps={{ readOnly: !logged }}
                        InputLabelProps={logged ? {} : { shrink: !logged }}
                        className={!logged && "readOnly-input"}
                    /></div>
                    <div><TextValidator
                        label="Company"
                        onChange={this.handleChange}
                        name="company"
                        type="text"
                        value={company || ''}
                        multiline={true}
                        validators={['maxStringLength:255']}
                        errorMessages={['Company length exceeds 255 symbols']}
                        fullWidth={logged}
                        inputProps={{ readOnly: !logged }}
                        InputLabelProps={logged ? {} : { shrink: !logged }}
                        className={!logged && "readOnly-input"}
                    /></div>
                    <div><TextValidator
                        label="Website"
                        onChange={this.handleChange}
                        name="website"
                        type="text"
                        value={website || ''}
                        multiline={true}
                        validators={['maxStringLength:255']}
                        errorMessages={['Website length exceeds 255 symbols']}
                        fullWidth={logged}
                        inputProps={{ readOnly: !logged }}
                        InputLabelProps={logged ? {} : { shrink: !logged }}
                        className={!logged && "readOnly-input"}
                    /></div>
                    <div><TextValidator
                        label="Zip Code"
                        onChange={this.handleChange}
                        name="zip"
                        type="text"
                        value={zip}
                        validators={['required', 'isZip']}
                        errorMessages={['this field is required', 'Zip Code is not valid']}
                        fullWidth={logged}
                        inputProps={{ readOnly: !logged }}
                        InputLabelProps={logged ? {} : { shrink: !logged }}
                        className={!logged && "readOnly-input"}
                    /></div>
                    <div><TextValidator
                        label="Address"
                        onChange={this.handleChange}
                        name="address"
                        type="text"
                        validators={['maxStringLength:255']}
                        errorMessages={['exceeds 255 symbols in length']}
                        value={address || ''}
                        fullWidth={logged}
                        inputProps={{ readOnly: !logged }}
                        InputLabelProps={logged ? {} : { shrink: !logged }}
                        className={!logged && "readOnly-input"}
                    /></div>
                    <div><TextValidator
                        label="City"
                        onChange={this.handleChange}
                        name="city"
                        type="text"
                        validators={['maxStringLength:255']}
                        errorMessages={['exceeds 255 symbols in length']}
                        value={city || ''}
                        fullWidth={logged}
                        inputProps={{ readOnly: !logged }}
                        InputLabelProps={logged ? {} : { shrink: !logged }}
                        className={!logged && "readOnly-input"}
                    /></div>
                    <div>
                        <ExtendableMultiSelect
                            id="select-languages"
                            label="Languages speaking"
                            helperText="Please, select/add languages you speak"
                            value={languages}
                            name="languages"
                            onChange={this.handleChange}
                            entity={LANGUAGE}
                            items={this.props.languages}
                            added={this.props.newLanguage}
                            readOnly={!logged}
                            allowAddNew={true}
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
                            entity={SERVICE}
                            items={this.props.services}
                            readOnly={!logged}
                            allowAddNew={true}
                        ></ExtendableMultiSelect>
                    </div>
                    <div className="error">{errorText}</div>
                    <div className="buttons">
                        <Button type="button" variant="contained" onClick={this.goToList.bind(this)}>Back to the List</Button>
                        {
                            logged &&
                            <Button type="submit" color="primary" variant="contained">{isNew ? 'Create' : 'Save'}</Button>
                        }
                    </div>


                </ValidatorForm>
            </div>
        );
    }
    //}
}

}

Lawyer.propTypes = {
    getItems: PropTypes.func.isRequired,
    getItem: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired,
    getLogged: PropTypes.func.isRequired,

    lawyer: PropTypes.object,
    languages: PropTypes.array.isRequired,
    newLanguage: PropTypes.object.isRequired,
    services: PropTypes.array.isRequired,
    logged: PropTypes.bool.isRequired,
    results: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired
};
const mapStateToProps = state => ({
    lawyer: state.attorney.item,
    languages: state.language.items || [],
    newLanguage: state.language.item,
    services: state.service.items || [],
    logged: state.login.logged,
    results: state.results,
    errors: state.errors
});
export default connect(mapStateToProps, { getItems, getItem, updateItem, getLogged })(Lawyer);


//export default Lawyer;