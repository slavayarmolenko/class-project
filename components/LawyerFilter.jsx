import React from 'react';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { URLs } from '../utils/URLs.js';

import ExtendableMultiSelect from './ExtendableMultiSelect.jsx';

import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {LANGUAGE, SERVICE} from '../actions/entities';


/*const styles = theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    paper: {
      width: '80%',
      maxHeight: 435,
    },
  });*/
  

class LawyerFilter extends React.Component {
    constructor(props) {
        super();
        this.defaultFilter = {
            distance: 10,
            usersZip: '',
            units: 'mil',
            languages: [],
            services: []
        };
        this.state = {
            filter: Object.assign({}, this.defaultFilter)
        };
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeFilter = this.handleChangeFilter.bind(this);
        this.emptyFilter = this.emptyFilter.bind(this);
    }
  
    componentDidMount() {
        ValidatorForm.addValidationRule('isZip', (value) => {
            if (!value) {
                return true;
            }
            if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value)) {
                return true;
            }
            return false;
        });
        ValidatorForm.addValidationRule('isPhone', (value) => {
            if (!value) {
                return true;
            }
            if (/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(value)) {
                return true;
            }
            return false;
        });
    }

    handleChangeFilter(event) {
        const { filter } = this.state;
        
        if (event.target.type === 'checkbox') {
            filter[event.target.name] = event.target.checked;
        } else {
            filter[event.target.name] = event.target.value;
        }
        this.setState({ filter });
    }
    handleSubmit(event) {
        if (event) {
            event.preventDefault();
        }
        if (this.props.onChange) {
            this.props.onChange(this.state.filter);
        }
    }
    emptyFilter() {
        this.setState({ filter: Object.assign({}, this.defaultFilter) });
        this.handleSubmit();
    }
    
  
    render() {
        const {distance, usersZip, units, languages, services } = this.state.filter;

        return (
    <div className="filter">
        <ValidatorForm 
            onSubmit={this.handleSubmit}
            onError={errors => console.log(errors)}
        >   
            
            <div><TextValidator
                label="Zip Code"
                onChange={this.handleChangeFilter}
                name="usersZip"
                type="text"
                value={usersZip}
                validators={['isZip']}
                errorMessages={['Zip Code is not valid']}
            /></div>
            <div>
                <TextValidator
                label="Distance"
                onChange={this.handleChangeFilter}
                name="distance"
                type="number"
                validators={['isNumber']}
                errorMessages={['distance should be numeric']}
                value={distance}/>
            </div>
            <div>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Units</FormLabel>
                    <RadioGroup
                        aria-label="Units"
                        name="units"
                        value={units}
                        onChange={this.handleChangeFilter}
                        row
                    >
                        <FormControlLabel value="mil" control={<Radio />} label="Miles" />
                        <FormControlLabel value="km" control={<Radio />} label="Km" />
                    </RadioGroup>
                </FormControl>
            </div>
            <div>
                    <ExtendableMultiSelect
                        id="select-languages"
                        label="Languages Spoken"
                        helperText="Please, select/add languages attorneys support"
                        value={languages}
                        items={this.props.languages}
                        added={this.props.newLanguage}
                        name="languages"
                        onChange={this.handleChangeFilter}
                        entity={LANGUAGE}
                    ></ExtendableMultiSelect>
            </div>
            <div>
                    <ExtendableMultiSelect
                        id="select-services"
                        label="Services Offered"
                        helperText="Please, select/add services attorneys offer"
                        items={this.props.services}
                        value={services}
                        added={this.props.newService}
                        name="services"
                        onChange={this.handleChangeFilter}
                        entity={SERVICE}
                    ></ExtendableMultiSelect>
            </div>
            <div className="buttons">
                <Button type="submit" variant="contained" onClick={this.emptyFilter}>Reset</Button>
                <Button type="submit" color="primary" variant="contained">Filter</Button>
            </div>
        </ValidatorForm>
        
    </div>
      );
    }
  }
  

  
LawyerFilter.propTypes = {
    onChange: PropTypes.func,
    languages: PropTypes.array.isRequired,
    services: PropTypes.array.isRequired,
    newLanguage: PropTypes.object,
    newService: PropTypes.object
};
const mapStateToProps = state => ({
    languages: state.language.items || [],
    services: state.service.items || [],
    newLanguage: state.language.item || {},
    newService: state.service.item || {}
});
export default connect(mapStateToProps, { })(LawyerFilter);


//export default LawyerFilter;