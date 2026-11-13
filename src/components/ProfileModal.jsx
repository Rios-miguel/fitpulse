import React, { useState, useMemo } from 'react';
import { 
  X, 
  User, 
  Dumbbell, 
  UtensilsCrossed, 
  Activity, 
  Scale, 
  Target, 
  Check, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Flame, 
  Beef, 
  Wheat, 
  Droplet, 
  Droplets,
  ArrowRight,
  Info,
  Calendar,
  Save,
  CheckCircle2,
  Copy
} from 'lucide-react';

const PROFILE_STORAGE_KEY = 'fitpulse_user_profile_v1';
const SAVED_WORKOUTS_KEY = 'fitpulse_saved_workout_routines_v1';
const SAVED_DIETS_KEY = 'fitpulse_saved_diet_plans_v1';

// Dados Padrão de Perfil
export const DEFAULT_PROFILE = {
  name: 'Miguel Rios',
  gender: 'masculino', // 'masculino' | 'feminino'
  age: 26,
  heightCm: 178,
  weightKg: 75.0,
  targetWeightKg: 72.0,
  activityLevel: 'moderado', // 'sedentario' | 'leve' | 'moderado' | 'intenso' | 'atleta'
  goal: 'recomposicao' // 'cutting' | 'recomposicao' | 'bulking'
};

// Rotinas Salvas Padrão (Exemplos de Treinos Prontos)
export const DEFAULT_SAVED_WORKOUTS = [
  {
    id: 'routine_push_a',
    title: 'Treino A - Peito, Deltoide Anterior & Tríceps',
    durationMinutes: 55,
    exercises: [
      { name: 'Supino Reto com Barra', sets: 4, reps: 10, weight: 60, rpe: 8.5 },
      { name: 'Supino Inclinado com Halteres', sets: 3, reps: 10, weight: 24, rpe: 9 },
      { name: 'Elevação Lateral no Cabo (LLP)', sets: 4, reps: 12, weight: 8, rpe: 9.5 },
      { name: 'Tríceps Corda no Cross', sets: 3, reps: 12, weight: 25, rpe: 9 }
    ]
  },
  {
    id: 'routine_pull_b',
    title: 'Treino B - Dorsais, Trapézio & Bíceps',
    durationMinutes: 50,
    exercises: [
      { name: 'Puxada Alta Aberta', sets: 4, reps: 10, weight: 55, rpe: 8.5 },
      { name: 'Remada Baixa no Triângulo', sets: 3, reps: 10, weight: 50, rpe: 9 },
      { name: 'Crucifixo Invertido', sets: 3, reps: 12, weight: 10, rpe: 8.5 },
      { name: 'Rosca Direta no Cabo', sets: 4, reps: 10, weight: 18, rpe: 9 }
    ]
  },
  {
    id: 'routine_legs_c',
    title: 'Treino C - Quadríceps, Posteriores & Panturrilhas',
    durationMinutes: 60,
    exercises: [
      { name: 'Agachamento Livre / Hack', sets: 4, reps: 8, weight: 80, rpe: 8.5 },
      { name: 'Cadeira Extensora (Alongada)', sets: 3, reps: 12, weight: 45, rpe: 9.5 },
      { name: 'Mesa Flexora', sets: 4, reps: 10, weight: 35, rpe: 9 },
      { name: 'Panturrilha em Pé', sets: 4, reps: 15, weight: 50, rpe: 10 }
    ]
  }
];

// Dietas Salvas Padrão (Exemplos de Planos Prontos)
export const DEFAULT_SAVED_DIETS = [
  {
    id: 'diet_recomposicao_2100',
    title: 'Plano Recomposição Muscular (2.100 kcal)',
    description: 'Alta densidade de proteína (2g/kg) com carboidratos moderados.',
    calories: 2100,
    protein: 160,
    carbs: 210,
    fat: 65,
    meals: [
      { mealType: 'Café da Manhã', foodName: 'Pão Francês com 2 Ovos Mexidos', quantity: 1, unitSuffix: 'unid', calories: 325, protein: 17.1, carbs: 30, fat: 14.5 },
      { mealType: 'Almoço', foodName: 'Prato Fit Frango Grelhado, Arroz e Feijão', quantity: 1, unitSuffix: 'unid', calories: 510, protein: 55, carbs: 56, fat: 5.5 },
      { mealType: 'Lanche da Tarde', foodName: 'Shake Anabólico Hipercalórico (Whey + Banana + Aveia)', quantity: 1, unitSuffix: 'unid', calories: 495, protein: 38.5, carbs: 52, fat: 15.8 },
      { mealType: 'Jantar', foodName: 'Frango com Batata Doce e Salada', quantity: 1, unitSuffix: 'unid', calories: 355, protein: 49, carbs: 28, fat: 4 }
    ]
  },
  {
    id: 'diet_cutting_1750',
    title: 'Plano Definição Máxima / Cutting (1.750 kcal)',
    description: 'Déficit calórico com saciedade e controle de fome.',
    calories: 1750,
    protein: 155,
    carbs: 160,
    fat: 50,
    meals: [
      { mealType: 'Café da Manhã', foodName: 'Crepioca Fit Simples (1 Ovo + Tapioca)', quantity: 1, unitSuffix: 'unid', calories: 146, protein: 6.3, carbs: 18.5, fat: 5 },
      { mealType: 'Almoço', foodName: 'Peito de Frango Grelhado (150g) com Arroz Branco e Salada', quantity: 1, unitSuffix: 'unid', calories: 420, protein: 48, carbs: 42, fat: 5 },
      { mealType: 'Lanche da Tarde', foodName: 'Iogurte Natural c/ Granola e Whey Protein', quantity: 1, unitSuffix: 'unid', calories: 280, protein: 28, carbs: 32, fat: 4 },
      { mealType: 'Jantar', foodName: 'Omelete Completo (3 Ovos e Frango Desfiado)', quantity: 1, unitSuffix: 'unid', calories: 340, protein: 34, carbs: 2.5, fat: 21 }
    ]
  }
];

export default function ProfileModal({
  currentSettings = {},
  onSaveSettings,
  onApplyWorkoutToday,
  onApplyDietToday,
  onClose,
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState('biometry'); // 'biometry' | 'workouts' | 'diets'

  // Perfil
  const [profile, setProfile] = useState(() => {
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!raw) return DEFAULT_PROFILE;
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PROFILE, ...parsed };
    } catch (e) {
      return DEFAULT_PROFILE;
    }
  });

  // Treinos Salvos
  const [savedWorkouts, setSavedWorkouts] = useState(() => {
    try {
      const raw = localStorage.getItem(SAVED_WORKOUTS_KEY);
      if (!raw) return DEFAULT_SAVED_WORKOUTS;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SAVED_WORKOUTS;
    } catch (e) {
      return DEFAULT_SAVED_WORKOUTS;
    }
  });

  // Dietas Salvas
  const [savedDiets, setSavedDiets] = useState(() => {
    try {
      const raw = localStorage.getItem(SAVED_DIETS_KEY);
      if (!raw) return DEFAULT_SAVED_DIETS;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SAVED_DIETS;
    } catch (e) {
      return DEFAULT_SAVED_DIETS;
    }
  });

  // Estado para criar novo treino na aba
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);
  const [newRoutineTitle, setNewRoutineTitle] = useState('');
  const [newRoutineDuration, setNewRoutineDuration] = useState(50);
  const [newRoutineExercises, setNewRoutineExercises] = useState([
    { name: 'Supino Reto', sets: 4, reps: 10, weight: 60, rpe: 8 }
  ]);

  // Cálculos Metabólicos Oficiais (Mifflin-St Jeor)
  const calculations = useMemo(() => {
    const weight = parseFloat(profile.weightKg) || 75;
    const height = parseFloat(profile.heightCm) || 178;
    const age = parseInt(profile.age, 10) || 26;
    const isMale = profile.gender === 'masculino';

    // BMR (Taxa Metabólica Basal)
    let bmr = isMale
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
    bmr = Math.round(bmr);

    // Multiplicador de Atividade
    const multMap = {
      sedentario: 1.2,
      leve: 1.375,
      moderado: 1.55,
      intenso: 1.725,
      atleta: 1.9
    };
    const mult = multMap[profile.activityLevel] || 1.55;
    const tdee = Math.round(bmr * mult);

    // Ajuste pelo Objetivo
    let targetCalories = tdee;
    if (profile.goal === 'cutting') {
      targetCalories = Math.round(tdee - 450); // Déficit moderado sustentável
    } else if (profile.goal === 'bulking') {
      targetCalories = Math.round(tdee + 350); // Superávit limpo
    }

    // Macros Recomendados
    const proteinGrams = Math.round(weight * 2.0); // 2g/kg
    const fatGrams = Math.round(weight * 0.8); // 0.8g/kg
    const proteinCals = proteinGrams * 4;
    const fatCals = fatGrams * 9;
    const remainingCals = Math.max(200, targetCalories - (proteinCals + fatCals));
    const carbsGrams = Math.round(remainingCals / 4);

    // Água Recomendada (35ml/kg)
    const waterMl = Math.round((weight * 35) / 100) * 100;

    // IMC
    const heightM = height / 100;
    const bmi = Number((weight / (heightM * heightM)).toFixed(1));

    return {
      bmr,
      tdee,
      targetCalories,
      proteinGrams,
      carbsGrams,
      fatGrams,
      waterMl,
      bmi
    };
  }, [profile]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      if (onShowToast) onShowToast('Perfil e biometria salvos com sucesso!');
    } catch (e) {}
  };

  const handleApplyCalculatedGoals = () => {
    if (onSaveSettings) {
      onSaveSettings({
        goalCalories: calculations.targetCalories,
        goalProtein: calculations.proteinGrams,
        goalCarbs: calculations.carbsGrams,
        goalFat: calculations.fatGrams,
        goalWater: calculations.waterMl,
        userWeightKg: profile.weightKg
      });
      if (onShowToast) {
        onShowToast(`Metas atualizadas: ${calculations.targetCalories} kcal e ${calculations.proteinGrams}g proteína!`);
      }
    }
  };

  // Funções para Treinos Salvos
  const handleSaveNewRoutine = (e) => {
    e.preventDefault();
    if (!newRoutineTitle.trim()) return;

    const newRoutine = {
      id: 'routine_' + Date.now(),
      title: newRoutineTitle.trim(),
      durationMinutes: parseInt(newRoutineDuration, 10) || 50,
      exercises: newRoutineExercises.filter((ex) => ex.name.trim() !== '')
    };

    const updated = [newRoutine, ...savedWorkouts];
    setSavedWorkouts(updated);
    try {
      localStorage.setItem(SAVED_WORKOUTS_KEY, JSON.stringify(updated));
    } catch (e) {}

    setIsAddingWorkout(false);
    setNewRoutineTitle('');
    setNewRoutineExercises([{ name: '', sets: 3, reps: 10, weight: 20, rpe: 8 }]);
    if (onShowToast) onShowToast('Novo treino salvo com sucesso!');
  };

  const handleDeleteRoutine = (routineId) => {
    const updated = savedWorkouts.filter((r) => r.id !== routineId);
    setSavedWorkouts(updated);
    try {
      localStorage.setItem(SAVED_WORKOUTS_KEY, JSON.stringify(updated));
    } catch (e) {}
    if (onShowToast) onShowToast('Treino removido das rotinas.');
  };

  const handleLoadRoutineToday = (routine) => {
    if (onApplyWorkoutToday) {
      onApplyWorkoutToday(routine);
      if (onShowToast) onShowToast(`Treino "${routine.title}" registrado no seu dia de hoje!`);
      onClose();
    }
  };

  // Funções para Dietas Salvas
  const handleDeleteDiet = (dietId) => {
    const updated = savedDiets.filter((d) => d.id !== dietId);
    setSavedDiets(updated);
    try {
      localStorage.setItem(SAVED_DIETS_KEY, JSON.stringify(updated));
    } catch (e) {}
    if (onShowToast) onShowToast('Dieta removida.');
  };

  const handleLoadDietToday = (diet) => {
    if (onApplyDietToday) {
      onApplyDietToday(diet);
      if (onShowToast) onShowToast(`Dieta "${diet.title}" aplicada nas suas refeições de hoje!`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto modal-backdrop-anim">
      <div className="bg-[#181a20] border border-white/[0.08] rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col modal-content-anim">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-sm">
              <div className="w-full h-full rounded-full bg-[#181a20] flex items-center justify-center text-emerald-400 font-bold">
                <User className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                <span>{profile.name || 'Seu Perfil'}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {profile.goal === 'cutting' ? 'Cutting' : profile.goal === 'bulking' ? 'Bulking' : 'Recomposição'}
                </span>
              </h2>
              <p className="text-[10px] text-zinc-400">
                {profile.age} anos • {profile.heightCm}cm • {profile.weightKg}kg • IMC {calculations.bmi}
              </p>
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

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 p-2 bg-[#131418] border-b border-white/[0.06] gap-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('biometry')}
            className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'biometry'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Biometria & Metas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('workouts')}
            className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'workouts'
                ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Treinos Salvos ({savedWorkouts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('diets')}
            className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'diets'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Dietas Salvas ({savedDiets.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* TAB 1: BIOMETRIA & DADOS PESSOAIS */}
          {activeTab === 'biometry' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Personal Info Grid */}
              <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3.5 space-y-3">
                <span className="text-xs font-bold text-zinc-200 block">Dados Pessoais & Antropometria</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-zinc-400 font-semibold block mb-1">Seu Nome / Apelido:</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-[#181a20] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-100 font-bold focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 font-semibold block mb-1">Gênero Biológico:</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setProfile({ ...profile, gender: 'masculino' })}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          profile.gender === 'masculino'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-xs'
                            : 'bg-[#181a20] text-zinc-400 border-white/[0.06]'
                        }`}
                      >
                        Masculino
                      </button>
                      <button
                        type="button"
                        onClick={() => setProfile({ ...profile, gender: 'feminino' })}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          profile.gender === 'feminino'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-xs'
                            : 'bg-[#181a20] text-zinc-400 border-white/[0.06]'
                        }`}
                      >
                        Feminino
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-zinc-400 font-semibold block mb-1">Idade:</label>
                    <input
                      type="number"
                      min="10"
                      max="120"
                      value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value, 10) || 20 })}
                      className="w-full bg-[#181a20] border border-white/[0.08] rounded-xl px-2 py-1.5 text-xs text-center font-bold text-zinc-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 font-semibold block mb-1">Altura (cm):</label>
                    <input
                      type="number"
                      min="100"
                      max="250"
                      value={profile.heightCm}
                      onChange={(e) => setProfile({ ...profile, heightCm: parseInt(e.target.value, 10) || 170 })}
                      className="w-full bg-[#181a20] border border-white/[0.08] rounded-xl px-2 py-1.5 text-xs text-center font-bold text-zinc-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 font-semibold block mb-1">Peso (kg):</label>
                    <input
                      type="number"
                      step="0.1"
                      min="30"
                      max="300"
                      value={profile.weightKg}
                      onChange={(e) => setProfile({ ...profile, weightKg: parseFloat(e.target.value) || 70 })}
                      className="w-full bg-[#181a20] border border-white/[0.08] rounded-xl px-2 py-1.5 text-xs text-center font-bold text-zinc-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 font-semibold block mb-1">Meta (kg):</label>
                    <input
                      type="number"
                      step="0.1"
                      min="30"
                      max="300"
                      value={profile.targetWeightKg}
                      onChange={(e) => setProfile({ ...profile, targetWeightKg: parseFloat(e.target.value) || 70 })}
                      className="w-full bg-[#181a20] border border-white/[0.08] rounded-xl px-2 py-1.5 text-xs text-center font-bold text-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Activity Level & Goal */}
              <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3.5 space-y-3">
                <div>
                  <label className="text-xs font-bold text-zinc-200 block mb-1.5">
                    Nível de Atividade Física Semanal:
                  </label>
                  <select
                    value={profile.activityLevel}
                    onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value })}
                    className="w-full bg-[#181a20] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-100 font-semibold focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="sedentario">Sedentário (pouco ou nenhum exercício)</option>
                    <option value="leve">Levemente Ativo (exercício 1 a 3 dias/semana)</option>
                    <option value="moderado">Moderadamente Ativo (treino 3 a 5 dias/semana)</option>
                    <option value="intenso">Muito Ativo (treino pesado 6 a 7 dias/semana)</option>
                    <option value="atleta">Atleta / Trabalho Físico Intenso (2x treinos/dia)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-200 block mb-1.5">
                    Objetivo Principal:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, goal: 'cutting' })}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        profile.goal === 'cutting'
                          ? 'bg-sky-500/15 text-sky-300 border-sky-500/40 shadow-xs'
                          : 'bg-[#181a20] text-zinc-400 border-white/[0.06]'
                      }`}
                    >
                      Emagrecer / Secar
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, goal: 'recomposicao' })}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        profile.goal === 'recomposicao'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-xs'
                          : 'bg-[#181a20] text-zinc-400 border-white/[0.06]'
                      }`}
                    >
                      Manter / Recomposição
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, goal: 'bulking' })}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        profile.goal === 'bulking'
                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/40 shadow-xs'
                          : 'bg-[#181a20] text-zinc-400 border-white/[0.06]'
                      }`}
                    >
                      Hipertrofia / Ganho
                    </button>
                  </div>
                </div>
              </div>

              {/* Automatic Calculated Results Card */}
              <div className="bg-gradient-to-br from-emerald-950/30 to-[#131418] border border-emerald-500/25 rounded-2xl p-4 space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300">
                      Cálculo Científico Personalizado
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400">Fórmula Mifflin-St Jeor</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[#181a20]/80 p-2 rounded-xl border border-white/[0.05]">
                    <span className="text-[10px] text-zinc-400 block">Taxa Basal (TMB):</span>
                    <strong className="text-sm font-extrabold text-zinc-100">{calculations.bmr} kcal</strong>
                  </div>
                  <div className="bg-[#181a20]/80 p-2 rounded-xl border border-white/[0.05]">
                    <span className="text-[10px] text-zinc-400 block">Gasto Total (TDEE):</span>
                    <strong className="text-sm font-extrabold text-zinc-100">{calculations.tdee} kcal</strong>
                  </div>
                  <div className="bg-[#181a20]/80 p-2 rounded-xl border border-emerald-500/30">
                    <span className="text-[10px] text-emerald-400 font-semibold block">Meta Ideal:</span>
                    <strong className="text-sm font-extrabold text-emerald-300">{calculations.targetCalories} kcal</strong>
                  </div>
                </div>

                {/* Recommended Macros */}
                <div className="grid grid-cols-4 gap-1.5 pt-1 text-center text-xs">
                  <div className="bg-[#181a20] p-1.5 rounded-lg border border-sky-500/20">
                    <span className="text-[9px] text-sky-400 font-bold block">Proteína</span>
                    <strong className="text-xs text-zinc-100">{calculations.proteinGrams}g</strong>
                  </div>
                  <div className="bg-[#181a20] p-1.5 rounded-lg border border-amber-500/20">
                    <span className="text-[9px] text-amber-400 font-bold block">Carboidrato</span>
                    <strong className="text-xs text-zinc-100">{calculations.carbsGrams}g</strong>
                  </div>
                  <div className="bg-[#181a20] p-1.5 rounded-lg border border-rose-500/20">
                    <span className="text-[9px] text-rose-400 font-bold block">Gordura</span>
                    <strong className="text-xs text-zinc-100">{calculations.fatGrams}g</strong>
                  </div>
                  <div className="bg-[#181a20] p-1.5 rounded-lg border border-cyan-500/20">
                    <span className="text-[9px] text-cyan-400 font-bold block">Água</span>
                    <strong className="text-xs text-zinc-100">{calculations.waterMl}ml</strong>
                  </div>
                </div>

                {/* Button to Apply Goals Directly to App Settings */}
                <button
                  type="button"
                  onClick={handleApplyCalculatedGoals}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aplicar Estas Metas Automaticamente no Meu FitPulse</span>
                </button>
              </div>

              {/* Save Profile Button */}
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#181a20] hover:bg-white/[0.06] border border-white/[0.08] text-zinc-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-emerald-400" />
                  <span>Salvar Dados de Perfil</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: TREINOS SALVOS (ROTINAS) */}
          {activeTab === 'workouts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-200 block">Suas Divisões de Treino</span>
                  <span className="text-[10px] text-zinc-400">
                    Carregue qualquer treino salvo no dia de hoje com 1 clique
                  </span>
                </div>
                {!isAddingWorkout && (
                  <button
                    type="button"
                    onClick={() => setIsAddingWorkout(true)}
                    className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Criar Treino</span>
                  </button>
                )}
              </div>

              {/* New Routine Form */}
              {isAddingWorkout && (
                <form
                  onSubmit={handleSaveNewRoutine}
                  className="bg-[#131418] border border-purple-500/30 rounded-2xl p-3.5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300">Nova Rotina Salva</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingWorkout(false)}
                      className="text-zinc-500 hover:text-zinc-300 text-xs"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="text-[10px] text-zinc-400 block mb-1">Título do Treino:</label>
                      <input
                        type="text"
                        placeholder="Ex: Treino A - Peito e Tríceps"
                        value={newRoutineTitle}
                        onChange={(e) => setNewRoutineTitle(e.target.value)}
                        required
                        className="w-full bg-[#181a20] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-zinc-100 font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-[10px] text-zinc-400 block mb-1">Duração (min):</label>
                      <input
                        type="number"
                        min="10"
                        max="240"
                        value={newRoutineDuration}
                        onChange={(e) => setNewRoutineDuration(e.target.value)}
                        className="w-full bg-[#181a20] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-center text-zinc-100 font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Exercise list builder */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">Exercícios Planejados:</span>
                      <button
                        type="button"
                        onClick={() =>
                          setNewRoutineExercises([
                            ...newRoutineExercises,
                            { name: '', sets: 3, reps: 10, weight: 20, rpe: 8 }
                          ])
                        }
                        className="text-[10px] text-purple-400 font-bold hover:underline"
                      >
                        + Exercício
                      </button>
                    </div>

                    {newRoutineExercises.map((ex, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-xs">
                        <input
                          type="text"
                          placeholder="Nome do exercício"
                          value={ex.name}
                          onChange={(e) => {
                            const updated = [...newRoutineExercises];
                            updated[idx].name = e.target.value;
                            setNewRoutineExercises(updated);
                          }}
                          className="flex-1 bg-[#181a20] border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-zinc-100"
                        />
                        <input
                          type="number"
                          placeholder="Séries"
                          value={ex.sets}
                          onChange={(e) => {
                            const updated = [...newRoutineExercises];
                            updated[idx].sets = parseInt(e.target.value, 10) || 3;
                            setNewRoutineExercises(updated);
                          }}
                          className="w-12 bg-[#181a20] border border-white/[0.08] rounded-lg py-1 text-center text-xs text-zinc-100"
                          title="Séries"
                        />
                        <input
                          type="number"
                          placeholder="Reps"
                          value={ex.reps}
                          onChange={(e) => {
                            const updated = [...newRoutineExercises];
                            updated[idx].reps = parseInt(e.target.value, 10) || 10;
                            setNewRoutineExercises(updated);
                          }}
                          className="w-12 bg-[#181a20] border border-white/[0.08] rounded-lg py-1 text-center text-xs text-zinc-100"
                          title="Repetições"
                        />
                        <input
                          type="number"
                          placeholder="kg"
                          value={ex.weight}
                          onChange={(e) => {
                            const updated = [...newRoutineExercises];
                            updated[idx].weight = parseFloat(e.target.value) || 0;
                            setNewRoutineExercises(updated);
                          }}
                          className="w-14 bg-[#181a20] border border-white/[0.08] rounded-lg py-1 text-center text-xs text-zinc-100"
                          title="Carga (kg)"
                        />
                        {newRoutineExercises.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setNewRoutineExercises(newRoutineExercises.filter((_, i) => i !== idx))
                            }
                            className="p-1 text-zinc-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition-colors"
                    >
                      Salvar Treino
                    </button>
                  </div>
                </form>
              )}

              {/* List of Saved Routines */}
              <div className="space-y-3">
                {savedWorkouts.map((routine) => {
                  const totalExercises = routine.exercises ? routine.exercises.length : 0;
                  const estimatedVolume = (routine.exercises || []).reduce(
                    (acc, ex) => acc + (ex.sets || 3) * (ex.reps || 10) * (ex.weight || 20),
                    0
                  );

                  return (
                    <div
                      key={routine.id}
                      className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3.5 space-y-2.5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <strong className="text-xs font-bold text-zinc-100 block">
                            {routine.title}
                          </strong>
                          <span className="text-[10px] text-zinc-400">
                            {routine.durationMinutes} min • {totalExercises} exercícios • Vol: ~{estimatedVolume.toLocaleString('pt-BR')} kg
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleLoadRoutineToday(routine)}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                            title="Registrar este treino hoje"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Carregar Hoje</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteRoutine(routine.id)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Remover rotina"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Exercises breakdown preview */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {(routine.exercises || []).map((ex, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-xl bg-[#181a20] border border-white/[0.04] text-[11px] text-zinc-300 flex items-center justify-between"
                          >
                            <span className="font-semibold truncate pr-1">{ex.name}</span>
                            <span className="text-[10px] text-purple-300 font-mono shrink-0">
                              {ex.sets}x{ex.reps} ({ex.weight}kg)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DIETAS SALVAS (PLANOS ALIMENTARES) */}
          {activeTab === 'diets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-200 block">Seus Planos Alimentares</span>
                  <span className="text-[10px] text-zinc-400">
                    Aplique qualquer dieta completa no seu diário com 1 clique
                  </span>
                </div>
              </div>

              {/* Diet Cards */}
              <div className="space-y-3">
                {savedDiets.map((diet) => (
                  <div
                    key={diet.id}
                    className="bg-[#131418] border border-white/[0.06] rounded-2xl p-3.5 space-y-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <strong className="text-xs font-bold text-zinc-100 block">{diet.title}</strong>
                        {diet.description && (
                          <p className="text-[11px] text-zinc-400 mt-0.5">{diet.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold">
                          <span className="text-emerald-400">{diet.calories} kcal</span>
                          <span className="text-sky-400">{diet.protein}g P</span>
                          <span className="text-amber-400">{diet.carbs}g C</span>
                          <span className="text-rose-400">{diet.fat}g G</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleLoadDietToday(diet)}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                          title="Aplicar todas as refeições desta dieta hoje"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Aplicar no Dia</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteDiet(diet.id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remover dieta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Meal items breakdown */}
                    <div className="space-y-1.5 pt-1 border-t border-white/[0.04]">
                      {(diet.meals || []).map((m, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-xl bg-[#181a20] border border-white/[0.04] text-[11px] flex items-center justify-between"
                        >
                          <div>
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                              {m.mealType}
                            </span>
                            <span className="text-zinc-200 font-medium">{m.foodName}</span>
                          </div>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {m.calories} kcal • {m.protein}g P
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#131418] border-t border-white/[0.06] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            Fechar Perfil
          </button>
        </div>
      </div>
    </div>
  );
}
