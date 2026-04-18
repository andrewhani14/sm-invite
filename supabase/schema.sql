create extension if not exists "pgcrypto";

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone_number text not null,
  notes text
);

-- Option A: quick local testing (least secure)
-- alter table public.rsvps disable row level security;

-- Option B: preferred for production
alter table public.rsvps enable row level security;

drop policy if exists "Allow anonymous inserts to rsvps" on public.rsvps;
drop policy if exists "Allow anonymous select to rsvps" on public.rsvps;
drop policy if exists "Allow public inserts to rsvps" on public.rsvps;
drop policy if exists "Allow public select to rsvps" on public.rsvps;

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
