document.addEventListener('DOMContentLoaded', () => {
  const shoppingList = document.getElementById('shoppingList');
  const addBtn = document.getElementById('addIngredientBtn');
  const newIngredient = document.getElementById('newIngredient');
  const newQuantity = document.getElementById('newQuantity');

  // Función para crear un item en la lista
  function addItem(name, quantity = '') {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `
      <span>${name}${quantity ? ' - ' + quantity : ''}</span>
      <div>
        <button class="btn btn-sm btn-outline-success check-btn">✔</button>
        <button class="btn btn-sm btn-outline-danger remove-btn">✖</button>
      </div>
    `;
    shoppingList.appendChild(li);

    // Marcar como comprado
    li.querySelector('.check-btn').addEventListener('click', () => {
      li.classList.toggle('completed');
    });

    // Eliminar item
    li.querySelector('.remove-btn').addEventListener('click', () => {
      li.remove();
    });
  }

  // Función para añadir ingrediente (ya existente)
  function addIngredientFromInput() {
    const name = newIngredient.value.trim();
    const quantity = newQuantity.value.trim();
    if (!name) return alert('Escribe el nombre del ingrediente');
    addItem(name, quantity);
    newIngredient.value = '';
    newQuantity.value = '';
  }

  // Botón Añadir
  addBtn.addEventListener('click', addIngredientFromInput);

  // Pulsar Enter en cualquiera de los inputs
  [newIngredient, newQuantity].forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // evitar que el formulario se envíe
        addIngredientFromInput();
      }
    });
  });


  // Botón Borrar todo
  const clearListBtn = document.getElementById('clearListBtn');

  clearListBtn.addEventListener('click', () => {
    if (shoppingList.children.length === 0) return; // nada que borrar
    const confirmDelete = confirm('¿Estás seguro de que quieres borrar todos los ingredientes?');
    if (confirmDelete) {
      shoppingList.innerHTML = ''; // borra todos los items
    }
  });


  // 👀 Placeholder: añadir ingredientes del planning semanal automáticamente
  // Esto se hará cuando tengamos el backend
  // Ejemplo de prueba:
  // addItem('Tomates', '500g');
  // addItem('Leche', '1L');
});
