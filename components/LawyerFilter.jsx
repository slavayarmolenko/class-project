import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { URLs } from '../utils/URLs.js';
import ExtendableMultiSelect from './ExtendableMultiSelect.jsx';


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
        this.state = {
            filter: {
                distance: 10,
                usersZip: '',
                units: 'mil',
                languages: [],
                services: []
            },
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeFilter = this.handleChangeFilter.bind(this);
        
    }
  
    componentDidMount() {
        ValidatorForm.addValidationRule('isZip', (value) => {
            if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value)) {
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
        if (this.props.onChange) {
            this.props.onChange(event, this.state.filter);
        }
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
                        label="Speaking languages"
                        helperText="Please, select/add languages attorneys support"
                        value={languages}
                        name="languages"
                        onChange={this.handleChangeFilter}
                        getItemsUrl={URLs.services.LANGUAGES}
                    ></ExtendableMultiSelect>
            </div>
            <div>
                    <ExtendableMultiSelect
                        id="select-services"
                        label="Offer Services"
                        helperText="Please, select/add services attorneys offer"
                        value={services}
                        name="services"
                        onChange={this.handleChangeFilter}
                        getItemsUrl={URLs.services.SERVICES}
                    ></ExtendableMultiSelect>
            </div>
            <Button type="submit" color="primary" variant="contained">Filter</Button>
        </ValidatorForm>
        
    </div>
      );
    }
  }
  
  LawyerFilter.propTypes = {
    onChange: PropTypes.func,
  };
  //export default withStyles(styles)(ConfirmationDialog);
  export default LawyerFilter;