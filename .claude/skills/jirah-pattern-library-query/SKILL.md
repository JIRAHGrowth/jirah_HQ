---
name: jirah-pattern-library-query
description: Scan Jirah's prior engagements for patterns matching a current client profile and return ranked matches with transferable insights. Uses the jirah-pattern-matcher subagent. Injects pattern-library IP mid-drafting — into Discussion Documents, pitch decks, sprint-prep briefs, anywhere current work would benefit from "we saw this before at X — here's what worked." Use when Jason says "pull pattern-library matches for [client]," "who in the library is closest to this?," or when another skill (/jirah-discussion-document, /jirah-discovery, /jirah-friction-audit) calls it for mid-draft context injection.
---

# /jirah-pattern-library-query

## Purpose

Make Jirah's accumulated IP **usable mid-drafting**. The pattern library is dead weight if it sits as a `context/` file read only at session start. This skill activates it: query-on-demand, ranked by match strength, with specific transferable insight per match.

**Key function:** Bridge between `context/jirah-pattern-library.md` (the raw pattern-library doc) and the pattern-matcher subagent (which does the scanning). The skill is the interface; the subagent is the engine.

## Pre-requisites (read before querying)

- [context/jirah-pattern-library.md](../../../context/jirah-pattern-library.md) — the authoritative pattern library; all matches cite entries here
- [context/jirah-friction-points.md](../../../context/jirah-friction-points.md) — friction-point vocabulary for match scoring
- [context/jirah-icp-wedge.md](../../../context/jirah-icp-wedge.md) — ICP bands, engagement shapes

## Inputs (ask if not supplied)

- **Query shape** — one of:
  - `--profile [slug]` — read client / prospect / engagement from their `.md` and auto-extract query criteria
  - `--manual` — caller provides criteria directly:
    - Industry (engineering / building systems / professional services / accounting / other)
    - Staff size
    - Revenue band
    - Owner framing (1 sentence — the symptom they named)
    - Suspected friction points (1–3 of the 10)
- **Purpose** — what the match will feed into, so ranking can be tuned:
  - `--for discussion-doc` — matches with Discussion Document exemplars prioritized (S+A, Falcon)
  - `--for pitch` — matches with publishable outcomes + case studies prioritized
  - `--for sprint-prep` — matches with rich sprint-signal + hypothesis data prioritized
  - `--for drafting` (default) — balanced rank across all dimensions
- **Top-N** — `--top 3` (default) | `--top 1` (single best match) | `--top 5` (broader comparison)

---

## Process

### 1. Extract query criteria

If `--profile [slug]`:
- Read `prospects/[slug]/*.md` or `engagements/[slug]/*.md` or `audit-applications/[id].md`
- Parse frontmatter + discovery notes + any session signal available
- Build query dict: industry, size, revenue, owner framing, suspected FPs

If `--manual`:
- Use the caller-supplied criteria directly
- Ask follow-up if any core dimension missing (don't fabricate)

### 2. Dispatch pattern-matcher subagent

Spawn [`jirah-pattern-matcher`](../../agents/jirah-pattern-matcher.md) with the query criteria + purpose + top-N. The subagent scans:
- `context/jirah-pattern-library.md` — the canonical document; primary source of truth
- `reports/pattern-library-codification-2026-04-18.md` — the evidence base from Sprint 1e
- `case-studies/published/*.md` — if any case studies exist
- Historical engagement folders if available

Returns a ranked list of matches with match scores and transferable insights.

### 3. Aggregate + format for caller

```markdown
# Pattern-Library Matches — [Query summary]
**Query profile:** [industry, size, owner framing summary, suspected FPs]
**Purpose:** [for what downstream use]
**Top N:** [count]

---

## Rank 1 — [Engagement name]
**Match score:** [N/10]
**Why matched:**
- Industry: [match/partial/none]
- Size: [match/partial/none]
- Friction-point overlap: [FPs in common]
- Owner-framing similarity: [match rationale]

**Transferable insight:** [1 sentence — the specific lesson this prior engagement teaches]

**Source:** [file path + section reference — anchored to pattern-library.md entry or case-study file]

**Paste-ready copy for [purpose]:**
> [1–2 sentences Jason can drop verbatim into his current draft, e.g., Discussion Document section or sprint-prep brief]

---

## Rank 2 — [Engagement name]
[same structure]

---

## Cross-engagement patterns applicable (from pattern-library.md)

If current profile triggers cross-engagement patterns 1–8 from the pattern library:
- **Pattern 1 (FP #10 terminal):** applicability — [high/medium/low] + rationale
- **Pattern 2 (missing middle at 30–150 staff):** applicability — [...]
- **Pattern 3 (multi-office expansion exposes pre-existing friction):** applicability — [...]
- ... (only show patterns with medium-or-higher applicability)

## Gaps / low-match flags

If no strong match exists:
- "No prior engagement is a strong match on industry + size + framing."
- Recommend: treat as a new-pattern-capture candidate; document any breakthrough insight from this engagement into the library after delivery.

## Flags for caller

- [low-confidence matches flagged — match score <5]
- [criteria that couldn't be checked due to missing data in library]
```

### 4. Output

Default: print to chat for direct consumption by caller.

If `--save`: write to `engagements/[slug]/pattern-query-YYYY-MM-DD.md` for later reference inside the engagement folder.

### 5. Output to chat (concise summary)

```
Pattern-Library Query — [client / prospect] — purpose: [for X]

Top matches
1. [Engagement] — score [N/10] — "[transferable insight]"
2. [Engagement] — score [N/10] — "[transferable insight]"
3. [Engagement] — score [N/10] — "[transferable insight]"

Cross-engagement patterns applicable
- Pattern N: [name] — [applicability]

Paste-ready copy available for: [purpose]
Full detail: [chat output above / saved path]

Next step
- Drop the paste-ready copy into your [current draft]
- If match score <5 on all top matches: this is a new-pattern-capture opportunity; log it
```

---

## Voice rules for output

- Every match cites a specific source file + section — callers can verify
- Transferable insights are 1 sentence, not a paragraph
- Paste-ready copy is in Jirah voice (per `context/jirah-voice.md`) — ready to drop into Discussion Documents / sprint-prep without editing
- Low-confidence matches are flagged, not dressed up as matches
- If nothing strong matches, say so — never fabricate a match for dramatic effect

## Edge cases

- **Pattern library is thin** (only 4 engagements in current codification) — match scores will cap out relatively easily; flag the library thinness in the output and recommend treating the engagement as a new-pattern-capture opportunity
- **Query is very generic** ("engineering firm") — return multiple partial matches rather than one strong one; prompt caller to tighten criteria
- **Multiple matches at the same score** — rank by purpose fit (discussion-doc vs pitch vs sprint-prep) rather than arbitrary tiebreaker
- **Prior engagement had different engagement shape than current** (Hatch light-coaching vs current Active Advisory prospect) — still return; flag shape difference in "Why matched" so caller can calibrate transferable-insight applicability
- **Query includes a rare industry** (construction tech, healthcare services) — flag that Jirah's library doesn't yet cover this vertical; transferable insights come from structural patterns (FP mapping), not industry specifics
- **Cross-engagement pattern conflicts with current profile** (Pattern 1 says FP #10 terminal but current client's suspected FPs don't include FP #10) — surface the conflict; don't force-fit; recommend probing FP #10 explicitly during discovery
- **Pattern library has been rewritten / moved** — skill reads `context/jirah-pattern-library.md` as source; if that file moves, skill must be updated to point to new path; do not silently fail

## Related

- Subagent: [`jirah-pattern-matcher`](../../agents/jirah-pattern-matcher.md) (does the actual scanning in isolation)
- Callers (skills that use this mid-draft):
  - [`jirah-discovery`](../jirah-discovery/SKILL.md) — pre-call hypothesis + pattern match
  - [`jirah-discussion-document`](../jirah-discussion-document/SKILL.md) — Section 2 "What we think matters" benefits from a named prior pattern
  - [`jirah-friction-audit`](../jirah-friction-audit/SKILL.md) — `--mode prep` includes pattern match
  - [`jirah-lead-gen`](../jirah-lead-gen/SKILL.md) — per-prospect research brief closes with pattern-library match
  - [`jirah-thought-leadership`](../jirah-thought-leadership/SKILL.md) — source material selection
  - [`jirah-case-study`](../jirah-case-study/SKILL.md) — confirms match during case-study generation
- Context: jirah-pattern-library.md (authoritative source)
