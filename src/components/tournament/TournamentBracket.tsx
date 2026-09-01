/**
 * Ludo Magic Savannah - 8-Player Tournament Champions Bracket
 */

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Trophy, Swords, ArrowLeft, Play, Crown, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BracketNode {
  id: string;
  round: 'quarter' | 'semi' | 'final';
  p1: { name: string; avatar: string; score: number };
  p2: { name: string; avatar: string; score: number };
  winner?: string;
}

export const TournamentBracket: React.FC = () => {
  const { userProfile, startNewGame, setView } = useGameStore();

  const [matches, setMatches] = useState<BracketNode[]>([
    // Quarter Finals
    { id: 'q1', round: 'quarter', p1: { name: userProfile.username, avatar: '🦁', score: 0 }, p2: { name: 'Kibo Tusker', avatar: '🐘', score: 0 }, winner: userProfile.username },
    { id: 'q2', round: 'quarter', p1: { name: 'Zuri Pride', avatar: '🐆', score: 0 }, p2: { name: 'Rafiki Ghost', avatar: '🦒', score: 0 }, winner: 'Zuri Pride' },
    { id: 'q3', round: 'quarter', p1: { name: 'Mufasa Apex', avatar: '🦁', score: 0 }, p2: { name: 'Titan Rhino', avatar: '🦏', score: 0 }, winner: 'Mufasa Apex' },
    { id: 'q4', round: 'quarter', p1: { name: 'Simba Storm', avatar: '🦓', score: 0 }, p2: { name: 'Croc Hunter', avatar: '🐊', score: 0 }, winner: 'Simba Storm' },
    // Semi Finals
    { id: 's1', round: 'semi', p1: { name: userProfile.username, avatar: '🦁', score: 0 }, p2: { name: 'Zuri Pride', avatar: '🐆', score: 0 }, winner: userProfile.username },
    { id: 's2', round: 'semi', p1: { name: 'Mufasa Apex', avatar: '🦁', score: 0 }, p2: { name: 'Simba Storm', avatar: '🦓', score: 0 }, winner: 'Mufasa Apex' },
    // Grand Final
    { id: 'f1', round: 'final', p1: { name: userProfile.username, avatar: '🦁', score: 0 }, p2: { name: 'Mufasa Apex', avatar: '🦁', score: 0 } },
  ]);

  const [tournamentFinished, setTournamentFinished] = useState(false);

  const handlePlayFinal = () => {
    startNewGame({
      mode: 'tournament',
      playerCount: 2,
      isMagicEnabled: true,
      turnTimeoutSeconds: 15,
      fastMode: false,
      ambiance: 'sunset',
      boardTheme: 'savannah_gold',
      diceSkin: 'sunstone',
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#172617] via-[#101b10] to-[#1d160b] border-2 border-[#d4af37]/60 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('lobby')}
              className="p-1.5 rounded-lg bg-[#0a120a] text-[#e0dcc5] border border-[#d4af37]/30 hover:bg-[#182818] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#d4af37]" />
            </button>
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              <span>Savannah Champions Cup</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#e0dcc5] font-serif mt-1">
            Championship Bracket (8 Contenders)
          </h2>
          <p className="text-xs text-[#e0dcc5]/80 mt-0.5">
            Single elimination cup. 1st Place reward: 1,500 🪙 + 150 💎 + Golden Baobab Trophy.
          </p>
        </div>

        <button
          onClick={handlePlayFinal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#e8c858] via-[#d4af37] to-[#aa8218] text-[#0d1a0d] text-xs font-extrabold shadow-xl shadow-[#d4af37]/30 hover:brightness-110 flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <Play className="w-4 h-4 fill-[#0d1a0d]" />
          <span>PLAY GRAND FINAL MATCH</span>
        </button>
      </div>

      {/* Bracket Tree Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Round 1: Quarter Finals */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block text-center">
            Quarter-Finals
          </span>
          {matches.slice(0, 4).map((m) => (
            <div
              key={m.id}
              className="p-3 bg-[#121f12]/90 border border-[#d4af37]/25 rounded-2xl space-y-1.5 shadow-md"
            >
              <div className={`flex items-center justify-between text-xs p-1.5 rounded-lg ${m.winner === m.p1.name ? 'bg-[#182818] text-[#f5df88] border border-[#d4af37]/40 font-bold' : 'text-stone-400'}`}>
                <div className="flex items-center gap-1.5">
                  <span>{m.p1.avatar}</span>
                  <span className="truncate max-w-[120px] text-[#e0dcc5]">{m.p1.name}</span>
                </div>
                {m.winner === m.p1.name && <Crown className="w-3 h-3 text-[#d4af37]" />}
              </div>
              <div className={`flex items-center justify-between text-xs p-1.5 rounded-lg ${m.winner === m.p2.name ? 'bg-[#182818] text-[#f5df88] border border-[#d4af37]/40 font-bold' : 'text-stone-400'}`}>
                <div className="flex items-center gap-1.5">
                  <span>{m.p2.avatar}</span>
                  <span className="truncate max-w-[120px] text-[#e0dcc5]">{m.p2.name}</span>
                </div>
                {m.winner === m.p2.name && <Crown className="w-3 h-3 text-[#d4af37]" />}
              </div>
            </div>
          ))}
        </div>

        {/* Round 2: Semi Finals */}
        <div className="space-y-6">
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block text-center">
            Semi-Finals
          </span>
          {matches.slice(4, 6).map((m) => (
            <div
              key={m.id}
              className="p-4 bg-[#121f12] border border-[#d4af37]/40 rounded-2xl space-y-2 shadow-lg"
            >
              <div className={`flex items-center justify-between text-xs p-2 rounded-lg ${m.winner === m.p1.name ? 'bg-[#182818] text-[#f5df88] border border-[#d4af37]/40 font-bold' : 'text-stone-400'}`}>
                <div className="flex items-center gap-1.5">
                  <span>{m.p1.avatar}</span>
                  <span className="truncate max-w-[120px] text-[#e0dcc5]">{m.p1.name}</span>
                </div>
                {m.winner === m.p1.name && <Crown className="w-3.5 h-3.5 text-[#d4af37]" />}
              </div>
              <div className={`flex items-center justify-between text-xs p-2 rounded-lg ${m.winner === m.p2.name ? 'bg-[#182818] text-[#f5df88] border border-[#d4af37]/40 font-bold' : 'text-stone-400'}`}>
                <div className="flex items-center gap-1.5">
                  <span>{m.p2.avatar}</span>
                  <span className="truncate max-w-[120px] text-[#e0dcc5]">{m.p2.name}</span>
                </div>
                {m.winner === m.p2.name && <Crown className="w-3.5 h-3.5 text-[#d4af37]" />}
              </div>
            </div>
          ))}
        </div>

        {/* Round 3: Grand Final */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block text-center flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Grand Final</span>
          </span>
          <div className="p-5 bg-gradient-to-b from-[#182818] to-[#0d1a0d] border-2 border-[#d4af37] rounded-3xl space-y-3 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/60 flex items-center justify-center text-2xl shadow-inner">
              🏆
            </div>

            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#182818] border border-[#d4af37] text-xs font-bold text-[#f5df88]">
                <div className="flex items-center gap-2">
                  <span>{matches[6].p1.avatar}</span>
                  <span>{matches[6].p1.name}</span>
                </div>
                <span className="text-[10px] bg-[#d4af37] text-[#0d1a0d] px-1.5 py-0.2 rounded font-extrabold">
                  YOU
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[#0a120a] border border-stone-800 text-xs text-[#e0dcc5]">
                <div className="flex items-center gap-2">
                  <span>{matches[6].p2.avatar}</span>
                  <span>{matches[6].p2.name}</span>
                </div>
                <span className="text-[10px] text-[#d4af37] font-bold">2,100 Elo</span>
              </div>
            </div>

            <button
              onClick={handlePlayFinal}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#e8c858] via-[#d4af37] to-[#aa8218] text-[#0d1a0d] text-xs font-extrabold hover:brightness-110 shadow-lg shadow-[#d4af37]/30 cursor-pointer"
            >
              Start Championship Match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
