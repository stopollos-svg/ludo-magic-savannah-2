/**
 * Ludo Magic Savannah - Animated 3D-Styled Dice Roller Component
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { Sparkles, Zap, Flame } from 'lucide-react';

export const DiceRoller: React.FC = () => {
  const { gameState, selectedPlayerColor, rollDice } = useGameStore();
  const [isRollingAnimation, setIsRollingAnimation] = useState(false);

  if (!gameState) return null;

  const activePlayer = gameState.players[gameState.currentTurnIndex];
  const isHumanTurn = activePlayer.color === selectedPlayerColor && !activePlayer.isAI;
  const canRoll = isHumanTurn && !gameState.hasRolled && gameState.turnPhase === 'roll_dice';
  const currentDice = gameState.currentDiceValue;

  const handleRoll = () => {
    if (!canRoll || isRollingAnimation) return;
    setIsRollingAnimation(true);
    setTimeout(() => {
      setIsRollingAnimation(false);
      rollDice();
    }, 450);
  };

  // Render Pips for 1..6
  const renderPips = (val: number | null) => {
    if (!val) {
      return (
        <div className="flex flex-col items-center justify-center text-[#182818]">
          <span className="text-2xl sm:text-3xl">🎲</span>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1 text-[#0d1a0d]">Roll</span>
        </div>
      );
    }

    const pipClass = "w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#0d1a0d] shadow-inner";

    switch (val) {
      case 1:
        return <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-600 shadow-md shadow-red-500/50" />;
      case 2:
        return (
          <div className="w-full h-full p-2 flex justify-between">
            <div className={pipClass} />
            <div className={`${pipClass} self-end`} />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full p-2 flex justify-between">
            <div className={pipClass} />
            <div className={`${pipClass} self-center`} />
            <div className={`${pipClass} self-end`} />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full p-2 grid grid-cols-2 place-items-center">
            <div className={pipClass} /><div className={pipClass} />
            <div className={pipClass} /><div className={pipClass} />
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full p-2 grid grid-cols-3 place-items-center">
            <div className={pipClass} /><div></div><div className={pipClass} />
            <div></div><div className={`${pipClass} bg-red-600`} /><div></div>
            <div className={pipClass} /><div></div><div className={pipClass} />
          </div>
        );
      case 6:
        return (
          <div className="w-full h-full p-2 grid grid-cols-2 grid-rows-3 place-items-center gap-1">
            <div className={pipClass} /><div className={pipClass} />
            <div className={pipClass} /><div className={pipClass} />
            <div className={pipClass} /><div className={pipClass} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div id="onboarding-dice-target" className="flex flex-col items-center justify-center gap-2">
      {/* Consecutive Sixes Warning Banner */}
      {activePlayer.consecutiveSixes > 0 && (
        <div className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 animate-pulse">
          <Flame className="w-3 h-3 text-[#d4af37]" />
          <span>Sixes: {activePlayer.consecutiveSixes}/3</span>
        </div>
      )}

      {/* 3D Dice Box Container with Timer Ring */}
      <div className="relative">
        {/* Pulsing Aura if can roll */}
        {canRoll && (
          <div
            className={`absolute -inset-2 rounded-2xl blur-md opacity-80 pointer-events-none transition-all ${
              gameState.turnTimeRemaining <= 5
                ? 'bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-ping'
                : 'bg-gradient-to-r from-[#e8c858] via-[#d4af37] to-[#aa8218] animate-pulse'
            }`}
          />
        )}

        <motion.button
          id="btn-roll-dice"
          disabled={!canRoll && !activePlayer.isAI}
          onClick={handleRoll}
          whileHover={canRoll ? { scale: 1.08, rotate: 2 } : {}}
          whileTap={canRoll ? { scale: 0.92, rotate: -4 } : {}}
          animate={
            isRollingAnimation
              ? {
                  rotate: [0, 180, 360, 540],
                  scale: [1, 1.25, 0.95, 1],
                }
              : {}
          }
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-[#fbf8ee] via-[#ece3ca] to-[#dfd5b5] border-2 sm:border-3 shadow-xl flex items-center justify-center ${
            canRoll
              ? gameState.turnTimeRemaining <= 5
                ? 'cursor-pointer border-red-500 ring-4 ring-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.7)] animate-pulse'
                : 'cursor-pointer border-[#d4af37] ring-4 ring-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
              : 'opacity-90 cursor-default border-[#d4af37] shadow-black/60'
          }`}
        >
          {/* Inner Pip Render */}
          {renderPips(currentDice)}

          {/* Cheetah Boost Indicator */}
          {activePlayer.activeBuff?.type === 'sprint' && (
            <div className="absolute -bottom-1 -right-1 bg-amber-600 text-white rounded-full p-1 shadow-md">
              <Zap className="w-3 h-3" />
            </div>
          )}
        </motion.button>
      </div>

      {/* Action / Helper Text */}
      <div className="text-center">
        {canRoll && (
          <span
            className={`text-xs sm:text-sm font-black tracking-wide drop-shadow ${
              gameState.turnTimeRemaining <= 5
                ? 'text-red-400 animate-ping'
                : 'text-[#d4af37] animate-bounce'
            }`}
          >
            {gameState.turnTimeRemaining <= 5 ? `RUSH! ${gameState.turnTimeRemaining}s - ROLL NOW!` : 'TAP TO ROLL!'}
          </span>
        )}
        {!canRoll && gameState.turnPhase === 'select_piece' && isHumanTurn && (
          <span className={`text-xs font-semibold animate-pulse ${gameState.turnTimeRemaining <= 5 ? 'text-red-400 font-black' : 'text-[#e0dcc5]'}`}>
            {gameState.turnTimeRemaining <= 5 ? `MOVE NOW (${gameState.turnTimeRemaining}s)` : 'Select a glowing animal to move'}
          </span>
        )}
        {activePlayer.isAI && (
          <span className="text-xs text-[#d4af37]/80 italic">
            {activePlayer.name} is thinking...
          </span>
        )}
      </div>
    </div>
  );
};
