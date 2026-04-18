# Engagement RSVP Website (React + Vite + Tailwind + Supabase)

A polished, mobile-first engagement RSVP website with:

- Romantic premium UI and smooth animations (`framer-motion`)
- White + floral green theme with animated SVG floral accents
- RSVP form using `react-hook-form`
- Form validation and loading/success/error states
- Duplicate rapid-submission prevention
- Supabase integration to persist RSVPs
- Admin panel to view RSVPs and export CSV
- Simple login gate for admin route (`/admin`)

## Tech Stack

- React + Vite
- Tailwind CSS
- React Hook Form
- Framer Motion
- Supabase (`@supabase/supabase-js`)

## Project Structure

```txt
.
├── .env.example
├── supabase/
│   └── schema.sql
├── src/
│   ├── components/
│   │   ├── sections/
│   │   │   ├── ConfirmationCard.jsx
│   │   │   ├── CountdownSection.jsx
│   │   │   ├── EventDetailsSection.jsx
│   │   │   ├── FAQSection.jsx
│   │   │   ├── GallerySection.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── AdminLoginGate.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   └── RSVPSection.jsx
│   │   └── ui/
│   │       ├── FormField.jsx
│   │       ├── FloralDecor.jsx
│   │       ├── PrimaryButton.jsx
│   │       └── SectionHeading.jsx
│   ├── config/
│   │   └── eventData.js
│   ├── lib/
│   │   └── supabase.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── tailwind.config.js
└── postcss.config.js
```

## 1) Create Supabase Project

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Open the SQL Editor and run the SQL in `supabase/schema.sql`.
3. In Project Settings -> API, copy:
   - Project URL
   - `anon` public key

## 2) Supabase SQL Schema

Use this SQL (also available in `supabase/schema.sql`):

```sql
create extension if not exists "pgcrypto";

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone_number text not null,
  notes text
);

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

create policy "Allow public select to rsvps"
on public.rsvps
for select
to public
using (true);
```

> Quick test alternative: disable RLS with `alter table public.rsvps disable row level security;`
> Production note: anonymous `select` exposes your guest list publicly. For production, use Supabase Auth and limit `select` to authenticated admins.

## 3) Environment Variables

Create a `.env` file in project root:

```bash
cp .env.example .env
```

Then update values:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_ACCESS_CODE=your-secure-admin-code
```

## 4) Install & Run

```bash
npm install
npm run dev
```

App starts on Vite's local URL (usually `http://localhost:5173`).

## 5) How RSVP Submission Works

- Supabase client is configured in `src/lib/supabase.js`
- Form lives in `src/components/sections/RSVPSection.jsx`
- On submit, app performs:
  - Validation (required name + phone, optional message)
  - Insert into `rsvps` table via:
    `supabase.from('rsvps').insert({ full_name, phone_number, notes })`
  - Success state with confirmation message
  - Error state if insert fails
- A submission lock (`useRef`) blocks duplicate rapid clicks

## 6) Customization

All event placeholder content is in `src/config/eventData.js`:

- Couple names
- Date and time
- Venue and address
- Maps link
- Dress code
- Countdown target date
- Gallery images
- FAQ entries

Update this one file to re-theme content quickly.

## 7) Admin Panel (Guest List + CSV Export)

- Open `http://localhost:5173/admin`
- Enter the admin access code from `VITE_ADMIN_ACCESS_CODE`
- Guest list auto-loads on open; use `Refresh List` any time
- Click `Export CSV` to download `guest-list-YYYY-MM-DD.csv`

If guest list does not load:

- Re-run `supabase/schema.sql` in Supabase SQL editor
- Verify `.env` has valid Supabase URL and anon key
- Confirm the `rsvps` table exists in the `public` schema
- If RSVP submits fail with code `42501`, your insert policy is blocked: re-run `schema.sql` and test form again

## 8) Deploy to Vercel

### Option A: Deploy with Vercel Dashboard (recommended)

1. Push your project to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **Add New... -> Project**.
3. Import your repository.
4. Vercel should auto-detect **Vite** settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables in Vercel Project Settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_ACCESS_CODE`
6. Click **Deploy**.

### Option B: Deploy with Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

When prompted:
- Framework: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

Then add env vars:

```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_ADMIN_ACCESS_CODE
```

Redeploy after adding variables:

```bash
vercel --prod
```

### Post-deploy checklist

- Open deployed URL and submit an RSVP
- Check `/admin` login and guest list load
- Confirm Supabase table receives new rows

### Fix for `/admin` 404 on Vercel

This app uses client-side routing logic (path check in React). On refresh or direct visit to `/admin`, Vercel can return `404` unless routes are rewritten to `index.html`.

This repo includes `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

If you deployed before adding this file, redeploy the project and `/admin` will work.
