import React, { useState } from 'react';
import { X, Settings, Download, Upload, RotateCcw, Check, Target, Droplets, Scale } from 'lucide-react';

export default function SettingsModal({
  settings,
  onSaveSettings,
  onExportBackup,
  onImportBackup,
  onResetFactory,
  onClose
}) {
  const [goalCalories, setGoalCalories] = useState(settings.goalCalories || 2000);
  const [goalProtein, setGoalProtein] = useState(settings.goalProtein || 150);
  const [goalCarbs, setGoalCarbs] = useState(settings.goalCarbs || 200);
  const [goalFat, setGoalFat] = useState(settings.goalFat || 60);
  const [goalWater, setGoalWater] = useState(settings.goalWater || 2500);
  const [userWeightKg, setUserWeightKg] = useState(settings.userWeightKg || 75);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings({
      goalCalories: parseInt(goalCalories, 10) || 2000,
      goalProtein: parseInt(goalProtein, 10) || 150,
      goalCarbs: parseInt(goalCarbs, 10) || 200,
      goalFat: parseInt(goalFat, 10) || 60,
      goalWater: parseInt(goalWater, 10) || 2500,
      userWeightKg: parseFloat(userWeightKg) || 75
    });
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto modal-backdrop-anim">
      <div className="bg-[#181a20] border border-white/[0.08] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col modal-content-anim">
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-emerald-400" />
            <span>Suas Metas Diárias & Dados</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#131418] hover:bg-white/[0.06] text-zinc-400 hover:text-white flex items-center justify-center border border-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Metas Nutricionais Diárias</span>
            </h3>
            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                  Meta Calórica Diária (kcal):
                </label>
                <input
                  type="number"
                  min="800"
                  max="6000"
                  step="50"
                  value={goalCalories}
                  onChange={(e) => setGoalCalories(e.target.value)}
                  required
                  className="w-full bg-[#131418] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-100 font-bold focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-zinc-300 block mb-1">Proteína (g)</label>
                  <input
                    type="number"
                    min="10"
                    max="400"
                    value={goalProtein}
                    onChange={(e) => setGoalProtein(e.target.value)}
                    required
                    className="w-full bg-[#131418] border border-white/[0.08] rounded-xl px-2 py-1.5 text-xs text-sky-400 font-bold focus:outline-none focus:border-sky-500/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-zinc-300 block mb-1">Carboidratos (g)</label>
                  <input
                    type="number"
                    min="10"
                    max="600"
                    value={goalCarbs}
                    onChange={(e) => setGoalCarbs(e.target.value)}
                    required
                    className="w-full bg-[#131418] border border-white/[0.08] rounded-xl px-2 py-1.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-zinc-300 block mb-1">Gorduras (g)</label>
                  <input
                    type="number"
                    min="10"
                    max="250"
                    value={goalFat}
                    onChange={(e) => setGoalFat(e.target.value)}
                    required
                    className="w-full bg-[#131418] border border-white/[0.08] rounded-xl px-2 py-1.5 text-xs text-rose-300 font-bold focus:outline-none focus:border-rose-500/50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06]">
            <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Meta de Hidratação</span>
            </h3>
            <div>
              <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                Meta de Água por Dia (ml):
              </label>
              <input
                type="number"
                min="1000"
                max="8000"
                step="100"
                value={goalWater}
                onChange={(e) => setGoalWater(e.target.value)}
                required
                className="w-full bg-[#131418] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-cyan-400 font-bold focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06]">
            <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-purple-400" />
              <span>Perfil Corporal para Queima Calórica</span>
            </h3>
            <div>
              <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                Seu Peso Corporal Atual (kg):
              </label>
              <input
                type="number"
                min="30"
                max="250"
                step="0.5"
                value={userWeightKg}
                onChange={(e) => setUserWeightKg(e.target.value)}
                required
                className="w-full bg-[#131418] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-purple-300 font-bold focus:outline-none focus:border-purple-500/50"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Usado pelo Compêndio Oficial: Calorias = MET × Peso × (Duração / 60).
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06] space-y-2">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Backup e Armazenamento</span>
            </h3>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={onExportBackup}
                className="w-full py-2 bg-[#131418] hover:bg-white/[0.06] text-zinc-200 border border-white/[0.06] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Exportar Backup Completo (JSON)</span>
              </button>

              <label className="w-full py-2 bg-[#131418] hover:bg-white/[0.06] text-zinc-200 border border-white/[0.06] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Importar Backup JSON</span>
                <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
              </label>

              <button
                type="button"
                onClick={onResetFactory}
                className="text-[11px] text-rose-400 hover:underline text-center pt-1"
              >
                Restaurar Dados Originais de Fábrica
              </button>
            </div>
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
              <span>Salvar Metas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
