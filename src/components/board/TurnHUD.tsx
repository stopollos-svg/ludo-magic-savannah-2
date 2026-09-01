/**
 * Ludo Magic Savannah - Turn HUD, Players Status & Quick Emotes
 */

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PlayerColor } from '../../types/game';
import { Shield, Sparkles, Trophy, Volume2, VolumeX, ArrowLeft, MessageSquare, Flame } from 'lucide-react';

export const TurnHUD: React.FC = () => {
  const {
    gameState,
    selectedPlayerColor,
    sendChatMessage,
    soundEnabled,
    setSoundEnabled,
    resetToLobby,
  } = useGameStore();

  const [showEmotePicker, setShowEmotePicker] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  if (!gameState) return null;

  const activePlayer = gameState.players[gameState.currentTurnIndex];
  const isMyTurn = activePlayer.color === selectedPlayerColor && !activePlayer.isAI;

  const EMOTES = ['🦁', '🔥', '👑', '👏', '😱', '😂', '💀', '🐘'];

  const handleEmote = (emote: string) => {
    sendChatMessage(emote, true);
    setShowEmotePicker(false);
  };

  return (
    <div className="w-full max-w-[560px] mx-auto flex flex-col gap-2">
      {/* Top Header Bar: Exit, Player Cards, Sound */}
      <div className="flex items-center justify-between gap-2 bg-[#0d1a0d]/90 backdrop-blur-md p-2 rounded-xl border border-[#d4af37]/25 shadow-md">
        {/* Back / Surrender */}
        <button
          onClick={() => setShowExitConfirm(true)}
          className="p-1.5 rounded-lg bg-[#132013] text-[#e0dcc5] border border-[#d4af37]/25 hover:bg-[#1a2c1a] transition cursor-pointer"
          title="Back to Lobby"
        >
          <ArrowLeft className="w-4 h-4 text-[#d4af37]" />
        </button>

        {/* 4 Mini Player Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {gameState.players.map((player) => {
            const isActive = player.color === activePlayer.color;
            const finishedCount = player.pieces.filter((p) => p.hasFinished).length;

            const colorBg: Record<PlayerColor, string> = {
              red: 'border-red-500/50 text-red-200',
              green: 'border-emerald-500/50 text-emerald-200',
              yellow: 'border-[#d4af37]/50 text-[#f5df88]',
              blue: 'border-blue-400/50 text-blue-200',
            };

            return (
              <div
                key={`hud-player-${player.color}`}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs transition-all ${
                  colorBg[player.color]
                } ${
                  isActive
                    ? 'bg-[#182818] border-[#d4af37] ring-2 ring-[#d4af37]/50 shadow-md scale-105 font-bold'
                    : 'bg-[#081008]/80 opacity-75'
                }`}
              >
                <span className="text-sm">{player.avatar}</span>
                <span className="hidden sm:inline max-w-[65px] truncate">{player.name}</span>
                <span className="text-[10px] px-1 rounded bg-black/60 text-[#d4af37] font-mono">
                  {finishedCount}/4
                </span>
              </div>
            );
          })}
        </div>

        {/* Sound & Emotes */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowEmotePicker(!showEmotePicker)}
            className="p-1.5 rounded-lg bg-[#132013] text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#1a2c1a] transition cursor-pointer"
            title="Quick Emotes"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-[#132013] text-[#d4af37] border border-[#d4af37]/25 hover:bg-[#1a2c1a] transition cursor-pointer"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
          </button>
        </div>
      </div>

      {/* Emote Selector Popover */}
      {showEmotePicker && (
        <div className="flex items-center justify-center gap-2 p-2 bg-[#101c10]/95 border border-[#d4af37]/40 rounded-xl shadow-xl animate-in fade-in zoom-in-95">
          {EMOTES.map((em) => (
            <button
              key={em}
              onClick={() => handleEmote(em)}
              className="text-xl sm:text-2xl p-1.5 hover:scale-125 transition cursor-pointer"
            >
              {em}
            </button>
          ))}
        </div>
      )}

      {/* Active Turn Callout Banner */}
      <div
        className={`w-full py-1.5 px-3 rounded-xl border flex items-center justify-between text-xs sm:text-sm font-semibold transition-all ${
          isMyTurn
            ? 'bg-gradient-to-r from-[#1b2b1b] via-[#122212] to-[#1b2b1b] border-[#d4af37] text-[#f5df88] animate-pulse shadow-md shadow-[#d4af37]/20'
            : 'bg-[#081008]/80 border-[#d4af37]/20 text-[#e0dcc5]/80'
        }`}
      >
        <div className="flex items-center gap-2">
          <span>{activePlayer.avatar}</span>
          <span>
            {isMyTurn ? "IT'S YOUR TURN!" : `${activePlayer.name}'s Turn`}
          </span>
        </div>
        {/* Latest Log Ticker */}
        {gameState.gameLogs.length > 0 && (
          <span className="text-[11px] text-[#d4af37]/90 font-normal max-w-[240px] truncate italic">
            {gameState.gameLogs[0].text}
          </span>
        )}
      </div>

      {/* Exit Game Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101b10] border-2 border-[#d4af37]/50 rounded-2xl p-5 max-w-sm w-full text-center shadow-2xl">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-lg font-bold text-[#e0dcc5] mt-2 font-serif">Leave Current Match?</h3>
            <p className="text-xs text-[#e0dcc5]/80 mt-1 mb-4">
              Returning to the lobby will forfeit this match and record it as a defeat in ranked modes.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2 rounded-lg bg-[#182818] border border-stone-700 text-[#e0dcc5] text-xs font-bold hover:bg-[#203220] cursor-pointer"
              >
                Resume Match
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  resetToLobby();
                }}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-500 shadow-md shadow-red-600/40 cursor-pointer"
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
