import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Info, 
  Trash2, 
  BookOpen, 
  Egg, 
  CakeSlice, 
  Zap, 
  Milk, 
  Sparkles, 
  Utensils, 
  Soup, 
  Sandwich, 
  Beef, 
  Wheat, 
  Droplet,
  CircleDot, 
  Apple, 
  Fish, 
  Pill, 
  ChefHat, 
  Layers,
  Wine,
  Star
} from 'lucide-react';
import { searchFoodDatabase } from '../data/foodDb.js';
import { getFavoriteFoodIds, toggleFavoriteFoodId } from '../utils/favorites.js';

export default function FoodDbTab({
  foodDatabase = [],
  onOpenNewFood,
  onOpenRecipeDetails,
  onStartLogFood,
  onDeleteCustomFood
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [displayLimit, setDisplayLimit] = useState(40);
  const [favoriteIds, setFavoriteIds] = useState(() => getFavoriteFoodIds());

  useEffect(() => {
    const handleSync = (e) => {
      if (Array.isArray(e.detail)) {
        setFavoriteIds(e.detail);
      }
    };
    window.addEventListener('fitpulse_favorites_changed', handleSync);
    return () => window.removeEventListener('fitpulse_favorites_changed', handleSync);
  }, []);

  const handleToggleFavorite = (foodId) => {
    const updated = toggleFavoriteFoodId(foodId);
    setFavoriteIds(updated);
  };

  const safeDb = useMemo(() => {
    if (!Array.isArray(foodDatabase)) return [];
    return foodDatabase.filter((f) => f && typeof f === 'object');
  }, [foodDatabase]);

  const quickShortcuts = [
    { label: 'Pão com Ovo', query: 'pao com ovo', icon: Egg, color: 'text-amber-400' },
    { label: 'Pudim', query: 'pudim', icon: CakeSlice, color: 'text-pink-400' },
    { label: 'Shake Whey', query: 'shake whey', icon: Wine, color: 'text-cyan-400' },
    { label: 'Iogurte c/ Granola', query: 'iogurte', icon: Milk, color: 'text-blue-400' },
    { label: 'Crepioca', query: 'crepioca', icon: Sparkles, color: 'text-emerald-400' },
    { label: 'Prato Feito (PF)', query: 'prato feito', icon: Utensils, color: 'text-amber-400' },
    { label: 'Strogonoff', query: 'strogonoff', icon: Soup, color: 'text-orange-400' },
    { label: 'Marmita Fit', query: 'marmita fit', icon: ChefHat, color: 'text-emerald-400' },
    { label: 'Misto Quente', query: 'misto quente', icon: Sandwich, color: 'text-amber-400' },
    { label: 'Tapioca', query: 'tapioca', icon: Sparkles, color: 'text-yellow-400' },
    { label: 'Frango Grelhado', query: 'frango', icon: Beef, color: 'text-rose-400' },
    { label: 'Arroz', query: 'arroz', icon: Wheat, color: 'text-amber-400' },
    { label: 'Feijão', query: 'feijao', icon: CircleDot, color: 'text-emerald-400' },
    { label: 'Atum', query: 'atum', icon: Fish, color: 'text-cyan-400' },
    { label: 'Banana', query: 'banana', icon: Apple, color: 'text-yellow-400' },
    { label: 'Aveia', query: 'aveia', icon: Wheat, color: 'text-amber-400' }
  ];

  const categories = [
    { id: 'all', label: 'Todos', icon: Layers },
    { id: 'favorites', label: '⭐ Favoritos', icon: Star, badge: favoriteIds.length },
    { id: 'Receitas & Pratos Caseiros', label: 'Pratos Caseiros', icon: ChefHat },
    { id: 'Receitas Fitness', label: 'Receitas Fit', icon: Zap },
    { id: 'Lanches & Padaria', label: 'Lanches & Padaria', icon: Sandwich },
    { id: 'Shakes & Bebidas Fitness', label: 'Shakes & Whey', icon: Wine },
    { id: 'Carnes e Aves', label: 'Carnes & Aves', icon: Beef },
    { id: 'Cereais e Pães', label: 'Cereais & Pães', icon: Wheat },
    { id: 'Feijões e Leguminosas', label: 'Feijões', icon: CircleDot },
    { id: 'Frutas', label: 'Frutas', icon: Apple },
    { id: 'Ovos', label: 'Ovos', icon: Egg },
    { id: 'Laticínios', label: 'Laticínios', icon: Milk },
    { id: 'Peixes e Frutos do Mar', label: 'Peixes', icon: Fish },
    { id: 'Suplementos', label: 'Suplementos', icon: Pill }
  ];

  const filteredFoods = useMemo(() => {
    try {
      if (activeCategory === 'favorites') {
        const favSet = new Set(favoriteIds);
        const favFoods = safeDb.filter((f) => favSet.has(f.id));
        return searchFoodDatabase(favFoods, searchQuery, 'all', 'all');
      }
      return searchFoodDatabase(safeDb, searchQuery, activeCategory, 'all');
    } catch (e) {
      console.error('searchFoodDatabase error:', e);
      return safeDb;
    }
  }, [safeDb, searchQuery, activeCategory, favoriteIds]);

  const displayedFoods = useMemo(() => {
    return filteredFoods.slice(0, displayLimit);
  }, [filteredFoods, displayLimit]);

  const handleShortcutClick = (query) => {
    setSearchQuery(query);
    setDisplayLimit(40);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Banco Oficial de Alimentos</h2>
          <p className="text-xs text-zinc-400">Mais de 700 alimentos da Tabela TACO / UNICAMP e receitas populares.</p>
        </div>
        <button
          type="button"
          onClick={onOpenNewFood}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Alimento</span>
        </button>
      </div>

      {/* Official Scientific Source Banner */}
      <aside className="bg-gradient-to-r from-emerald-950/30 to-sky-950/20 border border-white/[0.08] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <strong className="text-xs font-semibold text-zinc-200 block leading-tight">
              Tabela Brasileira de Composição de Alimentos — TACO / UNICAMP & Receitas
            </strong>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Valores laboratoriais oficiais por 100g, 100ml ou unidades pesadas.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-[#131418] border border-white/[0.06] rounded-full text-zinc-300 whitespace-nowrap shadow-inner">
          {filteredFoods.length} Itens
        </span>
      </aside>

      {/* Quick Search Chips with Crisp Vector Icons */}
      <div>
        <span className="text-xs font-semibold text-zinc-400 block mb-2">Atalhos Populares:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin-green">
          {quickShortcuts.map((chip) => {
            const Icon = chip.icon;
            const isSelected = searchQuery.toLowerCase() === chip.query.toLowerCase();

            return (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleShortcutClick(chip.query)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                  isSelected
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-[#181a20] text-zinc-300 border-white/[0.07] hover:border-white/20 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${chip.color}`} />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          placeholder="Buscar prato ou alimento (ex: pão com ovo, whey, frango grelhado, arroz...)"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setDisplayLimit(40);
          }}
          className="w-full bg-[#181a20] border border-white/[0.07] rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-all"
        />
      </div>

      {/* Categories Filter Pills with Vector Icons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin-green">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                setDisplayLimit(40);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-semibold shadow-sm'
                  : 'bg-[#181a20] text-zinc-400 border-white/[0.07] hover:border-white/15 hover:text-zinc-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Food Cards Grid */}
      {displayedFoods.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center space-y-3">
          <p className="text-sm text-zinc-400">
            Nenhum alimento encontrado para "<strong>{searchQuery}</strong>".
          </p>
          <button
            type="button"
            onClick={onOpenNewFood}
            className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Novo Alimento</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayedFoods.map((food, idx) => {
            if (!food) return null;
            const foodId = food.id != null ? String(food.id) : `food_${idx}`;
            const isCustom = foodId.startsWith('custom_');
            const isRecipe = foodId.startsWith('rec_');
            const hasIngredients = Array.isArray(food.ingredients) && food.ingredients.length > 0;
            const calories = Math.round(Number(food.calories) || 0);
            const protein = Number(food.protein) || 0;
            const carbs = Number(food.carbs) || 0;
            const fat = Number(food.fat) || 0;
            const fiber = Number(food.fiber) || 0;

            let portionLabel = 'por 100g';
            if (food.portionType === '100ml') portionLabel = 'por 100ml';
            else if (food.portionType === 'unidade') {
              portionLabel = `por 1 unid${food.portionWeight ? ` (~${food.portionWeight}g)` : ''}`;
            } else if (food.hasUnitOption && food.portionWeight) {
              portionLabel = `100g • ou 1 unid (~${food.portionWeight}g)`;
            }

            const isFavorite = favoriteIds.includes(foodId);

            return (
              <article
                key={foodId}
                className="bg-[#181a20] border border-white/[0.07] hover:border-white/15 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-start gap-1.5 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(foodId);
                        }}
                        className="mt-0.5 p-1 -ml-1 rounded-lg hover:bg-white/[0.08] transition-colors shrink-0"
                        title={isFavorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-zinc-600 hover:text-amber-400'}`} />
                      </button>
                      <h3 className="text-xs font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors leading-snug">
                        {food.name || 'Alimento'}
                      </h3>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#131418] border border-white/[0.06] text-emerald-400 whitespace-nowrap">
                      {portionLabel}
                    </span>
                  </div>

                  {/* Badges row */}
                  <div className="flex items-center gap-1.5 mb-2">
                    {isCustom ? (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase tracking-wider">
                        Personalizado
                      </span>
                    ) : isRecipe ? (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase tracking-wider">
                        Receita Comum
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 uppercase tracking-wider">
                        TACO UNICAMP
                      </span>
                    )}
                    <span className="text-[11px] text-zinc-400 truncate">{food.category || 'Geral'}</span>
                  </div>

                  {food.notes && (
                    <p className="text-[11px] text-zinc-400 italic mb-2 line-clamp-2">
                      {food.notes}
                    </p>
                  )}

                  {/* Nutri Box with Clean Macro Pills */}
                  <div className="bg-[#131418] border border-white/[0.05] rounded-xl p-2.5 mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-extrabold text-emerald-400">
                        {calories} <small className="text-[10px] text-zinc-400 font-normal">kcal</small>
                      </span>
                      <small className="text-[10px] text-zinc-400">{portionLabel}</small>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1">
                        <Beef className="w-2.5 h-2.5" /> {protein}g P
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <Wheat className="w-2.5 h-2.5" /> {carbs}g C
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                        <Droplet className="w-2.5 h-2.5" /> {fat}g G
                      </span>
                      {fiber > 0 && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-white/[0.06]">
                          {fiber}g Fib
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1.5 pt-1">
                  {hasIngredients && (
                    <button
                      type="button"
                      onClick={() => onOpenRecipeDetails(food)}
                      className="px-2.5 py-1.5 bg-[#131418] hover:bg-amber-500/10 text-amber-300 border border-white/[0.06] hover:border-amber-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                      title="Ver receita completa, proporções e ingredientes"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Detalhes</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onStartLogFood(food)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-lg text-xs flex items-center gap-1 transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Consumir</span>
                  </button>

                  {isCustom && (
                    <button
                      type="button"
                      onClick={() => onDeleteCustomFood(foodId)}
                      className="w-8 h-8 rounded-lg hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 flex items-center justify-center transition-colors"
                      title="Excluir este alimento do banco"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Load More Button */}
      {filteredFoods.length > displayLimit && (
        <div className="text-center pt-3">
          <button
            type="button"
            onClick={() => setDisplayLimit((prev) => prev + 40)}
            className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-xl text-xs font-bold transition-all"
          >
            Carregar mais alimentos ({filteredFoods.length - displayLimit} restantes)...
          </button>
        </div>
      )}
    </div>
  );
}
