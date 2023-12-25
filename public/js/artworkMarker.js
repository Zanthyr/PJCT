import * as httpx from './httpx';

export const artworkMarker = (domElement) => {
  let markers = [];
  let dropdownCount = 0;

  document
    .getElementById('markerImage')
    .addEventListener('click', function (event) {
      const x = event.offsetX;
      const y = event.offsetY;

      // Add marker (red dot) to the clicked position
      const marker = document.createElement('div');
      marker.className = 'marker';
      marker.style.left = x + 'px';
      marker.style.top = y + 'px';
      marker.innerHTML = dropdownCount + 1;
      document.getElementById('markerImage').appendChild(marker);

      // Add dropdown list
      const colors = JSON.parse(domElement.getAttribute('colors'));
      const dropdown = document.createElement('select');
      dropdown.id = 'dropdown' + dropdownCount;
      dropdown.className = 'form__inputColor';
      dropdownCount++;
      dropdown.style.marginRight = '5px'; // Add some spacing
      colors.forEach((color) => {
        const option = document.createElement('option');
        option.value = color.id;
        option.text = color.name;
        dropdown.appendChild(option);
      });

      // Add remove button
      const removeButton = document.createElement('button');
      removeButton.className = 'btn btn--small btn--red';
      removeButton.innerHTML = '-';
      removeButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default behavior

        // Remove marker, dropdown, and the remove button
        document.getElementById('markerImage').removeChild(marker);
        document.getElementById('dropdownContainer').removeChild(dropdownDiv);

        // Filter out the removed marker from the markers array
        markers = markers.filter((m) => m.dropdown.id !== dropdown.id);
      });

      // Save marker, dropdown, and number reference
      markers.push({ x, y, dropdown: dropdown, number: dropdownCount });

      // Create a new div to group elements
      const dropdownDiv = document.createElement('div');
      dropdownDiv.className = 'dropdown-div';

      // Add number, dropdown, and remove button to the new div
      const label = document.createElement('label');
      label.innerHTML = dropdownCount;
      label.className = 'form__label';
      dropdownDiv.appendChild(label);
      dropdownDiv.appendChild(dropdown);
      dropdownDiv.appendChild(removeButton);

      // Append the new div to the dropdownContainer
      document.getElementById('dropdownContainer').appendChild(dropdownDiv);
    });

  document
    .getElementById('saveColors')
    .addEventListener('click', async function (e) {
      e.preventDefault(); // Prevent default behavior
      const selectedValues = markers.map((marker) => ({
        x: marker.x,
        y: marker.y,
        color: marker.dropdown.value,
        number: marker.number,
      }));

      // Perform further actions with selectedValues (e.g., send to server)

      const id = domElement.getAttribute('artworkID');
      const form = new FormData();
      const url = '/api/v1/artworks/addColors';
      const method = 'POST';

      // form.append('artworkId', id);
      // form.append('colors', colorArray);

      console.log(selectedValues, id);
      // const succes = await httpx.createRecord(form, url, method, 'added colors');
      // if (succes) {
      //   window.location.href = '/';
      // }
    });
};
