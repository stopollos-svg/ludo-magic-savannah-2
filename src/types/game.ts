/**
 * Ludo Magic Savannah - Game Engine Types & Constants
 */

export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export type BeastType = 'lion' | 'elephant' | 'cheetah' | 'zebra' | 'giraffe' | 'rhino';

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type GameMode = 
  | 'vs_ai'
  | 'pass_and_play'
  | 'online_ranked'
  | 'private_room'
  | 'team_2v2'
  | 'tournament'
  | 'daily_challenge';

export type BoardAmbiance = 'day' | 'sunset' | 'night' | 'oasis';

export interface AbilityDef {
  id: string;
  name: string;
  beast: BeastType;
  manaCost: number;
  description: string;
  cooldownTurns: number;
  icon: string;
  color: string;
}

export interface PieceState {
  id: number; // 0, 1, 2, 3
  color: PlayerColor;
  position: number; // -1: in yard, 0..51: on main track, 52..56: in home path, 56 is goal
  stepCount: number; // 0: yard, 1..57 (57 = finished)
  isSafe: boolean;
  isShielded: boolean; // From Lion's Roar or Magic
  hasFinished: boolean;
}

export interface PlayerInfo {
  id: string;
  name: string;
  color: PlayerColor;
  beast: BeastType;
  avatar: string;
  isAI: boolean;
  aiDifficulty?: AIDifficulty;
  elo: number;
  rankTitle: string;
  mana: number;
  maxMana: number;
  abilityCooldown: number;
  activeBuff?: {
    type: 'shield' | 'sprint' | 'camouflage';
    duration: number; // turns remaining
  };
  teamId?: 1 | 2;
  pieces: PieceState[];
  score: number;
  consecutiveSixes: number;
}

export interface MoveAction {
  playerColor: PlayerColor;
  pieceId: number;
  fromPosition: number;
  toPosition: number;
  diceValue: number;
  capturedPiece?: {
    color: PlayerColor;
    pieceId: number;
  };
  abilityUsed?: string;
  timestamp: number;
  description: string;
}

export interface GameSettings {
  mode: GameMode;
  playerCount: 2 | 3 | 4;
  isMagicEnabled: boolean;
  turnTimeoutSeconds: number;
  fastMode: boolean; // 1 to start from yard or standard 6
  ambiance: BoardAmbiance;
  boardTheme: 'savannah_gold' | 'midnight_oasis' | 'emerald_serengeti' | 'volcano_crater';
  diceSkin: 'sunstone' | 'ivory' | 'amethyst' | 'obsidian';
}

export interface GameState {
  id: string;
  roomCode?: string;
  status: 'waiting' | 'starting' | 'playing' | 'paused' | 'game_over';
  settings: GameSettings;
  players: PlayerInfo[];
  currentTurnIndex: number;
  turnPhase: 'roll_dice' | 'select_piece' | 'moving' | 'ability_targeting' | 'turn_end';
  currentDiceValue: number | null;
  hasRolled: boolean;
  canRollAgain: boolean;
  validPieceMoves: number[]; // piece IDs that can legally move
  selectedPieceId: number | null;
  activeAbilityTargeting: AbilityDef | null;
  turnTimeRemaining: number;
  winner: PlayerColor | null;
  rankings: PlayerColor[];
  moveHistory: MoveAction[];
  gameLogs: Array<{ id: string; text: string; time: string; type: 'move' | 'capture' | 'magic' | 'system' }>;
  spectatorsCount: number;
}

// Starting coordinates on main track (0..51) for each player
export const START_POSITIONS: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

// Main track position where player turns into their home stretch
export const HOME_ENTRY_POSITIONS: Record<PlayerColor, number> = {
  red: 50,
  green: 11,
  yellow: 24,
  blue: 37,
};

// Safe spots (Stars / Ancient Baobabs)
export const SAFE_POSITIONS = [0, 8, 13, 21, 26, 34, 39, 47];

export const BEAST_ABILITIES: Record<BeastType, AbilityDef> = {
  lion: {
    id: 'lions_roar',
    name: "Lion's Roar",
    beast: 'lion',
    manaCost: 40,
    cooldownTurns: 3,
    description: 'Grants royal immunity (shield) to all your pieces on the track for 1 round.',
    icon: '🦁',
    color: '#EAB308',
  },
  elephant: {
    id: 'elephant_stomp',
    name: 'Elephant Stomp',
    beast: 'elephant',
    manaCost: 45,
    cooldownTurns: 4,
    description: 'Causes a tremor that pushes back any opponent piece within 4 tiles by 3 steps.',
    icon: '🐘',
    color: '#3B82F6',
  },
  cheetah: {
    id: 'cheetah_sprint',
    name: 'Cheetah Sprint',
    beast: 'cheetah',
    manaCost: 30,
    cooldownTurns: 2,
    description: 'Instantly adds +3 to your current or next dice roll for hyper acceleration.',
    icon: '🐆',
    color: '#F97316',
  },
  zebra: {
    id: 'zebra_camouflage',
    name: 'Zebra Camouflage',
    beast: 'zebra',
    manaCost: 35,
    cooldownTurns: 3,
    description: 'Grants ghost phase to a piece to glide effortlessly past blockades.',
    icon: '🦓',
    color: '#10B981',
  },
  giraffe: {
    id: 'giraffe_vision',
    name: 'Giraffe Foresight',
    beast: 'giraffe',
    manaCost: 25,
    cooldownTurns: 2,
    description: 'Rolls 2 dice and lets you pick the best roll, or reroll a low value.',
    icon: '🦒',
    color: '#8B5CF6',
  },
  rhino: {
    id: 'rhino_charge',
    name: 'Rhino Stampede',
    beast: 'rhino',
    manaCost: 50,
    cooldownTurns: 4,
    description: 'Charges forward, instantly capturing even pieces parked in safe baobabs.',
    icon: '🦏',
    color: '#EF4444',
  },
};
