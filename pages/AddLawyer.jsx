import React from 'react';
import { Redirect } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import axios from 'axios';


class AddLawyer extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            lawyer: {
                name: '',
                email: '',
                int: 2
            }
        };
        this.logged = true;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        const { lawyer } = this.state;
        lawyer[event.target.name] = event.target.value;
        this.setState({ lawyer });
    }
 
    handleSubmit() {
        axios.post('/api/lawyers', this.state.lawyer)
                .then(result => {
                    console.log('Submitted laywer');
                    console.log(result.data);
                    this.setState({
                        data: result.data.data,
                        dataLoaded: true
                    });

                })
                .catch(error => {
                    console.log('error::');
                    console.log('bebebe:' + error);
                    this.setState({
                        error: error.Error,
                        dataLoaded: false
                    });

                });
    }
    
    render() {
        const { name, email } = this.state.lawyer;
        if (!this.logged) {
            return <Redirect to='/lawyers'  />;
        }
        return (
            <div class="container">
            <ValidatorForm 
                onSubmit={this.handleSubmit}
                onError={errors => console.log(errors)}
            >   
                <div>
                <TextValidator
                    label="Name"
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
                <Button type="submit">Submit</Button>
            </ValidatorForm>
            </div>
                   );
    }
}
export default AddLawyer;