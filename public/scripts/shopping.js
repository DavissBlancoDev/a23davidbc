document.addEventListener('DOMContentLoaded', () => {
  const shoppingList = document.getElementById('shoppingList');
  const addBtn = document.getElementById('addIngredientBtn');
  const newIngredient = document.getElementById('newIngredient');
  const newQuantity = document.getElementById('newQuantity');

  // Leer lista guardada o inicializar vacía
  let savedIngredients = JSON.parse(localStorage.getItem('shoppingList')) || [];

  function saveToStorage() {
    localStorage.setItem('shoppingList', JSON.stringify(savedIngredients));
  }

  // Función solo para renderizar un item en el DOM
  function renderItem(name, quantity) {
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
      savedIngredients = savedIngredients.filter(
        ing => !(ing.name === name && ing.quantity === quantity)
      );
      saveToStorage();
    });
  }

  // Función para añadir ingrediente (actualiza array + storage + DOM)
  function addItem(name, quantity = '') {
    savedIngredients.push({ name, quantity });
    saveToStorage();
    renderItem(name, quantity);
  }

  // Cargar ingredientes al iniciar
  savedIngredients.forEach(ing => renderItem(ing.name, ing.quantity));

  // Función para añadir ingrediente manualmente
  function addIngredientFromInput() {
    const name = newIngredient.value.trim();
    const quantity = newQuantity.value.trim();
    if (!name) return alert('Escribe el nombre del ingrediente');
    addItem(name, quantity);
    newIngredient.value = '';
    newQuantity.value = '';
  }

  addBtn.addEventListener('click', addIngredientFromInput);

  [newIngredient, newQuantity].forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addIngredientFromInput();
      }
    });
  });

  // Borrar todo
  const clearListBtn = document.getElementById('clearListBtn');
  clearListBtn.addEventListener('click', () => {
    if (shoppingList.children.length === 0) return;
    const confirmDelete = confirm('¿Estás seguro de que quieres borrar todos los ingredientes?');
    if (confirmDelete) {
      shoppingList.innerHTML = '';
      savedIngredients = [];
      saveToStorage();
    }
  });
});
