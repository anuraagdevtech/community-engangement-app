# Mohalla

A hyperlocal community-engagement web app: a geo-verified neighbourhood feed, a local services
directory, interest circles, and a peer marketplace — scoped to a 500m–5km radius around each
resident. Built per [`actions/plan.xml`](actions/plan.xml); product rationale lives in
[`actions/task.xml`](actions/task.xml).

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui-style components ·
Supabase (Postgres + PostGIS + Auth) · Google Maps Platform. Phase 1 of the roadmap only — the web
MVP. Circles and the marketplace ship as "coming soon" screens; see `actions/task.xml` for the
full phase 2/3 plan.

## What's built

- **Auth** — email magic links, Google, Facebook, and phone OTP, all via Supabase Auth.
- **Onboarding** — pick a home location on a map, set a default radius (500m/1km/3km/5km).
- **Neighbourhood Feed** — typed channels (General, Safety, Buy & Sell, Lost & Found, Events),
  list + map views, a post composer, all scoped by PostGIS radius queries.
- **Local Services Directory** — categorised listings, list + map views, provider detail pages
  with star reviews, a self-serve "list a service" form.
- **Profile** — trust tier, karma score, editable display name.
- Every map is optional at the code level: without a Google Maps key, map views render a friendly
  "add your key" placeholder instead of crashing.

## 1. Prerequisites

- Node.js 20+ and npm
- A free [Supabase](https://supabase.com) account
- A free [Google Cloud](https://console.cloud.google.com) account (for Maps — optional but
  recommended; the app runs without it)

## 2. Set up Supabase (free tier)

1. Create a new project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Open **SQL Editor** and run, in order, the contents of
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) then
   [`supabase/migrations/0002_auth_providers.sql`](supabase/migrations/0002_auth_providers.sql).
   The first enables PostGIS, creates all tables/RLS policies, and adds the `nearby_posts` /
   `nearby_providers` / `get_provider` radius-query functions the app calls; the second makes new
   sign-ups pick up a name/avatar from Google, Facebook, or a phone number, not just email.
3. Go to **Project Settings → API** and copy the **Project URL** and **anon public key**.
4. Under **Authentication → URL Configuration**, add `http://localhost:3000/auth/callback` (and
   your production URL later) as a redirect URL.

Email magic links work out of the box in development using Supabase's built-in email service
(rate-limited — fine for testing; add your own SMTP provider under **Authentication → Emails**
before a real launch).

### Enabling Google sign-in (free)

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create an OAuth
   2.0 Client ID (Web application).
2. Add `https://<your-project-ref>.supabase.co/auth/v1/callback` as an authorised redirect URI.
3. In Supabase: **Authentication → Providers → Google**, paste the Client ID and Client Secret,
   enable it.

### Enabling Facebook sign-in (free)

1. Create an app at [developers.facebook.com](https://developers.facebook.com/apps), add the
   **Facebook Login** product.
2. Add `https://<your-project-ref>.supabase.co/auth/v1/callback` as a valid OAuth redirect URI.
3. In Supabase: **Authentication → Providers → Facebook**, paste the App ID and App Secret, enable
   it.

### Enabling phone sign-in (not free)

Unlike email/Google/Facebook, phone OTP has no free tier anywhere — Supabase delivers the SMS
through a provider you connect (Twilio, MessageBird, Vonage, or Textlocal), and every message is
billed by that provider (Twilio: a trial account gives a small free credit for verified test
numbers only; production numbers cost real money per SMS).

1. Create an account with one of the supported providers and grab its API credentials.
2. In Supabase: **Authentication → Providers → Phone**, enable it and fill in the provider
   credentials.

The phone tab in the app's sign-in form works immediately once this is configured — no code
changes needed.

## 3. Set up Google Maps (free tier)

1. Create a project at [console.cloud.google.com](https://console.cloud.google.com).
2. Enable **Maps JavaScript API**, **Places API**, and **Geocoding API**.
3. Create an API key under **APIs & Services → Credentials**, and restrict it (HTTP referrers for
   web) to your domain + `localhost`.
4. Google's Maps Platform includes **$200 of free usage every month** — comfortably enough for a
   single pilot neighbourhood.
5. Optional: create a Map ID (**Google Maps Platform → Map Management**) for Advanced Marker
   styling, and set `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`.

Skipping this step is fine — the app runs with map views showing a placeholder until a key is
added.

## 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and (optionally)
`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

Until `.env.local` has real Supabase values, every route redirects to `/setup`, which walks
through these same steps in-app — this is expected on a fresh clone, not a bug.

## 5. Install and run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

## Project structure

```
app/                    Routes (App Router)
  (app)/                Authenticated shell — feed, services, circles, marketplace, profile
  login/ signup/        Auth pages
  onboarding/           First-run location setup
  setup/                Shown when Supabase env vars are missing
components/
  ui/                   Design-system primitives (button, card, dialog, tabs, …)
  map/                  Google Maps wrappers (picker, radius circle, marker map, no-key fallback)
  feed/ services/       Feature-specific components
  layout/ marketing/    App shell/nav and the landing page
lib/
  supabase/             Browser/server/middleware Supabase clients
  types/database.types.ts   Hand-authored types matching the SQL schema
supabase/migrations/    SQL schema, RLS policies, and geo RPC functions
```

## Regenerating Supabase types

`lib/types/database.types.ts` is hand-written to match the migration. Once your project is linked
via the Supabase CLI, regenerate it from the real schema instead:

```bash
npx supabase gen types typescript --linked > lib/types/database.types.ts
```

## Deploying (free tier)

[Vercel](https://vercel.com)'s free Hobby tier deploys this repo directly — import the project,
add the same environment variables, and set the Supabase Auth redirect URL to your production
domain's `/auth/callback`.

## Known follow-ups

- Pinned to Next.js 14.2.35 (latest 14.x patch) rather than 15/16 to avoid an untested major-version
  jump; `npm audit` will still flag some Next.js advisories whose fixed-version ranges start at 16 —
  revisit before a real launch.
- `@supabase/supabase-js` / `@supabase/ssr` are pinned to `2.45.4` / `0.5.1`; newer major releases
  changed the generated-types shape enough to break the hand-written `Database` type above — bump
  deliberately, together with regenerating types.
- Node 20 works today; `@supabase/supabase-js` prefers Node 22+ going forward.
