import React, { useState, useMemo } from 'react';
import { 
  X, 
  Dumbbell, 
  Plus, 
  Trash2, 
  Check, 
  RotateCcw, 
  Layers, 
  Flame, 
  Activity,
  CheckCircle2,
  ChevronDown,
  Info
} from 'lucide-react';
import { COMPENDIUM_EXERCISES, calculateExerciseCalories } from '../data/exercisesDb.js';

export default function AddWorkoutModal({ initialExercise, userWeightKg = 75, onClose, onSaveWorkout }) {
  const [selectedExId, setSelectedExId] = useState(initialExercise ? initialExercise.id : 'ex_musculacao_vigorosa');
  const [title, setTitle] = useState(initialExercise ? initialExercise.name : 'Treino de Musculação');
  const [duration, setDuration] = useState(initialExercise ? initialExercise.defaultDuration : 50);
  const [notes, setNotes] = useState('');

  // Lista de exercícios com séries detalhadas
  const [exercises, setExercises] = useState([
    {
      id: 'ex_1',
      name: 'Supino Reto com Barra',
      sets: [
        { id: 's_1', weight: 60, reps: 10, rpe: 8, completed: true },
        { id: 's_2', weight: 65, reps: 10, rpe: 8.5, completed: true },
        { id: 's_3', weight: 70, reps: 8, rpe: 9, completed: true }
      ]
    },
    {
      id: 'ex_2',
      name: 'Crucifixo Inclinado com Halteres',
      sets: [
        { id: 's_4', weight: 14, reps: 12, rpe: 8, completed: true },
        { id: 's_5', weight: 16, reps: 10, rpe: 9, completed: true },
        { id: 's_6', weight: 16, reps: 10, rpe: 9.5, completed: true }
      ]
    }
  ]);

  const selectedCompendium = COMPENDIUM_EXERCISES.find((e) => e.id === selectedExId);
  const currentMet = selectedCompendium ? selectedCompendium.met : 5.0;
  const autoKcal = calculateExerciseCalories(currentMet, userWeightKg, parseFloat(duration) || 0);

  // Calcula o Volume Total (Tonelagem: Soma de Carga x Reps)
  const stats = useMemo(() => {
    let totalVolumeKg = 0;
    let totalSetsCount = 0;
    let completedSetsCount = 0;

    exercises.forEach((ex) => {
      (ex.sets || []).forEach((set) => {
        totalSetsCount++;
        if (set.completed) completedSetsCount++;
        const w = parseFloat(set.weight) || 0;
        const r = parseFloat(set.reps) || 0;
        totalVolumeKg += w * r;
      });
    });

    return { totalVolumeKg: Math.round(totalVolumeKg), totalSetsCount, completedSetsCount };
  }, [exercises]);

  const handleCompendiumSelect = (exId) => {
    setSelectedExId(exId);
    const ex = COMPENDIUM_EXERCISES.find((e) => e.id === exId);
    if (ex) {
      setTitle(ex.name);
      setDuration(ex.defaultDuration);
    }
  };

  // Gerenciamento de Exercícios
  const handleAddExercise = () => {
    const newId = 'ex_' + Date.now();
    setExercises([
      ...exercises,
      {
        id: newId,
        name: '',
        sets: [
          { id: 's_' + Date.now() + '_1', weight: 20, reps: 10, rpe: 8, completed: true },
          { id: 's_' + Date.now() + '_2', weight: 20, reps: 10, rpe: 8, completed: true },
          { id: 's_' + Date.now() + '_3', weight: 20, reps: 10, rpe: 8.5, completed: true }
        ]
      }
    ]);
  };

  const handleRemoveExercise = (exIndex) => {
    setExercises(exercises.filter((_, idx) => idx !== exIndex));
  };

  const handleUpdateExerciseName = (exIndex, name) => {
    const updated = [...exercises];
    updated[exIndex].name = name;
    setExercises(updated);
  };

  // Gerenciamento de Séries dentro de um Exercício
  const handleAddSet = (exIndex) => {
    const updated = [...exercises];
    const targetEx = updated[exIndex];
    const prevSet = targetEx.sets[targetEx.sets.length - 1];
    const newWeight = prevSet ? prevSet.weight : 20;
    const newReps = prevSet ? prevSet.reps : 10;
    const newRpe = prevSet ? prevSet.rpe : 8;

    targetEx.sets.push({
      id: 's_' + Date.now(),
      weight: newWeight,
      reps: newReps,
      rpe: newRpe,
      completed: true
    });
    setExercises(updated);
  };

  const handleRemoveSet = (exIndex, setIndex) => {
    const updated = [...exercises];
    if (updated[exIndex].sets.length > 1) {
      updated[exIndex].sets = updated[exIndex].sets.filter((_, idx) => idx !== setIndex);
      setExercises(updated);
    }
  };

  const handleUpdateSet = (exIndex, setIndex, field, value) => {
    const updated = [...exercises];
    updated[exIndex].sets[setIndex][field] = value;
    setExercises(updated);
  };

  const adjustSetField = (exIndex, setIndex, field, delta) => {
    const updated = [...exercises];
    const curVal = parseFloat(updated[exIndex].sets[setIndex][field]) || 0;
    const newVal = Math.max(0, Number((curVal + delta).toFixed(1)));
    updated[exIndex].sets[setIndex][field] = newVal;
    setExercises(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Formata os exercícios garantindo que nomes vazios sejam descartados
    const validExercises = exercises
      .filter((ex) => ex.name.trim() !== '')
      .map((ex) => {
        const exVol = (ex.sets || []).reduce((acc, s) => acc + (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0), 0);
        return {
          id: ex.id,
          name: ex.name.trim(),
          volumeKg: Math.round(exVol),
          sets: ex.sets.map((s, idx) => ({
            setNumber: idx + 1,
            weight: parseFloat(s.weight) || 0,
            reps: parseFloat(s.reps) || 0,
            rpe: parseFloat(s.rpe) || 8,
            completed: Boolean(s.completed)
          }))
        };
      });

    const workout = {
      id: 'workout_' + Date.now(),
      title: title.trim(),
      exerciseId: selectedExId,
      metValue: currentMet,
      durationMinutes: parseFloat(duration) || 30,
      caloriesBurned: autoKcal,
      totalVolumeKg: stats.totalVolumeKg,
      totalSetsCount: stats.totalSetsCount,
      notes: notes.trim() || undefined,
      exercises: validExercises,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    onSaveWorkout(workout);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto modal-backdrop-anim">
      <div className="bg-[#181a20] border border-white/[0.08] rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto modal-content-anim">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100">Caderno de Treino Avançado</h2>
              <p className="text-[10px] text-zinc-400">Registre séries, cargas (kg), reps e RPE</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4">
          {/* Top Activity Selector */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Atividade do Compêndio Oficial:
            </label>
            <select
              value={selectedExId}
              onChange={(e) => handleCompendiumSelect(e.target.value)}
              className="w-full bg-[#131418] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-purple-500/50"
            >
              {COMPENDIUM_EXERCISES.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.met} METs) - {ex.category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Nome / Divisão do Treino:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Treino A - Peito, Tríceps & Ombro"
              required
              className="w-full bg-[#131418] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-purple-500/50 font-semibold"
            />
          </div>

          {/* Quick Metrics Bar: Duração, Calorias e Volume Total */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#131418] border border-white/[0.06] rounded-xl p-2.5">
              <label className="text-[10px] font-semibold text-zinc-400 block mb-1">Duração (min):</label>
              <input
                type="number"
                min="5"
                max="360"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                className="w-full bg-transparent text-sm font-extrabold text-zinc-100 focus:outline-none"
              />
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-2.5 text-center flex flex-col justify-center">
              <span className="text-[10px] text-zinc-400 font-semibold">Queima Estimada:</span>
              <strong className="text-sm font-extrabold text-purple-300 leading-tight">
                {autoKcal} <small className="text-[10px] text-zinc-400 font-normal">kcal</small>
              </strong>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 text-center flex flex-col justify-center">
              <span className="text-[10px] text-zinc-400 font-semibold">Volume Total:</span>
              <strong className="text-sm font-extrabold text-emerald-400 leading-tight">
                {stats.totalVolumeKg.toLocaleString('pt-BR')} <small className="text-[10px] text-zinc-400 font-normal">kg</small>
              </strong>
            </div>
          </div>

          {/* Exercises Section with Sets Table */}
          <div className="space-y-3 pt-2 border-t border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-200 block">Exercícios & Séries</span>
                <span className="text-[10px] text-zinc-500">
                  {exercises.length} exercício(s) • {stats.totalSetsCount} série(s) registradas
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddExercise}
                className="px-2.5 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Exercício
              </button>
            </div>

            {/* Exercise Cards */}
            <div className="space-y-3">
              {exercises.map((ex, exIdx) => {
                const exVol = (ex.sets || []).reduce(
                  (acc, s) => acc + (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0),
                  0
                );

                return (
                  <div
                    key={ex.id || exIdx}
                    className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3 space-y-2.5 shadow-sm"
                  >
                    {/* Exercise Card Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Nome do exercício (ex: Supino, Agachamento, Barra)"
                          value={ex.name}
                          onChange={(e) => handleUpdateExerciseName(exIdx, e.target.value)}
                          className="w-full bg-[#181a20] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 font-bold placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/50"
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg shrink-0">
                        Vol: {Math.round(exVol).toLocaleString('pt-BR')} kg
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(exIdx)}
                        className="w-7 h-7 rounded-lg hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 flex items-center justify-center transition-colors shrink-0"
                        title="Remover este exercício"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Sets Table */}
                    <div className="overflow-x-auto">
                      <div className="min-w-[340px] space-y-1">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-1.5 px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          <span className="col-span-1 text-center">#</span>
                          <span className="col-span-4 text-center">Carga (kg)</span>
                          <span className="col-span-3 text-center">Reps</span>
                          <span className="col-span-3 text-center">RPE</span>
                          <span className="col-span-1 text-center"></span>
                        </div>

                        {/* Sets Rows */}
                        {ex.sets.map((set, setIdx) => (
                          <div
                            key={set.id || setIdx}
                            className={`grid grid-cols-12 gap-1.5 items-center p-1.5 rounded-xl border transition-all ${
                              set.completed
                                ? 'bg-[#181a20] border-white/[0.05]'
                                : 'bg-[#181a20]/40 border-dashed border-white/[0.04] opacity-60'
                            }`}
                          >
                            {/* Set Number */}
                            <div className="col-span-1 text-center font-bold text-xs text-zinc-400">
                              {setIdx + 1}
                            </div>

                            {/* Carga (kg) with quick adjust */}
                            <div className="col-span-4 flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => adjustSetField(exIdx, setIdx, 'weight', -2.5)}
                                className="w-5 h-6 rounded bg-[#131418] text-zinc-400 hover:text-white text-[10px] font-bold shrink-0"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="0"
                                step="any"
                                value={set.weight}
                                onChange={(e) => handleUpdateSet(exIdx, setIdx, 'weight', e.target.value)}
                                className="w-full bg-[#101216] border border-white/[0.08] rounded-lg py-1 px-1 text-xs text-center font-bold text-zinc-100 focus:outline-none focus:border-purple-500/50"
                              />
                              <button
                                type="button"
                                onClick={() => adjustSetField(exIdx, setIdx, 'weight', 2.5)}
                                className="w-5 h-6 rounded bg-[#131418] text-zinc-400 hover:text-white text-[10px] font-bold shrink-0"
                              >
                                +
                              </button>
                            </div>

                            {/* Reps with quick adjust */}
                            <div className="col-span-3 flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => adjustSetField(exIdx, setIdx, 'reps', -1)}
                                className="w-5 h-6 rounded bg-[#131418] text-zinc-400 hover:text-white text-[10px] font-bold shrink-0"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={set.reps}
                                onChange={(e) => handleUpdateSet(exIdx, setIdx, 'reps', e.target.value)}
                                className="w-full bg-[#101216] border border-white/[0.08] rounded-lg py-1 px-1 text-xs text-center font-bold text-zinc-100 focus:outline-none focus:border-purple-500/50"
                              />
                              <button
                                type="button"
                                onClick={() => adjustSetField(exIdx, setIdx, 'reps', 1)}
                                className="w-5 h-6 rounded bg-[#131418] text-zinc-400 hover:text-white text-[10px] font-bold shrink-0"
                              >
                                +
                              </button>
                            </div>

                            {/* RPE Selector */}
                            <div className="col-span-3">
                              <select
                                value={set.rpe || 8}
                                onChange={(e) => handleUpdateSet(exIdx, setIdx, 'rpe', parseFloat(e.target.value))}
                                className="w-full bg-[#101216] border border-white/[0.08] rounded-lg py-1 px-1 text-[11px] text-center font-semibold text-purple-300 focus:outline-none"
                              >
                                <option value="6">RPE 6 (Leve)</option>
                                <option value="7">RPE 7 (3 RIR)</option>
                                <option value="8">RPE 8 (2 RIR)</option>
                                <option value="8.5">RPE 8.5 (1-2 RIR)</option>
                                <option value="9">RPE 9 (1 RIR)</option>
                                <option value="9.5">RPE 9.5 (Quase Falha)</option>
                                <option value="10">RPE 10 (Falha Total)</option>
                              </select>
                            </div>

                            {/* Remove Set Button */}
                            <div className="col-span-1 text-center">
                              {ex.sets.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSet(exIdx, setIdx)}
                                  className="text-zinc-600 hover:text-rose-400 p-1"
                                  title="Remover série"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add Set Button */}
                    <div className="pt-1 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleAddSet(exIdx)}
                        className="px-2.5 py-1 rounded-lg bg-[#181a20] hover:bg-white/[0.06] border border-white/[0.06] text-purple-300 text-[11px] font-semibold flex items-center gap-1 transition-all"
                      >
                        <Plus className="w-3 h-3" /> + Nova Série
                      </button>
                      <span className="text-[10px] text-zinc-500">
                        Copia automaticamente a carga anterior
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Anotações do Treino:</label>
            <textarea
              rows="2"
              placeholder="Ex: Ótima intensidade. Aumentei 2.5kg na última série do supino. Descanso de 2min."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#131418] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          {/* Footer Buttons */}
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
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Treino Completo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
