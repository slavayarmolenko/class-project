import * as types from '../actions/types.js';


const initialState = { 
    logged: false,
    errors: [],
    results: [] 
}

export default function(state=initialState, action) {
    switch (action.type) {
        case types.LOG_IN:
            let errors = [...state.errors];
            if (!action.success && action.payload.errMessage) {
                errors.push({ 
                    id: 'err' + Date.now(),
                    text: action.payload.errMessage
                });
            }
        
            const results = [...state.results, { type:action.type, entity: 'LOGIN', success:action.payload.success }];
        
            return {
                ...state,
                errors: errors,
                results: results,
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