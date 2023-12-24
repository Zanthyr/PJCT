export const addMarkers = (addArtwColor) => {
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
      const colors = JSON.parse(addArtwColor.getAttribute('colors'));
      const dropdown = document.createElement('select');
      dropdown.id = 'dropdown' + dropdownCount;
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
      removeButton.innerHTML = 'Remove';
      removeButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default behavior

        // Remove marker, dropdown, and the remove button
        document.getElementById('markerImage').removeChild(marker);
        document.getElementById('dropdownContainer').removeChild(numberSpan);
        document.getElementById('dropdownContainer').removeChild(dropdown);
        document.getElementById('dropdownContainer').removeChild(removeButton);

        // Filter out the removed marker from the markers array
        markers = markers.filter((m) => m.dropdown.id !== dropdown.id);
      });

      // Save marker, dropdown, and number reference
      markers.push({ x, y, dropdown: dropdown, number: dropdownCount });

      // Add number, dropdown, and remove button to the container
      const numberSpan = document.createElement('span');
      numberSpan.innerHTML = dropdownCount;
      document.getElementById('dropdownContainer').appendChild(numberSpan);
      document.getElementById('dropdownContainer').appendChild(dropdown);
      document.getElementById('dropdownContainer').appendChild(removeButton);
      document
        .getElementById('dropdownContainer')
        .appendChild(document.createElement('br')); // Add line break
    });

  document
    .getElementById('saveColors')
    .addEventListener('click', async function () {
      event.preventDefault(); // Prevent default behavior
      const selectedValues = markers.map((marker) => ({
        x: marker.x,
        y: marker.y,
        color: marker.dropdown.value,
        number: marker.number,
      }));

      // Perform further actions with selectedValues (e.g., send to server)

      const id = addArtwColor.getAttribute('artworkID');
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
