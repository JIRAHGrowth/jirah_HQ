---
name: jirah-industry-pulse
description: Weekly scan of Jirah's 4 verticals (engineering, building systems, professional services, accounting) for outreach triggers — funding, hires, partner changes, expansion announcements, M&A, leadership transitions. Fans out 4 jirah-vertical-scanner subagents in parallel. Outputs a ranked target list with specific-observation hooks + appends new prospects to the prospects/ directory. Invoke Monday mornings, on scheduled trigger, or ad hoc before a BD push.
---

# /jirah-industry-pulse

## Purpose

Turn cold outreach into warm-observation outreach. Every new prospect that enters the system this week must arrive with a specific reason the email lands today — a hire, a funding round, a partner transition, an expansion. No generic "we should talk" outreach.

This skill is the trigger-harvest layer that feeds `jirah-lead-gen` (depth per prospect) and `jirah-email` (draft outreach).

## Pre-requisites (read before scanning)

- [context/jirah-icp-wedge.md](../../../context/jirah-icp-wedge.md) — ICP bands, 4 verticals, geo bias (Funnel 1 local / Funnel 2 out-of-market)
- [context/jirah-pipeline.md](../../../context/jirah-pipeline.md) — current prospects + active clients (dedupe target)
- [context/jirah-voice.md](../../../context/jirah-voice.md) — hook language (direct, specific, observation-led)

## Inputs (ask if not supplied)

- **Geo bias** — `--geo kelowna` (Funnel 1 — BC / AB / 4-hr drive) | `--geo north-america` (Funnel 2) | `--geo all` (default)
- **Verticals** — default all 4; override with `--verticals engineering,accounting`
- **Lookback** — `--since 7d` (default) | `--since 14d` | ISO date

---

## Process

### 1. Fan out 4 vertical scanners in parallel

Spawn 4 [`jirah-vertical-scanner`](../../agents/jirah-vertical-scanner.md) subagents — one per vertical — **in a single message with 4 parallel tool calls**. Each subagent receives:

- Vertical name: engineering / building systems / professional services / accounting
- Geo bias (from `--geo` flag)
- Lookback window
- ICP bands for filtering (30–150 staff, $6–20M rev, owner-run)

Each subagent returns a ranked list of signal-triggers in its vertical — firm name, signal type, signal date, source URL, ICP-fit score.

### 2. Aggregate + dedupe

Combine the 4 returned lists. Then dedupe against existing records:

- Read `prospects/*.md` frontmatter — any firm already listed is marked `existing-prospect` (don't create a duplicate file; append to activity log instead)
- Read `active-clients/*` or the OneDrive equivalent — any firm already a client is dropped from the list
- Read recent `briefings/*.md` if they mention the firm — flag as `previously-seen`

### 3. Rank

Sort by signal strength + ICP fit + recency:

| Signal type | Weight |
|---|---|
| Leadership / partner transition | 5 (highest — known catalyst for friction audits) |
| Multi-office expansion announcement | 4 |
| New GM / COO / VP-level hire | 4 |
| Funding / capital raise | 3 |
| M&A (on either side) | 3 |
| Senior-level hires | 2 |
| General expansion news | 2 |

Multiply by ICP-fit score (0–1) and recency decay (signal in last 7 days = 1.0, 14 days = 0.7, 30 days = 0.4).

### 4. Draft observation hooks

For each ranked target, draft a 1–2 sentence opening hook that the follow-on `jirah-email` run can paste verbatim. The hook must:

- Name the specific signal + source ("Saw you announced the Vancouver office opening on [date]")
- Connect to a known pattern from the library ("Multi-office expansion is the exact pressure point we worked through with a 100-person engineering firm last year")
- NOT pitch the audit in the hook — save that for the call-to-action in the body

Per `context/jirah-voice.md`: direct, specific, numbers > adjectives, no corporate framing.

### 5. Append new prospects

For each ranked target not already a prospect, create `prospects/[slug].md` with frontmatter:

```yaml
---
id: p[next available number]
name: [firm name]
stage: cold
industry: [vertical]
geo: [BC / AB / ... / US-West / etc.]
owner: JL   # or JM based on who invoked
lastContactDays: 0
nextAction: [date 7 days out]
value: [estimated engagement value — use jirah-pattern-library price anchors]
contact: [if known from signal; else "TBD — research needed"]
source: industry-pulse-scan YYYY-MM-DD
---

# [firm name]

**Trigger signal (YYYY-MM-DD):** [signal summary] ([source URL])

[Hook draft from step 4]

## Activity log
- YYYY-MM-DD — Added via industry-pulse scan. Signal: [type]
```

### 6. Output to chat

```
Industry Pulse — YYYY-MM-DD
Scanned N firms across 4 verticals; 14 signals in last 7d; K matched ICP.

Top 10 ranked targets
1. [name] (vertical, geo) — [signal] — score [N] — [hook snippet]
...

New prospect files written: M
Existing prospects with fresh signals: P (append to activity log)

Next moves
- Run /jirah-lead-gen on top 5 for deep research + intro-email drafts
- For Kelowna-geo targets, skip the apply-form pitch — this is Funnel 1 (lunch ask)
```

---

## Edge cases

- **Vertical scanner returns nothing** for one vertical — log "quiet week in [vertical]" in the chat summary; don't invent targets.
- **Signal attaches to a firm too large / too small for ICP** — include in output with a flag (`out-of-band`) so Jason can see what's moving in adjacent markets without pursuing it.
- **Duplicate firms across verticals** (e.g., firm is both an engineering and accounting target) — keep one record; prefer the vertical with stronger ICP fit.
- **Signal is stale** (>30d) — exclude unless Jason passes `--since 60d`.
- **Geo unknown** — mark `geo: unknown` in frontmatter; Jason can repair during weekly review.
- **Firm already a closed-lost opportunity** (in a `02 - Sales & Pipeline\Prospects\_lost` folder) — flag as "potential revival candidate" instead of auto-creating new prospect file.

## Related

- Subagent: [`jirah-vertical-scanner`](../../agents/jirah-vertical-scanner.md) — 4 parallel instances
- Downstream: `jirah-lead-gen` (depth on top-ranked), `jirah-email` (draft outreach)
- Context: jirah-icp-wedge.md, jirah-pipeline.md, jirah-voice.md
- Scheduling: Sprint 4 adds cron trigger Monday 08:00
