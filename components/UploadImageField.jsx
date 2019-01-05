import React from 'react';
import { TextValidator } from 'react-material-ui-form-validator';
import FormHelperText from '@material-ui/core/FormHelperText';

import { connect } from 'react-redux';
import { uploadImage } from '../actions/imageActions';
import { getItem } from '../actions/itemsActions';
import {SAVE_IMAGE} from '../actions/types';
import PropTypes from 'prop-types';


class UploadImageField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value || [],
            newItemName: '',
            errorText: '',
            redirectToList: false
        };
        this.uploadFile = this.uploadFile.bind(this);
        this._isMounted = false;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    componentWillMount() {
        this._isMounted = true;
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({ value: nextProps.value });
        }

        if ((nextProps.results.length > this.props.results.length) && nextProps.results[nextProps.results.length - 1].success) {
            var lastResult = nextProps.results[nextProps.results.length - 1];
            if ((lastResult.action === SAVE_IMAGE) && nextProps.image) {
                this.props.onChange({ id: nextProps.image });
            }
        }


        if (nextProps.errors.length > this.props.errors.length) {
            var lastErr = nextProps.errors[nextProps.errors.length - 1];
            if ((lastErr.action === SAVE_IMAGE)) {
                this.setState({ errorText: lastErr.text });
            }
        }

    }
    
    uploadFile(e) {
        const files = Array.from(e.target.files);
        if (files.length === 1) {
            var file = files[0];
            this.props.uploadImage(file);
        }
    }

    render() {
        return (
                    <div>
                        <FormHelperText error={ this.state.errorText ? true : false}>{this.state.errorText}</FormHelperText>
                        <TextValidator
                            label={'Change Image'}
                            onChange={this.uploadFile}
                            name="photoImage"
                            type="file"
                            validators={[]}
                            errorMessages={[]}
                            multiple={false}
                        />
                    </div>
        );
    }
}

UploadImageField.propTypes = {
    uploadImage: PropTypes.func.isRequired,
    getItem: PropTypes.func.isRequired,

    results: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired,
    image: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    image: state.image,
    results: state.results,
    errors: state.errors
});

export default connect(mapStateToProps, { uploadImage, getItem })(UploadImageField);