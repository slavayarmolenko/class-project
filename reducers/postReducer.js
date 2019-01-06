import * as types from '../actions/types.js';
import {POST} from '../actions/entities.js';

const initialState = { 
    items: [],
    item: {} 
}

export default function(state=initialState, action) {
    if (action.entity !== POST) {
        return state;
    }

    switch (action.type) {
        case types.GET_ITEMS:
        case types.DELETE_ITEM:
            return { 
                ...state,
                items: action.payload.data, 
            };
        case types.GET_ITEM:
            return { 
                ...state,
                item: action.payload.data, 
            };
        case types.UPDATE_ITEM:
        case types.CREATE_ITEM:
            return { 
                ...state,
            };
        default:
            return state;
        
    }
}