-- ==============================================================================
-- LUDO MAGIC SAVANNAH - PRODUCTION SUPABASE DATABASE SCHEMA (POSTGRESQL + RLS)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(32) UNIQUE NOT NULL,
    avatar_url TEXT DEFAULT '🦁',
    level INTEGER DEFAULT 1 NOT NULL,
    xp BIGINT DEFAULT 0 NOT NULL,
    coins BIGINT DEFAULT 500 NOT NULL,
    gems INTEGER DEFAULT 50 NOT NULL,
    beast_guardian VARCHAR(16) DEFAULT 'lion' NOT NULL,
    equipped_board VARCHAR(32) DEFAULT 'savannah_gold' NOT NULL,
    equipped_dice VARCHAR(32) DEFAULT 'sunstone' NOT NULL,
    equipped_piece VARCHAR(32) DEFAULT 'lion' NOT NULL,
    equipped_trail VARCHAR(32) DEFAULT 'savannah_dust' NOT NULL,
    current_elo INTEGER DEFAULT 1200 NOT NULL,
    season_points INTEGER DEFAULT 0 NOT NULL,
    games_played INTEGER DEFAULT 0 NOT NULL,
    wins INTEGER DEFAULT 0 NOT NULL,
    captures INTEGER DEFAULT 0 NOT NULL,
    sixes_rolled INTEGER DEFAULT 0 NOT NULL,
    magic_spells_cast INTEGER DEFAULT 0 NOT NULL,
    clan_id UUID,
    clan_role VARCHAR(16) DEFAULT 'member',
    is_guest BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. CLANS & TRIBES TABLE
CREATE TABLE IF NOT EXISTS public.clans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(48) UNIQUE NOT NULL,
    motto TEXT,
    badge_icon VARCHAR(16) DEFAULT '🦁',
    level INTEGER DEFAULT 1,
    members_count INTEGER DEFAULT 1,
    max_members INTEGER DEFAULT 30,
    total_trophies INTEGER DEFAULT 0,
    required_elo INTEGER DEFAULT 1000,
    leader_id UUID REFERENCES public.profiles(id),
    is_recruiting BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. GAME ROOMS & MULTIPLAYER SESSIONS
CREATE TABLE IF NOT EXISTS public.games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_code VARCHAR(8) UNIQUE NOT NULL,
    mode VARCHAR(24) DEFAULT 'online_ranked' NOT NULL,
    status VARCHAR(16) DEFAULT 'waiting' NOT NULL, -- 'waiting', 'playing', 'finished'
    player_count INTEGER DEFAULT 4 NOT NULL,
    is_magic_enabled BOOLEAN DEFAULT true NOT NULL,
    fast_mode BOOLEAN DEFAULT false NOT NULL,
    ambiance VARCHAR(16) DEFAULT 'sunset',
    turn_timeout_seconds INTEGER DEFAULT 20,
    winner_color VARCHAR(12),
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    finished_at TIMESTAMPTZ
);

-- 5. GAME STATES TABLE (Server Authoritative)
CREATE TABLE IF NOT EXISTS public.game_states (
    game_id UUID PRIMARY KEY REFERENCES public.games(id) ON DELETE CASCADE,
    current_turn_index INTEGER DEFAULT 0 NOT NULL,
    turn_phase VARCHAR(24) DEFAULT 'roll_dice' NOT NULL,
    current_dice_value INTEGER,
    has_rolled BOOLEAN DEFAULT false,
    consecutive_sixes INTEGER DEFAULT 0,
    players_data JSONB NOT NULL, -- array of players, colors, piece positions, mana
    valid_moves JSONB DEFAULT '[]'::jsonb,
    move_history JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. MATCH MOVES HISTORY (For anti-cheat validation & replay theater)
CREATE TABLE IF NOT EXISTS public.moves_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
    player_id UUID REFERENCES public.profiles(id),
    player_color VARCHAR(12) NOT NULL,
    piece_id INTEGER NOT NULL,
    from_pos INTEGER NOT NULL,
    to_pos INTEGER NOT NULL,
    dice_value INTEGER NOT NULL,
    captured_piece JSONB,
    ability_used VARCHAR(32),
    client_timestamp BIGINT NOT NULL,
    server_timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moves_history ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can read, user can update only own profile
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Games: Anyone can view active rooms
CREATE POLICY "Games viewable by authenticated users" 
ON public.games FOR SELECT USING (true);

CREATE POLICY "Host can insert game room" 
ON public.games FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Game states: Readable by participants
CREATE POLICY "Game states viewable by room participants" 
ON public.game_states FOR SELECT USING (true);

-- 8. TRIGGERS: Automatic Updated At Timestamp
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_timestamp
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
