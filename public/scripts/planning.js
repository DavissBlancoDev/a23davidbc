document.addEventListener("DOMContentLoaded", () => {

  // Bootstrap Modals
  const selectModalEl = document.getElementById('selectMenuModal');
  const detailModalEl = document.getElementById('menuDetailModal');
  const selectModal = new bootstrap.Modal(selectModalEl);
  const detailModal = new bootstrap.Modal(detailModalEl);

  const menusGrid = document.getElementById('menusGrid');
  const detailName = document.getElementById('detailName');
  const detailIngredients = document.getElementById('detailIngredients');

  let activeSlot = null; // elemento .slot que abrió el flujo
  let activeMenu = null; // menú seleccionado

  // Array que se llenará desde la BD
  let MENUS = [];

  // ============================
  // Guardar el planning en localStorage
  // ============================
  function savePlanningState() {
    const slotsState = {};
    document.querySelectorAll('.slot').forEach(slot => {
      const slotId = slot.dataset.slotId;
      if (slot.classList.contains('assigned')) {
        const menuName = slot.querySelector('.menu-name').textContent;
        const dishes = Array.from(slot.querySelectorAll('.assigned-dishes div')).map(d => d.textContent);
        const eaten = slot.classList.contains('eaten');
        slotsState[slotId] = { menuName, dishes, eaten };
      }
    });
    localStorage.setItem('planningState', JSON.stringify(slotsState));
  }

  // ============================
  // Recuperar el planning desde localStorage
  // ============================
  function loadPlanningState() {
    const slotsState = JSON.parse(localStorage.getItem('planningState') || '{}');
    Object.entries(slotsState).forEach(([slotId, data]) => {
      const slotEl = document.querySelector(`.slot[data-slot-id="${slotId}"]`);
      if (!slotEl) return;

      slotEl.classList.add('assigned');
      if (data.eaten) slotEl.classList.add('eaten');

      slotEl.innerHTML = `
        <div class="assigned-header">
          <div class="menu-name">${data.menuName}</div>
        </div>
        <div class="assigned-dishes mt-1 small text-muted">
          ${data.dishes.map(d => `<div>${d}</div>`).join('')}
        </div>
        <div class="slot-actions d-flex justify-content-center gap-2 mt-2">
          <button class="btn btn-sm ${data.eaten ? 'btn-success' : 'btn-outline-success'} mark-eaten" title="Marcar como comido">
            <i class="bi ${data.eaten ? 'bi-check-circle-fill' : 'bi-check2'}"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger remove-assignment" title="Eliminar menú">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      `;

      attachSlotButtons(slotEl);
    });
  }

  // ============================
  // Traer menús del usuario desde backend
  // ============================
  async function fetchUserMenus() {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const res = await fetch(`/api/menus/usuario/${userId}`);
      if (!res.ok) throw new Error('Error al obtener menús');

      const data = await res.json();

      // Convertimos los platos a estructura que usa renderMenuCards
      MENUS = data.map(menu => ({
        id: menu._id,
        name: menu.nombre,
        dishes: menu.platos.map(p => ({
          name: p.nombre,
          ingredientes: p.ingredientes
        }))
      }));

      renderMenuCards();
    } catch (err) {
      console.error(err);
    }
  }

  // ============================
  // Renderizado de menús (modal selección)
  // ============================
  function renderMenuCards() {
    menusGrid.innerHTML = '';
    MENUS.forEach(menu => {
      const col = document.createElement('div');
      col.className = 'col-12 col-sm-6 col-md-4';
      col.innerHTML = `
        <div class="menu-card" data-menu-id="${menu.id}" role="button" tabindex="0">
          <div class="d-flex align-items-start gap-3">
            <div style="flex:1">
              <div class="title">${menu.name}</div>
              <div class="dishes">
                ${menu.dishes.map(d => `<strong>${d.name}</strong>`).join('<br>')}
              </div>
            </div>
          </div>
        </div>
      `;
      menusGrid.appendChild(col);

      const card = col.querySelector('.menu-card');
      card.addEventListener('click', () => openDetailMenu(menu));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') openDetailMenu(menu);
      });
    });
  }

  // ============================
  // Abrir detalle del menú
  // ============================
  function openDetailMenu(menu) {
    activeMenu = menu;
    detailName.textContent = menu.name;
    detailIngredients.innerHTML = '';

    menu.dishes.forEach(dish => {
      const header = document.createElement('div');
      header.className = 'fw-semibold mt-2';
      header.textContent = dish.name;
      detailIngredients.appendChild(header);

      Object.entries(dish.ingredientes).forEach(([ing, qty]) => {
        const li = document.createElement('label');
        li.className = 'list-group-item d-flex align-items-center';
        li.innerHTML = `
          <input type="checkbox" checked class="me-2"> 
          <span>${ing} (${qty})</span>
        `;

        const checkbox = li.querySelector('input');
        checkbox.addEventListener('change', () => {
          const span = li.querySelector('span');
          if (!checkbox.checked) {
            span.style.textDecoration = 'line-through';
            span.style.color = 'gray';
          } else {
            span.style.textDecoration = 'none';
            span.style.color = '';
          }
        });

        detailIngredients.appendChild(li);
      });
    });

    selectModal.hide();
    setTimeout(() => detailModal.show(), 180);
  }

  // ============================
  // Confirmar y añadir menú al slot
  // ============================
  function confirmAdd() {
    if (!activeSlot || !activeMenu) return;
    const slotEl = activeSlot;

    // Añadimos al planning
    slotEl.classList.add('assigned');
    slotEl.innerHTML = `
      <div class="assigned-header">
        <div class="menu-name">${activeMenu.name}</div>
      </div>
      <div class="assigned-dishes mt-1 small text-muted">
        ${activeMenu.dishes.map(d => `<div><strong>${d.name}</strong></div>`).join('')}
      </div>
      <div class="slot-actions d-flex justify-content-center gap-2 mt-2">
        <button class="btn btn-sm btn-outline-success mark-eaten" title="Marcar como comido">
          <i class="bi bi-check2"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger remove-assignment" title="Eliminar menú">
          <i class="bi bi-trash3"></i>
        </button>
      </div>
    `;

    // Guardamos ingredientes desmarcados en lista de la compra
    const uncheckedIngredients = [];
    detailIngredients.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      if (!checkbox.checked) {
        const span = checkbox.nextElementSibling;
        const text = span.textContent;
        const match = text.match(/(.+)\s\((.+)\)/);
        if (match) uncheckedIngredients.push({ name: match[1], quantity: match[2] });
      }
    });
    const currentShopping = JSON.parse(localStorage.getItem('shoppingList')) || [];
    localStorage.setItem('shoppingList', JSON.stringify([...currentShopping, ...uncheckedIngredients]));

    attachSlotButtons(slotEl);

    detailModal.hide();
    activeMenu = null;
    activeSlot = null;

    savePlanningState();
  }

  // ============================
  // Asignar eventos a botones de slot
  // ============================
  function attachSlotButtons(slotEl) {
    const removeBtn = slotEl.querySelector('.remove-assignment');
    removeBtn.addEventListener('click', () => {
      slotEl.style.transition = 'opacity 0.3s ease';
      slotEl.style.opacity = '0';
      setTimeout(() => {
        slotEl.classList.remove('assigned', 'eaten');
        slotEl.innerHTML = `<button class="btn add-menu-btn">+</button>`;
        attachAddHandler(slotEl.querySelector('.add-menu-btn'));
        slotEl.style.opacity = '1';
        savePlanningState();
      }, 300);
    });

    const checkBtn = slotEl.querySelector('.mark-eaten');
    checkBtn.addEventListener('click', () => {
      const isEaten = slotEl.classList.toggle('eaten');
      const icon = checkBtn.querySelector('i');
      if (isEaten) {
        icon.classList.remove('bi-check2');
        icon.classList.add('bi-check-circle-fill');
        checkBtn.classList.remove('btn-outline-success');
        checkBtn.classList.add('btn-success');
      } else {
        icon.classList.add('bi-check2');
        icon.classList.remove('bi-check-circle-fill');
        checkBtn.classList.add('btn-outline-success');
        checkBtn.classList.remove('btn-success');
      }
      savePlanningState();
    });
  }

  // ============================
  // Handlers de los botones +
  // ============================
  function attachAddHandler(btn) {
    btn.addEventListener('click', async () => {
      const slotEl = btn.closest('.slot');
      activeSlot = slotEl;
      await fetchUserMenus();
      selectModal.show();
    });
  }

  document.querySelectorAll('.add-menu-btn').forEach(btn => attachAddHandler(btn));
  document.getElementById('confirmAddToSlot').addEventListener('click', confirmAdd);
  detailModalEl.addEventListener('hidden.bs.modal', () => activeMenu = null);

  // ============================
  // Cargar estado al iniciar
  // ============================
  loadPlanningState();

});
