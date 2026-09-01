/**
 * Ludo Magic Savannah - Precise 15x15 Board Grid Coordinates
 */

import { PlayerColor } from '../types/game';

export interface GridCoord {
  col: number;
  row: number;
}

// 52 Main Path Tiles (0..51)
export const MAIN_PATH_COORDS: GridCoord[] = [
  { col: 1, row: 6 },  // 0: Red Start (Star)
  { col: 2, row: 6 },  // 1
  { col: 3, row: 6 },  // 2
  { col: 4, row: 6 },  // 3
  { col: 5, row: 6 },  // 4
  { col: 6, row: 5 },  // 5
  { col: 6, row: 4 },  // 6
  { col: 6, row: 3 },  // 7
  { col: 6, row: 2 },  // 8 (Star)
  { col: 6, row: 1 },  // 9
  { col: 6, row: 0 },  // 10
  { col: 7, row: 0 },  // 11
  { col: 8, row: 0 },  // 12
  { col: 8, row: 1 },  // 13: Green Start (Star)
  { col: 8, row: 2 },  // 14
  { col: 8, row: 3 },  // 15
  { col: 8, row: 4 },  // 16
  { col: 8, row: 5 },  // 17
  { col: 9, row: 6 },  // 18
  { col: 10, row: 6 }, // 19
  { col: 11, row: 6 }, // 20
  { col: 12, row: 6 }, // 21 (Star)
  { col: 13, row: 6 }, // 22
  { col: 14, row: 6 }, // 23
  { col: 14, row: 7 }, // 24
  { col: 14, row: 8 }, // 25
  { col: 13, row: 8 }, // 26: Yellow Start (Star)
  { col: 12, row: 8 }, // 27
  { col: 11, row: 8 }, // 28
  { col: 10, row: 8 }, // 29
  { col: 9, row: 8 },  // 30
  { col: 8, row: 9 },  // 31
  { col: 8, row: 10 }, // 32
  { col: 8, row: 11 }, // 33
  { col: 8, row: 12 }, // 34 (Star)
  { col: 8, row: 13 }, // 35
  { col: 8, row: 14 }, // 36
  { col: 7, row: 14 }, // 37
  { col: 6, row: 14 }, // 38
  { col: 6, row: 13 }, // 39: Blue Start (Star)
  { col: 6, row: 12 }, // 40
  { col: 6, row: 11 }, // 41
  { col: 6, row: 10 }, // 42
  { col: 6, row: 9 },  // 43
  { col: 5, row: 8 },  // 44
  { col: 4, row: 8 },  // 45
  { col: 3, row: 8 },  // 46
  { col: 2, row: 8 },  // 47 (Star)
  { col: 1, row: 8 },  // 48
  { col: 0, row: 8 },  // 49
  { col: 0, row: 7 },  // 50
  { col: 0, row: 6 },  // 51
];

// Color specific Home Stretch Lanes (indices 52..56 and Center Goal)
export const HOME_STRETCH_COORDS: Record<PlayerColor, GridCoord[]> = {
  red: [
    { col: 1, row: 7 }, // 52
    { col: 2, row: 7 }, // 53
    { col: 3, row: 7 }, // 54
    { col: 4, row: 7 }, // 55
    { col: 5, row: 7 }, // 56
    { col: 6.8, row: 7 }, // 57 Finish Center
  ],
  green: [
    { col: 7, row: 1 },
    { col: 7, row: 2 },
    { col: 7, row: 3 },
    { col: 7, row: 4 },
    { col: 7, row: 5 },
    { col: 7, row: 6.8 },
  ],
  yellow: [
    { col: 13, row: 7 },
    { col: 12, row: 7 },
    { col: 11, row: 7 },
    { col: 10, row: 7 },
    { col: 9, row: 7 },
    { col: 7.2, row: 7 },
  ],
  blue: [
    { col: 7, row: 13 },
    { col: 7, row: 12 },
    { col: 7, row: 11 },
    { col: 7, row: 10 },
    { col: 7, row: 9 },
    { col: 7, row: 7.2 },
  ],
};

// Yard Slots for unspawned tokens
export const YARD_SLOT_COORDS: Record<PlayerColor, GridCoord[]> = {
  red: [
    { col: 1.8, row: 1.8 },
    { col: 3.8, row: 1.8 },
    { col: 1.8, row: 3.8 },
    { col: 3.8, row: 3.8 },
  ],
  green: [
    { col: 10.8, row: 1.8 },
    { col: 12.8, row: 1.8 },
    { col: 10.8, row: 3.8 },
    { col: 12.8, row: 3.8 },
  ],
  yellow: [
    { col: 10.8, row: 10.8 },
    { col: 12.8, row: 10.8 },
    { col: 10.8, row: 12.8 },
    { col: 12.8, row: 12.8 },
  ],
  blue: [
    { col: 1.8, row: 10.8 },
    { col: 3.8, row: 10.8 },
    { col: 1.8, row: 12.8 },
    { col: 3.8, row: 12.8 },
  ],
};

/**
 * Returns exact percentage coordinates (left %, top %) on the 15x15 board.
 */
export function getPixelCoordinates(
  position: number,
  stepCount: number,
  color: PlayerColor,
  pieceId: number
): { leftPercent: number; topPercent: number } {
  const cellSize = 100 / 15; // 6.666%

  // 1. Piece in Yard
  if (position === -1 || stepCount === 0) {
    const yardCoord = YARD_SLOT_COORDS[color][pieceId] || { col: 2.5, row: 2.5 };
    return {
      leftPercent: yardCoord.col * cellSize + cellSize / 2,
      topPercent: yardCoord.row * cellSize + cellSize / 2,
    };
  }

  // 2. Goal Finished Piece
  if (stepCount >= 57) {
    const offsets: Record<PlayerColor, { dx: number; dy: number }> = {
      red: { dx: -0.8, dy: 0 },
      green: { dx: 0, dy: -0.8 },
      yellow: { dx: 0.8, dy: 0 },
      blue: { dx: 0, dy: 0.8 },
    };
    const offset = offsets[color];
    return {
      leftPercent: (7 + offset.dx) * cellSize + cellSize / 2,
      topPercent: (7 + offset.dy) * cellSize + cellSize / 2,
    };
  }

  // 3. Home Stretch (steps 52..56)
  if (stepCount >= 52) {
    const laneIndex = Math.min(4, stepCount - 52);
    const laneCoord = HOME_STRETCH_COORDS[color][laneIndex];
    return {
      leftPercent: laneCoord.col * cellSize + cellSize / 2,
      topPercent: laneCoord.row * cellSize + cellSize / 2,
    };
  }

  // 4. Main Track (0..51)
  const trackCoord = MAIN_PATH_COORDS[position % 52];
  return {
    leftPercent: trackCoord.col * cellSize + cellSize / 2,
    topPercent: trackCoord.row * cellSize + cellSize / 2,
  };
}
