export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

export const hideImpMenu = () => {
  localStorage.removeItem('impMenuShown');
  location.assign('/');
};

export const showImpMenu = (user) => {
  const markup = `<div class="impMenu"><span>Impersonating: ${user}</span><button class="btn-stop-impersonate btn btn--blue">Stop</button></div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
};
