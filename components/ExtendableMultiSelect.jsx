import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { TextValidator} from 'react-material-ui-form-validator';

import {connect} from 'react-redux';
import {getItems, deleteItem, updateItem} from '../actions/itemsActions';
import PropTypes from 'prop-types';
import { UPDATE_ITEM } from '../actions/types';



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

        if ((nextProps.results.length > this.props.results.length) && nextProps.results[nextProps.results.length - 1].success) {
            var lastResult = nextProps.results[nextProps.results.length - 1];
            if ((lastResult.entity === this.props.entity) && (lastResult.action === UPDATE_ITEM) && 
                nextProps.added && nextProps.added.id) {
                    var value = this.state.value;
                    var items = this.state.items;
                    var newItemName = nextProps.added.name;
                    var newItemIndex = items.findIndex(function(it){ 
                        return it.id === newItemName; 
                    });
                    var newValueIndex = value.findIndex(function(val){ 
                        return val === newItemName; 
                    });
                    
                    if (newValueIndex !== -1) {
                        value[newValueIndex] = nextProps.added.id;
                    }
                    if (newItemIndex !== -1) {
                        items[newItemIndex].id = nextProps.added.id;
                    }
                    this.setState({ value, items});
                    this.props.onChange({ target: { name: this.props.name, value: value, type: 'select' }});
            }
        }

        
        if (nextProps.errors.length > this.props.errors.length) {
            var lastErr = nextProps.errors[nextProps.errors.length - 1];
            if ((lastErr.action === UPDATE_ITEM) && (lastErr.entity === this.props.entity)) {
                var failedLanguageName = lastErr.data.name;
                this.onAddItemError(failedLanguageName, lastErr.text);
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
            this.props.updateItem(this.props.entity, { name: newItemName });
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
        this.props.deleteItem(this.props.entity, itemId);
    }

    render() {
        const value = this.state.value;
        const items = this.state.items;
        const readOnly = this.props.readOnly ? true : false;
        return (
                <FormControl style={{display: 'flex', flexWrap: 'wrap'}} className={readOnly && "readOnly-input"}>

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
                                    className={readOnly && "readOnly-input"}
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
    deleteItem: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired,

    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    items: PropTypes.array, //[<id:string, name: string>]
    value:PropTypes.array, //[<string>]
    name: PropTypes.string,
    added: PropTypes.object,
    helperText: PropTypes.string,
    enterNewLabel: PropTypes.string,
    entity: PropTypes.string, // - name of the entity, which returns array of {id, name} objects
    allowAddNew: PropTypes.bool,
    
    results: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    results: state.results,
    errors: state.errors
});

export default connect(mapStateToProps, { getItems, deleteItem, updateItem })(ExtendableMultiSelect);