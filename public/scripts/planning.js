/* planning.js
   Lógica frontend del flujo:
   1) click en + abre modal de selección (selectMenuModal)
   2) modal muestra tarjetas con menús predefinidos
   3) click en tarjeta abre modal detalle (menuDetailModal) con ingredientes (ninguno checked)
   4) confirmar añade el menú al slot seleccionado
*/

document.addEventListener("DOMContentLoaded", () => {
  // Menús de ejemplo (simulados en frontend)
  const MENUS = [
    {
      id: 'mediterraneo',
      name: 'Menú Mediterráneo',
      desc: 'Ensalada, Lomo a la plancha, Yogur con miel',
      dishes: [
        { name: 'Entrante', items: ['Ensalada griega'] },
        { name: 'Principal', items: ['Pollo al horno'] },
        { name: 'Postre', items: ['Flan casero'] }
      ]
    },
    {
      id: 'proteico',
      name: 'Menú Proteico',
      desc: 'Huevos revueltos, Pechuga de pollo, Fruta',
      dishes: [
        { name: 'Entrante', items: ['Huevos revueltos'] },
        { name: 'Principal', items: ['Pechuga de pollo'] },
        { name: 'Postre', items: ['Fruta'] }
      ]
    },
    {
      id: 'vegano',
      name: 'Menú Vegano',
      desc: 'Hummus, Curry de garbanzos, Plátano',
      dishes: [
        { name: 'Entrante', items: ['Hummus'] },
        { name: 'Principal', items: ['Curry de garbanzos'] },
        { name: 'Postre', items: ['Plátano'] }
      ]
    }
  ];

  // Bootstrap Modals
  const selectModalEl = document.getElementById('selectMenuModal');
  const detailModalEl = document.getElementById('menuDetailModal');
  const selectModal = new bootstrap.Modal(selectModalEl);
  const detailModal = new bootstrap.Modal(detailModalEl);

  const menusGrid = document.getElementById('menusGrid');
  const detailName = document.getElementById('detailName');
  const detailDesc = document.getElementById('detailDesc');
  const detailIngredients = document.getElementById('detailIngredients');

  let activeSlot = null; // elemento .slot que abrió el flujo
  let activeMenu = null; // menú seleccionado

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
                ${menu.dishes.map(d=>`<strong>${d.name}:</strong> ${d.items.join(', ')}`).join('<br>')}
              </div>
            </div>
          </div>
        </div>
      `;
      menusGrid.appendChild(col);

      // click o tecla -> abrir detalle
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
    detailDesc.textContent = menu.desc || '';

    detailIngredients.innerHTML = '';
    menu.dishes.forEach(dish => {
      const header = document.createElement('div');
      header.className = 'fw-semibold mt-2';
      header.textContent = dish.name;
      detailIngredients.appendChild(header);

      dish.items.forEach(item => {
        const li = document.createElement('label');
        li.className = 'list-group-item';
        li.innerHTML = `<input type="checkbox"> <span class="ms-2">${item}</span>`;
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

    const slotEl = activeSlot; // ← guardamos referencia para usarla después

    slotEl.classList.add('assigned');
    slotEl.innerHTML = `
  <div class="assigned-header">
    <div class="menu-name">${activeMenu.name}</div>
  </div>
  <div class="assigned-dishes mt-1 small text-muted">
    ${activeMenu.dishes.map(d => `<div><strong>${d.name}:</strong> ${d.items.join(', ')}</div>`).join('')}
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

    // ============================
    // Botón 🗑 eliminar menú
    // ============================
    const removeBtn = slotEl.querySelector('.remove-assignment');
    removeBtn.addEventListener('click', () => {
      slotEl.style.transition = 'opacity 0.3s ease';
      slotEl.style.opacity = '0';
      setTimeout(() => {
        slotEl.classList.remove('assigned', 'eaten');
        slotEl.innerHTML = `<button class="btn add-menu-btn">+</button>`;
        attachAddHandler(slotEl.querySelector('.add-menu-btn'));
        slotEl.style.opacity = '1';
      }, 300);
    });

    // ============================
    // Botón ✅ marcar como comido
    // ============================
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
    });

    detailModal.hide();
    activeMenu = null;
    activeSlot = null;
  }

  // ============================
  // Handlers de los botones +
  // ============================
  function attachAddHandler(btn) {
    btn.addEventListener('click', () => {
      const slotEl = btn.closest('.slot');
      activeSlot = slotEl;
      renderMenuCards();
      selectModal.show();
    });
  }

  // Asignar evento a todos los botones +
  document.querySelectorAll('.add-menu-btn').forEach(btn => attachAddHandler(btn));

  // Confirmar desde el modal detalle
  document.getElementById('confirmAddToSlot').addEventListener('click', confirmAdd);

  // Limpieza opcional
  detailModalEl.addEventListener('hidden.bs.modal', () => activeMenu = null);

  // Render inicial
  renderMenuCards();
});
