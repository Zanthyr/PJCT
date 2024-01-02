export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, msg) => {
  hideAlert();
  console.log('here', type, msg);
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

export const hideImpMenu = () => {
  const el = document.querySelector('.impMenu');
  if (el) el.parentElement.removeChild(el);
};

export const showImpMenu = (msg) => {
  hideImpMenu();
  console.log('here', msg);
  const markup = `<div class="impMenu">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
};
