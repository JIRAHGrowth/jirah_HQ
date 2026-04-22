---
name: jirah-weekly-review
description: Monday 08:00 partner sync synthesis. One page covering pipeline movement (W/W deltas), this-week top 5 actions per partner, engagements at risk, content cadence status, people-graph touches needed, and audit queue state. Feeds the Jason + Joshua Monday partner meeting. Chains off /jirah-daily-briefing (daily view) and /jirah-pipeline-forecast (probabilistic view). Use on the Monday scheduled trigger or when Jason says "weekly review," "Monday sync," "partner briefing for this week."
---

# /jirah-weekly-review

## Purpose

Produce the **Monday 08:00 partner briefing** — one page, full picture, aligns Jason + Joshua on the week. This is the ops-cadence anchor point for the two-partner firm: every Monday morning they land on the same page before the week begins.

Distinct from `/jirah-daily-briefing`:
- Daily briefing = today's actions (overdue follow-ups, sprint risks, warm prospects to nurture)
- Weekly review = the week's shape (pipeline movement, top priorities per partner, strategic signals)

## Pre-requisites (read before running)

- [context/jirah-voice.md](../../../context/jirah-voice.md) — partner-voice internal brief style
- [context/jirah-team.md](../../../context/jirah-team.md) — Jason + Joshua lanes (BusDev/Growth/Finance vs Methodology/Facilitation)
- [context/jirah-pipeline.md](../../../context/jirah-pipeline.md) — stage definitions, current clients + prospects snapshot
- Prior week's review for W/W comparison
- Last 7 days of `/jirah-daily-briefing` outputs

## Inputs (ask if not supplied)

- **Week** — ISO week (`2026-W17`); defaults to the current-ISO-week at run time
- **Scope** — `--full` (default — all sections) | `--pipeline-only` | `--engagements-only` for focused runs
- **Input mode** — `--live` (default — reads current state from OneDrive / seed-data) | `--snapshot [path]` (pre-computed state for deterministic replay)

---

## Process

### 1. Compute week window

- ISO week start = Monday 00:00 America/Vancouver
- ISO week end = Sunday 23:59 America/Vancouver
- "This week" = Monday (today, if run Mon 08:00) through Sunday upcoming

### 2. Scan sources + extract deltas

Read current state from:
- `prospects/*.md`
- `audit-applications/*.md`
- `engagements/*/00-profile.md` (or OneDrive `01 - Clients\Active\*\` equivalents)
- `content/content-log.md` (once `/jirah-thought-leadership` logs publications)
- `people/*.md` (once `/jirah-people-graph` is populated)
- Last 7 days `briefings/YYYY-MM-DD.md`

Compute W/W deltas:
- **Pipeline stage transitions:** cold → warm, warm → meeting-booked, meeting-booked → proposal-sent, proposal-sent → closed-won / closed-lost. Count moves per direction.
- **New prospects added** (via `/jirah-industry-pulse`, `/jirah-lead-gen`, inbound)
- **Audit applications:** inbox count, triaged count, accepted / shortlist / declined
- **Engagements:** `currentStep` advancements, sprint starts/ends, report delivery dates crossed
- **Content cadence:** LinkedIn post shipped this past week (y/n), longform scheduled for month (y/n/drafted)

### 3. Build the 7-section weekly review

```markdown
---
week: YYYY-WNN
start: YYYY-MM-DD
end: YYYY-MM-DD
generated: ISO timestamp
---

# Weekly Review — Week NN ([Mon date] → [Sun date])

> Monday partner sync · 08:00 PT · Prepared by Claude

## 1. Pipeline movement (W/W)

| Stage | Start of week | End of last week | Δ | Notable |
|---|---|---|---|---|
| Cold | N | M | ±K | [names if notable] |
| Warm | ... |
| Meeting booked | ... |
| Proposal sent | ... |
| Closed won (this week) | ... |
| Closed lost (this week) | ... |

**Weighted pipeline** (from `/jirah-pipeline-forecast` if available): $X
**Expected close this quarter:** $Y ± uncertainty band

**Movers this week:**
- [specific prospect → advanced stage + why]
- [specific prospect → stalled + why]

## 2. This week's top 5 actions

### Jason (Growth / Finance / AI)
1. [specific action — target + deadline]
2. ...

### Joshua (Methodology / Facilitation)
1. [specific action — target + deadline]
2. ...

Per `context/jirah-team.md` lane division.

## 3. Engagements — status + risks

### [Client 1]
- **Current step:** [N / 6]
- **This week:** [what's happening — kickoff / sprint day / report delivery / KPI check-in]
- **Risk:** [any / none]

### [Client 2]
- ...

**Flagged for escalation:** [any engagement where delivery is at risk]

## 4. Audit queue state

- **New applications in:** N
- **Pending triage:** M (age distribution)
- **Accepted this week:** K
- **Paid audits scheduled:** [dates + clients]

## 5. Content cadence

- **LinkedIn post this past week:** [title / shipped? / link]
- **Next post scheduled:** [Tuesday draft status]
- **Longform for the month:** [status — not yet drafted / drafted / published]
- **Source material pipeline:** [any case studies ready to convert]

## 6. People graph — touches needed this week

- **Stale strong ties** (>90 days, strength=strong): [list]
- **Recent warm intros owed a follow-up:** [list]
- **Scheduled touches this week:** [any calendar events + prep status]

## 7. Week's strategic call

**One partner call for Monday:** [the single most important decision Jason + Joshua should make at the partner sync this morning — e.g., "Decide: do we accept the Meridian audit request despite revenue gap, or decline? Lean: decline, propose paid 15-min diagnostic instead." — pulled from the current state]
```

### 4. Apply voice rules

- Partner voice — internal, terse, signal-dense
- No corporate filler ("hope everyone had a great weekend")
- Numbers > adjectives (exactly per `context/jirah-voice.md`)
- Direct recommendations on escalations — not "maybe we should consider"
- Flag items that are stale or broken — never paper over

### 5. Output

```
reviews/
└── weekly-YYYY-WNN.md
```

Plus an HTML render for readability:
- `reviews/weekly-YYYY-WNN.html`

OneDrive equivalent: `06 - Ops Command Center\weekly-reviews\`

### 6. Pipeline forecast hand-off

If `/jirah-pipeline-forecast` has been run this week, ingest its output into Section 1. If not, flag that forecast hasn't been run and recommend running it before the partner sync.

### 7. Output to chat

```
Weekly Review — Week NN ([dates])

Pipeline Δ
- Cold: [N → M] (Δ)
- Warm: [...]
- Meeting booked: [...]
- Proposal sent: [...]
- Closed won: [this week]
- Closed lost: [this week]

Top 5 actions per partner: [count each]
Engagements at risk: [count]
Audit queue: [pending count]
Content: [ship status this past week]

Week's strategic call: "[one-line question + Claude's lean]"

File: [path]
Opens at: localhost:3000/weekly-review (if dashboard integrated)
```

---

## Edge cases

- **First run of the skill** (no prior-week data) — compute current-state snapshot only; flag "baseline week, no W/W deltas available yet"
- **OneDrive unavailable at run time** (network, auth lapse) — fall back to `seed-data/`; flag that state may not reflect production
- **A full stage is empty** (e.g., 0 prospects in "meeting booked") — still render row; state "—" for notable; do not hide the emptiness
- **Pipeline forecast failed or is stale** — proceed with raw pipeline Δ; flag forecast gap; recommend running forecast before the partner meeting
- **Daily briefings missing from prior week** (Claude wasn't invoked daily) — proceed with what exists; note gap in flag section
- **Week contains a major win or loss** (contract signed, audit applicant declined JIRAH) — highlight at top of Section 1; gets executive attention
- **Engagement has a sprint happening Mon/Tue of the current week** — move sprint-status to the top of Section 3 as active-attention; flag any pre-sprint data-pull gaps
- **Partner is away** (vacation, conference) — note at top of the review; calibrate Section 2 actions to one-partner coverage

## Related

- Daily view: [`jirah-daily-briefing`](../jirah-daily-briefing/SKILL.md) (fires 07:30 daily)
- Forecast feed: [`jirah-pipeline-forecast`](../jirah-pipeline-forecast/SKILL.md) (run weekly before this review)
- People graph: [`jirah-people-graph`](../jirah-people-graph/SKILL.md) (supplies stale-tie data for Section 6)
- Content log: [`jirah-thought-leadership`](../jirah-thought-leadership/SKILL.md) (logs publications for Section 5)
- Context: jirah-voice.md, jirah-team.md, jirah-pipeline.md
- Cadence: Monday 08:00 PT (Sprint 4 scheduled trigger)
