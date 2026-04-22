# JIRAH Ops Workspace — Master Plan

**Last revised:** 2026-04-21 (Sprints 1a–1e complete; Sprints 2, 3, 4 skills + subagents built out; retained skills fleshed out; scheduled-trigger setup brief drafted. All 36 skills + 6 subagents are now full bodies — no ghost stubs remain. What's left: MCP wiring, trigger activation, first real-engagement runs.)
**Owner:** Jason Lotoski
**Purpose:** The canonical source of truth for what the Jirah Ops Claude workspace is, why it exists, what it contains, and how it is built out over time.

---

## 1. Context

JIRAH Growth Partners (Jason + Joshua) is a growth consulting firm. Existing client work lives across OneDrive: 50+ proposals, active/inactive client folders, legacy templates, a sales target xlsx. There is currently **no unified CRM, no reminder system, no pipeline tracker, no demand-generation engine, and no Jirah-specific Claude skill library.** 5 global Claude skills exist (`decision-memo`, `doc-review`, `meeting-prep`, `html-brief`, `code-plan`) which are useful but not Jirah-aware.

**Goal:** turn `c:\Users\jason\Desktop\Jirah Ops\` into Jason's Claude-managed command center that:
1. Carries Jirah's process, IP, and voice context into every session
2. Houses Jirah-specific skills that encode the methodology
3. Reads/writes the shared OneDrive files so Joshua sees the same tracked state
4. Drives the full **cold-lead → Friction Audit → closed client → delivered engagement → case study → referral** lifecycle
5. Treats **AI tool-builds as a co-equal service line** with strategic consulting, not a side track
6. **Renders state through a local Next.js dashboard** (`localhost:3000`) so pipeline, audit queue, and active engagements are visible at a glance — not only queryable via Claude chat

This is NOT a delivery-ops automation project. It is a **growth machine** that includes delivery as one ring of a six-ring loop. It has two surfaces: Claude Code chat (for drafting, diagnosing, generating) and a local web dashboard (for seeing state).

---

## 2. Strategic Frame — The Growth Machine

Consulting firms grow on a repeatable machine: **IP → Relationships → Trigger-based outreach → Diagnostic → Proof harvest → Referral loop.** The workspace must encode all six rings, not just the delivery ring.

### Jirah's Wedge (POV)

> *"In owner-run B2B firms, the real constraint is almost never what the owner thinks it is. We find it. Then we execute — often with custom AI — to remove it."*

The Ownership Impact lens (Friction Point #10, unique to Jirah) is the specific wedge most consultants will not name. Everything public-facing leans into it.

### Ideal Client Profile (ICP)

- **Size:** 30–150 staff, $6M–$20M ARR, 6-figure contracts
- **Core vertical:** Engineering and building systems firms (multi-office, multi-principal, scaling past 100 people). Also professional services, accounting, similar B2B owner-run firms.
- **AI-build clients:** no revenue cap
- **Buyer:** Owner or managing partner
- **Pattern:** Strong technical firm, solid reputation, steady growth, hits a ceiling when operational maturity lags scale

### Three Monetization Paths (off one diagnostic entry)

1. **Ops optimization**
2. **High-value project execution** (new location, service line, M&A integration, succession)
3. **Custom AI build** (Jirah's flagship differentiator)

### The Friction Audit Funnel (front door)

```
Free "Apply for Audit" form  →  Jirah handpicks strongest ICP fits
                                          ↓
                              Paid Friction Audit — $1,500
                              1 full day on-site or virtual
                              Few-page findings (action register)
                                          ↓
                              Expansion conversation:
                              ops / project / AI engagement
```

Why: volume at top, prestige in middle, commitment test at the threshold, constrained delivery for scale. See [context/jirah-icp-wedge.md](context/jirah-icp-wedge.md).

---

## 3. Architecture

### Three persistence zones

| Zone | Path | Scope | What lives here |
|---|---|---|---|
| **Workspace** | `~\Desktop\Jirah Ops\` (cloned per-partner from GitHub) | Shared via git pull/push | `CLAUDE.md`, `.claude/`, `context/`, `briefings/`, dashboard, skill definitions |
| **Claude Memory** | `~\.claude\projects\c--Users-<username>-Desktop-Jirah-Ops\memory\` | Per-partner, personal (not in git) | Partner profile, voice-rules pointer, `MEMORY.md` index |
| **OneDrive (shared)** | `[ONEDRIVE_ROOT]\` — resolves via `dashboard/.env.local` per machine | Shared with Joshua | Live client data — prospects, active clients, pipeline xlsx |

### Workspace layout

```
~\Desktop\Jirah Ops\   (per-partner clone of github.com/JIRAHGrowth/jirah_HQ)
├── CLAUDE.md                                 ← master context loaded every session
├── PLAN.md                                   ← this file
├── .claude\
│   ├── settings.json                         ← project permissions + hooks
│   ├── skills\
│   │   └── jirah-[skill]\SKILL.md            ← 25 Jirah skills (see §4)
│   └── agents\
│       └── jirah-[agent].md                  ← 6 Jirah subagents (see §4.5)
├── context\                                  ← Jirah's authoritative IP (shareable)
│   ├── jirah-firm.md                         ← firm identity, co-founders, ethos
│   ├── jirah-icp-wedge.md                    ← ICP, wedge, audit funnel
│   ├── jirah-friction-points.md              ← the 10 diagnostic lenses
│   ├── jirah-process.md                      ← the 6-step engagement flow
│   ├── jirah-methodology.md                  ← triangulation, dual-facilitator, discipline
│   ├── jirah-voice.md                        ← voice rules + deliverable structure
│   ├── jirah-visuals.md                      ← Mode A / Mode B specs
│   ├── jirah-pattern-library.md              ← Vulcan→Hatch→Falcon→Genesis + new
│   ├── jirah-pipeline.md                     ← current clients + prospects (decays)
│   └── jirah-team.md                         ← Jason / Joshua lanes, division of labor
├── briefings\
│   └── YYYY-MM-DD.md                         ← scheduled trigger writes daily briefings
└── dashboard\                                ← Next.js local dashboard (see §3.5)
    ├── app\                                  ← App Router pages
    ├── components\                           ← shadcn/ui primitives + Jirah components
    ├── lib\                                  ← OneDrive readers (fs/markdown/xlsx)
    ├── public\                               ← logos, fonts, static
    ├── .env.local                            ← ONEDRIVE_ROOT per-machine config
    └── package.json
```

### 3.5 Dashboard (local Next.js, day-one)

**Purpose:** visual at-a-glance layer on top of the markdown + xlsx substrate. The substrate remains source-of-truth; the dashboard is a view.

**Stack:**
- Next.js 15 (App Router) + Tailwind + shadcn/ui
- Server components read OneDrive files via `fs`; client components handle interactivity
- Markdown parsing: `gray-matter` + `marked`
- Icons: `lucide-react`
- Fonts: Playfair Display (display) + DM Sans (body), loaded via `next/font`

**Data source:** Per-prospect / per-audit / per-client **markdown files with YAML frontmatter** are the canonical source of truth. No xlsx-based pipeline (the SheetJS path mentioned in earlier drafts was dropped 2026-04-20 — `_pipeline.xlsx` never existed; markdown gives skills a uniform read/write substrate).

**Visual mode:** Mode A (JIRAH-branded) — see [context/jirah-visuals.md](context/jirah-visuals.md). Gold `#C5A55A`, navy `#111827`, warm off-white `#FAF7F0`.

**Portability:** Joshua clones the workspace to his machine. `.env.local` holds `ONEDRIVE_ROOT` (per-machine path to the synced OneDrive folder). Each partner runs their own `npm run dev`. Upgrade path (Sprint 6+): deploy to Vercel with MS Graph API for true shared state.

**Day-one MVP views (Sprint 1d):**
1. **Today's Focus Bar** — global header: # overdue follow-ups, # audit apps pending, # engagements at risk, content-this-week status
2. **Pipeline Kanban** — Cold / Warm / Meeting Booked / Proposal Sent / Closed Won / Closed Lost
3. **Audit Applications Queue** — sortable table, ICP score, status, triage action
4. **Active Engagements** — card grid, 6-step progress indicator per client
5. **Today's Briefing panel** — renders `briefings/YYYY-MM-DD.md` inline

**Deferred to later sprints:**
- Client / prospect detail pages (v1 uses drawer modals)
- KPI dashboards per retained client
- Win/loss analytics (wait for Sprint 1c data)
- People graph, content calendar, pattern library browser

**Design process:** claude.ai mockup iteration → approved mockup → Next.js implementation. See [PLAN.md §7 Sprint 1c](#7-phased-build-order).

---

### OneDrive additions (shared with Joshua)

```
...\NEW - JIRAH MASTER\
├── 01 - Clients\
│   ├── Active Clients\
│   │   ├── _template\                        ← NEW: new-client skill copies from here
│   │   │   ├── 00-profile.md                 ← frontmatter: status/owner/next_action
│   │   │   ├── 01-sprint-plan.md
│   │   │   ├── 02-comms-log.md
│   │   │   ├── deliverables\
│   │   │   └── source-files\
│   │   └── [existing client folders]
│   └── Sales - Client Targets\
│       ├── _pipeline.xlsx                    ← NEW: at-a-glance CRM view
│       ├── audit-applications\               ← NEW: Friction Audit inbound
│       │   ├── _template.md
│       │   └── [one .md per application]
│       └── prospects\                        ← NEW
│           ├── _template.md
│           └── [one .md per prospect]
```

---

## 4. Skill Inventory (36 skills, 5 groups + retained)

All skills sit at `.claude\skills\[name]\SKILL.md`. Ghost stubs = frontmatter + `## Purpose` + `## TODO: Build out` with a concrete build brief. Working skills = full bodies.

### Group A — Demand Generation & Friction Audit Funnel

| Skill | Shape | Priority |
|---|---|---|
| `jirah-audit-apply` | Landing page copy + application form questions + scoring rubric | Sprint 2 |
| `jirah-audit-triage` | ICP-score applications, draft accept/decline emails, maintain queue | Sprint 2 |
| **`jirah-friction-audit`** | 1-day delivery structured through 10 Friction Points, triangulation, confidence tags, expansion path | **Sprint 1 (working)** |
| `jirah-industry-pulse` | Weekly vertical scan (engineering, prof services, accounting) → ranked outreach list | Sprint 2 |
| `jirah-lead-gen` | Deep prospect research + drafted audit-invite email | Sprint 2 |
| `jirah-email` | Partner-voice templates: cold-w/-observation, follow-up, proposal send, check-in | Sprint 2 |
| `jirah-thought-leadership` | "Owner thought X, actual was Y" post/essay format; weekly + monthly cadence | Sprint 2 |

### Group B — 6-Step Engagement Delivery

| Skill | Shape | Priority |
|---|---|---|
| `jirah-discovery` (Step 1) | Discovery call prep + post-call synthesis | Sprint 3 |
| `jirah-discussion-document` (Step 2) | Mode A deliverable, structure from S&A exemplar | Sprint 3 |
| `jirah-kickoff-agenda` (Step 3) | Kickoff deck + agenda | Sprint 3 |
| `jirah-sprint-facilitation` (Step 4) | Pre-sprint guide + in-sprint analyzer | Sprint 3 |
| `jirah-session-analyzer` | Fireflies transcript → language shifts, contradiction, emotional markers | Sprint 3 |
| `jirah-triangulation` | Plan the validation (team interviews, external checks, data pulls) | Sprint 3 |
| `jirah-action-register` (Step 5) | **Replaces `jirah-report-writing`** — the deliverable | Sprint 3 |
| `jirah-kpi-tracker` (Step 6) | Retainer-phase KPI dashboard + action-register status | Sprint 4 |

### Group C — AI Service Track (first-class, co-equal)

| Skill | Shape | Priority |
|---|---|---|
| `jirah-ai-opportunity-scan` | Embedded in every audit; surfaces AI leverage points | Sprint 2 |
| `jirah-ai-scoping` | Opportunity → scoped 4-week pilot proposal | Sprint 3 |
| `jirah-pilot-plan` | Mode B; Hero→Problem→Approach→Timeline→Example Output→Risks→Next Steps | Sprint 3 |
| `jirah-ai-pilot-status` | Weekly demo-able status doc | Sprint 3 |

### Group D — Harvest Loop

| Skill | Shape | Priority |
|---|---|---|
| `jirah-case-study` | Auto-drafts from finished engagement in "owner thought X / actual Y" format | Sprint 4 |
| `jirah-testimonial-ask` | Drafted 30 days post-delivery | Sprint 4 |
| `jirah-referral-ask` | Drafted at win moments | Sprint 4 |
| `jirah-pattern-library-query` | Reads prior engagements; surfaces applicable patterns when drafting new work | Sprint 4 |
| **`jirah-win-loss`** | One-shot retrospective on 50 historical proposals — highest-ROI single build | **Sprint 1b** |

### Group E — Ops Cadence

| Skill | Shape | Priority |
|---|---|---|
| **`jirah-daily-briefing`** | Scans active clients + prospects + audit applications; flags overdue, surfaces actions, drafts replies; writes `briefings/YYYY-MM-DD.md` | **Sprint 1 (working)** |
| **`jirah-new-client`** | Copies `_template\` to new Active Client folder; fills `00-profile.md`; cross-refs AI workspace if needed | **Sprint 1 (working)** |
| `jirah-weekly-review` | Monday partner sync synthesis | Sprint 4 |
| `jirah-pipeline-forecast` | Probabilistic forecast from stage data (needs win-loss data) | Sprint 4 |
| `jirah-people-graph` | Alumni, introducers, advisors, prospects' colleagues | Sprint 4 |
| `jirah-intro-request` | Warm-intro asks off the people graph | Sprint 4 |

### Retained from original plan (✅ built out 2026-04-21)

All retained skills are now full bodies — no ghost stubs remain in this group:

- [`jirah-financial-audit`](.claude/skills/jirah-financial-audit/SKILL.md) — 7 red-flag checks (margin / concentration / AR aging / working capital / trends / partner comp / comp benchmarking) mapped to friction points; feeds Friction Audit afternoon pass
- [`jirah-survey-writing`](.claude/skills/jirah-survey-writing/SKILL.md) — 15-question cap, friction-point-indexed Likert + open-ended + NPS, deployment recommendations (Typeform / Forms)
- [`jirah-team-interview`](.claude/skills/jirah-team-interview/SKILL.md) — per-role guides (ops lead / finance / rainmaker / long-tenured IC / recent hire / admin / advisor / partner / custom) with inline observer prompts for Jason
- [`jirah-document-review`](.claude/skills/jirah-document-review/SKILL.md) — extends global doc-review with Jirah methodology lens; uses jirah-document-reviewer subagent; scope-discipline + FP #10 overlay
- [`jirah-client-presentation`](.claude/skills/jirah-client-presentation/SKILL.md) — extends global html-brief with Mode A / Mode B rules; 6 presentation types (pitch / readout / kickoff / training / QBR / custom)
- [`jirah-report-review`](.claude/skills/jirah-report-review/SKILL.md) — methodology-compliance gate before shipping any Jirah deliverable; per-deliverable-type checklist; voice + visual + pattern-library reference verification
- [`jirah-win-loss`](.claude/skills/jirah-win-loss/SKILL.md) — full-archive retrospective skill, fans out 5 jirah-proposal-miner subagents; calibrates /jirah-pipeline-forecast and proposes ICP refinements to context files. Ready for when a larger proposal archive surfaces (or quarterly re-run as archive grows)

### Retired

- `jirah-report-writing` — superseded by `jirah-action-register` (register is the deliverable, not a report)
- `jirah-linkedin-post` — folded into `jirah-thought-leadership`
- `jirah-report-planning` — folded into `jirah-action-register`

---

## 4.5 Subagents — parallel / isolated workers

Subagents live at `.claude\agents\[name].md` (frontmatter: `name`, `description`, `tools`, optional `model`). Skills (and occasionally main Claude) call them when work benefits from **parallelism** (fan-out across prospects, proposals, or verticals) or **context isolation** (keeping large file reads out of the main conversation). A subagent runs with its own context window and returns a single summary message to the caller.

**Pattern:** user invokes `/jirah-win-loss` (skill) → skill spawns 5 `jirah-proposal-miner` subagents in parallel (each reads 10 of the 50 proposals) → skill aggregates results into the win/loss report. User sees one slash command; behind the scenes, 5 workers run in parallel.

### Six subagents for Jirah Ops

| Subagent | Called by (skill) | Tools | Priority |
|---|---|---|---|
| **`jirah-proposal-miner`** | `jirah-win-loss` — 5-way fan-out over 50-proposal archive | `Read`, `Glob`, `Grep` | **Sprint 1b (working)** |
| `jirah-prospect-researcher` | `jirah-lead-gen` — deep per-prospect research (company news, funding, hires, owner bio) | `WebSearch`, `WebFetch`, `Read` | Sprint 2 |
| `jirah-vertical-scanner` | `jirah-industry-pulse` — 4 instances, one per vertical (engineering, prof services, accounting, building systems) | `WebSearch`, `WebFetch` | Sprint 2 |
| `jirah-transcript-analyzer` | `jirah-session-analyzer` — Fireflies transcript → language shifts, contradictions, emotional markers | `Read` | Sprint 3 |
| `jirah-document-reviewer` | `jirah-document-review` — reviews client-sent files (PDFs, docs) | `Read` | Sprint 3 |
| `jirah-pattern-matcher` | `jirah-pattern-library-query` — scans prior engagements for patterns matching current client profile | `Read`, `Grep`, `Glob` | Sprint 4 |

**Why skills + subagents (and not either alone):** skills are the user-facing interface; subagents are the computational workers skills dispatch when the work is parallel or heavy. Without subagents, a skill reading 50 proposals sequentially would blow out Jason's main context window.

---

## 4.6 MCP Servers — API connectors

MCP (Model Context Protocol) servers are external processes that give Claude — both skills and subagents — access to real systems. They are the **hands** of the operation.

### Priority integrations

| MCP | Purpose | Priority | Notes |
|---|---|---|---|
| **Outlook Mail** (MS Graph) | Partner-voice email send/read; powers `jirah-email` and `jirah-audit-triage` | Sprint 2 | One MS Graph connection covers mail + calendar |
| **Outlook Calendar** (MS Graph) | Friction Audit booking, meeting-prep auto-trigger on calendar events | Sprint 2 | Same connection as Outlook Mail |
| **Canva** | Visual assets, client deck exports (Mode A + Mode B) | Sprint 2–3 | Already available as a deferred tool in this environment |
| **Web search** (Perplexity or Brave) | Depth for `jirah-prospect-researcher` and `jirah-vertical-scanner` | Sprint 2 | Pick one — Perplexity has higher quality, Brave is cheaper |
| **Google Drive** | Cross-share with external parties on Google ecosystem (not for Jirah internal storage) | As needed | Already available as a deferred tool |

### Explicitly skipped

- **Gmail** — Jason's gmail is personal, not Jirah's. Jirah runs on Microsoft 365 / Outlook.
- **LinkedIn** — no reliable official MCP. `jirah-thought-leadership` drafts copy-paste content.
- **Custom MCPs** (direct Fireflies API, OneDrive via Graph) — only if default file access becomes painful. Revisit Sprint 6+.
- **CRM MCPs** (HubSpot, Pipedrive) — the markdown + xlsx model is the plan. Don't solve a problem you don't have.

### Authentication

MS Graph MCPs require a Microsoft 365 auth flow. Jason authenticates once per machine; tokens refresh automatically. Joshua authenticates separately when mirroring the workspace.

---

## 5. Context files — authoritative Jirah IP

Ten files in `context/`, already written in Sprint 1a (this session):

| File | Purpose |
|---|---|
| [jirah-firm.md](context/jirah-firm.md) | Firm identity, co-founders, ethos, positioning, brand role |
| [jirah-icp-wedge.md](context/jirah-icp-wedge.md) | ICP, wedge, 3 monetization paths, Friction Audit funnel |
| [jirah-friction-points.md](context/jirah-friction-points.md) | 10 lenses with diagnostic questions per lens |
| [jirah-process.md](context/jirah-process.md) | 6-step engagement flow, deliverable per step |
| [jirah-methodology.md](context/jirah-methodology.md) | Triangulation, dual-facilitator, action register, scope discipline, pattern library, tool stack |
| [jirah-voice.md](context/jirah-voice.md) | Voice markers, reusable structure, do's/don'ts |
| [jirah-visuals.md](context/jirah-visuals.md) | Mode A vs Mode B specs + chooser table |
| [jirah-pattern-library.md](context/jirah-pattern-library.md) | Vulcan → Hatch → Falcon → Genesis + harvest template |
| [jirah-pipeline.md](context/jirah-pipeline.md) | Current clients + prospects (snapshot, decays fast) |
| [jirah-team.md](context/jirah-team.md) | Jason + Joshua lanes, division of labor table |

---

## 6. Memory scope (user-personal only)

After Sprint 1a migration, Claude memory (`~\.claude\projects\c--Users-jason-Desktop-Jirah-Ops\memory\`) holds only what is *personal to Jason*:

- `MEMORY.md` — index
- `user_jason.md` — Jason's profile (lane, background, preferences)
- `feedback_jirah_voice.md` — **pointer** only; authoritative voice rules live in `context/jirah-voice.md`

Everything about Jirah-the-firm has moved to workspace `context/` so Joshua can mirror it.

---

## 7. Phased Build Order

### ✅ Sprint 1a — Context migration (done 2026-04-18)
- 10 context files authored
- Memory trimmed to user-personal scope + pointer to workspace voice doc
- `MEMORY.md` index updated
- `PLAN.md` rewritten (this doc)

### ✅ Sprint 1b — Foundation + 3 working skills + 1 working subagent (done 2026-04-18)
1. `CLAUDE.md` — master context doc that loads every session, points at `context/` and explicitly references the 6 steps, 10 Friction Points, voice, visual modes
2. `.claude\settings.json` — project permissions for OneDrive paths, any hooks
3. `.claude\agents\` directory scaffolded
4. `briefings\` directory
5. OneDrive scaffolding: `01 - Clients\Active\_template\`, `02 - Sales & Pipeline\Prospects\`, `02 - Sales & Pipeline\Audit Applications\` (all markdown — no `_pipeline.xlsx`)
6. **Seed sample data** — 2-3 prospects, 1 active engagement, 1 audit application — so Sprint 1d dashboard has real data to render
7. Working skill: `jirah-new-client`
8. Working skill: `jirah-daily-briefing`
9. Working skill: **`jirah-friction-audit`** (structured around 10 Points + triangulation + confidence tags + expansion paths)
10. **Working subagent:** `jirah-proposal-miner` (enables Sprint 1e win/loss run)
11. Ghost stubs for the remaining 22 skills + 5 subagents with concrete build briefs

### ✅ Sprint 1c — Dashboard mockup (approved 2026-04-18)
- Design bundle delivered and approved. Source of truth: [design-review/command-center-v1/](design-review/command-center-v1/design_handoff_command_center/)
- 5 MVP views present + 2 bonuses (drawer detail pattern, persistent right-rail briefing panel)
- Design tokens, typography, interaction patterns, and data types locked
- Sprint 1d ports this bundle to Next.js; do not re-design, re-implement

### ✅ Sprint 1d — Dashboard v1 (done 2026-04-18)
1. `dashboard/` scaffolded with Next.js 15 (App Router) + Tailwind + lucide-react + Playfair Display + DM Sans via `next/font`
2. Port design tokens from `design-review/command-center-v1/.../styles.css` `:root` block into `globals.css` (or `tailwind.config.ts` extensions)
3. Port shared primitives first: `Avatar`, `StageBadge`, `AuditBadge`, `Button` (default/primary/gold/ghost/sm variants), `Tag`, `Drawer`, `DrawerHead`, `KV`
4. Port views: `PipelineView` + `PipelineDrawer`, `AuditView` + `AuditDrawer`, `EngagementsView` + `EngagementDrawer` + `Stepper`, `BriefingPanel`, `FocusBar`, `Tabs`
5. `.env.local` config with `ONEDRIVE_ROOT`
6. OneDrive reader library (`lib/onedrive.ts`) — reads markdown frontmatter + xlsx; maps to the typed shapes defined in the design README (`PipelineItem`, `AuditApp`, `Engagement`, `Briefing`)
7. Tab persistence via `localStorage.jirah_tab`
8. Responsive stack below 1200px (per design spec)
9. `dashboard/README.md` with setup instructions so Joshua can clone and run
10. Verify end-to-end: seeded sample data renders correctly across all 5 views + drawers work

### ✅ Sprint 1e — Pattern Library Codification (done 2026-04-18)
Re-scoped from "win/loss retrospective across 50 proposals" to "pattern codification across 4 real engagements" after discovering the OneDrive archive holds ~4 engagements not ~50. 4 general-purpose subagents mined Falcon, Genesis, Hatch, and Smith+Andersen in parallel. Outputs:
- [reports/pattern-library-codification-2026-04-18.md](reports/pattern-library-codification-2026-04-18.md) — canonical retrospective with 8 cross-engagement patterns, voice library, pricing anchors, engagement-shape catalog
- [context/jirah-pattern-library.md](context/jirah-pattern-library.md) — rewritten with evidence-backed patterns (replaces placeholder content)
- **Key validation:** FP #10 Ownership Impact is the terminal diagnosis in 4/4 engagements — the wedge is evidence-backed, not hypothesis-driven
- **3 engagement shapes identified:** Sprint+Report, Monthly Retainer+add-ons, Parallel Strategic+AI

Full win/loss retrospective deferred until (and if) a historical proposal archive surfaces elsewhere (email, Google Drive, Dropbox, pre-OneDrive filing).

### Sprint 2 — Demand-generation engine

**✅ Skill bodies built out (2026-04-21):**
- Group A: `jirah-audit-apply`, `jirah-audit-triage`, `jirah-industry-pulse`, `jirah-lead-gen`, `jirah-email`, `jirah-thought-leadership`
- Group C: `jirah-ai-opportunity-scan`
- **Subagents:** `jirah-prospect-researcher`, `jirah-vertical-scanner`

All seven skills graduated from ghost stubs to full bodies — inputs, process, output paths, voice rules, edge cases. Both subagents graduated to full bodies with source-map, ranking-formula, and output-schema specs. Funnel 1 vs Funnel 2 geo routing is encoded across `jirah-lead-gen` + `jirah-email` + `jirah-industry-pulse` + `jirah-vertical-scanner`.

**Deferred to a dedicated MCP wiring pass (not blocking Sprint 3+):**
- **Outlook Mail + Calendar (MS Graph)** — unlocks `--send` flag on `jirah-email`, `jirah-audit-triage`, `jirah-lead-gen`; unlocks calendar-triggered `/meeting-prep` and booking confirmations for Friction Audits. One Microsoft 365 auth flow per machine.
- **Canva MCP** — already surfaced as a deferred tool in the environment. Wires up once `jirah-thought-leadership` / `jirah-client-presentation` / `jirah-pilot-plan` are first used in anger. Gains `--render-canva` flag to produce the images directly.
- **Web-search MCP** (Perplexity or Brave) — deepens `jirah-prospect-researcher` + `jirah-vertical-scanner` beyond default WebSearch quality. Pick one — Perplexity higher quality, Brave cheaper. Not blocking; defaults work.
- **Publish first 4 thought-leadership pieces** from the pattern-library codification (Falcon, Genesis, Hatch, S+A). Can ship as copy-paste now; Canva MCP adds image-rendering later.
- **First real run through each skill** — validates that seed-data shapes + OneDrive paths work end-to-end.

MCP wiring is a self-contained batch we can drive through in one focused pass once one of the skills above becomes active-use. Until then, every skill works as copy-paste output.

### Sprint 3 — 6-step delivery + AI pilot tooling

**✅ Skill bodies built out (2026-04-21):**
- Group B (6-step engagement): `jirah-discovery`, `jirah-discussion-document`, `jirah-kickoff-agenda`, `jirah-sprint-facilitation`, `jirah-session-analyzer`, `jirah-triangulation`, `jirah-action-register`
- Group C (AI track): `jirah-ai-scoping`, `jirah-pilot-plan`, `jirah-ai-pilot-status`
- **Subagents:** `jirah-transcript-analyzer`, `jirah-document-reviewer`

All 10 skills graduated from ghost stubs to full bodies — inputs, process, output paths, voice rules, edge cases. Both subagents built out with structured output schemas and edge-case handling. The full 6-step engagement flow is now operable end-to-end via skill invocations: Discovery → Discussion Document (Mode A) → Kickoff → Sprint (with transcript fan-out via subagent) → Triangulation → Action Register (Mode A). AI pilot track stands up in parallel: Opportunity scan → internal Scoping → client-facing Pilot Plan (Mode B) → weekly Pilot Status (Mode B).

**Pattern-library discipline encoded across deliverables:**
- Pattern 1 (FP #10 terminal) — action register forces surfacing the wedge
- Pattern 4 (symptoms vs constraints) — two-column frame in both Discussion Document and Action Register
- Pattern 6 (triangulation visible on page) — every finding carries the validation trail
- Pattern 7 (scope creep dies on page) — OUT-OF-SCOPE section non-negotiable in Discussion Document and Action Register
- Pattern 8 (FP #10 as growth-readiness reframe) — baked into Action Register Section 1

**Still pending in Sprint 3:**
- **First real engagement run** through the full 6-step flow — will surface friction in skill interlocks
- Engagement folder scaffold validation — ensure the `06-sprint/`, `07-deliverables/`, `09-ai-pilot/` folder conventions align with the per-client template in OneDrive

### Sprint 4 — Harvest + cadence + scheduled triggers

**✅ Skill bodies built out (2026-04-21):**
- Group D (Harvest loop): `jirah-case-study`, `jirah-testimonial-ask`, `jirah-referral-ask`, `jirah-pattern-library-query`
- Group E (Ops cadence): `jirah-kpi-tracker`, `jirah-weekly-review`, `jirah-pipeline-forecast`, `jirah-people-graph`, `jirah-intro-request`
- **Subagent:** `jirah-pattern-matcher`
- **Scheduled-trigger setup brief:** [ops/scheduled-triggers.md](ops/scheduled-triggers.md) — cron expressions + activation sequence for 8 scheduled triggers (daily / Sunday / Monday stack / Friday / monthly / quarterly)

The 6-ring growth machine is now fully operable skill-side: demand-gen → friction-audit → delivery → harvest → cadence → referral loop. Every skill has full inputs/process/output/edge-case coverage. Pattern-library discipline connects every stage — from prospect research through action-register through case-study harvest.

**Harvest loop closure** — every delivered engagement now auto-queues: case study (90d), testimonial ask (30d), referral ask (event-driven on win moments), pattern-library append (on close). No engagement leaves the machine without its harvest.

**Ops cadence stack** — Monday partner sync is now a machine-prepped event: Sunday-night forecast → Monday weekly review → Monday industry-pulse → Monday audit triage. Partners walk into the sync with one integrated view.

**Still pending to activate Sprint 4:**
- **Wire the scheduled triggers** — per [ops/scheduled-triggers.md](ops/scheduled-triggers.md). Sequence: prove daily briefing first (3-day soak), then Monday stack, then Friday dispatcher, then monthly/quarterly. One focused session of `schedule` skill invocations.
- **First monthly retainer cycle** through `/jirah-kpi-tracker` once any engagement reaches the Step 6 retainer phase
- **First published LinkedIn posts** from `/jirah-thought-leadership` drawing on pattern-library codification (Falcon / Genesis / Hatch / S+A)
- **First people-graph population** — seed from existing Jirah network; 20–30 entries initial
- **First case study** — pick an engagement, run through full harvest chain end-to-end to validate the flow

### Ongoing tooling

See [§4.6 MCP Servers](#46-mcp-servers--api-connectors) for the full integration plan. Gmail explicitly skipped — Jason's gmail is personal; Jirah runs on Microsoft 365 (Outlook Mail + Calendar via MS Graph).

---

## 8. Verification Gates

After each Sprint, run these checks before proceeding:

**Sprint 1b gates:**
1. `ls Desktop\Jirah Ops` shows `CLAUDE.md`, `PLAN.md`, `.claude\`, `context\`, `briefings\`.
2. Skill listing shows 25 Jirah skills + 5 global skills.
3. Open Claude in the workspace; ask "what does Jirah do?" — answer draws from `context/jirah-firm.md` + `context/jirah-icp-wedge.md`, not generic.
4. `/jirah-new-client` with "Test Alpha Co" — creates folder under Active Clients with 4 starter files and filled `00-profile.md` frontmatter.
5. `/jirah-daily-briefing` — writes `briefings/YYYY-MM-DD.md` listing any overdue/actionable items.
6. `/jirah-friction-audit` — produces a 10-Friction-Point-structured output with confidence tags and at least 3 recommended next-step options (ops / project / AI).
7. Ghost skill invocation (e.g. `/jirah-email`) returns the ghost-stub build brief, not a silent failure.
8. Seeded sample data exists in OneDrive: ≥2 prospects, ≥1 active engagement, ≥1 audit application.

**Sprint 1c gate:**
- Dashboard mockup approved by Jason. Visual fidelity to Mode A brand locked. 5 MVP views present.

**Sprint 1d gates:**
1. `cd dashboard && npm run dev` starts clean at `localhost:3000`.
2. All 5 MVP views render with real data from OneDrive (no hardcoded samples).
3. Swap `.env.local` `ONEDRIVE_ROOT` to a different path → dashboard reads the new location without code changes.
4. README walks Joshua through clone → `npm install` → `.env.local` setup → `npm run dev` in <10 minutes.

**Sprint 1e gate:**
- Win/loss output produces ≥3 concrete pattern insights and ≥3 revivable lost-deal candidates.

**Sprint 2 gate:**
- An audit application can flow: apply-form copy → triage → accept email → audit delivered → expansion proposal drafted. End-to-end in under 30 minutes of Claude time.

---

## 9. Out of Scope (intentional)

- **Migrating all 50+ historical proposals into new schema** — do opportunistically as clients reactivate
- **Joshua's mirror setup** — deferred until Jason's side is battle-tested; then copy `Desktop\Jirah Ops\` tree to his machine
- **Full skill bodies for ghost skills** — ghost first, fill when first invoked in anger
- **LinkedIn API automation** — no reliable LinkedIn MCP; `jirah-thought-leadership` drafts copy-paste content
- **Gmail integration** — Jason's gmail is personal, not Jirah's. Jirah uses Outlook via MS Graph (see §4.6)
- **Replacing existing xlsx templates in `08 - Resources\Templates\`** — those stay; we add alongside
- **CRM migration to HubSpot / Pipedrive** — the hybrid xlsx + per-prospect .md approach is the plan; revisit only if volume outgrows it

---

## 10. Success Criteria (end-state)

Jirah Ops is successful when:
1. Jason can start any morning by (a) glancing at the dashboard at `localhost:3000` for pipeline + audit queue + engagement health, and (b) reading `briefings/YYYY-MM-DD.md` for today's specific actions
2. Every new prospect flows through the Friction Audit funnel without ad-hoc handling
3. Every finished engagement auto-produces a case study, testimonial ask, and referral ask
4. Weekly thought-leadership content ships without starting from a blank page
5. Joshua can clone the workspace, run `npm run dev`, and see the same dashboard state Jason sees (data pulled from the same OneDrive mount)
6. The system compounds — Sprint N engagements inform Sprint N+1 pattern library; win/loss data sharpens ICP; audit findings feed thought leadership
7. The dashboard evolves with usage — views that prove useful get deepened; views that don't get removed
