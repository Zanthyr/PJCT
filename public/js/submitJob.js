import * as httpx from './httpx';

export const submitJob = (domElement) => {
  const colors = JSON.parse(domElement.getAttribute('colors'));
  // const id = domElement.getAttribute('artworkID');

  colors.forEach((color, index) => {
    const [x, y] = color.coords;
    const marker = document.createElement('div');
    marker.classList.add('marker');
    marker.textContent = index + 1;
    marker.style.position = 'absolute';
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
    document.getElementById('markerImage').appendChild(marker);
  });
};
