create extension if not exists "pgcrypto";

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone_number text not null,
  notes text
);

create table if not exists public.event_settings (
  id int primary key default 1 check (id = 1),
  couple_names text not null,
  engagement_title text not null,
  event_date text not null,
  event_time text not null,
  venue_name text not null,
  address text not null,
  map_link text not null,
  dress_code text not null,
  hero_tagline text not null,
  countdown_target text not null,
  gallery_images jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;
alter table public.event_settings enable row level security;

drop policy if exists "Allow anonymous inserts to rsvps" on public.rsvps;
drop policy if exists "Allow anonymous select to rsvps" on public.rsvps;
drop policy if exists "Allow public inserts to rsvps" on public.rsvps;
drop policy if exists "Allow public select to rsvps" on public.rsvps;
drop policy if exists "Allow public read event settings" on public.event_settings;
drop policy if exists "Allow public update event settings" on public.event_settings;

create policy "Allow public inserts to rsvps"
on public.rsvps
for insert
to public
with check (true);

-- Needed for client-side admin panel at /admin.
-- For stronger security, replace this with authenticated-only access.
create policy "Allow public select to rsvps"
on public.rsvps
for select
to public
using (true);

create policy "Allow public read event settings"
on public.event_settings
for select
to public
using (true);

create policy "Allow public update event settings"
on public.event_settings
for all
to public
using (true)
with check (true);

insert into public.event_settings (
  id,
  couple_names,
  engagement_title,
  event_date,
  event_time,
  venue_name,
  address,
  map_link,
  dress_code,
  hero_tagline,
  countdown_target,
  gallery_images,
  faq
)
values (
  1,
  'Sandra & Mark',
  'We Are Getting Engaged',
  'Saturday, May 23, 2026',
  '4:00 PM onwards',
  'Smokery Katameya Heights',
  'Katameya Heights, Cairo, Egypt',
  'https://maps.app.goo.gl/HZBVYKjERkU9NNDz6',
  'Elegant Semi-Formal',
  'Join us for an evening of love, laughter, and celebration as we begin this beautiful chapter together.',
  '2026-05-23T16:00:00',
  '[
    {"src":"https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80","alt":"Couple holding hands with sunset backdrop"},
    {"src":"https://images.unsplash.com/photo-1494955870715-979ca4f13bf0?auto=format&fit=crop&w=1200&q=80","alt":"Romantic engagement portrait outdoors"},
    {"src":"https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80","alt":"Champagne glasses on celebration table"}
  ]'::jsonb,
  '[
    {"question":"Is parking available at the venue?","answer":"Yes, complimentary valet parking is available for all guests."},
    {"question":"What should I wear?","answer":"We suggest elegant semi-formal attire in soft tones to match the evening ambiance."}
  ]'::jsonb
)
on conflict (id) do nothing;
