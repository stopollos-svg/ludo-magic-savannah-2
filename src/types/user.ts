/**
 * Ludo Magic Savannah - User, Cosmetics & Season Types
 */

import { BeastType, BoardAmbiance } from './game';

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  gems: number;
  beastGuardian: BeastType;
  equippedBoardTheme: string;
  equippedDiceSkin: string;
  equippedPieceSkin: string;
  equippedTrail: string;
  stats: {
    gamesPlayed: number;
    wins: number;
    winRate: number;
    captures: number;
    sixesRolled: number;
    magicSpellsCast: number;
    highestRank: string;
    currentElo: number;
    seasonPoints: number;
  };
  isGuest: boolean;
  clanId?: string;
  clanName?: string;
  clanRole?: 'member' | 'elder' | 'leader';
}

export interface CosmeticItem {
  id: string;
  name: string;
  category: 'piece_skin' | 'board_theme' | 'dice_skin' | 'trail' | 'emote';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  priceCoins?: number;
  priceGems?: number;
  unlocked: boolean;
  previewIcon: string;
  description: string;
  themeAmbiance?: BoardAmbiance;
}

export interface SeasonPassTier {
  tier: number;
  requiredSeasonXp: number;
  freeReward: {
    type: 'coins' | 'gems' | 'cosmetic';
    amount?: number;
    item?: CosmeticItem;
  };
  premiumReward: {
    type: 'coins' | 'gems' | 'cosmetic';
    amount?: number;
    item?: CosmeticItem;
  };
  isFreeClaimed: boolean;
  isPremiumClaimed: boolean;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  rewardCoins: number;
  rewardXp: number;
  completed: boolean;
  claimed: boolean;
}
