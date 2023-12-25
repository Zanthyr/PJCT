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

export const artworkData = (domElement) => {
  const companies = JSON.parse(domElement.getAttribute('companies'));
  populateDropdown('company', companies);

  const brands = JSON.parse(domElement.getAttribute('brands'));
  const noneOption = document.createElement('option');
  noneOption.value = '';
  noneOption.text = 'None';

  // Append 'none' option before populating the dropdown
  const selectBrand = document.getElementById('selectBrand');
  selectBrand.appendChild(noneOption);
  populateDropdown('selectBrand', brands);

  // handle form submission
  domElement.addEventListener('submit', async (e) => {
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
};
