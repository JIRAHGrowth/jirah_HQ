---
name: jirah-lead-gen
description: Deep research on one or more target prospects + draft partner-voice intro email referencing specific observations. Fans out to jirah-prospect-researcher subagent in parallel for batches. Produces a per-prospect research brief and a ready-to-send intro email. Invoke when new targets need depth, when Jason or Joshua says "research X before I reach out," or when pipeline needs a top-of-funnel push.
---

# /jirah-lead-gen

## Purpose

Produce a research brief + ready-to-send intro email for each target prospect — based on real signals, not generic pitches. Every email that goes out under the Jirah name opens with a specific observation about the target, not a form letter.

## Pre-requisites (read before running)

- [context/jirah-voice.md](../../../context/jirah-voice.md) — voice markers, sign-off rules, don'ts
- [context/jirah-icp-wedge.md](../../../context/jirah-icp-wedge.md) — wedge copy, geo routing (Funnel 1 vs Funnel 2)
- [context/jirah-pattern-library.md](../../../context/jirah-pattern-library.md) — prior-engagement patterns to reference in emails
- [context/jirah-pipeline.md](../../../context/jirah-pipeline.md) — so we don't re-research someone already in flight

## Inputs (ask if not supplied)

- **Targets** — one of:
  - Explicit list: `--targets "Northcrest Structural, Sidewater Engineering, ..."`
  - Prospect file path(s): `--prospect-file prospects/p1.md`
  - Pipeline batch: `--scope new` (prospects created in last 14 days) | `--scope cold` (all `stage: cold`)
  - Industry-pulse output: `--from-pulse briefings/industry-pulse-YYYY-MM-DD.md`
- **Depth** — `--depth standard` (default) | `--depth deep` (includes owner LinkedIn arc + prior-company trajectory)
- **Send mode** — `--draft` (default, writes drafts) | `--dry` (brief only, no email)

---

## Process

### 1. Resolve targets

Gather the target list. For each target, check `prospects/[slug].md`:
- If a prospect file exists, read it — we have context already (stage, prior activity, known contact).
- If not, scaffold one from `prospects/_template.md` with `stage: cold, source: [wherever this target came from]`.

### 2. Fan out prospect researchers in parallel

Spawn one [`jirah-prospect-researcher`](../../agents/jirah-prospect-researcher.md) subagent **per target**, in a single message with parallel tool calls (cap at 10 concurrent — batch further targets in a second round).

Each subagent receives:
- Prospect name + known context from the prospect file
- Depth flag
- Research dimensions: company trajectory, funding / M&A, hiring pattern, owner bio, industry context, Jirah-wedge signals

Each subagent returns a structured research brief with sourced citations.

### 3. Aggregate per-prospect research brief

Write each brief to `prospects/[slug]/research-brief.md`:

```markdown
---
prospect: [name]
researched: YYYY-MM-DD
depth: standard
---

# [Prospect name] — research brief

## Snapshot
- Staff: [N]
- Revenue: [est. $X or "public: $Y"]
- Founded: [year]
- Structure: [owner-run / partnership / PE-backed]
- HQ: [city] (flag for Funnel 1 vs 2)

## Recent signals (last 12 months)
- YYYY-MM-DD — [event] (source URL)
- ...

## Owner / buyer profile
- [Name, role, LinkedIn URL]
- Background arc: [prior companies, tenure, signals]

## ICP-fit assessment
[Green / amber / red with 2-sentence rationale]

## Wedge-relevant signals
- [public indicators of friction — hiring velocity, owner-hustling, scaling pain, succession silence]

## Pattern-library match
[Which prior engagement shape this prospect most resembles — Falcon / Genesis / Hatch / S+A / none. If a match exists, name it + 1-sentence transferable insight from `context/jirah-pattern-library.md`.]

## Open questions / gaps
- [What we couldn't confirm]
```

### 4. Draft intro email per target

For each prospect, draft email at `prospects/drafts/[slug]-intro-YYYY-MM-DD.md`.

Structure per `context/jirah-voice.md`:

```
Subject: [something specific, not "Quick question"]

[First name],

[Observation — 1 sentence, names the specific signal from research brief. Not generic. No "I saw you on LinkedIn." Specific: "Saw you opened the Nanaimo office in March."]

[Connection to pattern — 1 sentence. Reference wedge or prior engagement shape. "At 75 staff and two offices that's usually where the partner capacity ceiling starts showing up."]

[Low-friction ask — 1 sentence. Routes by geo:
  - Funnel 1 (Kelowna / within 4 hours): "We're in town [date] — 60 minutes over lunch if useful. No pitch deck."
  - Funnel 2 (outside): "If there's even a half-interest, our Friction Audit is how we usually start — $1.5k, one day, a few pages of findings. [link]"
]

Jason and Joshua
```

Apply voice rules:
- Numbers > adjectives
- No corporate-speak, no em-dashes without purpose, no "leverage synergies"
- No generic flattery
- Max ~80 words total
- Sign "Jason and Joshua" for joint sends

### 5. Update prospect file

For each prospect researched:
- Append to `## Activity log`:
  ```
  - YYYY-MM-DD — Research brief + intro draft generated. Signal referenced: [signal]. Draft at prospects/drafts/[slug]-intro-YYYY-MM-DD.md
  ```
- Update `lastContactDays: 0` (draft generated; reset when actually sent)
- Update `nextAction: [date 7 days out]` (follow-up if no response)

### 6. Output to chat

```
Lead gen — YYYY-MM-DD
Researched N prospects (K Funnel 1, M Funnel 2)

Top candidates (by ICP + signal strength)
1. [name] — [1-line why promising] — [funnel routing]
...

Drafts written
- prospects/drafts/[slug]-intro-YYYY-MM-DD.md (N files)

Flags
- [prospects where research turned up "not a fit" — recommend dropping from prospects/ or moving to watch list]
- [prospects with weak signal — recommend deferring outreach until next industry-pulse cycle]
```

---

## Edge cases

- **Research finds the firm is under ICP** (staff <25, revenue <$4M) — do NOT draft email; flag in chat, recommend either drop or watch-list.
- **Owner has publicly announced sale or retirement** — pivot hook to succession framing; still draft, but flag to Jason for voice review before send.
- **Prospect already has a recent activity log entry** (<14 days) — skip draft; flag "already in flight."
- **Research subagent returns no signal** — draft shorter email using pattern-library match only, with lower-confidence hook ("If it's relevant — engineering firms your size usually hit X"). Flag for Jason to decide whether to send.
- **Funnel 1 target but Jason/Joshua aren't in town in the next 30 days** — default to Funnel 2 ask (audit link) instead of lunch.
- **Prospect file doesn't exist yet** (new target) — scaffold it first using the prospects/_template.md pattern before writing research brief.

## Related

- Subagent: [`jirah-prospect-researcher`](../../agents/jirah-prospect-researcher.md) — fan-out for parallelism
- Upstream: `jirah-industry-pulse` (surfaces targets)
- Downstream: `jirah-email` (handles follow-ups + non-intro sends)
- Context: jirah-voice.md, jirah-icp-wedge.md, jirah-pattern-library.md
- Future MCP: Outlook Mail (Sprint 2) — gains `--send` flag that actually ships the draft
