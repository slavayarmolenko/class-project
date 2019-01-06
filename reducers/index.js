import {combineReducers} from 'redux';
import attorneyReducer from './attorneyReducer.js';
import userReducer from './userReducer.js';
import loginReducer from './loginReducer.js';
import errorReducer from './errorReducer.js';
import resultReducer from './resultReducer.js';
import languageReducer from './languageReducer.js';
import serviceReducer from './serviceReducer.js';
import imageReducer from './imageReducer.js';
import postReducer from './postReducer.js';

export default combineReducers({
    attorney: attorneyReducer,
    user: userReducer,
    language: languageReducer,
    service: serviceReducer,
    login: loginReducer,
    errors: errorReducer,
    results: resultReducer,
    image: imageReducer,
    post: postReducer
})