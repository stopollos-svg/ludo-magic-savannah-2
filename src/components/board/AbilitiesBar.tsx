/**
 * Ludo Magic Savannah - Magical Beast Abilities Bar Component
 */

import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { BEAST_ABILITIES } from '../../types/game';
import { Sparkles, Zap, Shield, Flame, Lock } from 'lucide-react';

export const AbilitiesBar: React.FC = () => {
  const { gameState, selectedPlayerColor, useBeastAbility } = useGameStore();

  if (!gameState || !gameState.settings.isMagicEnabled) return null;

  const humanPlayer = gameState.players.find((p) => p.color === selectedPlayerColor);
  if (!humanPlayer) return null;

  const ability = BEAST_ABILITIES[humanPlayer.beast];
  if (!ability) return null;

  const isMyTurn = gameState.players[gameState.currentTurnIndex].color === selectedPlayerColor;
  const hasEnoughMana = humanPlayer.mana >= ability.manaCost;
  const isOffCooldown = humanPlayer.abilityCooldown === 0;
  const canCast = isMyTurn && hasEnoughMana && isOffCooldown && gameState.status === 'playing';

  return (
    <div
      id="onboarding-abilities-target"
      className="w-full max-w-[560px] mx-auto bg-gradient-to-r from-[#182818]/90 via-[#101c10]/90 to-[#182818]/90 border border-[#d4af37]/30 rounded-xl p-2.5 sm:p-3 shadow-lg shadow-black/60 flex flex-col sm:flex-row items-center justify-between gap-3"
    >
      {/* Mana Meter */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto">
        <div className="w-8 h-8 rounded-lg bg-[#081820] border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-md">
          <Zap className="w-4 h-4 fill-cyan-400" />
        </div>
        <div className="flex-1 sm:w-32">
          <div className="flex justify-between text-[11px] font-bold text-[#e0dcc5] mb-1">
            <span>MANA</span>
            <span className="text-cyan-300">{humanPlayer.mana}/{humanPlayer.maxMana}</span>
          </div>
          <div className="w-full h-2 bg-[#0a120a] rounded-full overflow-hidden border border-[#d4af37]/25">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-400 to-indigo-400 rounded-full transition-all duration-300"
              style={{ width: `${(humanPlayer.mana / humanPlayer.maxMana) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Beast Ability Spell Card */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-3">
        <div className="flex items-center gap-2">
          <div className="text-2xl sm:text-3xl filter drop-shadow">
            {ability.icon}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs sm:text-sm font-bold text-[#e0dcc5]">{ability.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-semibold">
                {ability.manaCost} MP
              </span>
            </div>
            <p className="text-[10px] text-[#e0dcc5]/70 max-w-[220px] line-clamp-1">
              {ability.description}
            </p>
          </div>
        </div>

        {/* Cast Ability Button */}
        <button
          id={`btn-cast-ability-${ability.id}`}
          disabled={!canCast}
          onClick={() => useBeastAbility(humanPlayer.beast)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
            canCast
              ? 'bg-gradient-to-r from-[#e8c858] to-[#d4af37] text-[#0d1a0d] hover:brightness-110 shadow-[#d4af37]/30 cursor-pointer animate-pulse'
              : 'bg-[#132013] text-stone-500 border border-stone-800 cursor-not-allowed'
          }`}
        >
          {isOffCooldown ? (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>CAST</span>
            </>
          ) : (
            <>
              <Lock className="w-3 h-3" />
              <span>{humanPlayer.abilityCooldown}T</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
