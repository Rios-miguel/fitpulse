import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  TrendingUp, 
  Flame, 
  Droplets, 
  Dumbbell, 
  Scale, 
  Calendar, 
  Plus, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus,
  CheckCircle2,
  Award,
  Sparkles,
  Info
} from 'lucide-react';

const WEIGHT_STORAGE_KEY = 'fitpulse_weight_history_v1';

// Dados iniciais de demonstração elegantes caso não haja pesagens salvas
const DEFAULT_WEIGHT_HISTORY = [
  { date: '2026-11-01', weightKg: 76.5, notes: 'Início do mês' },
  { date: '2026-11-04', weightKg: 76.0, notes: 'Pós-treino' },
  { date: '2026-11-08', weightKg: 75.4, notes: 'Jejum matinal' },
  { date: '2026-11-11', weightKg: 75.0, notes: 'Meta de déficit atingida' }
];

export default function EvolutionModal({
  dailyLogs = {},
  settings = {},
  currentDate,
  onClose,
  onUpdateWeight
}) {
  const [activeSubTab, setActiveSubTab] = useState('calories'); // 'calories' | 'weight' | 'water' | 'workouts'
  const [newWeightInput, setNewWeightInput] = useState(settings.userWeightKg || 75);
  const [newWeightDate, setNewWeightDate] = useState(currentDate || new Date().toISOString().split('T')[0]);
  const [newWeightNotes, setNewWeightNotes] = useState('');

  // Histórico de Pesagens
  const [weightHistory, setWeightHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(WEIGHT_STORAGE_KEY);
      if (!raw) return DEFAULT_WEIGHT_HISTORY;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_WEIGHT_HISTORY;
    } catch (e) {
      return DEFAULT_WEIGHT_HISTORY;
    }
  });

  const saveWeightHistory = (history) => {
    setWeightHistory(history);
    try {
      localStorage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {}
  };

  const handleAddWeightRecord = (e) => {
    e.preventDefault();
    const w = parseFloat(newWeightInput);
    if (isNaN(w) || w <= 20 || w >= 300) {
      alert('Informe um peso válido entre 20kg e 300kg.');
      return;
    }

    const newRecord = {
      date: newWeightDate,
      weightKg: Number(w.toFixed(1)),
      notes: newWeightNotes.trim() || undefined
    };

    // Remove registro existente do mesmo dia se houver
    const filtered = weightHistory.filter((r) => r.date !== newWeightDate);
    const updated = [...filtered, newRecord].sort((a, b) => a.date.localeCompare(b.date));
    saveWeightHistory(updated);

    if (onUpdateWeight) {
      onUpdateWeight(Number(w.toFixed(1)));
    }
    setNewWeightNotes('');
  };

  const handleRemoveWeightRecord = (dateToRemove) => {
    const updated = weightHistory.filter((r) => r.date !== dateToRemove);
    saveWeightHistory(updated);
  };

  // Compila os últimos 7 dias a partir da data atual
  const last7DaysData = useMemo(() => {
    const list = [];
    const baseDate = new Date(currentDate + 'T12:00:00');
    if (isNaN(baseDate.getTime())) return [];

    const goalCal = settings.goalCalories || 2000;
    const goalWater = settings.goalWater || 2500;

    for (let i = 6; i >= 0; i--) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
      const dayNum = d.getDate();

      const log = dailyLogs[dateStr] || {};
      const meals = Array.isArray(log.meals) ? log.meals : [];
      const water = Array.isArray(log.water) ? log.water : [];
      const workouts = Array.isArray(log.workouts) ? log.workouts : [];

      const calories = Math.round(meals.reduce((acc, m) => acc + (Number(m.calories) || 0), 0));
      const protein = Number(meals.reduce((acc, m) => acc + (Number(m.protein) || 0), 0).toFixed(1));
      const carbs = Number(meals.reduce((acc, m) => acc + (Number(m.carbs) || 0), 0).toFixed(1));
      const fat = Number(meals.reduce((acc, m) => acc + (Number(m.fat) || 0), 0).toFixed(1));

      const waterTotal = water.reduce((acc, w) => acc + (Number(w.amount) || 0), 0);
      const burnedCalories = Math.round(workouts.reduce((acc, w) => acc + (Number(w.caloriesBurned) || 0), 0));
      const workoutVolume = Math.round(workouts.reduce((acc, w) => acc + (Number(w.totalVolumeKg) || 0), 0));

      list.push({
        dateStr,
        dayName: dayName.toUpperCase(),
        dayNum,
        isToday: i === 0,
        calories,
        protein,
        carbs,
        fat,
        waterTotal,
        burnedCalories,
        workoutVolume,
        workoutsCount: workouts.length,
        hasLogs: meals.length > 0 || water.length > 0 || workouts.length > 0,
        goalCal,
        goalWater
      });
    }

    return list;
  }, [dailyLogs, currentDate, settings]);

  // Estatísticas agregadas da semana
  const weeklyStats = useMemo(() => {
    const daysWithLogs = last7DaysData.filter((d) => d.hasLogs);
    const activeDaysCount = daysWithLogs.length || 1;

    const totalCals = last7DaysData.reduce((acc, d) => acc + d.calories, 0);
    const avgCals = Math.round(totalCals / activeDaysCount);

    const totalProt = last7DaysData.reduce((acc, d) => acc + d.protein, 0);
    const avgProt = Number((totalProt / activeDaysCount).toFixed(1));

    const totalCarbs = last7DaysData.reduce((acc, d) => acc + d.carbs, 0);
    const avgCarbs = Number((totalCarbs / activeDaysCount).toFixed(1));

    const totalFat = last7DaysData.reduce((acc, d) => acc + d.fat, 0);
    const avgFat = Number((totalFat / activeDaysCount).toFixed(1));

    const totalWater = last7DaysData.reduce((acc, d) => acc + d.waterTotal, 0);
    const avgWater = Math.round(totalWater / activeDaysCount);

    const totalWorkouts = last7DaysData.reduce((acc, d) => acc + d.workoutsCount, 0);
    const totalVolume = last7DaysData.reduce((acc, d) => acc + d.workoutVolume, 0);
    const totalBurned = last7DaysData.reduce((acc, d) => acc + d.burnedCalories, 0);

    const goal = settings.goalCalories || 2000;
    const balanceDiff = avgCals - goal;

    return {
      avgCals,
      avgProt,
      avgCarbs,
      avgFat,
      avgWater,
      totalWorkouts,
      totalVolume,
      totalBurned,
      daysLogged: daysWithLogs.length,
      balanceDiff
    };
  }, [last7DaysData, settings]);

  // Estatísticas de Peso
  const weightStats = useMemo(() => {
    if (weightHistory.length === 0) return { current: 75, delta: 0, min: 75, max: 75 };
    const sorted = [...weightHistory].sort((a, b) => a.date.localeCompare(b.date));
    const first = sorted[0].weightKg;
    const latest = sorted[sorted.length - 1].weightKg;
    const delta = Number((latest - first).toFixed(1));

    const weights = sorted.map((s) => s.weightKg);
    const min = Math.min(...weights);
    const max = Math.max(...weights);

    return { current: latest, delta, min, max, count: sorted.length };
  }, [weightHistory]);

  const maxWeeklyCalories = Math.max(settings.goalCalories * 1.3, ...last7DaysData.map((d) => d.calories), 2400);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto modal-backdrop-anim">
      <div className="bg-[#181a20] border border-white/[0.08] rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto modal-content-anim">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100">Relatórios & Evolução</h2>
              <p className="text-[10px] text-zinc-400">Balanço calórico, peso corporal e hidratação</p>
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

        {/* Sub-tabs selector */}
        <div className="grid grid-cols-4 p-2 bg-[#131418] border-b border-white/[0.06] gap-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('calories')}
            className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'calories'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Calorias</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('weight')}
            className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'weight'
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Peso</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('water')}
            className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'water'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Água</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('workouts')}
            className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'workouts'
                ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Treinos</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* TAB 1: CALORIAS & MACROS */}
          {activeSubTab === 'calories' && (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-zinc-400 font-semibold block mb-0.5">Média Diária:</span>
                  <strong className="text-base font-extrabold text-emerald-400 block">
                    {weeklyStats.avgCals} <small className="text-[10px] text-zinc-400 font-normal">kcal</small>
                  </strong>
                  <span className="text-[9px] text-zinc-500">
                    Meta: {settings.goalCalories || 2000} kcal
                  </span>
                </div>

                <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-zinc-400 font-semibold block mb-0.5">Saldo Semanal:</span>
                  <strong
                    className={`text-base font-extrabold block ${
                      weeklyStats.balanceDiff <= 0 ? 'text-sky-400' : 'text-amber-400'
                    }`}
                  >
                    {weeklyStats.balanceDiff > 0 ? `+${weeklyStats.balanceDiff}` : weeklyStats.balanceDiff}{' '}
                    <small className="text-[10px] text-zinc-400 font-normal">kcal/dia</small>
                  </strong>
                  <span className="text-[9px] text-zinc-500">
                    {weeklyStats.balanceDiff <= 0 ? 'Déficit Calórico' : 'Superávit Calórico'}
                  </span>
                </div>

                <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-zinc-400 font-semibold block mb-0.5">Consistência:</span>
                  <strong className="text-base font-extrabold text-zinc-100 block">
                    {weeklyStats.daysLogged} / 7 <small className="text-[10px] text-zinc-400 font-normal">dias</small>
                  </strong>
                  <span className="text-[9px] text-emerald-400 font-semibold">
                    {Math.round((weeklyStats.daysLogged / 7) * 100)}% de registro
                  </span>
                </div>
              </div>

              {/* Weekly Calorie Chart */}
              <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-200">Consumo Calórico dos Últimos 7 Dias</span>
                  <span className="text-[10px] text-zinc-400">
                    Linha tracejada = Meta ({settings.goalCalories || 2000} kcal)
                  </span>
                </div>

                {/* Bars Area */}
                <div className="relative pt-6 pb-2">
                  {/* Goal Line Reference */}
                  <div
                    className="absolute left-0 right-0 border-b border-dashed border-emerald-500/40 z-10 pointer-events-none"
                    style={{
                      bottom: `${((settings.goalCalories || 2000) / maxWeeklyCalories) * 100}%`
                    }}
                  >
                    <span className="absolute right-0 -top-4 text-[9px] font-bold text-emerald-400 bg-[#131418] px-1 rounded">
                      Meta: {settings.goalCalories || 2000}
                    </span>
                  </div>

                  {/* 7 Vertical Columns */}
                  <div className="grid grid-cols-7 gap-2 items-end h-40">
                    {last7DaysData.map((d, idx) => {
                      const heightPercent = Math.min(100, Math.round((d.calories / maxWeeklyCalories) * 100));
                      const isOverGoal = d.calories > (settings.goalCalories || 2000) * 1.05;
                      const isCloseGoal = Math.abs(d.calories - (settings.goalCalories || 2000)) <= (settings.goalCalories || 2000) * 0.1;

                      let barColor = 'bg-emerald-500';
                      if (isOverGoal) barColor = 'bg-amber-500';
                      else if (d.calories === 0) barColor = 'bg-zinc-800';

                      return (
                        <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                          {/* Value above bar */}
                          <span className="text-[9px] font-bold text-zinc-400 group-hover:text-emerald-400 transition-colors">
                            {d.calories > 0 ? d.calories : '-'}
                          </span>

                          {/* Bar Container */}
                          <div className="w-full max-w-[28px] h-28 bg-[#181a20] rounded-lg overflow-hidden flex items-end border border-white/[0.04]">
                            <div
                              className={`w-full rounded-md transition-all duration-500 ${barColor}`}
                              style={{ height: `${heightPercent}%` }}
                            />
                          </div>

                          {/* Day Label */}
                          <div className="text-center">
                            <span
                              className={`text-[10px] font-bold block ${
                                d.isToday ? 'text-emerald-400' : 'text-zinc-400'
                              }`}
                            >
                              {d.dayName}
                            </span>
                            <span className="text-[8px] text-zinc-500">{d.dayNum}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Weekly Average Macros Breakdown */}
              <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3.5 space-y-2">
                <span className="text-xs font-bold text-zinc-200 block">Média de Macronutrientes por Dia</span>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="bg-[#181a20] border border-sky-500/20 rounded-xl p-2.5 text-center">
                    <span className="text-[10px] font-semibold text-sky-400 block">Proteínas</span>
                    <strong className="text-sm font-extrabold text-zinc-100">{weeklyStats.avgProt}g</strong>
                    <span className="text-[9px] text-zinc-500 block">
                      ~{Math.round(weeklyStats.avgProt * 4)} kcal
                    </span>
                  </div>

                  <div className="bg-[#181a20] border border-amber-500/20 rounded-xl p-2.5 text-center">
                    <span className="text-[10px] font-semibold text-amber-400 block">Carboidratos</span>
                    <strong className="text-sm font-extrabold text-zinc-100">{weeklyStats.avgCarbs}g</strong>
                    <span className="text-[9px] text-zinc-500 block">
                      ~{Math.round(weeklyStats.avgCarbs * 4)} kcal
                    </span>
                  </div>

                  <div className="bg-[#181a20] border border-rose-500/20 rounded-xl p-2.5 text-center">
                    <span className="text-[10px] font-semibold text-rose-400 block">Gorduras</span>
                    <strong className="text-sm font-extrabold text-zinc-100">{weeklyStats.avgFat}g</strong>
                    <span className="text-[9px] text-zinc-500 block">
                      ~{Math.round(weeklyStats.avgFat * 9)} kcal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PESO CORPORAL */}
          {activeSubTab === 'weight' && (
            <div className="space-y-4">
              {/* Weight Metrics Cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-zinc-400 font-semibold block mb-0.5">Peso Atual:</span>
                  <strong className="text-base font-extrabold text-sky-400 block">
                    {weightStats.current} <small className="text-[10px] text-zinc-400 font-normal">kg</small>
                  </strong>
                  <span className="text-[9px] text-zinc-500">Último registro</span>
                </div>

                <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-zinc-400 font-semibold block mb-0.5">Variação Total:</span>
                  <strong
                    className={`text-base font-extrabold block ${
                      weightStats.delta <= 0 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {weightStats.delta > 0 ? `+${weightStats.delta}` : weightStats.delta}{' '}
                    <small className="text-[10px] text-zinc-400 font-normal">kg</small>
                  </strong>
                  <span className="text-[9px] text-zinc-500">
                    {weightStats.delta <= 0 ? 'Perda de Peso' : 'Ganho de Peso'}
                  </span>
                </div>

                <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-zinc-400 font-semibold block mb-0.5">Faixa do Período:</span>
                  <strong className="text-xs font-bold text-zinc-200 block mt-1">
                    {weightStats.min}kg - {weightStats.max}kg
                  </strong>
                  <span className="text-[9px] text-zinc-500">{weightStats.count} pesagens</span>
                </div>
              </div>

              {/* Form to log today's weight */}
              <form
                onSubmit={handleAddWeightRecord}
                className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3.5 space-y-2.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-sky-400" />
                    <span>Registrar Nova Pesagem</span>
                  </span>
                  <span className="text-[10px] text-zinc-400">Recomendado: em jejum pela manhã</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="text-[10px] text-zinc-400 font-semibold block mb-1">Peso (kg):</label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setNewWeightInput((prev) => Math.max(20, Number((prev - 0.2).toFixed(1))))}
                        className="w-8 h-8 rounded-lg bg-[#181a20] text-zinc-400 hover:text-white font-bold text-xs"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        step="0.1"
                        min="20"
                        max="300"
                        value={newWeightInput}
                        onChange={(e) => setNewWeightInput(parseFloat(e.target.value) || 0)}
                        required
                        className="w-full bg-[#181a20] border border-white/[0.08] rounded-lg py-1 px-2 text-center text-sm font-extrabold text-zinc-100 focus:outline-none focus:border-sky-500/50"
                      />
                      <button
                        type="button"
                        onClick={() => setNewWeightInput((prev) => Math.min(300, Number((prev + 0.2).toFixed(1))))}
                        className="w-8 h-8 rounded-lg bg-[#181a20] text-zinc-400 hover:text-white font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label className="text-[10px] text-zinc-400 font-semibold block mb-1">Data da Pesagem:</label>
                    <input
                      type="date"
                      value={newWeightDate}
                      onChange={(e) => setNewWeightDate(e.target.value)}
                      required
                      className="w-full bg-[#181a20] border border-white/[0.08] rounded-lg py-1.5 px-2 text-xs text-zinc-100 focus:outline-none focus:border-sky-500/50"
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="text-[10px] text-zinc-400 font-semibold block mb-1">Anotação (opcional):</label>
                    <input
                      type="text"
                      placeholder="Ex: Pós-cardio"
                      value={newWeightNotes}
                      onChange={(e) => setNewWeightNotes(e.target.value)}
                      className="w-full bg-[#181a20] border border-white/[0.08] rounded-lg py-1.5 px-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-sky-500/50"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Salvar Pesagem</span>
                  </button>
                </div>
              </form>

              {/* Weight Log History List */}
              <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3.5 space-y-2">
                <span className="text-xs font-bold text-zinc-200 block">Histórico de Pesagens</span>
                <div className="divide-y divide-white/[0.04] max-h-48 overflow-y-auto">
                  {weightHistory
                    .slice()
                    .reverse()
                    .map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-zinc-400 text-[11px]">{item.date}</span>
                          <strong className="text-zinc-100 font-bold">{item.weightKg} kg</strong>
                          {item.notes && <span className="text-[10px] text-zinc-500 italic">"{item.notes}"</span>}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveWeightRecord(item.date)}
                          className="p-1 text-zinc-600 hover:text-rose-400 transition-colors"
                          title="Remover pesagem"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HIDRATAÇÃO */}
          {activeSubTab === 'water' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-zinc-400 font-semibold block mb-0.5">Média Diária:</span>
                  <strong className="text-base font-extrabold text-cyan-400 block">
                    {weeklyStats.avgWater} <small className="text-[10px] text-zinc-400 font-normal">ml</small>
                  </strong>
                  <span className="text-[9px] text-zinc-500">Meta: {settings.goalWater || 2500} ml</span>
                </div>

                <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-zinc-400 font-semibold block mb-0.5">Dias com Meta 100%:</span>
                  <strong className="text-base font-extrabold text-emerald-400 block">
                    {last7DaysData.filter((d) => d.waterTotal >= (settings.goalWater || 2500)).length} / 7
                  </strong>
                  <span className="text-[9px] text-zinc-500">Dias bem hidratados</span>
                </div>
              </div>

              {/* Water Bars */}
              <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3.5 space-y-2">
                <span className="text-xs font-bold text-zinc-200 block">Consumo de Água (ml) na Semana</span>
                <div className="grid grid-cols-7 gap-2 items-end h-36 pt-4">
                  {last7DaysData.map((d, idx) => {
                    const goal = settings.goalWater || 2500;
                    const percent = Math.min(100, Math.round((d.waterTotal / goal) * 100));
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                        <span className="text-[9px] font-bold text-cyan-400">
                          {d.waterTotal > 0 ? `${Math.round(d.waterTotal / 100) / 10}L` : '-'}
                        </span>
                        <div className="w-full max-w-[26px] h-24 bg-[#181a20] rounded-lg overflow-hidden flex items-end border border-white/[0.04]">
                          <div
                            className={`w-full rounded-md transition-all duration-500 ${
                              percent >= 100 ? 'bg-cyan-400' : 'bg-cyan-500/60'
                            }`}
                            style={{ height: `${percent}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400">{d.dayName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TREINOS & FORÇA */}
          {activeSubTab === 'workouts' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-zinc-400 font-semibold block mb-0.5">Volume Levantado:</span>
                  <strong className="text-sm font-extrabold text-emerald-400 block">
                    {weeklyStats.totalVolume.toLocaleString('pt-BR')} <small className="text-[10px] text-zinc-400 font-normal">kg</small>
                  </strong>
                  <span className="text-[9px] text-zinc-500">Tonelagem na semana</span>
                </div>

                <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-zinc-400 font-semibold block mb-0.5">Sessões:</span>
                  <strong className="text-base font-extrabold text-purple-400 block">
                    {weeklyStats.totalWorkouts} <small className="text-[10px] text-zinc-400 font-normal">treinos</small>
                  </strong>
                  <span className="text-[9px] text-zinc-500">Concluídos</span>
                </div>

                <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-zinc-400 font-semibold block mb-0.5">Gasto Ativo:</span>
                  <strong className="text-base font-extrabold text-purple-300 block">
                    {weeklyStats.totalBurned} <small className="text-[10px] text-zinc-400 font-normal">kcal</small>
                  </strong>
                  <span className="text-[9px] text-zinc-500">Compêndio Stanford</span>
                </div>
              </div>

              <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3.5 space-y-2">
                <span className="text-xs font-bold text-zinc-200 block">Dica Científica de Periodização</span>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Para hipertrofia sustentada, busque um aumento progressivo de 2% a 5% no <strong>Volume Total (Tonelagem)</strong> a cada ciclo de 4 a 6 semanas, mantendo a proximidade da falha entre 1 e 2 RIR.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#131418] border-t border-white/[0.06] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            Fechar Relatórios
          </button>
        </div>
      </div>
    </div>
  );
}
