-- ============================================================
-- EMBER — Full Database Schema
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- Enable PostGIS for geospatial event queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ── updated_at trigger function (reused by all tables) ────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id                uuid        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username          text        UNIQUE NOT NULL,
  email             text        NOT NULL,
  full_name         text,
  bio               text,
  profile_image_url text,
  city              text,
  country           text,
  lat               double precision,
  lng               double precision,
  vault_member      boolean     DEFAULT false NOT NULL,
  board_rank        text        DEFAULT 'Ember' NOT NULL,
  events_hosted     integer     DEFAULT 0 NOT NULL,
  followers_count   integer     DEFAULT 0 NOT NULL,
  following_count   integer     DEFAULT 0 NOT NULL,
  created_at        timestamptz DEFAULT now() NOT NULL,
  updated_at        timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_username    ON public.users (username);
CREATE INDEX IF NOT EXISTS idx_users_city        ON public.users (city);
CREATE INDEX IF NOT EXISTS idx_users_country     ON public.users (country);
CREATE INDEX IF NOT EXISTS idx_users_vault       ON public.users (vault_member);
CREATE INDEX IF NOT EXISTS idx_users_board_rank  ON public.users (board_rank);

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.users FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- FOLLOWS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id  uuid        REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  following_id uuid        REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at   timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower  ON public.follows (follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows (following_id);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Follows are viewable by everyone"
  ON public.follows FOR SELECT USING (true);

CREATE POLICY "Authenticated users can follow"
  ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.events (
  id                   uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  title                text        NOT NULL,
  description          text,
  host_id              uuid        REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  location_name        text,
  address              text,
  city                 text,
  country              text,
  location             geography(POINT, 4326),
  date_time            timestamptz NOT NULL,
  end_time             timestamptz,
  max_participants     integer     DEFAULT 20 NOT NULL,
  current_participants integer     DEFAULT 1 NOT NULL,
  is_private           boolean     DEFAULT false NOT NULL,
  cover_color          text        DEFAULT '#800000',
  status               text        DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
  created_at           timestamptz DEFAULT now() NOT NULL,
  updated_at           timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_location ON public.events USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_events_date     ON public.events (date_time);
CREATE INDEX IF NOT EXISTS idx_events_host     ON public.events (host_id);
CREATE INDEX IF NOT EXISTS idx_events_status   ON public.events (status);
CREATE INDEX IF NOT EXISTS idx_events_city     ON public.events (city);

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public events are viewable by everyone"
  ON public.events FOR SELECT
  USING (is_private = false OR auth.uid() IN (
    SELECT user_id FROM public.event_participants WHERE event_id = id
  ));

CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their events"
  ON public.events FOR UPDATE
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their events"
  ON public.events FOR DELETE
  USING (auth.uid() = host_id);

-- ============================================================
-- EVENT PARTICIPANTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.event_participants (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id   uuid        REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id    uuid        REFERENCES public.users(id)  ON DELETE CASCADE NOT NULL,
  role       text        DEFAULT 'attendee' CHECK (role IN ('host', 'attendee')),
  status     text        DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'declined')),
  joined_at  timestamptz DEFAULT now() NOT NULL,
  UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_participants_event ON public.event_participants (event_id);
CREATE INDEX IF NOT EXISTS idx_participants_user  ON public.event_participants (user_id);

ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view participants"
  ON public.event_participants FOR SELECT USING (true);

CREATE POLICY "Authenticated users can join events"
  ON public.event_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave events"
  ON public.event_participants FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- CONTRIBUTIONS (who's bringing what)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contributions (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id   uuid        REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id    uuid        REFERENCES public.users(id)  ON DELETE CASCADE NOT NULL,
  item_name  text        NOT NULL,
  quantity   text,
  likes      integer     DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contributions_event ON public.contributions (event_id);

ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view contributions"
  ON public.contributions FOR SELECT USING (true);

CREATE POLICY "Participants can add contributions"
  ON public.contributions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own contributions"
  ON public.contributions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- MESSAGES (event group chat)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id   uuid        REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id    uuid        REFERENCES public.users(id)  ON DELETE CASCADE NOT NULL,
  content    text        NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_event      ON public.messages (event_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages (created_at);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view messages"
  ON public.messages FOR SELECT USING (true);

CREATE POLICY "Participants can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- POSTS (social feed)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.posts (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        uuid        REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  event_id       uuid        REFERENCES public.events(id) ON DELETE SET NULL,
  caption        text,
  image_url      text,
  likes_count    integer     DEFAULT 0 NOT NULL,
  comments_count integer     DEFAULT 0 NOT NULL,
  created_at     timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_posts_user       ON public.posts (user_id);
CREATE INDEX IF NOT EXISTS idx_posts_event      ON public.posts (event_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts (created_at DESC);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view posts"
  ON public.posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can post"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- POST LIKES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.post_likes (
  user_id    uuid        REFERENCES public.users(id) ON DELETE CASCADE,
  post_id    uuid        REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, post_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
  ON public.post_likes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like"
  ON public.post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike"
  ON public.post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- VAULT RECIPES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vault_recipes (
  id                 uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  submitted_by       uuid        REFERENCES public.users(id) ON DELETE SET NULL,
  title              text        NOT NULL,
  description        text,
  ingredients        text,
  instructions       text,
  prep_time_minutes  integer,
  serves             integer,
  approved           boolean     DEFAULT false NOT NULL,
  created_at         timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.vault_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vault members can view approved recipes"
  ON public.vault_recipes FOR SELECT
  USING (approved = true);

CREATE POLICY "Authenticated users can submit recipes"
  ON public.vault_recipes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- COUNCIL VOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.council_votes (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  question   text        NOT NULL,
  options    jsonb       NOT NULL,
  ends_at    timestamptz NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.council_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view council votes"
  ON public.council_votes FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.council_vote_responses (
  user_id         uuid        REFERENCES public.users(id) ON DELETE CASCADE,
  vote_id         uuid        REFERENCES public.council_votes(id) ON DELETE CASCADE,
  selected_option text        NOT NULL,
  voted_at        timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, vote_id)
);

ALTER TABLE public.council_vote_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vault members can vote"
  ON public.council_vote_responses FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view vote responses"
  ON public.council_vote_responses FOR SELECT USING (true);

-- ============================================================
-- PARTNER APPLICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.partner_applications (
  id                    uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name          text        NOT NULL,
  owner_name            text        NOT NULL,
  email                 text        NOT NULL,
  phone                 text,
  country               text,
  city                  text,
  website               text,
  business_type         text,
  years_in_business     text,
  ships_internationally text,
  why_ember             text,
  unique_offering       text,
  awards                text,
  partnership_type      text,
  member_discount       text,
  additional_info       text,
  status                text        DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at          timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a partner application"
  ON public.partner_applications FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- PostGIS RPC — nearby events
-- Call via supabaseAdmin.rpc('get_nearby_events', {...})
-- ============================================================
CREATE OR REPLACE FUNCTION get_nearby_events(
  user_lat     double precision,
  user_lng     double precision,
  radius_km    double precision DEFAULT 50,
  result_limit integer          DEFAULT 20,
  result_offset integer         DEFAULT 0
)
RETURNS TABLE (
  id                   uuid,
  title                text,
  description          text,
  host_id              uuid,
  location_name        text,
  address              text,
  city                 text,
  country              text,
  date_time            timestamptz,
  end_time             timestamptz,
  max_participants     integer,
  current_participants integer,
  is_private           boolean,
  cover_color          text,
  status               text,
  created_at           timestamptz,
  distance_km          double precision
)
LANGUAGE sql STABLE AS $$
  SELECT
    e.id, e.title, e.description, e.host_id,
    e.location_name, e.address, e.city, e.country,
    e.date_time, e.end_time,
    e.max_participants, e.current_participants,
    e.is_private, e.cover_color, e.status, e.created_at,
    ST_Distance(
      e.location::geography,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) / 1000 AS distance_km
  FROM public.events e
  WHERE
    e.is_private = false
    AND e.status = 'upcoming'
    AND e.location IS NOT NULL
    AND ST_DWithin(
      e.location::geography,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      radius_km * 1000
    )
  ORDER BY distance_km ASC, e.date_time ASC
  LIMIT result_limit
  OFFSET result_offset;
$$;

-- ============================================================
-- Seed: insert a test council vote so The Council tab works
-- ============================================================
INSERT INTO public.council_votes (question, options, ends_at)
VALUES
  (
    'Which city should host the next Brotherhood meetup?',
    '["Berlin", "Lagos", "Buenos Aires"]',
    NOW() + INTERVAL '7 days'
  ),
  (
    'Should Ember add a monthly Fire Drop ingredient box for members?',
    '["Yes, build it", "Not yet"]',
    NOW() + INTERVAL '14 days'
  )
ON CONFLICT DO NOTHING;
