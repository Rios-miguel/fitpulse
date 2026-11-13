import { playWaterChime, playNotificationChime } from '../utils/audio.js';

const WATER_REMINDER_KEY = 'fitpulse_water_reminder_config_v2';

export const DEFAULT_REMINDER_CONFIG = {
  enabled: true,
  intervalMinutes: 60, // 30, 45, 60, 90, 120
  startHour: 8,        // 08:00
  endHour: 22,         // 22:00
  sound: true,
  vibration: true,
  lastNotified: 0
};

export function getWaterReminderConfig() {
  try {
    const raw = localStorage.getItem(WATER_REMINDER_KEY);
    if (!raw) return DEFAULT_REMINDER_CONFIG;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_REMINDER_CONFIG, ...parsed };
  } catch (e) {
    return DEFAULT_REMINDER_CONFIG;
  }
}

export function saveWaterReminderConfig(newConfig) {
  try {
    const current = getWaterReminderConfig();
    const updated = { ...current, ...newConfig };
    localStorage.setItem(WATER_REMINDER_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fitpulse_reminder_config_changed', { detail: updated }));
    }
    return updated;
  } catch (e) {
    return newConfig;
  }
}

export async function requestNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch (e) {
    return 'denied';
  }
}

export function triggerWaterNotification({ force = false, onToast = null } = {}) {
  const config = getWaterReminderConfig();
  if (!config.enabled && !force) return false;

  const now = new Date();
  const currentHour = now.getHours();

  // Verifica horário ativo (a não ser que seja um teste forçado)
  if (!force) {
    if (currentHour < config.startHour || currentHour >= config.endHour) {
      return false;
    }
  }

  // Som sutil
  if (config.sound) {
    playWaterChime();
  }

  // Vibração no celular
  if (config.vibration && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([150, 60, 150]);
    } catch (e) {}
  }

  // Notificação nativa do sistema operacional / navegador
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification('FitPulse - Hora de Beber Água! 💧', {
        body: 'Mantenha sua hidratação em dia para acelerar o metabolismo e recuperação.',
        icon: '/icon.svg',
        badge: '/icon.svg',
        silent: !config.sound
      });
    } catch (e) {}
  }

  if (typeof onToast === 'function') {
    onToast('Hora de se hidratar! Beba um copo de água agora 💧');
  }

  // Atualiza timestamp
  saveWaterReminderConfig({ lastNotified: Date.now() });
  return true;
}

export function checkAndTriggerReminder(onToast = null) {
  const config = getWaterReminderConfig();
  if (!config.enabled) return;

  const now = Date.now();
  const elapsed = now - (config.lastNotified || 0);
  const intervalMs = config.intervalMinutes * 60 * 1000;

  if (elapsed >= intervalMs) {
    triggerWaterNotification({ force: false, onToast });
  }
}
