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


class ExtendableMultiSelect extends React.Component {
    constructor(props) {
        super(props);
        /* Props should contain the following props
            label: string
            onChange(event): function
            items:[<id:string, name: string>]
            value:[<string>]
            name: string
            helperText: string
            enterNewLabel: string
            getItemsUrl: string
         */
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
    componentDidMount() {
        this._isMounted = true;
        var itemsUrl = this.props.getItemsUrl;
        if (!itemsUrl) {
            return;
        }
        axios.get(itemsUrl)
                .then(result => {
                    if (!this._isMounted) {
                        return;
                    }
                    if (result.data.success) {
                        this.setState({ items: result.data.data });
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
    componentWillReceiveProps(nextProps){
        if(nextProps.value!==this.props.value){
          this.setState({value: nextProps.value });
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
                            this.onAddItemError(newItemName, result.errMessage);
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

    render() {
        const value = this.state.value;
        const items = this.state.items;
        const readOnly = this.props.readOnly;
        return (
                <FormControl style={{display: 'flex', flexWrap: 'wrap'}}>

                    <InputLabel htmlFor={this.props.id}>{this.props.label}</InputLabel>
                    <Select
                        multiple
                        value={value}
                        displayEmpty={true}
                        onChange={this.handleSelectionChange}
                        input={<Input id={this.props.id} readOnly = {readOnly} />}
                    >
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
                        {items.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                            {item.name}
                        </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{this.props.helperText}</FormHelperText>
                </FormControl>
                   );
    }
}
export default ExtendableMultiSelect;