---
name: jirah-kpi-tracker
description: Step 6 — monthly KPI tracking + action-register status updates during the retainer phase. This is where retainer revenue lives — the Active Advisory monthly cadence that keeps the action register alive after sprint delivery. Produces a monthly 1-page check-in comparing commitments vs movement, flags drift, drafts the partner-voice sync note for the owner. Use on the first-of-month scheduled trigger, or when Jason says "status on [client]," "monthly check-in for [client]," "KPI update for [engagement]."
---

# /jirah-kpi-tracker

## Purpose

Keep the action register alive after the sprint wraps. **This is Step 6 of the 6-step engagement process** — the retainer phase where Jirah acts as the extended CEO team. The skill's monthly output:
1. Compares what was committed vs what actually moved
2. Flags drift patterns (items stuck, items accelerated, unplanned items surfacing)
3. Drafts the partner-voice monthly sync note for the owner
4. Feeds `/jirah-testimonial-ask` and `/jirah-case-study` when positive movement shows up

**~5% owner time on implementation** per `context/jirah-methodology.md` §5 — work flows through client PMs and Jirah, not the owner. KPI tracking is the visibility layer that makes that sustainable.

## Pre-requisites (read before running)

- [context/jirah-process.md](../../../context/jirah-process.md) — Step 6 purpose, cadence
- [context/jirah-methodology.md](../../../context/jirah-methodology.md) — action-register format, ~5% owner-time rule
- [context/jirah-voice.md](../../../context/jirah-voice.md) — partner-voice monthly sync note style
- Engagement's action register (Step 5 deliverable at `engagements/[slug]/07-deliverables/final/`)
- Prior month's KPI check-in at `engagements/[slug]/08-retainer/kpi/YYYY-MM.md`

## Inputs (ask if not supplied)

- **Engagement** — slug or path
- **Month** — ISO month (`2026-05`); defaults to last-completed calendar month if run on 1st-of-next
- **KPI values source** — one of:
  - `--owner-update [path]` — markdown file with the owner's written update on each register item
  - `--system-export [path]` — CSV/xlsx exported from client's PM tool (Jira, Asana, Monday, Notion) that maps register row IDs to status updates
  - `--ask` (default) — no source supplied; skill drafts the owner-update ask email + waits; pull from reply once delivered

---

## Process

### 1. Ingest the engagement state

Read:
- Action register (source of truth for register rows + their initial commitments)
- Prior month's KPI check-in (for trajectory)
- Engagement profile (retainer tier — Active Advisory $10–25k+/mo / Light Coaching $1k/mo)

Extract:
- Register rows + current status (from prior month or blank if first cycle)
- Critical / High / Medium item counts
- Cadence commitments (Active Advisory = monthly sync; Light Coaching = 1 meeting/month at that tier)

### 2. Pull KPI values

Three modes handle the "how do we know what moved" problem:

#### `--owner-update` mode

Read the owner's written update file. Expected structure (if template was used — flag if not):

```markdown
## Register row 1: [recommendation]
Status: [On track / At risk / Slipped / Delivered]
Update: [1–3 sentences on what happened this month]
Blockers: [if any]
```

Parse each row. Map to register IDs. Flag any register rows the owner didn't update.

#### `--system-export` mode

Read the CSV/xlsx. Expected columns (client PM tool-dependent):
- Row ID / title / status / updated-date / assignee / due

Map row IDs to register items; extract status changes since prior month; note any register rows missing from the export (possibly archived in the client's tool — flag).

#### `--ask` mode (default when no source supplied)

Draft an ask email to the engagement's primary client contact. Template:

```
Subject: [Firm] — monthly KPI update request

[First name],

For our [Month Year] KPI check-in, we need quick updates on the action register.
It's built to be low-effort for you — take 10–15 minutes, attach a voice memo
if writing is a pain, or forward screenshots from your PM tool. Whatever's
easiest.

For each of these [N] register items, where are we?

[List register rows with prior-month status]

Due: [date 5 business days out]. If the data's messy, that's okay — we'll sort
on our end. If something's completely stalled, just say so.

Jason and Joshua
```

Do not proceed with the monthly note until update is received.

### 3. Update each register row

For each row:
- **Status:** On track / At risk / Slipped / Delivered
- **Delta since last check-in:** what changed (verbal summary, not prose)
- **Current risk:** if status is At risk or Slipped — what's the specific blocker

Also compute aggregate counts:
- Delivered this month: N
- Still on track: M
- At risk: K (flag)
- Slipped: P (major flag)

### 4. Identify drift patterns

Patterns that matter month-over-month:

- **Stuck Critical item** — Critical register row at At Risk or Slipped for 2+ months in a row → escalate; the real constraint may not be moving
- **Dependency chain unraveling** — if Rec 1 is Critical and dependencies Rec 2/3 blocked while Rec 1 stalls → sequencing rewrite time
- **Unplanned items surfacing** — the owner / team are working on things not in the register → either scope-creep or real new priorities; flag
- **Owner-time creeping past 5%** — if the monthly update reveals owner is still approving every register-row action → FP #10 is alive and well; methodology signal
- **Positive acceleration** — if Delivered count is faster than plan → testimonial / case study harvest trigger

### 5. Draft the partner-voice monthly sync note

2 paragraphs, partner voice per `context/jirah-voice.md`:

```markdown
# [Client] — [Month Year] KPI Check-In

**Sent:** YYYY-MM-DD
**To:** [Owner name]

---

## What advanced

[1 paragraph — name the specific register items that moved. Numbers, not
adjectives. E.g., "Rec #3 — the GM hire — JD published, first two rounds
done, target-start April 1. Rec #7 — rate card rollout — live as of
[date], seeing first renewals under the new structure."]

## What's stuck + what we recommend

[1 paragraph — name stuck items directly; name the specific blocker;
state the recommended next move. E.g., "Rec #5 — decision-rights rewrite
for the partner group — stalled. Two partners pushed back at the March
sync. Recommending we convene a 60-minute governance conversation in the
first week of May; we'll draft the frame and facilitate. This is on our
critical path — everything downstream waits on governance clarifying."]

## Focus for [next month]

- [1–3 specific actions; owner on client side; deadline]

## Register appendix

[Updated register snapshot — same format as Step 5 deliverable, with
status column populated. xlsx export attached for client PM import.]

---

Jason and Joshua
JIRAH Growth Partners
```

### 6. Output

```
engagements/[slug]/08-retainer/kpi/
├── YYYY-MM-monthly-note.md          (partner-voice monthly note)
├── YYYY-MM-monthly-note.html        (rendered for send)
├── YYYY-MM-register-snapshot.xlsx   (updated register for PM import)
└── YYYY-MM-owner-update.md          (raw owner-update file if --owner-update mode)
```

OneDrive equivalent: `01 - Clients\Active\[ClientName]\08 - Monthly Retainer\`

Update engagement frontmatter:
- `last_kpi_cycle: YYYY-MM`
- `kpi_cycle_count: N`
- `register_delivered: <count>`
- `register_on_track: <count>`
- `register_at_risk: <count>`
- `register_slipped: <count>`
- `nextAction: [next check-in date, first of next month]`

### 7. Cross-skill triggers

Drift pattern triggers:
- **Stuck Critical item 2+ months** → flag to Jason; consider an internal partner-sync meeting outside the monthly cadence
- **Positive acceleration** → queue `/jirah-testimonial-ask` and `/jirah-case-study` triggers
- **Owner-time >5%** → surface as FP #10 re-emergence in the monthly note; add to next Discussion Document amendment if it persists
- **Unplanned items surfacing** → queue a scope-reset conversation for the next monthly sync

### 8. Output to chat

```
KPI Check-In — [Client] — [Month Year]

Register snapshot
- Delivered: N (↑/↓ vs prior month)
- On track: M
- At risk: K
- Slipped: P

Drift patterns
- [any detected from step 4]

Monthly note drafted at: [path]
Register snapshot xlsx: [path]

Next steps
- Internal review (Jason + Joshua)
- Send via /jirah-email --scenario general --target [slug]
- [If acceleration detected:] /jirah-testimonial-ask --trigger kpi-milestone
- [If stuck-Critical detected:] escalate to partner sync
```

---

## Voice rules (monthly note)

- Partner voice throughout — direct, specific, numbers over adjectives
- Name stuck items by row number + recommendation verbatim — no abstraction
- Recommended next move on every stuck item — never just a status report
- Proofs of discipline embedded: reference triangulation, the action register, the dependency chain — these are what the client is paying for
- Joint sign-off "Jason and Joshua" (the Active Advisory / extended-CEO voice)
- No hedging — if something's slipped, call it slipped; don't soften to "slightly behind"

## Retainer-tier calibration

- **Active Advisory** ($10–25k+/mo) — full monthly note, monthly sync meeting, proactive risk-flagging, extended-CEO posture
- **Light Coaching** (~$1k/mo — Hatch shape) — shorter monthly note, 1 in-person meeting, less proactive (they pay for lightweight accountability, not embedded operations)

The skill auto-detects tier from `engagement_shape` frontmatter and scales the note depth.

## Edge cases

- **First month after delivery** — no prior-month comparison; establish baseline; note "initial baseline month" in the note
- **Client hasn't implemented anything yet** (30 days post-delivery) — flag as normal for month 1; month 2 is when implementation-lag becomes a real signal
- **Owner unresponsive to update ask** — after 5 business days past due, escalate via `/jirah-email --scenario follow-up`; if still silent after 10 days, surface as engagement risk to Jason (not a skill output — a human decision)
- **Register has been substantially amended mid-retainer** (new Critical items added) — reshape the monthly note structure to cover both original + amended items; flag scope drift
- **Retainer has wound down** (client signaled intent to end) — final monthly note carries a "wrap-up summary" section; queue `/jirah-case-study` + `/jirah-testimonial-ask` + `/jirah-referral-ask`
- **PM-tool integration exists but data is inconsistent** (statuses in tool don't match reality) — always reconcile with owner-update when possible; PM-tool data is signal, not truth, for action-register tracking
- **Engagement is Parallel Strategic + AI** (S+A shape) — KPI tracker includes AI pilot weekly-status roll-up alongside strategic register; two tracks, one monthly note
- **Owner asks to skip a month** — honor it; flag in engagement frontmatter (`kpi_skipped: YYYY-MM`); cover a "rolling 2-month" check-in the following month

## Related

- Upstream: [`jirah-action-register`](../jirah-action-register/SKILL.md) (source of truth for register rows)
- Adjacent: [`jirah-email`](../jirah-email/SKILL.md) (for the update-ask and the send), [`jirah-ai-pilot-status`](../jirah-ai-pilot-status/SKILL.md) (rolls into monthly note for parallel AI track)
- Downstream: [`jirah-testimonial-ask`](../jirah-testimonial-ask/SKILL.md), [`jirah-case-study`](../jirah-case-study/SKILL.md), [`jirah-referral-ask`](../jirah-referral-ask/SKILL.md)
- Context: jirah-process.md, jirah-methodology.md, jirah-voice.md
- Cadence: monthly (scheduled trigger in Sprint 4)
