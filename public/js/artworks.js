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
      setTimeout(function () {
        window.location.href = '/addArtworkImage/' + id;
      }, 1000);
    }
  });
};

export const artworkMarker = (domElement) => {
  let markers = [];
  let dropdownCount = 0;

  document
    .getElementById('markerImage')
    .addEventListener('click', function (event) {
      const x = event.offsetX;
      const y = event.offsetY;

      // Add marker
      const marker = document.createElement('div');
      marker.className = 'marker';
      marker.style.left = x + 'px';
      marker.style.top = y + 'px';
      marker.innerHTML = dropdownCount + 1;
      document.getElementById('markerImage').appendChild(marker);

      // Add list to dropdown
      const colors = JSON.parse(domElement.getAttribute('colors'));
      const dropdown = document.createElement('select');
      dropdown.id = 'dropdown' + dropdownCount;
      dropdown.className = 'form__inputColor';
      dropdownCount++;
      dropdown.style.marginRight = '5px';
      colors.forEach((color) => {
        const option = document.createElement('option');
        option.value = color.id;
        option.text = color.name;
        dropdown.appendChild(option);
      });

      // remove button
      const removeButton = document.createElement('button');
      removeButton.className = 'btn btn--small btn--red';
      removeButton.innerHTML = '-';
      removeButton.addEventListener('click', function (event) {
        event.preventDefault();

        document.getElementById('markerImage').removeChild(marker);
        document.getElementById('dropdownContainer').removeChild(dropdownDiv);
        markers = markers.filter((m) => m.dropdown.id !== dropdown.id);
      });

      // Save
      markers.push({ x, y, dropdown: dropdown, number: dropdownCount });

      // group elements
      const dropdownDiv = document.createElement('div');
      dropdownDiv.className = 'dropdown-div';

      // Add elements
      const label = document.createElement('label');
      label.innerHTML = dropdownCount;
      label.className = 'form__label';
      dropdownDiv.appendChild(label);
      dropdownDiv.appendChild(dropdown);
      dropdownDiv.appendChild(removeButton);

      document.getElementById('dropdownContainer').appendChild(dropdownDiv);
    });

  document
    .getElementById('saveColors')
    .addEventListener('click', async function (e) {
      e.preventDefault();
      const selectedValues = markers.map((marker) => ({
        coords: [marker.x, marker.y],
        color: marker.dropdown.value,
        //number: marker.number,
      }));

      const id = domElement.getAttribute('artworkID');
      const form = new FormData();
      const url = '/api/v1/artworks/addColors';
      const method = 'POST';

      form.append('artworkId', id);
      form.append('colors', JSON.stringify(selectedValues));

      console.log(selectedValues, id);
      const success = await httpx.createRecord(
        form,
        url,
        method,
        'added colors',
      );
      if (success) {
        setTimeout(function () {
          window.location.href = '/';
        }, 1000);
      }
    });
};

export const artworkPosition = (domElement) => {
  let cropArea = document.getElementById('cropsCanvas');
  let imageInput = document.getElementById('photo');
  let ctx = cropArea.getContext('2d');
  let img;
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;
  let startX, startY;

  imageInput.addEventListener('change', handleImage);
  cropArea.addEventListener('mousedown', startDragging);
  document.addEventListener('mousemove', dragImage);
  document.addEventListener('mouseup', stopDragging);

  function handleImage(e) {
    let reader = new FileReader();
    reader.onload = function (event) {
      img = new Image();
      img.onload = function () {
        drawImage();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  function drawImage() {
    let targetWidth = 350;
    let targetHeight = 500;
    cropArea.width = targetWidth;
    cropArea.height = targetHeight;

    // Calculate x and Y
    let drawX = (targetWidth - img.width) / 2 + offsetX;
    let drawY = (targetHeight - img.height) / 2 + offsetY;

    ctx.clearRect(0, 0, targetWidth, targetHeight);
    // Fill the entire canvas with white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    ctx.drawImage(img, drawX, drawY, img.width, img.height);

    // Get the image data
    let imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    let data = imageData.data;

    // replace black pixel with white pixel
    for (let i = 0; i < data.length; i += 4) {
      if (
        data[i] === 0 &&
        data[i + 1] === 0 &&
        data[i + 2] === 0 &&
        data[i + 3] === 0
      ) {
        data[i] = 255; // Red
        data[i + 1] = 255; // Green
        data[i + 2] = 255; // Blue
        data[i + 3] = 255; // Alpha
      }
    }

    // Put modified image onto the canvas
    ctx.putImageData(imageData, 0, 0);
  }

  function startDragging(e) {
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
  }

  function dragImage(e) {
    if (!isDragging) return;
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    drawImage();
  }

  function stopDragging() {
    isDragging = false;
  }

  document.querySelector('.btn-enlarge').addEventListener('click', (e) => {
    e.preventDefault();
    img.width *= 1.2;
    img.height *= 1.2;
    drawImage();
  });

  document.querySelector('.btn-shrink').addEventListener('click', (e) => {
    e.preventDefault();
    img.width *= 0.8;
    img.height *= 0.8;
    drawImage();
  });

  document
    .querySelector('.btn-save-artwork')
    .addEventListener('click', async (e) => {
      e.preventDefault();

      const croppedDataURL = cropArea.toDataURL('image/jpeg', 0.9);
      const id = domElement.getAttribute('artworkID');
      const form = new FormData();
      const url = '/api/v1/artworks/addImage';
      const method = 'POST';
      form.append('artworkId', id);
      form.append('photo', croppedDataURL);

      const success = await httpx.createRecord(form, url, method, 'add Image');

      if (success === 'succes') {
        setTimeout(function () {
          window.location.href = '/addArtworkColors/' + id;
        }, 1000);
      }
    });
};
