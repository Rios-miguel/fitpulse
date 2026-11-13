import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Coffee, 
  Wine, 
  Plus, 
  Bell, 
  BellOff, 
  Volume2, 
  Trash2, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { playWaterChime, playNotificationChime } from '../utils/audio.js';
import {
  getWaterReminderConfig,
  saveWaterReminderConfig,
  requestNotificationPermission,
  triggerWaterNotification
} from '../services/waterNotificationService.js';

export default function WaterTab({
  dailyLog,
  settings,
  onAddWater,
  onRemoveWater,
  onClearWater,
  onOpenNotifications
}) {
  const waterEntries = dailyLog.water || [];
  const totalWater = waterEntries.reduce((acc, w) => acc + (w.amount || 0), 0);
  const goalWater = settings.goalWater || 2500;
  const percent = Math.min(100, Math.round((totalWater / goalWater) * 100));

  // Sync reminder state with waterNotificationService
  const [reminderConfig, setReminderConfig] = useState(() => getWaterReminderConfig());
  const [timerDisplay, setTimerDisplay] = useState('--:--');
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  useEffect(() => {
    const handleConfigChange = (e) => {
      if (e?.detail) setReminderConfig(e.detail);
      else setReminderConfig(getWaterReminderConfig());
    };
    window.addEventListener('fitpulse_reminder_config_changed', handleConfigChange);
    return () => window.removeEventListener('fitpulse_reminder_config_changed', handleConfigChange);
  }, []);

  useEffect(() => {
    if (!reminderConfig.enabled) {
      setTimerDisplay('--:--');
      return;
    }

    const updateTimer = () => {
      const intervalMs = (reminderConfig.intervalMinutes || 60) * 60 * 1000;
      const last = reminderConfig.lastNotified || 0;
      const targetTime = last > 0 ? last + intervalMs : Date.now() + intervalMs;
      const diffMs = targetTime - Date.now();

      if (diffMs <= 0) {
        setTimerDisplay('00:00');
        return;
      }

      const diffSec = Math.floor(diffMs / 1000);
      const m = Math.floor(diffSec / 60);
      const s = diffSec % 60;
      setTimerDisplay(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [reminderConfig]);

  const handleToggleReminder = async () => {
    const nextEnabled = !reminderConfig.enabled;
    if (nextEnabled) {
      await requestNotificationPermission();
    }
    const updated = saveWaterReminderConfig({ enabled: nextEnabled, lastNotified: Date.now() });
    setReminderConfig(updated);
  };

  const handleChangeInterval = (mins) => {
    const updated = saveWaterReminderConfig({ intervalMinutes: mins, lastNotified: Date.now() });
    setReminderConfig(updated);
  };

  const handleTestNotification = () => {
    triggerWaterNotification({ force: true });
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const amt = parseInt(customAmount, 10);
    if (!isNaN(amt) && amt > 0) {
      onAddWater(amt);
      playWaterChime();
      setCustomAmount('');
      setShowCustomModal(false);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Controle de Hidratação</h2>
        <p className="text-xs text-zinc-400">Acompanhe seu consumo diário e mantenha seu metabolismo ativo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Visual Water Bottle & Action Buttons */}
        <div className="bg-[#181a20] border border-white/[0.07] rounded-2xl p-6 flex flex-col items-center justify-between gap-6 shadow-sm">
          {/* Bottle representation */}
          <div className="relative w-36 h-64 flex flex-col items-center">
            {/* Cap */}
            <div className="w-12 h-5 bg-cyan-600/80 rounded-t-lg border border-cyan-400/40 border-b-0 shadow-sm" />
            {/* Bottle Body */}
            <div className="w-full flex-1 bg-[#131418] border-2 border-cyan-500/30 rounded-b-3xl rounded-t-xl relative overflow-hidden shadow-inner">
              {/* Animated Liquid */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-600/90 to-sky-400/80 transition-all duration-700 ease-out"
                style={{ height: `${percent}%` }}
              >
                <div className="water-waves" />
              </div>

              {/* Text overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 drop-shadow-md">
                <span className="text-3xl font-extrabold text-white tracking-tight">{totalWater}</span>
                <span className="text-xs text-cyan-200 font-bold uppercase tracking-wider">ml</span>
                <span className="text-[11px] font-semibold text-white/90 mt-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs">
                  {percent}% da meta
                </span>
              </div>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
            <button
              type="button"
              onClick={() => {
                onAddWater(150);
                playWaterChime();
              }}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#131418] border border-white/[0.06] hover:border-cyan-500/40 hover:bg-cyan-500/10 text-zinc-200 hover:text-cyan-300 transition-all"
            >
              <Coffee className="w-4 h-4 text-cyan-400 mb-1" />
              <span className="text-xs font-semibold">+150 ml</span>
              <small className="text-[10px] text-zinc-500">Xícara</small>
            </button>

            <button
              type="button"
              onClick={() => {
                onAddWater(250);
                playWaterChime();
              }}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#131418] border border-white/[0.06] hover:border-cyan-500/40 hover:bg-cyan-500/10 text-zinc-200 hover:text-cyan-300 transition-all"
            >
              <Wine className="w-4 h-4 text-cyan-400 mb-1" />
              <span className="text-xs font-semibold">+250 ml</span>
              <small className="text-[10px] text-zinc-500">Copo</small>
            </button>

            <button
              type="button"
              onClick={() => {
                onAddWater(500);
                playWaterChime();
              }}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#131418] border border-white/[0.06] hover:border-cyan-500/40 hover:bg-cyan-500/10 text-zinc-200 hover:text-cyan-300 transition-all"
            >
              <Droplets className="w-4 h-4 text-cyan-400 mb-1" />
              <span className="text-xs font-semibold">+500 ml</span>
              <small className="text-[10px] text-zinc-500">Garrafa</small>
            </button>

            <button
              type="button"
              onClick={() => setShowCustomModal(true)}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#131418] border border-white/[0.06] hover:border-cyan-500/40 hover:bg-cyan-500/10 text-zinc-200 hover:text-cyan-300 transition-all"
            >
              <Plus className="w-4 h-4 text-cyan-400 mb-1" />
              <span className="text-xs font-semibold">Outro</span>
              <small className="text-[10px] text-zinc-500">Digitar ml</small>
            </button>
          </div>
        </div>

        {/* Right Column: Lembrete & Histórico */}
        <div className="space-y-4">
          {/* Reminder Card */}
          <div className="bg-[#181a20] border border-white/[0.07] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Bell className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-100">Lembrete Automático</h3>
                  <span className="text-[11px] text-zinc-400">Som, vibração e aviso nativo</span>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={handleToggleReminder}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 border ${
                  reminderConfig.enabled ? 'bg-cyan-500 border-cyan-400' : 'bg-zinc-800 border-zinc-700'
                }`}
                title={reminderConfig.enabled ? 'Desativar lembretes' : 'Ativar lembretes'}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    reminderConfig.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {reminderConfig.enabled && (
              <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Intervalo entre avisos:</span>
                  <select
                    value={reminderConfig.intervalMinutes || 60}
                    onChange={(e) => handleChangeInterval(parseInt(e.target.value, 10))}
                    className="bg-[#131418] border border-white/[0.07] rounded-lg px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="15">A cada 15 min (teste)</option>
                    <option value="30">A cada 30 min</option>
                    <option value="45">A cada 45 min</option>
                    <option value="60">A cada 1 hora</option>
                    <option value="90">A cada 1h30</option>
                    <option value="120">A cada 2 horas</option>
                  </select>
                </div>

                <div className="flex items-center justify-between bg-[#131418] p-2.5 rounded-xl border border-white/[0.05]">
                  <span className="text-xs text-zinc-400 font-medium">Próximo lembrete em:</span>
                  <strong className="text-base font-bold text-cyan-400 font-mono tracking-wider">
                    {timerDisplay}
                  </strong>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleTestNotification}
                    className="py-1.5 bg-[#131418] hover:bg-white/[0.06] text-zinc-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/[0.06] transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Testar Alerta</span>
                  </button>

                  {typeof onOpenNotifications === 'function' && (
                    <button
                      type="button"
                      onClick={onOpenNotifications}
                      className="py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-cyan-500/20 transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Mais Opções</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Today's Log List */}
          <div className="bg-[#181a20] border border-white/[0.07] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
              <h3 className="text-xs font-bold text-zinc-100">Registros de Hoje</h3>
              {waterEntries.length > 0 && (
                <button
                  type="button"
                  onClick={onClearWater}
                  className="text-[11px] font-semibold text-rose-400 hover:underline"
                >
                  Zerar tudo
                </button>
              )}
            </div>

            {waterEntries.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-4">Nenhum copo de água registrado hoje ainda.</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {waterEntries.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#131418] border border-white/[0.05]"
                  >
                    <div className="flex items-center gap-2">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                      <strong className="text-zinc-200">+{w.amount} ml</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 text-[11px]">{w.timestamp}</span>
                      <button
                        type="button"
                        onClick={() => onRemoveWater(w.id)}
                        className="text-zinc-500 hover:text-rose-400 transition-colors"
                        title="Remover este registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Amount Dialog */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 modal-backdrop-anim">
          <div className="bg-[#181a20] border border-white/[0.08] rounded-2xl p-5 max-w-xs w-full shadow-2xl modal-content-anim">
            <h3 className="text-sm font-bold text-zinc-100 mb-2">Registrar Quantidade de Água</h3>
            <p className="text-xs text-zinc-400 mb-4">Informe os mililitros (ml) consumidos:</p>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <input
                type="number"
                min="10"
                max="3000"
                step="10"
                placeholder="Ex: 350"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                autoFocus
                required
                className="w-full bg-[#131418] border border-white/[0.08] rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500/50"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-3 py-1.5 bg-[#131418] hover:bg-white/[0.06] text-zinc-300 rounded-lg text-xs font-semibold border border-white/[0.06]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded-lg text-xs font-bold"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
