/**
 * Ludo Magic Savannah - Victory Podium & Match Summary Modal
 */

import React from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { Trophy, Award, Sparkles, Flame, Zap, ArrowRight, RotateCcw } from 'lucide-react';
import { getRankBadge } from '../../utils/ludoEngine';

export const VictoryModal: React.FC = () => {
  const { gameState, userProfile, selectedPlayerColor, startNewGame, resetToLobby } = useGameStore();

  if (!gameState || gameState.status !== 'game_over' || !gameState.winner) return null;

  const winnerPlayer = gameState.players.find((p) => p.color === gameState.winner);
  const isHumanWinner = gameState.winner === selectedPlayerColor;
  const rankInfo = getRankBadge(userProfile.stats.currentElo);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="bg-gradient-to-b from-[#182818] via-[#101b10] to-[#0d1a0d] border-2 border-[#d4af37]/60 rounded-3xl p-6 max-w-md w-full shadow-2xl shadow-black text-center relative overflow-hidden"
      >
        {/* Glow ambient background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#d4af37]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Victory Trophy & Header */}
        <div className="relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#f5df88] via-[#d4af37] to-[#8b6508] border-2 border-[#f5df88] flex items-center justify-center shadow-lg shadow-[#d4af37]/50 mb-3 animate-bounce">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-[#0d1a0d]" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            {isHumanWinner ? '🏆 SAVANNAH TRIUMPH' : 'MATCH COMPLETED'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#e0dcc5] mt-1 font-serif">
            {winnerPlayer?.name} Won!
          </h2>
          <p className="text-xs text-[#e0dcc5]/80 mt-1">
            {isHumanWinner
              ? 'The spirits of the plains crown you as the supreme champion!'
              : 'Well fought! Return to the plains stronger next match.'}
          </p>
        </div>

        {/* Rewards Earned (XP, Coins, Elo) */}
        <div className="grid grid-cols-3 gap-2 my-4 bg-[#0a120a] border border-[#d4af37]/30 rounded-2xl p-3">
          <div className="flex flex-col items-center">
            <span className="text-xs text-[#e0dcc5]/70 font-semibold">XP GAINED</span>
            <span className="text-base font-bold text-[#e0dcc5] mt-0.5">
              +{isHumanWinner ? 250 : 50}
            </span>
          </div>
          <div className="flex flex-col items-center border-x border-[#d4af37]/25">
            <span className="text-xs text-[#e0dcc5]/70 font-semibold">COINS</span>
            <span className="text-base font-bold text-[#d4af37] mt-0.5">
              +{isHumanWinner ? 400 : 80} 🪙
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-[#e0dcc5]/70 font-semibold">RANK ELO</span>
            <span className={`text-base font-bold mt-0.5 ${isHumanWinner ? 'text-emerald-400' : 'text-[#d4af37]'}`}>
              {isHumanWinner ? '+24 ⬆' : '+5'}
            </span>
          </div>
        </div>

        {/* Final Standings List */}
        <div className="space-y-1.5 mb-5 text-left text-xs">
          <span className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider block mb-1">
            Final Standings
          </span>
          {gameState.players.map((p, idx) => {
            const isWinner = p.color === gameState.winner;
            const finishedPieces = p.pieces.filter((pc) => pc.hasFinished).length;

            return (
              <div
                key={`podium-${p.color}`}
                className={`flex items-center justify-between p-2 rounded-xl border ${
                  isWinner
                    ? 'bg-[#182818] border-[#d4af37] text-[#f5df88] font-bold shadow-md'
                    : 'bg-[#101b10] border-stone-800 text-[#e0dcc5]/75'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#d4af37]">#{idx + 1}</span>
                  <span className="text-base">{p.avatar}</span>
                  <span className="truncate max-w-[130px]">{p.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#d4af37]/80">{finishedPieces}/4 Home</span>
                  {isWinner && <span className="text-xs">👑 1st</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => resetToLobby()}
            className="flex-1 py-2.5 rounded-xl bg-[#132013] border border-[#d4af37]/25 text-[#e0dcc5] text-xs font-bold hover:bg-[#1a2c1a] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Lobby</span>
          </button>
          <button
            onClick={() => {
              startNewGame(gameState.settings, selectedPlayerColor);
            }}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#e8c858] via-[#d4af37] to-[#aa8218] text-[#0d1a0d] text-xs font-extrabold hover:brightness-110 shadow-lg shadow-[#d4af37]/30 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Play Again</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
