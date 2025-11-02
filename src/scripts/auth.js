// auth.js
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Login enviado para: ' + document.getElementById('loginEmail').value);
      const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
      loginModal.hide();
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Registro enviado para: ' + document.getElementById('signupEmail').value);
      const signupModal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
      signupModal.hide();
    });
  }
});
