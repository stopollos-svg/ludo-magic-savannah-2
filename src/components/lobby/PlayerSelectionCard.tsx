/**
 * Ludo Magic Savannah - Player Count & Competing Yards Selection
 * Allows selecting at least 2 active yards (2, 3, or 4 players) to compete against each other.
 * Players can choose their animal guardians, and only the pawns of active yards appear on the board.
 */

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import {
  PlayerColor,
  BeastType,
  AIDifficulty,
  PlayerInfo,
  GameMode,
} from '../../types/game';
import { createPlayer } from '../../utils/ludoEngine';
import {
  Bot,
  Sparkles,
  Play,
  Dice5,
  Zap,
  UserCheck,
  Cpu,
  Swords,
  ShieldAlert,
} from 'lucide-react';

interface PlayerSlotConfig {
  id: string;
  name: string;
  color: PlayerColor;
  beast: BeastType;
  isAI: boolean;
  aiDifficulty: AIDifficulty;
}

const CLAN_BEASTS: Array<{ type: BeastType; name: string; avatar: string; color: PlayerColor; yardName: string }> = [
  { type: 'lion', name: 'Lion Pride', avatar: '🦁', color: 'red', yardName: 'Red Yard' },
  { type: 'elephant', name: 'Elephant Tribe', avatar: '🐘', color: 'green', yardName: 'Green Yard' },
  { type: 'giraffe', name: 'Giraffe Valley', avatar: '🦒', color: 'yellow', yardName: 'Yellow Yard' },
  { type: 'zebra', name: 'Zebra Herd', avatar: '🦓', color: 'blue', yardName: 'Blue Yard' },
];

const RANDOM_TRIBAL_NAMES = [
  'Simba The Bold',
  'Tembo Great Tusk',
  'Twiga Skywatcher',
  'Mosi The Swift',
  'Kesi Wildrunner',
  'Zuri Sunstalker',
  'Bantu Earthshaker',
  'Kovu Nightclaw',
];

export const PlayerSelectionCard: React.FC = () => {
  const { userProfile, startNewGame } = useGameStore();

  // 1. Player Count: At least 2 active yards (2, 3, or 4) to compete against each other
  const [playerCount, setPlayerCount] = useState<2 | 3 | 4>(2);

  // 2. Play Style: 'ai_only' | 'pass_and_play' | 'custom'
  const [playStyle, setPlayStyle] = useState<'ai_only' | 'pass_and_play' | 'custom'>('ai_only');

  // Global AI difficulty when in 'ai_only' mode
  const [globalAIDifficulty, setGlobalAIDifficulty] = useState<AIDifficulty>('medium');

  // Modifiers
  const [isMagicEnabled, setIsMagicEnabled] = useState(true);
  const [fastMode, setFastMode] = useState(false);

  // 4 Slot Detailed Configurations
  const [slots, setSlots] = useState<PlayerSlotConfig[]>([
    {
      id: 'slot_1',
      name: userProfile.username || 'Savannah Warrior',
      color: 'red',
      beast: 'lion',
      isAI: false,
      aiDifficulty: 'medium',
    },
    {
      id: 'slot_2',
      name: 'Tembo Great Tusk',
      color: 'green',
      beast: 'elephant',
      isAI: true,
      aiDifficulty: 'medium',
    },
    {
      id: 'slot_3',
      name: 'Twiga Skywatcher',
      color: 'yellow',
      beast: 'giraffe',
      isAI: true,
      aiDifficulty: 'hard',
    },
    {
      id: 'slot_4',
      name: 'Mosi The Swift',
      color: 'blue',
      beast: 'zebra',
      isAI: true,
      aiDifficulty: 'expert',
    },
  ]);

  // Adjust active slots based on player count and style
  const getActiveSlots = (): PlayerSlotConfig[] => {
    const active = slots.slice(0, playerCount);

    // Apply playStyle overrides
    return active.map((slot, idx) => {
      if (playStyle === 'ai_only') {
        return {
          ...slot,
          isAI: idx !== 0, // Seat 1 is human, remaining seats are AI bots
          aiDifficulty: globalAIDifficulty,
        };
      }
      if (playStyle === 'pass_and_play') {
        return {
          ...slot,
          isAI: false, // All active seats are human
        };
      }
      return slot; // Custom mode keeps individual settings
    });
  };

  const handleUpdateSlot = (index: number, updates: Partial<PlayerSlotConfig>) => {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  // Dedicated handler to select an animal for a specific yard/seat
  const handleSelectAnimalForSlot = (slotIndex: number, beastType: BeastType) => {
    const chosenBeast = CLAN_BEASTS.find((b) => b.type === beastType);
    if (!chosenBeast) return;

    setSlots((prev) => {
      const next = [...prev];
      // Check if another active seat already has this animal
      const conflictIndex = next.findIndex((s, idx) => idx !== slotIndex && s.beast === beastType);

      if (conflictIndex !== -1) {
        // Swap animals and yard colors so every active yard remains distinct
        const currentSlotBeast = next[slotIndex].beast;
        const currentSlotColor = next[slotIndex].color;
        next[conflictIndex] = {
          ...next[conflictIndex],
          beast: currentSlotBeast,
          color: currentSlotColor,
        };
      }

      next[slotIndex] = {
        ...next[slotIndex],
        beast: chosenBeast.type,
        color: chosenBeast.color,
      };

      return next;
    });
  };

  const handleRandomizeName = (index: number) => {
    const randomName = RANDOM_TRIBAL_NAMES[Math.floor(Math.random() * RANDOM_TRIBAL_NAMES.length)];
    handleUpdateSlot(index, { name: randomName });
  };

  const handleStartGame = () => {
    const activeSlotConfigs = getActiveSlots();

    // Convert slot configs into actual PlayerInfo[]
    // Only active players are created; inactive yards have no pawns
    const builtPlayers: PlayerInfo[] = activeSlotConfigs.map((slot, idx) => {
      return createPlayer(
        slot.isAI ? `ai_${slot.color}_${idx + 1}` : `human_${slot.color}_${idx + 1}`,
        slot.name,
        slot.color,
        slot.beast,
        slot.isAI,
        slot.aiDifficulty
      );
    });

    const gameMode: GameMode = playStyle === 'pass_and_play' ? 'pass_and_play' : 'vs_ai';

    startNewGame(
      {
        mode: gameMode,
        playerCount,
        isMagicEnabled,
        turnTimeoutSeconds: 20,
        fastMode,
        ambiance: 'sunset',
        boardTheme: 'savannah_gold',
        diceSkin: 'sunstone',
      },
      activeSlotConfigs[0].color,
      undefined,
      builtPlayers
    );
  };

  const activeSlots = getActiveSlots();
  const humanCount = activeSlots.filter((s) => !s.isAI).length;
  const aiCount = activeSlots.filter((s) => s.isAI).length;

  return (
    <div className="w-full bg-[#121f12]/95 border-2 border-[#d4af37]/40 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col gap-6 text-[#e0dcc5]">
      {/* 1. TOP HEADER & PLAYER COUNT SELECTION (AT LEAST 2 ACTIVE YARDS) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#d4af37]/25 pb-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#d4af37] uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Active Yards Configuration
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#e0dcc5] font-serif">
            Select Competing Animals & Yards
          </h2>
        </div>

        {/* 2P (1v1) / 3P / 4P Selector Buttons: minimum 2 yards to compete */}
        <div className="flex items-center gap-1.5 bg-[#081008] p-1 rounded-2xl border border-[#d4af37]/30 self-stretch sm:self-auto">
          {[
            { count: 2 as const, label: '2 Players', sub: '1v1 Duel' },
            { count: 3 as const, label: '3 Players', sub: '3 Clans' },
            { count: 4 as const, label: '4 Players', sub: 'Full Board' },
          ].map((item) => (
            <button
              key={item.count}
              onClick={() => setPlayerCount(item.count)}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                playerCount === item.count
                  ? 'bg-gradient-to-r from-[#e8c858] via-[#d4af37] to-[#aa8218] text-[#0d1a0d] shadow-lg shadow-[#d4af37]/30 scale-[1.02]'
                  : 'text-[#e0dcc5]/70 hover:bg-[#152315] hover:text-[#e0dcc5]'
              }`}
            >
              <span className="text-xs sm:text-sm">{item.label}</span>
              <span className="text-[9px] opacity-80 uppercase tracking-tighter sm:tracking-normal">
                {item.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* COMPETING YARDS EXPLANATION BANNER */}
      <div className="p-3.5 rounded-2xl bg-[#081008] border border-[#d4af37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-lg">
            <Swords className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div>
            <h4 className="text-xs font-black text-[#d4af37] uppercase tracking-wider">
              {playerCount} Active Competing Yards Selected
            </h4>
            <p className="text-[11px] text-[#e0dcc5]/80">
              Select an animal for each yard. <strong className="text-[#f5df88]">Only the pawns of these {playerCount} chosen animals appear on the Ludo board</strong>. Unselected yards remain resting sanctuaries with no pawns.
            </p>
          </div>
        </div>

        {/* Live Matchup Pill */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto bg-[#121f12] px-3 py-1.5 rounded-xl border border-[#d4af37]/40 text-xs font-bold text-[#f5df88]">
          {activeSlots.map((s, idx) => {
            const b = CLAN_BEASTS.find((cb) => cb.type === s.beast);
            return (
              <span key={s.id} className="flex items-center gap-1">
                <span>{b?.avatar}</span>
                <span className="text-[11px] hidden md:inline">{b?.name.split(' ')[0]}</span>
                {idx < activeSlots.length - 1 && (
                  <span className="text-stone-500 font-normal px-0.5 text-[10px]">vs</span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* 2. PLAY MODE SELECTOR: "PLAY WITH AI ONLY" VS "PASS & PLAY" VS "CUSTOM ROSTER" */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Option A: Play with AI Only */}
        <div
          onClick={() => setPlayStyle('ai_only')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
            playStyle === 'ai_only'
              ? 'bg-gradient-to-br from-[#1b2b1b] via-[#152415] to-[#121e12] border-[#d4af37] shadow-xl shadow-[#d4af37]/20 ring-1 ring-[#d4af37]'
              : 'bg-[#0a120a]/80 border-[#d4af37]/20 hover:bg-[#132013]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl shadow-inner">
              🤖
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              SOLO VS AI
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#e0dcc5] font-serif">Play with AI Only</h3>
            <p className="text-xs text-[#e0dcc5]/70 mt-1">
              You control Yard 1 against {playerCount - 1} smart savannah bots.
            </p>
          </div>
        </div>

        {/* Option B: Pass & Play (Local Multiplayer) */}
        <div
          onClick={() => setPlayStyle('pass_and_play')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
            playStyle === 'pass_and_play'
              ? 'bg-gradient-to-br from-[#1b2b1b] via-[#152415] to-[#121e12] border-[#d4af37] shadow-xl shadow-[#d4af37]/20 ring-1 ring-[#d4af37]'
              : 'bg-[#0a120a]/80 border-[#d4af37]/20 hover:bg-[#132013]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-2xl shadow-inner">
              👥
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
              LOCAL MULTIPLAYER
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#e0dcc5] font-serif">Pass & Play</h3>
            <p className="text-xs text-[#e0dcc5]/70 mt-1">
              All {playerCount} players are humans taking turns on this screen.
            </p>
          </div>
        </div>

        {/* Option C: Custom Roster */}
        <div
          onClick={() => setPlayStyle('custom')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
            playStyle === 'custom'
              ? 'bg-gradient-to-br from-[#1b2b1b] via-[#152415] to-[#121e12] border-[#d4af37] shadow-xl shadow-[#d4af37]/20 ring-1 ring-[#d4af37]'
              : 'bg-[#0a120a]/80 border-[#d4af37]/20 hover:bg-[#132013]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-2xl shadow-inner">
              ⚙️
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
              MIX & MATCH
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#e0dcc5] font-serif">Custom Roster</h3>
            <p className="text-xs text-[#e0dcc5]/70 mt-1">
              Manually set each seat to Human 👤 or AI 🤖 with custom names.
            </p>
          </div>
        </div>
      </div>

      {/* 3. AI ONLY QUICK DIFFICULTY BAR (Visible if AI Only) */}
      {playStyle === 'ai_only' && (
        <div className="p-3 bg-[#0a140a] rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-[#e0dcc5]">Savannah AI Difficulty:</span>
          </div>
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {(['easy', 'medium', 'hard', 'expert'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setGlobalAIDifficulty(diff)}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                  globalAIDifficulty === diff
                    ? 'bg-emerald-500 text-stone-950 shadow-md font-extrabold'
                    : 'bg-[#122212] text-[#e0dcc5]/70 hover:bg-[#183018]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. ACTIVE YARDS & ANIMAL SELECTION FOR EACH SEAT */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">
            Active Yards ({activeSlots.length} Competing: {humanCount} Human, {aiCount} AI)
          </span>
          <span className="text-[11px] text-[#e0dcc5]/60">
            Click any animal below to assign it to that yard
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activeSlots.map((slot, index) => {
            const colorTheme: Record<PlayerColor, { border: string; bg: string; badge: string; text: string }> = {
              red: {
                border: 'border-red-500/50',
                bg: 'bg-red-950/25',
                badge: 'bg-red-900/40 text-red-300 border-red-500/40',
                text: 'text-red-400',
              },
              green: {
                border: 'border-emerald-500/50',
                bg: 'bg-emerald-950/25',
                badge: 'bg-emerald-900/40 text-emerald-300 border-emerald-500/40',
                text: 'text-emerald-400',
              },
              yellow: {
                border: 'border-[#d4af37]/50',
                bg: 'bg-yellow-950/25',
                badge: 'bg-[#d4af37]/20 text-[#f5df88] border-[#d4af37]/40',
                text: 'text-[#d4af37]',
              },
              blue: {
                border: 'border-blue-500/50',
                bg: 'bg-blue-950/25',
                badge: 'bg-blue-900/40 text-blue-300 border-blue-500/40',
                text: 'text-blue-400',
              },
            };

            const theme = colorTheme[slot.color];
            const beastInfo = CLAN_BEASTS.find((b) => b.type === slot.beast) || CLAN_BEASTS[0];

            return (
              <div
                key={slot.id}
                className={`p-4 rounded-2xl border ${theme.border} ${theme.bg} flex flex-col gap-3 transition relative overflow-hidden shadow-lg`}
              >
                {/* Top Row: Yard Title, Clan Name & Type Toggle */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl filter drop-shadow">{beastInfo.avatar}</span>
                    <div>
                      <div className="text-sm font-extrabold text-[#e0dcc5] font-serif flex items-center gap-1.5">
                        <span>Yard {index + 1}:</span>
                        <span className={theme.text}>{beastInfo.name}</span>
                      </div>
                      <span className="text-[10px] text-[#d4af37] uppercase font-mono tracking-wider">
                        {beastInfo.yardName} • 4 PAWNS ACTIVE
                      </span>
                    </div>
                  </div>

                  {/* Toggle Human vs AI */}
                  {playStyle === 'custom' ? (
                    <button
                      onClick={() => handleUpdateSlot(index, { isAI: !slot.isAI })}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                        slot.isAI
                          ? 'bg-purple-900/60 border-purple-500/60 text-purple-200'
                          : 'bg-emerald-900/60 border-emerald-500/60 text-emerald-200'
                      }`}
                    >
                      {slot.isAI ? <Cpu className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                      <span>{slot.isAI ? 'AI Bot' : 'Human'}</span>
                    </button>
                  ) : (
                    <div
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                        slot.isAI
                          ? 'bg-purple-900/40 border-purple-500/40 text-purple-300'
                          : 'bg-emerald-900/40 border-emerald-500/40 text-emerald-300'
                      }`}
                    >
                      {slot.isAI ? '🤖 AI Bot' : '👤 Human'}
                    </div>
                  )}
                </div>

                {/* Animal Selection Row for this Yard */}
                <div>
                  <label className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider block mb-1.5">
                    Select Animal Guardian for Yard {index + 1}:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {CLAN_BEASTS.map((cb) => {
                      const isSelected = slot.beast === cb.type;
                      return (
                        <button
                          key={cb.type}
                          type="button"
                          onClick={() => handleSelectAnimalForSlot(index, cb.type)}
                          className={`py-1.5 px-1 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-0.5 border transition cursor-pointer ${
                            isSelected
                              ? 'bg-[#d4af37] text-[#0d1a0d] border-[#d4af37] shadow-md shadow-[#d4af37]/30 scale-[1.02] font-black'
                              : 'bg-[#081008]/80 text-[#e0dcc5]/70 border-stone-800 hover:border-[#d4af37]/40 hover:text-[#e0dcc5]'
                          }`}
                        >
                          <span className="text-base">{cb.avatar}</span>
                          <span className="text-[10px] leading-tight truncate w-full text-center">
                            {cb.name.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name Input & Randomizer */}
                <div className="flex items-center gap-1.5 bg-[#081008] p-1.5 rounded-xl border border-[#d4af37]/20">
                  <input
                    type="text"
                    value={slot.name}
                    onChange={(e) => handleUpdateSlot(index, { name: e.target.value })}
                    className="flex-1 bg-transparent px-2 text-xs font-bold text-[#e0dcc5] focus:outline-none"
                    placeholder={`Player ${index + 1} Name`}
                  />
                  <button
                    onClick={() => handleRandomizeName(index)}
                    className="p-1 text-[#d4af37] hover:text-[#f5df88] transition cursor-pointer"
                    title="Randomize Tribal Name"
                  >
                    <Dice5 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. MATCH MODIFIERS TOGGLE */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#0a120a] rounded-2xl border border-[#d4af37]/20 text-xs">
        <button
          onClick={() => setIsMagicEnabled(!isMagicEnabled)}
          className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-between font-bold transition cursor-pointer ${
            isMagicEnabled
              ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
              : 'bg-[#121c12] border-stone-800 text-stone-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Magical Beast Abilities</span>
          </div>
          <span className="text-[10px]">{isMagicEnabled ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={() => setFastMode(!fastMode)}
          className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-between font-bold transition cursor-pointer ${
            fastMode
              ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
              : 'bg-[#121c12] border-stone-800 text-stone-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Fast Yard Exit (1 or 6)</span>
          </div>
          <span className="text-[10px]">{fastMode ? 'ACTIVE' : 'CLASSIC (6 ONLY)'}</span>
        </button>
      </div>

      {/* 6. LAUNCH GAME BUTTON */}
      <button
        id="btn-launch-savannah-match"
        onClick={handleStartGame}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#e8c858] via-[#d4af37] to-[#aa8218] text-[#0d1a0d] font-sans font-black text-base sm:text-lg tracking-widest uppercase shadow-xl shadow-[#d4af37]/35 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
      >
        <Play className="w-5 h-5 fill-[#0d1a0d]" />
        <span>
          {playerCount === 2
            ? `START 1V1 DUEL • ${activeSlots[0]?.beast.toUpperCase()} VS ${activeSlots[1]?.beast.toUpperCase()} (2 ACTIVE YARDS)`
            : `START ${playerCount}-CLAN BATTLE • ${playerCount} ACTIVE YARDS COMPETING`}
        </span>
      </button>
    </div>
  );
};
