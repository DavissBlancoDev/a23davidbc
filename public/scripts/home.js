// scripts/home.js

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

  // Menú desplegable de perfil
  const profileMenu = document.querySelector(".profile-menu");
  const profileBtn = document.querySelector(".profile-btn");

  if (profileMenu && profileBtn) {
    profileBtn.addEventListener("click", () => {
      profileMenu.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!profileMenu.contains(e.target)) {
        profileMenu.classList.remove("active");
      }
    });
  }
});
