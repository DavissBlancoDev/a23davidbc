document.addEventListener("DOMContentLoaded", () => {

  // --------------------------
  // Bootstrap Modals
  // --------------------------
  const selectModalEl = document.getElementById('selectMenuModal');
  const detailModalEl = document.getElementById('menuDetailModal');
  const slotSummaryModalEl = document.getElementById('slotSummaryModal');

  const selectModal = new bootstrap.Modal(selectModalEl);
  const detailModal = new bootstrap.Modal(detailModalEl);
  const slotSummaryModal = new bootstrap.Modal(slotSummaryModalEl);

  const menusGrid = document.getElementById('menusGrid');
  const detailName = document.getElementById('detailName');
  const detailIngredients = document.getElementById('detailIngredients');

  const slotSummaryTitle = document.getElementById('slotSummaryTitle');
  const slotSummaryMenu = document.getElementById('slotSummaryMenu');
  const slotSummaryDishes = document.getElementById('slotSummaryDishes');

  let activeSlot = null;
  let activeMenu = null;

  let MENUS = [];

  const CALORIE_API_KEY = 'XLdAAkst4tjAzq/ToTd2rQ==Pd96NJwrFffwSBwb';

  // --------------------------
  // Guardar estado del planning por usuario
  // --------------------------
  function savePlanningState() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

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

    localStorage.setItem(`planningState_${userId}`, JSON.stringify(slotsState));
  }

  // --------------------------
  // Cargar estado del planning del usuario
  // --------------------------
  function loadPlanningState() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const slotsState = JSON.parse(localStorage.getItem(`planningState_${userId}`) || '{}');

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
      attachSlotSummary(slotEl);
    });
  }

  // --------------------------
  // Traer menús del usuario
  // --------------------------
  async function fetchUserMenus() {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const res = await fetch(`/api/menus/usuario/${userId}`);
      if (!res.ok) throw new Error('Error al obtener menús');

      const data = await res.json();
      console.log("Menús obtenidos del backend:", data);

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

  // --------------------------
  // Renderizar cards de menú
  // --------------------------
  function renderMenuCards() {
    menusGrid.innerHTML = '';

    if (MENUS.length === 0) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'text-center text-muted p-4';
      msgDiv.innerHTML = `
        <i class="bi bi-info-circle mb-2" style="font-size: 2rem;"></i>
        <div>No hay menús creados actualmente para añadir al planning.</div>
        <div class="small">Crea un menú primero en la sección de menús.</div>
      `;
      menusGrid.appendChild(msgDiv);
      return;
    }

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

  // --------------------------
  // Abrir detalle de menú
  // --------------------------
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

        // Si no tiene cantidad, no mostramos "()"
        const qtyText = qty ? ` (${qty})` : "";

        li.innerHTML = `
          <input type="checkbox" checked class="me-2"> 
          <span>${ing}${qtyText}</span>
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

  // --------------------------
  // Confirmar y añadir menú al slot (CORREGIDO)
  // --------------------------
  function confirmAdd() {
    if (!activeSlot || !activeMenu) return;
    const slotEl = activeSlot;

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

    // --------------------------
    // Guardar ingredientes desmarcados SIN O CON cantidad
    // --------------------------
    const userId = localStorage.getItem('userId');
    if (userId) {
      const storageKey = `shoppingList_${userId}`;
      const currentShopping = JSON.parse(localStorage.getItem(storageKey)) || [];

      detailIngredients.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (!checkbox.checked) {

          const span = checkbox.nextElementSibling;
          const raw = span.textContent.trim();

          // Intentar separar “Ingrediente (cantidad)”
          const match = raw.match(/^(.+?)\s*\((.+)\)$/);

          let name, quantity;

          if (match) {
            name = match[1].trim();
            quantity = match[2].trim();
          } else {
            // No tiene cantidad → todo es nombre
            name = raw;
            quantity = '';
          }

          if (!name) return;

          // Evitar duplicados
          const exists = currentShopping.some(
            ing => ing.name === name && ing.quantity === quantity
          );

          if (!exists) {
            currentShopping.push({ name, quantity });
          }
        }
      });

      localStorage.setItem(storageKey, JSON.stringify(currentShopping));
    }

    attachSlotButtons(slotEl);
    attachSlotSummary(slotEl);

    detailModal.hide();
    activeMenu = null;
    activeSlot = null;

    savePlanningState();
  }

  // --------------------------
  // Botones dentro de slots
  // --------------------------
  function attachSlotButtons(slotEl) {
    const removeBtn = slotEl.querySelector('.remove-assignment');
    removeBtn.addEventListener('click', () => {
      slotEl.style.transition = 'opacity 0.3s ease';
      slotEl.style.opacity = '0';
      setTimeout(() => {
        slotEl.classList.remove('assigned', 'eaten');
        slotEl.innerHTML = `<button class="btn add-menu-btn">+</button>`;
        attachAddHandler(slotEl.querySelector('.add-menu-btn'));
        attachSlotSummary(slotEl);
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

  // --------------------------
  // Click en slot asignado → resumen + info nutricional
  // --------------------------
  function attachSlotSummary(slotEl) {
    slotEl.addEventListener('click', async (e) => {
      if (e.target.closest('button')) return;
      if (!slotEl.classList.contains('assigned')) return;

      const menuName = slotEl.querySelector('.menu-name').textContent;
      const dishes = Array.from(slotEl.querySelectorAll('.assigned-dishes div')).map(d => d.textContent);

      slotSummaryTitle.textContent = `Resumen: ${slotEl.dataset.day} - ${slotEl.dataset.meal}`;
      slotSummaryMenu.textContent = menuName;
      slotSummaryDishes.innerHTML = '';

      for (const dish of dishes) {
        const dishDiv = document.createElement('div');
        dishDiv.className = 'mb-2';
        dishDiv.innerHTML = `<strong>${dish}</strong>`;

        try {
          const res = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(dish)}`, {
            headers: { 'X-Api-Key': CALORIE_API_KEY }
          });

          if (!res.ok) {
            dishDiv.innerHTML += `<div class="text-muted small">No se pudo obtener info nutricional</div>`;
          } else {
            const data = await res.json();
            if (data.items && data.items.length > 0) {
              const item = data.items[0];
              dishDiv.innerHTML += `
                <div class="text-muted small">
                  Calorías: ${item.calories} kcal | Proteínas: ${item.protein_g} g | Grasas: ${item.fat_total_g} g | Carbs: ${item.carbohydrates_total_g} g
                </div>
              `;
            } else {
              dishDiv.innerHTML += `<div class="text-muted small">Info nutricional no disponible</div>`;
            }
          }
        } catch (err) {
          dishDiv.innerHTML += `<div class="text-muted small">Error consultando API</div>`;
        }

        slotSummaryDishes.appendChild(dishDiv);
      }

      slotSummaryModal.show();
    });
  }

  // --------------------------
  // Botón +
  // --------------------------
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

  // --------------------------
  // Inicialización
  // --------------------------
  loadPlanningState();

});
