import * as types from '../actions/types.js';

const initialState = '';

export default function(state=initialState, action) {
    if (action !== types.SAVE_IMAGE) {
        return '';
    }
    return action.payload.data || '';                                                     

    
}