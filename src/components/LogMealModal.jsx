import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Search, 
  Check, 
  Flame, 
  Beef, 
  Wheat, 
  Droplet, 
  Star, 
  Plus, 
  Minus, 
  Sparkles,
  Scale
} from 'lucide-react';
import { 
  searchFoodDatabase, 
  calculateNutritionalValues, 
  getHouseholdMeasuresForFood 
} from '../data/foodDb.js';
import { getFavoriteFoodIds, toggleFavoriteFoodId } from '../utils/favorites.js';

export default function LogMealModal({
  foodDatabase = [],
  initialFood,
  initialMealType = 'Almoço',
  onClose,
  onSaveMeal
}) {
  const [mealType, setMealType] = useState(initialMealType);
  const [selectedFood, setSelectedFood] = useState(initialFood);
  const [searchQuery, setSearchQuery] = useState(initialFood ? initialFood.name : '');
  const [unitMode, setUnitMode] = useState('g');
  const [quantity, setQuantity] = useState(100);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(() => getFavoriteFoodIds());

  useEffect(() => {
    const handleSync = (e) => {
      if (Array.isArray(e.detail)) setFavoriteIds(e.detail);
    };
    window.addEventListener('fitpulse_favorites_changed', handleSync);
    return () => window.removeEventListener('fitpulse_favorites_changed', handleSync);
  }, []);

  const handleToggleFav = (foodId) => {
    const updated = toggleFavoriteFoodId(foodId);
    setFavoriteIds(updated);
  };

  // Medidas caseiras disponíveis para o alimento atual
  const availableMeasures = useMemo(() => {
    return getHouseholdMeasuresForFood(selectedFood);
  }, [selectedFood]);

  useEffect(() => {
    if (initialFood) {
      setSelectedFood(initialFood);
      setSearchQuery(initialFood.name);
      const measures = getHouseholdMeasuresForFood(initialFood);
      if (initialFood.portionType === 'unidade') {
        setUnitMode('unidade');
        setQuantity(1);
      } else if (initialFood.portionType === '100ml') {
        setUnitMode('ml');
        setQuantity(200);
      } else {
        setUnitMode(measures[0]?.id || 'g');
        setQuantity(initialFood.portionWeight || 100);
      }
    }
  }, [initialFood]);

  // Lista dos alimentos favoritos do usuário
  const favoriteFoods = useMemo(() => {
    if (!Array.isArray(foodDatabase)) return [];
    const favSet = new Set(favoriteIds);
    return foodDatabase.filter((f) => favSet.has(f.id)).slice(0, 12);
  }, [foodDatabase, favoriteIds]);

  const searchResults = searchQuery.trim()
    ? searchFoodDatabase(foodDatabase, searchQuery, 'all', 'all').slice(0, 8)
    : [];

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setSearchQuery(food.name);
    setIsDropdownOpen(false);

    const measures = getHouseholdMeasuresForFood(food);
    if (food.portionType === 'unidade') {
      setUnitMode('unidade');
      setQuantity(1);
    } else if (food.portionType === '100ml') {
      setUnitMode('ml');
      setQuantity(200);
    } else if (measures.length > 1 && measures[1].id === 'colher_sopa') {
      // Se tiver colher de sopa prática, mantém g ou sugere a primeira
      setUnitMode('g');
      setQuantity(food.portionWeight || 100);
    } else {
      setUnitMode(measures[0]?.id || 'g');
      setQuantity(food.portionWeight || 100);
    }
  };

  const handleSwitchMeasure = (measureId) => {
    setUnitMode(measureId);
    if (measureId === 'g' || measureId === 'ml') {
      setQuantity(100);
    } else if (measureId === 'unidade') {
      setQuantity(1);
    } else if (measureId === 'colher_sopa') {
      setQuantity(2);
    } else if (measureId === 'colher_cha') {
      setQuantity(1);
    } else if (measureId === 'concha') {
      setQuantity(1);
    } else if (measureId === 'fatia') {
      setQuantity(2);
    } else if (measureId === 'scoop') {
      setQuantity(1);
    } else if (measureId === 'file_medio') {
      setQuantity(1);
    } else {
      setQuantity(1);
    }
  };

  const adjustQuantity = (delta) => {
    const current = parseFloat(quantity) || 0;
    const next = Math.max(0.1, Number((current + delta).toFixed(1)));
    setQuantity(next);
  };

  const calculated = selectedFood
    ? calculateNutritionalValues(selectedFood, parseFloat(quantity) || 0, unitMode)
    : { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, equivalentGrams: 0 };

  const currentMeasureObj = availableMeasures.find((m) => m.id === unitMode);
  const currentMeasureLabel = currentMeasureObj?.shortLabel || unitMode;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFood) {
      alert('Por favor, selecione um alimento da tabela antes de salvar.');
      return;
    }

    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      alert('Informe uma quantidade válida.');
      return;
    }

    const entry = {
      id: 'meal_item_' + Date.now(),
      mealType,
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      portionType: selectedFood.portionType,
      unitMode,
      unitSuffix: currentMeasureLabel,
      quantity: qty,
      equivalentGrams: calculated.equivalentGrams || Math.round(qty),
      calories: calculated.calories,
      protein: calculated.protein,
      carbs: calculated.carbs,
      fat: calculated.fat,
      fiber: calculated.fiber,
      source: selectedFood.source || 'TACO / UNICAMP',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    onSaveMeal(entry);
    onClose();
  };

  const isSelectedFav = selectedFood ? favoriteIds.includes(selectedFood.id) : false;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto modal-backdrop-anim">
      <div className="bg-[#181a20] border border-white/[0.08] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden my-auto modal-content-anim">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100">Registrar Alimento</h2>
              <p className="text-[10px] text-zinc-400">Medidas caseiras práticas ou pesagem precisa</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#131418] hover:bg-white/[0.06] text-zinc-400 hover:text-white flex items-center justify-center border border-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          {/* Meal type selector */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Refeição de destino:</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full bg-[#131418] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500/50"
            >
              <option value="Café da Manhã">Café da Manhã</option>
              <option value="Almoço">Almoço</option>
              <option value="Lanche da Tarde">Lanche da Tarde</option>
              <option value="Jantar">Jantar</option>
              <option value="Ceia / Lanche Noturno">Ceia / Lanche Noturno</option>
              <option value="Snacks/Outros">Snacks / Outros</option>
            </select>
          </div>

          {/* Quick Favorites Row (when not typing) */}
          {favoriteFoods.length > 0 && !selectedFood && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>Seus Alimentos Frequentes:</span>
                </span>
                <span className="text-[10px] text-zinc-500">1-clique para escolher</span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {favoriteFoods.map((fav) => (
                  <button
                    key={fav.id}
                    type="button"
                    onClick={() => handleSelectFood(fav)}
                    className="px-2.5 py-1.5 rounded-xl bg-[#131418] hover:bg-amber-500/10 border border-white/[0.06] hover:border-amber-500/30 text-[11px] font-medium text-zinc-300 hover:text-amber-200 whitespace-nowrap shrink-0 transition-all text-left flex items-center gap-1.5"
                  >
                    <span>{fav.name.split(',')[0]}</span>
                    <small className="text-[9px] text-zinc-500">{Math.round(fav.calories)} kcal</small>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Food Search Autocomplete */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-zinc-300 block">Alimento da Tabela Oficial:</label>
              {selectedFood && (
                <button
                  type="button"
                  onClick={() => handleToggleFav(selectedFood.id)}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-400 transition-colors"
                >
                  <Star className={`w-3.5 h-3.5 ${isSelectedFav ? 'fill-amber-400 text-amber-400' : 'text-zinc-500'}`} />
                  <span>{isSelectedFav ? 'Favoritado' : 'Favoritar'}</span>
                </button>
              )}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar ex: peito de frango, arroz, pao francês, whey..."
                value={searchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                  if (selectedFood && selectedFood.name !== e.target.value) {
                    setSelectedFood(null);
                  }
                }}
                className="w-full bg-[#131418] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            {/* Dropdown list */}
            {isDropdownOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-[#131418] border border-white/[0.08] rounded-xl shadow-xl max-h-52 overflow-y-auto z-20 divide-y divide-white/[0.04]">
                {searchResults.map((food) => {
                  const isFav = favoriteIds.includes(food.id);
                  return (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => handleSelectFood(food)}
                      className="w-full text-left p-2.5 hover:bg-white/[0.04] text-xs transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <Star className={`w-3 h-3 ${isFav ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`} />
                        <div>
                          <strong className="text-zinc-200 group-hover:text-emerald-400 block transition-colors">
                            {food.name}
                          </strong>
                          <span className="text-[10px] text-zinc-400">
                            {Math.round(food.calories)} kcal • {food.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 text-[10px] font-semibold">
                        <span className="text-sky-400">P:{food.protein}</span>
                        <span className="text-amber-400">C:{food.carbs}</span>
                        <span className="text-rose-400">G:{food.fat}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Household Measures Selector Pills */}
          {selectedFood && availableMeasures.length > 1 && (
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Escolha a forma de medir:
              </label>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {availableMeasures.map((measure) => {
                  const isSelected = unitMode === measure.id;
                  return (
                    <button
                      key={measure.id}
                      type="button"
                      onClick={() => handleSwitchMeasure(measure.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap shrink-0 flex items-center gap-1 ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-xs'
                          : 'bg-[#131418] text-zinc-400 border-white/[0.06] hover:text-zinc-200 hover:border-white/10'
                      }`}
                    >
                      <span>{measure.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Input with Quick Inc/Dec */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-zinc-300">
                Quantidade em <span className="text-emerald-400 font-bold">{currentMeasureLabel}</span>:
              </label>
              {calculated.equivalentGrams > 0 && unitMode !== 'g' && unitMode !== 'ml' && (
                <span className="text-[11px] text-zinc-400 font-medium">
                  Equivale a <strong className="text-zinc-200 font-bold">~{calculated.equivalentGrams}g</strong>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustQuantity(unitMode === 'g' || unitMode === 'ml' ? -25 : -0.5)}
                className="w-10 h-10 rounded-xl bg-[#131418] hover:bg-white/[0.06] border border-white/[0.08] text-zinc-300 hover:text-white flex items-center justify-center text-sm font-bold transition-all shrink-0"
                title="Diminuir"
              >
                <Minus className="w-4 h-4" />
              </button>

              <input
                type="number"
                min="0.1"
                max="5000"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="flex-1 bg-[#131418] border border-white/[0.08] rounded-xl px-3 py-2 text-center text-base font-extrabold text-zinc-100 focus:outline-none focus:border-emerald-500/50"
              />

              <button
                type="button"
                onClick={() => adjustQuantity(unitMode === 'g' || unitMode === 'ml' ? 25 : 0.5)}
                className="w-10 h-10 rounded-xl bg-[#131418] hover:bg-white/[0.06] border border-white/[0.08] text-zinc-300 hover:text-white flex items-center justify-center text-sm font-bold transition-all shrink-0"
                title="Aumentar"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Increment Preset Chips */}
            <div className="flex gap-1.5 mt-2 justify-center">
              {unitMode === 'g' || unitMode === 'ml' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setQuantity(50)}
                    className="px-2 py-1 rounded-lg bg-[#131418] hover:bg-white/[0.08] text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 border border-white/[0.05]"
                  >
                    50g
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantity(100)}
                    className="px-2 py-1 rounded-lg bg-[#131418] hover:bg-white/[0.08] text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 border border-white/[0.05]"
                  >
                    100g
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantity(150)}
                    className="px-2 py-1 rounded-lg bg-[#131418] hover:bg-white/[0.08] text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 border border-white/[0.05]"
                  >
                    150g
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantity(200)}
                    className="px-2 py-1 rounded-lg bg-[#131418] hover:bg-white/[0.08] text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 border border-white/[0.05]"
                  >
                    200g
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustQuantity(50)}
                    className="px-2 py-1 rounded-lg bg-[#131418] hover:bg-white/[0.08] text-[10px] font-semibold text-emerald-400 border border-emerald-500/20"
                  >
                    +50g
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setQuantity(1)}
                    className="px-2.5 py-1 rounded-lg bg-[#131418] hover:bg-white/[0.08] text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 border border-white/[0.05]"
                  >
                    1 {currentMeasureLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantity(2)}
                    className="px-2.5 py-1 rounded-lg bg-[#131418] hover:bg-white/[0.08] text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 border border-white/[0.05]"
                  >
                    2 {currentMeasureLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantity(3)}
                    className="px-2.5 py-1 rounded-lg bg-[#131418] hover:bg-white/[0.08] text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 border border-white/[0.05]"
                  >
                    3 {currentMeasureLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustQuantity(1)}
                    className="px-2.5 py-1 rounded-lg bg-[#131418] hover:bg-white/[0.08] text-[10px] font-semibold text-emerald-400 border border-emerald-500/20"
                  >
                    +1 {currentMeasureLabel}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Live Calculated Nutritional Breakdown */}
          <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3 text-center space-y-1.5 shadow-inner">
            <span className="text-[11px] font-semibold text-zinc-400 block">Total calculado para esta porção:</span>
            <div className="flex items-center justify-center gap-1">
              <span className="text-2xl font-extrabold text-emerald-400">{calculated.calories}</span>
              <span className="text-xs text-zinc-400 font-bold">kcal</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-xs pt-1.5 border-t border-white/[0.05]">
              <span className="text-sky-400 font-semibold text-[11px] flex items-center gap-1">
                <Beef className="w-2.5 h-2.5" /> {calculated.protein}g P
              </span>
              <span className="text-amber-400 font-semibold text-[11px] flex items-center gap-1">
                <Wheat className="w-2.5 h-2.5" /> {calculated.carbs}g C
              </span>
              <span className="text-rose-400 font-semibold text-[11px] flex items-center gap-1">
                <Droplet className="w-2.5 h-2.5" /> {calculated.fat}g G
              </span>
              {calculated.fiber > 0 && (
                <span className="text-zinc-300 font-semibold text-[11px]">
                  {calculated.fiber}g Fib
                </span>
              )}
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#131418] hover:bg-white/[0.06] text-zinc-300 rounded-xl text-xs font-semibold border border-white/[0.06]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedFood}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Salvar na Refeição</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
