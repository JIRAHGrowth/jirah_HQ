---
name: jirah-kickoff-agenda
description: Step 3 — produce the 60–90 minute kickoff meeting agenda that launches the sprint, plus the internal post-kickoff prep notes. Aligns the client team on goals, confirms sprint dates + deliverables, locks the team-interview list, names the data asks. Use when the Discussion Document has been signed and kickoff is being scheduled, or when Jason or Joshua says "draft kickoff for X," "prep the Ironwood kickoff," "post-kickoff notes for Y."
---

# /jirah-kickoff-agenda

## Purpose

Wrap **Step 3**: the kickoff that launches the engagement. Two modes:
- `--prep` — before kickoff. Draft the agenda + data-ask checklist the client receives.
- `--post` — after kickoff. Internal notes capturing what was confirmed, what shifted, who's assigned what, risks introduced.

Cadence: 60–90 minutes. Triggers the sprint within 1–2 weeks. Joshua typically leads; Jason observes per dual-facilitator rule.

## Pre-requisites (read before drafting)

- [context/jirah-process.md](../../../context/jirah-process.md) — Step 3 purpose, cadence
- [context/jirah-methodology.md](../../../context/jirah-methodology.md) — dual-facilitator, data-pull discipline, triangulation prerequisites
- [context/jirah-voice.md](../../../context/jirah-voice.md) — formal agenda voice
- [context/jirah-visuals.md](../../../context/jirah-visuals.md) — Mode A (agenda is internal-facing client doc; Mode A)
- The engagement's Discussion Document (signed version)
- Discovery synthesis notes

## Inputs (ask if not supplied)

- **Mode** — `--prep` | `--post` | `--both`
- **Engagement** — slug or path to `engagements/[slug]/` / OneDrive `01 - Clients\Active\[ClientName]\`
- **Kickoff date + time** — required for `--prep`; pulled from frontmatter if set
- **Attendees** — client side + Jirah side; Claude can read from discovery notes or ask

---

## Mode: `--prep`

### 1. Ingest the engagement state

Read:
- Discussion Document (signed)
- Discovery synthesis
- Engagement profile frontmatter (`01 - Engagement Plan.md` or equivalent)
- Any follow-up correspondence between Discussion Doc send and now

Confirm these are current:
- Engagement shape
- Sprint dates (or a range)
- Confirmed attendee list on both sides

### 2. Build the 60–90 minute agenda

Standard structure, shaped per engagement specifics:

```markdown
# Kickoff — [Client name] × JIRAH Growth Partners
**Date:** YYYY-MM-DD, [start–end]
**Location:** [on-site / virtual / hybrid]
**Client attendees:** [names + roles]
**JIRAH attendees:** Jason Lotoski (Partner), Joshua Marshall (Partner)
**Duration:** 60–90 min

---

## Agenda

### 1. Welcome + context (5 min) — Joshua
Why we're here. Reminder of what the Discussion Document scoped.

### 2. Goals confirmation (10 min) — Joshua + Owner
Re-confirm the 3 outcomes this engagement is committing to.
Anything changed since Discussion Document sign-off?
Confirm engagement shape is still right.

### 3. Sprint design (15 min) — Joshua
- Dates: [specific days]
- Duration: [1, 2, or 3 days per shape]
- Format: on-site / hybrid
- Who attends which session
- Fireflies.ai transcription on ALL sessions (name this explicitly — it's a methodology marker, not an admin footnote)
- Jason's observer role ("Joshua runs the room, Jason takes notes on pattern signals")

### 4. Team interviews + data asks (15 min) — Joshua + Jason
Per triangulation rules in jirah-methodology.md: we need owner + 2+ team + external/data for High confidence.

**Team interview list** — shape this with the client:
- 6–10 stakeholders by role (ops lead, finance lead, longest-tenured IC, top biller, customer-service lead, recent hire, etc.)
- 45-min slots
- Who books them (client admin typically)

**Data asks** — concrete list with due dates:
- 3-year financial snapshot (P&L by service line if possible)
- Org chart (current + historical if available)
- Client concentration list (top 10 by revenue)
- Partnership agreement or governance doc
- Current strategic plan if one exists
- Any prior consultant reports (bring out the skeletons)
- Employee survey data if any was done in last 24 months
- Customer feedback / NPS data if captured
Specific asks vary by engagement shape.

### 5. Partner introductions — both sides (10 min)
Round-table: who are you, what's your lane, what would you want us to know about you before we walk into the sprint.
Value beyond social — surfaces decision rights + informal authority.

### 6. Communication + cadence (10 min) — Joshua
- Primary contact on client side (usually owner or COO)
- Primary contact on Jirah side (Jason for commercial + timeline; Joshua for methodology + facilitation)
- Cadence: weekly written update during triangulation phase, daily during sprint
- Post-report cadence: monthly for KPI Tracking phase

### 7. Q&A + next steps (5–10 min)
- Confirm sprint dates locked
- Confirm team-interview scheduler assigned on client side with deadline
- Confirm data-ask owner on client side with deadline
- Name the next calendar check-in (usually pre-sprint data-review, 1 week before sprint)
```

### 3. Data-ask checklist (separate deliverable)

Generate a one-page checklist the client can run in parallel after kickoff. Same content as section 4 above, but formatted as a standalone trackable doc:

```markdown
# [Client] — Data & Interview Checklist
**Delivered:** YYYY-MM-DD (kickoff date)
**Due by:** YYYY-MM-DD (1 week before sprint start)

## Data asks
| Item | Owner | Due | Status |
|---|---|---|---|
| 3-year P&L | [client CFO name] | [date] | ☐ |
| ... |

## Team-interview targets
| Name | Role | Booked? | Date |
|---|---|---|---|
| TBD | Ops lead | ☐ |
| ... |

## External checks we may need from you
- Permission to contact: advisors / board members / former employees
- Specific names if available
```

### 4. Output

```
engagements/[slug]/02-kickoff/
├── [slug]-kickoff-agenda.md
├── [slug]-data-interview-checklist.md
└── [slug]-kickoff-internal-prep.md
```

OneDrive equivalent: `01 - Clients\Active\[ClientName]\06 - Sprint & Facilitation\` per the per-client folder convention.

Internal prep note (pre-kickoff, Jirah-only):
```markdown
# Pre-kickoff brief — [Client]

## What we're carrying into the room (from discovery)
- Top-3 friction-point hypotheses (Medium confidence until sprint + triangulation)
- Pattern-library match
- Specific probing questions to slip into the kickoff

## Partner-side agreements
- Joshua leads sections 1–5, Jason leads 6
- Jason's observer role: who goes quiet when [topic] comes up
- Escalation: if governance disagreement surfaces in kickoff, redirect to 1:1 follow-up (don't work it in the room)

## Data-ask priority ranking
- Critical (must have before sprint): [list]
- High (have or flag gap in sprint): [list]
- Medium (nice-to-have): [list]

## Risks introduced by this kickoff
- [specific risk — e.g., owner already signaling they want to dilute scope; watch Section 2]
```

Update engagement frontmatter: `currentStep: 2`, `kickoff_date: YYYY-MM-DD`.

---

## Mode: `--post`

### 1. Ingest kickoff material

Sources:
- Fireflies transcript of the kickoff (preferred — hand to [`jirah-session-analyzer`](../jirah-session-analyzer/SKILL.md) first)
- Jason's observer notes
- Joshua's post-meeting summary
- Any real-time scope shifts that happened in the room

### 2. Draft post-kickoff internal note

Internal-only, not client-facing:

```markdown
# Post-kickoff internal note — [Client] — YYYY-MM-DD

## What was confirmed
- [specific items — sprint dates, interview count, data-ask deadlines]

## What shifted from Discussion Document
- [any scope changes — flag as material or immaterial]

## Risks introduced
- [items that emerged during kickoff]

## Who's assigned what
| Item | Owner | Deadline |
|---|---|---|
| Book team interviews | [client person] | [date] |
| Send P&L | [client CFO] | [date] |
| ... |

## Language / pattern observations (Jason's lane)
- [signal moments — defensiveness when X topic came up, etc.]
- [contradictions between owner and operations lead in the room]

## Updated hypotheses going into sprint
- [top-3 friction points — may have reshuffled after kickoff]

## Next Jirah action
- [pre-sprint data-review meeting: date]
- [sprint-prep skill invocation: /jirah-sprint-facilitation --prep]
```

### 3. Update engagement frontmatter

- `kickoff_status: complete`
- `sprint_dates: [YYYY-MM-DD to YYYY-MM-DD]` (confirmed)
- `team_interview_count: N`
- `data_asks_count: M`
- `nextAction: [pre-sprint review date]`

### 4. Output to chat

```
Post-kickoff — [Client] — [kickoff date]

Confirmed: [1-line summary]
Shifts: [any scope changes — material flag]
Risks: [top 1–2]
Assigned: [count of owners + deadlines]

Next: /jirah-sprint-facilitation --prep for sprint [dates]
```

---

## Mode: `--both`

Runs `--prep` first. After kickoff, when Jason says "post-kickoff notes for X," runs `--post` on the same engagement folder, appending to the same `02-kickoff/` directory.

---

## Voice rules

- Formal in the client-facing agenda (Mode A voice — direct, authoritative, structured)
- Plain-speak in the internal notes (no polish needed; Jason + Joshua are the only readers)
- Proofs of discipline embedded — mention Fireflies transcription, dual-facilitator role split, triangulation prerequisites explicitly in the agenda

## Edge cases

- **Kickoff is virtual instead of on-site** — Fireflies still runs, but call out "we recommend cameras on for the partner-introduction section" in the agenda.
- **Client added attendees not discussed in discovery** — flag in internal prep ("new attendee [name]: unclear lane"). Partner decides whether to adapt agenda.
- **Owner wants to skip team interviews** — agenda should include a 5-min "why triangulation" mini-section in Section 4 explaining the methodology. Refer back to Discussion Document commitments.
- **Kickoff gets scheduled at short notice** (<1 week) — shorten the agenda to 60 min, cut sections 5 and 6 (handle async via email), keep sections 1–4 and 7.
- **Post-kickoff: material scope shift happened in the room** — draft a Discussion Document amendment before the sprint starts. Do NOT silently absorb scope.
- **Post-kickoff: partner-disagreement surfaced in the room** (owner + cofounder disagree visibly) — this is a governance-signal finding; route to `jirah-triangulation` planning immediately rather than waiting for sprint.

## Related

- Upstream: [`jirah-discussion-document`](../jirah-discussion-document/SKILL.md) (signed version triggers kickoff)
- Downstream: [`jirah-sprint-facilitation`](../jirah-sprint-facilitation/SKILL.md) (next step after post-kickoff)
- Adjacent: [`jirah-session-analyzer`](../jirah-session-analyzer/SKILL.md) (processes Fireflies transcript of kickoff), [`jirah-email`](../jirah-email/SKILL.md) (agenda send-ahead)
- Context: jirah-process.md, jirah-methodology.md, jirah-voice.md, jirah-visuals.md
