// profile.js
document.addEventListener('DOMContentLoaded', () => {
  
  // === Obtener ID del usuario desde localStorage ===
  const userId = localStorage.getItem('userId');

  // === Rellenar formulario con datos del usuario ===
  if (userId) {
    fetch(`/usuarios/${userId}`)
      .then(res => res.json())
      .then(user => {
        if (user) {
          document.getElementById('nombre').value = user.nombre || "";
          document.getElementById('email').value = user.email || "";
          document.getElementById('sexo').value = user.sexo || "otro";

          const userNameSpan = document.getElementById('userName');
          if (userNameSpan) userNameSpan.textContent = user.nombre;
        }
      })
      .catch(err => console.error('Error al obtener usuario:', err));
  }

  // === Editar perfil ===
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', async e => {
      e.preventDefault();

      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const sexo = document.getElementById('sexo').value;

      try {
        const res = await fetch('/usuarios/editar', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, nombre, email, sexo })
        });

        const data = await res.json();
        if (res.ok) {
          alert(data.message);
          localStorage.setItem('userName', nombre); // actualizar header
          const userNameSpan = document.getElementById('userName');
          if (userNameSpan) userNameSpan.textContent = nombre;
        } else {
          alert(data.error);
        }
      } catch (err) {
        console.error('Error al editar perfil:', err);
        alert('No se pudo actualizar el perfil');
      }
    });
  }

  // === Cambiar contraseña ===
  const passwordForm = document.getElementById('passwordForm');
  if (passwordForm) {
    passwordForm.addEventListener('submit', async e => {
      e.preventDefault();

      const currentPassword = document.getElementById('currentPassword').value.trim();
      const newPassword = document.getElementById('newPassword').value.trim();
      const confirmPassword = document.getElementById('confirmPassword').value.trim();

      if (!currentPassword || !newPassword || !confirmPassword) {
        return alert('Todos los campos son obligatorios.');
      }

      if (newPassword !== confirmPassword) {
        return alert('La nueva contraseña no coincide.');
      }

      try {
        const res = await fetch('/usuarios/contrasena', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, currentPassword, newPassword })
        });

        const data = await res.json();
        if (res.ok) {
          alert(data.message);
          passwordForm.reset();
        } else {
          alert(data.error);
        }
      } catch (err) {
        console.error('Error al cambiar contraseña:', err);
        alert('No se pudo cambiar la contraseña');
      }
    });
  }

  // === Cerrar sesión ===
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
