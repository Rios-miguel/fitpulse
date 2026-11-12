import { 
  TACO_OFFICIAL_DATABASE, 
  normalizeText, 
  searchFoodDatabase, 
  calculateNutritionalValues 
} from './food-db.js?v=2';

import {
  COMPENDIUM_EXERCISES,
  searchExercises,
  calculateExerciseCalories
} from './exercises-db.js?v=2';

// ============================================================================
// CONSTANTS & KEYS
// ============================================================================
const STORAGE_KEYS = {
  CUSTOM_FOODS: 'fitpulse_custom_foods_v1',
  LEGACY_FOOD_DB: 'fitpulse_food_db_v1',
  DAILY_LOGS: 'fitpulse_daily_logs_v1',
  SETTINGS: 'fitpulse_settings_v1',
  REMINDER_CONFIG: 'fitpulse_reminder_config_v1'
};

const DEFAULT_SETTINGS = {
  goalCalories: 2000,
  goalProtein: 150,
  goalCarbs: 200,
  goalFat: 60,
  goalWater: 2500,
  userWeightKg: 75
};

// ============================================================================
// APP STATE
// ============================================================================
let state = {
  currentDate: getTodayDateString(),
  customFoods: [],
  foodDatabase: [],
  dailyLogs: {},
  settings: { ...DEFAULT_SETTINGS },
  selectedFoodForMeal: null,
  selectedUnitMode: 'g', // 'g', 'ml', ou 'unidade'
  activeFilter: 'all',
  activeCategory: 'all',
  foodListLimit: 40,
  activeExerciseCategory: 'all',
  currentSelectedExercise: null,
  reminder: {
    active: false,
    intervalMinutes: 60,
    nextTimestamp: null,
    timerInterval: null
  }
};

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadDataFromStorage();
  initDateNavigation();
  initTabNavigation();
  initDialogHandlers();
  initFoodSearchAndSelect();
  initNewFoodCreation();
  initMealLogging();
  initWaterTracking();
  initWaterReminder();
  initWorkouts();
  initSettingsAndBackup();
  renderAll();
});

// ============================================================================
// DATE HELPERS
// ============================================================================
function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateDisplay(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d);
  const today = new Date();
  const todayStr = getTodayDateString();

  if (dateStr === todayStr) {
    return 'Hoje';
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  if (dateStr === yesterdayStr) {
    return 'Ontem';
  }

  const options = { day: 'numeric', month: 'short' };
  return targetDate.toLocaleDateString('pt-BR', options);
}

function initDateNavigation() {
  const prevBtn = document.getElementById('btn-prev-day');
  const nextBtn = document.getElementById('btn-next-day');
  const datePicker = document.getElementById('date-picker-input');
  const displayLabel = document.getElementById('display-date-label');

  datePicker.value = state.currentDate;
  displayLabel.textContent = formatDateDisplay(state.currentDate);

  prevBtn.addEventListener('click', () => changeDateOffset(-1));
  nextBtn.addEventListener('click', () => changeDateOffset(1));

  datePicker.addEventListener('change', (e) => {
    if (e.target.value) {
      state.currentDate = e.target.value;
      displayLabel.textContent = formatDateDisplay(state.currentDate);
      renderAll();
    }
  });
}

function changeDateOffset(days) {
  const [y, m, d] = state.currentDate.split('-').map(Number);
  const cur = new Date(y, m - 1, d);
  cur.setDate(cur.getDate() + days);

  const year = cur.getFullYear();
  const month = String(cur.getMonth() + 1).padStart(2, '0');
  const day = String(cur.getDate()).padStart(2, '0');
  state.currentDate = `${year}-${month}-${day}`;

  document.getElementById('date-picker-input').value = state.currentDate;
  document.getElementById('display-date-label').textContent = formatDateDisplay(state.currentDate);
  renderAll();
}

// ============================================================================
// DATA PERSISTENCE & IN-MEMORY TOKEN CACHE
// ============================================================================
function loadDataFromStorage() {
  try {
    const savedCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_FOODS);
    if (savedCustom) {
      state.customFoods = JSON.parse(savedCustom);
    } else {
      const legacyFoods = localStorage.getItem(STORAGE_KEYS.LEGACY_FOOD_DB);
      if (legacyFoods) {
        try {
          const parsed = JSON.parse(legacyFoods);
          state.customFoods = parsed.filter(f => f.id && f.id.startsWith('custom_'));
          saveCustomFoods();
        } catch (e) {}
      }
    }

    buildFullFoodDatabase();

    const savedLogs = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    if (savedLogs) {
      state.dailyLogs = JSON.parse(savedLogs);
    }

    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (savedSettings) {
      state.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
    }

    const savedReminder = localStorage.getItem(STORAGE_KEYS.REMINDER_CONFIG);
    if (savedReminder) {
      const parsed = JSON.parse(savedReminder);
      state.reminder.active = parsed.active || false;
      state.reminder.intervalMinutes = parsed.intervalMinutes || 60;
    }
  } catch (err) {
    console.error('Erro ao carregar dados do LocalStorage:', err);
    state.foodDatabase = [...TACO_OFFICIAL_DATABASE];
    state.settings = { ...DEFAULT_SETTINGS };
  }
}

function buildFullFoodDatabase() {
  state.foodDatabase = [...state.customFoods, ...TACO_OFFICIAL_DATABASE];
}

function saveCustomFoods() {
  localStorage.setItem(STORAGE_KEYS.CUSTOM_FOODS, JSON.stringify(state.customFoods));
  buildFullFoodDatabase();
}

function saveDailyLogs() {
  localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(state.dailyLogs));
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings));
}

function saveReminderConfig() {
  localStorage.setItem(
    STORAGE_KEYS.REMINDER_CONFIG,
    JSON.stringify({
      active: state.reminder.active,
      intervalMinutes: state.reminder.intervalMinutes
    })
  );
}

function getDayLog(dateStr) {
  if (!state.dailyLogs[dateStr]) {
    state.dailyLogs[dateStr] = {
      meals: [],
      water: [],
      workouts: []
    };
  }
  return state.dailyLogs[dateStr];
}

// ============================================================================
// TAB NAVIGATION
// ============================================================================
function initTabNavigation() {
  const tabButtons = document.querySelectorAll('.nav-tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.dataset.tab;

      tabButtons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetTabId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      if (targetTabId === 'tab-food-db') {
        renderFoodDatabaseList();
      } else if (targetTabId === 'tab-water') {
        renderWaterSection();
      } else if (targetTabId === 'tab-workouts') {
        renderWorkoutsSection();
        renderCompendiumExercises();
      }
    });
  });

  document.getElementById('btn-goto-water')?.addEventListener('click', () => switchTab('tab-water'));
  document.getElementById('btn-goto-workout')?.addEventListener('click', () => switchTab('tab-workouts'));
}

function switchTab(tabId) {
  const btn = document.querySelector(`.nav-tab-btn[data-tab="${tabId}"]`);
  if (btn) btn.click();
}

// ============================================================================
// DIALOG HELPERS (Native <dialog> with Modern Web Guidance)
// ============================================================================
function initDialogHandlers() {
  document.querySelectorAll('.btn-close-dialog, [data-dialog]').forEach(btn => {
    btn.addEventListener('click', () => {
      const dialogId = btn.dataset.dialog || btn.closest('dialog')?.id;
      if (dialogId) {
        const dialog = document.getElementById(dialogId);
        if (dialog && typeof dialog.close === 'function') {
          dialog.close();
        }
      }
    });
  });

  document.querySelectorAll('dialog[closedby="any"]').forEach(dialog => {
    const outside = (e, dlg) => {
      const r = dlg.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    let pressedOutside = false;
    dialog.addEventListener('pointerdown', (e) => {
      pressedOutside = outside(e, dialog);
    });
    dialog.addEventListener('pointerup', (e) => {
      if (pressedOutside && outside(e, dialog)) {
        dialog.close();
      }
    });
  });
}

function openDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (dialog && typeof dialog.showModal === 'function') {
    dialog.showModal();
  }
}

function closeDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (dialog && typeof dialog.close === 'function') {
    dialog.close();
  }
}

// ============================================================================
// FOOD DATABASE EXPLORER & CREATION
// ============================================================================
function initNewFoodCreation() {
  const btnOpen = document.getElementById('btn-open-create-food');
  btnOpen.addEventListener('click', () => {
    document.getElementById('form-create-food').reset();
    document.getElementById('unit-weight-group').style.display = 'none';
    openDialog('modal-add-food');
  });

  const portionTypeRadios = document.querySelectorAll('input[name="newFoodPortionType"]');
  const unitWeightGroup = document.getElementById('unit-weight-group');

  portionTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      unitWeightGroup.style.display = (e.target.value === 'unidade') ? 'block' : 'none';
    });
  });

  const form = document.getElementById('form-create-food');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('new-food-name').value.trim();
    const category = document.getElementById('new-food-category').value;
    const portionType = form.querySelector('input[name="newFoodPortionType"]:checked').value;
    const calories = parseFloat(document.getElementById('new-food-calories').value) || 0;
    const protein = parseFloat(document.getElementById('new-food-protein').value) || 0;
    const carbs = parseFloat(document.getElementById('new-food-carbs').value) || 0;
    const fat = parseFloat(document.getElementById('new-food-fat').value) || 0;
    const notes = document.getElementById('new-food-notes').value.trim();
    const unitWeight = parseFloat(document.getElementById('new-food-unit-weight')?.value) || null;

    if (!name) return;

    const newFood = {
      id: 'custom_' + Date.now(),
      name,
      category,
      portionType,
      calories: Math.round(calories),
      protein: Number(protein.toFixed(1)),
      carbs: Number(carbs.toFixed(1)),
      fat: Number(fat.toFixed(1)),
      fiber: 0.0,
      source: 'Personalizado',
      notes: notes || undefined,
      portionWeight: portionType === 'unidade' && unitWeight ? unitWeight : undefined,
      hasUnitOption: portionType === 'unidade'
    };

    state.customFoods.unshift(newFood);
    saveCustomFoods();
    closeDialog('modal-add-food');
    renderFoodDatabaseList();

    showToast(`"${name}" salvo no seu banco de alimentos!`);
  });

  // Filter Pills (Category or All)
  const filterPills = document.querySelectorAll('.filter-pills .filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      if (pill.dataset.category) {
        state.activeCategory = pill.dataset.category;
      } else {
        state.activeCategory = 'all';
      }
      state.foodListLimit = 40;
      renderFoodDatabaseList();
    });
  });

  // Search input in Food DB tab
  const searchInput = document.getElementById('food-search-input');
  searchInput.addEventListener('input', () => {
    state.foodListLimit = 40;
    document.querySelectorAll('.quick-chip').forEach(c => c.classList.remove('active'));
    renderFoodDatabaseList();
  });

  // Quick Chips Shortcuts
  document.querySelectorAll('.quick-chip[data-search]').forEach(chip => {
    chip.addEventListener('click', () => {
      const term = chip.dataset.search;
      searchInput.value = term;

      document.querySelectorAll('.quick-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      state.foodListLimit = 40;
      renderFoodDatabaseList();
    });
  });
}

function renderFoodDatabaseList() {
  const container = document.getElementById('food-db-grid');
  const countBadge = document.getElementById('food-count-badge');
  if (!container) return;

  const searchQuery = document.getElementById('food-search-input')?.value || '';
  const filtered = searchFoodDatabase(state.foodDatabase, searchQuery, state.activeCategory, 'all');

  if (countBadge) {
    countBadge.textContent = `${filtered.length} Alimentos`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <p style="color: var(--text-muted); font-size: 1.05rem; margin-bottom: 12px;">Nenhum alimento encontrado para "<strong>${escapeHTML(searchQuery)}</strong>".</p>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 20px;">Dica: você pode buscar por termos gerais como "patinho", "filé de frango", "arroz cozido" ou cadastrar manualmente.</p>
        <button type="button" class="btn btn-outline-primary" id="btn-quick-new-food">
          + Cadastrar Novo Alimento
        </button>
      </div>
    `;
    document.getElementById('btn-quick-new-food')?.addEventListener('click', () => {
      document.getElementById('btn-open-create-food').click();
    });
    return;
  }

  const displayItems = filtered.slice(0, state.foodListLimit);

  let html = displayItems.map(food => {
    let portionLabel = 'por 100g';
    if (food.portionType === '100ml') portionLabel = 'por 100ml';
    if (food.portionType === 'unidade') portionLabel = 'por 1 unid' + (food.portionWeight ? ` (~${food.portionWeight}g)` : '');
    else if (food.hasUnitOption && food.portionWeight) {
      portionLabel = `100g • ou 1 unid (~${food.portionWeight}g)`;
    }

    const isCustom = food.id.startsWith('custom_');
    const isRecipe = food.id.startsWith('rec_');
    let sourceBadge = `<span class="badge-source-taco" title="Tabela Brasileira de Composição de Alimentos">🔬 TACO UNICAMP</span>`;
    if (isCustom) {
      sourceBadge = `<span class="badge-source-custom">Personalizado</span>`;
    } else if (isRecipe) {
      sourceBadge = `<span class="badge-source-recipe" title="${escapeHTML(food.source || 'Receita Padrão')}">🍳 Receita Comum</span>`;
    }

    const hasIngredients = Array.isArray(food.ingredients) && food.ingredients.length > 0;

    return `
      <article class="food-item-card">
        <div>
          <div class="food-card-top">
            <h4 class="food-card-title">${escapeHTML(food.name)}</h4>
            <span class="food-badge-portion">${portionLabel}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            ${sourceBadge}
            <span class="food-card-category" style="margin-bottom: 0;">${escapeHTML(food.category)}</span>
          </div>

          ${food.notes ? `<p style="font-size: 0.76rem; color: var(--text-muted); margin-bottom: 10px; line-height: 1.3;">📋 <em>${escapeHTML(food.notes)}</em></p>` : ''}
          
          <div class="food-card-nutri">
            <div class="food-card-nutri-top">
              <span class="nutri-cal">${Math.round(food.calories)} <small>kcal</small></span>
              <small style="color: var(--text-muted); font-size: 0.75rem;">${portionLabel}</small>
            </div>
            <div class="nutri-macros-row">
              <span class="macro-chip macro-chip-protein" title="Proteína">🥩 ${food.protein}g Prot</span>
              <span class="macro-chip macro-chip-carbs" title="Carboidratos">🍞 ${food.carbs}g Carb</span>
              <span class="macro-chip macro-chip-fat" title="Gorduras">🥑 ${food.fat}g Gord</span>
              ${food.fiber ? `<span class="macro-chip macro-chip-fiber" title="Fibras">🌾 ${food.fiber}g Fib</span>` : ''}
            </div>
          </div>
        </div>

        <div class="food-card-actions">
          ${hasIngredients ? `
            <button type="button" class="btn-recipe-details" data-recipe-id="${food.id}" title="Ver composição e ingredientes da receita">
              🔍 Detalhes
            </button>
          ` : ''}
          <button type="button" class="btn btn-sm btn-outline-primary btn-log-this-food" data-id="${food.id}">
            + Consumir
          </button>
          ${isCustom ? `
            <button type="button" class="btn-danger-text btn-delete-custom-food" data-id="${food.id}" title="Excluir este alimento do banco">
              🗑️
            </button>
          ` : ''}
        </div>
      </article>
    `;
  }).join('');

  if (filtered.length > state.foodListLimit) {
    html += `
      <div style="grid-column: 1 / -1; text-align: center; padding: 20px 0;">
        <button type="button" class="btn btn-secondary btn-sm" id="btn-load-more-foods">
          Carregar mais alimentos (${filtered.length - state.foodListLimit} restantes)...
        </button>
      </div>
    `;
  }

  container.innerHTML = html;

  // Event listeners para botões "🔍 Detalhes"
  container.querySelectorAll('.btn-recipe-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const recipeId = btn.dataset.recipeId;
      const recipe = state.foodDatabase.find(f => f.id === recipeId);
      if (recipe) {
        openRecipeDetailsModal(recipe);
      }
    });
  });

  container.querySelectorAll('.btn-log-this-food').forEach(btn => {
    btn.addEventListener('click', () => {
      const foodId = btn.dataset.id;
      const food = state.foodDatabase.find(f => f.id === foodId);
      if (food) {
        startMealLoggingWithFood(food);
      }
    });
  });

  container.querySelectorAll('.btn-delete-custom-food').forEach(btn => {
    btn.addEventListener('click', () => {
      const foodId = btn.dataset.id;
      if (confirm('Deseja realmente remover este alimento personalizado?')) {
        state.customFoods = state.customFoods.filter(f => f.id !== foodId);
        saveCustomFoods();
        renderFoodDatabaseList();
      }
    });
  });

  document.getElementById('btn-load-more-foods')?.addEventListener('click', () => {
    state.foodListLimit += 40;
    renderFoodDatabaseList();
  });
}

/**
 * Abre o modal de Detalhes da Receita com a lista completa de ingredientes e divisão de macros
 * @param {Object} recipe 
 */
function openRecipeDetailsModal(recipe) {
  if (!recipe) return;
  state.currentInspectedRecipe = recipe;

  document.getElementById('modal-recipe-details-title').textContent = recipe.name;

  let portionSubtitle = '1 porção média';
  if (recipe.portionWeight) {
    portionSubtitle = `1 porção média (~${recipe.portionWeight}g) • Categoria: ${recipe.category}`;
  } else if (recipe.portionType === '100g') {
    portionSubtitle = `Referência: porção de 100g • Categoria: ${recipe.category}`;
  } else if (recipe.portionType === '100ml') {
    portionSubtitle = `Referência: porção de 100ml • Categoria: ${recipe.category}`;
  }
  document.getElementById('recipe-details-portion').textContent = portionSubtitle;

  // Valores Nutricionais Totais
  document.getElementById('recipe-modal-calories').textContent = Math.round(recipe.calories);
  document.getElementById('recipe-modal-protein').textContent = Number((recipe.protein || 0).toFixed(1));
  document.getElementById('recipe-modal-carbs').textContent = Number((recipe.carbs || 0).toFixed(1));
  document.getElementById('recipe-modal-fat').textContent = Number((recipe.fat || 0).toFixed(1));

  // Cálculo da distribuição calórica proporcional dos macronutrientes:
  // 1g Proteína = 4 kcal, 1g Carboidrato = 4 kcal, 1g Gordura = 9 kcal
  const calP = (recipe.protein || 0) * 4;
  const calC = (recipe.carbs || 0) * 4;
  const calF = (recipe.fat || 0) * 9;
  const sumCal = calP + calC + calF;

  let pctP = 33, pctC = 33, pctF = 34;
  if (sumCal > 0) {
    pctP = Math.round((calP / sumCal) * 100);
    pctC = Math.round((calC / sumCal) * 100);
    pctF = Math.max(0, 100 - pctP - pctC);
  }

  document.getElementById('pct-label-protein').textContent = `Prot ${pctP}%`;
  document.getElementById('pct-label-carbs').textContent = `Carb ${pctC}%`;
  document.getElementById('pct-label-fat').textContent = `Gord ${pctF}%`;

  document.getElementById('split-bar-protein').style.width = `${pctP}%`;
  document.getElementById('split-bar-carbs').style.width = `${pctC}%`;
  document.getElementById('split-bar-fat').style.width = `${pctF}%`;

  // Observações / Modo de preparo
  const notesBox = document.getElementById('recipe-modal-notes-box');
  const notesText = document.getElementById('recipe-modal-notes-text');
  if (recipe.notes) {
    notesText.textContent = recipe.notes;
    notesBox.classList.remove('hidden');
  } else {
    notesBox.classList.add('hidden');
  }

  // Ingredientes detalhados
  const tbody = document.getElementById('recipe-ingredients-tbody');
  const countBadge = document.getElementById('recipe-ingredients-count');
  const ingredients = recipe.ingredients || [];

  countBadge.textContent = `${ingredients.length} ${ingredients.length === 1 ? 'item' : 'ingredientes'}`;

  if (ingredients.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 16px;">
          Ingredientes específicos não detalhados individualmente.
        </td>
      </tr>
    `;
  } else {
    tbody.innerHTML = ingredients.map(ing => `
      <tr>
        <td>
          <span class="ing-name">${escapeHTML(ing.name)}</span>
        </td>
        <td>
          <span class="ing-amount">${escapeHTML(ing.amount)}</span>
        </td>
        <td class="ing-kcal">
          ${Math.round(ing.calories)} kcal
        </td>
        <td class="ing-macros-cell">
          <span class="ing-macro-badge p" title="Proteína">P: ${ing.protein}g</span>
          <span class="ing-macro-badge c" title="Carboidrato">C: ${ing.carbs}g</span>
          <span class="ing-macro-badge f" title="Gordura">G: ${ing.fat}g</span>
        </td>
      </tr>
    `).join('');
  }

  // Ação de consumir
  const consumeBtn = document.getElementById('btn-recipe-consume-action');
  consumeBtn.onclick = () => {
    closeDialog('modal-recipe-details');
    startMealLoggingWithFood(recipe);
  };

  openDialog('modal-recipe-details');
}

// ============================================================================
// MEAL LOGGING & CALORIE CALCULATION (Proportional Engine)
// ============================================================================
function initMealLogging() {
  document.getElementById('btn-quick-log-meal')?.addEventListener('click', () => {
    startMealLoggingWithFood(null);
  });

  document.getElementById('btn-open-log-meal-tab')?.addEventListener('click', () => {
    startMealLoggingWithFood(null);
  });

  const quantityInput = document.getElementById('input-meal-quantity');
  quantityInput.addEventListener('input', () => {
    updateMealCalculatedPreview();
  });

  document.querySelectorAll('input[name="mealUnitMode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.selectedUnitMode = e.target.value;
      updateMealUnitModeUI();
      updateMealCalculatedPreview();
    });
  });

  const formLog = document.getElementById('form-log-meal');
  formLog.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!state.selectedFoodForMeal) {
      alert('Por favor, selecione um alimento da Tabela Oficial antes de salvar.');
      return;
    }

    const mealType = document.getElementById('select-meal-type').value;
    const quantity = parseFloat(quantityInput.value);

    if (isNaN(quantity) || quantity <= 0) {
      alert('Por favor, digite uma quantidade válida.');
      return;
    }

    const calculated = calculateNutritionalValues(state.selectedFoodForMeal, quantity, state.selectedUnitMode);

    const unitSuffix = state.selectedUnitMode === 'unidade' ? 'unid' : (state.selectedFoodForMeal.portionType === '100ml' ? 'ml' : 'g');

    const mealEntry = {
      id: 'meal_item_' + Date.now(),
      mealType,
      foodId: state.selectedFoodForMeal.id,
      foodName: state.selectedFoodForMeal.name,
      portionType: state.selectedFoodForMeal.portionType,
      unitMode: state.selectedUnitMode,
      unitSuffix,
      quantity,
      calories: calculated.calories,
      protein: calculated.protein,
      carbs: calculated.carbs,
      fat: calculated.fat,
      fiber: calculated.fiber,
      source: state.selectedFoodForMeal.source || 'TACO / UNICAMP',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    const dayLog = getDayLog(state.currentDate);
    dayLog.meals.push(mealEntry);
    saveDailyLogs();
    closeDialog('modal-log-meal');
    renderAll();

    showToast(`+${calculated.calories} kcal adicionadas ao ${mealType}!`);
  });
}

function startMealLoggingWithFood(food) {
  document.getElementById('form-log-meal').reset();
  state.selectedFoodForMeal = food;

  if (food) {
    selectFoodForMeal(food);
  } else {
    clearSelectedFoodForMeal();
  }

  openDialog('modal-log-meal');
}

function initFoodSearchAndSelect() {
  const searchInput = document.getElementById('search-food-input');
  const resultsBox = document.getElementById('food-autocomplete-results');

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (!val) {
      resultsBox.classList.remove('active');
      return;
    }

    const matches = searchFoodDatabase(state.foodDatabase, val, 'all', 'all').slice(0, 8);

    if (matches.length === 0) {
      resultsBox.innerHTML = `
        <div class="autocomplete-item" style="color: var(--text-muted); cursor: default;">
          Nenhum alimento encontrado na base oficial.
        </div>
      `;
    } else {
      resultsBox.innerHTML = matches.map(food => {
        let portion = food.portionType === '100g' ? '100g' : (food.portionType === '100ml' ? '100ml' : '1 unid');
        if (food.hasUnitOption && food.portionWeight) {
          portion += ` (~${food.portionWeight}g)`;
        }
        let badgeSource = 'TACO';
        if (food.id.startsWith('custom_')) badgeSource = 'Personalizado';
        else if (food.id.startsWith('rec_')) badgeSource = 'Receita';

        return `
          <div class="autocomplete-item" data-id="${food.id}">
            <div>
              <strong>${escapeHTML(food.name)}</strong>
              <small style="color: var(--text-muted); display: block;">${Math.round(food.calories)} kcal / ${portion} • ${food.category}</small>
              <div style="display: flex; gap: 4px; margin-top: 3px;">
                <span class="mini-macro-badge p">🥩 ${food.protein}g</span>
                <span class="mini-macro-badge c">🍞 ${food.carbs}g</span>
                <span class="mini-macro-badge f">🥑 ${food.fat}g</span>
              </div>
            </div>
            <span class="badge" style="font-size: 0.68rem;">${badgeSource}</span>
          </div>
        `;
      }).join('');
    }

    resultsBox.classList.add('active');

    resultsBox.querySelectorAll('.autocomplete-item[data-id]').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const food = state.foodDatabase.find(f => f.id === id);
        if (food) {
          selectFoodForMeal(food);
          resultsBox.classList.remove('active');
        }
      });
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#search-food-input') && !e.target.closest('#food-autocomplete-results')) {
      resultsBox.classList.remove('active');
    }
  });
}

function selectFoodForMeal(food) {
  state.selectedFoodForMeal = food;
  document.getElementById('search-food-input').value = food.name;
  document.getElementById('selected-food-id').value = food.id;

  const badge = document.getElementById('selected-food-badge');
  badge.classList.remove('hidden');

  let basePortionText = food.portionType === '100ml' ? '100ml' : '100g';
  if (food.portionType === 'unidade') basePortionText = '1 unidade';

  document.getElementById('preview-food-name').textContent = food.name;
  document.getElementById('preview-food-base-info').textContent = `(Base oficial: ${Math.round(food.calories)} kcal / ${basePortionText})`;
  document.getElementById('preview-base-p').textContent = `Prot: ${food.protein}g`;
  document.getElementById('preview-base-c').textContent = `Carb: ${food.carbs}g`;
  document.getElementById('preview-base-f').textContent = `Gord: ${food.fat}g`;

  const unitSelectorGroup = document.getElementById('unit-mode-selector-group');
  if (food.hasUnitOption || food.portionType === 'unidade') {
    unitSelectorGroup.style.display = 'block';
    const subtext = document.getElementById('unit-mode-subtext');
    if (subtext) {
      subtext.textContent = food.portionWeight ? `~${food.portionWeight}g por unidade` : '1, 2, 3 unidades...';
    }

    if (food.portionType === 'unidade') {
      state.selectedUnitMode = 'unidade';
      const rUnid = document.querySelector('input[name="mealUnitMode"][value="unidade"]');
      if (rUnid) rUnid.checked = true;
    } else {
      state.selectedUnitMode = 'g';
      const rG = document.querySelector('input[name="mealUnitMode"][value="g"]');
      if (rG) rG.checked = true;
    }
  } else {
    unitSelectorGroup.style.display = 'none';
    state.selectedUnitMode = food.portionType === '100ml' ? 'ml' : 'g';
  }

  updateMealUnitModeUI();
  updateMealCalculatedPreview();
}

function updateMealUnitModeUI() {
  const food = state.selectedFoodForMeal;
  if (!food) return;

  const qtyInput = document.getElementById('input-meal-quantity');
  let unitSuffix = 'g';
  let hint = 'Informe a quantidade em gramas consumidos.';
  let defaultQuantity = 100;

  if (state.selectedUnitMode === 'unidade') {
    unitSuffix = 'unid';
    hint = `Informe o número de unidades (ex: 1, 2, 3...)${food.portionWeight ? ` (~${food.portionWeight}g cada)` : ''}.`;
    defaultQuantity = 1;
    qtyInput.step = '1';
    qtyInput.min = '0.5';
  } else if (state.selectedUnitMode === 'ml' || food.portionType === '100ml') {
    unitSuffix = 'ml';
    hint = 'Informe os mililitros (ml) consumidos.';
    defaultQuantity = 200;
    qtyInput.step = 'any';
    qtyInput.min = '1';
  } else {
    unitSuffix = 'g';
    hint = 'Informe o peso em gramas consumidos na balança.';
    defaultQuantity = 100;
    qtyInput.step = 'any';
    qtyInput.min = '1';
  }

  document.getElementById('label-quantity-unit').textContent = `(${unitSuffix})`;
  document.getElementById('badge-portion-type-indicator').textContent = unitSuffix;
  document.getElementById('portion-hint').textContent = hint;

  if (!qtyInput.value || parseFloat(qtyInput.value) <= 0) {
    qtyInput.value = defaultQuantity;
  }
}

function clearSelectedFoodForMeal() {
  state.selectedFoodForMeal = null;
  document.getElementById('selected-food-badge').classList.add('hidden');
  document.getElementById('search-food-input').value = '';
  document.getElementById('selected-food-id').value = '';
  document.getElementById('input-meal-quantity').value = '';
  document.getElementById('unit-mode-selector-group').style.display = 'none';
  updateMealCalculatedPreview();
}

function updateMealCalculatedPreview() {
  const qty = parseFloat(document.getElementById('input-meal-quantity').value) || 0;
  const food = state.selectedFoodForMeal;

  if (!food || qty <= 0) {
    document.getElementById('calc-live-calories').textContent = '0';
    document.getElementById('calc-live-p').textContent = '0';
    document.getElementById('calc-live-c').textContent = '0';
    document.getElementById('calc-live-f').textContent = '0';
    const fibEl = document.getElementById('calc-live-fib');
    if (fibEl) fibEl.textContent = '0';
    return;
  }

  const calculated = calculateNutritionalValues(food, qty, state.selectedUnitMode);
  document.getElementById('calc-live-calories').textContent = calculated.calories;
  document.getElementById('calc-live-p').textContent = calculated.protein;
  document.getElementById('calc-live-c').textContent = calculated.carbs;
  document.getElementById('calc-live-f').textContent = calculated.fat;
  const fibEl = document.getElementById('calc-live-fib');
  if (fibEl) fibEl.textContent = calculated.fiber;
}

// ============================================================================
// WATER TRACKING & HYDRATION
// ============================================================================
function initWaterTracking() {
  document.querySelectorAll('.btn-water-quick').forEach(btn => {
    btn.addEventListener('click', () => {
      addWaterIntake(parseInt(btn.dataset.amount, 10));
    });
  });

  document.querySelectorAll('.btn-water-action[data-amount]').forEach(btn => {
    btn.addEventListener('click', () => {
      addWaterIntake(parseInt(btn.dataset.amount, 10));
    });
  });

  document.getElementById('btn-custom-water')?.addEventListener('click', () => {
    document.getElementById('custom-water-input').value = '';
    openDialog('modal-custom-water');
  });

  document.getElementById('form-custom-water')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseInt(document.getElementById('custom-water-input').value, 10);
    if (!isNaN(amount) && amount > 0) {
      addWaterIntake(amount);
      closeDialog('modal-custom-water');
    }
  });

  document.getElementById('btn-clear-water-day')?.addEventListener('click', () => {
    if (confirm('Deseja zerar os registros de água de hoje?')) {
      const dayLog = getDayLog(state.currentDate);
      dayLog.water = [];
      saveDailyLogs();
      renderAll();
    }
  });

  document.getElementById('btn-quick-water-ack')?.addEventListener('click', () => {
    addWaterIntake(250);
    hideWaterAlertBanner();
  });

  document.getElementById('btn-dismiss-alert')?.addEventListener('click', () => {
    hideWaterAlertBanner();
  });
}

function addWaterIntake(amount) {
  if (amount <= 0) return;
  const dayLog = getDayLog(state.currentDate);
  const entry = {
    id: 'water_' + Date.now(),
    amount,
    timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };

  dayLog.water.push(entry);
  saveDailyLogs();
  renderAll();

  playWaterChime();
  showToast(`+${amount}ml de água registrados! 💧`);
}

function removeWaterIntake(entryId) {
  const dayLog = getDayLog(state.currentDate);
  dayLog.water = dayLog.water.filter(w => w.id !== entryId);
  saveDailyLogs();
  renderAll();
}

// ============================================================================
// WATER REMINDERS & NOTIFICATIONS
// ============================================================================
function initWaterReminder() {
  const toggle = document.getElementById('toggle-water-reminder');
  const intervalSelect = document.getElementById('reminder-interval-select');
  const btnTest = document.getElementById('btn-test-notification');

  toggle.checked = state.reminder.active;
  intervalSelect.value = String(state.reminder.intervalMinutes);

  toggle.addEventListener('change', async (e) => {
    state.reminder.active = e.target.checked;
    if (state.reminder.active) {
      if ('Notification' in window && Notification.permission !== 'granted') {
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') {
          showToast('Permissão de notificações não autorizada no navegador. Usaremos avisos visuais e som.');
        }
      }
      startReminderSchedule();
      showToast('Lembrete de água ativado!');
    } else {
      stopReminderSchedule();
      showToast('Lembrete de água desativado.');
    }
    saveReminderConfig();
    updateReminderDisplay();
  });

  intervalSelect.addEventListener('change', (e) => {
    state.reminder.intervalMinutes = parseInt(e.target.value, 10);
    saveReminderConfig();
    if (state.reminder.active) {
      startReminderSchedule();
    }
    updateReminderDisplay();
  });

  btnTest.addEventListener('click', () => {
    triggerWaterAlert();
  });

  if (state.reminder.active) {
    startReminderSchedule();
  }
  updateReminderDisplay();
}

function startReminderSchedule() {
  if (state.reminder.timerInterval) {
    clearInterval(state.reminder.timerInterval);
  }

  const ms = state.reminder.intervalMinutes * 60 * 1000;
  state.reminder.nextTimestamp = Date.now() + ms;

  state.reminder.timerInterval = setInterval(() => {
    const remaining = state.reminder.nextTimestamp - Date.now();
    if (remaining <= 0) {
      triggerWaterAlert();
      state.reminder.nextTimestamp = Date.now() + ms;
    }
    updateReminderDisplay();
  }, 1000);
}

function stopReminderSchedule() {
  if (state.reminder.timerInterval) {
    clearInterval(state.reminder.timerInterval);
    state.reminder.timerInterval = null;
  }
  state.reminder.nextTimestamp = null;
}

function updateReminderDisplay() {
  const display = document.getElementById('reminder-timer-display');
  if (!display) return;

  if (!state.reminder.active || !state.reminder.nextTimestamp) {
    display.textContent = '--:--';
    return;
  }

  const diffSec = Math.max(0, Math.floor((state.reminder.nextTimestamp - Date.now()) / 1000));
  const m = Math.floor(diffSec / 60);
  const s = diffSec % 60;
  display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function triggerWaterAlert() {
  playNotificationChime();

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification('FitPulse - Hora de Beber Água! 💧', {
        body: 'Mantenha seu foco e hidrate-se com um copo d\'água agora.',
        icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💧</text></svg>'
      });
    } catch (e) {
      console.warn('Falha ao disparar notification nativa:', e);
    }
  }

  showWaterAlertBanner();
}

function showWaterAlertBanner() {
  const banner = document.getElementById('water-alert-banner');
  if (banner) {
    banner.classList.remove('hidden');
  }
}

function hideWaterAlertBanner() {
  const banner = document.getElementById('water-alert-banner');
  if (banner) {
    banner.classList.add('hidden');
  }
}

function playWaterChime() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch (err) {}
}

function playNotificationChime() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime);
    gain1.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start();
    osc1.stop(audioCtx.currentTime + 0.3);

    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15);
    gain2.gain.setValueAtTime(0.25, audioCtx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.55);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(audioCtx.currentTime + 0.15);
    osc2.stop(audioCtx.currentTime + 0.55);
  } catch (err) {}
}

// ============================================================================
// WORKOUTS & COMPENDIUM EXERCISES (Ainsworth et al. / Stanford 2024)
// ============================================================================
function initWorkouts() {
  document.getElementById('btn-open-add-workout')?.addEventListener('click', () => openWorkoutModal(null));
  document.getElementById('btn-dash-add-workout')?.addEventListener('click', () => openWorkoutModal(null));
  document.getElementById('btn-add-exercise-row')?.addEventListener('click', () => addExerciseInputRow());

  // Subnav toggle: Today's Workouts vs Compendium Explorer
  const btnSubMy = document.getElementById('btn-subnav-my-workouts');
  const btnSubComp = document.getElementById('btn-subnav-compendium');
  const subMy = document.getElementById('subview-my-workouts');
  const subComp = document.getElementById('subview-compendium');

  btnSubMy?.addEventListener('click', () => {
    btnSubMy.classList.add('active');
    btnSubComp.classList.remove('active');
    subMy.style.display = 'block';
    subComp.style.display = 'none';
  });

  btnSubComp?.addEventListener('click', () => {
    btnSubComp.classList.add('active');
    btnSubMy.classList.remove('active');
    subMy.style.display = 'none';
    subComp.style.display = 'block';
    renderCompendiumExercises();
  });

  // Filter Pills for Exercise Compendium
  document.querySelectorAll('#exercise-category-pills .filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#exercise-category-pills .filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.activeExerciseCategory = pill.dataset.exCat;
      renderCompendiumExercises();
    });
  });

  // Search input for Exercise Compendium
  document.getElementById('exercise-search-input')?.addEventListener('input', () => {
    renderCompendiumExercises();
  });

  // Dynamic Calorie Calculation in Modal on Duration or Activity change
  const compendiumSelect = document.getElementById('workout-compendium-select');
  const durationInput = document.getElementById('workout-duration');

  compendiumSelect?.addEventListener('change', () => {
    updateWorkoutCaloriesEstimate();
  });

  durationInput?.addEventListener('input', () => {
    updateWorkoutCaloriesEstimate();
  });

  const formWorkout = document.getElementById('form-workout');
  formWorkout.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('workout-title').value.trim();
    const duration = parseInt(document.getElementById('workout-duration').value, 10) || 45;
    const caloriesBurned = parseInt(document.getElementById('workout-calories-burned').value, 10) || 0;
    const notes = document.getElementById('workout-notes').value.trim();

    if (!title) return;

    const rows = document.querySelectorAll('.exercise-row');
    const exercises = [];
    rows.forEach(r => {
      const name = r.querySelector('.ex-name')?.value.trim();
      const sets = parseInt(r.querySelector('.ex-sets')?.value, 10) || 3;
      const reps = r.querySelector('.ex-reps')?.value.trim() || '10-12';
      const weight = r.querySelector('.ex-weight')?.value.trim() || '0';

      if (name) {
        exercises.push({ name, sets, reps, weight });
      }
    });

    const workout = {
      id: 'workout_' + Date.now(),
      title,
      duration,
      caloriesBurned,
      notes,
      exercises,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    const dayLog = getDayLog(state.currentDate);
    dayLog.workouts.push(workout);
    saveDailyLogs();
    closeDialog('modal-add-workout');
    renderAll();

    showToast(`Treino "${title}" salvo com queima de ~${caloriesBurned} kcal! 💪`);
  });
}

function updateWorkoutCaloriesEstimate() {
  const select = document.getElementById('workout-compendium-select');
  const durationInput = document.getElementById('workout-duration');
  const caloriesBurnedInput = document.getElementById('workout-calories-burned');
  const displayVal = document.getElementById('workout-calc-kcal-display');
  const hintVal = document.getElementById('workout-calc-formula-hint');

  const selectedOption = select.options[select.selectedIndex];
  const met = parseFloat(selectedOption?.dataset?.met) || 6.0;
  const duration = parseInt(durationInput.value, 10) || 45;
  const userWeight = state.settings.userWeightKg || 75;

  const burned = calculateExerciseCalories(met, userWeight, duration);

  if (caloriesBurnedInput) caloriesBurnedInput.value = burned;
  if (displayVal) displayVal.textContent = burned;
  if (hintVal) {
    hintVal.textContent = `Fórmula Compêndio: ${met} METs × ${userWeight}kg × (${duration} min / 60)`;
  }
}

function openWorkoutModal(prefillExercise = null) {
  document.getElementById('form-workout').reset();
  const list = document.getElementById('exercises-dynamic-list');
  list.innerHTML = '';

  const select = document.getElementById('workout-compendium-select');
  const titleInput = document.getElementById('workout-title');
  const durationInput = document.getElementById('workout-duration');

  if (prefillExercise) {
    select.value = prefillExercise.id;
    titleInput.value = prefillExercise.name;
    durationInput.value = prefillExercise.defaultDuration || 45;

    if (prefillExercise.isStrength) {
      addExerciseInputRow('Supino Reto com Barra', 4, '10', '60kg');
      addExerciseInputRow('Crucifixo Inclinado', 3, '12', '14kg');
    }
  } else {
    select.value = 'ex_musculacao_vigorosa';
    titleInput.value = 'Treino de Musculação & Força';
    durationInput.value = 50;
    addExerciseInputRow('Supino Reto', 4, '10', '60kg');
    addExerciseInputRow('Crucifixo', 3, '12', '14kg');
  }

  updateWorkoutCaloriesEstimate();
  openDialog('modal-add-workout');
}

function addExerciseInputRow(defaultName = '', defaultSets = 3, defaultReps = '10-12', defaultWeight = '') {
  const list = document.getElementById('exercises-dynamic-list');
  const div = document.createElement('div');
  div.className = 'exercise-row';
  div.innerHTML = `
    <input type="text" class="ex-name" placeholder="Nome (ex: Agachamento)" value="${defaultName}" required>
    <input type="number" class="ex-sets" placeholder="Séries" min="1" max="20" value="${defaultSets}">
    <input type="text" class="ex-reps" placeholder="Reps (ex: 12)" value="${defaultReps}">
    <input type="text" class="ex-weight" placeholder="Carga (kg)" value="${defaultWeight}">
    <button type="button" class="btn-remove-row" title="Remover exercício">✕</button>
  `;

  div.querySelector('.btn-remove-row').addEventListener('click', () => {
    div.remove();
  });

  list.appendChild(div);
}

function renderCompendiumExercises() {
  const container = document.getElementById('compendium-exercises-grid');
  if (!container) return;

  const searchQuery = document.getElementById('exercise-search-input')?.value || '';
  const filtered = searchExercises(searchQuery, state.activeExerciseCategory);
  const userWeight = state.settings.userWeightKg || 75;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <p>Nenhum exercício encontrado com esse termo.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(ex => {
    const estBurn = calculateExerciseCalories(ex.met, userWeight, ex.defaultDuration);

    return `
      <article class="exercise-card-compendium">
        <div>
          <div class="exercise-card-top">
            <h4 class="exercise-title">${escapeHTML(ex.name)}</h4>
            <span class="badge-met">⚡ ${ex.met} METs</span>
          </div>
          <div class="exercise-category-sub">${escapeHTML(ex.category)} • Intensidade ${ex.intensity}</div>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 6px;">${escapeHTML(ex.notes)}</p>
        </div>

        <div>
          <div class="exercise-burn-preview">
            <span>Em ${ex.defaultDuration} min (${userWeight}kg):</span>
            <strong>~${estBurn} kcal gastas</strong>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
            <button type="button" class="btn btn-outline-primary btn-sm btn-select-compendium-ex" data-id="${ex.id}">
              + Treinar Este
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  container.querySelectorAll('.btn-select-compendium-ex').forEach(btn => {
    btn.addEventListener('click', () => {
      const exId = btn.dataset.id;
      const ex = COMPENDIUM_EXERCISES.find(e => e.id === exId);
      if (ex) {
        openWorkoutModal(ex);
      }
    });
  });
}

// ============================================================================
// SETTINGS & BACKUP / RESTORE
// ============================================================================
function initSettingsAndBackup() {
  document.getElementById('btn-open-settings')?.addEventListener('click', () => {
    document.getElementById('settings-goal-calories').value = state.settings.goalCalories;
    document.getElementById('settings-goal-protein').value = state.settings.goalProtein;
    document.getElementById('settings-goal-carbs').value = state.settings.goalCarbs;
    document.getElementById('settings-goal-fat').value = state.settings.goalFat;
    document.getElementById('settings-goal-water').value = state.settings.goalWater;
    document.getElementById('settings-user-weight').value = state.settings.userWeightKg || 75;
    openDialog('modal-settings');
  });

  const formSettings = document.getElementById('form-settings');
  formSettings.addEventListener('submit', (e) => {
    e.preventDefault();

    state.settings.goalCalories = parseInt(document.getElementById('settings-goal-calories').value, 10) || 2000;
    state.settings.goalProtein = parseInt(document.getElementById('settings-goal-protein').value, 10) || 150;
    state.settings.goalCarbs = parseInt(document.getElementById('settings-goal-carbs').value, 10) || 200;
    state.settings.goalFat = parseInt(document.getElementById('settings-goal-fat').value, 10) || 60;
    state.settings.goalWater = parseInt(document.getElementById('settings-goal-water').value, 10) || 2500;
    state.settings.userWeightKg = parseFloat(document.getElementById('settings-user-weight').value) || 75;

    saveSettings();
    closeDialog('modal-settings');
    renderAll();
    renderCompendiumExercises(); // Atualiza previsões de calorias de acordo com o novo peso
    showToast('Metas e peso corporal atualizados com sucesso!');
  });

  document.getElementById('btn-export-json')?.addEventListener('click', () => {
    const backupData = {
      version: 2,
      databaseSource: 'TACO / UNICAMP (4ª Edição) & Compêndio de Atividades Físicas 2024',
      exportedAt: new Date().toISOString(),
      settings: state.settings,
      customFoods: state.customFoods,
      dailyLogs: state.dailyLogs
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitpulse_backup_${getTodayDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exportado com sucesso!');
  });

  document.getElementById('import-file-input')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.settings) {
          state.settings = { ...DEFAULT_SETTINGS, ...imported.settings };
          state.customFoods = imported.customFoods || [];
          state.dailyLogs = imported.dailyLogs || {};

          saveCustomFoods();
          saveSettings();
          saveDailyLogs();

          closeDialog('modal-settings');
          renderAll();
          renderCompendiumExercises();
          showToast('Dados restaurados com sucesso a partir do backup!');
        } else {
          alert('Arquivo JSON inválido ou incompatível.');
        }
      } catch (err) {
        alert('Erro ao processar o arquivo de backup: ' + err.message);
      }
    };
    reader.readAsText(file);
  });

  document.getElementById('btn-reset-data')?.addEventListener('click', () => {
    if (confirm('Tem certeza? Isso restaurará as configurações originais e apagará os registros locais.')) {
      localStorage.clear();
      state.customFoods = [];
      state.settings = { ...DEFAULT_SETTINGS };
      state.dailyLogs = {};
      buildFullFoodDatabase();
      saveSettings();
      saveDailyLogs();
      closeDialog('modal-settings');
      renderAll();
      renderCompendiumExercises();
      showToast('Dados restaurados para o padrão.');
    }
  });
}

// ============================================================================
// MAIN RENDER ENGINE
// ============================================================================
function renderAll() {
  const dayLog = getDayLog(state.currentDate);

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  dayLog.meals.forEach(m => {
    totalCalories += m.calories || 0;
    totalProtein += m.protein || 0;
    totalCarbs += m.carbs || 0;
    totalFat += m.fat || 0;
  });

  totalCalories = Math.round(totalCalories);
  totalProtein = Number(totalProtein.toFixed(1));
  totalCarbs = Number(totalCarbs.toFixed(1));
  totalFat = Number(totalFat.toFixed(1));

  document.getElementById('calorie-goal-tag').textContent = `Meta: ${state.settings.goalCalories} kcal`;
  document.getElementById('dash-calories-consumed').textContent = totalCalories;

  const remaining = state.settings.goalCalories - totalCalories;
  const remainingEl = document.getElementById('dash-calories-remaining');
  if (remaining >= 0) {
    remainingEl.textContent = remaining;
    remainingEl.style.color = 'var(--primary)';
  } else {
    remainingEl.textContent = `+${Math.abs(remaining)}`;
    remainingEl.style.color = 'var(--danger)';
  }

  const calPct = Math.min(100, Math.round((totalCalories / state.settings.goalCalories) * 100));
  const calBar = document.getElementById('calorie-progress-fill');
  calBar.style.width = `${calPct}%`;
  document.getElementById('calorie-progress-bar').setAttribute('aria-valuenow', calPct);

  // Macros
  document.getElementById('dash-protein-total').textContent = totalProtein;
  document.getElementById('dash-protein-goal').textContent = state.settings.goalProtein;
  const pPct = Math.min(100, Math.round((totalProtein / state.settings.goalProtein) * 100));
  document.getElementById('bar-protein').style.width = `${pPct}%`;

  document.getElementById('dash-carbs-total').textContent = totalCarbs;
  document.getElementById('dash-carbs-goal').textContent = state.settings.goalCarbs;
  const cPct = Math.min(100, Math.round((totalCarbs / state.settings.goalCarbs) * 100));
  document.getElementById('bar-carbs').style.width = `${cPct}%`;

  document.getElementById('dash-fat-total').textContent = totalFat;
  document.getElementById('dash-fat-goal').textContent = state.settings.goalFat;
  const fPct = Math.min(100, Math.round((totalFat / state.settings.goalFat) * 100));
  document.getElementById('bar-fat').style.width = `${fPct}%`;

  // Water
  let totalWater = 0;
  dayLog.water.forEach(w => { totalWater += w.amount; });
  document.getElementById('dash-water-total').textContent = totalWater;
  document.getElementById('dash-water-goal-label').textContent = `${state.settings.goalWater}ml`;
  const waterPct = Math.min(100, Math.round((totalWater / state.settings.goalWater) * 100));
  document.getElementById('dash-water-percent').textContent = `${waterPct}%`;

  renderWaterSection();
  renderMealsSection(dayLog.meals);
  renderWorkoutsSection();
  renderFoodDatabaseList();
}

function renderMealsSection(meals) {
  const dashContainer = document.getElementById('dashboard-meals-accordion');
  const detailedContainer = document.getElementById('detailed-meals-list');

  const categories = [
    { name: 'Café da Manhã', icon: '🌅' },
    { name: 'Almoço', icon: '🍲' },
    { name: 'Lanche da Tarde', icon: '🥪' },
    { name: 'Jantar', icon: '🍽️' },
    { name: 'Ceia / Lanche Noturno', icon: '🌙' }
  ];

  let dashHTML = '';
  let detailedHTML = '';

  categories.forEach(cat => {
    const catMeals = meals.filter(m => m.mealType === cat.name);
    let catCalories = 0;
    let catP = 0, catC = 0, catF = 0;

    catMeals.forEach(m => {
      catCalories += m.calories;
      catP += m.protein;
      catC += m.carbs;
      catF += m.fat;
    });

    const itemsHTML = catMeals.length === 0 
      ? `<p style="color: var(--text-muted); font-size: 0.8rem; padding: 6px 0;">Nenhum alimento nesta refeição.</p>`
      : catMeals.map(m => {
          const unit = m.unitSuffix || (m.portionType === '100ml' ? 'ml' : (m.portionType === 'unidade' ? 'unid' : 'g'));
          return `
            <div class="meal-food-row">
              <div class="food-row-left">
                <span class="food-row-name">${escapeHTML(m.foodName)}</span>
                <span class="food-row-portion">${m.quantity} ${unit} • <strong style="color: var(--primary);">${Math.round(m.calories)} kcal</strong></span>
                <div class="food-row-macros-chips">
                  <span class="mini-macro-badge p" title="Proteína">🥩 ${m.protein}g Prot</span>
                  <span class="mini-macro-badge c" title="Carboidratos">🍞 ${m.carbs}g Carb</span>
                  <span class="mini-macro-badge f" title="Gorduras">🥑 ${m.fat}g Gord</span>
                  ${m.fiber ? `<span class="mini-macro-badge" style="background: rgba(6,182,212,0.14); color: #38bdf8;" title="Fibras">🌾 ${m.fiber}g Fib</span>` : ''}
                </div>
              </div>
              <div class="food-row-right">
                <button type="button" class="btn-remove-food" data-meal-id="${m.id}" title="Remover alimento">✕</button>
              </div>
            </div>
          `;
        }).join('');

    dashHTML += `
      <div class="meal-slot">
        <div class="meal-slot-header">
          <div class="meal-title-group">
            <span class="meal-slot-icon">${cat.icon}</span>
            <span class="meal-slot-name">${cat.name}</span>
          </div>
          <span class="meal-slot-kcal">${Math.round(catCalories)} kcal</span>
        </div>
        <div class="meal-items-list">
          ${itemsHTML}
        </div>
      </div>
    `;

    detailedHTML += `
      <article class="section-card">
        <div class="section-header">
          <div class="meal-title-group">
            <span class="meal-slot-icon">${cat.icon}</span>
            <div>
              <h3>${cat.name}</h3>
              <div style="display: flex; gap: 4px; margin-top: 4px;">
                <span class="mini-macro-badge p">🥩 ${catP.toFixed(1)}g Prot</span>
                <span class="mini-macro-badge c">🍞 ${catC.toFixed(1)}g Carb</span>
                <span class="mini-macro-badge f">🥑 ${catF.toFixed(1)}g Gord</span>
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <strong style="color: var(--primary); font-size: 1.15rem;">${Math.round(catCalories)} kcal</strong>
            <button type="button" class="btn btn-outline-primary btn-sm btn-add-food-to-cat" data-cat="${cat.name}">
              + Alimento
            </button>
          </div>
        </div>
        <div class="meal-items-list">
          ${itemsHTML}
        </div>
      </article>
    `;
  });

  if (dashContainer) dashContainer.innerHTML = dashHTML;
  if (detailedContainer) detailedContainer.innerHTML = detailedHTML;

  document.querySelectorAll('.btn-remove-food').forEach(btn => {
    btn.addEventListener('click', () => {
      const mealId = btn.dataset.mealId;
      const dayLog = getDayLog(state.currentDate);
      dayLog.meals = dayLog.meals.filter(m => m.id !== mealId);
      saveDailyLogs();
      renderAll();
    });
  });

  document.querySelectorAll('.btn-add-food-to-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('select-meal-type').value = btn.dataset.cat;
      startMealLoggingWithFood(null);
    });
  });
}

function renderWaterSection() {
  const dayLog = getDayLog(state.currentDate);
  let totalWater = 0;
  dayLog.water.forEach(w => { totalWater += w.amount; });

  const pct = Math.min(100, Math.round((totalWater / state.settings.goalWater) * 100));

  const bottleAmount = document.getElementById('bottle-water-amount');
  const bottlePct = document.getElementById('bottle-water-pct');
  const bottleFill = document.getElementById('bottle-water-fill');

  if (bottleAmount) bottleAmount.textContent = totalWater;
  if (bottlePct) bottlePct.textContent = `${pct}% da meta (${state.settings.goalWater}ml)`;
  if (bottleFill) bottleFill.style.height = `${pct}%`;

  const historyList = document.getElementById('water-log-list');
  if (historyList) {
    if (dayLog.water.length === 0) {
      historyList.innerHTML = `<li style="color: var(--text-muted); font-size: 0.85rem; padding: 12px 0;">Nenhum registro de água hoje ainda.</li>`;
    } else {
      historyList.innerHTML = dayLog.water.map(item => `
        <li class="water-log-item">
          <div>
            <span class="log-amount">+${item.amount} ml</span>
            <span class="log-time">às ${item.timestamp}</span>
          </div>
          <button type="button" class="btn-remove-food" data-water-id="${item.id}" title="Remover registro">✕</button>
        </li>
      `).join('');

      historyList.querySelectorAll('.btn-remove-food').forEach(btn => {
        btn.addEventListener('click', () => {
          removeWaterIntake(btn.dataset.waterId);
        });
      });
    }
  }
}

function renderWorkoutsSection() {
  const dayLog = getDayLog(state.currentDate);
  const container = document.getElementById('workout-sessions-list');
  const preview = document.getElementById('dash-workout-preview');
  const countLabel = document.getElementById('today-workouts-count');

  if (countLabel) {
    countLabel.textContent = dayLog.workouts.length;
  }

  let totalCaloriesBurned = 0;
  dayLog.workouts.forEach(w => {
    totalCaloriesBurned += (w.caloriesBurned || 0);
  });

  if (preview) {
    if (dayLog.workouts.length === 0) {
      preview.innerHTML = `
        <p class="empty-hint">Nenhum treino registrado hoje ainda.</p>
        <button type="button" class="btn btn-outline-primary btn-sm" id="btn-dash-add-workout-dyn">+ Registrar Treino</button>
      `;
      document.getElementById('btn-dash-add-workout-dyn')?.addEventListener('click', () => openWorkoutModal(null));
    } else {
      preview.innerHTML = `
        <div style="text-align: left; width: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 0.8rem; color: var(--text-muted);">Gasto em Treinos:</span>
            <strong style="color: #c4b5fd;">🔥 ~${totalCaloriesBurned} kcal</strong>
          </div>
          ${dayLog.workouts.map(w => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--border-subtle);">
              <div>
                <strong>${escapeHTML(w.title)}</strong>
                <small style="color: var(--text-muted); display: block;">${w.duration} min • ~${w.caloriesBurned || 0} kcal</small>
              </div>
              <span class="meta-pill purple">Concluído</span>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  if (!container) return;

  if (dayLog.workouts.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 50px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <p style="color: var(--text-muted); margin-bottom: 16px;">Você ainda não registrou nenhum treino para este dia.</p>
        <button type="button" class="btn btn-primary" id="btn-empty-add-workout">+ Registrar Treino de Hoje</button>
      </div>
    `;
    document.getElementById('btn-empty-add-workout')?.addEventListener('click', () => openWorkoutModal(null));
    return;
  }

  container.innerHTML = dayLog.workouts.map(w => `
    <article class="workout-card">
      <div class="workout-card-header">
        <div>
          <h3 class="workout-name">${escapeHTML(w.title)}</h3>
          <div class="workout-meta-pills">
            <span class="meta-pill">⏱️ ${w.duration} min</span>
            <span class="meta-pill purple">🔥 ~${w.caloriesBurned || 0} kcal (Compêndio Oficial)</span>
            <span class="meta-pill">Registrado às ${w.timestamp}</span>
          </div>
        </div>
        <button type="button" class="btn-danger-text btn-delete-workout" data-workout-id="${w.id}">
          Excluir
        </button>
      </div>

      ${w.exercises && w.exercises.length > 0 ? `
        <table class="workout-exercise-table">
          <thead>
            <tr>
              <th>Exercício</th>
              <th>Séries</th>
              <th>Reps</th>
              <th>Carga</th>
            </tr>
          </thead>
          <tbody>
            ${w.exercises.map(ex => `
              <tr>
                <td><strong>${escapeHTML(ex.name)}</strong></td>
                <td>${ex.sets}</td>
                <td>${escapeHTML(ex.reps)}</td>
                <td>${escapeHTML(ex.weight)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<p style="color: var(--text-muted); font-size: 0.85rem;">Treino aeróbico / contínuo registrado sem detalhamento de séries.</p>'}

      ${w.notes ? `<div class="workout-notes-box">📝 <em>${escapeHTML(w.notes)}</em></div>` : ''}
    </article>
  `).join('');

  container.querySelectorAll('.btn-delete-workout').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.workoutId;
      if (confirm('Deseja excluir este treino?')) {
        dayLog.workouts = dayLog.workouts.filter(w => w.id !== id);
        saveDailyLogs();
        renderAll();
      }
    });
  });
}

// ============================================================================
// UTILITIES (Toast, XSS Escaping)
// ============================================================================
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(message) {
  let toast = document.getElementById('fitpulse-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'fitpulse-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: calc(var(--bottom-nav-height) + 16px);
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #1f2937;
      border: 1px solid var(--border-color);
      color: #fff;
      padding: 10px 20px;
      border-radius: 9999px;
      font-size: 0.88rem;
      font-weight: 600;
      box-shadow: var(--shadow-lg);
      z-index: 200;
      opacity: 0;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
      white-space: nowrap;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3200);
}
