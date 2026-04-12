-- ================================================================
-- EMBER BBQ APP — Phase 2 Schema (Events + Social + Geospatial)
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ================================================================

-- ── Events ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.events (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title               text NOT NULL,
  description         text,
  host_id             uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  location_name       text,
  address             text,
  city                text,
  country             text,
  location            geography(POINT, 4326),
  date_time           timestamptz NOT NULL,
  end_time            timestamptz,
  max_participants    integer DEFAULT 20,
  current_participants integer DEFAULT 1,
  is_private          boolean DEFAULT false,
  cover_color         text DEFAULT '#800000',
  status              text DEFAULT 'upcoming' CHECK (status IN ('upcoming','live','completed','cancelled')),
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

-- ── Event Participants ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.event_participants (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id   uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id    uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  role       text DEFAULT 'attendee' CHECK (role IN ('host','attendee')),
  status     text DEFAULT 'confirmed' CHECK (status IN ('confirmed','pending','declined')),
  joined_at  timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- ── Contributions (what guests bring) ────────────────────────────
CREATE TABLE IF NOT EXISTS public.contributions (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id   uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id    uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  item_name  text NOT NULL,
  quantity   text,
  likes      integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ── Messages (event chat) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id   uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id    uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content    text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ── Feed Posts ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.posts (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  event_id       uuid REFERENCES public.events(id) ON DELETE SET NULL,
  caption        text,
  image_url      text,
  likes_count    integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at     timestamptz DEFAULT now()
);

-- ── Post Likes ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.post_likes (
  user_id    uuid REFERENCES public.users(id) ON DELETE CASCADE,
  post_id    uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

-- ── Vault Recipes ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.vault_recipes (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  submitted_by        uuid REFERENCES public.users(id) ON DELETE SET NULL,
  title               text NOT NULL,
  description         text,
  ingredients         text,
  instructions        text,
  prep_time_minutes   integer,
  serves              integer,
  approved            boolean DEFAULT false,
  created_at          timestamptz DEFAULT now()
);

-- ── Council Votes ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.council_votes (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question   text NOT NULL,
  options    jsonb NOT NULL,
  ends_at    timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.council_vote_responses (
  user_id         uuid REFERENCES public.users(id) ON DELETE CASCADE,
  vote_id         uuid REFERENCES public.council_votes(id) ON DELETE CASCADE,
  selected_option text NOT NULL,
  voted_at        timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, vote_id)
);

-- ── Partner Applications ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.partner_applications (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name        text NOT NULL,
  owner_name          text NOT NULL,
  email               text NOT NULL,
  phone               text,
  country             text,
  city                text,
  website             text,
  business_type       text,
  years_in_business   text,
  ships_internationally text,
  monthly_orders      text,
  why_ember           text,
  unique_offering     text,
  chef_collaborations text,
  awards              text,
  partnership_type    text,
  member_discount     text,
  additional_info     text,
  status              text DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  submitted_at        timestamptz DEFAULT now()
);

-- ── Indexes ──────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_events_location    ON public.events USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_events_date        ON public.events (date_time);
CREATE INDEX IF NOT EXISTS idx_events_host        ON public.events (host_id);
CREATE INDEX IF NOT EXISTS idx_events_status      ON public.events (status);
CREATE INDEX IF NOT EXISTS idx_participants_event ON public.event_participants (event_id);
CREATE INDEX IF NOT EXISTS idx_participants_user  ON public.event_participants (user_id);
CREATE INDEX IF NOT EXISTS idx_messages_event     ON public.messages (event_id);
CREATE INDEX IF NOT EXISTS idx_posts_user         ON public.posts (user_id);

-- ── RLS on all new tables ────────────────────────────────────────
ALTER TABLE public.events                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_recipes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.council_votes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.council_vote_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_applications   ENABLE ROW LEVEL SECURITY;

-- ── RLS Policies ─────────────────────────────────────────────────
-- Events
CREATE POLICY "Public events viewable by everyone"
  ON public.events FOR SELECT
  USING (is_private = false OR auth.uid()::text IN (
    SELECT user_id::text FROM public.event_participants WHERE event_id = id
  ));

CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT WITH CHECK (auth.uid()::text = host_id::text);

CREATE POLICY "Hosts can update their events"
  ON public.events FOR UPDATE USING (auth.uid()::text = host_id::text);

CREATE POLICY "Hosts can delete their events"
  ON public.events FOR DELETE USING (auth.uid()::text = host_id::text);

-- Participants
CREATE POLICY "Anyone can view participants"
  ON public.event_participants FOR SELECT USING (true);

CREATE POLICY "Authenticated users can join events"
  ON public.event_participants FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can leave events"
  ON public.event_participants FOR DELETE USING (auth.uid()::text = user_id::text);

-- Contributions
CREATE POLICY "Anyone can view contributions"
  ON public.contributions FOR SELECT USING (true);

CREATE POLICY "Participants can add contributions"
  ON public.contributions FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own contributions"
  ON public.contributions FOR DELETE USING (auth.uid()::text = user_id::text);

-- Messages
CREATE POLICY "Participants can view messages"
  ON public.messages FOR SELECT USING (true);

CREATE POLICY "Participants can send messages"
  ON public.messages FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Posts
CREATE POLICY "Anyone can view posts"
  ON public.posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can post"
  ON public.posts FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE USING (auth.uid()::text = user_id::text);

-- Post Likes
CREATE POLICY "Anyone can view likes"
  ON public.post_likes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like"
  ON public.post_likes FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can unlike"
  ON public.post_likes FOR DELETE USING (auth.uid()::text = user_id::text);

-- Vault Recipes
CREATE POLICY "Anyone can view approved recipes"
  ON public.vault_recipes FOR SELECT USING (approved = true);

CREATE POLICY "Authenticated users can submit recipes"
  ON public.vault_recipes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Council Votes
CREATE POLICY "Anyone can view council votes"
  ON public.council_votes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote"
  ON public.council_vote_responses FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view vote responses"
  ON public.council_vote_responses FOR SELECT USING (true);

-- Partner Applications
CREATE POLICY "Anyone can submit partner application"
  ON public.partner_applications FOR INSERT WITH CHECK (true);

-- ── Updated_at trigger for events ────────────────────────────────
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
