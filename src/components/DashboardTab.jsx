import React, { useState, useMemo } from 'react';
import {
  Flame,
  Sun,
  SunMedium,
  Sunset,
  Moon,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
  Info,
  Trash2,
  Droplets,
  Dumbbell,
  ArrowRight,
  Newspaper,
  Sparkles,
  TrendingUp,
  Activity,
  Target,
  Scale
} from 'lucide-react';
import { FITNESS_NEWS_ARTICLES } from '../data/fitnessNewsDb.js';

export default function DashboardTab({
  dailyLog,
  settings,
  currentDate,
  dailyLogs = {},
  onSelectDate,
  onOpenLogMeal,
  onOpenAddWorkout,
  onQuickAddWater,
  onSwitchTab,
  onRemoveMealItem,
  onOpenArticle,
  onOpenEvolution,
  onOpenProfile
}) {
  const [expandedSlots, setExpandedSlots] = useState({
    'Café da Manhã': true,
    'Almoço': true,
    'Jantar': true,
    'Snacks/Outros': false
  });
  const [showStreakModal, setShowStreakModal] = useState(false);

  const meals = dailyLog?.meals || [];
  const water = dailyLog?.water || [];
  const workouts = dailyLog?.workouts || [];

  // Totais consumidos no dia
  const totalCalories = Math.round(meals.reduce((acc, m) => acc + (Number(m.calories) || 0), 0));
  const totalProtein = Number(meals.reduce((acc, m) => acc + (Number(m.protein) || 0), 0).toFixed(1));
  const totalCarbs = Number(meals.reduce((acc, m) => acc + (Number(m.carbs) || 0), 0).toFixed(1));
  const totalFat = Number(meals.reduce((acc, m) => acc + (Number(m.fat) || 0), 0).toFixed(1));

  const totalWater = water.reduce((acc, w) => acc + (Number(w.amount) || 0), 0);
  const totalBurned = Math.round(workouts.reduce((acc, w) => acc + (Number(w.caloriesBurned) || 0), 0));

  const goalCalories = Number(settings?.goalCalories) || 2000;
  const goalProtein = Number(settings?.goalProtein) || 150;
  const goalCarbs = Number(settings?.goalCarbs) || 200;
  const goalFat = Number(settings?.goalFat) || 60;
  const goalWater = Number(settings?.goalWater) || 2500;

  const idrPercent = Math.min(999, Math.round((totalCalories / goalCalories) * 100));
  const remainingCalories = Math.max(0, goalCalories - totalCalories);

  // Percentuais de progresso dos macros
  const protPercent = Math.min(100, Math.round((totalProtein / (goalProtein || 1)) * 100));
  const carbsPercent = Math.min(100, Math.round((totalCarbs / (goalCarbs || 1)) * 100));
  const fatPercent = Math.min(100, Math.round((totalFat / (goalFat || 1)) * 100));

  // Dados de gasto calórico / TDEE calculados do perfil
  const profileData = useMemo(() => {
    try {
      const raw = localStorage.getItem('fitpulse_user_profile_v1');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }, [settings]);

  const estimatedTDEE = useMemo(() => {
    if (profileData) {
      const weight = parseFloat(profileData.weightKg) || 75;
      const height = parseFloat(profileData.heightCm) || 178;
      const age = parseInt(profileData.age, 10) || 26;
      const isMale = profileData.gender === 'masculino';
      let bmr = isMale
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
      const multMap = { sedentario: 1.2, leve: 1.375, moderado: 1.55, intenso: 1.725, atleta: 1.9 };
      const mult = multMap[profileData.activityLevel] || 1.55;
      return Math.round(bmr * mult);
    }
    const w = Number(settings?.userWeightKg) || 75;
    return Math.round((10 * w + 6.25 * 175 - 5 * 26 + 5) * 1.55);
  }, [profileData, settings]);

  // Toggle expansão dos slots de refeição
  const toggleSlot = (slotKey) => {
    setExpandedSlots((prev) => ({
      ...prev,
      [slotKey]: !prev[slotKey]
    }));
  };

  // Cálculo da semana em torno da data atual
  const weekDays = useMemo(() => {
    let base = new Date(currentDate + 'T12:00:00');
    if (isNaN(base.getTime())) base = new Date();
    // Pegar a segunda-feira da semana
    const dayOfWeek = base.getDay(); // 0 domingo, 1 segunda ...
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(base);
    monday.setDate(base.getDate() + diffToMonday);

    const days = [];
    const labels = [
      { key: 'M', full: 'Seg' },
      { key: 'Tu', full: 'Ter' },
      { key: 'W', full: 'Qua' },
      { key: 'Th', full: 'Qui' },
      { key: 'F', full: 'Sex' },
      { key: 'Sa', full: 'Sáb' },
      { key: 'Su', full: 'Dom' }
    ];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const log = dailyLogs[iso];
      const hasLoggedMeals = Boolean(log && Array.isArray(log.meals) && log.meals.length > 0);

      days.push({
        iso,
        label: labels[i].key,
        dayNum: d.getDate(),
        isToday: iso === new Date().toISOString().split('T')[0],
        isSelected: iso === currentDate,
        hasLogged: hasLoggedMeals
      });
    }
    return days;
  }, [currentDate, dailyLogs]);

  // Cálculo de streak de dias consecutivos registrados
  const streakCount = useMemo(() => {
    let count = 0;
    const checkDate = new Date();
    // Se hoje tem refeição, começa de hoje; se não, vê se ontem tinha
    for (let i = 0; i < 365; i++) {
      const d = new Date(checkDate);
      d.setDate(checkDate.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const log = dailyLogs[iso];
      if (log && Array.isArray(log.meals) && log.meals.length > 0) {
        count++;
      } else if (i === 0) {
        // Se hoje ainda não registrou, confere ontem sem quebrar
        continue;
      } else {
        break;
      }
    }
    return Math.max(1, count); // Mostra ao menos 1 ou streak real
  }, [dailyLogs]);

  // Navegar dias (< Hoje >)
  const navigateDay = (offset) => {
    const d = new Date(currentDate + 'T12:00:00');
    d.setDate(d.getDate() + offset);
    onSelectDate(d.toISOString().split('T')[0]);
  };

  const isTodaySelected = currentDate === new Date().toISOString().split('T')[0];

  // Agrupamento dos 4 slots de refeição estilo YAZIO
  const mealSlots = useMemo(() => {
    const slots = [
      {
        key: 'Café da Manhã',
        title: 'Café da Manhã',
        aliases: ['Café da Manhã', 'Pequeno Almoço'],
        icon: Sun,
        iconColor: 'text-amber-400',
        iconBg: 'bg-amber-500/10'
      },
      {
        key: 'Almoço',
        title: 'Almoço',
        aliases: ['Almoço'],
        icon: SunMedium,
        iconColor: 'text-sky-400',
        iconBg: 'bg-sky-500/10'
      },
      {
        key: 'Jantar',
        title: 'Jantar',
        aliases: ['Jantar'],
        icon: Sunset,
        iconColor: 'text-orange-400',
        iconBg: 'bg-orange-500/10'
      },
      {
        key: 'Snacks/Outros',
        title: 'Snacks/Outros',
        aliases: ['Snacks/Outros', 'Lanche da Tarde', 'Ceia / Lanche Noturno', 'Lanches'],
        icon: Moon,
        iconColor: 'text-purple-400',
        iconBg: 'bg-purple-500/10'
      }
    ];

    return slots.map((slot) => {
      const slotMeals = meals.filter((m) =>
        slot.aliases.some((alias) => (m.mealType || '').toLowerCase() === alias.toLowerCase())
      );
      const cals = Math.round(slotMeals.reduce((acc, m) => acc + (Number(m.calories) || 0), 0));
      const fat = Number(slotMeals.reduce((acc, m) => acc + (Number(m.fat) || 0), 0).toFixed(1));
      const carbs = Number(slotMeals.reduce((acc, m) => acc + (Number(m.carbs) || 0), 0).toFixed(1));
      const prot = Number(slotMeals.reduce((acc, m) => acc + (Number(m.protein) || 0), 0).toFixed(1));
      const pct = goalCalories > 0 ? Math.round((cals / goalCalories) * 100) : 0;

      return {
        ...slot,
        meals: slotMeals,
        calories: cals,
        fat,
        carbs,
        protein: prot,
        percent: pct
      };
    });
  }, [meals, goalCalories]);

  return (
    <div className="space-y-4 pb-24 max-w-2xl mx-auto">
      {/* 1. SELETOR DE DIAS E STREAK (ESTILO YAZIO) */}
      <section className="bg-[#15171d] border border-white/[0.06] rounded-2xl p-4 shadow-sm">
        {/* Navegação Topo: < Hoje > */}
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            type="button"
            onClick={() => navigateDay(-1)}
            aria-label="Dia anterior"
            className="p-1 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-sm font-bold text-zinc-100 tracking-tight">
            {isTodaySelected
              ? 'Hoje'
              : !isNaN(new Date(currentDate + 'T12:00:00').getTime())
              ? new Date(currentDate + 'T12:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })
              : 'Hoje'}
          </span>

          <button
            type="button"
            onClick={() => navigateDay(1)}
            aria-label="Próximo dia"
            className="p-1 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 7 Círculos da Semana (M, Tu, W, Th, F, Sa, Su) */}
        <div className="grid grid-cols-7 gap-1.5 text-center mb-3">
          {weekDays.map((day) => (
            <button
              key={day.iso}
              type="button"
              onClick={() => onSelectDate(day.iso)}
              className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
            >
              {/* Círculo indicador */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  day.hasLogged
                    ? 'bg-emerald-500 text-zinc-950 font-bold shadow-xs'
                    : day.isSelected
                    ? 'border-2 border-emerald-400 bg-emerald-500/10 text-emerald-300'
                    : 'border border-white/10 bg-[#191c23] text-zinc-500 group-hover:border-white/20'
                }`}
              >
                {day.hasLogged ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <span className="text-[11px] font-semibold">{day.dayNum}</span>
                )}
              </div>
              {/* Letra do dia da semana */}
              <span
                className={`text-[11px] font-medium ${
                  day.isSelected ? 'text-emerald-400 font-bold' : 'text-zinc-400'
                }`}
              >
                {day.label}
              </span>
            </button>
          ))}
        </div>

        {/* Faixa de Sequência (Streak) */}
        <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.05] text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              {streakCount} <Flame className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
            </span>
            <span>Sequência de registro de alimentos de {streakCount} {streakCount === 1 ? 'dia' : 'dias'}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowStreakModal(true)}
            aria-label="Sobre a sequência"
            className="text-zinc-400 hover:text-zinc-200 p-0.5 transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 1.5 BALANÇO ENERGÉTICO & GASTO DIÁRIO (WHOOP / MACROFACTOR STYLE) */}
      <section className="bg-gradient-to-br from-[#181a20] via-[#15171d] to-[#121419] border border-white/[0.08] hover:border-emerald-500/30 rounded-2xl p-4 shadow-sm space-y-3 fitness-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4 text-amber-400 animate-fire-glow" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                <span>Gasto Diário & Balanço Energético</span>
                <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ao Vivo
                </span>
              </h3>
              <p className="text-[10px] text-zinc-400">
                Você queima ~{estimatedTDEE} kcal/dia • Meta de ingestão: {goalCalories} kcal
              </p>
            </div>
          </div>

          {onOpenProfile && (
            <button
              type="button"
              onClick={onOpenProfile}
              className="py-1 px-2.5 rounded-xl bg-white/[0.04] hover:bg-emerald-500/15 border border-white/[0.08] hover:border-emerald-500/30 text-zinc-300 hover:text-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-all touch-bounce cursor-pointer shadow-xs"
              title="Calcular ou alterar dados cadastrais de gasto e metas"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Meu Gasto</span>
            </button>
          )}
        </div>

        {/* 3 Métricas de Energia Lado a Lado */}
        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          {/* Queima Total (TDEE + Treino do dia) */}
          <div className="p-2.5 rounded-xl bg-[#111317] border border-white/[0.04]">
            <span className="text-[10px] text-zinc-400 block mb-0.5">Queima Diária</span>
            <div className="flex items-baseline justify-center gap-1">
              <strong className="text-sm sm:text-base font-black text-amber-400 font-mono">
                {estimatedTDEE + totalBurned}
              </strong>
              <span className="text-[9px] text-zinc-500">kcal</span>
            </div>
            <span className="text-[9px] text-zinc-500 block">TDEE {totalBurned > 0 ? `+${totalBurned}ex` : ''}</span>
          </div>

          {/* Consumido */}
          <div className="p-2.5 rounded-xl bg-[#111317] border border-white/[0.04]">
            <span className="text-[10px] text-zinc-400 block mb-0.5">Consumido</span>
            <div className="flex items-baseline justify-center gap-1">
              <strong className="text-sm sm:text-base font-black text-zinc-100 font-mono">
                {totalCalories}
              </strong>
              <span className="text-[9px] text-zinc-500">kcal</span>
            </div>
            <span className="text-[9px] text-zinc-500 block">de {goalCalories}</span>
          </div>

          {/* Restante para Meta */}
          <div className={`p-2.5 rounded-xl border ${
            remainingCalories === 0
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-[#111317] border-emerald-500/20 text-emerald-300'
          }`}>
            <span className="text-[10px] text-zinc-400 block mb-0.5">Restante</span>
            <div className="flex items-baseline justify-center gap-1">
              <strong className="text-sm sm:text-base font-black font-mono">
                {remainingCalories}
              </strong>
              <span className="text-[9px] text-zinc-500">kcal</span>
            </div>
            <span className="text-[9px] text-zinc-400 block">para atingir</span>
          </div>
        </div>

        {/* Barra de Progresso de Calorias Suave */}
        <div className="space-y-1 pt-0.5">
          <div className="w-full bg-[#111317] h-2 rounded-full overflow-hidden border border-white/[0.04]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-700 ease-out macro-shimmer"
              style={{ width: `${Math.min(100, (totalCalories / (goalCalories || 1)) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-400 px-0.5">
            <span>0 kcal</span>
            <span className="font-semibold text-zinc-300">{Math.round((totalCalories / (goalCalories || 1)) * 100)}% da meta</span>
            <span>{goalCalories} kcal</span>
          </div>
        </div>
      </section>

      {/* 2. BARRA DE MACROS E CALORIAS EM 5 COLUNAS COM MEDIDORES SUAVES */}
      <section className="bg-[#15171d] border border-white/[0.06] rounded-2xl p-4 shadow-sm fitness-card">
        <div className="grid grid-cols-5 text-center divide-x divide-white/[0.05]">
          {/* Líp (Gorduras) */}
          <div className="px-1.5 space-y-1.5">
            <span className="block text-[11px] font-semibold text-rose-400">Líp</span>
            <span className="text-sm sm:text-base font-bold text-zinc-100">{totalFat}</span>
            <span className="block text-[10px] text-zinc-500">/ {goalFat}g</span>
            <div className="w-full bg-[#111317] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-rose-400 h-full rounded-full transition-all duration-500 macro-shimmer"
                style={{ width: `${fatPercent}%` }}
              />
            </div>
          </div>

          {/* Carb (Carboidratos) */}
          <div className="px-1.5 space-y-1.5">
            <span className="block text-[11px] font-semibold text-amber-400">Carb</span>
            <span className="text-sm sm:text-base font-bold text-zinc-100">{totalCarbs}</span>
            <span className="block text-[10px] text-zinc-500">/ {goalCarbs}g</span>
            <div className="w-full bg-[#111317] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500 macro-shimmer"
                style={{ width: `${carbsPercent}%` }}
              />
            </div>
          </div>

          {/* Prot (Proteínas) */}
          <div className="px-1.5 space-y-1.5">
            <span className="block text-[11px] font-semibold text-emerald-400">Prot</span>
            <span className="text-sm sm:text-base font-bold text-zinc-100">{totalProtein}</span>
            <span className="block text-[10px] text-zinc-500">/ {goalProtein}g</span>
            <div className="w-full bg-[#111317] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500 macro-shimmer"
                style={{ width: `${protPercent}%` }}
              />
            </div>
          </div>

          {/* IDR (% da meta diária) */}
          <div className="px-1.5 space-y-1.5">
            <span className="block text-[11px] font-semibold text-teal-400">IDR</span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-400">{idrPercent}%</span>
            <span className="block text-[10px] text-zinc-500">concluído</span>
            <div className="w-full bg-[#111317] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, idrPercent)}%` }}
              />
            </div>
          </div>

          {/* Calorias Totais */}
          <div className="px-1.5 space-y-1.5">
            <span className="block text-[11px] font-semibold text-zinc-300">Calorias</span>
            <span className="text-base sm:text-lg font-black text-zinc-100 tracking-tight">{totalCalories}</span>
            <span className="block text-[10px] text-zinc-500">/ {goalCalories}</span>
            <div className="w-full bg-[#111317] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-gradient-to-r from-emerald-400 to-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, idrPercent)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. OS 4 CARDS DE REFEIÇÃO DO YAZIO */}
      <section className="space-y-3">
        {mealSlots.map((slot) => {
          const Icon = slot.icon;
          const isExpanded = Boolean(expandedSlots[slot.key]);

          return (
            <article
              key={slot.key}
              className="bg-[#15171d] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl overflow-hidden shadow-sm transition-all duration-200 fitness-card"
            >
              {/* Linha Principal do Card: Ícone + Título + Calorias + Botão '+' Verde */}
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg ${slot.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${slot.iconColor}`} />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-100 truncate">{slot.title}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-black text-zinc-100">{slot.calories}</span>
                    <span className="text-[11px] text-zinc-400 block -mt-0.5">Calorias</span>
                  </div>

                  {/* Botão '+' verde circular clássico do YAZIO */}
                  <button
                    type="button"
                    onClick={() => onOpenLogMeal(null, slot.key)}
                    aria-label={`Adicionar alimento em ${slot.title}`}
                    className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-90 text-zinc-950 flex items-center justify-center shadow-xs transition-transform cursor-pointer touch-bounce"
                  >
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Sub-faixa de Macros: Líp, Carb, Prot, % + Chevron de Expansão */}
              <div className="bg-[#121419] px-3.5 py-2 border-t border-white/[0.04] flex items-center justify-between text-xs">
                <div className="grid grid-cols-4 gap-4 sm:gap-8 text-center text-zinc-300">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Líp</span>
                    <span className="font-semibold text-[11px] text-zinc-200">{slot.fat}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Carb</span>
                    <span className="font-semibold text-[11px] text-zinc-200">{slot.carbs}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Prot</span>
                    <span className="font-semibold text-[11px] text-zinc-200">{slot.protein}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">%</span>
                    <span className="font-semibold text-[11px] text-emerald-400">{slot.percent}%</span>
                  </div>
                </div>

                {/* Botão de Expandir / Recolher Itens */}
                <button
                  type="button"
                  onClick={() => toggleSlot(slot.key)}
                  aria-label={isExpanded ? 'Recolher detalhes' : 'Expandir detalhes'}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Lista Desdobrável de Itens Registrados */}
              {isExpanded && (
                <div className="p-3 bg-[#111317] border-t border-white/[0.03] space-y-1.5">
                  {slot.meals.length === 0 ? (
                    <div className="py-2.5 text-center">
                      <p className="text-xs text-zinc-500">Nenhum alimento registrado nesta refeição.</p>
                      <button
                        type="button"
                        onClick={() => onOpenLogMeal(null, slot.key)}
                        className="mt-1 text-xs text-emerald-400 hover:underline font-medium cursor-pointer"
                      >
                        + Adicionar primeiro item
                      </button>
                    </div>
                  ) : (
                    slot.meals.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-[#15171d] border border-white/[0.04] text-xs hover:border-white/[0.08] transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-zinc-200 truncate">{item.foodName || item.name || 'Alimento'}</p>
                          <p className="text-[10px] text-zinc-400">
                            {item.quantity}{item.unitSuffix || item.unit || 'g'}
                            {item.equivalentGrams && item.unitSuffix !== 'g' && item.unitSuffix !== 'ml' ? ` (~${item.equivalentGrams}g)` : ''} • {Math.round(item.calories || 0)} kcal • P: {item.protein || 0}g • C: {item.carbs || 0}g • G: {item.fat || 0}g
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveMealItem(item.id)}
                          aria-label={`Remover ${item.foodName || item.name || 'alimento'}`}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </article>
          );
        })}
      </section>

      {/* 4. CARDS DE SUPORTE: HIDRATAÇÃO E ATIVIDADES */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Hidratação Rápida */}
        <article className="bg-[#15171d] border border-white/[0.06] hover:border-cyan-500/25 rounded-2xl p-3.5 shadow-sm fitness-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Droplets className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-zinc-200">Água</h4>
            </div>
            <span className="text-xs font-extrabold text-cyan-400">
              {totalWater} <span className="text-zinc-500 font-normal">/ {settings?.goalWater || 2500} ml</span>
            </span>
          </div>

          <div className="w-full bg-[#111317] h-1.5 rounded-full overflow-hidden mb-3">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-500 macro-shimmer"
              style={{
                width: `${Math.min(100, Math.round((totalWater / (settings?.goalWater || 2500)) * 100))}%`
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onQuickAddWater(250)}
              className="flex-1 py-1 px-2 rounded-lg bg-[#191c23] hover:bg-white/[0.06] active:scale-95 border border-white/[0.05] text-[11px] font-semibold text-zinc-200 transition-all cursor-pointer touch-bounce"
            >
              +250 ml
            </button>
            <button
              type="button"
              onClick={() => onQuickAddWater(500)}
              className="flex-1 py-1 px-2 rounded-lg bg-[#191c23] hover:bg-white/[0.06] active:scale-95 border border-white/[0.05] text-[11px] font-semibold text-zinc-200 transition-all cursor-pointer touch-bounce"
            >
              +500 ml
            </button>
            <button
              type="button"
              onClick={() => onSwitchTab('water')}
              aria-label="Abrir aba de água"
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </article>

        {/* Atividade & Queima */}
        <article className="bg-[#15171d] border border-white/[0.06] hover:border-purple-500/25 rounded-2xl p-3.5 shadow-sm fitness-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Dumbbell className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-zinc-200">Treinos & Queima</h4>
            </div>
            <span className="text-xs font-extrabold text-purple-400">
              {totalBurned} <span className="text-zinc-500 font-normal">kcal</span>
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 mb-2.5">
            {workouts.length === 0
              ? 'Nenhum exercício registrado hoje.'
              : `${workouts.length} ${workouts.length === 1 ? 'treino registrado' : 'treinos registrados'}${
                  workouts.reduce((acc, w) => acc + (w.totalVolumeKg || 0), 0) > 0
                    ? ` • ${workouts.reduce((acc, w) => acc + (w.totalVolumeKg || 0), 0).toLocaleString('pt-BR')} kg levantados`
                    : ''
                }.`}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenAddWorkout()}
              className="flex-1 py-1 px-2 rounded-lg bg-[#191c23] hover:bg-white/[0.06] border border-white/[0.05] text-[11px] font-semibold text-zinc-200 flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Treino</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchTab('workouts')}
              aria-label="Abrir aba de treinos"
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </article>
      </section>

      {/* 4.5 BANNER RELATÓRIOS & EVOLUÇÃO */}
      {onOpenEvolution && (
        <aside
          onClick={onOpenEvolution}
          className="bg-gradient-to-r from-emerald-950/30 via-[#181a20] to-sky-950/25 border border-white/[0.08] hover:border-emerald-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <strong className="text-xs font-bold text-zinc-100 block group-hover:text-emerald-300 transition-colors">
                Relatórios & Evolução Semanal
              </strong>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Balanço calórico, evolução do peso corporal e histórico de hidratação
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 shrink-0">
            <span>Ver Gráficos</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </aside>
      )}

      {/* 5. DESTAQUE CIENTÍFICO & NOTÍCIAS */}
      <section className="bg-[#15171d] border border-white/[0.06] rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <Newspaper className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-zinc-200">Ciência & Descobertas Fitness</h4>
          </div>
          <button
            type="button"
            onClick={() => onSwitchTab('news')}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Ver Feed Completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {FITNESS_NEWS_ARTICLES[0] && (
          <div
            onClick={() => onOpenArticle ? onOpenArticle(FITNESS_NEWS_ARTICLES[0]) : onSwitchTab('news')}
            className="bg-[#121419] hover:bg-[#181a20] border border-white/[0.04] hover:border-white/[0.09] rounded-xl p-3 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {FITNESS_NEWS_ARTICLES[0].categoryLabel}
              </span>
              <span className="text-[10px] text-zinc-500">
                {FITNESS_NEWS_ARTICLES[0].readTime} de leitura
              </span>
            </div>
            <h5 className="text-xs font-bold text-zinc-200 group-hover:text-rose-300 transition-colors leading-snug">
              {FITNESS_NEWS_ARTICLES[0].title}
            </h5>
            <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
              {FITNESS_NEWS_ARTICLES[0].keyTakeaway}
            </p>
          </div>
        )}
      </section>

      {/* MODAL DE EXPLICAÇÃO DA SEQUÊNCIA (STREAK) */}
      {showStreakModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#181a20] border border-white/[0.08] rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400">
              <Flame className="w-5 h-5 fill-amber-400" />
              <h3 className="text-sm font-bold text-zinc-100">Sequência de Registro</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Você manteve o hábito alimentar registrando ao menos uma refeição por dia. Mantenha a sequência registrando suas refeições diariamente!
            </p>
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowStreakModal(false)}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
