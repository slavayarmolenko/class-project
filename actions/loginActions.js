import * as types from './types.js';
import axios from 'axios';
import { serviceURLs } from './URLs';

export const getLogged = () => dispatch => {
        console.log('Check login');
        axios.get(serviceURLs.LOGGED)
            .then(result => {
                dispatch({
                    type: types.GET_LOGGED,
                    payload: result.data
                })
                
            })
            .catch(error => {
                console.log('Check login failed');
                dispatch({
                    type: types.GET_LOGGED,
                    payload: {
                            success: false,
                            errMessage: 'Check logged error: ' + (error.message || error.response.statusText),
                            data: [],
                            logged: false
                    }
                })
            });
    
};

export const login = (data) => dispatch => {
    
    axios.post(serviceURLs.LOGGED, data)
        .then(result => {

            dispatch({
                entity: 'login',
                type: types.LOG_IN,
                payload: result.data
            })
            
        })
        .catch(error => {
            dispatch({
                entity: 'login',
                type: types.LOG_IN,
                payload: {
                        success: false,
                        errMessage: 'Error, while login ' + entity + ': ' + error.response.statusText,
                        logged: false
                }
            })
        });


};