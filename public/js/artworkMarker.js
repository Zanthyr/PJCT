import * as httpx from './httpx';

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
      const succes = await httpx.createRecord(
        form,
        url,
        method,
        'added colors',
      );
      if (succes) {
        window.location.href = '/';
      }
    });
};
