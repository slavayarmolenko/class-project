import * as types from '../actions/types.js';
import {LANGUAGE} from '../actions/entities.js';

const initialState = { 
    items: [],
    item: {},
    results: []
}

export default function(state=initialState, action) {
    if (action.entity !== LANGUAGE) {
        return state;
    }
    let results = [...state.results, { type:action.type, entity: action.entity, success:action.payload.success }];
    switch (action.type) {
        case types.GET_ITEMS:
            return { 
                ...state,
                items: action.payload.data,
                results: results                                                       
            };
        case types.UPDATE_ITEM:
        case types.CREATE_ITEM:
            return { 
                ...state,
                item: action.payload.data,
                results: results                                                         
            };
        case types.DELETE_ITEM:
            return { 
                ...state,
                items: action.payload.data ,
                results: results                                                       
            };
        default:
            return state;
        
    }
}