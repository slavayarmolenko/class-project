import * as types from '../actions/types.js';

const initialState = {
    imageID: 0,
    url: ''
};

export default function(state=initialState, action) {
    if (action.type !== types.SAVE_IMAGE) {
        return state;
    }
    if (action.payload.success) {
        return { 
            ...state,
            imageID: action.payload.data.imageID,
            url: action.payload.data.url                                                       
        };
    } else {
        return state;
    }                                                    

    
}