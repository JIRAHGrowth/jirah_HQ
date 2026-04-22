---
name: jirah-session-analyzer
description: Process one or more Fireflies transcripts (discovery calls, sprint sessions, team interviews, audit conversations, external checks) via the jirah-transcript-analyzer subagent. Extracts language shifts, contradictions, emotional markers, and friction-point signals with verbatim quotes + timestamps. This is the methodology pattern-intel skill — NOT everyday meeting hygiene (use /jirah-meeting-notes for that). Use when Jason or Joshua hands over a Fireflies transcript and says "analyze this for pattern signals," "pattern-intel on this transcript," or when /jirah-sprint-facilitation calls it for sprint-day batch analysis.
---

# /jirah-session-analyzer

## Purpose

Turn Fireflies transcripts into structured pattern intelligence. Jason's observing job becomes repeatable and scalable.

**Critical distinction:**
- `/jirah-session-analyzer` — **methodology pattern intelligence**. Language shifts, contradictions, emotional markers, friction-point signal tags. Feeds triangulation and action-register synthesis. Output is structured analysis, not clean meeting notes.
- `/jirah-meeting-notes` — **everyday meeting hygiene**. Summary, decisions, action items with owner + deadline, follow-up email draft. Use for internal meetings, external coordination calls, anything where the goal is "get the facts written down."

If Jason says "meeting notes" — use `/jirah-meeting-notes`. If Jason says "analyze this sprint session" or "pattern intel on this transcript" — use this skill.

## Pre-requisites (read before running)

- [context/jirah-methodology.md](../../../context/jirah-methodology.md) — dual-facilitator model, triangulation, tool stack (Fireflies on ALL sessions)
- [context/jirah-friction-points.md](../../../context/jirah-friction-points.md) — the 10 lenses + diagnostic questions per lens (for signal tagging)
- [context/jirah-voice.md](../../../context/jirah-voice.md) — verbatim-first capture discipline

## Inputs (ask if not supplied)

- **Transcript(s)** — one or more `.md` / `.txt` / `.vtt` file paths. Accepts a single file or a batch
- **Session context** — session type (`discovery` / `sprint-facilitator` / `team-interview` / `audit-morning` / `audit-team-interview` / `audit-external-check` / `kickoff` / `external-check`)
- **Participants** — who was in the room (names + roles) if not clear from the transcript itself
- **Hypothesis register** (optional) — if passed by a calling skill (e.g., `jirah-sprint-facilitation`), the current top-N friction-point hypotheses the analyzer should tag against
- **Engagement** (optional) — engagement slug if transcript belongs to one; determines output path

---

## Process

### 1. Validate the transcript

Read the first 50 lines. Confirm:
- Speakers can be identified (named speakers or clear turn-taking)
- Runtime is reasonable (not a 3-minute clip or a 6-hour concat)
- Content is a real conversation, not a lecture or demo

If any check fails, output a flag to chat and either ask for clarification or skip that file in a batch.

### 2. Fan out analyzer subagents

For one transcript: single subagent call.
For a batch: spawn one [`jirah-transcript-analyzer`](../../agents/jirah-transcript-analyzer.md) **per transcript**, in a single message with parallel tool calls (cap at 10 concurrent).

Pass to each:
- Transcript file path
- Session type
- Participants
- Hypothesis register if available (so tagging is focused, not exhaustive)

### 3. Aggregate the returned summaries

Each subagent returns a structured markdown summary. Aggregate across transcripts if batch:

```markdown
# Session Analysis — [context] — YYYY-MM-DD

## Sessions processed
| File | Type | Participants | Runtime |
|---|---|---|---|
| ... |

---

## Signal summary across sessions

### Language shifts
- [file] [timestamp] — [speaker]: tone shifted when [topic]. Verbatim: "[quote]". Interpretation: [1 sentence].
- ...

### Contradictions
- [file] [timestamp] — [speaker A] said [X]; [speaker B] said [Y] (or same speaker self-contradicted). Relevance: FP #[N].
- ...

### Emotional markers
- **Defensiveness:** [occurrences with file + timestamp + quote]
- **Enthusiasm / alignment:** [...]
- **Avoidance / deflection:** [...]
- **Hesitation:** [...]

### Friction-point signal tally
| FP | Signals | Direction | Notable quote |
|---|---|---|---|
| 1 MVV | N | ↑/↓/flat | "..." |
| 2 Revenue | N | ... | ... |
| ... 3–10 ... |

## Hypothesis-register impact (if register was passed)

### Confirming evidence
- [hypothesis] — [file/timestamp citation + verbatim quote]

### Refuting evidence
- [hypothesis] — [file/timestamp citation + verbatim quote]

### New signals not yet in register
- [emergent finding — tag friction point + confidence level]

## Confidence tagging per finding

Per jirah-methodology.md:
- **Very High** — triangulated across owner + 3+ team interviews + external / data
- **High** — owner + 2+ team interviews OR owner + strong data signal
- **Medium** — owner hypothesis + partial validation

Tag every surfaced finding with current confidence based on what this session adds.

## Verbatim-quote library (feeds thought leadership, case study, action register)

- [strongest quotes, pre-formatted for reuse — anonymized where appropriate per attribution rules]

## Flags for the caller

- [data gaps, transcript quality issues, sessions where analyzer had trouble]
- [signals worth a human re-read because the analyzer flagged them as low-confidence]
```

### 4. Output

Default path: `engagements/[slug]/06-sprint/session-analysis/YYYY-MM-DD-[slug].md` if engagement-linked.

Ad-hoc (no engagement): `session-analysis/YYYY-MM-DD-[descriptor].md` in workspace root.

Update engagement frontmatter if applicable:
- Append analyzed transcript paths to `sessions_analyzed` list
- If hypothesis register updated: update `hypotheses_status` summary

### 5. Output to chat

```
Session analysis — [context] — [date]
Analyzed: N transcripts via jirah-transcript-analyzer (parallel)

Top signals
- [1-line per top 3 signals]

Friction points tilting
- FP #X ↑↑, FP #Y ↑, FP #10 [surfaced / not surfaced]

Hypothesis changes
- Confirmed: [count]
- Downgraded: [count]
- New: [count]

Verbatim quotes captured: [count]

Output file: [path]

Next step
- If mid-sprint: continue with next session
- If sprint wrapped: /jirah-triangulation on any hypothesis below High, then /jirah-action-register
- If ad-hoc: review flagged low-confidence signals before drawing conclusions
```

---

## Voice + attribution rules

- **Verbatim-first.** Every interpretation has a source quote immediately above it. No "the team seemed frustrated" without the frustrated quote attached.
- **Attribution discipline.** If participant is a team member (not the owner), default to role-anonymized attribution in any surfaced quote that might reach the owner ("Ops lead said..." not "Sarah said..."). Exception: if the interviewee explicitly said they were fine being named.
- **No paraphrasing critical quotes.** If a quote is load-bearing for a finding, use verbatim. Paraphrase only when reducing length for summary sections.

## Edge cases

- **Transcript quality poor** (heavy crosstalk, poor audio → Fireflies garbled text) — surface in Flags. Analyze what's usable, flag everything ambiguous.
- **Speaker identification missing** — Fireflies didn't label speakers or mis-labeled them. Flag at the top of output. Use "Speaker A / B" placeholders; Jason can reconcile manually.
- **Transcript is actually a monologue** (e.g., owner recorded a voice memo) — analyze for self-contradiction and emotional markers only; no cross-speaker contradiction possible.
- **Multiple transcripts from same session** (e.g., one per speaker via separate mics) — dedupe at ingest; treat as one session.
- **Batch contains transcripts from different engagements** — split by engagement, write outputs to correct paths, don't cross-pollinate hypothesis registers.
- **Analyzer flags a potentially-sensitive quote** (harassment allegation, financial impropriety) — surface to chat with escalation flag; do not write to session-analysis file without partner confirmation.

## Related

- Subagent: [`jirah-transcript-analyzer`](../../agents/jirah-transcript-analyzer.md) (parallel fan-out, per transcript)
- Callers (who use this skill as a dependency):
  - [`jirah-sprint-facilitation`](../jirah-sprint-facilitation/SKILL.md) `--analyze` mode
  - [`jirah-discovery`](../jirah-discovery/SKILL.md) `--synthesize` mode when transcript source
  - [`jirah-friction-audit`](../jirah-friction-audit/SKILL.md) `--capture` / `--synthesize` modes for audit sessions
- Downstream: [`jirah-triangulation`](../jirah-triangulation/SKILL.md), [`jirah-action-register`](../jirah-action-register/SKILL.md)
- NOT a substitute for: [`jirah-meeting-notes`](../jirah-meeting-notes/SKILL.md) — different goal entirely
- Context: jirah-methodology.md, jirah-friction-points.md
