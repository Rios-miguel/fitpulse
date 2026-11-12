import React, { useRef } from 'react';
import { Search, Calendar, Settings, Bell, ChevronLeft, ChevronRight, User, TrendingUp } from 'lucide-react';

export default function Header({ currentDate, onDateChange, onOpenSettings, onOpenSearch, onOpenEvolution }) {
  const dateInputRef = useRef(null);

  const formatDateDisplay = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return 'Hoje';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return 'Hoje';
    const [y, m, d] = parts.map(Number);
    const targetDate = new Date(y, m - 1, d);
    if (isNaN(targetDate.getTime())) return 'Hoje';
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (dateStr === todayStr) return 'Hoje';

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    if (dateStr === yesterdayStr) return 'Ontem';

    return targetDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  const changeDateOffset = (days) => {
    const [y, m, d] = currentDate.split('-').map(Number);
    const cur = new Date(y, m - 1, d);
    cur.setDate(cur.getDate() + days);

    const year = cur.getFullYear();
    const month = String(cur.getMonth() + 1).padStart(2, '0');
    const day = String(cur.getDate()).padStart(2, '0');
    onDateChange(`${year}-${month}-${day}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#101216]/95 backdrop-blur-md border-b border-white/[0.06] px-4 py-2.5">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Avatar & Notification Bell (YAZIO Style) */}
        <div className="flex items-center gap-2">
          {/* User Avatar */}
          <div
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
            title="Seu perfil / Metas"
          >
            <div className="w-full h-full rounded-full bg-[#181a20] flex items-center justify-center overflow-hidden">
              <User className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          {/* Notification Bell with Badge 1 */}
          <div className="relative">
            <button
              type="button"
              onClick={onOpenSettings}
              className="w-9 h-9 rounded-full bg-[#181a20] hover:bg-[#20232b] border border-white/[0.08] flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
              title="Notificações & Lembretes"
            >
              <Bell className="w-4 h-4 text-zinc-300" />
            </button>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-zinc-950 font-bold text-[10px] rounded-full flex items-center justify-center shadow-sm">
              1
            </span>
          </div>
        </div>

        {/* Center: Brand or Current Date Quick Badge */}
        <div className="text-center">
          <span className="text-xs font-bold text-zinc-200 tracking-tight block">
            FitPulse
          </span>
          <span className="text-[10px] text-zinc-400 font-medium">
            {formatDateDisplay(currentDate)}
          </span>
        </div>

        {/* Right: Search, Calendar & Settings (YAZIO Style) */}
        <div className="flex items-center gap-1.5">
          {/* Quick Food Search Button */}
          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="w-9 h-9 rounded-full bg-[#181a20] hover:bg-[#20232b] text-zinc-300 hover:text-white border border-white/[0.08] flex items-center justify-center transition-colors shadow-sm"
              title="Buscar Alimentos no Banco"
            >
              <Search className="w-4 h-4 text-zinc-300" />
            </button>
          )}

          {/* Calendar Picker Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.click()}
              className="w-9 h-9 rounded-full bg-[#181a20] hover:bg-[#20232b] text-zinc-300 hover:text-white border border-white/[0.08] flex items-center justify-center transition-colors shadow-sm"
              title="Selecionar Data no Calendário"
            >
              <Calendar className="w-4 h-4 text-zinc-300" />
            </button>
            <input
              ref={dateInputRef}
              type="date"
              value={currentDate}
              onChange={(e) => e.target.value && onDateChange(e.target.value)}
              className="sr-only"
            />
          </div>

          {/* Evolution / Reports Button */}
          {onOpenEvolution && (
            <button
              type="button"
              onClick={onOpenEvolution}
              className="w-9 h-9 rounded-full bg-[#181a20] hover:bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center transition-colors shadow-sm"
              title="Relatórios & Evolução (Balanço Calórico, Peso, Água)"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </button>
          )}

          {/* Settings Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-full bg-[#181a20] hover:bg-[#20232b] text-zinc-300 hover:text-white border border-white/[0.08] flex items-center justify-center transition-colors shadow-sm"
            title="Metas Diárias"
          >
            <Settings className="w-4 h-4 text-zinc-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
