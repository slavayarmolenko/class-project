import {combineReducers} from 'redux';
import attorneyReducer from './attorneyReducer.js';
import loginReducer from './loginReducer.js';
import errorReducer from './errorReducer.js';
import resultReducer from './resultReducer.js';
import languageReducer from './languageReducer.js';
import serviceReducer from './serviceReducer.js';
import imageReducer from './imageReducer.js';

export default combineReducers({
    attorney: attorneyReducer,
    language: languageReducer,
    service: serviceReducer,
    login: loginReducer,
    errors: errorReducer,
    results: resultReducer,
    image: imageReducer
})