/**
 * Ludo Magic Savannah - Daily Quests & Season Journey
 */

import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Award, Sparkles, Check, Gift, Coins, Gem, Flame } from 'lucide-react';

export const QuestsView: React.FC = () => {
  const { quests, seasonTiers, userProfile, claimQuestReward, claimSeasonTier } = useGameStore();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#172617] via-[#101b10] to-[#1d160b] border-2 border-[#d4af37]/40 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>Savannah Quests & Season 1 Journey</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#e0dcc5] font-serif mt-1">
            Daily Challenges & Battle Pass
          </h2>
          <p className="text-xs text-[#e0dcc5]/80 mt-0.5">
            Complete daily tribal trials and level up your Savannah pass for free rewards.
          </p>
        </div>

        <div className="bg-[#0a120a] px-4 py-2 rounded-2xl border border-[#d4af37]/40 text-center">
          <span className="text-[10px] text-[#d4af37]/80 uppercase font-bold block">Season XP</span>
          <span className="text-base font-bold text-[#f5df88]">{userProfile.stats.seasonPoints} PTS</span>
        </div>
      </div>

      {/* 1. Daily Quests */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-extrabold text-[#e0dcc5] uppercase tracking-wider flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-[#d4af37]" />
          <span>Daily Savannah Trials (Resets in 14h)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {quests.map((q) => {
            const isFinished = q.progress >= q.target;

            return (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-[#121f12]/90 border border-[#d4af37]/25 flex flex-col justify-between gap-3 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{q.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#e0dcc5]">{q.title}</h4>
                      <p className="text-[11px] text-[#e0dcc5]/70 mt-0.5">{q.description}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Reward Claim */}
                <div>
                  <div className="flex justify-between text-[10px] text-[#d4af37] font-bold mb-1">
                    <span>Progress</span>
                    <span>
                      {q.progress}/{q.target}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0a120a] rounded-full overflow-hidden border border-stone-800 mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-[#e8c858] to-[#d4af37] rounded-full transition-all"
                      style={{ width: `${Math.min(100, (q.progress / q.target) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1e2f1e]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37]">
                      <span>+{q.rewardCoins} 🪙</span>
                      <span className="text-[#e0dcc5]/60 font-normal">+{q.rewardXp} XP</span>
                    </div>

                    {q.claimed ? (
                      <span className="text-[10px] text-stone-500 font-bold uppercase flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Claimed</span>
                      </span>
                    ) : isFinished ? (
                      <button
                        onClick={() => claimQuestReward(q.id)}
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#e8c858] via-[#d4af37] to-[#aa8218] text-[#0d1a0d] text-xs font-bold hover:brightness-110 shadow-md shadow-[#d4af37]/30 cursor-pointer animate-pulse"
                      >
                        Claim Reward
                      </button>
                    ) : (
                      <span className="text-[10px] text-stone-500 font-semibold">In Progress</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Season Pass 10-Tier Track */}
      <div className="bg-[#121f12]/90 border border-[#d4af37]/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#d4af37]/25 pb-3">
          <h3 className="text-sm font-extrabold text-[#e0dcc5] uppercase tracking-wider flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-[#d4af37]" />
            <span>Savannah Journey Pass (Season 1)</span>
          </h3>
          <span className="text-xs text-[#d4af37] font-bold">100% Free Pass</span>
        </div>

        {/* Horizontal Tier Track */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {seasonTiers.map((t) => {
            const isUnlocked = userProfile.stats.seasonPoints >= t.requiredSeasonXp;

            return (
              <div
                key={t.tier}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-between text-center gap-2 ${
                  isUnlocked
                    ? 'bg-[#182818] border-[#d4af37]/60 shadow-md'
                    : 'bg-[#0a120a]/80 border-stone-800 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between w-full text-[10px] font-bold text-[#d4af37]">
                  <span>TIER {t.tier}</span>
                  <span>{t.requiredSeasonXp} XP</span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-[#0a120a] border border-[#d4af37]/30 flex items-center justify-center text-xl my-1">
                  🎁
                </div>

                <span className="text-xs font-bold text-[#d4af37]">
                  +{t.freeReward.amount} 🪙
                </span>

                {t.isFreeClaimed ? (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Claimed
                  </span>
                ) : isUnlocked ? (
                  <button
                    onClick={() => claimSeasonTier(t.tier, false)}
                    className="w-full py-1 rounded-lg bg-[#d4af37] text-[#0d1a0d] text-[10px] font-extrabold hover:brightness-110 cursor-pointer shadow"
                  >
                    Claim
                  </button>
                ) : (
                  <span className="text-[10px] text-stone-500">Locked</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
