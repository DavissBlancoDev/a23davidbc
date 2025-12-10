document.addEventListener('DOMContentLoaded', () => {

  // =========================
  // Añadir ingredientes dinámicos
  // =========================
  document.querySelectorAll('.add-ingredient').forEach(btn => {
    btn.addEventListener('click', () => {
      const containerId = btn.dataset.target;
      const list = document.getElementById(containerId);

      const ingredientDiv = document.createElement('div');
      ingredientDiv.className = 'input-group mb-2';
      ingredientDiv.innerHTML = `
        <input type="text" class="form-control ingredient-name ingredient-input" placeholder="Ingrediente" required>
        <input type="text" class="form-control ingredient-qty ingredient-input" placeholder="Cantidad (opcional)">
        <button type="button" class="btn btn-outline-danger remove-ingredient">✖</button>
      `;

      list.appendChild(ingredientDiv);

      // Botón para eliminar ingrediente
      ingredientDiv.querySelector('.remove-ingredient').addEventListener('click', () => {
        ingredientDiv.remove();
      });
    });
  });

  // =========================
  // Submit del formulario
  // =========================
  const menuForm = document.getElementById('menuForm');
  const usuarioId = localStorage.getItem('userId'); // <-- obtenemos el usuario logueado

  if (menuForm) {
    menuForm.addEventListener('submit', async e => {
      e.preventDefault();

      const nombre = document.getElementById('menuName').value.trim();
      if (!nombre) return alert('El nombre del menú es obligatorio.');
      if (!usuarioId) return alert('No se ha encontrado el usuario. Por favor, inicia sesión de nuevo.');

      // Función para recoger plato + ingredientes
      // Función para recoger plato + ingredientes
      const getPlato = (nameId, ingId) => {
        const nombrePlato = document.getElementById(nameId)?.value.trim();
        if (!nombrePlato) return null;

        const ingredientes = {};
        // Recorremos cada "div.input-group" que contiene los inputs
        document.querySelectorAll(`#${ingId} .input-group`).forEach(div => {
          const nombre = div.querySelector('.ingredient-name')?.value.trim();
          const cantidad = div.querySelector('.ingredient-qty')?.value.trim() || '';
          if (nombre) {
            ingredientes[nombre] = cantidad; // <-- clave = ingrediente, valor = cantidad
          }
        });

        return { id: Date.now() + Math.random(), nombre: nombrePlato, ingredientes };
      };


      const platos = [];
      const entrante = getPlato('entranteName', 'entranteIngredients');
      const principal = getPlato('principalName', 'principalIngredients');
      const postre = getPlato('postreName', 'postreIngredients');

      if (entrante) platos.push(entrante);
      if (principal) platos.push(principal);
      if (postre) platos.push(postre);

      if (platos.length === 0) return alert('Debes añadir al menos un plato.');

      try {
        const res = await fetch('/api/menus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, platos, usuarioId })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || 'Error al guardar el menú.');
          return;
        }

        alert('✅ Menú guardado correctamente');
        menuForm.reset();
        document.querySelectorAll('.ingredient-list').forEach(c => c.innerHTML = '');
      } catch (err) {
        console.error(err);
        alert('Error al conectar con el servidor.');
      }
    });
  }
});
