/**
 * Ludo Magic Savannah - Main Application Entry Point
 * @license Apache-2.0
 */

import React, { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { SavannahHeader } from './components/common/SavannahHeader';
import { LobbyView } from './components/lobby/LobbyView';
import { LudoBoard } from './components/board/LudoBoard';
import { DiceRoller } from './components/board/DiceRoller';
import { AbilitiesBar } from './components/board/AbilitiesBar';
import { TurnHUD } from './components/board/TurnHUD';
import { VictoryModal } from './components/board/VictoryModal';
import { ClanHub } from './components/social/ClanHub';
import { BazaarShop } from './components/shop/BazaarShop';
import { LeaderboardModal } from './components/social/LeaderboardModal';
import { QuestsView } from './components/quests/QuestsView';
import { TournamentBracket } from './components/tournament/TournamentBracket';
import { AdminDevModal } from './components/admin/AdminDevModal';

export default function App() {
  const { currentView, gameState, musicEnabled } = useGameStore();

  const ambiance = gameState?.settings.ambiance || 'sunset';

  const ambianceGradients = {
    sunset: 'from-[#1b120c] via-[#0d1a0d] to-[#120d08]',
    day: 'from-[#142314] via-[#0d1a0d] to-[#0f1d18]',
    night: 'from-[#0a1218] via-[#0d1a0d] to-[#091114]',
    oasis: 'from-[#0b1f1f] via-[#0d1a0d] to-[#0a1622]',
  };

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-b ${ambianceGradients[ambiance]} text-[#e0dcc5] flex flex-col font-sans transition-colors duration-700 select-none pb-12 relative bg-dots-pattern`}
    >
      {/* Top Navigation & Status Bar */}
      <SavannahHeader />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-center p-2 sm:p-4 relative z-10">
        {currentView === 'lobby' && <LobbyView />}

        {currentView === 'game' && (
          <div className="w-full max-w-2xl flex flex-col items-center gap-3 sm:gap-4 my-auto">
            {/* Active Turn HUD & Players */}
            <TurnHUD />

            {/* The 15x15 Savannah Ludo Board */}
            <LudoBoard />

            {/* Bottom Actions: Magical Abilities & 3D Dice Roller */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <AbilitiesBar />
              <DiceRoller />
            </div>

            {/* Victory Podium Modal */}
            <VictoryModal />
          </div>
        )}

        {currentView === 'clan' && <ClanHub />}
        {currentView === 'bazaar' && <BazaarShop />}
        {currentView === 'leaderboard' && <LeaderboardModal />}
        {currentView === 'quests' && <QuestsView />}
        {currentView === 'tournament' && <TournamentBracket />}
        {currentView === 'admin' && <AdminDevModal />}
      </main>

      {/* Ambient Savannah Footer */}
      <footer className="w-full py-3 text-center text-[11px] text-[#d4af37]/70 border-t border-[#d4af37]/20 bg-[#081008]/80 backdrop-blur-sm mt-auto relative z-10">
        <span>Ludo Magic Savannah • Powered by Real-Time Channels & Supabase Engine</span>
      </footer>
    </div>
  );
}
