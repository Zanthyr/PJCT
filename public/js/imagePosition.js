import * as httpx from './httpx';
export const cropImage = (addArtwImg) => {
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

    // Calculate drawX and drawY based on offsets
    let drawX = (targetWidth - img.width) / 2 + offsetX;
    let drawY = (targetHeight - img.height) / 2 + offsetY;

    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.fillStyle = 'white'; // Set the fill color to white
    ctx.fillRect(0, 0, targetWidth, targetHeight); // Fill the entire canvas with white

    ctx.drawImage(img, drawX, drawY, img.width, img.height);

    // Get the image data
    let imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    let data = imageData.data;

    // Loop through each pixel and replace black with white
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

    // Put the modified image data back onto the canvas
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
      const id = addArtwImg.getAttribute('artworkID');
      const form = new FormData();
      const url = '/api/v1/artworks/addImage';
      const method = 'POST';
      form.append('artworkId', id);
      form.append('photo', croppedDataURL);

      const succes = await httpx.createRecord(form, url, method, 'add Image');

      if (succes === 'succes') {
        window.location.href = '/addColors/' + id;
      }
    });
};
