import * as types from './types';
import axios from 'axios';
import { serviceURLs } from './URLs';

export const uploadImage = (imageFile) => dispatch => {
    console.log('Upload image action...');
    const url = serviceURLs.UPLOAD_IMAGE;
    if (!url) {
        return;
    }

    const formData = new FormData(); 
    formData.append('file', imageFile); 
    formData.append('filename', imageFile.name); 
    formData.append('filetype', imageFile.type);
    axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(result => {
                    dispatch({
                        type: types.SAVE_IMAGE,
                        payload: result.data
                    })
                })
                .catch(error => {
                    dispatch({
                        type: types.SAVE_IMAGE,
                        payload: {
                                success: false,
                                errMessage: 'Error, while saving image: ' + (error.message || error.response.statusText),
                                logged: false
                        }
                    })
                });

};

