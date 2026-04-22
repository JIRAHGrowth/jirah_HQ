---
name: jirah-daily-briefing
description: Scan all active clients, prospects, and audit applications; surface overdue follow-ups, sprint risks, warm prospects worth nurturing; draft suggested replies; write briefings/YYYY-MM-DD.md. Invoke when Jason says "daily briefing", "what's on my plate", or on the scheduled trigger.
---

# /jirah-daily-briefing

## Purpose
Produce today's partner briefing — the ops surface that tells Jason and Joshua what needs their attention this morning. Feeds the dashboard's right-rail briefing panel.

## Pre-requisites

Read before acting:
- [context/jirah-voice.md](../../../context/jirah-voice.md) — for drafted replies
- [context/jirah-methodology.md](../../../context/jirah-methodology.md) — for the "why this matters" framing

## Inputs
- None (automatic; pulls from OneDrive state)
- Optional: `--date YYYY-MM-DD` to regenerate for a specific day

## Process

1. **Compute today's date** (America/Vancouver).
2. **Resolve OneDrive root** — read `ONEDRIVE_ROOT` from `dashboard/.env.local` (same mechanism the dashboard uses). If unset, stop and ask the user to configure it — do not silently produce a fake briefing.
3. **Scan sources** under `[ONEDRIVE_ROOT]`:
   - `01 - Clients\Active\*\00 - Profile.md`
   - `02 - Sales & Pipeline\Prospects\*\00 - Profile.md` (skip `_template`)
   - `02 - Sales & Pipeline\Audit Applications\*\00 - Profile.md` (skip `_template`)
4. **Parse frontmatter** — extract `stage`, `owner`, `lastContactDays`, `nextAction`, `milestone`, `dueLabel`, `warn`, `status`, `icp`, `currentStep`.
5. **Categorize**:
   - **Overdue follow-ups** — prospects/clients with `lastContactDays > 7` OR `nextAction` date in the past. Top 5 by staleness × stage priority (proposal > booked > warm > cold).
   - **Sprint risks** — engagements with `warn: true` OR `currentStep` in 3–4 with milestone due within 5 days OR `lastContactDays > 7` in-engagement.
   - **Warm prospects to nurture** — stage `warm` with `lastContactDays` 4–14. Top 3.
6. **Draft a partner-voice reply** for each item (short, specific, references what was committed and what's next). Voice rules come from `context/jirah-voice.md` — direct, factual, no marketing fluff, numbers > adjectives.
7. **Write to `briefings/YYYY-MM-DD.md`** with this structure:

```markdown
---
date: YYYY-MM-DD
generated: ISO timestamp
counts:
  overdue: N
  sprint: N
  warm: N
---

# Briefing — Weekday, Month Day

> Partner sync · 8:30 AM PT · Prepared by Claude

## Overdue ({N})

### [Contact] — [Company]
- **When:** N days
- **Context:** [what was committed, what's happened since]
- **Drafted reply:**

> [embedded draft — 2-4 sentences, partner voice]

## Sprint Risks ({N})

### [Client]
- **When:** [milestone + due]
- **Context:** [what's at risk, what's outstanding]
- **Action:** [what Jason or Joshua needs to do]

## Warm Prospects ({N})

### [Contact] — [Company]
- **When:** N days
- **Context:** [why warm, what signal]
- **Drafted follow-up:**

> [embedded draft]

---

*Briefing regenerates at 6am daily from pipeline, engagements, and inbox signal.*
```

7. **Report back** — echo path to new briefing + a 3-line summary (N overdue / N sprint risks / N warm).

## Output

- `briefings/YYYY-MM-DD.md`
- 3-line summary to chat

## Edge cases

- No overdue / no risks / no warm — still write the file; use "None today." for empty sections (dashboard expects sections to exist).
- First run with no data — write a minimal briefing noting sources are empty + how to seed.
- `ONEDRIVE_ROOT` unset or path unreachable — error out cleanly, don't silently produce a fake briefing.
- If `--date` is in the past, label it clearly: "Retrospective briefing for YYYY-MM-DD (generated today)".
