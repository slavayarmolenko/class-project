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
            url: this.props.url || [],
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
        if (nextProps.imageURL !== this.props.imageURL) {
            this.setState({ url: nextProps.imageURL });
        }
        if (nextProps.url !== this.props.url) {
            this.setState({ url: nextProps.url });
        }

        if ((nextProps.results.length > this.props.results.length) && nextProps.results[nextProps.results.length - 1].success) {
            var lastResult = nextProps.results[nextProps.results.length - 1];
            if ((lastResult.action === SAVE_IMAGE) && nextProps.imageID) {
                this.props.onChange(nextProps.imageID);
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
        const className = !!this.props.align && this.props.align;
        return (
                    <div className={className}>
                        <FormHelperText error={ this.state.errorText ? true : false}>{this.state.errorText}</FormHelperText>
                        {!this.props.readOnly &&
                            <TextValidator
                                label="Change Image"
                                onChange={this.uploadFile}
                                name="photoImage"
                                type="file"
                                validators={[]}
                                errorMessages={[]}
                                multiple={false}
                            />
                        }
                        {this.state.url &&
                            <div><img src={this.state.url} className="photo big" height="200"></img></div>
                        }
                    </div>
        );
    }
}

UploadImageField.propTypes = {
    uploadImage: PropTypes.func.isRequired,
    getItem: PropTypes.func.isRequired,

    results: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired,
    imageID: PropTypes.number.isRequired,

    imageURL: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
};

const mapStateToProps = state => ({
    imageID: state.image.imageID,
    imageURL: state.image.url,
    results: state.results,
    errors: state.errors
});

export default connect(mapStateToProps, { uploadImage, getItem })(UploadImageField);