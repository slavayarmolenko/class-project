import * as types from '../actions/types.js';


const initialState = { 
    logged: false,
}

export default function(state=initialState, action) {
    switch (action.type) {
        case types.LOG_IN:
        
        
            return {
                ...state,
                logged: action.payload.logged || false
            }
        case types.GET_LOGGED:
        case types.LOG_IN:
        case types.GET_ITEM:
        case types.UPDATE_ITEM:
        case types.CREATE_ITEM:
        case types.DELETE_ITEM:
            return { 
                ...state,
                logged: action.payload.logged || false                                                       
            };
        default: 
            return state;

        
    }
}