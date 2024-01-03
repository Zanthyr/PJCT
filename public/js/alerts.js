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
  localStorage.removeItem('impMenuShown');
  location.assign('/');
};

export const showImpMenu = (user) => {
  const markup = `<div class="impMenu">Impersonating: ${user} <button class="btn-stop-impersonate btn btn--green">Stop</button></div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
};
