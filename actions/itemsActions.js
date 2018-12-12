import * as types from './types';
import axios from 'axios';
import { serviceURLs } from './URLs';
import * as entities from './entities';

const getEntityUrl = (entity) => {
    switch (entity) {
        case entities.ATTORNEY:
            return serviceURLs.LAWYER;
        case entities.COMPANY:
            return serviceURLs.COMPANY;
        case entities.LANGUAGE:
            return serviceURLs.LANGUAGES;
        case entities.SERVICE:
            return serviceURLs.SERVICES;
        default:
            return '';
    };
};

export const deleteItem = (entity, id, someOtherParams) => dispatch => {
    const url = getEntityUrl(entity);
    if (!url) {
        return;
    }

    if (!id) {
        return;
    }
    axios.delete(url, { params: { id: id, ...someOtherParams } })
                .then(result => {
                    dispatch({
                        entity: entity,
                        type: types.DELETE_ITEM,
                        payload: result.data
                    })
                })
                .catch(error => {
                    dispatch({
                        entity: entity,
                        type: types.DELETE_ITEM,
                        payload: {
                                success: false,
                                errMessage: 'Error, while getting ' + entity + ': ' + (error.message || error.response.statusText),
                                logged: false
                        }
                    })
                });

}

export const getItem = (entity, id) => dispatch => {
    const url = getEntityUrl(entity);
    if (!url) {
        return;
    }

    if (!id) {
        return;
    }
    axios.get(url, { params: { id: id } })
                .then(result => {
                    dispatch({
                        entity: entity,
                        type: types.GET_ITEM,
                        payload: result.data
                    })
                })
                .catch(error => {
                    dispatch({
                        entity: entity,
                        type: types.GET_ITEM,
                        payload: {
                                success: false,
                                errMessage: 'Error, while getting ' + entity + ': ' + (error.message || error.response.statusText),
                                logged: false
                        }
                    })
                });

}

export const getItems = (entity, data) => dispatch => {
        const url = getEntityUrl(entity);
        if (!url) {
            return;
        } 

        axios.get(url, {params: data })
            .then(result => {

                dispatch({
                    entity: entity,
                    type: types.GET_ITEMS,
                    payload: result.data
                })
                
            })
            .catch(error => {
                dispatch({
                    entity: entity,
                    type: types.GET_ITEMS,
                    payload: {
                            success: false,
                            errMessage: 'Error, while getting ' + entity + ' list: ' + (error.message || error.response.statusText),
                            logged: false
                    }
                })
            });

    
};

export const updateItem = (entity, data) => dispatch => {
    const url = getEntityUrl(entity);
    if (!url) {
        return;
    } 

    axios.post(url, data)
        .then(result => {

            dispatch({
                entity: entity,
                type: types.UPDATE_ITEM,
                payload: result.data
            })
            
        })
        .catch(error => {
            dispatch({
                entity: entity,
                type: types.UPDATE_ITEM,
                payload: {
                        success: false,
                        errMessage: 'Error, while updating ' + entity + ': ' + (error.message || error.response.statusText),
                        logged: false
                }
            })
        });


};