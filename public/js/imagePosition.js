export const cropImage = (addArtwImg) => {
  let imageContainer = document.getElementById('imagePreview');
  let cropArea = document.getElementById('cropsCanvas');
  let imageInput = document.getElementById('photo');
  let ctx = cropArea.getContext('2d');
  let img;
  let offsetX = 0;
  let offsetY = 0;

  imageInput.addEventListener('change', handleImage);

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
    let aspectRatio = img.width / img.height;
    let targetWidth = 350;
    let targetHeight = 500; // aspectRatio;
    cropArea.width = targetWidth;
    cropArea.height = targetHeight;
    let drawX =
      (targetWidth - img.width * (img.width / (img.width + offsetX))) / 2;
    let drawY =
      (targetHeight - img.height * (img.height / (img.height + offsetY))) / 2;
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(img, drawX, drawY, img.width, img.height);
  }

  document.querySelector('.btn-move-up').addEventListener('click', (e) => {
    e.preventDefault();
    offsetY = offsetY - 10;
    drawImage();
  });

  document.querySelector('.btn-move-down').addEventListener('click', (e) => {
    e.preventDefault();
    offsetY = offsetY + 10;
    drawImage();
  });

  document.querySelector('.btn-move-left').addEventListener('click', (e) => {
    e.preventDefault();
    offsetX = offsetX - 10;
    drawImage();
  });

  document.querySelector('.btn-move-right').addEventListener('click', (e) => {
    e.preventDefault();
    offsetX = offsetX + 10;
    drawImage();
  });

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
      let x = parseInt(cropArea.style.left);
      let y = parseInt(cropArea.style.top);
      let width = cropArea.offsetWidth;
      let height = cropArea.offsetHeight;
      let croppedCanvas = document.createElement('canvas');
      let croppedCtx = croppedCanvas.getContext('2d');
      croppedCanvas.width = width;
      croppedCanvas.height = height;

      console.log(croppedCanvas.width, croppedCanvas.height);
      croppedCtx.drawImage(img, x, y, width, height, 0, 0, width, height);
      console.log(croppedCtx);

      // Append the data and  image data to FormData
      const id = addArtwImg.getAttribute('artworkID');
      const form = new FormData();
      const url = '/api/v1/artworks/addImage';
      const method = 'POST';
      form.append('artworkId', id);
      form.append('photo', document.getElementById('photo').files[0]);

      // const succes = await httpx.createRecord(form, url, method, 'add Image');

      // if (succes === 'succes') {
      //   window.location.href = '/addColors/' + id;
      // }
    });
};
