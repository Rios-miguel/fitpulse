import React from 'react';
import { Flame, Utensils, BookOpen, Droplets, Dumbbell, Newspaper } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'dashboard', label: 'Hoje', icon: Flame, color: 'text-emerald-400' },
    { id: 'meals', label: 'Diário', icon: Utensils, color: 'text-amber-400' },
    { id: 'foodDb', label: 'Alimentos', icon: BookOpen, color: 'text-emerald-400' },
    { id: 'workouts', label: 'Treinos', icon: Dumbbell, color: 'text-purple-400' },
    { id: 'water', label: 'Água', icon: Droplets, color: 'text-cyan-400' },
    { id: 'news', label: 'Notícias', icon: Newspaper, color: 'text-rose-400' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[calc(4.25rem+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] bg-[#121419]/96 backdrop-blur-xl border-t border-white/[0.08] z-40 px-1 sm:px-2 select-none">
      <div className="max-w-xl mx-auto h-full flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 sm:px-2 rounded-2xl transition-all duration-150 min-w-[52px] min-h-[46px] cursor-pointer active:scale-95 touch-manipulation ${
                isActive
                  ? 'text-emerald-400 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-emerald-500/15 text-emerald-400 scale-105 shadow-xs' 
                    : 'text-zinc-400 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-[18px] sm:h-[18px] ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
              </div>
              <span className={`text-[10px] sm:text-[11px] tracking-tight ${isActive ? 'text-emerald-400 font-extrabold' : 'text-zinc-400 font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
