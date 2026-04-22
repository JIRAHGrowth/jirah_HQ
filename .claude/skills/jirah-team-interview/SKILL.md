---
name: jirah-team-interview
description: Produce a role-specific 45-minute team-interview guide for use during audits and sprint triangulation. Every question indexed to specific friction points. Opens with consent + confidentiality framing, probes current hypotheses, includes triangulation checks against the owner's view, and closes with the "one thing you'd change" prompt. Drops Jason into productive observer mode. Use when /jirah-sprint-facilitation --prep needs role-specific guides, when /jirah-friction-audit needs midday interview guides, or when Jason says "interview guide for the ops lead at X," "prep the team interviews for Y."
---

# /jirah-team-interview

## Purpose

Turn every team interview into **structured triangulation evidence** — without making it feel like an interrogation. This skill produces role-specific guides that Joshua can use at the head of a 45-minute session while Jason observes per the dual-facilitator rule.

Every team interview is an opportunity to triangulate the owner's hypothesis against lived experience. This guide makes that triangulation systematic.

## Pre-requisites (read before producing guides)

- [context/jirah-friction-points.md](../../../context/jirah-friction-points.md) — the 10 lenses + diagnostic questions per lens (source material for probes)
- [context/jirah-methodology.md](../../../context/jirah-methodology.md) — triangulation rule, dual-facilitator, confidentiality discipline
- [context/jirah-voice.md](../../../context/jirah-voice.md) — question voice (direct, about behavior not feelings)
- [context/jirah-pattern-library.md](../../../context/jirah-pattern-library.md) — role-specific signal patterns from prior engagements

## Inputs (ask if not supplied)

- **Role** (required) — one of:
  - `ops-lead` / `gm` / `coo` (operational authority)
  - `finance-lead` / `controller` / `cfo` (financial authority)
  - `top-biller` / `rainmaker` / `senior-practitioner` (revenue generators)
  - `longest-tenured-ic` (culture carrier)
  - `recent-hire` (<18 months)
  - `admin` / `operations-coordinator` (workflow keeper)
  - `advisor` / `board-member` (governance, if applicable)
  - `partner` / `co-owner` (when interviewing co-owners — rare, delicate)
  - `custom` — name it explicitly
- **Engagement / client** — slug or path
- **Current hypotheses** (optional) — 2–4 friction-point hypotheses we're validating / refuting in this interview
- **Interview type** — `audit-midday` (1-hour audit context) | `sprint` (45-min standard) | `triangulation` (focused on one hypothesis)

---

## Process

### 1. Ingest context

Read:
- Engagement profile + current `hypothesis_register` (if populated from sprint-prep or audit-prep)
- Pattern-library entries matching this role (e.g., S+A Gen Z retention → Ops Lead + Recent Hire specific probes)
- Any prior-interview notes if this is a follow-up session

### 2. Build the guide — standard 45-minute structure

```markdown
# Interview Guide — [Role] — [Client]
**Duration:** 45 minutes
**Facilitator:** Joshua Marshall
**Observer:** Jason Lotoski
**Recording:** Fireflies.ai
**Interviewee:** [name TBD — scheduler to fill]

---

## Framing script (Joshua — first 3 minutes)

"We're here as part of JIRAH Growth Partners' engagement with [Owner name + firm].
We're running conversations with 6–10 people on the team. Today is your 45 minutes —
and the whole point is what you see, not what you think we want to hear.

Two things worth naming up front:
1. **This is recorded** via Fireflies. [Owner] sees that we ran it. Your direct
   quotes won't be attributed by name in the final report unless you explicitly
   say you're comfortable with that.
2. **There are no right answers.** We're diagnostic, not evaluative. We're not
   here to report back on your performance — we're here to understand the firm.

Ready?"

---

## Warm-up (5 min — 2 questions)

These settle the interviewee. Short open-ended; establish they can talk freely.

1. "How long have you been at [firm], and what's been the arc — role changes, key moments?"
2. "What's something you've been proud of in the last year of work here?"

**Observer prompt for Jason:** baseline their pace, formality, and affect here.
Tone shifts in later questions will stand out against this baseline.

---

## Friction probing (25 min — 6–8 questions indexed to hypotheses)

[Role-specific section — see per-role library below. Hits the friction points
most relevant to this role, with Jason's observation prompts inline for each.]

---

## Triangulation checks (8 min — 2–3 questions)

Where does their view align or diverge from the owner's?

- "Owner mentioned [X] as a major priority — does that ring true to you, or does
  it look different from where you sit?"
- "When you and [Owner] disagree, how does that play out? [Or: has there been a
  time recently when you pushed back and it didn't land?]"
- "If [Owner] was explaining your role to a new hire, what would they get right?
  What would they get wrong?"

**Observer prompt for Jason:** divergence is the signal. Where does their
description of a workflow not match what the owner described in the morning
session?

---

## Closer (5 min — 2 questions)

1. "If you could change one thing — any one thing — about how this firm operates,
   what would it be? No right answer; just the first thing that comes to mind."
2. "Anything we didn't ask that you expected us to?"

**Observer prompt for Jason:** the "one thing" answer is gold. Verbatim quote
goes in the action-register evidence trail. If they pause 3+ seconds before
answering — note that. Either they're editing, or no one has asked them this
before.

---

## Internal briefing (Jason + Joshua, post-interview, 10 min offline)

- What friction points did we get signal on? (map to FP # list)
- What contradicted the owner's framing?
- What verbatim quotes should carry forward?
- What hypotheses moved (Medium → High, or refuted)?
- Who else should we talk to based on what surfaced?
```

### 3. Role-specific probe libraries

Fill the "Friction probing" section based on role.

#### `ops-lead` / `gm` / `coo`

**Anchor friction points:** FP #5 (Structure), FP #7 (Lifecycle), FP #10 (Ownership Impact)

```
1. "Walk me through a typical week. What's the shape of your role?"
   [Observer: is this role filled or empty? Do they describe actual authority,
   or filling gaps?]

2. "What decisions do you own outright? What routes through the owner that, in
   your view, shouldn't?"
   [Observer: this is the direct FP #10 probe from the ops seat.]

3. "When the owner is out for two weeks, what breaks?"
   [Observer: same question asked to owner in morning. Triangulation direct.]

4. "Where is the firm bumping a ceiling — people, systems, capital, leadership
   bandwidth?"
   [Observer: FP #7 Lifecycle probe.]

5. "What does growth look like to you, and is that the same as what the owner
   describes?"
   [Observer: listen for divergence in growth framing.]

6. "Is there something you've been trying to change for 6+ months that won't
   move?"
   [Observer: structural block — often the wedge finding.]
```

#### `finance-lead` / `controller` / `cfo`

**Anchor friction points:** FP #2 (Revenue), FP #3 (Product/Service Mix), FP #4 (Strategy)

```
1. "Which service lines are loss-leaders, cash cows, commoditizing? Not what the
   P&L shows — what you see when you look at them."
   [Observer: often differs from owner's intuition.]

2. "Client concentration — top 3 clients = what % of revenue? Is that growing
   or shrinking?"
   [Observer: validates financial-audit Check 2.]

3. "Pricing discipline — when did we last raise fees? On what clients? Which
   clients would you raise fees on tomorrow if decision were yours?"
   [Observer: pricing authority = decision-rights signal.]

4. "What's the gap between the strategic plan and where capital / headcount are
   actually allocated today?"
   [Observer: strategy-vs-drift gap.]

5. "Where is the firm carrying risk that the partners don't talk about?"
   [Observer: finance lead often sees risks others don't.]

6. "If a new hire asked you why margins look the way they do, what would you tell
   them?"
   [Observer: internal narrative about firm economics.]
```

#### `top-biller` / `rainmaker` / `senior-practitioner`

**Anchor friction points:** FP #2 (Revenue), FP #6 (Culture), FP #10 (Ownership Impact)

```
1. "What's pulling you away from billable work that shouldn't be?"
   [Observer: classic missing-middle signal.]

2. "Who else at the firm could be doing what you're doing right now? What keeps
   them from it?"
   [Observer: succession / capacity gap.]

3. "If the owner stepped back to 50% time next year, what would change for you?"
   [Observer: direct FP #10 probe from the revenue seat.]

4. "What's your book look like? Where does your pipeline come from?"
   [Observer: firm-wide vs personal rainmaker economics.]

5. "Has your role changed in the last 24 months? How?"
   [Observer: role-creep signal — are they quietly becoming the ops lead
   without the title?]

6. "What would make you leave?"
   [Observer: retention risk on the highest-value seat.]
```

#### `longest-tenured-ic` (culture carrier)

**Anchor friction points:** FP #1 (MVV), FP #6 (Culture), FP #7 (Lifecycle)

```
1. "What's stayed the same about this firm from when you started to now? What's
   changed?"
   [Observer: arc of cultural drift.]

2. "What do people say about this place in the kitchen that they wouldn't say
   in a meeting?"
   [Observer: gap between stated and lived culture.]

3. "Are exit interviews telling us what the firm is actually like, or what
   leadership wants to hear?"
   [Observer: exit-interview-signal quality.]

4. "What does the firm do well that no one here talks about?"
   [Observer: underappreciated strength — often loss on departure.]

5. "What would you warn a friend about before they took a job here?"
   [Observer: real honest signal.]

6. "If you had to name the firm's MVV from memory, could you?"
   [Observer: FP #1 probe. Most can't. That's the data.]
```

#### `recent-hire` (<18 months)

**Anchor friction points:** FP #6 (Culture), FP #8 (Innovation/Change), FP #5 (Structure)

```
1. "What surprised you in the first 90 days — good and bad?"
   [Observer: fresh-eye signal. Unbiased by tenure-amnesia.]

2. "Where do you go when you don't know who to ask?"
   [Observer: org-chart-vs-reality. If answer is 'I text the owner' — FP #10.]

3. "What's different about how this firm works vs where you were before?"
   [Observer: calibration against external.]

4. "What would make you leave in year 2?"
   [Observer: retention risk at the fragile tenure band.]

5. "What new idea or practice did you bring that hasn't stuck? Why?"
   [Observer: FP #8 Innovation/Change — is the firm absorbing new input?]

6. "If you stayed here 5 years, what growth path do you see?"
   [Observer: succession-visibility signal, especially for S+A-pattern firms.]
```

#### `admin` / `operations-coordinator`

**Anchor friction points:** FP #5 (Structure), FP #10 (Ownership Impact)

```
1. "What gets stuck at the owner's desk and how long does it typically sit?"
   [Observer: direct FP #10 probe. Admins see this with crystal clarity.]

2. "What decisions are you making that you're technically not supposed to be
   making — just to keep things moving?"
   [Observer: shadow-org signal. Often high-leverage finding.]

3. "Which calendar requests / approvals bottleneck the firm most?"
   [Observer: day-to-day friction directly observable from this seat.]

4. "What do you wish the owner knew about how the office actually runs?"
   [Observer: gap between owner's sense of operations and lived reality.]

5. "If you had to describe this firm in 3 words to a stranger, what would they
   be?"
   [Observer: cultural compression.]

6. "What would make your job 20% easier tomorrow?"
   [Observer: tactical quick-win candidate.]
```

#### `advisor` / `board-member`

**Anchor friction points:** FP #4 (Strategy), FP #9 (External Environment), FP #10 (Ownership Impact)

```
1. "Where do you push back on the owner? Where does push-back land and where
   does it bounce?"
   [Observer: governance signal.]

2. "What's the 3-year outlook for this firm's market and is leadership reading
   it right?"
   [Observer: FP #9 external.]

3. "What decisions do you think the owner is avoiding?"
   [Observer: advisors see this; team can't always name it.]

4. "If you were running this firm, what would your first move be?"
   [Observer: direct strategy-gap probe.]

5. "Is the owner coachable? Where are the blind spots?"
   [Observer: FP #10 from outside.]

6. "What would cause you to resign from this advisory role?"
   [Observer: governance risk signal.]
```

#### `partner` / `co-owner` (delicate)

**Anchor friction points:** FP #4 (Strategy), FP #5 (Structure), FP #10 (Ownership Impact — multiple-owner variant)

**Special framing note:** These interviews are politically sensitive. Stress the confidentiality framing especially hard. Co-owner disagreements surface here and must not be leaked back through summaries.

```
1. "When you and [Owner] disagree about the firm's direction, how does that play
   out?"
   [Observer: partnership friction is usually the finding. Name it gently.]

2. "What decisions are you making jointly that you think should be yours alone?
   What ones are yours alone that should be joint?"
   [Observer: decision-rights gap between partners.]

3. "If the firm could only keep one of its current strategic bets for the next
   3 years, which would you keep?"
   [Observer: strategic alignment probe.]

4. "Where do you think [Owner] has a blind spot?"
   [Observer: peer-level diagnostic — often the most honest FP #10 probe.]

5. "What's the exit / succession plan between the two of you? Has it been
   written?"
   [Observer: succession signal for multi-owner firms.]

6. "What would need to be true for you to fully trust the other partner's
   judgment on a $500k decision?"
   [Observer: trust-level diagnostic.]
```

#### `custom`

If role is custom, Claude generates 6 questions by:
- Identifying which friction points the role is best-positioned to see
- Pulling 2 diagnostic questions per FP from `context/jirah-friction-points.md`
- Calibrating language to role vocabulary (don't ask a shop-floor foreman an MBA-voice question)
- Flagging to Jason for pre-interview review before deployment

### 4. Output

```
engagements/[slug]/06-sprint/interview-guides/
├── [role]-guide.md
└── ...
```

OneDrive equivalent: `01 - Clients\Active\[ClientName]\06 - Sprint & Facilitation\`

Update engagement frontmatter:
- `interview_guides_generated: [list of roles]`

### 5. Output to chat

```
Interview Guide — [Role] — [Client]

Duration: 45 min
Anchor FPs: [list]
Current hypotheses being tested: [if passed]
Pattern-library signal to watch for: [if match exists]

Output: [path]

Delivery notes
- Joshua runs the room; Jason observes
- Fireflies enabled; confirm at start
- Universal close — "one thing you'd change" — produces the strongest verbatim quotes
- Post-interview: 10-min partner sync before next session
- Transcripts feed /jirah-session-analyzer for pattern intel
```

---

## Voice rules (non-negotiable)

- Every question probes **behavior**, not feelings ("what do you do when..." not "how do you feel about...")
- Confidentiality framing at top — never skip
- Observer prompts inline with each question — Jason uses these in real-time
- "One thing you'd change" closer is invariant across every guide — highest-signal question in the pack
- Jason's real-time notes focus on **pattern signals** (language shift, contradiction, emotional marker), not transcription (Fireflies covers that)

## Edge cases

- **Role doesn't exist at the firm** (e.g., "ops lead" in a 40-person firm with no GM) — this is itself the finding. Generate a guide that probes who *plays* that role informally; question 1 becomes "Who owns operational decision-making day-to-day?"
- **Multiple people in the same role** (3 senior practitioners at partnership firm) — same guide, 3 interviews, compare patterns across them during synthesis
- **Role is the owner's spouse / family member** — extra-delicate; Joshua should handle solo (no Jason observer); maintain confidentiality discipline religiously
- **Interviewee wants to record their own side** (for their own records) — allow if client privacy policy permits; note in Fireflies header
- **Interview time compresses** (30 min instead of 45) — drop questions 5 and 6 from friction-probing; keep warm-up, triangulation, closer
- **Interviewee goes deep on one question** (25 minutes on one topic) — let it run; gold signal usually; shorten triangulation section; never cut the closer
- **Translator / interpreter present** — interview runs in native language; pre-brief interpreter on the friction-point framing; observer notes adjust for translated lag; Fireflies transcript may need bilingual review

## Related

- Upstream: [`jirah-sprint-facilitation`](../jirah-sprint-facilitation/SKILL.md) `--prep` (primary caller), [`jirah-friction-audit`](../jirah-friction-audit/SKILL.md) (midday interviews), [`jirah-triangulation`](../jirah-triangulation/SKILL.md) (when a finding needs a specific role's probe)
- Downstream: transcripts flow to [`jirah-session-analyzer`](../jirah-session-analyzer/SKILL.md) + [`jirah-transcript-analyzer`](../../agents/jirah-transcript-analyzer.md)
- Pairs with: [`jirah-survey-writing`](../jirah-survey-writing/SKILL.md) — survey = breadth, interviews = depth
- Context: jirah-friction-points.md, jirah-methodology.md, jirah-voice.md, jirah-pattern-library.md
