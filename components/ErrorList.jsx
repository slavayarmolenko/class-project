/*
Vladislav Iarmolenko
slava.yarmolenko@gmail.com
Created: August 2018
*/
import React from "react";
import styles from './Header.module.scss';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class ErrorList extends React.Component {
    componentWillReceiveProps(props) {
        if (props.errors.length === 1) {
            console.log('We have an error');
        }
    }
    render() {
        const lastError = this.props.errors.length ? this.props.errors[this.props.errors.length - 1] : null;
        return (
            <div className={styles.errors}>
                {lastError && (
                        <div key={lastError.id} className={styles.error}>
                            {lastError.text}
                        </div>
                )}
            </div>
            
        )
    };
}

ErrorList.propTypes = {
    errors: PropTypes.array.isRequired
};


const mapStateToProps = state => ({
    errors: state.errors
});
export default connect(mapStateToProps, { })(ErrorList);
