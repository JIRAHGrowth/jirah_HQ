---
name: jirah-ai-pilot-status
description: Produce the weekly AI-pilot status document that enforces Jirah's "every week ends with something demo-able" promise. Reads the pilot plan + prior weeks' statuses, drafts a 1-page weekly update — demo artifact shipped this week, Plan A/B state (locked or decision trigger status), risks (new / resolved / persistent), next week's commitment. Mode B styled. Use every Friday of a live pilot, or when Jason says "draft pilot status for week N," "update the [pilot] status," or on the scheduled Friday trigger.
---

# /jirah-ai-pilot-status

## Purpose

Enforce the "every week ends with something demo-able" promise baked into Jirah's AI pilot model. This skill is the **weekly demo-beat artifact** — a 1-page status the client can read in 3 minutes and know where the pilot stands.

**Not a project-management update.** Not a long narrative. One page, demo-first, risk-honest, commitment-forward.

## Pre-requisites (read before drafting)

- [context/jirah-voice.md](../../../context/jirah-voice.md) — Plan A/B discipline, weekly demo rule, risks + mitigations
- [context/jirah-visuals.md](../../../context/jirah-visuals.md) — Mode B (client brand primary)
- The pilot plan + technical scope at `engagements/[slug]/09-ai-pilot/`
- All prior weekly statuses at `engagements/[slug]/09-ai-pilot/weekly/`

## Inputs (ask if not supplied)

- **Client / engagement** — slug / path
- **Week number** — 1, 2, 3, 4 (or higher for longer pilots); auto-increments if prior statuses exist
- **Source for this week's content** — if no explicit input, Claude reads:
  - Pilot plan (for the week-N deliverable commitment)
  - Evaluation harness logs if they exist
  - Any engineering notes in `engagements/[slug]/09-ai-pilot/engineering-log.md`
  - Ad-hoc: user pastes this week's summary in chat
- **Demo artifact** (required) — what was produced this week that the client can see? Screenshot path, sample output path, or descriptor. If nothing demo-able exists, the skill rejects and prompts for one — the whole point is the demo beat.

---

## Process

### 1. Validate the demo beat

**Non-negotiable check:** this week has a demo artifact.

If no demo exists:
- Output to chat: "No demo artifact provided. Every week of a Jirah pilot ends with something demo-able. If this week's work is purely setup / data wrangling, the demo is the setup itself — e.g., 'pipeline runs end-to-end on 5 sample inputs, output attached.' Ask for the demo before drafting status."
- Stop. Do not generate a placeholder.

### 2. Ingest pilot state

Read:
- Pilot plan (weekly deliverables section → what we committed to this week)
- Technical scope (Plan A / Plan B, Day-2 trigger)
- Prior weekly statuses (if any) to see trajectory

Extract:
- What was committed for this week
- What Plan (A or B) we're currently executing
- Day-2 trigger state (if week ≤ 1: was it crossed? if week ≥ 2: status locked)
- Risks mentioned in prior weeks (resolved / persistent / new)

### 3. Build the 1-page status structure

Keep it **one page**. This is not a long-form document.

```markdown
# [Client] AI Pilot — Week [N] Status
**Pilot:** [pilot name]
**Date:** YYYY-MM-DD (Friday of week N)
**Plan state:** Plan A — locked / Plan A — at decision trigger / Plan B — engaged

---

## 1. Demo shipped this week

**Artifact:** [1-sentence description + link / screenshot / sample output path]

**What this shows:** [1–2 sentences — what the client sees when they look at it]

**How to look at it:** [instructions — "open [link]," "see attached," "live at [url]," etc.]

## 2. Plan A vs Plan B status

[If week 1 before day 2:]
Plan A trial in progress. Day-2 decision trigger: [observable]. Current signal: [where we are].

[If Day-2 trigger has fired:]
**Day-2 decision:** Plan A — proceeding (or) Plan B — engaged.
**Reason:** [observable-signal result that triggered the decision]
**Implication:** [what this changes about weeks 2–4]

[If week 2+:]
**Plan A locked since week 1 day 2.** No change this week.
— or —
**Plan B engaged since week 1 day 2.** Current path: [shape].

## 3. Metrics (from evaluation harness)

This week's evaluation run:
- Hallucination rate: X% (target <2% for Plan A)
- Accuracy vs human baseline: X% (target >90% for Plan A)
- Cycle time per unit: X minutes (baseline was Y)
- Human review burden: X minutes per output

[If numbers are worse than prior week, call it out. Don't bury.]

## 4. Risks

### New this week
- [risk] — [mitigation in flight]

### Resolved since last week
- [risk that closed out]

### Persistent (from prior weeks)
- [risk still on the board] — [where the mitigation stands]

[If no risks changed, write: "No change from week [N-1] risk register."]

## 5. Next week commitment

**Week [N+1] goal:** [per pilot plan weekly deliverables]
**Demo artifact planned:** [specific — "harness report across 20 production units," "client-team training video," etc.]
**Client touchpoint this week:** [meeting, review session, training — with date]

## 6. Asks for client

- [data access items still pending]
- [decisions we need — "confirm senior reviewer for post-handoff approval layer by [date]"]
- [scheduling needs]

[If no asks: "None this week."]

---

**Jirah team:** Jason Lotoski, Joshua Marshall
**Next status:** [date of next Friday]
```

### 4. Apply Mode B visual rules

**Single-file HTML**, simpler than the pilot plan:
- Client brand palette + fonts (not Mode A)
- Fits on one printed page — if it runs longer, tighten
- "Prepared by Jirah" small lower-right
- Client logo top-left
- Sections are H2s; no fancy slide-deck chrome (this is a recurring status, not a proposal)
- Readable in 3 minutes

**Plus a markdown mirror** — clients often paste this into Slack / Teams / Outlook.

### 5. Voice rules

- Lead with the demo, not the narrative
- Numbers > adjectives on every metric
- Risks are honest — new risks surface the week they emerge, not when they become crises
- No "we made good progress" — replace with the specific shipped thing
- Never hedge on Plan state — it's either locked, at trigger, or Plan B engaged
- Commit to next week's demo explicitly (this is what prevents "nothing to show until week 4")

### 6. Output

```
engagements/[slug]/09-ai-pilot/weekly/
├── week-1-status.html
├── week-1-status.md
├── week-2-status.html
├── week-2-status.md
├── ...
└── week-N-status.{html,md}
```

Also update engagement frontmatter:
- `ai_pilot_current_week: N`
- `ai_pilot_plan_state: plan-a-locked | plan-a-trialing | plan-b-engaged`
- `ai_pilot_last_status_date: YYYY-MM-DD`

### 7. Draft accompanying email (optional)

Chain into `/jirah-email --scenario general` to produce a 3-sentence email that goes out with the status doc Friday afternoon:

> Subject: [Pilot name] — Week [N] status
>
> [First name],
>
> Week [N] wrapped. Demo attached/linked: [1-sentence on what the client should look at].
>
> [One line on Plan state or metric highlight.]
>
> Jason and Joshua

### 8. Output to chat

```
AI Pilot Status — [Client] — Week [N]

Plan state: [status]
Demo shipped: [1-sentence]
Metrics this week: [hallucination %, accuracy %, cycle time]
Risks: [count new / count resolved / count persistent]
Next week commitment: [1-sentence]
Client asks: [count]

Files
- HTML: [path]
- Markdown: [path]

Email draft (optional): /jirah-email --scenario general --target [slug] --body-from engagements/[slug]/09-ai-pilot/weekly/week-[N]-status.md
```

---

## Edge cases

- **Week of pilot had a blocker that cost most of the week** (data access slipped, model issue, client team unavailable) — ship status anyway. Demo = "nothing new shipped this week because [specific blocker]; here is our recovery plan and the week-[N+1] commitment still holds / slides to week [N+2]." Honest beats silent.
- **Day-2 trigger fired late** (took until week 1 day 5 to get the signal) — note in the week-1 status with explicit timeline; do not hide the timing slip.
- **Plan B was engaged and it's still working** — status format is unchanged; just keep reporting against Plan B's goal.
- **Client asked to skip a week's status** — draft anyway for Jirah's internal log; send only if client wants. Methodology discipline.
- **Pilot duration is longer than 4 weeks** — same format scales; week numbers just go higher.
- **Final week (week 4 or last)** — append a short "Pilot Close" section: recommendation to continue / extend / wrap. Names the retainer-or-handoff decision the client needs to make.
- **Harness metrics unavailable** (scaffolding week, no full evaluation yet) — say so explicitly in Section 3: "Week 1 — scaffolding in progress; first full evaluation run end of week 2."

## Related

- Upstream: [`jirah-ai-scoping`](../jirah-ai-scoping/SKILL.md), [`jirah-pilot-plan`](../jirah-pilot-plan/SKILL.md)
- Adjacent: [`jirah-email`](../jirah-email/SKILL.md) for the Friday email wrapper
- Cadence: Sprint 4 adds cron trigger Friday 16:00 that prompts Jason with week-N status draft
- Context: jirah-voice.md, jirah-visuals.md
