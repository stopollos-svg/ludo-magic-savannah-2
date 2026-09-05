/**
 * Ludo Magic Savannah - Living Savannah Background with Moving Animals
 * Features animated elephants walking across the plains, giraffes, birds, swaying acacias, and corner foliage.
 */

import React, { useMemo } from 'react';
import { BoardAmbiance } from '../../types/game';

interface SavannahLivingBackgroundProps {
  ambiance?: BoardAmbiance;
}

export const SavannahLivingBackground: React.FC<SavannahLivingBackgroundProps> = ({
  ambiance = 'sunset',
}) => {
  // Color themes for different ambiances
  const theme = useMemo(() => {
    switch (ambiance) {
      case 'day':
        return {
          sky: 'from-[#1e3c20] via-[#2d5028] to-[#122212]',
          sunGlow: 'radial-gradient(circle, rgba(255, 230, 130, 0.45) 0%, rgba(212, 175, 55, 0.15) 50%, transparent 80%)',
          mountainFar: '#142514',
          mountainMid: '#1a301a',
          groundFar: '#20391d',
          groundMid: '#1b3218',
          animalColor: '#0a150a',
          silhouette: '#0a140a',
        };
      case 'night':
        return {
          sky: 'from-[#070e17] via-[#0b1624] to-[#04080e]',
          sunGlow: 'radial-gradient(circle, rgba(165, 215, 255, 0.3) 0%, rgba(59, 130, 246, 0.1) 60%, transparent 85%)',
          mountainFar: '#060d15',
          mountainMid: '#09131e',
          groundFar: '#08101a',
          groundMid: '#050a11',
          animalColor: '#03060a',
          silhouette: '#03060a',
        };
      case 'oasis':
        return {
          sky: 'from-[#0d2828] via-[#091f1f] to-[#061414]',
          sunGlow: 'radial-gradient(circle, rgba(94, 234, 212, 0.35) 0%, rgba(20, 184, 166, 0.15) 55%, transparent 80%)',
          mountainFar: '#081a1a',
          mountainMid: '#0b2222',
          groundFar: '#0e2b2b',
          groundMid: '#091c1c',
          animalColor: '#040d0d',
          silhouette: '#040d0d',
        };
      case 'sunset':
      default:
        return {
          sky: 'from-[#3a1d0d] via-[#24130a] to-[#101b10]',
          sunGlow: 'radial-gradient(circle, rgba(251, 146, 60, 0.5) 0%, rgba(212, 175, 55, 0.25) 45%, transparent 80%)',
          mountainFar: '#1f100a',
          mountainMid: '#1c150c',
          groundFar: '#22190d',
          groundMid: '#151d13',
          animalColor: '#091209',
          silhouette: '#071007',
        };
    }
  }, [ambiance]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0"
    >
      {/* 1. SKY GRADIENT */}
      <div className={`absolute inset-0 w-full h-full bg-gradient-to-b ${theme.sky}`} />

      {/* 2. GLOWING CELESTIAL ORB (Sun or Moon) */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] rounded-full opacity-70 blur-2xl"
        style={{ background: theme.sunGlow }}
      />
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-[#fff3b0] via-[#f59e0b] to-transparent opacity-40 blur-md" />

      {/* 3. SOARING AFRICAN BIRDS / FISH EAGLES (Continuous loop across sky) */}
      <div className="absolute top-12 sm:top-16 inset-x-0 h-24 overflow-hidden pointer-events-none opacity-75">
        {/* Bird Flock 1 */}
        <div className="absolute animate-fly-flock flex items-center gap-6">
          <svg className="w-7 h-4 animate-bird-wing" viewBox="0 0 40 20" fill={theme.silhouette}>
            <path d="M0,10 Q10,0 20,10 Q30,0 40,10 Q30,12 20,11 Q10,12 0,10 Z" />
          </svg>
          <svg className="w-5 h-3 -mt-3 animate-bird-wing-delay" viewBox="0 0 40 20" fill={theme.silhouette}>
            <path d="M0,10 Q10,0 20,10 Q30,0 40,10 Q30,12 20,11 Q10,12 0,10 Z" />
          </svg>
          <svg className="w-6 h-3.5 mt-2 animate-bird-wing" viewBox="0 0 40 20" fill={theme.silhouette}>
            <path d="M0,10 Q10,0 20,10 Q30,0 40,10 Q30,12 20,11 Q10,12 0,10 Z" />
          </svg>
        </div>
      </div>

      {/* 4. DISTANT MOUNT KILIMANJARO & ROLLING HILLS */}
      <svg
        className="absolute bottom-16 sm:bottom-24 w-[120%] -left-[10%] h-48 sm:h-64 object-cover"
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
      >
        {/* Distant Mountain Peak (Kilimanjaro) */}
        <polygon
          points="250,300 480,120 540,120 750,300"
          fill={theme.mountainFar}
          opacity="0.6"
        />
        {/* Kilimanjaro Snow Crown */}
        <polygon
          points="475,125 545,125 560,145 520,150 495,140 465,145"
          fill="#e0e8f0"
          opacity="0.35"
        />

        {/* Mid-distance undulating savannah hills */}
        <path
          d="M0,300 L0,220 Q200,170 400,210 T800,190 Q1000,175 1200,230 L1200,300 Z"
          fill={theme.mountainMid}
          opacity="0.75"
        />

        {/* Flat-topped Acacia tree silhouettes on the far ridge */}
        <g fill={theme.silhouette} opacity="0.85">
          {/* Tree 1: Left */}
          <path d="M140,220 Q145,190 148,160 L146,160 Q142,190 138,220 Z" />
          <ellipse cx="148" cy="155" rx="28" ry="6" />
          <ellipse cx="160" cy="152" rx="18" ry="4" />
          
          {/* Tree 2: Center Right */}
          <path d="M780,205 Q783,180 785,150 L783,150 Q780,180 778,205 Z" />
          <ellipse cx="785" cy="146" rx="34" ry="7" />
          <ellipse cx="770" cy="143" rx="22" ry="5" />

          {/* Tree 3: Far Right */}
          <path d="M1020,225 Q1022,205 1024,180 L1022,180 Q1020,205 1018,225 Z" />
          <ellipse cx="1024" cy="177" rx="24" ry="5" />
        </g>
      </svg>

      {/* 5. MIDGROUND SAVANNAH RIDGE & GRASSLINE */}
      <svg
        className="absolute bottom-8 sm:bottom-12 w-full h-36 sm:h-48 object-cover"
        viewBox="0 0 1000 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,200 L0,110 Q250,75 500,95 T1000,85 L1000,200 Z"
          fill={theme.groundFar}
          opacity="0.9"
        />
      </svg>

      {/* 6. MOVING ANIMALS LAYER: ELEPHANTS HERD & GIRAFFE */}
      <div className="absolute bottom-16 sm:bottom-24 inset-x-0 h-28 sm:h-36 overflow-hidden pointer-events-none z-0">
        {/* A. ELEPHANTS FAMILY WALKING ACROSS SAVANNAH (Left to Right) */}
        <div className="absolute bottom-2 animate-elephant-march flex items-end gap-5">
          {/* Matriarch / Lead Elephant */}
          <div className="relative transform hover:scale-105 transition">
            <svg
              className="w-20 h-16 sm:w-28 sm:h-22"
              viewBox="0 0 120 90"
              fill={theme.animalColor}
            >
              {/* Back Legs */}
              <g className="animate-leg-back">
                <rect x="25" y="55" width="8" height="30" rx="3" fill={theme.animalColor} opacity="0.85" />
                <rect x="75" y="55" width="8" height="30" rx="3" fill={theme.animalColor} opacity="0.85" />
              </g>

              {/* Elephant Body & Spine */}
              <path
                d="M20,60 C15,40 25,25 45,22 C65,18 85,25 95,38 C100,45 102,52 98,62 C90,66 30,66 20,60 Z"
                fill={theme.animalColor}
              />

              {/* Elephant Head & Big Flapping Ear */}
              <circle cx="95" cy="40" r="16" fill={theme.animalColor} />
              {/* Ear with gentle flutter */}
              <ellipse
                cx="88"
                cy="42"
                rx="10"
                ry="14"
                fill={theme.animalColor}
                stroke="#d4af37"
                strokeWidth="0.5"
                strokeOpacity="0.2"
                className="animate-ear-flap"
              />

              {/* Trunk with swinging cadence */}
              <path
                d="M106,42 Q115,50 114,65 Q112,74 118,72 Q120,68 117,58 Q115,46 106,38 Z"
                fill={theme.animalColor}
                className="animate-trunk-swing"
              />

              {/* White/Ivory Curved Tusk */}
              <path
                d="M102,52 Q112,56 116,51 Q110,48 102,48 Z"
                fill="#f5e6cb"
                opacity="0.9"
              />

              {/* Front Walking Legs */}
              <g className="animate-leg-front">
                <rect x="33" y="54" width="9" height="32" rx="3" fill={theme.animalColor} />
                <rect x="83" y="54" width="9" height="32" rx="3" fill={theme.animalColor} />
              </g>

              {/* Little Tail with swish */}
              <path
                d="M20,40 Q15,52 16,62"
                stroke={theme.animalColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animate-tail-swish"
              />
            </svg>
          </div>

          {/* Second Adult Elephant */}
          <div className="relative hidden sm:block">
            <svg
              className="w-16 h-13 sm:w-22 sm:h-18"
              viewBox="0 0 120 90"
              fill={theme.animalColor}
            >
              <g className="animate-leg-back-offset">
                <rect x="25" y="55" width="8" height="30" rx="3" fill={theme.animalColor} opacity="0.85" />
                <rect x="75" y="55" width="8" height="30" rx="3" fill={theme.animalColor} opacity="0.85" />
              </g>
              <path
                d="M20,60 C15,40 25,25 45,22 C65,18 85,25 95,38 C100,45 102,52 98,62 C90,66 30,66 20,60 Z"
                fill={theme.animalColor}
              />
              <circle cx="95" cy="40" r="15" fill={theme.animalColor} />
              <ellipse cx="88" cy="42" rx="9" ry="13" fill={theme.animalColor} />
              <path
                d="M106,42 Q114,52 112,66 Q110,72 116,70 Q118,66 115,56 Q113,46 106,38 Z"
                fill={theme.animalColor}
                className="animate-trunk-swing"
              />
              <path d="M102,52 Q110,56 114,51 Q108,48 102,48 Z" fill="#f5e6cb" opacity="0.85" />
              <g className="animate-leg-front-offset">
                <rect x="33" y="54" width="9" height="32" rx="3" fill={theme.animalColor} />
                <rect x="83" y="54" width="9" height="32" rx="3" fill={theme.animalColor} />
              </g>
            </svg>
          </div>

          {/* Baby Elephant Calf (Trotting playfully behind parent!) */}
          <div className="relative">
            <svg
              className="w-10 h-8 sm:w-14 sm:h-11"
              viewBox="0 0 120 90"
              fill={theme.animalColor}
            >
              <g className="animate-leg-back">
                <rect x="25" y="55" width="9" height="28" rx="2" fill={theme.animalColor} opacity="0.85" />
                <rect x="75" y="55" width="9" height="28" rx="2" fill={theme.animalColor} opacity="0.85" />
              </g>
              <path
                d="M20,60 C16,42 26,28 45,25 C65,22 84,28 92,40 C97,46 99,53 96,62 C88,66 30,66 20,60 Z"
                fill={theme.animalColor}
              />
              <circle cx="93" cy="40" r="14" fill={theme.animalColor} />
              <ellipse cx="86" cy="41" rx="8" ry="11" fill={theme.animalColor} />
              {/* Playful raised trunk */}
              <path
                d="M102,40 Q115,36 118,28 Q119,25 116,26 Q112,32 104,36 Z"
                fill={theme.animalColor}
                className="animate-trunk-swing"
              />
              <g className="animate-leg-front">
                <rect x="33" y="54" width="9" height="30" rx="2" fill={theme.animalColor} />
                <rect x="83" y="54" width="9" height="30" rx="2" fill={theme.animalColor} />
              </g>
            </svg>
          </div>
        </div>

        {/* B. MOVING GIRAFFE PACING GRACEFULLY (Slower speed, opposite direction or staggered) */}
        <div className="absolute bottom-3 animate-giraffe-stroll flex items-end">
          <svg
            className="w-16 h-28 sm:w-20 sm:h-36"
            viewBox="0 0 80 140"
            fill={theme.animalColor}
            opacity="0.9"
          >
            {/* Long Legs with walk cycle */}
            <g className="animate-giraffe-legs-back">
              <rect x="22" y="75" width="4" height="60" rx="1.5" fill={theme.animalColor} opacity="0.8" />
              <rect x="52" y="75" width="4" height="60" rx="1.5" fill={theme.animalColor} opacity="0.8" />
            </g>
            {/* Sloped Body */}
            <path d="M18,78 C15,62 25,54 45,52 C55,50 62,56 60,76 C55,82 25,84 18,78 Z" fill={theme.animalColor} />
            {/* Very Long Neck & Head */}
            <g className="animate-neck-bob">
              <path d="M48,55 L58,16 L65,18 L55,56 Z" fill={theme.animalColor} />
              {/* Head with ossicones/horns */}
              <ellipse cx="64" cy="16" rx="7" ry="5" fill={theme.animalColor} />
              <circle cx="63" cy="11" r="1.5" fill={theme.animalColor} />
              <circle cx="66" cy="11" r="1.5" fill={theme.animalColor} />
            </g>
            {/* Front Legs */}
            <g className="animate-giraffe-legs-front">
              <rect x="28" y="74" width="4.5" height="62" rx="1.5" fill={theme.animalColor} />
              <rect x="58" y="74" width="4.5" height="62" rx="1.5" fill={theme.animalColor} />
            </g>
            {/* Tail */}
            <path d="M18,72 Q12,85 14,94" stroke={theme.animalColor} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* 7. FOREGROUND GRASSLAND & BOTTOM HORIZON */}
      <svg
        className="absolute bottom-0 w-full h-16 sm:h-24 object-cover"
        viewBox="0 0 1000 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,120 L0,45 Q180,20 360,35 T720,25 Q860,18 1000,40 L1000,120 Z"
          fill={theme.groundMid}
        />
      </svg>

      {/* 8. FOREGROUND JUNGLE VINES & FOLIAGE FRAMING (Matching attached video corners!) */}
      {/* Top Left Vines & Leaves */}
      <div className="absolute top-0 left-0 w-36 sm:w-56 h-36 sm:h-56 pointer-events-none opacity-85">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          {/* Main Vine branches */}
          <path
            d="M-10,-10 Q40,60 70,120 Q80,140 100,150"
            stroke="#162916"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M-10,-10 Q70,40 130,60 Q160,70 180,75"
            stroke="#1b321b"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Hanging Green Leaves */}
          <ellipse cx="50" cy="80" rx="16" ry="26" transform="rotate(-30 50 80)" fill="#1c3b1c" stroke="#2a552a" strokeWidth="1" />
          <ellipse cx="80" cy="130" rx="14" ry="24" transform="rotate(20 80 130)" fill="#183418" stroke="#254a25" strokeWidth="1" />
          <ellipse cx="110" cy="160" rx="12" ry="20" transform="rotate(45 110 160)" fill="#142c14" />
          <ellipse cx="120" cy="65" rx="16" ry="26" transform="rotate(-60 120 65)" fill="#1f421f" stroke="#2c5d2c" strokeWidth="1" />
          <ellipse cx="165" cy="80" rx="14" ry="22" transform="rotate(-40 165 80)" fill="#193519" />
          <ellipse cx="30" cy="35" rx="18" ry="28" transform="rotate(15 30 35)" fill="#234a23" />
        </svg>
      </div>

      {/* Top Right Vines & Leaves */}
      <div className="absolute top-0 right-0 w-36 sm:w-56 h-36 sm:h-56 pointer-events-none opacity-85 transform scale-x-[-1]">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          <path
            d="M-10,-10 Q50,50 80,110 Q90,135 110,145"
            stroke="#162916"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <ellipse cx="60" cy="70" rx="16" ry="25" transform="rotate(-25 60 70)" fill="#1c3b1c" />
          <ellipse cx="90" cy="120" rx="13" ry="22" transform="rotate(15 90 120)" fill="#183418" />
          <ellipse cx="130" cy="50" rx="15" ry="24" transform="rotate(-55 130 50)" fill="#1f421f" />
        </svg>
      </div>

      {/* Bottom Right Golden Savannah Straw / Hay Nest (Exact match to video corner!) */}
      <div className="absolute -bottom-6 -right-6 w-40 sm:w-60 h-36 sm:h-48 pointer-events-none opacity-80">
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
          {/* Layered thatched golden straw reeds */}
          <path d="M40,160 Q80,100 130,80 T200,60" stroke="#d4af37" strokeWidth="3" opacity="0.6" />
          <path d="M60,160 Q100,110 150,90 T200,80" stroke="#b89428" strokeWidth="4" opacity="0.7" />
          <path d="M20,160 Q70,90 120,70 T200,50" stroke="#e8c858" strokeWidth="2.5" opacity="0.8" />
          <path d="M80,160 Q120,120 170,100 T200,100" stroke="#8a6b18" strokeWidth="4.5" opacity="0.9" />
          <ellipse cx="160" cy="120" rx="50" ry="35" fill="#2d2208" opacity="0.6" />
        </svg>
      </div>

      {/* Bottom Left Foliage & Bush (Matching video corner!) */}
      <div className="absolute -bottom-4 -left-4 w-36 sm:w-52 h-32 sm:h-44 pointer-events-none opacity-80">
        <svg viewBox="0 0 180 140" fill="none" className="w-full h-full">
          <ellipse cx="40" cy="120" rx="55" ry="40" fill="#0d1f0d" />
          <ellipse cx="70" cy="100" rx="45" ry="35" fill="#132c13" />
          <ellipse cx="30" cy="90" rx="35" ry="30" fill="#183618" />
          <path d="M20,120 Q60,60 90,40" stroke="#2a522a" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="90" cy="40" rx="12" ry="18" transform="rotate(30 90 40)" fill="#1c3d1c" />
        </svg>
      </div>

      {/* 9. SUBTLE FLOATING FIREFLIES / GOLDEN DUST PARTICLES */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-28 left-[15%] w-2 h-2 rounded-full bg-[#f5df88] animate-firefly-1 blur-[0.5px] opacity-75 shadow-[0_0_8px_#d4af37]" />
        <div className="absolute bottom-40 left-[45%] w-1.5 h-1.5 rounded-full bg-[#f5df88] animate-firefly-2 blur-[0.5px] opacity-65 shadow-[0_0_6px_#d4af37]" />
        <div className="absolute bottom-32 right-[25%] w-2 h-2 rounded-full bg-[#f5df88] animate-firefly-3 blur-[0.5px] opacity-70 shadow-[0_0_8px_#d4af37]" />
        <div className="absolute bottom-48 right-[12%] w-1.5 h-1.5 rounded-full bg-[#f5df88] animate-firefly-1 blur-[0.5px] opacity-60 shadow-[0_0_6px_#d4af37]" />
      </div>
    </div>
  );
};
