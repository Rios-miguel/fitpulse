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
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#14161c]/95 backdrop-blur-lg border-t border-white/[0.06] z-40 px-1 sm:px-2">
      <div className="max-w-xl mx-auto h-full flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-1.5 sm:px-2 rounded-xl transition-all duration-150 min-w-[50px] cursor-pointer ${
                isActive
                  ? 'text-emerald-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  isActive ? 'bg-emerald-500/12 text-emerald-400' : 'text-zinc-400'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
              </div>
              <span className="text-[10px] sm:text-[11px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
