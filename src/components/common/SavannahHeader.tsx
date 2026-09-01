/**
 * Ludo Magic Savannah - Navigation Header & Player Status Bar
 */

import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { BoardAmbiance } from '../../types/game';
import {
  Volume2,
  VolumeX,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  ShieldAlert,
  Award,
  Coins,
  Gem,
  Code2,
  Trophy,
  Users,
  ShoppingBag,
} from 'lucide-react';

export const SavannahHeader: React.FC = () => {
  const {
    currentView,
    setView,
    userProfile,
    soundEnabled,
    setSoundEnabled,
    gameState,
    updateAmbiance,
  } = useGameStore();

  const currentAmbiance = gameState?.settings.ambiance || 'sunset';

  const ambiances: Array<{ id: BoardAmbiance; label: string; icon: React.ReactNode }> = [
    { id: 'day', label: 'Day', icon: <Sun className="w-3.5 h-3.5 text-amber-300" /> },
    { id: 'sunset', label: 'Sunset', icon: <Sunset className="w-3.5 h-3.5 text-orange-400" /> },
    { id: 'night', label: 'Night', icon: <Moon className="w-3.5 h-3.5 text-cyan-300" /> },
  ];

  return (
    <header className="w-full bg-[#0b140b]/90 backdrop-blur-md border-b border-[#d4af37]/25 px-3 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-40 text-[#e0dcc5]">
      {/* Brand Logo & Title */}
      <div
        onClick={() => setView('lobby')}
        className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#f5df88] via-[#d4af37] to-[#8b6508] border border-[#f5df88]/80 flex items-center justify-center text-xl sm:text-2xl shadow-lg shadow-[#d4af37]/25">
          🦁
        </div>
        <div>
          <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-[#e0dcc5] font-serif leading-none">
            Ludo Magic <span className="text-[#d4af37]">Savannah</span>
          </h1>
          <span className="text-[10px] text-[#d4af37]/80 font-semibold tracking-wider uppercase">
            African Plains Edition
          </span>
        </div>
      </div>

      {/* Navigation Tabs (when in lobby mode) */}
      {currentView !== 'game' && (
        <nav className="hidden md:flex items-center gap-1 bg-[#132013]/90 border border-[#d4af37]/20 rounded-xl p-1 shadow-inner">
          <button
            onClick={() => setView('lobby')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              currentView === 'lobby' ? 'bg-[#d4af37] text-[#0d1a0d] shadow-[0_0_12px_rgba(212,175,55,0.3)]' : 'text-[#e0dcc5]/80 hover:bg-[#1a2c1a]'
            }`}
          >
            Play
          </button>
          <button
            onClick={() => setView('clan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              currentView === 'clan' ? 'bg-[#d4af37] text-[#0d1a0d] shadow-[0_0_12px_rgba(212,175,55,0.3)]' : 'text-[#e0dcc5]/80 hover:bg-[#1a2c1a]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Clans</span>
          </button>
          <button
            onClick={() => setView('bazaar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              currentView === 'bazaar' ? 'bg-[#d4af37] text-[#0d1a0d] shadow-[0_0_12px_rgba(212,175,55,0.3)]' : 'text-[#e0dcc5]/80 hover:bg-[#1a2c1a]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bazaar</span>
          </button>
          <button
            onClick={() => setView('leaderboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              currentView === 'leaderboard' ? 'bg-[#d4af37] text-[#0d1a0d] shadow-[0_0_12px_rgba(212,175,55,0.3)]' : 'text-[#e0dcc5]/80 hover:bg-[#1a2c1a]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Ranks</span>
          </button>
          <button
            onClick={() => setView('quests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              currentView === 'quests' ? 'bg-[#d4af37] text-[#0d1a0d] shadow-[0_0_12px_rgba(212,175,55,0.3)]' : 'text-[#e0dcc5]/80 hover:bg-[#1a2c1a]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Quests</span>
          </button>
        </nav>
      )}

      {/* User Stats & Quick Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Currencies Pill */}
        <div className="flex items-center gap-2 bg-[#132013]/90 border border-[#d4af37]/30 rounded-xl px-2.5 py-1 text-xs shadow-inner">
          <div className="flex items-center gap-1 text-[#d4af37] font-bold">
            <Coins className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{userProfile.coins.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-cyan-300 font-bold border-l border-[#d4af37]/20 pl-2">
            <Gem className="w-3.5 h-3.5 text-cyan-400" />
            <span>{userProfile.gems}</span>
          </div>
        </div>

        {/* Ambiance Switcher */}
        <div className="hidden sm:flex items-center gap-1 bg-[#132013] border border-[#d4af37]/25 rounded-lg p-0.5">
          {ambiances.map((amb) => (
            <button
              key={amb.id}
              onClick={() => updateAmbiance(amb.id)}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                currentAmbiance === amb.id ? 'bg-[#d4af37]/25 ring-1 ring-[#d4af37]' : 'hover:bg-[#1c2c1c]'
              }`}
              title={`${amb.label} Ambiance`}
            >
              {amb.icon}
            </button>
          ))}
        </div>

        {/* Sound Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-xl bg-[#132013] border border-[#d4af37]/25 text-[#d4af37] hover:bg-[#1c2c1c] transition cursor-pointer"
          title="Toggle Sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
        </button>

        {/* Developer / Architecture / Admin Button */}
        <button
          id="btn-open-dev-tools"
          onClick={() => setView('admin')}
          className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
            currentView === 'admin'
              ? 'bg-[#d4af37] text-[#0d1a0d] border-[#f5df88] shadow-md'
              : 'bg-[#132013] text-[#e0dcc5] border-[#d4af37]/25 hover:bg-[#1c2c1c]'
          }`}
          title="Supabase Architecture & Unity Engine Docs"
        >
          <Code2 className="w-4 h-4" />
          <span className="hidden lg:inline">Backend & Unity</span>
        </button>
      </div>
    </header>
  );
};
