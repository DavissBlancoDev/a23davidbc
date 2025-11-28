// scripts/autoCheckUser.js
document.addEventListener('DOMContentLoaded', () => {
  // Comprobar si hay usuario logeado
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  if (!userId || !userName) {
    // Redirigir al index si no hay usuario logeado
    window.location.href = 'index.html';
    return;
  }

  // Mostrar nombre de usuario
  const userNameSpan = document.getElementById('userName');
  if (userNameSpan) {
    userNameSpan.textContent = userName;
  }

  // Logout
  const logoutBtn = document.querySelector('.logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      window.location.href = 'index.html';
    });
  }

});
