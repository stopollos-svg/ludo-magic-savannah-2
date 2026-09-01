/**
 * Ludo Magic Savannah - Real-Time Multiplayer, Matchmaking & Supabase Channels
 */

import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';
import { GameState, MoveAction, PlayerColor, PlayerInfo } from '../types/game';
import { ChatMessage } from '../types/social';

export interface RoomParticipant {
  userId: string;
  username: string;
  avatar: string;
  color: PlayerColor;
  isReady: boolean;
  ping: number;
}

export type MultiplayerEventCallback = (payload: {
  type: 'game_state_update' | 'dice_rolled' | 'piece_moved' | 'spell_cast' | 'chat_message' | 'player_joined' | 'player_left';
  data: unknown;
}) => void;

class MultiplayerService {
  private activeChannel: ReturnType<ReturnType<typeof getSupabaseClient>['channel']> | null = null;
  private currentRoomCode: string | null = null;
  private eventListeners: Set<MultiplayerEventCallback> = new Set();
  private matchmakingTimer: number | null = null;

  public subscribe(callback: MultiplayerEventCallback) {
    this.eventListeners.add(callback);
    return () => {
      this.eventListeners.delete(callback);
    };
  }

  private notify(payload: {
    type: 'game_state_update' | 'dice_rolled' | 'piece_moved' | 'spell_cast' | 'chat_message' | 'player_joined' | 'player_left';
    data: unknown;
  }) {
    this.eventListeners.forEach((cb) => cb(payload));
  }

  // --- Real-time Room Connection ---
  public async joinRoom(roomCode: string, user: { id: string; username: string; avatar: string }) {
    this.leaveRoom();
    this.currentRoomCode = roomCode;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      const channel = supabase.channel(`ludo_room_${roomCode}`, {
        config: {
          presence: { key: user.id },
          broadcast: { self: false },
        },
      });

      channel
        .on('broadcast', { event: 'game_action' }, (payload) => {
          this.notify(payload.payload);
        })
        .on('presence', { event: 'sync' }, () => {
          const presenceState = channel.presenceState();
          this.notify({ type: 'player_joined', data: presenceState });
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              user_id: user.id,
              username: user.username,
              avatar: user.avatar,
              joined_at: new Date().toISOString(),
            });
          }
        });

      this.activeChannel = channel;
    }
  }

  public broadcastAction(type: 'dice_rolled' | 'piece_moved' | 'spell_cast' | 'game_state_update' | 'chat_message', data: unknown) {
    if (this.activeChannel) {
      this.activeChannel.send({
        type: 'broadcast',
        event: 'game_action',
        payload: { type, data },
      });
    }
    // Also notify local listeners
    this.notify({ type, data });
  }

  public leaveRoom() {
    if (this.activeChannel) {
      this.activeChannel.unsubscribe();
      this.activeChannel = null;
    }
    this.currentRoomCode = null;
  }

  // --- Matchmaking Queue (Ranked / Quick Match) ---
  public startMatchmaking(
    player: PlayerInfo,
    onMatchFound: (opponentList: PlayerInfo[]) => void,
    onQueueTick?: (secondsInQueue: number) => void
  ) {
    let queueSeconds = 0;
    const interval = window.setInterval(() => {
      queueSeconds += 1;
      onQueueTick?.(queueSeconds);
    }, 1000);

    // Realistic matchmaking finding peer or AI fill within 4-7 seconds
    const matchDelay = 3500 + Math.random() * 3000;
    this.matchmakingTimer = window.setTimeout(() => {
      clearInterval(interval);
      const generatedOpponents: PlayerInfo[] = [
        {
          id: 'matched_p2',
          name: 'Kibo Hunter',
          color: 'green',
          beast: 'elephant',
          avatar: '🐘',
          isAI: true,
          aiDifficulty: 'hard',
          elo: Math.max(900, player.elo + Math.floor((Math.random() - 0.5) * 80)),
          rankTitle: 'Plains Stalker',
          mana: 50,
          maxMana: 100,
          abilityCooldown: 0,
          score: 0,
          consecutiveSixes: 0,
          pieces: [
            { id: 0, color: 'green', position: -1, stepCount: 0, isSafe: true, isShielded: false, hasFinished: false },
            { id: 1, color: 'green', position: -1, stepCount: 0, isSafe: true, isShielded: false, hasFinished: false },
            { id: 2, color: 'green', position: -1, stepCount: 0, isSafe: true, isShielded: false, hasFinished: false },
            { id: 3, color: 'green', position: -1, stepCount: 0, isSafe: true, isShielded: false, hasFinished: false },
          ],
        },
        {
          id: 'matched_p3',
          name: 'Zuri Pride',
          color: 'yellow',
          beast: 'cheetah',
          avatar: '🐆',
          isAI: true,
          aiDifficulty: 'expert',
          elo: Math.max(900, player.elo + Math.floor((Math.random() - 0.5) * 100)),
          rankTitle: 'Pride Hunter',
          mana: 50,
          maxMana: 100,
          abilityCooldown: 0,
          score: 0,
          consecutiveSixes: 0,
          pieces: [
            { id: 0, color: 'yellow', position: -1, stepCount: 0, isSafe: true, isShielded: false, hasFinished: false },
            { id: 1, color: 'yellow', position: -1, stepCount: 0, isSafe: true, isShielded: false, hasFinished: false },
            { id: 2, color: 'yellow', position: -1, stepCount: 0, isSafe: true, isShielded: false, hasFinished: false },
            { id: 3, color: 'yellow', position: -1, stepCount: 0, isSafe: true, isShielded: false, hasFinished: false },
          ],
        },
        {
          id: 'matched_p4',
          name: 'Simba Storm',
          color: 'blue',
          beast: 'zebra',
          avatar: '🦓',
          isAI: true,
          aiDifficulty: 'hard',
          elo: Math.max(900, player.elo + Math.floor((Math.random() - 0.5) * 60)),
          rankTitle: 'Plains Stalker',
          mana: 50,
          maxMana: 100,
          abilityCooldown: 0,
          score: 0,
          consecutiveSixes: 0,
          pieces: [
            { id: 0, color: 'blue', position: -1, stepCount: 0, isSafe: true, isShielded: false, hasFinished: false },
            { id: 1, color: 'blue', position: -1, stepCount: 0, isSafe: true, isShielded: false, hasFinished: false },
            { id: 2, color: 'blue', position: -1, stepCount: 0, isSafe: true, isShielded: false, hasFinished: false },
            { id: 3, color: 'blue', position: -1, stepCount: 0, isSafe: true, isShielded: false, hasFinished: false },
          ],
        },
      ];

      onMatchFound(generatedOpponents);
    }, matchDelay);

    return () => {
      clearInterval(interval);
      if (this.matchmakingTimer) {
        clearTimeout(this.matchmakingTimer);
        this.matchmakingTimer = null;
      }
    };
  }

  public cancelMatchmaking() {
    if (this.matchmakingTimer) {
      clearTimeout(this.matchmakingTimer);
      this.matchmakingTimer = null;
    }
  }
}

export const multiplayerService = new MultiplayerService();
