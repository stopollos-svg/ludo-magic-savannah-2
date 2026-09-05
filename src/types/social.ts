/**
 * Ludo Magic Savannah - Social, Clan, Chat & Tournament Types
 */

export interface ClanInfo {
  id: string;
  name: string;
  badgeIcon: string;
  motto: string;
  level: number;
  membersCount: number;
  maxMembers: number;
  totalTrophies: number;
  requiredElo: number;
  leaderName: string;
  isRecruiting: boolean;
  perks: string[];
}

export interface FriendEntry {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'in_game' | 'offline';
  elo: number;
  rankTitle: string;
  lastSeen: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderColor?: string;
  clanName?: string;
  text: string;
  isEmote?: boolean;
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  avatar: string;
  guardian: string;
  clanName?: string;
  elo: number;
  wins: number;
  winRate: number;
  badge: string;
}

export interface TournamentMatch {
  id: string;
  round: 'quarter' | 'semi' | 'final';
  player1: { id: string; name: string; avatar: string; score?: number };
  player2: { id: string; name: string; avatar: string; score?: number };
  winnerId?: string;
  status: 'upcoming' | 'live' | 'completed';
}
