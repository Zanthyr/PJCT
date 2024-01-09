import * as httpx from './httpx';

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

export const addColor = (domElement) => {
  const brands = JSON.parse(domElement.getAttribute('brands'));
  const noneOption = document.createElement('option');
  noneOption.value = '';
  noneOption.text = 'None';

  const selectBrand = document.getElementById('selectBrand');
  selectBrand.appendChild(noneOption);
  populateDropdown('selectBrand', brands);

  domElement.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();
    const url = '/api/v1/colors/createMy';
    const method = 'POST';

    form.append('colorName', document.getElementById('name').value);
    form.append('cie_l', document.getElementById('cie_l').value);
    form.append('cie_a', document.getElementById('cie_a').value);
    form.append('cie_b', document.getElementById('cie_b').value);
    form.append('deltae00', document.getElementById('deltae00').value);
    form.append('delta_c', document.getElementById('delta_c').value);
    form.append('delta_h', document.getElementById('delta_h').value);

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
};

export const editColor = (domElement) => {
  const brands = JSON.parse(domElement.getAttribute('brands'));
  const selected = domElement.getAttribute('selectedBrand');
  const noneOption = document.createElement('option');
  noneOption.value = '';
  noneOption.text = 'None';
  const selectBrand = document.getElementById('selectBrand');
  selectBrand.appendChild(noneOption);
  populateDropdown('selectBrand', brands);

  if (selected) {
    for (let i = 0; i < selectBrand.options.length; i++) {
      if (selectBrand.options[i].text === selected) {
        selectBrand.selectedIndex = i;
        break;
      }
    }
  }

  domElement.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = domElement.getAttribute('id');
    const form = new FormData();
    const url = `/api/v1/colors/${id}`;
    const method = 'PATCH';

    form.append('colorName', document.getElementById('name').value);
    form.append('cie_l', document.getElementById('cie_l').value);
    form.append('cie_a', document.getElementById('cie_a').value);
    form.append('cie_b', document.getElementById('cie_b').value);
    form.append('deltae00', document.getElementById('deltae00').value);
    form.append('delta_c', document.getElementById('delta_c').value);
    form.append('delta_h', document.getElementById('delta_h').value);

    const selectedBrandDropdown = document.getElementById('selectBrand');
    const selectedBrandsIds = Array.from(
      selectedBrandDropdown.selectedOptions,
    ).map((option) => option.value);
    form.append('brand', selectedBrandsIds);
    const succes = httpx.createRecord(form, url, method, 'Color');
    if (succes) {
      setTimeout(function () {
        window.location.href = '/colors';
      }, 1000);
    }
  });
};
