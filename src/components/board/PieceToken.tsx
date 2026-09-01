/**
 * Ludo Magic Savannah - Animated Animal Piece Token Component
 */

import React from 'react';
import { motion } from 'motion/react';
import { PieceState, PlayerColor, BeastType } from '../../types/game';
import { getPixelCoordinates } from '../../utils/boardCoordinates';
import { Shield, Sparkles } from 'lucide-react';

interface PieceTokenProps {
  piece: PieceState;
  color: PlayerColor;
  beast: BeastType;
  isValidMove: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

const COLOR_STYLES: Record<PlayerColor, { bg: string; border: string; glow: string; text: string }> = {
  red: {
    bg: 'from-amber-600 to-red-600',
    border: 'border-amber-300',
    glow: 'shadow-red-500/80',
    text: 'text-amber-100',
  },
  green: {
    bg: 'from-emerald-600 to-teal-700',
    border: 'border-emerald-300',
    glow: 'shadow-emerald-500/80',
    text: 'text-emerald-100',
  },
  yellow: {
    bg: 'from-yellow-500 to-amber-600',
    border: 'border-yellow-200',
    glow: 'shadow-yellow-400/90',
    text: 'text-yellow-950',
  },
  blue: {
    bg: 'from-blue-600 to-indigo-700',
    border: 'border-cyan-300',
    glow: 'shadow-blue-500/80',
    text: 'text-blue-100',
  },
};

const BEAST_EMOJIS: Record<BeastType, string> = {
  lion: '🦁',
  elephant: '🐘',
  cheetah: '🐆',
  zebra: '🦓',
  giraffe: '🦒',
  rhino: '🦏',
};

export const PieceToken: React.FC<PieceTokenProps> = ({
  piece,
  color,
  beast,
  isValidMove,
  isSelected,
  onSelect,
}) => {
  const { leftPercent, topPercent } = getPixelCoordinates(
    piece.position,
    piece.stepCount,
    color,
    piece.id
  );

  const style = COLOR_STYLES[color];
  const emoji = BEAST_EMOJIS[beast] || '🦁';

  return (
    <motion.div
      id={`token-${color}-${piece.id}`}
      onClick={(e) => {
        e.stopPropagation();
        if (isValidMove) onSelect();
      }}
      className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer touch-manipulation transition-transform ${
        isValidMove ? 'cursor-pointer hover:scale-125' : 'cursor-default'
      }`}
      style={{
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
      }}
      animate={{
        scale: isSelected ? 1.25 : isValidMove ? [1, 1.18, 1] : 1,
        y: isValidMove ? [0, -6, 0] : 0,
      }}
      transition={{
        duration: isValidMove ? 1.2 : 0.25,
        repeat: isValidMove ? Infinity : 0,
        ease: 'easeInOut',
      }}
    >
      <div
        className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${style.bg} border-2 ${style.border} shadow-lg ${
          isValidMove ? `ring-4 ring-yellow-400/90 shadow-xl ${style.glow}` : 'shadow-black/60'
        } ${piece.hasFinished ? 'opacity-80 scale-90 ring-2 ring-amber-400' : ''}`}
      >
        {/* Animal Avatar Icon */}
        <span className="text-base sm:text-xl filter drop-shadow select-none">{emoji}</span>

        {/* Shield Aura if active */}
        {piece.isShielded && (
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-amber-950 shadow-md">
            <Shield className="w-2.5 h-2.5 fill-amber-950" />
          </div>
        )}

        {/* Valid Move Indicator Pulsing Sparkle */}
        {isValidMove && (
          <div className="absolute -inset-1 rounded-full border border-yellow-300 animate-ping opacity-60 pointer-events-none" />
        )}

        {/* Goal Finish Crown */}
        {piece.hasFinished && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs">
            ✨
          </div>
        )}
      </div>
    </motion.div>
  );
};
