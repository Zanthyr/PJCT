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

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/logout',
    });
    if ((res.data.status = 'success')) location.assign('/');
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};

export const requestReset = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'reset link is send!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const resetPassword = async (password, passwordConfirm, token) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'reset Complete!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// type is either 'password' or 'data'
export const updateSettings = async (data, url, method, type) => {
  try {
    const res = await axios({
      method,
      url,
      data,
    });
    console.log(res.data);
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// type is either 'password' or 'data'
export const createRecord = async (data, url, method, type) => {
  try {
    const res = await axios({
      method,
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} record created!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
