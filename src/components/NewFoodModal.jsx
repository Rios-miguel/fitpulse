import React, { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';

export default function NewFoodModal({ onClose, onSaveFood }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Proteínas');
  const [portionType, setPortionType] = useState('100g');
  const [unitWeight, setUnitWeight] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newFood = {
      id: 'custom_' + Date.now(),
      name: name.trim(),
      category,
      portionType,
      calories: Math.round(parseFloat(calories) || 0),
      protein: Number((parseFloat(protein) || 0).toFixed(1)),
      carbs: Number((parseFloat(carbs) || 0).toFixed(1)),
      fat: Number((parseFloat(fat) || 0).toFixed(1)),
      fiber: 0.0,
      source: 'Personalizado',
      notes: notes.trim() || undefined,
      portionWeight: portionType === 'unidade' && unitWeight ? parseFloat(unitWeight) : undefined,
      hasUnitOption: portionType === 'unidade'
    };

    onSaveFood(newFood);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto modal-backdrop-anim">
      <div className="bg-[#181a20] border border-white/[0.08] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden my-auto modal-content-anim">
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-100">Cadastrar Novo Alimento no Banco</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#131418] hover:bg-white/[0.06] text-zinc-400 hover:text-white flex items-center justify-center border border-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Nome do Alimento:</label>
            <input
              type="text"
              placeholder="Ex: Patinho moído, Banana da terra, Iogurte de kefir"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#131418] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Categoria:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#131418] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500/50"
            >
              <option value="Carnes e Aves">Carnes e Aves</option>
              <option value="Peixes e Frutos do Mar">Peixes e Frutos do Mar</option>
              <option value="Ovos">Ovos</option>
              <option value="Cereais e Pães">Cereais e Pães</option>
              <option value="Feijões e Leguminosas">Feijões e Leguminosas</option>
              <option value="Frutas">Frutas</option>
              <option value="Laticínios">Laticínios</option>
              <option value="Gorduras">Gorduras</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Suplementos">Suplementos</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Como este alimento é medido como padrão?</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: '100g', label: '100 gramas' },
                { id: '100ml', label: '100 ml' },
                { id: 'unidade', label: '1 Unidade' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPortionType(p.id)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                    portionType === p.id
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                      : 'bg-[#131418] text-zinc-400 border-white/[0.07] hover:text-zinc-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {portionType === 'unidade' && (
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Peso de 1 unidade em gramas (opcional):
              </label>
              <input
                type="number"
                min="1"
                placeholder="Ex: 50 para ovo, 70 para banana"
                value={unitWeight}
                onChange={(e) => setUnitWeight(e.target.value)}
                className="w-full bg-[#131418] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          )}

          {/* Nutritional Values Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Calorias (kcal) *</label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                required
                className="w-full bg-[#131418] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Proteína (g) *</label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                required
                className="w-full bg-[#131418] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-sky-400 font-bold focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Carboidratos (g) *</label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                required
                className="w-full bg-[#131418] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Gorduras (g) *</label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                required
                className="w-full bg-[#131418] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-rose-300 font-bold focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Observações / Marca (opcional):</label>
            <input
              type="text"
              placeholder="Ex: Cozido sem óleo / Marca X"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#131418] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#131418] hover:bg-white/[0.06] text-zinc-300 rounded-xl text-xs font-semibold border border-white/[0.06]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Salvar no Banco</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
