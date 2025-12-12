document.addEventListener('DOMContentLoaded', () => {
  const shoppingList = document.getElementById('shoppingList');
  const addBtn = document.getElementById('addIngredientBtn');
  const newIngredient = document.getElementById('newIngredient');
  const newQuantity = document.getElementById('newQuantity');

  // Usar lista por usuario
  const userId = localStorage.getItem('userId');
  const storageKey = userId ? `shoppingList_${userId}` : 'shoppingList';
  let savedIngredients = JSON.parse(localStorage.getItem(storageKey)) || [];

  function saveToStorage() {
    localStorage.setItem(storageKey, JSON.stringify(savedIngredients));
  }

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

    li.querySelector('.check-btn').addEventListener('click', () => {
      li.classList.toggle('completed');
    });

    li.querySelector('.remove-btn').addEventListener('click', () => {
      li.remove();
      savedIngredients = savedIngredients.filter(
        ing => !(ing.name === name && ing.quantity === quantity)
      );
      saveToStorage();
    });
  }

  function addItem(name, quantity = '') {
    savedIngredients.push({ name, quantity });
    saveToStorage();
    renderItem(name, quantity);
  }

  savedIngredients.forEach(ing => renderItem(ing.name, ing.quantity));

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
