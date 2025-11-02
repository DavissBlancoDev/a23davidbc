// menu.js
document.addEventListener('DOMContentLoaded', () => {
  // Añadir ingredientes
  document.querySelectorAll('.add-ingredient').forEach(btn => {
    btn.addEventListener('click', () => {
      const containerId = btn.dataset.target;
      const list = document.getElementById(containerId);

      const ingredientDiv = document.createElement('div');
      ingredientDiv.className = 'input-group mb-2';
      ingredientDiv.innerHTML = `
        <input type="text" class="form-control" placeholder="Ingrediente" required>
        <input type="text" class="form-control" placeholder="Cantidad (opcional)">
        <button type="button" class="btn btn-outline-danger remove-ingredient">✖</button>
      `;

      list.appendChild(ingredientDiv);

      ingredientDiv.querySelector('.remove-ingredient').addEventListener('click', () => {
        ingredientDiv.remove();
      });
    });
  });

  // Submit del formulario
  const menuForm = document.getElementById('menuForm');
  if (menuForm) {
    menuForm.addEventListener('submit', e => {
      e.preventDefault();

      const menuName = document.getElementById('menuName').value.trim();
      const principal = document.getElementById('principalName').value.trim();

      if (!menuName || !principal) {
        alert('El nombre del menú y del plato principal son obligatorios.');
        return;
      }

      alert('✅ Menú "' + menuName + '" guardado correctamente.');
      e.target.reset();

      document.querySelectorAll('.ingredient-list').forEach(list => list.innerHTML = '');
    });
  }
});
