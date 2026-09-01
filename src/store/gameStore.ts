/**
 * Ludo Magic Savannah - Global Zustand Game Store
 */

import { create } from 'zustand';
import {
  GameState,
  GameSettings,
  PlayerColor,
  PlayerInfo,
  PieceState,
  BeastType,
  AIDifficulty,
  BEAST_ABILITIES,
  MoveAction,
} from '../types/game';
import { UserProfile, CosmeticItem, DailyQuest, SeasonPassTier } from '../types/user';
import { ClanInfo, FriendEntry, ChatMessage, LeaderboardEntry, TournamentMatch } from '../types/social';
import {
  calculateNextPosition,
  getValidMoves,
  checkCapture,
  chooseAIMove,
  createPlayer,
  getRankBadge,
  TOTAL_STEPS_TO_GOAL,
} from '../utils/ludoEngine';
import { soundEngine } from '../utils/soundEngine';
import confetti from 'canvas-confetti';

interface AppState {
  currentView: 'lobby' | 'game' | 'clan' | 'bazaar' | 'leaderboard' | 'tournament' | 'replays' | 'admin' | 'quests';
  userProfile: UserProfile;
  gameState: GameState | null;
  selectedPlayerColor: PlayerColor;
  chatMessages: ChatMessage[];
  clans: ClanInfo[];
  friends: FriendEntry[];
  leaderboards: LeaderboardEntry[];
  quests: DailyQuest[];
  seasonTiers: SeasonPassTier[];
  savedReplays: Array<{ id: string; title: string; date: string; winner: string; moves: MoveAction[] }>;
  activeReplay: { moves: MoveAction[]; currentStep: number; isPlaying: boolean } | null;
  isMatchmaking: boolean;
  matchmakingSeconds: number;
  soundEnabled: boolean;
  musicEnabled: boolean;

  // Actions
  setView: (view: AppState['currentView']) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setMusicEnabled: (enabled: boolean) => void;
  startNewGame: (settings: GameSettings, humanColor?: PlayerColor, customOpponents?: PlayerInfo[]) => void;
  rollDice: () => void;
  selectPieceToMove: (pieceId: number) => void;
  useBeastAbility: (beast: BeastType, targetPieceId?: number) => void;
  cancelAbilityTargeting: () => void;
  endTurn: () => void;
  triggerAITurnIfNeeded: () => void;
  sendChatMessage: (text: string, isEmote?: boolean) => void;
  claimQuestReward: (questId: string) => void;
  claimSeasonTier: (tier: number, isPremium: boolean) => void;
  unlockCosmetic: (item: CosmeticItem) => void;
  equipCosmetic: (item: CosmeticItem) => void;
  joinClan: (clanId: string) => void;
  createClan: (name: string, motto: string, badge: string) => void;
  updateAmbiance: (ambiance: GameSettings['ambiance']) => void;
  resetToLobby: () => void;
  startMatchmakingQueue: () => void;
  cancelMatchmakingQueue: () => void;
  startTournament: () => void;
  loadReplay: (replayId: string) => void;
  stepReplay: (direction: 'next' | 'prev') => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'user_savannah_hero',
  username: 'Savannah Warrior',
  avatar: '🦁',
  level: 5,
  xp: 1420,
  xpToNextLevel: 2500,
  coins: 4800,
  gems: 350,
  beastGuardian: 'lion',
  equippedBoardTheme: 'savannah_gold',
  equippedDiceSkin: 'sunstone',
  equippedPieceSkin: 'lion',
  equippedTrail: 'savannah_dust',
  stats: {
    gamesPlayed: 32,
    wins: 21,
    winRate: 65.6,
    captures: 54,
    sixesRolled: 88,
    magicSpellsCast: 42,
    highestRank: 'Tribal Chieftain',
    currentElo: 1480,
    seasonPoints: 850,
  },
  isGuest: true,
  clanName: 'Pride of Serengeti',
  clanRole: 'elder',
};

const INITIAL_QUESTS: DailyQuest[] = [
  { id: 'q1', title: 'Savannah Roar', description: 'Capture 2 opponent pieces in any game mode', icon: '⚔️', progress: 1, target: 2, rewardCoins: 300, rewardXp: 150, completed: false, claimed: false },
  { id: 'q2', title: 'Lucky Stampede', description: 'Roll 3 sixes across your matches', icon: '🎲', progress: 2, target: 3, rewardCoins: 250, rewardXp: 100, completed: false, claimed: false },
  { id: 'q3', title: 'Baobab Haven', description: 'Land safely on 4 Ancient Baobabs', icon: '🌳', progress: 4, target: 4, rewardCoins: 400, rewardXp: 200, completed: true, claimed: false },
  { id: 'q4', title: 'Mystic Awakening', description: 'Cast 2 Beast Abilities in Magic Mode', icon: '✨', progress: 2, target: 2, rewardCoins: 500, rewardXp: 250, completed: true, claimed: false },
];

const INITIAL_CLANS: ClanInfo[] = [
  { id: 'c1', name: 'Pride of Serengeti', badgeIcon: '🦁', motto: 'Courage, Honor, and the Golden Plains', level: 12, membersCount: 28, maxMembers: 30, totalTrophies: 34200, requiredElo: 1300, leaderName: 'Mufasa_King', isRecruiting: true, perks: ['+10% Match XP', 'Exclusive Golden Clan Frame', 'Clan War Chest'] },
  { id: 'c2', name: 'Kilimanjaro Titans', badgeIcon: '🐘', motto: 'Unstoppable as the mountain', level: 15, membersCount: 30, maxMembers: 30, totalTrophies: 38900, requiredElo: 1500, leaderName: 'TuskMaster', isRecruiting: false, perks: ['+15% Match Coins', 'Titan Dice Trail'] },
  { id: 'c3', name: 'Cheetah Swiftblade', badgeIcon: '🐆', motto: 'Strike first, win fast', level: 8, membersCount: 19, maxMembers: 25, totalTrophies: 21400, requiredElo: 1100, leaderName: 'SpeedyZuri', isRecruiting: true, perks: ['+10% Match XP'] },
];

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, id: 'lb1', username: 'Savannah_Overlord', avatar: '🦁', guardian: 'Lion', clanName: 'Kilimanjaro Titans', elo: 2450, wins: 312, winRate: 78.4, badge: '👑 Grandmaster' },
  { rank: 2, id: 'lb2', username: 'TuskDominator', avatar: '🐘', guardian: 'Elephant', clanName: 'Kilimanjaro Titans', elo: 2310, wins: 280, winRate: 74.2, badge: '💎 Savannah Warlord' },
  { rank: 3, id: 'lb3', username: 'Zuri_Shadow', avatar: '🐆', guardian: 'Cheetah', clanName: 'Pride of Serengeti', elo: 2190, wins: 245, winRate: 71.0, badge: '💎 Savannah Warlord' },
  { rank: 4, id: 'lb4', username: 'ZebraGhost', avatar: '🦓', guardian: 'Zebra', clanName: 'Cheetah Swiftblade', elo: 1980, wins: 190, winRate: 68.5, badge: '🔥 Tribal Chieftain' },
  { rank: 5, id: 'lb5', username: 'Savannah Warrior', avatar: '🦁', guardian: 'Lion', clanName: 'Pride of Serengeti', elo: 1480, wins: 21, winRate: 65.6, badge: '⚔️ Pride Hunter' },
];

export const useGameStore = create<AppState>((set, get) => ({
  currentView: 'lobby',
  userProfile: DEFAULT_PROFILE,
  gameState: null,
  selectedPlayerColor: 'red',
  chatMessages: [
    { id: 'm1', senderId: 'sys', senderName: 'Savannah Guide', senderAvatar: '🌍', text: 'Welcome to Ludo Magic Savannah! May the spirits of the plains guide your dice.', timestamp: 'Just now' },
  ],
  clans: INITIAL_CLANS,
  friends: [
    { id: 'f1', username: 'Rafiki_Sage', avatar: '🦒', status: 'online', elo: 1540, rankTitle: 'Tribal Chieftain', lastSeen: 'Active now' },
    { id: 'f2', username: 'Kovu_Hunter', avatar: '🦁', status: 'in_game', elo: 1410, rankTitle: 'Pride Hunter', lastSeen: 'In Ranked Match' },
    { id: 'f3', username: 'Zara_Swift', avatar: '🐆', status: 'offline', elo: 1290, rankTitle: 'Pride Hunter', lastSeen: '2 hours ago' },
  ],
  leaderboards: INITIAL_LEADERBOARD,
  quests: INITIAL_QUESTS,
  seasonTiers: Array.from({ length: 10 }, (_, i) => ({
    tier: i + 1,
    requiredSeasonXp: (i + 1) * 200,
    freeReward: { type: 'coins', amount: (i + 1) * 250 },
    premiumReward: { type: 'gems', amount: (i + 1) * 50 },
    isFreeClaimed: i === 0,
    isPremiumClaimed: false,
  })),
  savedReplays: [],
  activeReplay: null,
  isMatchmaking: false,
  matchmakingSeconds: 0,
  soundEnabled: true,
  musicEnabled: true,

  setView: (view) => set({ currentView: view }),

  setSoundEnabled: (enabled) => {
    soundEngine.setMuted(!enabled);
    set({ soundEnabled: enabled });
  },

  setMusicEnabled: (enabled) => {
    if (enabled) soundEngine.startAmbience();
    else soundEngine.stopAmbience();
    set({ musicEnabled: enabled });
  },

  startNewGame: (settings, humanColor = 'red', customOpponents) => {
    soundEngine.playSafeZone();
    const colors: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];
    const beasts: BeastType[] = ['lion', 'elephant', 'cheetah', 'zebra'];

    let players: PlayerInfo[] = [];

    if (customOpponents && customOpponents.length > 0) {
      players = [
        createPlayer('p1', get().userProfile.username, humanColor, get().userProfile.beastGuardian, false),
        ...customOpponents,
      ];
    } else if (settings.mode === 'pass_and_play') {
      players = colors.slice(0, settings.playerCount).map((col, idx) =>
        createPlayer(`p_${idx + 1}`, `Player ${idx + 1} (${col.toUpperCase()})`, col, beasts[idx], false)
      );
    } else {
      // Solo vs AI or standard
      players = [
        createPlayer('p1', get().userProfile.username, humanColor, get().userProfile.beastGuardian, false),
        createPlayer('ai_2', 'Bantu the Tusker', 'green', 'elephant', true, 'medium'),
        createPlayer('ai_3', 'Kesi the Swift', 'yellow', 'cheetah', true, 'hard'),
        createPlayer('ai_4', 'Mosi the Shadow', 'blue', 'zebra', true, 'expert'),
      ].slice(0, settings.playerCount);
    }

    const newGameState: GameState = {
      id: `game_${Date.now()}`,
      roomCode: `SAV-${Math.floor(100 + Math.random() * 900)}`,
      status: 'playing',
      settings,
      players,
      currentTurnIndex: 0,
      turnPhase: 'roll_dice',
      currentDiceValue: null,
      hasRolled: false,
      canRollAgain: false,
      validPieceMoves: [],
      selectedPieceId: null,
      activeAbilityTargeting: null,
      turnTimeRemaining: settings.turnTimeoutSeconds || 20,
      winner: null,
      rankings: [],
      moveHistory: [],
      gameLogs: [
        { id: 'l1', text: `Match commenced in ${settings.ambiance.toUpperCase()} savannah.`, time: '0:00', type: 'system' },
      ],
      spectatorsCount: Math.floor(Math.random() * 12) + 3,
    };

    set({
      gameState: newGameState,
      selectedPlayerColor: humanColor,
      currentView: 'game',
      isMatchmaking: false,
    });

    // Check if first player is AI
    setTimeout(() => {
      get().triggerAITurnIfNeeded();
    }, 600);
  },

  rollDice: () => {
    const { gameState } = get();
    if (!gameState || gameState.status !== 'playing' || gameState.hasRolled) return;

    soundEngine.playDiceRoll();

    const activePlayer = gameState.players[gameState.currentTurnIndex];
    let dice = Math.floor(Math.random() * 6) + 1;

    // Cheetah sprint buff: +2
    if (activePlayer.activeBuff?.type === 'sprint') {
      dice = Math.min(6, dice + 2);
    }

    const isSix = dice === 6;
    const newConsecutiveSixes = isSix ? activePlayer.consecutiveSixes + 1 : 0;

    // Check 3 consecutive 6s rule (forfeits turn)
    if (newConsecutiveSixes === 3) {
      soundEngine.playCapture();
      const updatedPlayers = [...gameState.players];
      updatedPlayers[gameState.currentTurnIndex] = {
        ...activePlayer,
        consecutiveSixes: 0,
      };

      const updatedLogs = [
        {
          id: `log_${Date.now()}`,
          text: `⚡ ${activePlayer.name} rolled three consecutive 6s! Spirits penalized turn.`,
          time: 'Now',
          type: 'system' as const,
        },
        ...gameState.gameLogs,
      ];

      set({
        gameState: {
          ...gameState,
          players: updatedPlayers,
          hasRolled: true,
          currentDiceValue: dice,
          gameLogs: updatedLogs,
        },
      });

      setTimeout(() => {
        get().endTurn();
      }, 1200);
      return;
    }

    const validMoves = getValidMoves(activePlayer, dice, gameState.settings.fastMode);

    const updatedPlayers = [...gameState.players];
    updatedPlayers[gameState.currentTurnIndex] = {
      ...activePlayer,
      consecutiveSixes: newConsecutiveSixes,
      mana: Math.min(activePlayer.maxMana, activePlayer.mana + (isSix ? 10 : 3)),
    };

    const newLogs = [
      {
        id: `log_${Date.now()}`,
        text: `🎲 ${activePlayer.name} rolled a ${dice}!`,
        time: 'Now',
        type: 'move' as const,
      },
      ...gameState.gameLogs,
    ];

    set({
      gameState: {
        ...gameState,
        players: updatedPlayers,
        currentDiceValue: dice,
        hasRolled: true,
        validPieceMoves: validMoves,
        turnPhase: validMoves.length > 0 ? 'select_piece' : 'turn_end',
        gameLogs: newLogs,
      },
    });

    // If no valid moves exist, automatically advance turn
    if (validMoves.length === 0) {
      setTimeout(() => {
        get().endTurn();
      }, 1000);
    } else if (validMoves.length === 1 && !activePlayer.isAI) {
      // Auto move single option for fast smooth UX
      setTimeout(() => {
        get().selectPieceToMove(validMoves[0]);
      }, 400);
    }
  },

  selectPieceToMove: (pieceId: number) => {
    const { gameState, userProfile } = get();
    if (!gameState || !gameState.hasRolled || !gameState.currentDiceValue) return;

    const activePlayer = gameState.players[gameState.currentTurnIndex];
    const piece = activePlayer.pieces.find((p) => p.id === pieceId);
    if (!piece) return;

    const { canMove, nextPosition, nextStepCount, reachesGoal } = calculateNextPosition(
      piece,
      gameState.currentDiceValue,
      activePlayer.color,
      gameState.settings.fastMode
    );

    if (!canMove) return;

    soundEngine.playStep(gameState.currentDiceValue === 6);

    // Check for capture
    const captureResult = checkCapture(nextPosition, nextStepCount, activePlayer.color, gameState.players);
    let capturedPlayerName = '';

    const updatedPlayers = gameState.players.map((p) => {
      if (p.color === activePlayer.color) {
        const updatedPieces = p.pieces.map((pc) => {
          if (pc.id === pieceId) {
            return {
              ...pc,
              position: nextPosition,
              stepCount: nextStepCount,
              hasFinished: reachesGoal,
              isSafe: nextStepCount >= 52 || [0, 8, 13, 21, 26, 34, 39, 47].includes(nextPosition),
            };
          }
          return pc;
        });

        // Earn mana and check if finished
        const bonusMana = reachesGoal ? 25 : captureResult ? 20 : 0;
        return {
          ...p,
          pieces: updatedPieces,
          mana: Math.min(p.maxMana, p.mana + bonusMana),
          score: p.score + (reachesGoal ? 100 : 10),
        };
      }

      // If this player had a captured piece, reset it
      if (captureResult && p.color === captureResult.capturedColor) {
        capturedPlayerName = p.name;
        const updatedPieces = p.pieces.map((pc) => {
          if (pc.id === captureResult.pieceId) {
            return {
              ...pc,
              position: -1,
              stepCount: 0,
              isSafe: true,
              isShielded: false,
            };
          }
          return pc;
        });
        return { ...p, pieces: updatedPieces };
      }

      return p;
    });

    if (captureResult) {
      soundEngine.playCapture();
    }
    if (reachesGoal) {
      soundEngine.playHomeEnter();
    }

    const moveAction: MoveAction = {
      playerColor: activePlayer.color,
      pieceId,
      fromPosition: piece.position,
      toPosition: nextPosition,
      diceValue: gameState.currentDiceValue,
      capturedPiece: captureResult ? { color: captureResult.capturedColor, pieceId: captureResult.pieceId } : undefined,
      timestamp: Date.now(),
      description: `${activePlayer.name} moved piece to ${reachesGoal ? 'GOAL 🏆' : nextPosition}`,
    };

    const newLogs = [...gameState.gameLogs];
    if (captureResult) {
      newLogs.unshift({
        id: `log_${Date.now()}`,
        text: `⚔️ ${activePlayer.name} captured ${capturedPlayerName}'s beast! Bonus roll granted!`,
        time: 'Now',
        type: 'capture',
      });
    }
    if (reachesGoal) {
      newLogs.unshift({
        id: `log_${Date.now()}`,
        text: `🏆 ${activePlayer.name}'s beast reached the Sacred Waterhole!`,
        time: 'Now',
        type: 'system',
      });
    }

    // Check Win Condition
    const movingPlayerUpdated = updatedPlayers.find((p) => p.color === activePlayer.color)!;
    const allHome = movingPlayerUpdated.pieces.every((p) => p.hasFinished);

    let winner = gameState.winner;
    const rankings = [...gameState.rankings];

    if (allHome && !rankings.includes(activePlayer.color)) {
      rankings.push(activePlayer.color);
      if (!winner) {
        winner = activePlayer.color;
        soundEngine.playVictory();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    }

    const grantBonusRoll = (gameState.currentDiceValue === 6 || Boolean(captureResult) || reachesGoal) && !allHome;

    set({
      gameState: {
        ...gameState,
        players: updatedPlayers,
        winner,
        rankings,
        status: winner ? 'game_over' : 'playing',
        turnPhase: grantBonusRoll ? 'roll_dice' : 'turn_end',
        hasRolled: !grantBonusRoll,
        canRollAgain: grantBonusRoll,
        validPieceMoves: [],
        currentDiceValue: grantBonusRoll ? null : gameState.currentDiceValue,
        moveHistory: [...gameState.moveHistory, moveAction],
        gameLogs: newLogs,
      },
    });

    // Update user stats if human player won or captured
    if (!activePlayer.isAI) {
      const isWinner = winner === activePlayer.color;
      set({
        userProfile: {
          ...userProfile,
          xp: userProfile.xp + (isWinner ? 250 : 50),
          coins: userProfile.coins + (isWinner ? 400 : 80),
          stats: {
            ...userProfile.stats,
            wins: isWinner ? userProfile.stats.wins + 1 : userProfile.stats.wins,
            captures: captureResult ? userProfile.stats.captures + 1 : userProfile.stats.captures,
            sixesRolled: gameState.currentDiceValue === 6 ? userProfile.stats.sixesRolled + 1 : userProfile.stats.sixesRolled,
          },
        },
      });
    }

    if (!grantBonusRoll && !winner) {
      setTimeout(() => {
        get().endTurn();
      }, 700);
    } else if (grantBonusRoll && activePlayer.isAI && !winner) {
      setTimeout(() => {
        get().triggerAITurnIfNeeded();
      }, 900);
    }
  },

  useBeastAbility: (beast: BeastType, targetPieceId?: number) => {
    const { gameState } = get();
    if (!gameState || !gameState.settings.isMagicEnabled) return;

    const activePlayer = gameState.players[gameState.currentTurnIndex];
    const ability = BEAST_ABILITIES[beast];
    if (!ability || activePlayer.mana < ability.manaCost) return;

    soundEngine.playMagicCast();

    const updatedPlayers = [...gameState.players];
    let spellLog = `✨ ${activePlayer.name} cast ${ability.name}!`;

    if (beast === 'lion') {
      // Shield all active pieces of this player
      updatedPlayers[gameState.currentTurnIndex] = {
        ...activePlayer,
        mana: activePlayer.mana - ability.manaCost,
        abilityCooldown: ability.cooldownTurns,
        pieces: activePlayer.pieces.map((p) => ({ ...p, isShielded: true })),
        activeBuff: { type: 'shield', duration: 2 },
      };
      spellLog += ' Golden roar shields all clan pieces from captures for 1 round!';
    } else if (beast === 'cheetah') {
      // Boost next dice roll +2
      updatedPlayers[gameState.currentTurnIndex] = {
        ...activePlayer,
        mana: activePlayer.mana - ability.manaCost,
        abilityCooldown: ability.cooldownTurns,
        activeBuff: { type: 'sprint', duration: 1 },
      };
      spellLog += ' Wind sprint activated: +2 added to dice roll!';
    } else if (beast === 'elephant') {
      // Stomp: push back closest enemy piece within 4 tiles
      let stomped = false;
      const myTrackPieces = activePlayer.pieces.filter((p) => p.position !== -1 && !p.hasFinished && p.stepCount <= 51);
      
      if (myTrackPieces.length > 0) {
        const leadPiece = myTrackPieces[0];
        for (let i = 0; i < updatedPlayers.length; i++) {
          if (updatedPlayers[i].color === activePlayer.color) continue;
          for (let j = 0; j < updatedPlayers[i].pieces.length; j++) {
            const enemyPiece = updatedPlayers[i].pieces[j];
            if (enemyPiece.position !== -1 && !enemyPiece.hasFinished && enemyPiece.stepCount <= 51) {
              const diff = (enemyPiece.position - leadPiece.position + 52) % 52;
              if (diff >= 1 && diff <= 4 && !enemyPiece.isShielded) {
                // Knock back 2 steps
                const newStep = Math.max(1, enemyPiece.stepCount - 2);
                const newPos = (enemyPiece.position - 2 + 52) % 52;
                updatedPlayers[i].pieces[j] = { ...enemyPiece, position: newPos, stepCount: newStep };
                stomped = true;
                spellLog += ` Ground trembled! Pushed ${updatedPlayers[i].name}'s piece back 2 tiles!`;
                break;
              }
            }
          }
          if (stomped) break;
        }
      }

      updatedPlayers[gameState.currentTurnIndex] = {
        ...activePlayer,
        mana: activePlayer.mana - ability.manaCost,
        abilityCooldown: ability.cooldownTurns,
      };
      if (!stomped) spellLog += ' Ground trembled fiercely with thunderous energy!';
    } else {
      // Generic mana deduction
      updatedPlayers[gameState.currentTurnIndex] = {
        ...activePlayer,
        mana: activePlayer.mana - ability.manaCost,
        abilityCooldown: ability.cooldownTurns,
      };
    }

    const newLogs = [
      {
        id: `log_${Date.now()}`,
        text: spellLog,
        time: 'Now',
        type: 'magic' as const,
      },
      ...gameState.gameLogs,
    ];

    set({
      gameState: {
        ...gameState,
        players: updatedPlayers,
        gameLogs: newLogs,
      },
    });
  },

  cancelAbilityTargeting: () => {
    const { gameState } = get();
    if (!gameState) return;
    set({ gameState: { ...gameState, activeAbilityTargeting: null } });
  },

  endTurn: () => {
    const { gameState } = get();
    if (!gameState || gameState.status !== 'playing') return;

    let nextIndex = (gameState.currentTurnIndex + 1) % gameState.players.length;
    // Skip finished players if any
    let attempts = 0;
    while (
      gameState.players[nextIndex].pieces.every((p) => p.hasFinished) &&
      attempts < gameState.players.length
    ) {
      nextIndex = (nextIndex + 1) % gameState.players.length;
      attempts++;
    }

    // Decrement active buffs or cooldowns
    const updatedPlayers = gameState.players.map((p, idx) => {
      let activeBuff = p.activeBuff;
      let pieces = p.pieces;
      if (idx === gameState.currentTurnIndex) {
        if (activeBuff) {
          const newDur = activeBuff.duration - 1;
          activeBuff = newDur > 0 ? { ...activeBuff, duration: newDur } : undefined;
          if (!activeBuff && p.beast === 'lion') {
            pieces = p.pieces.map((pc) => ({ ...pc, isShielded: false }));
          }
        }
      }
      return {
        ...p,
        consecutiveSixes: 0,
        abilityCooldown: Math.max(0, p.abilityCooldown - 1),
        activeBuff,
        pieces,
      };
    });

    set({
      gameState: {
        ...gameState,
        players: updatedPlayers,
        currentTurnIndex: nextIndex,
        turnPhase: 'roll_dice',
        currentDiceValue: null,
        hasRolled: false,
        canRollAgain: false,
        validPieceMoves: [],
        selectedPieceId: null,
        activeAbilityTargeting: null,
        turnTimeRemaining: gameState.settings.turnTimeoutSeconds || 20,
      },
    });

    setTimeout(() => {
      get().triggerAITurnIfNeeded();
    }, 600);
  },

  triggerAITurnIfNeeded: () => {
    const { gameState } = get();
    if (!gameState || gameState.status !== 'playing') return;

    const activePlayer = gameState.players[gameState.currentTurnIndex];
    if (!activePlayer.isAI) return;

    // AI Mana ability use chance
    if (
      gameState.settings.isMagicEnabled &&
      activePlayer.mana >= 40 &&
      activePlayer.abilityCooldown === 0 &&
      Math.random() < 0.45
    ) {
      get().useBeastAbility(activePlayer.beast);
    }

    // AI rolls dice
    setTimeout(() => {
      get().rollDice();

      // AI selects move
      setTimeout(() => {
        const stateNow = get().gameState;
        if (!stateNow || stateNow.currentTurnIndex !== gameState.currentTurnIndex) return;

        const diceVal = stateNow.currentDiceValue;
        if (!diceVal) return;

        const bestPieceId = chooseAIMove(activePlayer, diceVal, stateNow, activePlayer.aiDifficulty);
        if (bestPieceId !== null) {
          get().selectPieceToMove(bestPieceId);
        }
      }, 700);
    }, 600);
  },

  sendChatMessage: (text, isEmote = false) => {
    const { userProfile, chatMessages } = get();
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: userProfile.id,
      senderName: userProfile.username,
      senderAvatar: userProfile.avatar,
      text,
      isEmote,
      timestamp: 'Just now',
    };
    set({ chatMessages: [...chatMessages, newMsg] });
  },

  claimQuestReward: (questId) => {
    const { quests, userProfile } = get();
    const quest = quests.find((q) => q.id === questId);
    if (!quest || !quest.completed || quest.claimed) return;

    soundEngine.playHomeEnter();
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });

    set({
      quests: quests.map((q) => (q.id === questId ? { ...q, claimed: true } : q)),
      userProfile: {
        ...userProfile,
        coins: userProfile.coins + quest.rewardCoins,
        xp: userProfile.xp + quest.rewardXp,
      },
    });
  },

  claimSeasonTier: (tierNum, isPremium) => {
    const { seasonTiers, userProfile } = get();
    const tier = seasonTiers.find((t) => t.tier === tierNum);
    if (!tier) return;

    soundEngine.playHomeEnter();

    set({
      seasonTiers: seasonTiers.map((t) => {
        if (t.tier === tierNum) {
          return {
            ...t,
            isFreeClaimed: isPremium ? t.isFreeClaimed : true,
            isPremiumClaimed: isPremium ? true : t.isPremiumClaimed,
          };
        }
        return t;
      }),
      userProfile: {
        ...userProfile,
        coins: userProfile.coins + (isPremium ? 0 : tier.freeReward.amount || 200),
        gems: userProfile.gems + (isPremium ? tier.premiumReward.amount || 50 : 0),
      },
    });
  },

  unlockCosmetic: (item) => {
    const { userProfile } = get();
    if (item.priceCoins && userProfile.coins >= item.priceCoins) {
      soundEngine.playHomeEnter();
      set({
        userProfile: {
          ...userProfile,
          coins: userProfile.coins - item.priceCoins,
        },
      });
    } else if (item.priceGems && userProfile.gems >= item.priceGems) {
      soundEngine.playHomeEnter();
      set({
        userProfile: {
          ...userProfile,
          gems: userProfile.gems - item.priceGems,
        },
      });
    }
  },

  equipCosmetic: (item) => {
    const { userProfile } = get();
    if (item.category === 'board_theme') {
      set({ userProfile: { ...userProfile, equippedBoardTheme: item.id } });
    } else if (item.category === 'dice_skin') {
      set({ userProfile: { ...userProfile, equippedDiceSkin: item.id } });
    } else if (item.category === 'piece_skin') {
      set({ userProfile: { ...userProfile, equippedPieceSkin: item.id } });
    }
  },

  joinClan: (clanId) => {
    const { clans, userProfile } = get();
    const targetClan = clans.find((c) => c.id === clanId);
    if (!targetClan) return;
    soundEngine.playSafeZone();
    set({
      userProfile: {
        ...userProfile,
        clanId: targetClan.id,
        clanName: targetClan.name,
        clanRole: 'member',
      },
    });
  },

  createClan: (name, motto, badge) => {
    const { clans, userProfile } = get();
    if (userProfile.coins < 1000) return;
    const newClan: ClanInfo = {
      id: `clan_${Date.now()}`,
      name,
      motto,
      badgeIcon: badge,
      level: 1,
      membersCount: 1,
      maxMembers: 20,
      totalTrophies: userProfile.stats.currentElo,
      requiredElo: 1000,
      leaderName: userProfile.username,
      isRecruiting: true,
      perks: ['+5% Match XP'],
    };
    soundEngine.playVictory();
    set({
      clans: [newClan, ...clans],
      userProfile: {
        ...userProfile,
        coins: userProfile.coins - 1000,
        clanId: newClan.id,
        clanName: newClan.name,
        clanRole: 'leader',
      },
    });
  },

  updateAmbiance: (ambiance) => {
    const { gameState } = get();
    if (gameState) {
      set({
        gameState: {
          ...gameState,
          settings: { ...gameState.settings, ambiance },
        },
      });
    }
  },

  resetToLobby: () => {
    soundEngine.stopAmbience();
    set({ gameState: null, currentView: 'lobby' });
  },

  startMatchmakingQueue: () => {
    set({ isMatchmaking: true, matchmakingSeconds: 0 });
    const timer = window.setInterval(() => {
      const { isMatchmaking, matchmakingSeconds } = get();
      if (!isMatchmaking) {
        clearInterval(timer);
        return;
      }
      set({ matchmakingSeconds: matchmakingSeconds + 1 });
      if (matchmakingSeconds >= 5) {
        clearInterval(timer);
        // Start ranked match
        get().startNewGame({
          mode: 'online_ranked',
          playerCount: 4,
          isMagicEnabled: true,
          turnTimeoutSeconds: 15,
          fastMode: false,
          ambiance: 'sunset',
          boardTheme: 'savannah_gold',
          diceSkin: 'sunstone',
        });
      }
    }, 1000);
  },

  cancelMatchmakingQueue: () => {
    set({ isMatchmaking: false, matchmakingSeconds: 0 });
  },

  startTournament: () => {
    set({ currentView: 'tournament' });
  },

  loadReplay: (replayId) => {
    const replay = get().savedReplays.find((r) => r.id === replayId);
    if (!replay) return;
    set({
      activeReplay: { moves: replay.moves, currentStep: 0, isPlaying: false },
      currentView: 'replays',
    });
  },

  stepReplay: (direction) => {
    const { activeReplay } = get();
    if (!activeReplay) return;
    const newStep = direction === 'next'
      ? Math.min(activeReplay.moves.length - 1, activeReplay.currentStep + 1)
      : Math.max(0, activeReplay.currentStep - 1);
    set({ activeReplay: { ...activeReplay, currentStep: newStep } });
  },
}));
