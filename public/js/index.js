/* eslint-disable */
import { login, logout } from './login';
import { softDelete } from './delete';
import { updateSettings } from './updateSettings';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const userSoftDelete = document.querySelectorAll('.btn__userDelete');
const showAddUserFormBtn = document.querySelector('.btn__showAddForm');
const addContentForm = document.querySelector('.add__content');
const companyDataForm = document.querySelector('.form-company-data');
const brandDataForm = document.querySelector('.form-brand-data');

if (showAddUserFormBtn)
  showAddUserFormBtn.addEventListener('click', () => {
    addContentForm.classList.toggle('hidden');
  });

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userSoftDelete) {
  userSoftDelete.forEach(function (button) {
    button.addEventListener('click', function () {
      softDelete(button.getAttribute('userID'));
    });
  });
}

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('userName', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('userPhoto', document.getElementById('photo').files[0]);
    updateSettings(form, 'userData');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (companyDataForm)
  companyDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('companyName', document.getElementById('name').value);
    form.append('companyPhoto', document.getElementById('photo').files[0]);
    updateSettings(form, 'companyData');
  });

if (brandDataForm) {
  const companies = JSON.parse(brandDataForm.getAttribute('companies'));
  function populateDropdown() {
    const selectElement = document.getElementById('selectBrandManagers');
    companies.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.id;
      option.text = item.name;
      selectElement.appendChild(option);
    });
  }
  populateDropdown();

  // Function to handle the form submission
  function submitSelection() {
    const selectedIds = Array.from(
      document.getElementById('selectBrandManagers').selectedOptions,
    ).map((option) => option.value);
    alert('Selected IDs: ' + selectedIds.join(', '));
    // You can perform further actions with the selected IDs here, such as sending them to a server.
  }
}
