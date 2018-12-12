import * as types from '../actions/types.js';
import {ATTORNEY} from '../actions/entities.js';

const initialState = { 
    items: [],
    item: {},
    results: [] 
}

export default function(state=initialState, action) {
    if (action.entity !== ATTORNEY) {
        return state;
    }

    let results = [...state.results, { type:action.type, entity: action.entity, success:action.payload.success }];
    switch (action.type) {
        case types.GET_ITEMS:
        case types.DELETE_ITEM:
            return { 
                ...state,
                items: action.payload.data, 
                errors: errors,
                results: results                                                       
            };
        case types.GET_ITEM:
            return { 
                ...state,
                item: action.payload.data, 
                errors: errors ,
                results: results                                                      
            };
        case types.UPDATE_ITEM:
        case types.CREATE_ITEM:
            return { 
                ...state,
                results: results, 
                errors: errors                                                       
            };
        default:
            return state;
        
    }
}