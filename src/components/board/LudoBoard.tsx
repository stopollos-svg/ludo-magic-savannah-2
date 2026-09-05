/**
 * Ludo Magic Savannah - Thematic 15x15 Ludo Board
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import { MAIN_PATH_COORDS, HOME_STRETCH_COORDS } from '../../utils/boardCoordinates';
import { SAFE_POSITIONS, START_POSITIONS, PlayerColor, PlayerInfo } from '../../types/game';
import { PieceToken } from './PieceToken';
import { Sparkles, Shield, TreePine } from 'lucide-react';

interface LudoBoardProps {
  onTileClick?: (tileIndex: number) => void;
}

export const LudoBoard: React.FC<LudoBoardProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { gameState, selectedPlayerColor, selectPieceToMove } = useGameStore();

  // Particle System (Savannah Golden Dust / Fireflies)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Array<{ x: number; y: number; size: number; speedY: number; speedX: number; alpha: number; hue: number }> = [];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = canvas.parentElement?.clientHeight || 400;
    };
    resize();

    // Create 24 particles
    for (let i = 0; i < 24; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 1,
        speedY: -(Math.random() * 0.4 + 0.1),
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.7 + 0.2,
        hue: Math.random() > 0.5 ? 45 : 35, // Gold / Amber
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < 0) p.y = canvas.height;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.fillStyle = `hsla(${p.hue}, 95%, 60%, ${p.alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [gameState?.settings.ambiance]);

  if (!gameState) return null;

  const activePlayer = gameState.players[gameState.currentTurnIndex];
  const validMoves = gameState.validPieceMoves;

  // Render Grid helper
  const renderTrackCell = (col: number, row: number) => {
    // Check if cell is in main path
    const mainIndex = MAIN_PATH_COORDS.findIndex((c) => c.col === col && c.row === row);
    const isMainPath = mainIndex !== -1;
    const isSafe = isMainPath && SAFE_POSITIONS.includes(mainIndex);

    // Check if is start tile
    const isRedStart = mainIndex === START_POSITIONS.red;
    const isGreenStart = mainIndex === START_POSITIONS.green;
    const isYellowStart = mainIndex === START_POSITIONS.yellow;
    const isBlueStart = mainIndex === START_POSITIONS.blue;

    // Check Home Stretch
    const isRedHomeLane = col >= 1 && col <= 5 && row === 7;
    const isGreenHomeLane = row >= 1 && row <= 5 && col === 7;
    const isYellowHomeLane = col >= 9 && col <= 13 && row === 7;
    const isBlueHomeLane = row >= 9 && row <= 13 && col === 7;

    // Cell styles
    let cellBg = 'bg-[#132013]/70 border-[#d4af37]/20';
    let label = '';
    let icon = null;

    if (isSafe) {
      cellBg = 'bg-gradient-to-br from-[#283828] to-[#152415] border-[#d4af37]/80 shadow-inner';
      icon = <TreePine className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d4af37]" />;
    } else if (isRedStart || isRedHomeLane) {
      cellBg = isRedStart
        ? 'bg-red-800/80 border-red-400 font-bold text-red-100'
        : 'bg-red-950/70 border-red-500/50';
      if (isRedStart) label = '🦁';
    } else if (isGreenStart || isGreenHomeLane) {
      cellBg = isGreenStart
        ? 'bg-emerald-800/80 border-emerald-400 font-bold text-emerald-100'
        : 'bg-emerald-950/70 border-emerald-500/50';
      if (isGreenStart) label = '🐘';
    } else if (isYellowStart || isYellowHomeLane) {
      cellBg = isYellowStart
        ? 'bg-[#d4af37]/80 border-[#f5df88] font-bold text-[#0d1a0d]'
        : 'bg-yellow-950/70 border-[#d4af37]/50';
      if (isYellowStart) label = '🐆';
    } else if (isBlueStart || isBlueHomeLane) {
      cellBg = isBlueStart
        ? 'bg-blue-800/80 border-blue-400 font-bold text-blue-100'
        : 'bg-blue-950/70 border-blue-500/50';
      if (isBlueStart) label = '🦓';
    }

    return (
      <div
        key={`cell-${col}-${row}`}
        className={`relative w-full h-full border-[0.5px] rounded-sm flex items-center justify-center transition-colors ${cellBg}`}
      >
        {icon}
        {label && <span className="text-xs sm:text-sm">{label}</span>}
      </div>
    );
  };

  // Map active players by color
  const activePlayersByColor = useMemo(() => {
    const map: Partial<Record<PlayerColor, PlayerInfo>> = {};
    gameState.players.forEach((p) => {
      map[p.color] = p;
    });
    return map;
  }, [gameState.players]);

  const redPlayer = activePlayersByColor['red'];
  const greenPlayer = activePlayersByColor['green'];
  const yellowPlayer = activePlayersByColor['yellow'];
  const bluePlayer = activePlayersByColor['blue'];

  return (
    <div
      id="onboarding-board-target"
      className="relative w-full max-w-[560px] aspect-square mx-auto p-2 sm:p-3 bg-gradient-to-b from-[#182818] via-[#0f1b0f] to-[#081008] rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#d4af37]/60 shadow-2xl shadow-black overflow-hidden select-none"
    >
      {/* Background Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70"
      />

      {/* The 15x15 Main Board Layout Container */}
      <div className="relative w-full h-full grid grid-cols-15 grid-rows-15 gap-[1px] bg-[#0a120a] rounded-xl overflow-hidden shadow-inner border border-[#d4af37]/30">
        
        {/* --- 4 YARD BASES (6x6 cells each) --- */}
        {/* 1. Red Yard (Top Left: Lion Rock) */}
        <div
          className={`col-span-6 row-span-6 border-2 p-2 sm:p-3 flex flex-col justify-between rounded-tl-lg relative overflow-hidden shadow-lg transition-all ${
            redPlayer
              ? 'bg-gradient-to-br from-[#2d0f0f] via-[#1a0808] to-[#120505] border-red-500/50'
              : 'bg-[#080f08]/80 border-stone-800/40 opacity-35'
          }`}
        >
          <div className="flex items-center justify-between text-red-200">
            <span className="font-bold text-xs sm:text-sm tracking-wide flex items-center gap-1">
              {redPlayer ? `${redPlayer.avatar} ${redPlayer.name}` : '🌿 Lion Rock'}
            </span>
            <span className="text-[10px] text-red-300/70 uppercase">
              {redPlayer ? 'Active Yard' : 'Resting'}
            </span>
          </div>
          {/* Inner Yard Circle */}
          <div className="w-full aspect-square max-w-[80%] mx-auto bg-black/50 rounded-xl border border-red-400/20 grid grid-cols-2 grid-rows-2 p-2 gap-2 place-items-center">
            {redPlayer ? (
              <>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center text-xs">🐾</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center text-xs">🐾</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center text-xs">🐾</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center text-xs">🐾</div>
              </>
            ) : (
              <>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0d160d]/50 border border-stone-800/40 flex items-center justify-center text-[10px] text-stone-600">·</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0d160d]/50 border border-stone-800/40 flex items-center justify-center text-[10px] text-stone-600">·</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0d160d]/50 border border-stone-800/40 flex items-center justify-center text-[10px] text-stone-600">·</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0d160d]/50 border border-stone-800/40 flex items-center justify-center text-[10px] text-stone-600">·</div>
              </>
            )}
          </div>
        </div>

        {/* Top Arm (Cols 6..8, Rows 0..5) */}
        <div className="col-span-3 row-span-6 grid grid-cols-3 grid-rows-6">
          {Array.from({ length: 18 }).map((_, i) => {
            const row = Math.floor(i / 3);
            const col = 6 + (i % 3);
            return renderTrackCell(col, row);
          })}
        </div>

        {/* 2. Green Yard (Top Right: Elephant Valley) */}
        <div
          className={`col-span-6 row-span-6 border-2 p-2 sm:p-3 flex flex-col justify-between rounded-tr-lg relative overflow-hidden shadow-lg transition-all ${
            greenPlayer
              ? 'bg-gradient-to-bl from-[#0f2d18] via-[#081a0e] to-[#05120a] border-emerald-500/50'
              : 'bg-[#080f08]/80 border-stone-800/40 opacity-35'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-200">
            <span className="font-bold text-xs sm:text-sm tracking-wide flex items-center gap-1">
              {greenPlayer ? `${greenPlayer.avatar} ${greenPlayer.name}` : '🌿 Elephant Glade'}
            </span>
            <span className="text-[10px] text-emerald-300/70 uppercase">
              {greenPlayer ? 'Active Yard' : 'Resting'}
            </span>
          </div>
          <div className="w-full aspect-square max-w-[80%] mx-auto bg-black/50 rounded-xl border border-emerald-400/20 grid grid-cols-2 grid-rows-2 p-2 gap-2 place-items-center">
            {greenPlayer ? (
              <>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-xs">🐾</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-xs">🐾</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-xs">🐾</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-xs">🐾</div>
              </>
            ) : (
              <>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0d160d]/50 border border-stone-800/40 flex items-center justify-center text-[10px] text-stone-600">·</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0d160d]/50 border border-stone-800/40 flex items-center justify-center text-[10px] text-stone-600">·</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0d160d]/50 border border-stone-800/40 flex items-center justify-center text-[10px] text-stone-600">·</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0d160d]/50 border border-stone-800/40 flex items-center justify-center text-[10px] text-stone-600">·</div>
              </>
            )}
          </div>
        </div>

        {/* Left Arm (Cols 0..5, Rows 6..8) */}
        <div className="col-span-6 row-span-3 grid grid-cols-6 grid-rows-3">
          {Array.from({ length: 18 }).map((_, i) => {
            const row = 6 + Math.floor(i / 6);
            const col = i % 6;
            return renderTrackCell(col, row);
          })}
        </div>

        {/* --- CENTER WATERHOLE (Sacred Oasis Goal 3x3) --- */}
        <div className="col-span-3 row-span-3 relative bg-gradient-to-br from-[#0c222c] via-[#091720] to-[#0d1a0d] border-2 border-[#d4af37] shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Water ripples SVG */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-400/20 via-transparent to-transparent animate-pulse" />
          
          {/* 4 Colored Goal Triangles */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {/* Red Triangle */}
            <polygon points="0,0 50,50 0,100" fill="#dc2626" fillOpacity={redPlayer ? '0.85' : '0.15'} />
            {/* Green Triangle */}
            <polygon points="0,0 100,0 50,50" fill="#059669" fillOpacity={greenPlayer ? '0.85' : '0.15'} />
            {/* Yellow Triangle */}
            <polygon points="100,0 100,100 50,50" fill="#d4af37" fillOpacity={yellowPlayer ? '0.85' : '0.15'} />
            {/* Blue Triangle */}
            <polygon points="0,100 100,100 50,50" fill="#2563eb" fillOpacity={bluePlayer ? '0.85' : '0.15'} />
          </svg>

          {/* Central Sacred Oasis Totem */}
          <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-[#f5df88] to-[#d4af37] border-2 border-[#f5df88] flex items-center justify-center shadow-lg shadow-[#d4af37]/50">
            <span className="text-sm sm:text-base">🏆</span>
          </div>
        </div>

        {/* Right Arm (Cols 9..14, Rows 6..8) */}
        <div className="col-span-6 row-span-3 grid grid-cols-6 grid-rows-3">
          {Array.from({ length: 18 }).map((_, i) => {
            const row = 6 + Math.floor(i / 6);
            const col = 9 + (i % 6);
            return renderTrackCell(col, row);
          })}
        </div>

        {/* 3. Blue Yard (Bottom Left: Zebra Haven) */}
        <div
          className={`col-span-6 row-span-6 border-2 p-2 sm:p-3 flex flex-col justify-between rounded-bl-lg relative overflow-hidden shadow-lg transition-all ${
            bluePlayer
              ? 'bg-gradient-to-tr from-[#0f1c2d] via-[#08101a] to-[#050a12] border-blue-500/50'
              : 'bg-[#080f08]/80 border-stone-800/40 opacity-35'
          }`}
        >
          <div className="w-full aspect-square max-w-[80%] mx-auto bg-black/50 rounded-xl border border-blue-400/20 grid grid-cols-2 grid-rows-2 p-2 gap-2 place-items-center">
            {bluePlayer ? (
              <>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-xs">🐾</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-xs">🐾</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-xs">🐾</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-xs">🐾</div>
              </>
            ) : (
              <>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0d160d]/50 border border-stone-800/40 flex items-center justify-center text-[10px] text-stone-600">·</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0d160d]/50 border border-stone-800/40 flex items-center justify-center text-[10px] text-stone-600">·</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0d160d]/50 border border-stone-800/40 flex items-center justify-center text-[10px] text-stone-600">·</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0d160d]/50 border border-stone-800/40 flex items-center justify-center text-[10px] text-stone-600">·</div>
              </>
            )}
          </div>
          <div className="flex items-center justify-between text-blue-200">
            <span className="font-bold text-xs sm:text-sm tracking-wide flex items-center gap-1">
              {bluePlayer ? `${bluePlayer.avatar} ${bluePlayer.name}` : '🌿 Zebra Haven'}
            </span>
            <span className="text-[10px] text-blue-300/70 uppercase">
              {bluePlayer ? 'Active Yard' : 'Resting'}
            </span>
          </div>
        </div>

        {/* Bottom Arm (Cols 6..8, Rows 9..14) */}
        <div className="col-span-3 row-span-6 grid grid-cols-3 grid-rows-6">
          {Array.from({ length: 18 }).map((_, i) => {
            const row = 9 + Math.floor(i / 3);
            const col = 6 + (i % 3);
            return renderTrackCell(col, row);
          })}
        </div>

        {/* 4. Yellow Yard (Bottom Right: Giraffe Plains) */}
        <div
          className={`col-span-6 row-span-6 border-2 p-2 sm:p-3 flex flex-col justify-between rounded-br-lg relative overflow-hidden shadow-lg transition-all ${
            yellowPlayer
              ? 'bg-gradient-to-tl from-[#2d250f] via-[#1a1508] to-[#120f05] border-[#d4af37]/50'
              : 'bg-[#080f08]/80 border-stone-800/40 opacity-35'
          }`}
        >
          <div className="w-full aspect-square max-w-[80%] mx-auto bg-black/50 rounded-xl border border-[#d4af37]/20 grid grid-cols-2 grid-rows-2 p-2 gap-2 place-items-center">
            {yellowPlayer ? (
              <>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-950/80 border border-[#d4af37]/40 flex items-center justify-center text-xs">🐾</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-950/80 border border-[#d4af37]/40 flex items-center justify-center text-xs">🐾</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-950/80 border border-[#d4af37]/40 flex items-center justify-center text-xs">🐾</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-950/80 border border-[#d4af37]/40 flex items-center justify-center text-xs">🐾</div>
              </>
            ) : (
              <>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0d160d]/50 border border-stone-800/40 flex items-center justify-center text-[10px] text-stone-600">·</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0d160d]/50 border border-stone-800/40 flex items-center justify-center text-[10px] text-stone-600">·</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0d160d]/50 border border-stone-800/40 flex items-center justify-center text-[10px] text-stone-600">·</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0d160d]/50 border border-stone-800/40 flex items-center justify-center text-[10px] text-stone-600">·</div>
              </>
            )}
          </div>
          <div className="flex items-center justify-between text-[#f5df88]">
            <span className="font-bold text-xs sm:text-sm tracking-wide flex items-center gap-1">
              {yellowPlayer ? `${yellowPlayer.avatar} ${yellowPlayer.name}` : '🌿 Giraffe Valley'}
            </span>
            <span className="text-[10px] text-[#f5df88]/70 uppercase">
              {yellowPlayer ? 'Active Yard' : 'Resting'}
            </span>
          </div>
        </div>

      </div>

      {/* --- ALL 16 PIECE TOKENS RENDERED OVERLAY --- */}
      {gameState.players.map((player) =>
        player.pieces.map((piece) => {
          const isCurrentActivePlayer = player.color === activePlayer.color;
          const isMovable =
            isCurrentActivePlayer &&
            gameState.hasRolled &&
            validMoves.includes(piece.id) &&
            (!player.isAI || player.color === selectedPlayerColor);

          return (
            <PieceToken
              key={`piece-${player.color}-${piece.id}`}
              piece={piece}
              color={player.color}
              beast={player.beast}
              isValidMove={Boolean(isMovable)}
              isSelected={gameState.selectedPieceId === piece.id}
              onSelect={() => selectPieceToMove(piece.id)}
            />
          );
        })
      )}
    </div>
  );
};
