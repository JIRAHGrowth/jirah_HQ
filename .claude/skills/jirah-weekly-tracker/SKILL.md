---
name: jirah-weekly-tracker
description: Rolling weekly (Active Advisory) or monthly (Light Coaching) progress tracker for retainer clients. Word artifact + markdown canonical source. Initiative-level, register-row-aligned, Last-week-done / This-week-in-flight / Next-2-weeks-committed format. Seeds from Strategic Report + Expansion/Execution Plan + gantt on first run; each cycle updates from the latest Fireflies working-session transcript. Sits between /jirah-meeting-notes (per-session hygiene) and /jirah-kpi-tracker (monthly owner sync). Use on the Friday-after-Tuesday-session trigger (Genesis shape), first-of-month trigger (Hatch shape), or when Jason or Joshua says "weekly tracker for X," "update the Genesis tracker," "monthly tracker for Hatch," "tracker update on [client]."
---

# /jirah-weekly-tracker

## Purpose

The live operational tracker for the retainer phase. Keeps the weekly working session honest by surfacing:

1. **Last week / last month — what shipped** (evidence, not adjectives)
2. **This week / this month — in flight** (what the session committed to)
3. **Next 2 weeks / 2 months — committed** (gantt-aligned forward look)
4. **Stuck** (2+ cycles in flight without movement → flagged with specific blocker)
5. **New since last cycle** (items surfaced in session but not in the register → scope signal)

Initiative-level, NOT task-level. Register-row-aligned. The action register remains source of truth — this tracker is the weekly snapshot of register-row movement, not a parallel system.

Sits between two existing skills:
- `/jirah-meeting-notes` runs per session (decision-level hygiene + follow-up email)
- `/jirah-kpi-tracker` runs monthly (owner-facing sync note, register aggregate)
- `/jirah-weekly-tracker` runs weekly or monthly depending on tier — the operational view that both of the above feed from/into

## Cadence by tier

| Tier | Client example | Cadence | Window |
|---|---|---|---|
| Active Advisory (~$15k–$25k/mo) | Genesis | **Weekly** (Friday after Tuesday session) | Last week / This week / Next 2 weeks |
| Light Coaching (~$1k/mo) | Hatch | **Monthly** (first of month) | Last month / This month / Next 2 months |

Auto-detects tier from engagement profile (`contract` line in `00 - Profile.md`). Override with `--cadence weekly|monthly`.

## Pre-requisites (read before running)

- [context/jirah-process.md](../../../context/jirah-process.md) — Step 6 retainer cadence
- [context/jirah-methodology.md](../../../context/jirah-methodology.md) — action-register format, triangulation, ~5% owner-time rule
- [context/jirah-voice.md](../../../context/jirah-voice.md) — partner voice for the tracker prose
- [context/jirah-friction-points.md](../../../context/jirah-friction-points.md) — FP tags for each register row
- Engagement profile (`00 - Profile.md`) — tier, sponsor, retainer shape
- Engagement plan (`01 - Engagement Plan.md`) — 12-month milestones + KPIs
- Action register (`07 - Deliverables/Final/`) if one exists — register rows + priority
- Most recent prior tracker in target folder — if this is an update cycle

## When to invoke

- Friday-after-Tuesday-session trigger (Genesis weekly)
- First-of-month trigger (Hatch monthly)
- Jason or Joshua says: "weekly tracker for [client]," "update the Genesis tracker," "monthly tracker for Hatch," "tracker update on [client]"
- First run on a newly-signed retainer — explicit `--init` flag to seed from source docs
- Ad-hoc mid-cycle re-draft when significant movement warrants a re-send

## Inputs

**Required:**
- `--engagement` — client slug or folder path

**Conditional:**
- `--transcript [path]` — latest Fireflies transcript. Required for `--update` mode. Optional for `--init` (skip if kickoff hasn't happened).
- `--init` — explicit flag to ignore any existing tracker and re-seed from source docs
- `--ask` — if update mode is inferred but no transcript supplied, draft the "please send the transcript" ask instead of proceeding

**Optional:**
- `--cadence weekly|monthly` — override tier auto-detection
- `--week YYYY-MM-DD` — Monday date of target week (default: next Monday if run Fri/Sat/Sun; else current Monday)
- `--report [path]` — Strategic Report (auto-resolves to `07 - Deliverables/Final/*Strategic Report*.docx` if empty)
- `--plan [path]` — Expansion or Execution Plan (auto-resolves to `07 - Deliverables/Final/*Expansion Plan*.docx` if empty)

---

## Process

### Mode: `--init` (first run on a new retainer)

#### 1. Ingest engagement state

Read:
- `00 - Profile.md` — tier, sponsor, cadence, retainer shape, out-of-scope referrals
- `01 - Engagement Plan.md` — 12-month milestones, anchor KPIs, weekly session structure
- Strategic Report (Word/PDF) — extract action plans, friction-point mapping, KPI targets
- Expansion/Execution Plan (Word/PDF) — extract gantt phases, milestone target dates
- Action register if it exists — register rows, owner, priority, dependencies

#### 2. Build the unified initiative list

Merge source-doc milestones into a single deduped initiative set. One row per initiative:

| Field | Source | Notes |
|---|---|---|
| Register ID | Action register if present; else mint `WT-001`… | Stable across cycles |
| Initiative name | Verbatim from report/plan | No paraphrasing |
| Friction point | Mapped to the 10-FP framework | From report or inferred |
| Owner | Jirah / Client / Shared | From action register or report |
| 12-month milestone | M3 / M6 / M9 / M12 | Derived from target date |
| Start date | Gantt | ISO |
| Target date | Gantt | ISO |
| Priority | Critical / High / Medium | From action register or inferred from report emphasis |
| Status | Not started / In flight / Delivered / At risk / Slipped / Deprioritized | Default: Not started |

Dedupe aggressively — if both report + plan reference the same initiative, collapse to one row.

#### 3. Generate the first tracker

Sections (same shape as update mode — see **Word document format** below):
- Focus callout — 2–3 partner-voice sentences framing what this cycle is about
- **Last week / last month** — skip in pure init, OR populate from kickoff session decisions if init follows a kickoff
- **This week / this month in flight** — 3–5 initiatives scheduled to start in the current cycle window, status = In flight
- **Next 2 weeks / 2 months** — initiatives scheduled to start in the next 2 cycle windows
- **Parking lot** — register rows deferred to later milestones (M6+)
- **Stuck / New since last cycle** — empty in init; present as scaffold headings

#### 4. Write outputs

Genesis-shape (weekly):
- Canonical markdown: `08 - Monthly Retainer/Weekly Trackers/YYYY-MM-DD-weekly-tracker.md`
- Shareable Word: `08 - Monthly Retainer/Weekly Trackers/YYYY-MM-DD-weekly-tracker.docx`

Hatch-shape (monthly):
- Canonical markdown: `08 - Monthly Retainer/Monthly Trackers/YYYY-MM-monthly-tracker.md`
- Shareable Word: `08 - Monthly Retainer/Monthly Trackers/YYYY-MM-monthly-tracker.docx`

The `.md` is the skill's re-entry point on the next cycle; the `.docx` is what gets shared/edited by the client.

Create the `Weekly Trackers/` or `Monthly Trackers/` folder if it doesn't exist.

### Mode: `--update` (recurring cycle — the common case)

#### 1. Load prior tracker + transcript

- Read the most recent `*-tracker.md` in the target folder
- Read the supplied Fireflies transcript (or fall back to `--ask` if missing)
- Read engagement profile + plan for tier/milestone context

#### 2. Roll forward each initiative

For every row in prior tracker's "This week in flight" list:
- Scan transcript for mentions of that initiative (name, register ID, or keyword match)
- Mark status: **Delivered** / **On track** / **At risk** / **Slipped** / **Deprioritized**
- Pull 1 sentence of evidence — verbatim quote or close paraphrase with timestamp
- Move to "Last week" section

For prior tracker's "Next 2 weeks" list:
- Promote Week N+1 rows to "This week in flight"
- Keep Week N+2 rows in "Next 2 weeks"
- Pull new Week N+3 rows from gantt + session commitments → append to "Next 2 weeks"

#### 3. Detect drift signals

| Signal | Trigger | Action |
|---|---|---|
| Stuck 2+ cycles | Initiative "In flight" in both current + prior tracker without Delivered | Move to **Stuck / At risk** section with specific blocker + recommended next move |
| Slipped Critical | Critical priority row marked Slipped | Flag to monthly `/jirah-kpi-tracker` for owner-level escalation |
| Scope creep | Session committed to work not tied to any register row | Add row tagged `[NEW — not in register]`; flag in **New since last cycle** |
| Owner-time drift | Transcript shows owner approving micro-decisions | Flag FP #10 re-emergence in monthly `/jirah-kpi-tracker` notes |
| Positive acceleration | Delivered count ahead of gantt | Queue `/jirah-testimonial-ask` + `/jirah-case-study` harvest triggers |
| Scope creep 3+ cycles | `[NEW]` items recurring | Escalate to Discussion Document amendment conversation |

#### 4. Generate the tracker

Same Word-document structure as init, but with:
- Filled-in "Last week" section (evidence column populated)
- Stuck rows flagged with ⚠ + blocker column
- Scope-creep callouts
- Partner-voice focus callout written for this specific cycle's arc

#### 5. Voice pass

Partner voice per [context/jirah-voice.md](../../../context/jirah-voice.md):
- Numbers over adjectives — "Estimating SOP v1 drafted + circulated to 3 PMs" beats "good progress on SOPs"
- Name slipped items + specific blocker — no softening to "slightly behind"
- Recommended next move on every stuck row — never just a status label
- Reference register IDs + friction points explicitly — this is what the client pays for
- Never invent detail the transcript doesn't support
- Joint sign-off "Jason and Joshua" when both partners were in session; single-partner when solo

#### 6. Write outputs

Same path + dual-file (`.md` + `.docx`) convention as init mode. New file per cycle; prior-cycle markdown stays in place as the trail.

---

## Word document format

Mode A styled (JIRAH-branded — internal living doc). Single Word file, 3–5 pages.

### Section order

1. **Header**
   - JIRAH lockup top-left, client name top-right (Mode A — JIRAH is home team)
   - Week of / Month of: YYYY-MM-DD
   - Session date (if applicable)
   - Author: "Jason + Joshua" or single partner who ran session

2. **Focus callout** (1 short paragraph, partner voice)
   - 2–3 sentences framing the cycle's arc. Skip on pure maintenance cycles.

3. **Last week / last month — what shipped**

   | Initiative | Register ID | Status | Evidence |
   |---|---|---|---|
   | Bid SOP v1 draft | GEN-R03 | Delivered | "Joshua circulated v1 to Trent + 2 PMs Thu — comments due Mon" |

   - Checkmark prefix on Delivered rows
   - Italic or strike-through for Deprioritized

4. **This week / this month — in flight**

   | Initiative | Owner | Register ID | FP | Status | Update |
   |---|---|---|---|---|---|
   | Alberta hire scorecard | Jirah | GEN-R07 | #5 | In flight | First draft with Trent Tue; recruiter intro Thu |

   - Stuck 2+ cycles rows prefixed ⚠ with a blocker column

5. **Next 2 weeks / 2 months — committed**

   | Initiative | Owner | Target | Depends on |
   |---|---|---|---|
   | Regional Manager JD | Shared | 2026-05-15 | Roles + decision rights signed off |

6. **Stuck / At risk** *(conditional)*
   - Bullet list — initiative name, specific blocker, recommended next move
   - No vague "needs attention" — every row ends with a concrete action

7. **New since last cycle** *(conditional)*
   - Bullet list of `[NEW]` items surfaced in session
   - Flag whether each is real-new-priority or scope creep

8. **Parking lot / deferred**
   - Bullet list of register rows pushed to later milestones

9. **Footer**
   - Register snapshot reference ("See 07-Deliverables/Final/Action-Register.xlsx")
   - Next session date
   - Generated timestamp

---

## Word generation (how the .docx gets produced)

Primary path — **pandoc** converts the generated markdown to Word:

```bash
pandoc "<path>.md" \
  --reference-doc="<jirah-word-template>.docx" \
  -o "<path>.docx"
```

Reference Word template lives at `.claude/skills/jirah-weekly-tracker/assets/jirah-tracker-reference.docx` (to be added — contains JIRAH Mode A styles: Inter headings, table styling, brand colors). Until the reference doc is built, pandoc uses its default styling and Joshua touches up the logo placement manually.

**Fallback if pandoc is not installed:** write the `.md` only; surface a chat warning that `.docx` generation was skipped; instruct the user to open the `.md` in Word (File → Open → select `.md`, Word converts on open) and Save As `.docx`. Long-term fix: install pandoc on both partner machines (`winget install pandoc`).

---

## Voice rules (tracker prose)

Extends [context/jirah-voice.md](../../../context/jirah-voice.md):

- Partner voice throughout — direct, specific, peer-to-peer
- Table cells short — 10 words max where possible
- Numbers over adjectives — "$118k margin uplift Q1" beats "strong quarter"
- No hedging — Slipped means slipped; At Risk means a specific blocker is named
- Reference register IDs + friction points explicitly
- Stuck rows always end with a recommended next move
- Never invent detail the transcript doesn't support — if ambiguous, flag for confirmation
- Joint "Jason and Joshua" signature on weekly sends where both in session; single-partner otherwise

---

## Relationship to other skills

| Skill | Cadence | Granularity | Audience | Role |
|---|---|---|---|---|
| `/jirah-meeting-notes` | Per session | Decisions + action items | Internal + follow-up email | Meeting hygiene |
| `/jirah-weekly-tracker` | Weekly / monthly | Initiative (register-row) | Shared working doc | **Operational state** |
| `/jirah-kpi-tracker` | Monthly | Register aggregate | Owner sync note | Executive view + drift detection |
| `/jirah-action-register` | One-shot (Step 5) | Register row (source of truth) | Deliverable | Ground truth |

The weekly tracker operationalizes what the action register committed to; its weekly movement data rolls up into the monthly `/jirah-kpi-tracker` note. The register itself is only amended at quarterly step-backs — weekly drift shows up here, not in the register.

---

## Output to chat

```
Weekly Tracker — [Client] — Week of YYYY-MM-DD

Delivered last cycle:   N
On track this cycle:    M
At risk / Stuck:        K
Slipped:                S
New since last cycle:   P

[If K > 0 or S > 0:] ⚠ [list flagged initiatives with one-line blocker]
[If P > 0:]          ⚠ Scope signals: [list new items]

Files:
- Canonical markdown: <path>
- Shareable Word:     <path>

Next steps:
- Internal review (Jason + Joshua)
- Send to [sponsor] via /jirah-email --scenario general --target [slug]
- [If stuck-Critical detected:] flag for next /jirah-kpi-tracker cycle
- [If acceleration detected:]   queue /jirah-testimonial-ask / /jirah-case-study
```

Update engagement frontmatter after run:
- `last_tracker_cycle: YYYY-MM-DD`
- `tracker_cycle_count: N`
- `tracker_delivered_cumulative: <count>`
- `tracker_stuck_current: <count>`
- `nextAction: [next tracker date — Tue-session-plus-3 for weekly, 1st-of-next-month for monthly]`

---

## Edge cases

- **First run post-kickoff** — run in `--init`; populate "Last week" from kickoff decisions if they happened in the prior window. Focus callout references the kickoff explicitly.
- **Pandoc not installed** — write `.md` only, chat-warn, instruct manual Word conversion. Do not block the skill.
- **Transcript not available** — `--ask` mode drafts the "please send the Tuesday transcript" email; don't proceed with update until transcript lands.
- **Client edited the shared .docx between sessions** — `.docx` edits are NOT re-ingested (hard to parse reliably). Canonical source stays the `.md`. Joshua/Jason copy meaningful client edits back into the `.md` before the next cycle, or pass them via `--transcript` alongside the Fireflies file. Flag this expectation in the init run.
- **Parallel Strategic + AI engagement** (Genesis shape) — this tracker covers the strategic-execution track only. The AI pilot has its own `/jirah-ai-pilot-status` weekly status doc. The monthly `/jirah-kpi-tracker` rolls both together.
- **Mid-engagement tier change** (Active → Light, or the inverse) — re-run with explicit `--cadence` override; the focus callout names the shift so the cadence change is legible.
- **Session cancelled** — skip the cycle; keep prior tracker in place; next cycle covers a 2-cycle look-back.
- **Engagement wound down** (owner signalling end of retainer) — final tracker carries a "wrap-up summary" section; queue `/jirah-case-study`, `/jirah-testimonial-ask`, `/jirah-referral-ask`.
- **Scope-creep `[NEW]` items recurring 3+ cycles** — escalate: draft a Discussion Document amendment for the next monthly sync.
- **Hatch migrating from legacy Monthly Meeting docs** — first Hatch run uses `--init` against the latest legacy Monthly Meeting doc as the `--transcript` input (parses action items + decisions the same way); subsequent runs follow normal monthly cadence.

---

## Related

- Upstream: [`jirah-action-register`](../jirah-action-register/SKILL.md) (source of truth), [`jirah-kickoff-agenda`](../jirah-kickoff-agenda/SKILL.md) (defines initial register), [`jirah-discussion-document`](../jirah-discussion-document/SKILL.md) (scope reference for amendment triggers)
- Peer: [`jirah-meeting-notes`](../jirah-meeting-notes/SKILL.md) (per-session hygiene), [`jirah-ai-pilot-status`](../jirah-ai-pilot-status/SKILL.md) (AI-pilot weekly parallel track), [`jirah-session-analyzer`](../jirah-session-analyzer/SKILL.md) (optional deep pattern pass on the transcript)
- Downstream: [`jirah-kpi-tracker`](../jirah-kpi-tracker/SKILL.md) (monthly aggregate + owner sync note), [`jirah-email`](../jirah-email/SKILL.md) (for sends), [`jirah-testimonial-ask`](../jirah-testimonial-ask/SKILL.md), [`jirah-case-study`](../jirah-case-study/SKILL.md)
- Context: jirah-process.md, jirah-methodology.md, jirah-voice.md, jirah-friction-points.md
- Cadence: weekly (Active Advisory) / monthly (Light Coaching) — scheduled trigger recommended once the skill is proven
