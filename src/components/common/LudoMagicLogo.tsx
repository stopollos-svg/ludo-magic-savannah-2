/**
 * Ludo Magic Savannah Edition - Official Brand Logo Component
 * Matches the golden carved 3D bevel and wooden scroll ribbon from the video attachment.
 */

import React from 'react';
import { Sparkles } from 'lucide-react';

interface LudoMagicLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showLeaves?: boolean;
}

export const LudoMagicLogo: React.FC<LudoMagicLogoProps> = ({
  size = 'md',
  showLeaves = true,
}) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <div className="relative flex flex-col items-center select-none py-1">
      {/* Surrounding Tropical / Acacia Leaves Frame (Matching Video attachment) */}
      {showLeaves && (
        <div className="absolute -top-3 inset-x-0 flex items-center justify-between pointer-events-none opacity-90 z-10 px-2 sm:px-6">
          {/* Left Leaf Cluster */}
          <div className="flex items-center -space-x-1 transform -rotate-12">
            <span className="text-xl sm:text-2xl filter drop-shadow">🌿</span>
            <span className="text-sm sm:text-base filter drop-shadow -mt-2">🍃</span>
          </div>
          {/* Center Crown Sparkle */}
          <div className="flex items-center gap-1 opacity-80 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f5df88]" />
          </div>
          {/* Right Leaf Cluster */}
          <div className="flex items-center -space-x-1 transform rotate-12 scale-x-[-1]">
            <span className="text-xl sm:text-2xl filter drop-shadow">🌿</span>
            <span className="text-sm sm:text-base filter drop-shadow -mt-2">🍃</span>
          </div>
        </div>
      )}

      {/* Main Container with subtle 3D depth */}
      <div className="relative flex flex-col items-center group">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-[#d4af37]/20 blur-xl rounded-full scale-110 pointer-events-none" />

        {/* 1. "LUDO MAGIC" 3D Beveled Gold Typography */}
        <div className="relative z-10 flex items-center justify-center tracking-wider font-serif">
          <h1
            className={`font-black uppercase tracking-widest text-center leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#fff2b2] via-[#e5be48] to-[#996c0d] filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] ${
              isSmall
                ? 'text-xl sm:text-2xl'
                : isLarge
                ? 'text-3xl sm:text-5xl md:text-6xl'
                : 'text-2xl sm:text-4xl md:text-5xl'
            }`}
            style={{
              textShadow: '0 2px 0 #ffeaa7, 0 4px 0 #d4af37, 0 6px 0 #8b6508, 0 8px 12px rgba(0,0,0,0.85)',
              WebkitTextStroke: '1px rgba(255, 230, 130, 0.4)',
            }}
          >
            LUDO MAGIC
          </h1>
        </div>

        {/* 2. "Savannah Edition" Carved Wooden Plank Ribbon */}
        <div className="relative z-10 -mt-1 sm:-mt-2 flex items-center justify-center">
          <div className="relative px-5 sm:px-8 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-[#2c1c0e] via-[#4a2e16] to-[#2c1c0e] border-2 border-[#d4af37] shadow-lg shadow-black/80 flex items-center justify-center gap-1.5">
            {/* Left Gold Rivet */}
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-br from-[#f5df88] to-[#8b6508] border border-[#f5df88] shadow-sm" />

            {/* Subtitle Text */}
            <span
              className={`font-bold tracking-widest uppercase font-serif text-[#f5df88] text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${
                isSmall ? 'text-[9px] sm:text-[10px]' : 'text-[11px] sm:text-xs'
              }`}
            >
              Savannah Edition
            </span>

            {/* Right Gold Rivet */}
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-br from-[#f5df88] to-[#8b6508] border border-[#f5df88] shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
