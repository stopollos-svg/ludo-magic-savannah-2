/**
 * Ludo Magic Savannah - Clan Hub & Tribal System
 */

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ClanInfo } from '../../types/social';
import { Users, Shield, Trophy, Sparkles, MessageSquare, Plus, Check } from 'lucide-react';

export const ClanHub: React.FC = () => {
  const { clans, userProfile, joinClan, createClan, sendChatMessage } = useGameStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [clanNameInput, setClanNameInput] = useState('');
  const [clanMottoInput, setClanMottoInput] = useState('');
  const [clanBadge, setClanBadge] = useState('🦁');

  const myClan = clans.find((c) => c.name === userProfile.clanName);

  const handleCreate = () => {
    if (!clanNameInput.trim() || userProfile.coins < 1000) return;
    createClan(clanNameInput.trim(), clanMottoInput.trim() || 'Courage of the Plains', clanBadge);
    setShowCreateModal(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#172617] via-[#101b10] to-[#1d160b] border-2 border-[#d4af37]/40 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>Savannah Clan Alliances</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#e0dcc5] font-serif mt-1">
            Tribal Halls & War Chests
          </h2>
          <p className="text-xs text-[#e0dcc5]/80 mt-0.5">
            Team up with allies, unlock exclusive passive perks, and dominate global clan wars.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#e8c858] via-[#d4af37] to-[#aa8218] text-[#0d1a0d] text-xs font-extrabold shadow-lg shadow-[#d4af37]/25 hover:brightness-110 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Found Clan (1,000 🪙)</span>
        </button>
      </div>

      {/* Current Clan Card if enrolled */}
      {myClan && (
        <div className="bg-[#121f12]/90 border-2 border-[#d4af37]/60 rounded-3xl p-5 sm:p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#d4af37]/25 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f5df88] via-[#d4af37] to-[#8b6508] border-2 border-[#f5df88] flex items-center justify-center text-3xl shadow-lg">
                {myClan.badgeIcon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[#e0dcc5] font-serif">{myClan.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
                    LVL {myClan.level}
                  </span>
                </div>
                <p className="text-xs text-[#e0dcc5]/70 italic mt-0.5">"{myClan.motto}"</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#e0dcc5]">
              <div>
                <span className="text-[#d4af37]/80 block">Leader:</span>
                <span className="font-bold">{myClan.leaderName}</span>
              </div>
              <div>
                <span className="text-[#d4af37]/80 block">Members:</span>
                <span className="font-bold">{myClan.membersCount}/{myClan.maxMembers}</span>
              </div>
              <div>
                <span className="text-[#d4af37]/80 block">Trophies:</span>
                <span className="font-bold text-[#d4af37]">{myClan.totalTrophies.toLocaleString()} 🏆</span>
              </div>
            </div>
          </div>

          {/* Clan Perks */}
          <div className="mt-4">
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block mb-2">
              Active Clan Perks
            </span>
            <div className="flex flex-wrap gap-2">
              {myClan.perks.map((perk, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-[#0a120a] border border-[#d4af37]/40 text-xs font-semibold text-[#f5df88] flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Available Clans to Join */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-extrabold text-[#e0dcc5] uppercase tracking-wider">
          Top Savannah Clans
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {clans.map((c) => {
            const isMyCurrentClan = c.name === userProfile.clanName;

            return (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-[#121f12]/85 border border-[#d4af37]/25 flex flex-col justify-between gap-3 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{c.badgeIcon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-[#e0dcc5]">{c.name}</h4>
                      <span className="text-[10px] text-[#d4af37]/75">
                        {c.membersCount}/{c.maxMembers} Members • Min {c.requiredElo} Elo
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#d4af37]">{c.totalTrophies.toLocaleString()} 🏆</span>
                </div>

                <p className="text-xs text-[#e0dcc5]/70 italic line-clamp-1">"{c.motto}"</p>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800">
                  <span className="text-[10px] text-stone-400">Level {c.level} Clan</span>
                  {isMyCurrentClan ? (
                    <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Enrolled</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => joinClan(c.id)}
                      className="px-3 py-1 rounded-lg bg-[#182818] border border-[#d4af37]/30 text-[#e0dcc5] text-xs font-bold hover:bg-[#223522] cursor-pointer"
                    >
                      Join Clan
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Clan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101c10] border-2 border-[#d4af37]/50 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-[#e0dcc5] font-serif mb-3">
              Found a Savannah Clan
            </h3>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-bold text-[#d4af37] block mb-1">Clan Name</label>
                <input
                  type="text"
                  placeholder="e.g. Serengeti Thunder"
                  value={clanNameInput}
                  onChange={(e) => setClanNameInput(e.target.value)}
                  className="w-full bg-[#0a120a] border border-stone-700 rounded-xl px-3 py-2 text-xs text-[#e0dcc5] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#d4af37] block mb-1">Motto</label>
                <input
                  type="text"
                  placeholder="e.g. United by the Sacred Baobab"
                  value={clanMottoInput}
                  onChange={(e) => setClanMottoInput(e.target.value)}
                  className="w-full bg-[#0a120a] border border-stone-700 rounded-xl px-3 py-2 text-xs text-[#e0dcc5] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#d4af37] block mb-1">Clan Badge</label>
                <div className="flex items-center gap-2">
                  {['🦁', '🐘', '🐆', '🦓', '🦒', '🦏'].map((badge) => (
                    <button
                      key={badge}
                      onClick={() => setClanBadge(badge)}
                      className={`text-xl p-2 rounded-xl border ${
                        clanBadge === badge ? 'bg-[#d4af37]/25 border-[#d4af37]' : 'bg-[#0a120a] border-stone-800'
                      }`}
                    >
                      {badge}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 rounded-xl bg-[#182818] text-[#e0dcc5] text-xs font-bold hover:bg-[#203220] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={userProfile.coins < 1000 || !clanNameInput.trim()}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#e8c858] via-[#d4af37] to-[#aa8218] text-[#0d1a0d] text-xs font-extrabold hover:brightness-110 shadow-md shadow-[#d4af37]/30 disabled:opacity-50 cursor-pointer"
              >
                Found (1,000 🪙)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
