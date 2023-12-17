/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const softDelete = async (id) => {
  try {
    // console.log('test', id);
    showAlert(
      'success',
      `User Deleted!, but not realy, this is a demo :p`,
      //`${type.toUpperCase()} User Deleted!, but not realy, this is a demo :p`,
    );
  } catch (err) {
    showAlert('error', 'error'); //err.response.data.message);
  }
};
