import React from 'react';
import { Redirect } from "react-router-dom";
import red from '@material-ui/core/colors/red';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import ExtendableMultiSelect from './../components/ExtendableMultiSelect.jsx';
import axios from 'axios';
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
            logged: false
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
        axios.get('/api/lawyers', { params: { id: this.props.id } })
                .then(result => {
                    if (result.data.success) {
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

        if (this.state.redirectToList) {
            return <Redirect to='/attorneys'  />;
        }
        return (
          <div className="container pageContent">
            <h1>Attorney</h1>
            <ValidatorForm 
                onSubmit={this.handleSubmit}
                onError={errors => console.log(errors)}
                readOnly={true}
            >   
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
                </div>
                
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
                    value={address}
                    fullWidth={true}
                /></div>
                <div>
                    <ExtendableMultiSelect
                        id="select-languages"
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
                        id="select-services"
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
    //}

}
export default Lawyer;