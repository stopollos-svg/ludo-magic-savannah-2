/**
 * Ludo Magic Savannah - Competitive Turn HUD & Turn Timer Component
 * Displays real-time player status, quick emotes, and an adrenaline-pumping
 * countdown timer for competitive pressure with audio/visual warnings.
 */

import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PlayerColor } from '../../types/game';
import {
  Volume2,
  VolumeX,
  ArrowLeft,
  MessageSquare,
  Flame,
  Clock,
  AlertTriangle,
  Zap,
  HelpCircle,
} from 'lucide-react';

export const TurnHUD: React.FC = () => {
  const {
    gameState,
    selectedPlayerColor,
    sendChatMessage,
    soundEnabled,
    setSoundEnabled,
    resetToLobby,
    tickTurnTimer,
    openOnboarding,
    toggleChatPanel,
    isChatPanelOpen,
    unreadChatCount,
  } = useGameStore();

  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Active turn countdown ticker
  useEffect(() => {
    if (!gameState || gameState.status !== 'playing' || gameState.winner || showExitConfirm) return;

    const timerInterval = setInterval(() => {
      tickTurnTimer();
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameState?.status, gameState?.winner, gameState?.currentTurnIndex, showExitConfirm, tickTurnTimer]);

  if (!gameState || !gameState.players || gameState.players.length === 0) return null;

  const activePlayer = gameState.players[gameState.currentTurnIndex] || gameState.players[0];
  if (!activePlayer) return null;
  const isMyTurn = activePlayer.color === selectedPlayerColor && !activePlayer.isAI;

  const totalTime = gameState.settings.turnTimeoutSeconds || 20;
  const timeRemaining = Math.max(0, gameState.turnTimeRemaining);
  const timeRatio = Math.max(0, Math.min(1, timeRemaining / totalTime));
  const timePct = timeRatio * 100;

  // Pressure threshold calculation
  const isUrgent = timeRemaining <= 5;
  const isCaution = timeRemaining <= 10 && !isUrgent;

  // Circular timer SVG specs
  const ringRadius = 17;
  const circumference = 2 * Math.PI * ringRadius; // ~106.8
  const strokeDashoffset = circumference - timeRatio * circumference;

  const timerColor = isUrgent
    ? '#ef4444' // Crimson Red
    : isCaution
    ? '#f59e0b' // Amber
    : '#10b981'; // Savannah Emerald

  const timerBadgeColor = isUrgent
    ? 'bg-red-950/80 border-red-500/80 text-red-300 shadow-red-500/40 animate-pulse'
    : isCaution
    ? 'bg-amber-950/70 border-amber-500/60 text-amber-300'
    : 'bg-[#0f1f0f] border-[#d4af37]/40 text-[#f5df88]';

  return (
    <div id="onboarding-hud-target" className="w-full max-w-[560px] mx-auto flex flex-col gap-2 select-none">
      {/* 1. TOP BAR: Surrender / Players Overview / Controls */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 bg-[#0d1a0d]/95 backdrop-blur-md p-2 rounded-2xl border border-[#d4af37]/30 shadow-lg">
        {/* Back / Surrender Button */}
        <button
          id="btn-hud-surrender"
          onClick={() => setShowExitConfirm(true)}
          className="min-w-[40px] min-h-[40px] p-2 rounded-xl bg-[#142314] text-[#e0dcc5] border border-[#d4af37]/30 hover:bg-[#1b301b] active:scale-95 transition cursor-pointer flex items-center justify-center shadow-inner"
          title="Back to Lobby / Forfeit"
        >
          <ArrowLeft className="w-4 h-4 text-[#d4af37]" />
        </button>

        {/* Competing Player Clan Badges */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
          {gameState.players.map((player) => {
            const isActive = player.color === activePlayer.color;
            const finishedCount = player.pieces.filter((p) => p.hasFinished).length;

            const colorBg: Record<PlayerColor, string> = {
              red: 'border-red-500/60 text-red-200',
              green: 'border-emerald-500/60 text-emerald-200',
              yellow: 'border-[#d4af37]/70 text-[#f5df88]',
              blue: 'border-blue-400/60 text-blue-200',
            };

            return (
              <div
                key={`hud-player-${player.color}`}
                className={`flex items-center gap-1 px-2 py-1 rounded-xl border text-xs transition-all relative ${
                  colorBg[player.color]
                } ${
                  isActive
                    ? 'bg-[#1a2d1a] border-[#d4af37] ring-2 ring-[#d4af37]/60 shadow-lg shadow-[#d4af37]/20 scale-[1.03] font-bold'
                    : 'bg-[#081008]/80 opacity-75'
                }`}
              >
                <span className="text-sm sm:text-base leading-none">{player.avatar}</span>
                <span className="hidden sm:inline max-w-[62px] truncate text-[11px] font-medium">
                  {player.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/70 text-[#d4af37] font-mono font-bold">
                  {finishedCount}/4
                </span>

                {/* Mini turn active indicator dot */}
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#d4af37] rounded-full ring-2 ring-[#0d1a0d] animate-ping" />
                )}
              </div>
            );
          })}
        </div>

        {/* Controls: Real-time Chat Drawer, Guide Tutorial, and Sound */}
        <div className="flex items-center gap-1">
          <button
            id="btn-hud-chat"
            onClick={() => toggleChatPanel()}
            className={`min-w-[40px] min-h-[40px] p-2 rounded-xl border transition cursor-pointer flex items-center justify-center shadow-inner relative ${
              isChatPanelOpen
                ? 'bg-[#233d23] text-[#f5df88] border-[#d4af37] ring-1 ring-[#d4af37]/60'
                : 'bg-[#142314] text-[#d4af37] border-[#d4af37]/30 hover:bg-[#1b301b] active:scale-95'
            }`}
            title="Open Savannah Chat & Quick Phrases"
          >
            <MessageSquare className="w-4 h-4" />
            {unreadChatCount > 0 && !isChatPanelOpen && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center px-1 shadow-sm animate-bounce">
                {unreadChatCount}
              </span>
            )}
          </button>
          <button
            id="btn-hud-tutorial"
            onClick={() => openOnboarding()}
            className="min-w-[40px] min-h-[40px] p-2 rounded-xl bg-[#142314] text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#1b301b] active:scale-95 transition cursor-pointer flex items-center justify-center shadow-inner"
            title="How to Play / Guided Tutorial"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            id="btn-hud-sound"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="min-w-[40px] min-h-[40px] p-2 rounded-xl bg-[#142314] text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#1b301b] active:scale-95 transition cursor-pointer flex items-center justify-center shadow-inner"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
          </button>
        </div>
      </div>

      {/* 2. COMPETITIVE ACTIVE TURN CALLOUT & COUNTDOWN TIMER BANNER */}
      <div
        className={`w-full rounded-2xl border transition-all duration-300 relative overflow-hidden shadow-xl ${
          isUrgent
            ? 'bg-gradient-to-r from-[#2c0f0f] via-[#1a0c0c] to-[#2c0f0f] border-red-500/80 shadow-red-600/30'
            : isMyTurn
            ? 'bg-gradient-to-r from-[#1b2b1b] via-[#122212] to-[#1b2b1b] border-[#d4af37] shadow-[#d4af37]/25'
            : 'bg-[#0a140a]/90 border-[#d4af37]/25'
        }`}
      >
        <div className="p-2.5 sm:p-3 flex items-center justify-between gap-3 relative z-10">
          {/* Left: Active Player Identity & Phase */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <span className="text-2xl sm:text-3xl filter drop-shadow">{activePlayer.avatar}</span>
              {isMyTurn && (
                <span className="absolute -bottom-1 -right-1 text-[9px] font-black px-1 rounded bg-[#d4af37] text-stone-950 uppercase tracking-tighter">
                  YOU
                </span>
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black text-[#e0dcc5] font-serif truncate">
                  {isMyTurn ? "YOUR TURN" : activePlayer.name}
                </span>
                {activePlayer.isAI && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-500/40 uppercase font-mono font-bold">
                    BOT
                  </span>
                )}
              </div>

              {/* Phase Hint / Ticker */}
              <span className="text-[11px] text-[#d4af37]/90 font-medium truncate flex items-center gap-1">
                {gameState.turnPhase === 'roll_dice' && (
                  <>
                    <Zap className="w-3 h-3 text-[#d4af37] animate-pulse" />
                    <span>{isMyTurn ? 'Tap dice to roll' : 'Rolling dice...'}</span>
                  </>
                )}
                {gameState.turnPhase === 'select_piece' && (
                  <>
                    <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span>{isMyTurn ? 'Select a piece to move' : 'Deciding move...'}</span>
                  </>
                )}
                {gameState.turnPhase === 'moving' && <span>Moving piece...</span>}
              </span>
            </div>
          </div>

          {/* Right: Adrenaline-Pumping Countdown Timer */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Urgency Status Pill */}
            <div
              className={`hidden xs:flex flex-col items-end text-right px-2 py-1 rounded-xl border text-[10px] font-bold uppercase tracking-wider ${timerBadgeColor}`}
            >
              <div className="flex items-center gap-1 font-mono font-black">
                {isUrgent ? (
                  <>
                    <Flame className="w-3 h-3 text-red-400 animate-bounce" />
                    <span className="text-red-300">TIME PRESSURE!</span>
                  </>
                ) : isCaution ? (
                  <>
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span className="text-amber-300">HURRY UP</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 text-[#d4af37]" />
                    <span className="text-[#f5df88]">TURN TIMER</span>
                  </>
                )}
              </div>
              <span className="text-[9px] opacity-80 lowercase">
                {timeRemaining}s remaining
              </span>
            </div>

            {/* Circular SVG Timer Dial */}
            <div
              className={`relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-[#081008] border shadow-inner ${
                isUrgent
                  ? 'border-red-500 shadow-red-500/50 animate-pulse ring-2 ring-red-500/50'
                  : 'border-[#d4af37]/40'
              }`}
            >
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
                {/* Background Ring Track */}
                <circle
                  cx="22"
                  cy="22"
                  r={ringRadius}
                  stroke="#1c2b1c"
                  strokeWidth="3.5"
                  fill="none"
                />
                {/* Animated Progress Ring */}
                <circle
                  cx="22"
                  cy="22"
                  r={ringRadius}
                  stroke={timerColor}
                  strokeWidth="3.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>

              {/* Digital Countdown Number */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span
                  className={`text-xs sm:text-sm font-black font-mono leading-none tracking-tight ${
                    isUrgent
                      ? 'text-red-400 scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                      : isCaution
                      ? 'text-amber-300'
                      : 'text-[#e0dcc5]'
                  }`}
                >
                  {timeRemaining}
                </span>
                <span className="text-[8px] text-[#d4af37]/70 font-bold uppercase leading-none mt-0.5">
                  sec
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Linear Drain Progress Bar along bottom of HUD */}
        <div className="w-full h-1 bg-[#0a120a] overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              isUrgent
                ? 'bg-gradient-to-r from-red-600 via-red-500 to-amber-500 animate-pulse'
                : isCaution
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                : 'bg-gradient-to-r from-[#10b981] via-[#d4af37] to-[#e8c858]'
            }`}
            style={{ width: `${timePct}%` }}
          />
        </div>
      </div>

      {/* Exit Game Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#101b10] border-2 border-[#d4af37]/50 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <span className="text-4xl">⚠️</span>
            <h3 className="text-lg font-black text-[#e0dcc5] mt-2 font-serif">Leave Current Match?</h3>
            <p className="text-xs text-[#e0dcc5]/80 mt-2 mb-5 leading-relaxed">
              Returning to the lobby will forfeit this savannah duel and count as a defeat.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#182818] border border-stone-700 text-[#e0dcc5] text-xs font-bold hover:bg-[#203220] active:scale-95 transition cursor-pointer"
              >
                Resume Match
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  resetToLobby();
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 shadow-lg shadow-red-600/40 active:scale-95 transition cursor-pointer"
              >
                Leave Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
