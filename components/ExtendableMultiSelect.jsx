import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { TextValidator} from 'react-material-ui-form-validator';
import axios from 'axios';

import {connect} from 'react-redux';
import {getItems, deleteItem} from '../actions/itemsActions';
import PropTypes from 'prop-types';



class ExtendableMultiSelect extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            items: this.props.items || [],
            value: this.props.value || [],
            newItemName: '',
            errorText: '',
            redirectToList: false
        };
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.handlePropChange = this.handlePropChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.onNewNameKeyPress = this.onNewNameKeyPress.bind(this);
        this._isMounted = false;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    componentWillMount() {
        this._isMounted = true;
        if (!this.props.items.length) {
            this.props.getItems(this.props.entity);
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.value!==this.props.value){
          this.setState({value: nextProps.value });
        }

        if(nextProps.items.length!==this.props.items.length){
            this.setState({items: nextProps.items });
        }

        if (nextProps.added && nextProps.added.id) {
            if (nextProps.added.id) {
                        var value = this.state.value;
                        var newValueIndex = value.findIndex(function(val){ 
                            return val === newItemName; 
                        });
                        
                        if (newValueIndex !== -1) {
                            value[newValueIndex] = nextProps.added.id;
                        }
                        this.setState({ value});
                        this.props.onChange({ target: { name: this.props.name, value: value, type: 'select' }});
            } else {
                //this.onAddItemError(newItemName, result.data.errMessage);
            }
        }

    }
    handleSelectionChange(event) {
        var itemSelected = event.target.value;
        if (itemSelected.findIndex(function(newlySelectedItem) { return newlySelectedItem === null }) === -1) {
            var newSelectedValue = event.target.value;
            this.setState({ value: newSelectedValue });
            this.props.onChange({ target: { name: this.props.name, value: newSelectedValue, type: 'select' }});
        } else {
            event.preventDefault();
        }
    }
    handlePropChange(event) {
        var propname = event.target.name;
        this.setState({ [propname]: event.target.value });
    }
    onNewNameKeyPress(event) {
        if (event.key.toLowerCase() === 'enter') {
            this.handleAdd(event);
        }
    }
    handleAdd(event) {
        event.preventDefault();
        var newItemName = this.state.newItemName.trim();
        if (!newItemName) {
            return;
        }
        this.putNewLanguageIntoClientList(newItemName);
        this.putNewLanguageIntoDBList(newItemName);
    }
    putNewLanguageIntoClientList(newItemName) {
        var items = this.state.items;
        var value = this.state.value;
        
        var newListItem = { id: newItemName, name: newItemName};

        if (items.findIndex(function(item) { item.name === newItemName; }) === -1) {
            items.push(newListItem);
            value.push(newItemName);
            this.setState({ items: items, newItemName: '', value: value });
        }
    }

    putNewLanguageIntoDBList(newItemName) {
            var itemsUrl = this.props.getItemsUrl;
            if (!itemsUrl) {
                return;
            }
            
            axios.post(itemsUrl, { name: newItemName })
                    .then(result => {
                        if (!this._isMounted) {
                            return;
                        }
                        var items = this.state.items;
                        var value = this.state.value;
                        var newItemIndex = items.findIndex(function(it) { 
                            return it.id === newItemName 
                        });
                        var newValueIndex = value.findIndex(function(val){ 
                            return val === newItemName; 
                        });
                        if (result.data.success) {
                            if (newItemIndex !== -1) {
                                items[newItemIndex].id = result.data.data.id;
                            }
                            if (newValueIndex !== -1) {
                                value[newValueIndex] = result.data.data.id;
                            }
                            this.setState({ items, value});
                            this.props.onChange({ target: { name: this.props.name, value: value, type: 'select' }});
                        } else {
                            this.onAddItemError(newItemName, result.data.errMessage);
                        }
                    })
                    .catch(error => {
                        this.onAddItemError(newItemName, error.response.statusText);
                    });
    }
    onAddItemError(newItemName, errText) {
        var items = this.state.items;
        var value = this.state.value;
        var newItemIndex = items.findIndex(function(it) { return it.name === newItemName });
        var newValueIndex = value.findIndex(function(val){ return val === newItemName });
        if (newItemIndex !== 1) {
            items.splice(newItemIndex, 1);
        }
        if (newValueIndex) {
            value.splice(newValueIndex, 1);
        }
        this.setState({ items, value, errorText: 'Could not add new item. Error: ' + errText});
    }

    deleteItem(itemId) {
        this.props.deleteItem(itemId);
        /*var deleteUrl = this.props.getItemsUrl;
         axios.delete(deleteUrl, {params: {id: itemId }})
            .then(result => {
                this.setState({
                    items: result.data.data,
                    dataLoaded: true
                });

            })
            .catch(error => {
                this.setState({
                    errorText: error.response.statusText,
                    dataLoaded: false
                });

            });*/
    }

    render() {
        const value = this.state.value;
        const items = this.state.items;
        const readOnly = this.props.readOnly ? true : false;
        return (
                <FormControl style={{display: 'flex', flexWrap: 'wrap'}}>

                    <InputLabel htmlFor={this.props.id}>{this.props.label}</InputLabel>
                    <Select
                        multiple
                        value={value}
                        displayEmpty={true}
                        onChange={this.handleSelectionChange}
                        input={<Input id={this.props.id} readOnly={readOnly} placeholder={this.props.helperText} />}
                    >
                        { this.props.allowAddNew &&
                        <MenuItem key={null} value={null}>
                                <TextValidator
                                    label={'Enter new value'}
                                    onChange={this.handlePropChange}
                                    name="newItemName"
                                    type="text"
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    value={this.state.newItemName}
                                    onKeyPress={this.onNewNameKeyPress}
                                />
                                <Button onClick={this.handleAdd}>+</Button>
                        </MenuItem>
                        }
                        {items.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                            {item.name}
                        </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText error={ this.state.errorText ? true : false}>{this.state.errorText}</FormHelperText>
                </FormControl>
                   );
    }
}
/*{ <Button onClick={this.deleteItem.bind(this, item.id)}>x</Button>}*/

ExtendableMultiSelect.propTypes = {
    getItems: PropTypes.func.isRequired,

    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    items: PropTypes.array, //[<id:string, name: string>]
    value:PropTypes.array, //[<string>]
    name: PropTypes.string,
    added: PropTypes.object,
    helperText: PropTypes.string,
    enterNewLabel: PropTypes.string,
    entity: PropTypes.string, // - name of the entity, which returns array of {id, name} objects
    allowAddNew: PropTypes.bool
};

export default connect(null, { getItems, deleteItem })(ExtendableMultiSelect);
//export default ExtendableMultiSelect;