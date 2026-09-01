/**
 * Ludo Magic Savannah - Core Game Rules Engine & AI Logic
 */

import {
  PlayerColor,
  PieceState,
  PlayerInfo,
  GameState,
  START_POSITIONS,
  SAFE_POSITIONS,
  BEAST_ABILITIES,
  BeastType,
  AIDifficulty,
  MoveAction,
} from '../types/game';

export const TOTAL_STEPS_TO_GOAL = 57; // stepCount 1 to 57 (57 = finished in goal)

/**
 * Calculates new position and stepCount for a piece given a dice value.
 */
export function calculateNextPosition(
  piece: PieceState,
  diceValue: number,
  playerColor: PlayerColor,
  fastMode: boolean = false
): { canMove: boolean; nextPosition: number; nextStepCount: number; reachesGoal: boolean } {
  if (piece.hasFinished) {
    return { canMove: false, nextPosition: piece.position, nextStepCount: piece.stepCount, reachesGoal: false };
  }

  // 1. Piece in Yard
  if (piece.position === -1 || piece.stepCount === 0) {
    const canLeaveYard = fastMode ? (diceValue === 1 || diceValue === 6) : (diceValue === 6);
    if (canLeaveYard) {
      return {
        canMove: true,
        nextPosition: START_POSITIONS[playerColor],
        nextStepCount: 1,
        reachesGoal: false,
      };
    }
    return { canMove: false, nextPosition: -1, nextStepCount: 0, reachesGoal: false };
  }

  // 2. Piece already on the board or home stretch
  const targetStep = piece.stepCount + diceValue;

  if (targetStep > TOTAL_STEPS_TO_GOAL) {
    // Exact roll required to reach goal
    return { canMove: false, nextPosition: piece.position, nextStepCount: piece.stepCount, reachesGoal: false };
  }

  if (targetStep === TOTAL_STEPS_TO_GOAL) {
    return {
      canMove: true,
      nextPosition: 56, // Home Goal
      nextStepCount: TOTAL_STEPS_TO_GOAL,
      reachesGoal: true,
    };
  }

  if (targetStep <= 51) {
    // On main outer track (0..51)
    const mainPos = (START_POSITIONS[playerColor] + targetStep - 1) % 52;
    return {
      canMove: true,
      nextPosition: mainPos,
      nextStepCount: targetStep,
      reachesGoal: false,
    };
  }

  // In home stretch (steps 52..56 -> positions 52..56)
  const homePos = 52 + (targetStep - 52);
  return {
    canMove: true,
    nextPosition: homePos,
    nextStepCount: targetStep,
    reachesGoal: false,
  };
}

/**
 * Returns array of piece IDs that can legally move with the given dice roll.
 */
export function getValidMoves(
  player: PlayerInfo,
  diceValue: number,
  fastMode: boolean = false
): number[] {
  const validIds: number[] = [];

  player.pieces.forEach((piece) => {
    const { canMove } = calculateNextPosition(piece, diceValue, player.color, fastMode);
    if (canMove) {
      validIds.push(piece.id);
    }
  });

  return validIds;
}

/**
 * Checks if a specific tile is a safe zone (Baobab tree / Star).
 */
export function isSafeTile(position: number): boolean {
  if (position >= 52) return true; // Home stretch is safe
  return SAFE_POSITIONS.includes(position);
}

/**
 * Check if landing on a target position captures any opponent piece.
 */
export function checkCapture(
  targetPos: number,
  targetStep: number,
  movingColor: PlayerColor,
  players: PlayerInfo[]
): { capturedColor: PlayerColor; pieceId: number } | null {
  // Pieces in home stretch (targetStep >= 52) or on safe tiles cannot be captured
  if (targetStep >= 52 || isSafeTile(targetPos)) {
    return null;
  }

  for (const player of players) {
    if (player.color === movingColor) continue;
    // In team 2v2 mode, don't capture teammate
    const movingPlayer = players.find((p) => p.color === movingColor);
    if (movingPlayer?.teamId && player.teamId && movingPlayer.teamId === player.teamId) {
      continue;
    }

    for (const piece of player.pieces) {
      if (!piece.hasFinished && piece.position === targetPos && piece.stepCount <= 51) {
        if (piece.isShielded) continue; // Protected by Lion's Roar
        return { capturedColor: player.color, pieceId: piece.id };
      }
    }
  }

  return null;
}

/**
 * AI Decision Engine: Evaluates the best piece to move.
 * Supports Easy (random), Medium (capture & advance), Hard (threat avoidance + prioritization), Expert (full minimax heuristic).
 */
export function chooseAIMove(
  aiPlayer: PlayerInfo,
  diceValue: number,
  gameState: GameState,
  difficulty: AIDifficulty = 'medium'
): number | null {
  const validMoves = getValidMoves(aiPlayer, diceValue, gameState.settings.fastMode);
  if (validMoves.length === 0) return null;
  if (validMoves.length === 1) return validMoves[0];

  // 1. Easy: Random choice
  if (difficulty === 'easy') {
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
  }

  // 2. Score each move based on heuristics
  let bestPieceId = validMoves[0];
  let highestScore = -Infinity;

  for (const pieceId of validMoves) {
    const piece = aiPlayer.pieces.find((p) => p.id === pieceId)!;
    const { nextPosition, nextStepCount, reachesGoal } = calculateNextPosition(
      piece,
      diceValue,
      aiPlayer.color,
      gameState.settings.fastMode
    );

    let score = 0;

    // A. Goal finish is top priority
    if (reachesGoal) {
      score += 1000;
    }

    // B. Reaching home stretch (safe from captures)
    if (nextStepCount >= 52 && piece.stepCount < 52) {
      score += 350;
    }

    // C. Capturing opponent piece
    const capture = checkCapture(nextPosition, nextStepCount, aiPlayer.color, gameState.players);
    if (capture) {
      const capturedPlayer = gameState.players.find((p) => p.color === capture.capturedColor);
      const capturedPiece = capturedPlayer?.pieces.find((p) => p.id === capture.pieceId);
      const victimProgress = capturedPiece?.stepCount || 10;
      // High score for capturing, even higher if opponent was close to home!
      score += 500 + victimProgress * 8;
    }

    // D. Leaving the yard (Opening a new token)
    if (piece.position === -1 && nextPosition !== -1) {
      const activePiecesOnTrack = aiPlayer.pieces.filter((p) => p.position !== -1 && !p.hasFinished).length;
      if (activePiecesOnTrack === 0) {
        score += 400; // Crucial to have at least 1 piece out
      } else if (activePiecesOnTrack < 3) {
        score += 220;
      } else {
        score += 80;
      }
    }

    // E. Reaching a Safe Baobab Star
    if (isSafeTile(nextPosition)) {
      score += 120;
    }

    // F. Threat Analysis (Hard & Expert): Avoid being vulnerable
    if (difficulty === 'hard' || difficulty === 'expert') {
      // Is current piece currently under threat?
      const isCurrentlyThreatened = checkIsUnderThreat(piece, aiPlayer.color, gameState.players);
      if (isCurrentlyThreatened && !isSafeTile(piece.position)) {
        score += 180; // Escape threat
      }

      // Will next position be under threat?
      const willBeThreatened = checkPositionThreat(nextPosition, nextStepCount, aiPlayer.color, gameState.players);
      if (willBeThreatened && !isSafeTile(nextPosition)) {
        score -= 200; // Danger penalty
      }

      // Expert heuristic: prefer advancing furthest piece unless opening yard
      if (difficulty === 'expert') {
        score += nextStepCount * 3;
      }
    } else {
      // Medium: general progress bonus
      score += nextStepCount * 2;
    }

    if (score > highestScore) {
      highestScore = score;
      bestPieceId = pieceId;
    }
  }

  return bestPieceId;
}

/**
 * Checks if a specific piece is currently within striking distance (1..6 tiles) of an opponent.
 */
function checkIsUnderThreat(piece: PieceState, playerColor: PlayerColor, players: PlayerInfo[]): boolean {
  if (piece.position === -1 || piece.hasFinished || piece.stepCount >= 52 || isSafeTile(piece.position)) {
    return false;
  }

  for (const enemy of players) {
    if (enemy.color === playerColor) continue;
    for (const enemyPiece of enemy.pieces) {
      if (enemyPiece.position === -1 || enemyPiece.hasFinished || enemyPiece.stepCount >= 52) continue;
      // Distance behind
      const distance = (piece.position - enemyPiece.position + 52) % 52;
      if (distance >= 1 && distance <= 6) {
        return true;
      }
    }
  }
  return false;
}

function checkPositionThreat(
  pos: number,
  stepCount: number,
  playerColor: PlayerColor,
  players: PlayerInfo[]
): boolean {
  if (stepCount >= 52 || isSafeTile(pos)) return false;

  for (const enemy of players) {
    if (enemy.color === playerColor) continue;
    for (const enemyPiece of enemy.pieces) {
      if (enemyPiece.position === -1 || enemyPiece.hasFinished || enemyPiece.stepCount >= 52) continue;
      const distance = (pos - enemyPiece.position + 52) % 52;
      if (distance >= 1 && distance <= 6) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Create initial player state
 */
export function createPlayer(
  id: string,
  name: string,
  color: PlayerColor,
  beast: BeastType,
  isAI: boolean = false,
  aiDifficulty: AIDifficulty = 'medium',
  teamId?: 1 | 2
): PlayerInfo {
  return {
    id,
    name,
    color,
    beast,
    avatar: getBeastAvatar(beast),
    isAI,
    aiDifficulty,
    elo: isAI ? getAIDefaultElo(aiDifficulty) : 1200,
    rankTitle: isAI ? `Guardian of ${beast}` : 'Savannah Scout',
    mana: 50,
    maxMana: 100,
    abilityCooldown: 0,
    teamId,
    score: 0,
    consecutiveSixes: 0,
    pieces: [
      { id: 0, color, position: -1, stepCount: 0, isSafe: true, isShielded: false, hasFinished: false },
      { id: 1, color, position: -1, stepCount: 0, isSafe: true, isShielded: false, hasFinished: false },
      { id: 2, color, position: -1, stepCount: 0, isSafe: true, isShielded: false, hasFinished: false },
      { id: 3, color, position: -1, stepCount: 0, isSafe: true, isShielded: false, hasFinished: false },
    ],
  };
}

export function getBeastAvatar(beast: BeastType): string {
  switch (beast) {
    case 'lion': return '🦁';
    case 'elephant': return '🐘';
    case 'cheetah': return '🐆';
    case 'zebra': return '🦓';
    case 'giraffe': return '🦒';
    case 'rhino': return '🦏';
    default: return '🦁';
  }
}

export function getAIDefaultElo(difficulty: AIDifficulty): number {
  switch (difficulty) {
    case 'easy': return 950;
    case 'medium': return 1250;
    case 'hard': return 1550;
    case 'expert': return 1950;
  }
}

export function getRankBadge(elo: number): { title: string; icon: string; tierColor: string } {
  if (elo >= 2000) return { title: 'Grandmaster Lion', icon: '👑', tierColor: '#F59E0B' };
  if (elo >= 1700) return { title: 'Savannah Warlord', icon: '💎', tierColor: '#8B5CF6' };
  if (elo >= 1450) return { title: 'Tribal Chieftain', icon: '🔥', tierColor: '#EF4444' };
  if (elo >= 1250) return { title: 'Pride Hunter', icon: '⚔️', tierColor: '#3B82F6' };
  if (elo >= 1050) return { title: 'Plains Stalker', icon: '🌿', tierColor: '#10B981' };
  return { title: 'Savannah Scout', icon: '🌱', tierColor: '#9CA3AF' };
}
