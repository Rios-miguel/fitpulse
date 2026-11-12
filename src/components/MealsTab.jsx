import React from 'react';
import { 
  Coffee, 
  Soup, 
  Sandwich, 
  UtensilsCrossed, 
  Moon, 
  Plus, 
  X, 
  Beef, 
  Wheat, 
  Droplet 
} from 'lucide-react';

export default function MealsTab({ dailyLog, onOpenLogMeal, onRemoveMealItem }) {
  const meals = dailyLog.meals || [];

  const categories = [
    { name: 'Café da Manhã', icon: Coffee, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { name: 'Almoço', icon: Soup, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { name: 'Lanche da Tarde', icon: Sandwich, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { name: 'Jantar', icon: UtensilsCrossed, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { name: 'Ceia / Lanche Noturno', icon: Moon, color: 'text-purple-400', bg: 'bg-purple-500/10' }
  ];

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Diário Alimentar</h2>
          <p className="text-xs text-zinc-400">Registre suas refeições e acompanhe seus macronutrientes.</p>
        </div>
        <button
          type="button"
          onClick={() => onOpenLogMeal(null, 'Almoço')}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Alimento</span>
        </button>
      </div>

      {/* Categories Cards */}
      {categories.map((cat) => {
        const Icon = cat.icon;
        const catMeals = meals.filter((m) => m.mealType === cat.name);
        const catCalories = Math.round(catMeals.reduce((acc, m) => acc + (m.calories || 0), 0));
        const catP = Number(catMeals.reduce((acc, m) => acc + (m.protein || 0), 0).toFixed(1));
        const catC = Number(catMeals.reduce((acc, m) => acc + (m.carbs || 0), 0).toFixed(1));
        const catF = Number(catMeals.reduce((acc, m) => acc + (m.fat || 0), 0).toFixed(1));

        return (
          <article
            key={cat.name}
            className="bg-[#181a20] border border-white/[0.07] rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg ${cat.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${cat.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 leading-tight">{cat.name}</h3>
                  <div className="flex items-center gap-2.5 mt-0.5">
                    <span className="text-[11px] font-semibold text-sky-400 flex items-center gap-1">
                      <Beef className="w-3 h-3 text-sky-400" /> {catP}g P
                    </span>
                    <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                      <Wheat className="w-3 h-3 text-amber-400" /> {catC}g C
                    </span>
                    <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                      <Droplet className="w-3 h-3 text-rose-400" /> {catF}g G
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <strong className="text-base font-extrabold text-emerald-400">{catCalories} kcal</strong>
                <button
                  type="button"
                  onClick={() => onOpenLogMeal(null, cat.name)}
                  className="px-2.5 py-1 bg-[#131418] hover:bg-white/[0.06] text-zinc-300 hover:text-white border border-white/[0.06] rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Alimento</span>
                </button>
              </div>
            </div>

            {catMeals.length === 0 ? (
              <p className="text-xs text-zinc-500 py-3 text-center">Nenhum alimento registrado nesta refeição.</p>
            ) : (
              <div className="space-y-2">
                {catMeals.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#131418] border border-white/[0.05]"
                  >
                    <div>
                      <div className="font-semibold text-xs text-zinc-100">{item.foodName}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {item.quantity} {item.unitSuffix || 'g'}
                        {item.equivalentGrams && item.unitSuffix !== 'g' && item.unitSuffix !== 'ml' ? ` (~${item.equivalentGrams}g)` : ''} •{' '}
                        <strong className="text-emerald-400 font-semibold">{Math.round(item.calories)} kcal</strong>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1">
                          <Beef className="w-2.5 h-2.5" /> {item.protein}g P
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <Wheat className="w-2.5 h-2.5" /> {item.carbs}g C
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                          <Droplet className="w-2.5 h-2.5" /> {item.fat}g G
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveMealItem(item.id)}
                      className="w-7 h-7 rounded-lg hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 flex items-center justify-center transition-colors"
                      title="Remover este alimento"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
