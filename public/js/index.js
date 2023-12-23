/* eslint-disable */
import * as httpx from './httpx';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userInviteForm = document.querySelector('.form-user-invite');
const userPasswordForm = document.querySelector('.form-user-password');
const deleteUser = document.querySelector('.card-container');
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
if (deleteUser) {
  deleteUser.addEventListener('click', function (event) {
    const targetButton = event.target.closest('.btn__userDelete');
    if (targetButton) {
      const userID = targetButton.getAttribute('userID');
      httpx.softDelete(userID);
    }
  });
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

    httpx.createRecord(form, url, method, 'User');
  });
}

if (colorForm) {
  const brands = JSON.parse(colorForm.getAttribute('brands'));
  const noneOption = document.createElement('option');
  noneOption.value = '';
  noneOption.text = 'None';

  // Append 'none' option before populating the dropdown
  const selectBrand = document.getElementById('selectBrand');
  selectBrand.appendChild(noneOption);
  populateDropdown('selectBrand', brands);

  // handle form submission
  colorForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Create a FormData object
    const form = new FormData();
    const url = '/api/v1/colors/createMy';
    const method = 'POST';

    // Append other form fields
    form.append('colorName', document.getElementById('name').value);
    form.append('cie_l', document.getElementById('cie_l').value);
    form.append('cie_a', document.getElementById('cie_a').value);
    form.append('cie_b', document.getElementById('cie_b').value);
    form.append('deltae00', document.getElementById('deltae00').value);
    form.append('delta_c', document.getElementById('delta_c').value);
    form.append('delta_h', document.getElementById('delta_h').value);
    form.append('dens', document.getElementById('dens').value);
    form.append('halftone', document.getElementById('halftone').value);
    form.append('filter', document.getElementById('filter').value);

    // Append selected brand managers
    const selectedBrandDropdown = document.getElementById('selectBrand');
    const selectedBrandsIds = Array.from(
      selectedBrandDropdown.selectedOptions,
    ).map((option) => option.value);
    form.append('brand', selectedBrandsIds);

    httpx.createRecord(form, url, method, 'Color');
  });
}

// add brand owner company lists
if (brandDataForm) {
  const companies = JSON.parse(brandDataForm.getAttribute('companies'));
  const allCompanies = JSON.parse(brandDataForm.getAttribute('allCompanies'));
  populateDropdown('selectBrandManagers', companies);
  populateDropdown('selectSuppliers', companies);
  populateDropdown('brandOwner', allCompanies);

  // handle form submission
  brandDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Create a FormData object
    const form = new FormData();
    const url = '/api/v1/brands/createMy';
    const method = 'POST';

    // Append other form fields
    form.append('brandName', document.getElementById('name').value);
    form.append('productGroup', document.getElementById('group').value);
    form.append('photo', document.getElementById('photo').files[0]);

    // Append selected brand managers
    const selectedBrandManagerDropdown = document.getElementById(
      'selectBrandManagers',
    );
    // const selectedBrandManagerIds = Array.from(
    //   selectedBrandManagerDropdown.selectedOptions,
    // ).map((option) => option.value);
    const selectedBrandManagerIds = selectedBrandManagerDropdown
      ? Array.from(selectedBrandManagerDropdown.selectedOptions).map(
          (option) => option.value,
        )
      : [];
    form.append('brandManagers', selectedBrandManagerIds);

    // Append selected brand suppliers
    const selectedSupplierDropdown = document.getElementById('selectSuppliers');
    // const selectedSupplierIds = Array.from(
    //   selectedSupplierDropdown.selectedOptions,
    // ).map((option) => option.value);
    const selectedSupplierIds = selectedSupplierDropdown
      ? Array.from(selectedSupplierDropdown.selectedOptions).map(
          (option) => option.value,
        )
      : [];
    form.append('brandSuppliers', selectedSupplierIds);

    const selectedBrandOwnerDropdown = document.getElementById('brandOwner');
    // const selectedBrandOwnerIds = Array.from(
    //   selectedBrandOwnerDropdown.selectedOptions,
    // ).map((option) => option.value);
    // form.append('brandOwner', selectedBrandOwnerIds);
    const selectedBrandOwnerIds = selectedBrandOwnerDropdown
      ? Array.from(selectedBrandOwnerDropdown.selectedOptions).map(
          (option) => option.value,
        )
      : [];

    form.append('brandOwner', selectedBrandOwnerIds);

    // Perform your form submission logic (e.g., updateSettings)
    httpx.createRecord(form, url, method, 'Brand');
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
    //form.append('photo', document.getElementById('photo').files[0]);
    httpx.createRecord(form, url, method, 'Company');
  });

if (artworkDataForm) {
  const companies = JSON.parse(artworkDataForm.getAttribute('companies'));
  populateDropdown('company', companies);

  const brands = JSON.parse(artworkDataForm.getAttribute('brands'));
  const noneOption = document.createElement('option');
  noneOption.value = '';
  noneOption.text = 'None';

  // Append 'none' option before populating the dropdown
  const selectBrand = document.getElementById('selectBrand');
  selectBrand.appendChild(noneOption);
  populateDropdown('selectBrand', brands);

  // handle form submission
  artworkDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Create a FormData object
    const form = new FormData();
    const url = '/api/v1/artworks/createArtwork';
    const method = 'POST';

    // Append selected brand managers
    const selectedBrandDropdown = document.getElementById('selectBrand');
    const selectedBrandsIds = selectedBrandDropdown
      ? Array.from(selectedBrandDropdown.selectedOptions).map(
          (option) => option.value,
        )
      : [];

    const selectedCompanyDropdown = document.getElementById('company');
    let selectedCompanyIds;
    if (selectedCompanyDropdown !== null) {
      selectedCompanyIds = Array.from(
        selectedCompanyDropdown.selectedOptions,
      ).map((option) => option.value);
    } else {
      selectedCompanyIds = '';
    }

    form.append('artworkForBrand', selectedBrandsIds);
    form.append('company', selectedCompanyIds);
    form.append('artworkId', document.getElementById('artworkId').value);
    form.append('artworkName', document.getElementById('artworkName').value);
    form.append(
      'artworkDescription',
      document.getElementById('artworkDescription').value,
    );

    const id = await httpx.createArtwork(form, url, method, 'Arwork');
    if (id) {
      window.location.href = '/addImage/' + id;
    }
  });
}

if (addArtwImg) {
  addArtwImg.addEventListener('change', function () {
    displayImage();
  });

  function displayImage() {
    let input = document.getElementById('photo');
    let preview = document.getElementById('imagePreview');

    while (preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }

    let file = input.files[0];

    if (file) {
      let reader = new FileReader();

      reader.onload = function (e) {
        let img = document.createElement('img');
        img.src = e.target.result;
        preview.appendChild(img);
      };

      reader.readAsDataURL(file);
    }
  }

  addArtwImg.addEventListener('submit', async (e) => {
    const id = addArtwImg.getAttribute('artworkID');
    e.preventDefault();
    // Create a FormData object
    const form = new FormData();
    const url = '/api/v1/artworks/addImage';
    const method = 'POST';
    form.append('artworkId', id);
    form.append('photo', document.getElementById('photo').files[0]);
    const succes = await httpx.createRecord(form, url, method, 'add Image');
    if (succes) {
      window.location.href = '/addColors/' + id;
    }
  });
}

if (addArtwColor) {
  let dropdownCounter = 0;
  let colorArray = [];

  document.getElementById('addDropdown').onclick = addDropdown;
  document.getElementById('removeDropdown').onclick = removeDropdown;
  document.getElementById('saveColors').onclick = saveColors;

  function addDropdown(event) {
    event.preventDefault();
    const colors = JSON.parse(addArtwColor.getAttribute('colors'));
    let dropdownContainer = document.getElementById('dropdownContainer');
    let newDropdown = document.createElement('div');
    newDropdown.className = 'dropdown';
    newDropdown.id = 'dropdown' + dropdownCounter;

    let colorSelect = document.createElement('select');
    colorSelect.name = colors.name;
    colorSelect.dataset.id = dropdownCounter;

    // Populate options with color names
    for (let i = 0; i < colors.length; i++) {
      let option = document.createElement('option');
      option.value = colors[i].id;
      option.text = colors[i].name;
      colorSelect.appendChild(option);
    }
    // Add event listener to capture dropdown changes
    colorSelect.addEventListener('change', function () {
      updateColorArray(this);
    });

    // Initialize colorArray with the default selected value
    colorArray.push(colorSelect.value);

    newDropdown.appendChild(colorSelect);
    dropdownContainer.appendChild(newDropdown);
    dropdownCounter++;
  }

  function updateColorArray(selectElement) {
    let index = parseInt(selectElement.dataset.id);
    colorArray[index] = selectElement.value;
  }

  function removeDropdown(event) {
    event.preventDefault();
    if (dropdownCounter > 0) {
      let dropdownContainer = document.getElementById('dropdownContainer');
      let lastDropdown = document.getElementById(
        'dropdown' + (dropdownCounter - 1),
      );

      let lastDropdownSelect = lastDropdown.querySelector('select');
      let lastDropdownIndex = parseInt(lastDropdownSelect.dataset.id);
      colorArray.splice(lastDropdownIndex, 1);

      dropdownContainer.removeChild(lastDropdown);
      dropdownCounter--;
    }
  }

  async function saveColors(event) {
    event.preventDefault();

    const id = addArtwColor.getAttribute('artworkID');
    const form = new FormData();
    const url = '/api/v1/artworks/addColors';
    const method = 'POST';

    form.append('artworkId', id);
    form.append('colors', colorArray);

    const succes = await httpx.createRecord(form, url, method, 'added colors');

    if (succes) {
      window.location.href = '/';
    }
  }
}
