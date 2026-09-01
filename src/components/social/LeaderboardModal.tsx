/**
 * Ludo Magic Savannah - Global & Seasonal Leaderboards
 */

import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Trophy, Award, Flame, Users, Sparkles } from 'lucide-react';

export const LeaderboardModal: React.FC = () => {
  const { leaderboards, userProfile } = useGameStore();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#172617] via-[#101b10] to-[#1d160b] border-2 border-[#d4af37]/40 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest flex items-center gap-1.5">
            <Trophy className="w-4 h-4" />
            <span>Season 1: Pride of the Plains</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#e0dcc5] font-serif mt-1">
            Global Ranked Leaderboard
          </h2>
          <p className="text-xs text-[#e0dcc5]/80 mt-0.5">
            Top champions competing for the Grandmaster Lion crown and seasonal glory.
          </p>
        </div>

        {/* User Rank Card */}
        <div className="bg-[#0a120a] p-3 rounded-2xl border border-[#d4af37]/40 flex items-center gap-3">
          <div className="text-2xl">{userProfile.avatar}</div>
          <div>
            <span className="text-[10px] text-[#d4af37]/80 block uppercase font-bold">Your Standing</span>
            <span className="text-sm font-bold text-[#f5df88]">#5 • {userProfile.stats.currentElo} Elo</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#121f12]/90 border border-[#d4af37]/30 rounded-3xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-12 p-3.5 bg-[#0a120a] border-b border-[#d4af37]/25 text-[11px] font-bold text-[#d4af37] uppercase tracking-wider">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-5">Player & Clan</div>
          <div className="col-span-2 text-center">Guardian</div>
          <div className="col-span-2 text-center">Win Rate</div>
          <div className="col-span-2 text-right pr-2">Elo Rating</div>
        </div>

        <div className="divide-y divide-[#1e2f1e]/60">
          {leaderboards.map((entry) => {
            const isMe = entry.username === userProfile.username;

            return (
              <div
                key={entry.id}
                className={`grid grid-cols-12 p-3.5 items-center text-xs transition ${
                  isMe
                    ? 'bg-[#182818] text-[#f5df88] font-bold border-l-4 border-[#d4af37]'
                    : 'hover:bg-[#1a2c1a]/50 text-[#e0dcc5]'
                }`}
              >
                {/* Rank Number */}
                <div className="col-span-1 text-center font-bold">
                  {entry.rank === 1 ? (
                    <span className="text-base">🥇</span>
                  ) : entry.rank === 2 ? (
                    <span className="text-base">🥈</span>
                  ) : entry.rank === 3 ? (
                    <span className="text-base">🥉</span>
                  ) : (
                    <span className="text-[#d4af37]/90 font-mono">#{entry.rank}</span>
                  )}
                </div>

                {/* Player & Clan */}
                <div className="col-span-5 flex items-center gap-2.5">
                  <span className="text-xl">{entry.avatar}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#e0dcc5]">{entry.username}</span>
                      {isMe && (
                        <span className="px-1.5 py-0.2 rounded bg-[#d4af37] text-[#0d1a0d] text-[9px] font-extrabold uppercase">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#d4af37]/60 block">
                      {entry.clanName || 'Nomad'}
                    </span>
                  </div>
                </div>

                {/* Guardian Beast */}
                <div className="col-span-2 text-center text-[#e0dcc5]">
                  {entry.guardian}
                </div>

                {/* Win Rate */}
                <div className="col-span-2 text-center">
                  <span className="text-[#d4af37] font-bold">{entry.winRate}%</span>
                  <span className="text-[10px] text-stone-400 block">({entry.wins}W)</span>
                </div>

                {/* Elo */}
                <div className="col-span-2 text-right pr-2 font-mono font-extrabold text-[#d4af37] text-sm">
                  {entry.elo.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
