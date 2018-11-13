import React from 'react';
import { Redirect } from "react-router-dom";
import red from '@material-ui/core/colors/red';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import axios from 'axios';

class Lawyer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lawyer: {
                uzvername: '',
                name: '',
                email: '',
                password: '',
                description: '',
                zip: '',        
                address: '',
                languages: [],
                areas: [],
            },
            allLanguages: [{id: 0, name: 'English'},{id:1, name:'Spanish'}, {id:2, name: 'Russian'}],
            allAreas: [{id: 0, name: 'DACA'},{id:1, name:'Family Reunion'}, {id:2, name: 'Deportation'}],
            errorText: '',
            redirectToList: false,

        };
        this.logged = true;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeLang = this.handleChangeLang.bind(this);
        this.handlePropChange = this.handlePropChange.bind(this);
        this.handleAddLanguage = this.handleAddLanguage.bind(this);
        this.handleChangeArea = this.handleChangeArea.bind(this);
        this.handleAddArea = this.handleAddArea.bind(this);
        
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
        this.getLawyerById(this.props.id);
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
    handleChangeLang(event) {
        const { lawyer } = this.state;
        var langSelected = event.target.value;
        if (langSelected.findIndex(function(newlySelectedLang) { return newlySelectedLang === null }) === -1) {
            lawyer.languages = event.target.value;
            this.setState({ lawyer });
        } else {
            event.preventDefault();
        }
    }
    handlePropChange(event) {
        var propname = event.target.name;
        this.setState({ [propname]: event.target.value });
    }
    handleAddLanguage(event) {
        event.preventDefault();
        var newLangName = this.state.newLangName;
        var langs = this.state.allLanguages;
        const { lawyer } = this.state;
        
        if (langs.findIndex(function(lang) { lang.name === newLangName; }) === -1) {
            langs.push({ id: newLangName, name: newLangName});
            lawyer.languages.push(newLangName);
            this.setState({ allLanguages: langs, newLangName: '', lawyer: lawyer });
        }
    }

    handleChangeArea(event) {
        const { lawyer } = this.state;
        var areaSelected = event.target.value;
        if (areaSelected.findIndex(function(newlySelectedArea) { return newlySelectedArea === null }) === -1) {
            lawyer.areas = event.target.value;
            this.setState({ lawyer });
        } else {
            event.preventDefault();
        }
    }
    
    handleAddArea() {
        event.preventDefault();
        var newAreaName = this.state.newAreaName;
        var areas = this.state.allAreas;
        const { lawyer } = this.state;
        
        if (areas.findIndex(function(area) { area.name === newAreaName; }) === -1) {
            areas.push({ id: newAreaName, name: newAreaName});
            lawyer.areas.push(newAreaName);
            this.setState({ allAreas: areas, newAreaName: '', lawyer: lawyer });
        }
    }
    handleSubmit() {
        this.setState({ errorText: '' });
        axios.post('/api/lawyers', this.state.lawyer)
                .then(result => {
                    if (result.success) {
                        this.goToList();
                    } else {
                        this.setState({
                            errorText: error.response.statusText
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
        axios.get('/api/lawyers', { params: { id: this.props.id } })
                .then(result => {
                    if (result.data.success) {
                        this.setState({ lawyer: result.data.data });
                    } else {
                        this.setState({
                            errorText: 'Error: ' + result.errMessage
                        });
                    }
                })
                .catch(error => {
                    this.setState({
                        errorText: 'Error: ' + error.response.statusText,
                    });
                });
    }
    render() {
        const { uzvername, name, email, password, repeatPassword, 
            description, zip, languages, address,
            areas} = this.state.lawyer;
        const errorText = this.state.errorText;
        const red300 = red['500'];
        /*const MenuProps = {
            PaperProps: {
              style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
              },
            },
          };*/
 
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
          <div className="container pageContent">
            <h1>Lawyer</h1>
            <ValidatorForm 
                onSubmit={this.handleSubmit}
                onError={errors => console.log(errors)}
            >   
                <div style={errStyle}>{errorText}</div>
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
                    <div><InputLabel htmlFor="select-language">Languages speaking</InputLabel></div>
                    <Select
                        multiple
                        value={languages}
                        onChange={this.handleChangeLang}
                        input={<Input id="select-language" />}
                        fullWidth={true}
                    >
                        <MenuItem key={null} value={null}>
                            <ValidatorForm 
                                onSubmit={this.handleAddLanguage}
                                onError={errors => console.log(errors)}
                            >   
                                <TextValidator
                                    label="New Language"
                                    onChange={this.handlePropChange}
                                    name="newLangName"
                                    type="text"
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    value={this.state.newLangName}
                                    autocomplete={false}
                                />
                            </ValidatorForm>
                        </MenuItem>
                        {this.state.allLanguages.map(lang => (
                        <MenuItem key={lang.id} value={lang.id}>
                            {lang.name}
                        </MenuItem>
                        ))}
                    </Select>
                </div>
                <div>
                    <div><InputLabel htmlFor="select-area">Attorney areas</InputLabel></div>
                    <Select
                        multiple
                        value={areas}
                        onChange={this.handleChangeArea}
                        input={<Input id="select-prof" />}
                        fullWidth={true}
                    >
                        <MenuItem key={null} value={null}>
                            <ValidatorForm 
                                onSubmit={this.handleAddArea}
                                onError={errors => console.log(errors)}
                            >   
                                <TextValidator
                                    label="New Area of Interests"
                                    onChange={this.handlePropChange}
                                    name="newAreaName"
                                    type="text"
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    value={this.state.newAreaName}
                                    autocomplete={false}
                                />
                            </ValidatorForm>
                        </MenuItem>
                        {this.state.allAreas.map(lang => (
                        <MenuItem key={lang.id} value={lang.id}>
                            {lang.name}
                        </MenuItem>
                        ))}
                    </Select>
                </div>
                <Button type="submit" color="primary" variant="contained">Submit</Button>
            </ValidatorForm>
            </div>
                   );
        }
    //}

}
export default Lawyer;