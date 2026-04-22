---
name: jirah-discovery
description: Step 1 of the 6-step engagement process. Prep for a 60-minute discovery call with a prospect OR synthesize the call after it happens into a fit decision + next step. Joshua leads the call, Jason observes. Use when Jason or Joshua says "prep for discovery with X," "synthesize the X discovery call," "do I have fit with Y?" or hands off a Fireflies transcript from a first client conversation.
---

# /jirah-discovery

## Purpose

Wrap **Step 1** of Jirah's 6-step engagement process. Two modes:
- `--prep` — before the call. Read the prospect file, generate hypotheses + question bank.
- `--synthesize` — after the call. Ingest notes or transcript, produce fit decision + next step.

Cadence: 60-minute call. Joshua leads. Jason observes (per `context/jirah-methodology.md` dual-facilitator rule). Exit criteria: ICP fit confirmed, owner willing to share data + make team available, both partners agree to proceed.

## Pre-requisites (read before running)

- [context/jirah-process.md](../../../context/jirah-process.md) — Step 1 exit criteria, cadence
- [context/jirah-methodology.md](../../../context/jirah-methodology.md) — dual-facilitator rule, triangulation standard
- [context/jirah-friction-points.md](../../../context/jirah-friction-points.md) — the 10 lenses, for hypothesis generation
- [context/jirah-icp-wedge.md](../../../context/jirah-icp-wedge.md) — ICP, wedge, Funnel 1 vs 2
- [context/jirah-pattern-library.md](../../../context/jirah-pattern-library.md) — pattern match for this prospect's shape

## Inputs (ask if not supplied)

- **Mode** — `--prep` | `--synthesize` | `--both` (default: ask)
- **Prospect** — prospect name or path to `prospects/[slug].md` or `audit-applications/[id].md`
- **Call date** — defaults to today for `--synthesize`, tomorrow for `--prep`
- **Source** (synthesize mode) — notes in chat, Fireflies transcript file path, or invoke `jirah-session-analyzer` on the transcript first

---

## Mode: `--prep`

### 1. Read prospect file

Pull stage, source, prior activity, known friction point signals. Note if they came from:
- Funnel 1 (local — lunch front door preceded, lighter pre-call lift)
- Funnel 2 (audit application — scoring rubric output already has wedge signal)
- Industry-pulse signal (specific trigger the email referenced)
- Warm referral (introducer notes)

### 2. Generate pre-call hypothesis brief

Top 3 likely primary friction points given the intake signals. For each:
- Why this point is likely (evidence from prospect file + pattern library)
- 2–3 diagnostic questions (sourced from `context/jirah-friction-points.md`)
- What we're listening for (owner's framing of the symptom vs. the underlying structure)

Always include FP #10 (Ownership Impact) in the probe set — this is the wedge and it surfaced in 4/4 pattern-library engagements.

### 3. Build question bank (8–10 questions)

Structure per the call arc:

```
Warm-up / context (2 questions)
  - "Tell me the last year — what's gone well, what's been harder than it should be?"
  - "Walk me through how you structure the business today."

Symptom framing (2 questions — listen for what they name)
  - "What's the single thing that — if it got easier — would change how you run the firm next year?"
  - "What have you already tried that didn't move the needle?"

Structural probing (3 questions — the diagnostic)
  - Role-specific to top-3 hypotheses. E.g., if top hypothesis is FP #5 Structure: "When a partner is out for two weeks, what bottlenecks?"

Wedge probe (1 question — FP #10)
  - "If you could be on vacation for 6 weeks next year and have it not hurt the business, what would need to be true?"

Commercial signal (1 question)
  - "What's made you reach out to us — specifically — now?"

Close / exit (1 question)
  - "If we worked together, what would success look like 12 months from now?"
```

### 4. Red flags to watch for

Generate a list of 4–6 tuned to this prospect:
- Owner describes every problem as "a people problem" (typical deflection from FP #10)
- Can't name an ops lead / GM role (missing-middle signal)
- Revenue target drives the conversation, not capacity / structure (symptom-framing)
- Can't commit to team interviews (audit / sprint will be constrained)
- Has worked with multiple consultants in the last 3 years with nothing sticking (change fatigue, FP #8)
- Partner disagreement visible between the owner we're on with and a cofounder (governance risk)

### 5. ICP confirmations needed

List what we still need to verify on the call (or shortly after):
- Actual staff count
- Actual revenue band
- Owner-run confirmation (not PE-owned, not a division of a larger firm)
- Whether a partner / managing-partner group exists and what decision rights look like
- Geographic confirmation (drives Funnel 1 vs 2 routing)

### 6. Output

Default path: `prospects/[slug]/discovery-prep.md` (or OneDrive equivalent `02 - Sales & Pipeline\Prospects\[Name]\discovery-prep.md`).

```markdown
---
prospect: [name]
call_date: YYYY-MM-DD
mode: prep
---

# Discovery Prep — [prospect name]

## Prospect snapshot
- [bullets: staff, rev, industry, geo, funnel, source]

## Top 3 friction-point hypotheses
1. FP #N [name] — [evidence] — [questions 1–3]
2. ...

## Call arc + question bank
[8–10 questions from step 3]

## Red flags to watch for
[list from step 4]

## ICP confirmations needed on the call
[list from step 5]

## Pattern-library match (if any)
[Falcon / Genesis / Hatch / S+A / none — 1-sentence transferable insight]

## Internal partner split (who does what)
- Joshua leads + maintains flow
- Jason observes + tracks language shifts / contradictions against hypotheses
- Both take the wedge probe together if the opening doesn't land
```

Update prospect frontmatter: `currentStep: 0` (step not yet complete), `nextAction: YYYY-MM-DD` (call date), `lastContactDays` unchanged.

---

## Mode: `--synthesize`

### 1. Ingest the call

Options for source:
- **Fireflies transcript** — hand off to [`jirah-session-analyzer`](../jirah-session-analyzer/SKILL.md) first; consume its structured summary
- **Notes pasted in chat** — read as-is
- **Joshua's post-call recap** — structured markdown, read as-is

### 2. Apply the fit-decision framework

Three-tier decision (be direct — per voice rules, no hedging):

| Tier | Triggers |
|---|---|
| **Yes — proceed to Discussion Document** | All 3 exit criteria met (ICP fit confirmed, owner willing to share data + team, both partners aligned). Top-3 hypotheses resonate. Wedge probe produced a real answer (not deflection). |
| **Maybe — 15-min partner huddle, then decide** | Exit criteria partially met. Could be scope-shape mismatch, or one partner has a concern. Name the specific concern. |
| **No — decline warmly** | ICP fail (too small / too large / non-owner buyer / PE-owned / industry mismatch). Owner deflects wedge probe + can't articulate a hypothesis. Signals of change fatigue or budget blockage. |

### 3. Draft post-call synthesis

```markdown
---
prospect: [name]
call_date: YYYY-MM-DD
mode: synthesize
fit_decision: yes | maybe | no
---

# Discovery Synthesis — [prospect name]

## What they named as the problem (owner framing)
[1–2 sentences, verbatim or close paraphrase]

## What we think actually matters (our read)
[2–3 sentences — friction points we saw signal for, confidence tags applied. Reference `context/jirah-friction-points.md` explicitly.]

## Evidence observed in the call
- Language shift moments (if the transcript surfaced them)
- Contradictions (stated vs revealed)
- Wedge-probe response — what happened when we asked the FP #10 question
- Commercial signal — how urgent, how committed

## Data Jirah needs before Discussion Document
- [3-year financials / org chart / client concentration / partnership agreement / etc.]

## Fit decision
**[Yes / Maybe / No]** — [1-sentence reason]

## Next step
- Yes: Draft Discussion Document this week. Invoke `/jirah-discussion-document` with this file as input.
- Maybe: 15-min Jason+Joshua huddle. Specific concern to resolve: [concern]. Deadline: [date].
- No: Draft warm decline via `/jirah-email --scenario general`. Referral if a fit exists in people graph.

## Pattern-library match (firmed up)
[Now that we've heard from them — which engagement shape this most resembles]

## Flags
[anything surprising, partner-disagreement signals, scope risks]
```

### 4. Update the prospect file

- `currentStep: 1` (Discovery complete)
- `stage: meeting-booked` → `proposal-sent` on Yes; stay `meeting-booked` on Maybe; `closed-lost` on No
- `lastContactDays: 0`
- `nextAction: YYYY-MM-DD` (Discussion Doc draft date for Yes; huddle date for Maybe; no next action for No)
- Append to `## Activity log`: one line summarizing the call + fit decision

### 5. Output to chat

```
Discovery Synthesis — [prospect name] — [date]
Fit decision: [Yes / Maybe / No]

One-line summary: [what they named vs what we saw]

Next step: [concrete action with owner + deadline]

Drafts written: [path]
Prospect frontmatter updated: [fields]
```

---

## Mode: `--both`

Runs `--prep` first, then after the call (when Jason says "synthesize X"), runs `--synthesize` on the same prospect file. Same prospect file gets both sections added.

---

## Voice rules (non-negotiable)

- Direct fit decision — never "it depends"
- Confidence tags on hypotheses (Very High / High / Medium)
- Name FP #10 explicitly when the wedge-probe response suggests Ownership Impact — do not soft-pedal
- No corporate reports. Short, numbered, decision-led.

## Edge cases

- **Owner shows up but cofounder didn't** — hypotheses on 2-partner / multi-partner governance must be flagged Medium-confidence only. Push the governance probe to Discussion-Document stage.
- **Prospect derails into tactical ops rant** — prep brief should include a redirect script: *"That's worth unpacking. Before we go deep there, can we step back to the shape of the firm for 5 minutes?"*
- **Wedge probe gets shut down** ("we're fine, I take vacations") — don't push. Flag as Medium signal; plan triangulation via team interviews in the sprint.
- **Partner-disagreement signal during call** (cofounder disagrees with owner in real time) — this is high-value information. Note as a governance-risk hypothesis immediately; may reshape Discussion Document scope.
- **ICP confirmation reveals firm is smaller / larger than expected** — pause the fit decision; flag `needs-rescope` before proceeding to Discussion Document.
- **Source material is a Fireflies transcript but `jirah-session-analyzer` hasn't been run** — invoke it first, don't attempt transcript analysis inline.

## Related

- Upstream: `jirah-audit-triage` (accepted applicants), `jirah-email` (scheduling the call), `jirah-lead-gen` (warm prospect handoff)
- Downstream: `jirah-discussion-document` (on Yes), `jirah-email` (on No — warm decline scenario)
- Adjacent: `jirah-session-analyzer` (for transcript prep of the synthesis)
- Context: jirah-process.md, jirah-methodology.md, jirah-friction-points.md, jirah-icp-wedge.md
