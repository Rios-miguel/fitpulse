import React, { useState } from 'react';
import { 
  Dumbbell, 
  Search, 
  Plus, 
  Trash2, 
  Zap, 
  Activity, 
  Award 
} from 'lucide-react';
import { COMPENDIUM_EXERCISES, searchExercises, calculateExerciseCalories } from '../data/exercisesDb.js';

export default function WorkoutsTab({
  dailyLog,
  settings,
  onOpenAddWorkout,
  onRemoveWorkout
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const workouts = dailyLog.workouts || [];
  const userWeight = settings.userWeightKg || 75;
  const totalBurned = Math.round(workouts.reduce((acc, w) => acc + (w.caloriesBurned || 0), 0));

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'Musculação & Força', label: 'Musculação' },
    { id: 'Corrida & Caminhada', label: 'Corrida / Caminhada' },
    { id: 'Ciclismo & Natação', label: 'Ciclismo / Natação' },
    { id: 'Lutas & Esportes', label: 'Lutas & Esportes' },
    { id: 'Mente & Flexibilidade', label: 'Pilates / Alongamento' }
  ];

  const filteredExercises = searchExercises(searchQuery, activeCategory);

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Registro de Treinos</h2>
          <p className="text-xs text-zinc-400">
            Compêndio de Atividades Físicas 2024 (Ainsworth/Stanford) • Baseado em {userWeight}kg.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenAddWorkout(null)}
          className="flex items-center gap-1.5 bg-purple-500 hover:bg-purple-400 text-white font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-md shadow-purple-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Treino</span>
        </button>
      </div>

      {/* Burned Today Hero Banner */}
      <aside className="bg-gradient-to-r from-purple-950/30 to-indigo-950/20 border border-white/[0.08] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Zap className="w-4 h-4 text-purple-400 fill-purple-400/20" />
          </div>
          <div>
            <strong className="text-xs font-semibold text-zinc-200 block leading-tight">
              Gasto Calórico Estimado de Hoje
            </strong>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Fórmula científica oficial: MET × Peso ({userWeight}kg) × (Duração / 60)
            </p>
          </div>
        </div>
        <span className="text-base font-bold text-purple-300 bg-[#131418] border border-white/[0.06] px-3.5 py-1 rounded-full whitespace-nowrap shadow-inner">
          {totalBurned} kcal
        </span>
      </aside>

      {/* Today's Logged Workouts List */}
      {workouts.length > 0 && (
        <section className="bg-[#181a20] border border-white/[0.07] rounded-2xl p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-zinc-200">Treinos Concluídos Hoje ({workouts.length})</h3>

          <div className="space-y-2">
            {workouts.map((w) => (
              <div
                key={w.id}
                className="bg-[#131418] border border-white/[0.05] rounded-xl p-3 flex items-start justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Dumbbell className="w-4 h-4 text-purple-400 shrink-0" />
                    <strong className="text-xs font-bold text-zinc-100">{w.title}</strong>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {w.durationMinutes} min • {w.caloriesBurned} kcal
                    </span>
                    {w.totalVolumeKg > 0 && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Vol: {w.totalVolumeKg.toLocaleString('pt-BR')} kg levantados
                      </span>
                    )}
                  </div>

                  {w.notes && (
                    <p className="text-[11px] text-zinc-400 italic mt-1 pl-6">
                      "{w.notes}"
                    </p>
                  )}

                  {w.exercises && w.exercises.length > 0 && (
                    <div className="mt-2.5 pl-6 space-y-1.5">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        Exercícios & Séries Registradas ({w.exercises.length}):
                      </span>
                      <div className="space-y-1.5">
                        {w.exercises.map((ex, idx) => {
                          const isArraySets = Array.isArray(ex.sets);
                          return (
                            <div key={idx} className="bg-[#181a20] p-2 rounded-xl border border-white/[0.05] space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <strong className="text-zinc-200">{ex.name}</strong>
                                {ex.volumeKg ? (
                                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                    Vol: {ex.volumeKg.toLocaleString('pt-BR')} kg
                                  </span>
                                ) : null}
                              </div>

                              {isArraySets ? (
                                <div className="flex flex-wrap gap-1 pt-0.5">
                                  {ex.sets.map((s, sIdx) => (
                                    <span
                                      key={sIdx}
                                      className="text-[10px] font-medium bg-[#131418] border border-white/[0.06] px-2 py-0.5 rounded-lg text-zinc-300 flex items-center gap-1"
                                    >
                                      <span className="text-zinc-500 font-bold">{s.setNumber || sIdx + 1}ª:</span>
                                      <strong className="text-purple-300">{s.weight}kg</strong> × {s.reps} reps
                                      {s.rpe && <span className="text-zinc-500 text-[9px]">(RPE {s.rpe})</span>}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[11px] text-zinc-400">
                                  {ex.sets} séries × {ex.reps} reps ({ex.weight}kg)
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveWorkout(w.id)}
                  className="w-7 h-7 rounded-lg hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 flex items-center justify-center transition-colors"
                  title="Remover treino"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Catalog Search & Category Filters */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-zinc-300">Catálogo do Compêndio Oficial de Atividades</h3>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            placeholder="Buscar atividade (musculação, corrida, spinning, jiu-jitsu, natação...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181a20] border border-white/[0.07] rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin-green">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                activeCategory === c.id
                  ? 'bg-purple-500/15 text-purple-300 border-purple-500/40 font-semibold shadow-sm'
                  : 'bg-[#181a20] text-zinc-400 border-white/[0.07] hover:border-white/15 hover:text-zinc-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredExercises.map((ex) => {
            const burned = calculateExerciseCalories(ex.met, userWeight, ex.defaultDuration);

            return (
              <article
                key={ex.id}
                className="bg-[#181a20] border border-white/[0.07] hover:border-white/15 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs font-bold text-zinc-100 group-hover:text-purple-300 transition-colors">
                      {ex.name}
                    </h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 whitespace-nowrap">
                      {ex.met} METs
                    </span>
                  </div>

                  <span className="text-[11px] text-zinc-400 block mb-2">{ex.category}</span>
                  <p className="text-[11px] text-zinc-400 italic mb-3">{ex.notes}</p>

                  <div className="bg-[#131418] border border-white/[0.05] rounded-xl p-2 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Queima estimada:</span>
                    <strong className="text-purple-400 font-bold">
                      ~{burned} kcal <small className="text-[10px] text-zinc-400 font-normal">/ {ex.defaultDuration}min</small>
                    </strong>
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onOpenAddWorkout(ex)}
                    className="px-3 py-1.5 bg-[#131418] hover:bg-purple-500/10 text-purple-300 border border-white/[0.06] hover:border-purple-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Treinar Este</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
