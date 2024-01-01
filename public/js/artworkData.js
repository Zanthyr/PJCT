import * as httpx from './httpx';

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
  const brands = JSON.parse(domElement.getAttribute('brands'));
  const noneOption = document.createElement('option');
  noneOption.value = '';
  noneOption.text = 'None';

  // Append 'none'
  const selectBrand = document.getElementById('selectBrand');
  selectBrand.appendChild(noneOption);
  populateDropdown('selectBrand', brands);

  // handle form submission
  domElement.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData();
    const url = '/api/v1/artworks/createArtwork';
    const method = 'POST';

    const selectedBrandDropdown = document.getElementById('selectBrand');
    const selectedBrandsIds = selectedBrandDropdown
      ? Array.from(selectedBrandDropdown.selectedOptions).map(
          (option) => option.value,
        )
      : [];

    form.append('artworkForBrand', selectedBrandsIds);
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
