---
name: jirah-sprint-facilitation
description: Step 4 — support the 1–3 day Strategic Sprint. Pre-sprint mode generates the friction-point-indexed interview guide + data-pull checklist. In-sprint mode processes each Fireflies transcript (via jirah-transcript-analyzer subagent in parallel) and aggregates the signal stream into running session notes + evolving hypotheses. Joshua leads facilitation; Jason observes. Use when Jason says "prep the X sprint," "analyze today's sprint sessions," "process the sprint transcripts for Y," or feeds a batch of transcripts from a wrapped sprint day.
---

# /jirah-sprint-facilitation

## Purpose

Wrap **Step 4**: the 1–3 day Strategic Sprint. This is the diagnostic heart of any Jirah engagement. Two modes:
- `--prep` — day(s) before sprint. Produce the interview guide, data-pull checklist, partner role split, and pre-sprint hypotheses brief.
- `--analyze` — during and after each session. Process Fireflies transcripts via parallel subagents; aggregate into running signal notes + revised hypotheses for the next session.

Dual-facilitator model (jirah-methodology.md §2): Joshua runs the room. Jason observes, takes real-time notes on *pattern signals* (not transcription — Fireflies covers that). This skill is how Jason's observing job becomes repeatable.

## Pre-requisites (read before running)

- [context/jirah-process.md](../../../context/jirah-process.md) — Step 4 structure, cadence
- [context/jirah-methodology.md](../../../context/jirah-methodology.md) — dual-facilitator rule, triangulation, tool stack (Fireflies.ai on ALL sessions)
- [context/jirah-friction-points.md](../../../context/jirah-friction-points.md) — the 10 lenses + diagnostic questions per lens
- [context/jirah-pattern-library.md](../../../context/jirah-pattern-library.md) — prior engagement sprint shapes + transferable insights
- Engagement profile (`engagements/[slug]/00-profile.md` / OneDrive equivalent)
- Post-kickoff notes (produced by [`jirah-kickoff-agenda`](../jirah-kickoff-agenda/SKILL.md) `--post`)

## Inputs (ask if not supplied)

- **Mode** — `--prep` | `--analyze` | `--both`
- **Engagement** — slug or path
- **Sprint dates** — pulled from frontmatter for `--prep`; for `--analyze`, the date of the session(s) being analyzed
- **Transcripts** (for `--analyze`) — list of Fireflies transcript file paths to process; default glob: `engagements/[slug]/06-sprint/transcripts/*.{md,txt,vtt}`

---

## Mode: `--prep`

### 1. Ingest the engagement state

Read:
- Engagement profile (shape, staff, revenue, industry, sprint duration)
- Discussion Document (scope, explicit out-of-scope)
- Discovery synthesis + post-kickoff notes
- Pattern-library match for engagement shape
- Confirmed team-interview list + data asks from kickoff

### 2. Generate the friction-point-indexed interview guide

Interviews during a sprint = team interviews with 6–10 stakeholders (not the sprint facilitator sessions themselves). For each interviewee role, generate role-specific probes from `context/jirah-friction-points.md`:

```markdown
# Team Interview Guide — [Client] Sprint
**Sprint dates:** YYYY-MM-DD to YYYY-MM-DD
**Interview count planned:** N
**Interview duration:** 45 min each
**Recording:** Fireflies.ai on every session (confirmed with client at kickoff)

---

## Framing script (Joshua, first 3 min of every interview)

"We're here as part of Jirah's engagement with [Owner name]. We'll spend 45 minutes together. This is recorded via Fireflies — [Owner] sees the transcripts but your direct quotes won't be attributed by name in the final report unless you explicitly say you're comfortable with that.

We're interested in what you see, not what you think we want to hear. There are no right answers, and no questions that are off-limits."

---

## Role: Ops Lead / GM / COO (if one exists)

**Anchor friction points:** FP #5 (Company Structure), FP #7 (Lifecycle), FP #10 (Ownership Impact)

**Core questions (pick 4–5 per interview):**
- Walk me through a typical week. What's the shape of your role?
- What decisions do you own outright? What routes through the owner that, in your view, shouldn't?
- When the owner is out for two weeks, what breaks?
- Where is the firm bumping a ceiling — people, systems, capital, leadership bandwidth?
- What does growth look like to you, and is that the same as what the owner describes?

## Role: Finance Lead / Controller

**Anchor friction points:** FP #2 (Revenue), FP #3 (Product/Service Mix), FP #4 (Strategy)

**Core questions:**
- Margin by service line — what's loss-leader, what's cash cow, what's commoditizing?
- Client concentration — top 3 clients = what % of revenue?
- Pricing discipline — when did we last raise fees? On what clients?
- What's the gap between the strategic plan and the capital / headcount allocation today?

## Role: Top Biller / Rainmaker / Senior Practitioner

**Anchor friction points:** FP #2 (Revenue), FP #6 (Culture), FP #10 (Ownership Impact)

**Core questions:**
- What's pulling you away from billable work that shouldn't be?
- Who else at the firm could be doing what you're doing right now? What keeps them from it?
- If the owner stepped back to 50% time next year, what would change for you?

## Role: Longest-Tenured IC / Culture Carrier

**Anchor friction points:** FP #1 (Mission/Vision/Values), FP #6 (Culture), FP #7 (Lifecycle)

**Core questions:**
- What's stayed the same about this firm from when you started to now? What's changed?
- What do people say about this place in the kitchen that they wouldn't say in a meeting?
- Are exit interviews telling us what the firm's like, or what leadership wants to hear?

## Role: Recent Hire (<18 months)

**Anchor friction points:** FP #6 (Culture), FP #8 (Innovation/Change), FP #5 (Structure)

**Core questions:**
- What surprised you in the first 90 days — good and bad?
- Where do you go when you don't know who to ask?
- What would make you leave?

## Role: Admin / Operations Coordinator

**Anchor friction points:** FP #5 (Structure), FP #10 (Ownership Impact)

**Core questions:**
- What gets stuck at the owner's desk and how long does it sit?
- What decisions are you making that you're technically not supposed to be making — just to keep things moving?

## Role: Board Member / Advisor (if applicable)

**Anchor friction points:** FP #4 (Strategy), FP #9 (External Environment), FP #10 (Ownership Impact)

**Core questions:**
- Where do you push back on the owner? Where does push-back land and where does it bounce?
- What's the 3-year outlook for this firm's market and is the leadership team reading it right?

---

## Universal close (every interview)

- "If you had five minutes with the owner, one thing you'd want them to hear?"
- "Anything we didn't ask that you expected us to?"
```

### 3. Generate the pre-sprint data-pull checklist

```markdown
# [Client] — Pre-Sprint Data Checklist
**Sprint start:** YYYY-MM-DD
**Due by:** YYYY-MM-DD (1 week before)

| Item | Owner | Due | Status | Triangulation use |
|---|---|---|---|---|
| 3-year P&L | Client CFO | [date] | ☐ | FP #2, #3 |
| Org chart (current) | Client HR | [date] | ☐ | FP #5, #10 |
| Client concentration list | Client CFO | [date] | ☐ | FP #2 |
| Staff roster + hire dates + exits last 24mo | Client HR | [date] | ☐ | FP #6 |
| Partnership / governance agreement | Client Owner | [date] | ☐ | FP #10 |
| Prior strategic plans (if any) | Client Owner | [date] | ☐ | FP #4 |
| Prior employee survey data | Client HR | [date] | ☐ | FP #6 |
| Customer feedback / NPS if captured | Client Ops | [date] | ☐ | FP #2, #6 |
```

### 4. Generate partner role split + pre-sprint hypotheses brief

Internal only:

```markdown
# Pre-Sprint Brief — [Client] — Sprint [dates]

## Partner role split
- **Joshua (Facilitator):** runs every session, owns timing, asks the structural questions
- **Jason (Observer):** listens for language shifts, contradictions, emotional markers; does NOT facilitate; takes notes keyed to pattern signals
- Jason's phone is in another room during sessions

## Coming-in hypotheses (pre-sprint, Medium confidence)

### Top-3 friction-point hypotheses
1. **FP #X [name]** — [evidence from discovery + kickoff + data pulls so far]
2. **FP #Y [name]** — [evidence]
3. **FP #10 Ownership Impact** — [almost always on the list per pattern-library validation 4/4]

### Pattern-library match
[engagement] — [transferable insight]

### Signal we're specifically hunting for
- [e.g., "Does the missing-middle signal triangulate with the ops lead interview?"]
- [e.g., "Is the revenue plateau a pipeline problem or a pricing problem?"]

## Triangulation pre-plan
- Sprint-facilitator sessions: N
- Team interviews: M (list names + roles)
- External checks planned: [referrals, advisors, former employees]
- Data pulls confirmed: [% of checklist]

## Risks we're carrying in
- [anything that might constrain the sprint — owner refused team interview X, partner conflict likely to surface, data pull Z still pending]

## Post-sprint next step
Analyze mode fires after each sprint day: `/jirah-sprint-facilitation --analyze --date YYYY-MM-DD`
```

### 5. Output

```
engagements/[slug]/06-sprint/
├── 00-sprint-prep/
│   ├── interview-guide.md
│   ├── data-checklist.md
│   └── internal-brief.md
└── transcripts/           (empty — populated during sprint)
```

OneDrive equivalent: `01 - Clients\Active\[ClientName]\06 - Sprint & Facilitation\`

Update engagement frontmatter: `currentStep: 3`, `sprint_prep_status: ready`.

---

## Mode: `--analyze`

### 1. Ingest transcripts

Gather all transcripts from this session or sprint day. Supported formats: `.md`, `.txt`, `.vtt` (Fireflies exports).

### 2. Fan out transcript analyzers in parallel

Spawn one [`jirah-transcript-analyzer`](../../agents/jirah-transcript-analyzer.md) subagent **per transcript**, in a single message with parallel tool calls.

Each subagent receives:
- Transcript file path
- Session context (who was in the room, role, session type: sprint-facilitator / team-interview / external-check)
- Hypothesis register from pre-sprint brief (so the analyzer can tag against it)

Each subagent returns a structured summary: language shifts, contradictions, emotional markers, friction-point signal tags — all with timestamps and verbatim quotes.

### 3. Aggregate into running session notes

```markdown
# Sprint Session Notes — [Client] — [session date]

## Sessions processed
| File | Session type | Participants | Runtime |
|---|---|---|---|
| ... | sprint-facilitator / team-interview | names | HH:MM |

## Signal aggregation (this session)

### Language shifts observed
- [timestamp] [session file] — [speaker] tone shifted when [topic]. Verbatim: "[quote]". Interpretation: [1-sentence]

### Contradictions observed
- [timestamp] [session file] — [speaker A] said [X]. [speaker B] said [Y]. Relevance: [friction point].

### Emotional markers
- Defensiveness: [occurrences with context]
- Avoidance: [occurrences]
- Enthusiasm / alignment: [occurrences]

### Friction-point signal tally (this session)
| FP | # signals | Trajectory |
|---|---|---|
| #1 MVV | 0 |  |
| #2 Revenue | 3 | ↑ |
| #5 Structure | 7 | ↑↑ |
| #10 Ownership | 5 | ↑↑ |

## Hypothesis updates after this session

### Confirmed (moving to High)
- [FP #N finding — now triangulated across owner + 2+ team]

### Refuted / downgraded
- [FP #M hypothesis — not showing up in team interviews; downgrade to Medium, revisit with data pull]

### Newly surfaced
- [unexpected finding — flag for further probing in next session]

## Triangulation status
- Owner view: [captured in sessions X, Y, Z]
- Team view: [N interviews done of M planned]
- External check: [Q of R completed]
- Data pulls: [items received, gaps]

## Next session focus
- [what to probe based on this session's signal]
- [who to interview next given what's been triangulated so far]

## Risks emerging
- [anything that might constrain synthesis — e.g., key interviewee canceled, data gap persisting]
```

### 4. Write to running session notes file

Append mode to `engagements/[slug]/06-sprint/session-notes.md` throughout the sprint. Each session gets its own subsection; running hypothesis register at the top updates in place (not appended).

### 5. Update engagement frontmatter

- `sprint_sessions_analyzed: N`
- `sprint_status: in-progress | complete`
- If last session of sprint: `sprint_end_date: YYYY-MM-DD`, `nextAction: [triangulation-planning date]`

### 6. Output to chat

```
Sprint analysis — [Client] — [session date]
Processed: N transcripts in parallel via jirah-transcript-analyzer

Top signals this session
- FP #X: [1-line] — trajectory [↑↑]
- FP #Y: [1-line] — trajectory [↑]
- FP #10: [1-line — if present]

Hypothesis shifts
- Confirmed: [N findings moved to High]
- Downgraded: [M findings dropped to Medium]
- New: [K findings surfaced]

Triangulation status
- Owner + team + data: [%] complete

Next step
- Next session focus: [topic]
- After sprint closes: /jirah-triangulation on any finding still below High, then /jirah-action-register
```

---

## Mode: `--both`

Runs `--prep` first. When sprint runs and transcripts land, Jason invokes `--analyze` per day until sprint wraps.

---

## Voice rules

- Internal notes are terse and signal-dense. No polish. No corporate-speak.
- Observer notes (Jason's lane) are verbatim-first: capture what was said, then interpret. Never interpret without the source quote.
- Confidence tags on every hypothesis update — Very High / High / Medium per jirah-methodology.md

## Edge cases

- **Only 1 team interview completed by sprint end** (2 of 3 planned canceled) — downgrade all non-data-backed findings to Medium; flag in hypothesis register; schedule make-up interviews for triangulation phase.
- **Owner asked to sit in on team interviews** — firm no. Revisit scripted framing at kickoff. Note the ask in internal brief — it's itself a FP #10 signal.
- **Transcripts didn't record** (Fireflies failure) — fall back on real-time observer notes; flag affected finding confidence at Medium minimum; do not fabricate verbatim quotes from memory.
- **Session ran long, one interviewee got clipped** — note in session notes; do not re-order or reschedule without partner sync.
- **Sprint surfaces a finding that's outside Discussion Document scope** (e.g., hard HR issue) — note it in session notes as "out-of-scope observation"; do not fold into action register; surface in next partner check-in for scope-amendment conversation.
- **Partner-conflict surfaces during a session** (cofounder disagrees with owner in real time) — do not mediate in the room. Capture verbatim, tag FP #10 + governance risk, flag for post-sprint partner sync.

## Related

- Upstream: [`jirah-kickoff-agenda`](../jirah-kickoff-agenda/SKILL.md) (post-kickoff notes feed pre-sprint brief)
- Subagent: [`jirah-transcript-analyzer`](../../agents/jirah-transcript-analyzer.md) (parallel analysis per transcript)
- Downstream: [`jirah-triangulation`](../jirah-triangulation/SKILL.md), [`jirah-action-register`](../jirah-action-register/SKILL.md)
- Adjacent: [`jirah-session-analyzer`](../jirah-session-analyzer/SKILL.md) (one-off transcript analysis outside sprint context)
- Context: jirah-process.md, jirah-methodology.md, jirah-friction-points.md, jirah-pattern-library.md
