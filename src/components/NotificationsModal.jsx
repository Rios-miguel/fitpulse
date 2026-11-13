import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bell, 
  Droplets, 
  Clock, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Check, 
  Sparkles, 
  AlertCircle,
  Play,
  Flame,
  Target
} from 'lucide-react';
import { 
  getWaterReminderConfig, 
  saveWaterReminderConfig, 
  requestNotificationPermission, 
  triggerWaterNotification 
} from '../services/waterNotificationService.js';

export default function NotificationsModal({
  onClose,
  onShowToast,
  streakDays = 2,
  dailyLog = {}
}) {
  const [config, setConfig] = useState(() => getWaterReminderConfig());
  const [permissionStatus, setPermissionStatus] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const [testSent, setTestSent] = useState(false);

  const handleToggleEnabled = () => {
    const next = !config.enabled;
    const updated = saveWaterReminderConfig({ enabled: next, lastNotified: Date.now() });
    setConfig(updated);
    if (next && permissionStatus === 'default') {
      handleRequestPermission();
    }
  };

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermissionStatus(res);
    if (res === 'granted' && onShowToast) {
      onShowToast('Notificações no navegador ativadas com sucesso!');
    }
  };

  const handleIntervalChange = (min) => {
    const updated = saveWaterReminderConfig({ intervalMinutes: min, lastNotified: Date.now() });
    setConfig(updated);
  };

  const handleToggleSound = () => {
    const updated = saveWaterReminderConfig({ sound: !config.sound });
    setConfig(updated);
  };

  const handleToggleVibration = () => {
    const updated = saveWaterReminderConfig({ vibration: !config.vibration });
    setConfig(updated);
  };

  const handleTestNotification = () => {
    setTestSent(true);
    triggerWaterNotification({ force: true, onToast: onShowToast });
    setTimeout(() => setTestSent(false), 2000);
  };

  const intervals = [
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '1 hora', value: 60 },
    { label: '1h 30m', value: 90 },
    { label: '2 horas', value: 120 }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto modal-backdrop-anim">
      <div className="bg-[#181a20] border border-white/[0.08] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col modal-content-anim">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100">Lembretes & Notificações</h2>
              <p className="text-[10px] text-zinc-400">Sistema tradicional de alertas e hidratação</p>
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

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Permission Banner if not granted */}
          {permissionStatus !== 'granted' && permissionStatus !== 'unsupported' && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 flex items-start justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs font-bold text-amber-200 block">
                    Notificações do Sistema Desativadas
                  </strong>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Permita as notificações no navegador para receber avisos na barra do celular mesmo fora da aba.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRequestPermission}
                className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-[11px] shrink-0 transition-colors cursor-pointer"
              >
                Permitir
              </button>
            </div>
          )}

          {/* Hydration Reminder Card */}
          <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-100">Lembrete Periódico de Água</h3>
                  <span className="text-[10px] text-zinc-400">Avisos sonoros e na tela</span>
                </div>
              </div>

              {/* Main Toggle Switch */}
              <button
                type="button"
                onClick={handleToggleEnabled}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${
                  config.enabled ? 'bg-cyan-500' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block w-5 h-5 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
                    config.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {config.enabled && (
              <div className="pt-2 border-t border-white/[0.05] space-y-3">
                {/* Interval options */}
                <div>
                  <label className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
                    Frequência do Lembrete:
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {intervals.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => handleIntervalChange(item.value)}
                        className={`py-1.5 rounded-xl text-xs font-bold border transition-all text-center ${
                          config.intervalMinutes === item.value
                            ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-xs'
                            : 'bg-[#181a20] text-zinc-400 border-white/[0.05] hover:text-zinc-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Hours */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-zinc-400 font-semibold block mb-1">
                      Iniciar às:
                    </label>
                    <select
                      value={config.startHour}
                      onChange={(e) => {
                        const updated = saveWaterReminderConfig({ startHour: parseInt(e.target.value, 10) });
                        setConfig(updated);
                      }}
                      className="w-full bg-[#181a20] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-zinc-100 text-xs font-semibold focus:outline-none focus:border-cyan-500/50"
                    >
                      {Array.from({ length: 24 }).map((_, h) => (
                        <option key={h} value={h}>
                          {String(h).padStart(2, '0')}:00
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 font-semibold block mb-1">
                      Terminar às:
                    </label>
                    <select
                      value={config.endHour}
                      onChange={(e) => {
                        const updated = saveWaterReminderConfig({ endHour: parseInt(e.target.value, 10) });
                        setConfig(updated);
                      }}
                      className="w-full bg-[#181a20] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-zinc-100 text-xs font-semibold focus:outline-none focus:border-cyan-500/50"
                    >
                      {Array.from({ length: 24 }).map((_, h) => (
                        <option key={h} value={h}>
                          {String(h).padStart(2, '0')}:00
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sound & Vibration Toggles */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleToggleSound}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
                      config.sound
                        ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                        : 'bg-[#181a20] text-zinc-500 border-white/[0.05]'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Som</span>
                    </span>
                    <span className="text-[10px]">{config.sound ? 'Ligado' : 'Mudo'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleVibration}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
                      config.vibration
                        ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                        : 'bg-[#181a20] text-zinc-500 border-white/[0.05]'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Vibração</span>
                    </span>
                    <span className="text-[10px]">{config.vibration ? 'Ativa' : 'Deslig.'}</span>
                  </button>
                </div>

                {/* Test notification button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleTestNotification}
                    className="w-full py-2 bg-[#181a20] hover:bg-cyan-500/15 border border-white/[0.08] hover:border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    {testSent ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Alerta Enviado!</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Testar Notificação Agora</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Activity Alerts Log */}
          <div className="bg-[#131418] border border-white/[0.06] rounded-2xl p-4 space-y-2.5 shadow-sm">
            <span className="text-xs font-bold text-zinc-200 block">Destaques & Alertas do Dia</span>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-[#181a20] border border-white/[0.05] flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                  <Flame className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <strong className="text-xs font-semibold text-zinc-200 block">
                    Sequência Ativa: {streakDays} Dias Seguidos!
                  </strong>
                  <p className="text-[10px] text-zinc-400">Continue registrando para manter seu foco em alta.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#181a20] border border-white/[0.05] flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <Target className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <strong className="text-xs font-semibold text-zinc-200 block">
                    Metas Nutricionais & Hidratação
                  </strong>
                  <p className="text-[10px] text-zinc-400">
                    O cálculo automático sincroniza com seu nível de atividade.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#131418] border-t border-white/[0.06] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
