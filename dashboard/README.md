# JIRAH Command Center — Dashboard

Local Next.js dashboard rendering Jirah's pipeline, audit applications, active engagements, and today's briefing at `localhost:3000`.

Design source of truth: [../design-review/command-center-v1/](../design-review/command-center-v1/design_handoff_command_center/).

## Setup

```bash
cd dashboard
npm install
cp .env.local.example .env.local
# Open .env.local and set ONEDRIVE_ROOT for your machine
# (path differs per partner — see comments in .env.local.example)
npm run dev
```

Open http://localhost:3000.

## Data source

The dashboard reads from `ONEDRIVE_ROOT` — the OneDrive `NEW - JIRAH MASTER` folder synced on your machine. Must be set in `.env.local` or the dashboard will throw a clear error on startup. Each partner's path differs (OneDrive prefixes shared folders with the owner's name); see `.env.local.example` for both variants.

Briefings are read from `../briefings/YYYY-MM-DD.md` (committed to the repo, shared across both partners).

## Partner onboarding

See [../SETUP-JOSHUA.md](../SETUP-JOSHUA.md) — covers clone, env setup, daily pull/push rhythm.

## Tech

- Next.js 15 (App Router) + React 19
- Tailwind CSS (tokens live in `app/globals.css` `:root`)
- `lucide-react` icons (thin stroke)
- Playfair Display + DM Sans via `next/font/google`
- `gray-matter` for markdown frontmatter

## Structure

See [../PLAN.md §3.5](../PLAN.md).
