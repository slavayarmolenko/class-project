import * as types from '../actions/types.js';

const initialState = [];

export default function(state=initialState, action) {
    switch (action.type) {
        case types.GET_LOGGED:
        case types.LOG_IN:
        case types.GET_ITEM:
        case types.UPDATE_ITEM:
        case types.CREATE_ITEM:
        case types.DELETE_ITEM:
            if (action.payload.success) {
                return state;
            }
            return [...state, { id: 'err' + Date.now(), text: action.payload.errMessage, code: action.payload.errCode }];
        default:
            return state;
                                                                      
        
    }
}