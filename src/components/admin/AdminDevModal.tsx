/**
 * Ludo Magic Savannah - Admin, Supabase Architecture & Unity Integration Inspector
 */

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import {
  Code2,
  Database,
  Server,
  Gamepad2,
  ArrowLeft,
  Copy,
  Check,
  Zap,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { ROLL_DICE_EDGE_FUNCTION_CODE, MAKE_MOVE_EDGE_FUNCTION_CODE } from '../../docs/supabase-edge-functions';

export const AdminDevModal: React.FC = () => {
  const { gameState, userProfile, setView, rollDice, triggerAITurnIfNeeded } = useGameStore();
  const [activeTab, setActiveTab] = useState<'debugger' | 'schema' | 'edge_functions' | 'unity'>('debugger');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const SQL_SCHEMA_SNIPPET = `-- Ludo Magic Savannah Production PostgreSQL Schema
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    username VARCHAR(32) UNIQUE NOT NULL,
    avatar_url TEXT DEFAULT '🦁',
    level INTEGER DEFAULT 1,
    coins BIGINT DEFAULT 500,
    current_elo INTEGER DEFAULT 1200,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE game_states (
    game_id UUID PRIMARY KEY REFERENCES games(id),
    current_turn_index INTEGER DEFAULT 0,
    turn_phase VARCHAR(24) DEFAULT 'roll_dice',
    current_dice_value INTEGER,
    players_data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles viewable" ON profiles FOR SELECT USING (true);`;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#172617] via-[#101b10] to-[#1d160b] border-2 border-[#d4af37]/40 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('lobby')}
              className="p-1.5 rounded-lg bg-[#0a120a] text-[#e0dcc5] border border-[#d4af37]/30 hover:bg-[#182818] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#d4af37]" />
            </button>
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest flex items-center gap-1">
              <Code2 className="w-4 h-4" />
              <span>Full-Stack Architecture & Engine Inspector</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#e0dcc5] font-serif mt-1">
            Developer & Backend Dashboard
          </h2>
          <p className="text-xs text-[#e0dcc5]/80 mt-0.5">
            Inspect Supabase database schemas, Edge Functions anti-cheat code, and Unity 3D engine bridges.
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#d4af37]/25 pb-2 overflow-x-auto">
        {[
          { id: 'debugger' as const, label: '⚡ Live State Debugger', icon: <Zap className="w-3.5 h-3.5" /> },
          { id: 'schema' as const, label: '🗄️ Supabase PostgreSQL Schema', icon: <Database className="w-3.5 h-3.5" /> },
          { id: 'edge_functions' as const, label: '🌐 Supabase Edge Functions', icon: <Server className="w-3.5 h-3.5" /> },
          { id: 'unity' as const, label: '🎮 Unity Engine 3D Integration', icon: <Gamepad2 className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#d4af37] text-[#0d1a0d] shadow-md'
                : 'bg-[#121f12] text-[#e0dcc5] hover:bg-[#1a2c1a]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 1. Live Debugger Tab */}
      {activeTab === 'debugger' && (
        <div className="space-y-4">
          <div className="bg-[#121f12]/90 border border-[#d4af37]/30 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
            <h3 className="text-sm font-bold text-[#e0dcc5] uppercase tracking-wider">
              Runtime Game Engine State
            </h3>

            {gameState ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-[#0a120a] rounded-xl border border-stone-800">
                    <span className="text-stone-400 block">Room Code:</span>
                    <span className="font-mono font-bold text-[#f5df88]">{gameState.roomCode}</span>
                  </div>
                  <div className="p-3 bg-[#0a120a] rounded-xl border border-stone-800">
                    <span className="text-stone-400 block">Active Player:</span>
                    <span className="font-bold text-[#e0dcc5]">
                      {gameState.players[gameState.currentTurnIndex]?.name} ({gameState.players[gameState.currentTurnIndex]?.color})
                    </span>
                  </div>
                  <div className="p-3 bg-[#0a120a] rounded-xl border border-stone-800">
                    <span className="text-stone-400 block">Turn Phase:</span>
                    <span className="font-mono font-bold text-emerald-400">{gameState.turnPhase}</span>
                  </div>
                  <div className="p-3 bg-[#0a120a] rounded-xl border border-stone-800">
                    <span className="text-stone-400 block">Dice Value:</span>
                    <span className="font-bold text-[#d4af37]">{gameState.currentDiceValue ?? 'None'}</span>
                  </div>
                </div>

                {/* Simulation Triggers */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#1e2f1e]">
                  <button
                    onClick={() => rollDice()}
                    className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-[#0d1a0d] text-xs font-bold hover:brightness-110 cursor-pointer"
                  >
                    Force Roll Dice
                  </button>
                  <button
                    onClick={() => triggerAITurnIfNeeded()}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 cursor-pointer"
                  >
                    Trigger AI Move
                  </button>
                  <button
                    onClick={() => setView('game')}
                    className="px-3 py-1.5 rounded-lg bg-[#182818] text-[#e0dcc5] border border-stone-700 text-xs font-bold hover:bg-[#203420] cursor-pointer"
                  >
                    Switch to Active Board View
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-[#e0dcc5]/70 bg-[#0a120a] rounded-2xl border border-stone-800">
                No active game match in progress. Launch a match from the Lobby to inspect live turn telemetry.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. PostgreSQL Schema Tab */}
      {activeTab === 'schema' && (
        <div className="bg-[#121f12]/90 border border-[#d4af37]/30 rounded-3xl p-5 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#e0dcc5] uppercase tracking-wider">
                PostgreSQL Tables with Row Level Security (RLS)
              </h3>
              <p className="text-xs text-[#e0dcc5]/70">
                Includes `profiles`, `games`, `game_states`, `moves_history`, `clans`, and automated timestamp triggers.
              </p>
            </div>
            <button
              onClick={() => handleCopy(SQL_SCHEMA_SNIPPET)}
              className="px-3 py-1.5 rounded-xl bg-[#0a120a] border border-[#d4af37]/30 text-xs text-[#d4af37] flex items-center gap-1 hover:bg-[#182818] cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy SQL'}</span>
            </button>
          </div>

          <pre className="p-4 bg-[#0a120a] rounded-2xl border border-stone-800 font-mono text-xs text-[#e0dcc5]/90 overflow-x-auto leading-relaxed">
            {SQL_SCHEMA_SNIPPET}
          </pre>
        </div>
      )}

      {/* 3. Supabase Edge Functions Tab */}
      {activeTab === 'edge_functions' && (
        <div className="bg-[#121f12]/90 border border-[#d4af37]/30 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#e0dcc5] uppercase tracking-wider">
              Server-Authoritative Anti-Cheat Edge Functions
            </h3>
            <p className="text-xs text-[#e0dcc5]/70">
              Validates cryptographically secure dice rolls, consecutive sixes penalties, and move path rules server-side.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#d4af37] font-mono">
              /functions/v1/roll-dice/index.ts (Deno TypeScript)
            </span>
            <pre className="p-4 bg-[#0a120a] rounded-2xl border border-stone-800 font-mono text-xs text-[#e0dcc5]/90 overflow-x-auto max-h-72 leading-relaxed">
              {ROLL_DICE_EDGE_FUNCTION_CODE}
            </pre>
          </div>
        </div>
      )}

      {/* 4. Unity Engine Tab */}
      {activeTab === 'unity' && (
        <div className="bg-[#121f12]/90 border border-[#d4af37]/30 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#e0dcc5] font-serif">
              Unity 3D Engine Architecture & Cross-Platform Bridge
            </h3>
            <p className="text-xs text-[#e0dcc5]/80">
              For native iOS, Android, and Steam releases, Unity connects directly to Supabase Realtime channels with C# DOTween kinematics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#0a120a] rounded-2xl border border-stone-800 space-y-2">
              <span className="font-bold text-[#d4af37] block">3D Savannah Graphics Pipeline</span>
              <p className="text-[#e0dcc5]/80">
                - Custom URP shaders for African sunset & sunrise lighting
                <br />- Cinemachine orbit camera following piece hops
                <br />- 3D animal rigs with blendshape facial expressions
              </p>
            </div>
            <div className="p-4 bg-[#0a120a] rounded-2xl border border-stone-800 space-y-2">
              <span className="font-bold text-[#d4af37] block">C# Supabase Socket Bridge</span>
              <p className="text-[#e0dcc5]/80">
                - `Supabase.Realtime.RealtimeChannel` listeners
                <br />- Automatic state reconciliation upon network reconnects
                <br />- Cross-platform shared room matchmaking
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
