document.addEventListener('DOMContentLoaded', () => {

  // ====================
  // LOGIN
  // ====================
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      if (!email || !password) {
        alert('Todos los campos son obligatorios.');
        return;
      }

      try {
        const res = await fetch('/usuarios/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || 'Error en el login.');
          return;
        }

        // Guardar datos en localStorage
        localStorage.setItem('userId', data.usuarioId);
        localStorage.setItem('userName', data.nombre);

        // Cerrar modal
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();

        // Redirigir a home
        window.location.href = 'home.html';

      } catch (err) {
        console.error('Error al hacer login:', err);
        alert('Error en la conexión con el servidor.');
      }
    });
  }

  // ====================
  // REGISTRO
  // ====================
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async e => {
      e.preventDefault();

      const nombre = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value.trim();

      if (!nombre || !email || !password) {
        alert('Todos los campos son obligatorios.');
        return;
      }

      try {
        const res = await fetch('/usuarios/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || 'Error en el registro.');
          return;
        }

        // Guardar datos en localStorage
        localStorage.setItem('userId', data.usuarioId);
        localStorage.setItem('userName', nombre);

        // Cerrar modal
        const signupModal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
        signupModal.hide();

        // Redirigir a home
        window.location.href = 'home.html';

      } catch (err) {
        console.error('Error al registrar usuario:', err);
        alert('Error en la conexión con el servidor.');
      }
    });
  }

});
