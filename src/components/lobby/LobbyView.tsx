/**
 * Ludo Magic Savannah - Main Lobby & Mode Selector
 */

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { GameMode, AIDifficulty, PlayerColor, BeastType, BoardAmbiance } from '../../types/game';
import { getRankBadge } from '../../utils/ludoEngine';
import {
  Play,
  Bot,
  Users,
  Trophy,
  Sparkles,
  Shield,
  Zap,
  Flame,
  Swords,
  KeyRound,
  RotateCcw,
  Check,
  ChevronRight,
  FlameKindling,
} from 'lucide-react';

export const LobbyView: React.FC = () => {
  const {
    userProfile,
    startNewGame,
    isMatchmaking,
    matchmakingSeconds,
    startMatchmakingQueue,
    cancelMatchmakingQueue,
    startTournament,
    setView,
  } = useGameStore();

  // Mode Selection / Customizer state
  const [selectedMode, setSelectedMode] = useState<GameMode>('vs_ai');
  const [playerCount, setPlayerCount] = useState<2 | 3 | 4>(4);
  const [isMagicEnabled, setIsMagicEnabled] = useState(true);
  const [fastMode, setFastMode] = useState(false);
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('medium');
  const [humanColor, setHumanColor] = useState<PlayerColor>('red');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [ambiance, setAmbiance] = useState<BoardAmbiance>('sunset');

  const rankBadge = getRankBadge(userProfile.stats.currentElo);

  const handleStartGame = () => {
    if (selectedMode === 'online_ranked') {
      startMatchmakingQueue();
      return;
    }

    if (selectedMode === 'tournament') {
      startTournament();
      return;
    }

    startNewGame(
      {
        mode: selectedMode,
        playerCount,
        isMagicEnabled,
        turnTimeoutSeconds: 20,
        fastMode,
        ambiance,
        boardTheme: 'savannah_gold',
        diceSkin: 'sunstone',
      },
      humanColor
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* 1. HERO BANNER: Player Ranked Card & Season Progress */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#172617] via-[#101b10] to-[#1d160b] border-2 border-[#d4af37]/40 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/80 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Avatar & Rank */}
        <div className="flex items-center gap-4 text-left w-full md:w-auto">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#f5df88] via-[#d4af37] to-[#8b6508] border-2 border-[#f5df88]/80 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-[#d4af37]/30">
              {userProfile.avatar}
            </div>
            <div className="absolute -bottom-2 -right-1 bg-[#0a120a] text-[#d4af37] border border-[#d4af37]/50 px-2 py-0.5 rounded-full text-[10px] font-bold">
              LVL {userProfile.level}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#e0dcc5] font-serif">
                {userProfile.username}
              </h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                {userProfile.clanName || 'Clan Nomad'}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm">{rankBadge.icon}</span>
              <span className="text-xs font-bold text-[#d4af37]">{rankBadge.title}</span>
              <span className="text-xs text-[#e0dcc5]/60 font-mono">({userProfile.stats.currentElo} Elo)</span>
            </div>

            {/* Level XP Progress Bar */}
            <div className="w-44 sm:w-56 mt-2">
              <div className="flex justify-between text-[10px] text-[#e0dcc5]/80 mb-0.5">
                <span>XP {userProfile.xp} / {userProfile.xpToNextLevel}</span>
                <span className="text-[#d4af37]">Season T5</span>
              </div>
              <div className="w-full h-1.5 bg-[#0a120a] rounded-full overflow-hidden border border-[#d4af37]/25">
                <div
                  className="h-full bg-gradient-to-r from-[#e8c858] to-[#d4af37] rounded-full"
                  style={{ width: `${(userProfile.xp / userProfile.xpToNextLevel) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Stats & Season Pass Banner */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 md:border-l border-[#d4af37]/25 pt-4 md:pt-0 md:pl-6">
          <div className="text-center">
            <span className="text-xs text-[#e0dcc5]/70 font-semibold block">WINS</span>
            <span className="text-lg font-extrabold text-[#e0dcc5]">{userProfile.stats.wins}</span>
          </div>
          <div className="text-center px-3 border-x border-[#d4af37]/25">
            <span className="text-xs text-[#e0dcc5]/70 font-semibold block">WIN RATE</span>
            <span className="text-lg font-extrabold text-[#d4af37]">{userProfile.stats.winRate}%</span>
          </div>
          <div className="text-center">
            <span className="text-xs text-[#e0dcc5]/70 font-semibold block">CAPTURES</span>
            <span className="text-lg font-extrabold text-red-400">{userProfile.stats.captures}</span>
          </div>
        </div>
      </div>

      {/* 2. MATCHMAKING OVERLAY (If in queue) */}
      {isMatchmaking && (
        <div className="bg-gradient-to-r from-[#172617] via-[#101b10] to-[#172617] border-2 border-[#d4af37] rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center gap-3 animate-pulse">
          <div className="w-12 h-12 rounded-full border-4 border-[#d4af37] border-t-transparent animate-spin flex items-center justify-center text-xl">
            🦁
          </div>
          <h3 className="text-lg font-bold text-[#e0dcc5] font-serif">
            Searching for Savannah Challengers...
          </h3>
          <p className="text-xs text-[#e0dcc5]/80">
            Matching with players near {userProfile.stats.currentElo} Elo • Queue Time: {matchmakingSeconds}s
          </p>
          <button
            onClick={cancelMatchmakingQueue}
            className="px-6 py-2 rounded-xl bg-[#132013] border border-[#d4af37]/30 text-[#e0dcc5] text-xs font-bold hover:bg-[#1c2c1c] cursor-pointer mt-2"
          >
            Cancel Matchmaking
          </button>
        </div>
      )}

      {/* 3. GAME MODE SELECTOR GRID */}
      {!isMatchmaking && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Mode 1: Quick Match / Ranked */}
          <div
            onClick={() => setSelectedMode('online_ranked')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              selectedMode === 'online_ranked'
                ? 'bg-[#182818] border-[#d4af37] ring-2 ring-[#d4af37]/40 shadow-xl shadow-[#d4af37]/20'
                : 'bg-[#121f12]/85 border-[#d4af37]/20 hover:bg-[#182818]/90'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-2xl">
                ⚔️
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
                RANKED
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#e0dcc5] font-serif">Quick Match</h3>
              <p className="text-xs text-[#e0dcc5]/70 mt-0.5">
                Real-time skill matchmaking with Elo rating rewards.
              </p>
            </div>
          </div>

          {/* Mode 2: Solo vs AI */}
          <div
            onClick={() => setSelectedMode('vs_ai')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              selectedMode === 'vs_ai'
                ? 'bg-[#182818] border-[#d4af37] ring-2 ring-[#d4af37]/40 shadow-xl shadow-[#d4af37]/20'
                : 'bg-[#121f12]/85 border-[#d4af37]/20 hover:bg-[#182818]/90'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-2xl">
                🤖
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                PRACTICE
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#e0dcc5] font-serif">Solo vs AI</h3>
              <p className="text-xs text-[#e0dcc5]/70 mt-0.5">
                Practice against 4 difficulty levels with offline support.
              </p>
            </div>
          </div>

          {/* Mode 3: Pass & Play */}
          <div
            onClick={() => setSelectedMode('pass_and_play')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              selectedMode === 'pass_and_play'
                ? 'bg-[#182818] border-[#d4af37] ring-2 ring-[#d4af37]/40 shadow-xl shadow-[#d4af37]/20'
                : 'bg-[#121f12]/85 border-[#d4af37]/20 hover:bg-[#182818]/90'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-2xl">
                👥
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-300 border border-blue-400/40">
                LOCAL
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#e0dcc5] font-serif">Pass & Play</h3>
              <p className="text-xs text-[#e0dcc5]/70 mt-0.5">
                Play locally with 2-4 friends taking turns on one device.
              </p>
            </div>
          </div>

          {/* Mode 4: Private Room */}
          <div
            onClick={() => setSelectedMode('private_room')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              selectedMode === 'private_room'
                ? 'bg-[#182818] border-[#d4af37] ring-2 ring-[#d4af37]/40 shadow-xl shadow-[#d4af37]/20'
                : 'bg-[#121f12]/85 border-[#d4af37]/20 hover:bg-[#182818]/90'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-400/30 flex items-center justify-center text-2xl">
                🔑
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-400/20 text-purple-300 border border-purple-400/40">
                CUSTOM
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#e0dcc5] font-serif">Private Room</h3>
              <p className="text-xs text-[#e0dcc5]/70 mt-0.5">
                Create or join a private room with a 6-digit room code.
              </p>
            </div>
          </div>

          {/* Mode 5: Tournament */}
          <div
            onClick={() => setSelectedMode('tournament')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              selectedMode === 'tournament'
                ? 'bg-[#182818] border-[#d4af37] ring-2 ring-[#d4af37]/40 shadow-xl shadow-[#d4af37]/20'
                : 'bg-[#121f12]/85 border-[#d4af37]/20 hover:bg-[#182818]/90'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-2xl">
                🏆
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
                BRACKET
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#e0dcc5] font-serif">Tournament Cup</h3>
              <p className="text-xs text-[#e0dcc5]/70 mt-0.5">
                Compete in 8-player Savannah championship brackets.
              </p>
            </div>
          </div>

          {/* Mode 6: Team Mode 2v2 */}
          <div
            onClick={() => setSelectedMode('team_2v2')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              selectedMode === 'team_2v2'
                ? 'bg-[#182818] border-[#d4af37] ring-2 ring-[#d4af37]/40 shadow-xl shadow-[#d4af37]/20'
                : 'bg-[#121f12]/85 border-[#d4af37]/20 hover:bg-[#182818]/90'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-400/30 flex items-center justify-center text-2xl">
                🛡️
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-400/20 text-rose-300 border border-rose-400/40">
                2 vs 2
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#e0dcc5] font-serif">2v2 Co-Op Team</h3>
              <p className="text-xs text-[#e0dcc5]/70 mt-0.5">
                Coordinate with a teammate without capturing friendly pieces.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. MATCH CUSTOMIZATION CONTROLS */}
      {!isMatchmaking && (
        <div className="bg-[#121f12]/90 border border-[#d4af37]/25 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
            <h4 className="text-sm font-extrabold text-[#e0dcc5] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>Match Settings & Modifiers</span>
            </h4>
            <span className="text-xs text-[#d4af37]/80">Customizable</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Player Count */}
            <div>
              <label className="text-xs font-bold text-[#d4af37] block mb-2">Players</label>
              <div className="flex items-center gap-2 bg-[#0a120a] p-1 rounded-xl border border-[#d4af37]/20">
                {([2, 3, 4] as const).map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setPlayerCount(cnt)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      playerCount === cnt
                        ? 'bg-[#d4af37] text-[#0d1a0d] shadow-md'
                        : 'text-[#e0dcc5]/70 hover:bg-[#162516]'
                    }`}
                  >
                    {cnt}P
                  </button>
                ))}
              </div>
            </div>

            {/* AI Difficulty (if vs_ai) */}
            {selectedMode === 'vs_ai' && (
              <div>
                <label className="text-xs font-bold text-[#d4af37] block mb-2">AI Difficulty</label>
                <div className="flex items-center gap-1 bg-[#0a120a] p-1 rounded-xl border border-[#d4af37]/20">
                  {(['easy', 'medium', 'hard', 'expert'] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setAiDifficulty(diff)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer ${
                        aiDifficulty === diff
                          ? 'bg-emerald-500 text-stone-950 shadow-md'
                          : 'text-[#e0dcc5]/70 hover:bg-[#162516]'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Player Color Selection */}
            <div>
              <label className="text-xs font-bold text-[#d4af37] block mb-2">Your Clan</label>
              <div className="flex items-center gap-2 bg-[#0a120a] p-1 rounded-xl border border-[#d4af37]/20">
                {[
                  { col: 'red' as PlayerColor, icon: '🦁', bg: 'bg-red-600' },
                  { col: 'green' as PlayerColor, icon: '🐘', bg: 'bg-emerald-600' },
                  { col: 'yellow' as PlayerColor, icon: '🐆', bg: 'bg-[#d4af37]' },
                  { col: 'blue' as PlayerColor, icon: '🦓', bg: 'bg-blue-600' },
                ].map((c) => (
                  <button
                    key={c.col}
                    onClick={() => setHumanColor(c.col)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                      humanColor === c.col ? `${c.bg} text-white shadow-md ring-2 ring-[#d4af37]` : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span>{c.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Magic Abilities Toggle */}
            <div>
              <label className="text-xs font-bold text-[#d4af37] block mb-2">Magical Layer</label>
              <button
                onClick={() => setIsMagicEnabled(!isMagicEnabled)}
                className={`w-full py-1.5 px-3 rounded-xl border flex items-center justify-between text-xs font-bold transition cursor-pointer ${
                  isMagicEnabled
                    ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37] shadow-inner'
                    : 'bg-[#0a120a] border-stone-800 text-stone-500'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{isMagicEnabled ? 'Magic ON' : 'Classic Only'}</span>
                </div>
                <span className="text-[10px]">{isMagicEnabled ? 'Active' : 'Off'}</span>
              </button>
            </div>
          </div>

          {/* Private Room Code Input if in private room mode */}
          {selectedMode === 'private_room' && (
            <div className="p-3 bg-[#0a120a] rounded-2xl border border-purple-500/40 flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Enter 6-digit room code (e.g. SAV-482)"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                className="flex-1 bg-[#132013] border border-stone-700 rounded-xl px-4 py-2 text-xs font-mono text-[#e0dcc5] placeholder-stone-500 focus:outline-none focus:border-[#d4af37]"
              />
              <button
                onClick={handleStartGame}
                className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 shadow-md shadow-purple-600/40 cursor-pointer"
              >
                Join Room
              </button>
            </div>
          )}

          {/* LAUNCH GAME BUTTON */}
          <button
            id="btn-start-game"
            onClick={handleStartGame}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#e8c858] via-[#d4af37] to-[#aa8218] text-[#0d1a0d] font-sans font-extrabold text-base tracking-widest uppercase shadow-xl shadow-[#d4af37]/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-[#0d1a0d]" />
            <span>
              {selectedMode === 'online_ranked'
                ? 'ENTER RANKED MATCHMAKING'
                : selectedMode === 'tournament'
                ? 'OPEN TOURNAMENT BRACKET'
                : 'START SAVANNAH MATCH'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
