import React, { useState, useEffect, useMemo, useTransition } from 'react';
import Header from './components/Header.jsx';
import BottomNav from './components/BottomNav.jsx';
import DashboardTab from './components/DashboardTab.jsx';
import MealsTab from './components/MealsTab.jsx';
import FoodDbTab from './components/FoodDbTab.jsx';
import WaterTab from './components/WaterTab.jsx';
import WorkoutsTab from './components/WorkoutsTab.jsx';
import NewsTab from './components/NewsTab.jsx';

import RecipeDetailsModal from './components/RecipeDetailsModal.jsx';
import LogMealModal from './components/LogMealModal.jsx';
import NewFoodModal from './components/NewFoodModal.jsx';
import AddWorkoutModal from './components/AddWorkoutModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import ArticleModal from './components/ArticleModal.jsx';
import EvolutionModal from './components/EvolutionModal.jsx';
import ProfileModal from './components/ProfileModal.jsx';
import NotificationsModal from './components/NotificationsModal.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

import { CheckCircle2 } from 'lucide-react';
import { TACO_OFFICIAL_DATABASE } from './data/foodDb.js';
import { checkAndTriggerReminder } from './services/waterNotificationService.js';

const STORAGE_KEYS = {
  CUSTOM_FOODS: 'fitpulse_custom_foods_v1',
  DAILY_LOGS: 'fitpulse_daily_logs_v1',
  SETTINGS: 'fitpulse_settings_v1',
  BOOKMARKED_ARTICLES: 'fitpulse_saved_articles_v1'
};

const DEFAULT_SETTINGS = {
  goalCalories: 2000,
  goalProtein: 150,
  goalCarbs: 200,
  goalFat: 60,
  goalWater: 2500,
  userWeightKg: 75
};

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentDate, setCurrentDate] = useState(getTodayDateString());

  const handleTabChange = (nextTab) => {
    if (nextTab === activeTab) return;
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      document.startViewTransition(() => {
        setActiveTab(nextTab);
      });
    } else {
      setActiveTab(nextTab);
    }
  };

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  const [customFoods, setCustomFoods] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_FOODS);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  const [dailyLogs, setDailyLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
      const parsed = saved ? JSON.parse(saved) : {};
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (e) {
      return {};
    }
  });

  // Modal States
  const [logMealState, setLogMealState] = useState({ open: false, food: null, mealType: 'Almoço' });
  const [recipeDetailsState, setRecipeDetailsState] = useState({ open: false, recipe: null });
  const [isNewFoodOpen, setIsNewFoodOpen] = useState(false);
  const [addWorkoutState, setAddWorkoutState] = useState({ open: false, exercise: null });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEvolutionOpen, setIsEvolutionOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Bookmarked Articles
  const [bookmarkedArticles, setBookmarkedArticles] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKED_ARTICLES);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleToggleBookmarkArticle = (articleId) => {
    setBookmarkedArticles((prev) => {
      const exists = prev.includes(articleId);
      if (exists) {
        showToast('Estudo removido dos seus favoritos.');
        return prev.filter((id) => id !== articleId);
      } else {
        showToast('Estudo salvo nos seus favoritos!');
        return [...prev, articleId];
      }
    });
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_FOODS, JSON.stringify(customFoods));
  }, [customFoods]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKED_ARTICLES, JSON.stringify(bookmarkedArticles));
  }, [bookmarkedArticles]);

  // Food Database combined
  const fullFoodDatabase = useMemo(() => {
    return [...customFoods, ...TACO_OFFICIAL_DATABASE];
  }, [customFoods]);

  // Current Day Log
  const currentDayLog = useMemo(() => {
    if (!dailyLogs[currentDate]) {
      return { meals: [], water: [], workouts: [] };
    }
    return dailyLogs[currentDate];
  }, [dailyLogs, currentDate]);

  // Helper to update current day log
  const updateDayLog = (mutator) => {
    setDailyLogs((prev) => {
      const dayData = prev[currentDate] || { meals: [], water: [], workouts: [] };
      const updatedDay = mutator({ ...dayData });
      return {
        ...prev,
        [currentDate]: updatedDay
      };
    });
  };

  // Handlers
  const handleSaveMeal = (mealEntry) => {
    updateDayLog((day) => {
      return {
        ...day,
        meals: [...(day.meals || []), mealEntry]
      };
    });
    showToast(`+${mealEntry.calories} kcal adicionadas ao ${mealEntry.mealType}!`);
  };

  const handleRemoveMealItem = (itemId) => {
    updateDayLog((day) => {
      return {
        ...day,
        meals: (day.meals || []).filter((m) => m.id !== itemId)
      };
    });
  };

  const handleAddWater = (amount) => {
    const entry = {
      id: 'water_' + Date.now(),
      amount,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    updateDayLog((day) => {
      return {
        ...day,
        water: [...(day.water || []), entry]
      };
    });
    showToast(`+${amount}ml de água registrados! 💧`);
  };

  const handleRemoveWater = (waterId) => {
    updateDayLog((day) => {
      return {
        ...day,
        water: (day.water || []).filter((w) => w.id !== waterId)
      };
    });
  };

  const handleClearWater = () => {
    if (window.confirm('Deseja zerar os registros de água de hoje?')) {
      updateDayLog((day) => ({ ...day, water: [] }));
      showToast('Registros de água zerados.');
    }
  };

  const handleSaveWorkout = (workout) => {
    updateDayLog((day) => {
      return {
        ...day,
        workouts: [...(day.workouts || []), workout]
      };
    });
    showToast(`Treino "${workout.title}" salvo! 🔥 ${workout.caloriesBurned} kcal`);
  };

  const handleRemoveWorkout = (workoutId) => {
    updateDayLog((day) => {
      return {
        ...day,
        workouts: (day.workouts || []).filter((w) => w.id !== workoutId)
      };
    });
  };

  const handleSaveCustomFood = (food) => {
    setCustomFoods((prev) => [food, ...prev]);
    showToast(`"${food.name}" cadastrado no seu banco!`);
  };

  const handleDeleteCustomFood = (foodId) => {
    if (window.confirm('Deseja realmente remover este alimento personalizado?')) {
      setCustomFoods((prev) => prev.filter((f) => f.id !== foodId));
      showToast('Alimento personalizado removido.');
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      version: 3,
      framework: 'React + Vite + Tailwind CSS',
      exportedAt: new Date().toISOString(),
      settings,
      customFoods,
      dailyLogs
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitpulse_backup_${currentDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exportado com sucesso!');
  };

  const handleImportBackup = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.settings) setSettings(imported.settings);
        if (imported.customFoods) setCustomFoods(imported.customFoods);
        if (imported.dailyLogs) setDailyLogs(imported.dailyLogs);
        showToast('Dados restaurados com sucesso do backup!');
      } catch (err) {
        alert('Erro ao processar arquivo JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Background timer para lembretes tradicionais de hidratação
  useEffect(() => {
    const timer = setInterval(() => {
      checkAndTriggerReminder(showToast);
    }, 25000);
    return () => clearInterval(timer);
  }, []);

  const handleApplyWorkoutToday = (routine) => {
    if (!routine) return;
    const exDuration = routine.durationMinutes || 50;
    const userW = settings.userWeightKg || 75;
    const met = 5.0;
    const autoKcal = Math.round(met * userW * (exDuration / 60));

    const totalVol = (routine.exercises || []).reduce(
      (acc, ex) => acc + (ex.sets || 3) * (ex.reps || 10) * (ex.weight || 20),
      0
    );

    const formattedExercises = (routine.exercises || []).map((ex, exIdx) => ({
      id: 'ex_' + Date.now() + '_' + exIdx,
      name: ex.name,
      volumeKg: (ex.sets || 3) * (ex.reps || 10) * (ex.weight || 20),
      sets: Array.from({ length: ex.sets || 3 }).map((_, sIdx) => ({
        setNumber: sIdx + 1,
        weight: ex.weight || 20,
        reps: ex.reps || 10,
        rpe: ex.rpe || 8.5,
        completed: true
      }))
    }));

    const newWorkout = {
      id: 'workout_' + Date.now(),
      title: routine.title,
      exerciseId: 'ex_musculacao_vigorosa',
      metValue: met,
      durationMinutes: exDuration,
      caloriesBurned: autoKcal,
      totalVolumeKg: Math.round(totalVol),
      totalSetsCount: (routine.exercises || []).reduce((acc, ex) => acc + (ex.sets || 3), 0),
      notes: `Treino carregado do perfil: ${routine.title}`,
      exercises: formattedExercises,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setDailyLogs((prev) => {
      const cur = prev[currentDate] || {};
      const curWorkouts = cur.workouts || [];
      const next = {
        ...prev,
        [currentDate]: {
          ...cur,
          workouts: [newWorkout, ...curWorkouts]
        }
      };
      try {
        localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    showToast(`Treino "${routine.title}" registrado no seu dia de hoje!`);
  };

  const handleApplyDietToday = (diet) => {
    if (!diet || !Array.isArray(diet.meals)) return;
    const newMealItems = diet.meals.map((m, idx) => ({
      id: 'meal_item_' + Date.now() + '_' + idx,
      mealType: m.mealType || 'Almoço',
      foodId: 'diet_item_' + idx,
      foodName: m.foodName,
      portionType: 'unidade',
      unitMode: 'unidade',
      unitSuffix: m.unitSuffix || 'unid',
      quantity: m.quantity || 1,
      calories: m.calories || 0,
      protein: m.protein || 0,
      carbs: m.carbs || 0,
      fat: m.fat || 0,
      fiber: 0,
      source: `Plano Salvo: ${diet.title}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }));

    setDailyLogs((prev) => {
      const cur = prev[currentDate] || {};
      const curMeals = cur.meals || [];
      const next = {
        ...prev,
        [currentDate]: {
          ...cur,
          meals: [...curMeals, ...newMealItems]
        }
      };
      try {
        localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    showToast(`Plano "${diet.title}" aplicado no seu diário de hoje!`);
  };

  const handleResetFactory = () => {
    if (window.confirm('Tem certeza? Isso apagará os dados salvos neste navegador.')) {
      localStorage.clear();
      setSettings(DEFAULT_SETTINGS);
      setCustomFoods([]);
      setDailyLogs({});
      showToast('Aplicativo restaurado de fábrica.');
    }
  };

  return (
    <div className="min-h-screen bg-[#101216] text-zinc-100 flex flex-col antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Header */}
      <Header
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSearch={() => handleTabChange('foodDb')}
        onOpenEvolution={() => setIsEvolutionOpen(true)}
      />

      {/* Main Container with smooth view animation and mobile safe bottom padding */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-5 pb-28 sm:pb-24">
        <div key={activeTab} className="tab-content-enter">
          <ErrorBoundary fallbackTitle="Erro ao carregar aba. Clique para restaurar.">
            {activeTab === 'dashboard' && (
              <DashboardTab
                dailyLog={currentDayLog}
                settings={settings}
                currentDate={currentDate}
                dailyLogs={dailyLogs}
                onSelectDate={setCurrentDate}
                onOpenLogMeal={(food, cat) => setLogMealState({ open: true, food, mealType: cat || 'Almoço' })}
                onOpenAddWorkout={(ex) => setAddWorkoutState({ open: true, exercise: ex })}
                onQuickAddWater={handleAddWater}
                onSwitchTab={handleTabChange}
                onRemoveMealItem={handleRemoveMealItem}
                onOpenArticle={(art) => setSelectedArticle(art)}
                onOpenEvolution={() => setIsEvolutionOpen(true)}
                onOpenProfile={() => setIsProfileOpen(true)}
              />
            )}

            {activeTab === 'meals' && (
              <MealsTab
                dailyLog={currentDayLog}
                currentDate={currentDate}
                dailyLogs={dailyLogs}
                onSelectDate={setCurrentDate}
                onOpenLogMeal={(food, cat) => setLogMealState({ open: true, food, mealType: cat || 'Almoço' })}
                onRemoveMealItem={handleRemoveMealItem}
              />
            )}

            {activeTab === 'foodDb' && (
              <FoodDbTab
                foodDatabase={fullFoodDatabase}
                onOpenNewFood={() => setIsNewFoodOpen(true)}
                onOpenRecipeDetails={(recipe) => setRecipeDetailsState({ open: true, recipe })}
                onStartLogFood={(food) => setLogMealState({ open: true, food, mealType: 'Almoço' })}
                onDeleteCustomFood={handleDeleteCustomFood}
              />
            )}

            {activeTab === 'water' && (
              <WaterTab
                dailyLog={currentDayLog}
                settings={settings}
                onAddWater={handleAddWater}
                onRemoveWater={handleRemoveWater}
                onClearWater={handleClearWater}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
              />
            )}

            {activeTab === 'workouts' && (
              <WorkoutsTab
                dailyLog={currentDayLog}
                settings={settings}
                onOpenAddWorkout={(ex) => setAddWorkoutState({ open: true, exercise: ex })}
                onRemoveWorkout={handleRemoveWorkout}
              />
            )}

            {activeTab === 'news' && (
              <NewsTab
                bookmarkedArticleIds={bookmarkedArticles}
                onToggleBookmark={handleToggleBookmarkArticle}
                onOpenArticle={(art) => setSelectedArticle(art)}
              />
            )}
          </ErrorBoundary>
        </div>
      </main>

      {/* Toast Notification - Sleek charcoal floating pill */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#1c1f26]/95 border border-white/[0.12] text-zinc-200 font-medium px-4 py-2 rounded-full text-xs shadow-xl shadow-black/60 backdrop-blur-md flex items-center gap-2 tab-content-enter">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* MODALS */}
      {recipeDetailsState.open && (
        <RecipeDetailsModal
          recipe={recipeDetailsState.recipe}
          onClose={() => setRecipeDetailsState({ open: false, recipe: null })}
          onConsume={(rec) => setLogMealState({ open: true, food: rec, mealType: 'Almoço' })}
        />
      )}

      {logMealState.open && (
        <LogMealModal
          foodDatabase={fullFoodDatabase}
          initialFood={logMealState.food}
          initialMealType={logMealState.mealType}
          onClose={() => setLogMealState({ open: false, food: null, mealType: 'Almoço' })}
          onSaveMeal={handleSaveMeal}
        />
      )}

      {isNewFoodOpen && (
        <NewFoodModal
          onClose={() => setIsNewFoodOpen(false)}
          onSaveFood={handleSaveCustomFood}
        />
      )}

      {addWorkoutState.open && (
        <AddWorkoutModal
          initialExercise={addWorkoutState.exercise}
          userWeightKg={settings.userWeightKg}
          onClose={() => setAddWorkoutState({ open: false, exercise: null })}
          onSaveWorkout={handleSaveWorkout}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onSaveSettings={setSettings}
          onExportBackup={handleExportBackup}
          onImportBackup={handleImportBackup}
          onResetFactory={handleResetFactory}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          isBookmarked={Array.isArray(bookmarkedArticles) && selectedArticle?.id ? bookmarkedArticles.includes(selectedArticle.id) : false}
          onToggleBookmark={handleToggleBookmarkArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}

      {isEvolutionOpen && (
        <EvolutionModal
          dailyLogs={dailyLogs}
          settings={settings}
          currentDate={currentDate}
          onClose={() => setIsEvolutionOpen(false)}
          onUpdateWeight={(newW) => {
            setSettings((prev) => {
              const next = { ...prev, userWeightKg: newW };
              try {
                localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(next));
              } catch (e) {}
              return next;
            });
            showToast(`Peso atualizado para ${newW} kg!`);
          }}
        />
      )}

      {/* Perfil do Usuário com Biometria, Metas e Treinos/Dietas Salvos */}
      {isProfileOpen && (
        <ProfileModal
          currentSettings={settings}
          onSaveSettings={setSettings}
          onApplyWorkoutToday={handleApplyWorkoutToday}
          onApplyDietToday={handleApplyDietToday}
          onClose={() => setIsProfileOpen(false)}
          onShowToast={showToast}
        />
      )}

      {/* Sistema Tradicional de Notificações de Água */}
      {isNotificationsOpen && (
        <NotificationsModal
          onClose={() => setIsNotificationsOpen(false)}
          onShowToast={showToast}
          dailyLog={currentDayLog}
        />
      )}
    </div>
  );
}
