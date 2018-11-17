import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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
    }
    /*componentDidUpdate(nextProps) {
        this.setState({
            items: nextProps.items || [],
            value: nextProps.value || []
        });
    }*/
    componentDidMount() {
        var itemsUrl = this.props.getItemsUrl;
        if (!itemsUrl) {
            return;
        }
        axios.get(itemsUrl)
                .then(result => {
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
        var items = this.state.items;
        var value = this.state.value;
        
        if (items.findIndex(function(item) { item.name === newItemName; }) === -1) {
            items.push({ id: newItemName, name: newItemName});
            value.push(newItemName);
            this.setState({ items: items, newItemName: '', value: value });
            this.props.onChange({ target: { name: this.props.name, value: value, type: 'select' }});
        }
    }

    render() {
        return (
                    <TextField
                        select
                        label={this.props.label}
                        fullWidth={true}
                        value={this.state.value}
                        onChange={this.handleSelectionChange}
                        SelectProps={{
                            MenuProps: {
                                style: {
                                    width: 200,
                                }
                            },
                        }}
                        helperText={this.props.helperText }
                        margin="normal"
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
                        {this.state.items.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                            {item.name}
                        </MenuItem>
                        ))}
                    </TextField>
                   );
    }
}
export default ExtendableMultiSelect;