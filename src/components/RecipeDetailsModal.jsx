import React from 'react';
import { X, Flame, Beef, Wheat, Droplet, ChefHat, Info, UtensilsCrossed } from 'lucide-react';

export default function RecipeDetailsModal({ recipe, onClose, onConsume }) {
  if (!recipe) return null;

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

  const ingredients = recipe.ingredients || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto modal-backdrop-anim">
      <div className="bg-[#181a20] border border-white/[0.08] rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto modal-content-anim">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.06] flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase tracking-wider flex items-center gap-1">
                <ChefHat className="w-3 h-3" /> Receita & Mistura
              </span>
              <span className="text-xs text-zinc-400">{recipe.category}</span>
            </div>
            <h2 className="text-base font-bold text-zinc-100 leading-snug">{recipe.name}</h2>
            <span className="text-xs text-zinc-400">
              {recipe.portionWeight ? `Porção média de ~${recipe.portionWeight}g` : 'Porção de referência'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#131418] hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center border border-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Big Macro Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Calories */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-400 mb-0.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Calorias</span>
              </div>
              <span className="text-2xl font-extrabold text-emerald-400 block leading-tight">
                {Math.round(recipe.calories)}
              </span>
              <small className="text-[10px] text-zinc-400">kcal</small>
            </div>

            {/* Protein */}
            <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-sky-400 mb-0.5">
                <Beef className="w-3.5 h-3.5" />
                <span>Proteínas</span>
              </div>
              <span className="text-2xl font-extrabold text-sky-400 block leading-tight">
                {recipe.protein}
              </span>
              <small className="text-[10px] text-zinc-400">gramas</small>
            </div>

            {/* Carbs */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-amber-300 mb-0.5">
                <Wheat className="w-3.5 h-3.5" />
                <span>Carboidratos</span>
              </div>
              <span className="text-2xl font-extrabold text-amber-300 block leading-tight">
                {recipe.carbs}
              </span>
              <small className="text-[10px] text-zinc-400">gramas</small>
            </div>

            {/* Fat */}
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-rose-300 mb-0.5">
                <Droplet className="w-3.5 h-3.5" />
                <span>Gorduras</span>
              </div>
              <span className="text-2xl font-extrabold text-rose-300 block leading-tight">
                {recipe.fat}
              </span>
              <small className="text-[10px] text-zinc-400">gramas</small>
            </div>
          </div>

          {/* Macro Caloric Distribution Bar */}
          <div className="bg-[#131418] border border-white/[0.05] rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-400 text-[11px]">Distribuição Calórica:</span>
              <div className="flex items-center gap-3 text-[11px] font-semibold">
                <span className="text-sky-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" /> Prot {pctP}%
                </span>
                <span className="text-amber-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Carb {pctC}%
                </span>
                <span className="text-rose-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" /> Gord {pctF}%
                </span>
              </div>
            </div>

            <div className="w-full h-2 bg-[#101216] rounded-full overflow-hidden flex">
              <div className="bg-sky-400 h-full transition-all" style={{ width: `${pctP}%` }} title="Proteínas" />
              <div className="bg-amber-400 h-full transition-all" style={{ width: `${pctC}%` }} title="Carboidratos" />
              <div className="bg-rose-400 h-full transition-all" style={{ width: `${pctF}%` }} title="Gorduras" />
            </div>
          </div>

          {/* Recipe Notes */}
          {recipe.notes && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2 text-xs">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block font-semibold mb-0.5">Modo de Preparo / Detalhes:</strong>
                <p className="text-zinc-300">{recipe.notes}</p>
              </div>
            </div>
          )}

          {/* Ingredients Breakdown Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-zinc-200">Ingredientes da Receita</h4>
              <span className="text-[11px] text-zinc-400 font-semibold px-2 py-0.5 rounded-full bg-[#131418] border border-white/[0.05]">
                {ingredients.length} item(ns)
              </span>
            </div>

            {ingredients.length === 0 ? (
              <p className="text-xs text-zinc-500 py-3 text-center">Ingredientes específicos não detalhados.</p>
            ) : (
              <div className="border border-white/[0.06] rounded-xl overflow-hidden overflow-x-auto scrollbar-thin-green">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#131418] text-zinc-400 border-b border-white/[0.06] text-[10px] uppercase font-bold tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Ingrediente</th>
                      <th className="py-2.5 px-3">Quantidade</th>
                      <th className="py-2.5 px-3 text-right">Kcal</th>
                      <th className="py-2.5 px-3 text-right">P / C / G</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] bg-[#181a20]">
                    {ingredients.map((ing, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-2 px-3 font-semibold text-zinc-100">{ing.name}</td>
                        <td className="py-2 px-3 text-zinc-400">{ing.amount}</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-400">{ing.calories} kcal</td>
                        <td className="py-2 px-3 text-right whitespace-nowrap">
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 mr-1 border border-sky-500/20">
                            {ing.protein}g P
                          </span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 mr-1 border border-amber-500/20">
                            {ing.carbs}g C
                          </span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            {ing.fat}g G
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.06] bg-[#131418] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#181a20] hover:bg-white/[0.06] text-zinc-300 rounded-xl text-xs font-semibold border border-white/[0.06] transition-colors"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onConsume(recipe);
            }}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Consumir esta Receita</span>
          </button>
        </div>
      </div>
    </div>
  );
}
