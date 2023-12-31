// Example client-side code using JavaScript
const impersonateButton = document.getElementById('impersonateButton');
const stopImpersonationButton = document.getElementById(
  'stopImpersonationButton',
);
const messageBox = document.getElementById('messageBox');

impersonateButton.addEventListener('click', async () => {
  try {
    const response = await fetch('/impersonate/:userId', { method: 'GET' });
    const data = await response.json();

    // Check if impersonation was successful
    if (data.status === 'success' && data.data.impersonationActive) {
      // Display message box with stop impersonation button
      messageBox.innerText = `You are now impersonating user: ${data.data.user.username}`;
      stopImpersonationButton.style.display = 'block';
    } else {
      // Handle other cases or errors
      console.error('Impersonation failed');
    }
  } catch (error) {
    console.error('Error during impersonation', error);
  }
});

stopImpersonationButton.addEventListener('click', async () => {
  try {
    // Make a request to stop impersonation on the server
    const response = await fetch('/stopImpersonation', { method: 'POST' });
    const data = await response.json();

    // Check if stopping impersonation was successful
    if (data.status === 'success') {
      // Hide message box and stop impersonation button
      messageBox.innerText = '';
      stopImpersonationButton.style.display = 'none';
    } else {
      // Handle other cases or errors
      console.error('Stopping impersonation failed');
    }
  } catch (error) {
    console.error('Error during stopping impersonation', error);
  }
});
