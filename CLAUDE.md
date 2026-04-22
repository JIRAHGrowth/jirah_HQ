# JIRAH Ops — Claude Operating Guide

You are working in **JIRAH Growth Partners**' operations command center. Jason Lotoski is the primary user; Joshua Marshall shares this workspace (cloned to his machine). JIRAH is a boutique growth consultancy operating as an "Extended CEO" team for owner-run B2B services firms (30–150 staff, $6M–$20M revenue; core vertical engineering / professional services / accounting).

---

## Read before you act

For any client, prospect, or deliverable work, read these first:

- [context/jirah-firm.md](context/jirah-firm.md) — firm identity, co-founders, ethos, brand role
- [context/jirah-icp-wedge.md](context/jirah-icp-wedge.md) — ICP, wedge ("the real constraint is almost never what the owner thinks"), Friction Audit funnel
- [context/jirah-friction-points.md](context/jirah-friction-points.md) — the 10 diagnostic lenses (Ownership Impact = #10 is the Jirah wedge)
- [context/jirah-process.md](context/jirah-process.md) — 6-step engagement flow (Discovery → Discussion Doc → Kickoff → Sprint → Report & Plan → KPI Tracking)
- [context/jirah-methodology.md](context/jirah-methodology.md) — triangulation, dual-facilitator, action-register, scope discipline
- [context/jirah-voice.md](context/jirah-voice.md) — voice rules + reusable deliverable structure
- [context/jirah-visuals.md](context/jirah-visuals.md) — Mode A (JIRAH-branded) vs Mode B (co-branded)
- [context/jirah-pattern-library.md](context/jirah-pattern-library.md) — Vulcan → Hatch → Falcon → Genesis + ongoing
- [context/jirah-pipeline.md](context/jirah-pipeline.md) — current clients + prospects (snapshot; verify against per-file `.md`)
- [context/jirah-team.md](context/jirah-team.md) — Jason + Joshua lanes and division of labor

---

## Core invariants (non-negotiable)

- **Every finding needs a confidence tag** — Very High / High / Medium. Triangulation required.
- **Action registers, not reports** — prioritized (Critical / High / Medium), mapped to friction point, owner-assigned, deadline-bound.
- **Mode A vs Mode B** — decide before any client-facing artifact. Discussion docs / strategic proposals → Mode A. Pilot plans / implementation proposals → Mode B.
- **Voice rules live in `context/jirah-voice.md`** — read them; don't guess from memory.
- **AI tool-builds are a co-equal service line** with strategic consulting — not experimental.
- **Scope discipline** — SOPs, handbooks, full HR policy are usually out-of-scope; flag early.

---

## Where data lives

- **Workspace** (this directory, shareable with Joshua): `c:\Users\jason\Desktop\Jirah Ops\`
  - `CLAUDE.md`, `PLAN.md`, `context/`, `.claude/`, `briefings/`, `dashboard/`, `seed-data/`
- **Claude memory** (Jason-personal only): `~/.claude/projects/c--Users-jason-Desktop-Jirah-Ops/memory/`
- **OneDrive** (shared, source of truth for client data): `C:\Users\jason\OneDrive - jirahgrowth.consulting\Joshua Marshall's files - JIRAH Growth Partners - Shared\NEW - JIRAH MASTER\`
  - `01 - Clients\Active\[ClientName]\` — all active clients (sprint + retainer phases co-exist per client)
  - `01 - Clients\Inactive\[ClientName]\` — archived clients
  - `01 - Clients\_template\` — canonical per-client scaffold (numbered 03 - Admin → 10 - Harvest)
  - `01 - Clients\_pipeline.xlsx` — master pipeline tracker
  - `02 - Sales & Pipeline\Prospects\[ProspectName]\` — local Kelowna funnel
  - `02 - Sales & Pipeline\Audit Applications\[ApplicantName]\` — out-of-market apply-for-audit funnel
  - `02 - Sales & Pipeline\Outreach Collateral\` — decks, intro PDFs, elevator pitch
  - `02 - Sales & Pipeline\Target Lists\` — research spreadsheets
  - `03 - Marketing & Content\` — brand assets, case studies, thought leadership
  - `04 - Deliverable Templates\` — Friction Audit pack, reports, monthly retainer, AI pilot
  - `05 - Corporate\` — accounting, legal, invoices, time tracking, firm identity
  - `06 - Ops Command Center\` — daily briefings, weekly reviews, pipeline snapshots

**Per-client folder convention** (inside `Active\[ClientName]\`): `00 - Profile.md`, `01 - Engagement Plan.md`, `02 - Comms Log.md`, `03 - Admin/`, `04 - Client Source Files/`, `05 - Discovery & Discussion Doc/`, `06 - Sprint & Facilitation/`, `07 - Deliverables/` (Drafts/Final/Appendices), `08 - Monthly Retainer/`, `09 - AI Pilot/`, `10 - Harvest/`. Numeric prefixes mirror the 6-step engagement process; unused phases stay as empty folders.

**Dev-mode fallback:** the dashboard reads `seed-data/` (in this workspace) when `ONEDRIVE_ROOT` is unset. Useful for testing before OneDrive sync is ready.

---

## Skills (invoke with `/skill-name`)

**Working:**
- `/jirah-new-client` — scaffolds a new Active Client folder from the OneDrive `_template/`
- `/jirah-file-sort` — classifies + moves a batch of files into a client's numbered subfolders (Admin / Client Source Files / Sprint / Deliverables / Retainer / Harvest). Pairs with `/jirah-new-client` at intake; also runs any time new files arrive.
- `/jirah-daily-briefing` — scans pipeline/engagements/audits, drafts `briefings/YYYY-MM-DD.md`
- `/jirah-friction-audit` — the 1-day paid audit product (prep / capture / synthesize modes)

**Ghost (invocation returns build brief):** 33 additional skills across demand-gen, engagement delivery, AI track, harvest loop, ops cadence. See [PLAN.md §4](PLAN.md).

## Subagents

**Working:**
- `jirah-proposal-miner` — reads + tags proposal files; called by `jirah-win-loss` in 5-way parallel fan-out

**Ghost:** `jirah-prospect-researcher`, `jirah-vertical-scanner`, `jirah-transcript-analyzer`, `jirah-document-reviewer`, `jirah-pattern-matcher`.

---

## When you don't know

Before recommending something specific (a file path, prospect name, action register item), **verify** — read the actual file or directory listing. Don't trust stale memory about "what was in the pipeline last session." Pipeline, engagements, and audits change daily.
