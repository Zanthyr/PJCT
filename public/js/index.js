/* eslint-disable */
import * as httpx from './httpx';
import { artworkMarker } from './artworkMarker';
import { artworkPosition } from './artworkPosition';
import { artworkData } from './artworkData';
import { showImpMenu, hideImpMenu } from './alerts';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userInviteForm = document.querySelector('.form-user-invite');
const userPasswordForm = document.querySelector('.form-user-password');
const userCardContainer = document.querySelector('.card-container');
const showAddFormBtn = document.querySelector('.btn__showAddForm');
const addContentForm = document.querySelector('.add__content');
const companyDataForm = document.querySelector('.form-company-data');
const brandDataForm = document.querySelector('.form-brand-data');
const colorForm = document.querySelector('.form-color-data');
const requestReset = document.querySelector('.form--requestReset');
const resetPassword = document.querySelector('.form--resetPassword');
const addCompany = document.querySelector('.form-add-company');
const artworkDataForm = document.querySelector('.form-artwork-data');
const addArtwImg = document.querySelector('.form-artImg-data');
const addArtwColor = document.querySelector('.form-artColor-data');
const addJobDataForm = document.querySelector('.form-addJob-data');

// load companies for adding brand owner
function populateDropdown(elementId, list) {
  const element = document.getElementById(elementId);
  list.forEach((item) => {
    const option = document.createElement('option');
    option.value = item.id;
    option.text = item.name;
    element.appendChild(option);
  });
}

if (resetPassword)
  resetPassword.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const resetPasswordIndex = urlParts.indexOf('resetPassword');
    const token = urlParts[resetPasswordIndex + 1];
    httpx.resetPassword(password, passwordConfirm, token);
  });

if (requestReset)
  requestReset.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    httpx.requestReset(email);
  });

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    httpx.login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', httpx.logout);

// remove or show add user/brand/color menu
if (showAddFormBtn)
  showAddFormBtn.addEventListener('click', () => {
    addContentForm.classList.toggle('hidden');
  });

// User managmet delete user button
if (userCardContainer) {
  userCardContainer.addEventListener('click', async function (event) {
    const targetButton = event.target.closest('.btn__userEdit');
    if (targetButton) {
      const userID = targetButton.getAttribute('userID');

      //httpx.softDelete(userID);
    }

    const ImpersonateButton = event.target.closest('.btn__userImp');
    if (ImpersonateButton) {
      const userID = ImpersonateButton.getAttribute('userID');
      const currentUser = ImpersonateButton.getAttribute('currentUser');
      try {
        const response = await fetch(`/api/v1/users/impersonate/${userID}`, {
          method: 'GET',
        });
        const data = await response.json();
        if (data.status === 'success') {
          localStorage.setItem(
            'impMenuShown',
            JSON.stringify([data.data.user.userName, currentUser]),
          );
          location.reload();
        } else {
          console.error('Impersonation failed');
        }
      } catch (error) {
        console.error('Error during impersonation', error);
      }
    }
  });
}

// hideImpMenu

document.addEventListener('DOMContentLoaded', function () {
  const stopImpersonateBtn = document.querySelector('.btn-stop-impersonate');
  if (stopImpersonateBtn)
    stopImpersonateBtn.addEventListener('click', async () => {
      const oriUser = JSON.parse(localStorage.getItem('impMenuShown'))[1];
      try {
        const response = await fetch(
          `/api/v1/users/stopImpersonation/${oriUser}`,
          {
            method: 'GET',
          },
        );
        const data = await response.json();
        if (data.status === 'success') {
          hideImpMenu();
        } else {
          console.error('Stopping impersonation failed');
        }
      } catch (error) {
        console.error('Error during stopping impersonation', error);
      }
    });
});

if (localStorage.getItem('impMenuShown')) {
  const name = JSON.parse(localStorage.getItem('impMenuShown'))[0];
  showImpMenu(name);
}

// submit user data
if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = '/api/v1/users/updateMe';
    const method = 'PATCH';
    const form = new FormData();
    form.append('userName', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    httpx.updateSettings(form, url, method, 'User');
  });

// submit pwd change
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = '/api/v1/users/updateMyPassword';
    const method = 'PATCH';
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await httpx.updateSettings(
      { passwordCurrent, password, passwordConfirm },
      url,
      method,
      'Password',
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

// submit comapnay data
if (companyDataForm)
  companyDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = '/api/v1/companies/updateMy';
    const method = 'PATCH';
    const form = new FormData();
    form.append('companyName', document.getElementById('name').value);
    form.append('adress', document.getElementById('adress').value);
    form.append('photo', document.getElementById('photo').files[0]);
    httpx.updateSettings(form, url, method, 'Company');
  });

// submit user data
if (userInviteForm) {
  const companies = JSON.parse(userInviteForm.getAttribute('companies'));
  populateDropdown('company', companies);

  userInviteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = '/api/v1/users/invite';
    const method = 'POST';
    const form = new FormData();

    form.append('userName', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('role', document.getElementById('role').value);
    form.append(
      'artworkCreator',
      document.getElementById('artworkCreator').checked,
    );
    form.append('jobCreator', document.getElementById('jobCreator').checked);

    const selectedCompanyDropdown = document.getElementById('company');
    let selectedCompanyIds;
    if (selectedCompanyDropdown !== null) {
      selectedCompanyIds = Array.from(
        selectedCompanyDropdown.selectedOptions,
      ).map((option) => option.value);
    } else {
      selectedCompanyIds = '';
    }

    form.append('company', selectedCompanyIds);

    const succes = httpx.createRecord(form, url, method, 'User');
    if (succes) {
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    }
  });
}

if (colorForm) {
  const brands = JSON.parse(colorForm.getAttribute('brands'));
  const noneOption = document.createElement('option');
  noneOption.value = '';
  noneOption.text = 'None';

  const selectBrand = document.getElementById('selectBrand');
  selectBrand.appendChild(noneOption);
  populateDropdown('selectBrand', brands);

  colorForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();
    const url = '/api/v1/colors/createMy';
    const method = 'POST';

    form.append('colorName', document.getElementById('name').value);
    form.append('hex', document.getElementById('hexCode').value);
    form.append('cie_l', document.getElementById('cie_l').value);
    form.append('cie_a', document.getElementById('cie_a').value);
    form.append('cie_b', document.getElementById('cie_b').value);
    form.append('deltae00', document.getElementById('deltae00').value);
    form.append('delta_c', document.getElementById('delta_c').value);
    form.append('delta_h', document.getElementById('delta_h').value);
    form.append('dens', document.getElementById('dens').value);
    form.append('halftone', document.getElementById('halftone').value);
    form.append('filter', document.getElementById('filter').value);

    const selectedBrandDropdown = document.getElementById('selectBrand');
    const selectedBrandsIds = Array.from(
      selectedBrandDropdown.selectedOptions,
    ).map((option) => option.value);
    form.append('brand', selectedBrandsIds);

    const succes = httpx.createRecord(form, url, method, 'Color');
    if (succes) {
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    }
  });
}

if (brandDataForm) {
  const companies = JSON.parse(brandDataForm.getAttribute('companies'));
  populateDropdown('selectBrandManagers', companies);
  populateDropdown('selectSuppliers', companies);

  brandDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();
    const url = '/api/v1/brands/createMy';
    const method = 'POST';

    form.append('brandName', document.getElementById('name').value);
    form.append('productGroup', document.getElementById('group').value);
    form.append('photo', document.getElementById('photo').files[0]);

    const selectedBrandManagerDropdown = document.getElementById(
      'selectBrandManagers',
    );
    const selectedBrandManagerIds = selectedBrandManagerDropdown
      ? Array.from(selectedBrandManagerDropdown.selectedOptions).map(
          (option) => option.value,
        )
      : [];
    form.append('brandManagers', selectedBrandManagerIds);

    const selectedSupplierDropdown = document.getElementById('selectSuppliers');
    const selectedSupplierIds = selectedSupplierDropdown
      ? Array.from(selectedSupplierDropdown.selectedOptions).map(
          (option) => option.value,
        )
      : [];
    form.append('brandSuppliers', selectedSupplierIds);

    const succes = httpx.createRecord(form, url, method, 'Brand');
    if (succes) {
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    }
  });
}

if (addCompany)
  addCompany.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = '/api/v1/companies/';
    const method = 'POST';
    const form = new FormData();
    form.append('companyName', document.getElementById('name').value);
    form.append('adress', document.getElementById('adress').value);
    form.append('companyType', document.getElementById('companyType').value);
    const succes = httpx.createRecord(form, url, method, 'Company');
    if (succes) {
      window.location.reload();
    }
  });

if (artworkDataForm) {
  artworkData(artworkDataForm);
}

if (addArtwImg) {
  artworkPosition(addArtwImg);
}

if (addArtwColor) {
  artworkMarker(addArtwColor);
}

if (addJobDataForm)
  addJobDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const artworkId = addJobDataForm.getAttribute('artowrkId');
    const url = '/api/v1/jobs/addJob/';
    const method = 'POST';
    const form = new FormData();
    form.append('artworkId', artworkId);
    form.append('jobId', document.getElementById('jobId').value);
    form.append('printerName', document.getElementById('printerName').value);
    form.append('printerEmail', document.getElementById('printerEmail').value);
    const succes = httpx.createRecord(form, url, method, 'Job');
    if (succes) {
      setTimeout(function () {
        window.location.href = '/';
      }, 1000);
    }
  });
