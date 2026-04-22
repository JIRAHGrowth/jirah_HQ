# JIRAH Command Center — Dashboard

Local Next.js dashboard rendering Jirah's pipeline, audit applications, active engagements, and today's briefing at `localhost:3000`.

Design source of truth: [../design-review/command-center-v1/](../design-review/command-center-v1/design_handoff_command_center/).

## Setup

```bash
cd dashboard
npm install
cp .env.local.example .env.local
# Leave ONEDRIVE_ROOT commented for dev mode (reads ../seed-data/)
# Uncomment + set for production (reads from OneDrive)
npm run dev
```

Open http://localhost:3000.

## Modes

- **Dev mode (default):** reads `../seed-data/` for prospects, audits, engagements. Self-contained, no OneDrive sync needed.
- **Production mode:** reads from `ONEDRIVE_ROOT` — the OneDrive `01 - Clients` folder synced on your machine.

Briefings are read from `../briefings/YYYY-MM-DD.md` in both modes, with a fallback to `../seed-data/briefings/YYYY-MM-DD.md`.

## Joshua's setup

1. Clone the full workspace.
2. `cd dashboard && npm install`
3. Copy `.env.local.example` → `.env.local`, set `ONEDRIVE_ROOT` to his OneDrive mount path.
4. `npm run dev` → same dashboard, same data.

## Tech

- Next.js 15 (App Router) + React 19
- Tailwind CSS (tokens live in `app/globals.css` `:root`)
- `lucide-react` icons (thin stroke)
- Playfair Display + DM Sans via `next/font/google`
- `gray-matter` for markdown frontmatter

## Structure

See [../PLAN.md §3.5](../PLAN.md).
