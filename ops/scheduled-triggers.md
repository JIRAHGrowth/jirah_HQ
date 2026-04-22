---
name: Scheduled Triggers — Setup Brief
last_reviewed: 2026-04-21
status: ready-to-wire (all target skills built; activation is a one-pass configuration)
---

# Scheduled Triggers — Setup Brief

## Purpose

The Sprint 4 skills (Harvest + Ops Cadence) are most valuable when they run **on a rhythm**, not only when Jason remembers to invoke them. This doc is the wiring guide: which skill fires when, the cron expression, the intent, and what Claude should do when the trigger wakes.

Wire via the `schedule` skill once Jason is ready to activate. Each trigger is a remote agent running on a cron schedule; see the `schedule` skill for the actual command.

---

## Scheduled triggers — master list

| Cadence | Cron (America/Vancouver) | Skill to fire | Purpose |
|---|---|---|---|
| Daily 07:30 | `30 7 * * *` | `/jirah-daily-briefing` | Morning partner-ready action list; writes `briefings/YYYY-MM-DD.md` |
| Sunday 22:00 | `0 22 * * 0` | `/jirah-pipeline-forecast` | Fresh forecast lands before Monday sync; output at `reviews/latest-forecast.md` |
| Monday 08:00 | `0 8 * * 1` | `/jirah-weekly-review` | Monday partner briefing; consumes latest forecast; writes `reviews/weekly-YYYY-WNN.md` |
| Monday 09:00 | `0 9 * * 1` | `/jirah-industry-pulse` | Fresh weekly trigger scan across 4 verticals; appends new prospects |
| Monday 10:00 | `0 10 * * 1` | `/jirah-audit-triage --scope new` | Triage applications submitted since last run |
| Friday 16:00 | `0 16 * * 5` | Wins log + Friday AI-pilot status | See "Friday 16:00" section below — this one's a dispatcher |
| 1st of month 08:00 | `0 8 1 * *` | `/jirah-kpi-tracker` (per retained client) + `/jirah-thought-leadership` content calendar draft | Monthly retainer check-ins + monthly content plan |
| 1st of quarter 08:00 | `0 8 1 1,4,7,10 *` | Positioning review prompt | See "Quarterly" section |

All times in `America/Vancouver`. Cron day-of-week: 0=Sunday, 1=Monday, etc.

---

## Trigger details

### Daily 07:30 — `/jirah-daily-briefing`

**Skill:** [`jirah-daily-briefing`](../.claude/skills/jirah-daily-briefing/SKILL.md)

**Cron:** `30 7 * * *`

**What fires:** Scans OneDrive (or seed-data fallback) for overdue follow-ups, sprint risks, warm prospects. Drafts partner-voice replies for each. Writes `briefings/YYYY-MM-DD.md`.

**Output consumed by:** Partners in Outlook email + dashboard right-rail panel at `localhost:3000`.

**Failure modes to monitor:** OneDrive sync lag → stale data. Briefing runs anyway; dashboard shows last-generated timestamp.

### Sunday 22:00 — `/jirah-pipeline-forecast`

**Skill:** [`jirah-pipeline-forecast`](../.claude/skills/jirah-pipeline-forecast/SKILL.md)

**Cron:** `0 22 * * 0`

**What fires:** Reads all `prospects/*.md`, applies stage-conversion rates, computes weighted pipeline + expected close this quarter with uncertainty band. Writes to `reviews/forecasts/forecast-YYYY-MM-DD-quarter.md` and overwrites `reviews/latest-forecast.md`.

**Why Sunday 22:00:** Monday weekly-review ingests `reviews/latest-forecast.md` — the forecast must be fresh when the partner sync runs.

### Monday 08:00 — `/jirah-weekly-review`

**Skill:** [`jirah-weekly-review`](../.claude/skills/jirah-weekly-review/SKILL.md)

**Cron:** `0 8 * * 1`

**What fires:** Reads pipeline + engagements + audit queue + last 7 days of daily briefings + fresh forecast. Produces the 7-section weekly review. Writes `reviews/weekly-YYYY-WNN.md`.

**Output consumed by:** Partner Monday sync meeting. Ideally Jason + Joshua open this file + the latest forecast at the top of the meeting.

### Monday 09:00 — `/jirah-industry-pulse`

**Skill:** [`jirah-industry-pulse`](../.claude/skills/jirah-industry-pulse/SKILL.md)

**Cron:** `0 9 * * 1`

**What fires:** Spawns 4 `jirah-vertical-scanner` subagents in parallel (engineering / building systems / prof services / accounting). Ranks fresh outreach triggers. Appends new prospect files + drafts observation hooks.

**Downstream:** Partners review top-ranked targets at their Monday sync (weekly-review lists them); queue `/jirah-lead-gen` for top 5.

### Monday 10:00 — `/jirah-audit-triage --scope new`

**Skill:** [`jirah-audit-triage`](../.claude/skills/jirah-audit-triage/SKILL.md)

**Cron:** `0 10 * * 1`

**What fires:** ICP-scores any audit applications submitted since last run. Drafts accept/shortlist/decline emails. Updates frontmatter.

**Output consumed by:** Jason reviews drafted emails + sends (or manual revise first). Once Outlook MCP is wired, gains `--send` flag for auto-dispatch on green-tier only.

### Friday 16:00 — dispatcher

**Cron:** `0 16 * * 5`

The dispatcher checks two conditions and fires accordingly:

**1. Active AI pilots** — for each engagement where `ai_pilot_status: in-flight`:
- Fire `/jirah-ai-pilot-status --engagement [slug] --week [auto-computed]`
- Output: weekly demo-beat artifact per pilot

**2. Wins log** — scan `engagements/*/00-profile.md` for any `stage` transition to `closed-won` or `delivered` in the last 7 days:
- Write to `reviews/wins-YYYY-WNN.md`
- Trigger `/jirah-referral-ask` if the transition was `closed-won`
- Trigger `/jirah-case-study` schedule if the transition was `delivered` (90-day countdown starts)

### 1st of month 08:00 — monthly pass

**Cron:** `0 8 1 * *`

**What fires:**

**1. Per-retained-client KPI check-in** — for each engagement where `stage: retainer`:
- Fire `/jirah-kpi-tracker --engagement [slug] --month [last completed]`
- Output: monthly sync note at `engagements/[slug]/08-retainer/kpi/YYYY-MM-monthly-note.md`

**2. Monthly thought-leadership planning** — fire `/jirah-thought-leadership --format longform --angle auto`:
- Skill drafts the monthly longform post using current pattern-library state
- Queues for Jason review + publish schedule

**3. 30-day testimonial-ask check** — scan for engagements where `report_delivered_date` is ~30 days ago:
- Queue `/jirah-testimonial-ask --trigger 30-day` for partner review

**4. 90-day case-study check** — scan for engagements where `report_delivered_date` is ~90 days ago:
- Queue `/jirah-case-study --trigger 90-day` for partner review

### 1st of quarter 08:00 — positioning review prompt

**Cron:** `0 8 1 1,4,7,10 *`

**What fires:** Prompt Jason + Joshua with a positioning review checklist. Not a Claude-generated deliverable — a partner conversation prompt:

```
Quarterly positioning review — YYYY-QN

Before the next quarter starts, work through:

1. Is the ICP descriptor still right? (staff band, revenue, vertical mix)
   Source data: win/loss patterns this quarter
2. Is the wedge still landing? (What's the response rate on pattern-library-anchored outreach?)
3. Which engagement shape has the highest win rate this quarter? Any shift to the mix?
4. Any new cross-engagement patterns surfaced that should go in jirah-pattern-library.md?
5. Content cadence: was the LinkedIn + longform cadence held?
6. Pipeline health: expected close vs actual close this quarter — calibration delta for
   /jirah-pipeline-forecast?
7. AI pilot pipeline: how many pilots shipped? Plan A hit rate? Anchor pricing still right?

Block 2 hours on the calendar; generate the review note yourselves, or use /decision-memo
for any specific shift discussion.
```

This trigger fires a reminder — partners do the work.

---

## Setup sequence (when Jason is ready)

Do these in order; each step should take <10 minutes.

### 1. Prove the daily trigger works first (lowest risk)

- Use `schedule` skill to create the `30 7 * * *` trigger invoking `/jirah-daily-briefing`
- Let it run for 3 days; verify `briefings/YYYY-MM-DD.md` lands each morning
- Once stable, the rest of the cadence stack can be wired in one sitting

### 2. Wire the Monday stack

- Sunday 22:00 → `/jirah-pipeline-forecast`
- Monday 08:00 → `/jirah-weekly-review`
- Monday 09:00 → `/jirah-industry-pulse`
- Monday 10:00 → `/jirah-audit-triage --scope new`

Four triggers, one session. Verify Monday morning next cycle.

### 3. Wire the Friday dispatcher

- Friday 16:00 → dispatcher logic
- If no AI pilots are live and no wins this week: dispatcher writes a skip note; doesn't fire anything

### 4. Wire the monthly + quarterly

- 1st of month + 1st of quarter triggers

### 5. Document what's active

Append to this file an "Active triggers" section once wired:

```markdown
## Active triggers (as of YYYY-MM-DD)

| Cron | Skill | Status | Last verified |
|---|---|---|---|
| 30 7 * * * | /jirah-daily-briefing | live | YYYY-MM-DD |
| ... |
```

---

## Failure modes + recovery

- **Trigger fires but skill errors** → Claude logs error; briefing not written; Jason sees gap in `briefings/` directory. Manual invoke to recover.
- **OneDrive unavailable** → skill falls back to `seed-data/`; briefing notes this in output.
- **Multiple overlapping triggers** (e.g., daily briefing + weekly review on same Monday) → they run independently; daily briefing writes to `briefings/`, weekly to `reviews/`; no conflict.
- **Claude rate limits** → low risk given current cadence; monitor if more triggers get added.
- **Partner away / vacation** → triggers keep running; output accumulates; partner catches up on return. No cost to continuity.

---

## What's explicitly NOT scheduled

- `/jirah-case-study` — manual or queued-for-review only; requires client clearance before publishing
- `/jirah-testimonial-ask` — scheduled as a *reminder* not an auto-send; partners review every one
- `/jirah-referral-ask` — event-driven (win moments), not scheduled
- `/jirah-intro-request` — event-driven (when referrer names a target)
- `/jirah-friction-audit` — invoked when a paid audit is booked; not scheduled
- `/jirah-lead-gen` — partner-initiated BD push; not scheduled
- `/jirah-ai-scoping` / `/jirah-pilot-plan` — one-off per pilot; not scheduled
- `/jirah-discovery` / `/jirah-discussion-document` / `/jirah-kickoff-agenda` / `/jirah-sprint-facilitation` — engagement-flow specific; not scheduled

The principle: **scheduled triggers handle rhythm and surveillance; engagement flow stays partner-initiated.**

---

## Related

- Skill: [schedule](.claude/skills/...) — the harness skill that creates remote-agent cron jobs
- Context: [PLAN.md §7 Sprint 4](../PLAN.md#7-phased-build-order)
