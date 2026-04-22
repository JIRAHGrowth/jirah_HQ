---
name: jirah-action-register
description: Step 5 — produce the canonical Jirah deliverable. A prioritized action register (Critical / High / Medium) that names the real constraint, maps every finding to a friction point + confidence tag, assigns a client-side owner + deadline, and pairs every recommendation with its dependency chain. This is NOT a narrative report. Mode A styled. Delivered 30–45 days after sprint close. Use at the end of any sprint-to-report cycle, or when Jason says "draft the Falcon action register," "turn these sprint findings into the final deliverable," "build the Step 5 doc."
---

# /jirah-action-register

## Purpose

Deliver the **working playbook**. Jirah's deliverable is never a narrative report — it's an **action register the client implements**. This skill produces the Step 5 deliverable that closes out the sprint cycle and opens the Step 6 KPI Tracking retainer.

**Critical distinction from the retired `jirah-report-writing`:** narrative reports go on the shelf; action registers get implemented. The register is the working playbook — it lives in the client's PM tool after we hand off.

## Pre-requisites (read before drafting)

- [context/jirah-process.md](../../../context/jirah-process.md) — Step 5 structure, cadence (30–45 days post-sprint)
- [context/jirah-methodology.md](../../../context/jirah-methodology.md) — action-register row format, triangulation + confidence tagging, scope discipline (Pattern 7: scope creep dies on the page)
- [context/jirah-friction-points.md](../../../context/jirah-friction-points.md) — mapping every finding to a friction point
- [context/jirah-voice.md](../../../context/jirah-voice.md) — voice rules, deliverable structure
- [context/jirah-visuals.md](../../../context/jirah-visuals.md) — **Mode A** (JIRAH-branded, gold + navy, Playfair + DM Sans); xlsx secondary for client PM import
- [context/jirah-pattern-library.md](../../../context/jirah-pattern-library.md) — Pattern 1 (FP #10 terminal), Pattern 4 (symptoms vs constraints table), Pattern 6 (triangulation visible), Pattern 7 (scope discipline on page), Pattern 8 (FP #10 reframed as growth-stage readiness)

## Inputs (ask if not supplied)

- **Engagement** — slug or path to `engagements/[slug]/`
- **Input state** — Claude checks these are all present:
  - Engagement profile (`00-profile.md` or equivalent)
  - Discussion Document (signed) — for scope anchor
  - Post-kickoff notes
  - Full sprint session-analysis output
  - All triangulation plans + their execution outputs
  - Any AI opportunity scan output if AI track was embedded
- **Target confidence threshold** — `--threshold high` (default: High or Very High ships; Medium gets flagged as "needs more triangulation") | `--threshold very-high` (only Very High ships as Critical items)
- **Output format** — `--mode a` (default: Mode A HTML + xlsx) | `--markdown-only` (draft review)

---

## Process

### 1. Confirm inputs are complete

If engagement is missing any prerequisite (e.g., no triangulation plan run on a Medium-confidence finding that's being promoted to High), raise it in chat before drafting. Do not ship a register with confidence tags the evidence doesn't support.

### 2. Identify the real constraint

This is the **wedge finding** — the single finding that is the real answer. Per Pattern 1 in the library, it will usually be FP #10 Ownership Impact (4/4 in prior engagements). Occasionally it's FP #5 Structure or FP #4 Strategy. Check:

- What is the most-triangulated finding (highest confidence)?
- Did the owner name it at kickoff, or did Jirah surface it? (The wedge is typically what the owner did NOT name.)
- Does it create the dependency chain for other recommendations? (Per Falcon pattern — Recommendation 1 is hard dependency for Recs 2 & 3.)

Name it explicitly. Use the **Pattern 8 reframing** if it's FP #10: *"These are not signs of weakness. They are signs of readiness for the next stage."*

### 3. Build the 8-section deliverable structure

```
SECTION 1 — Executive summary (1 slide / 1 page)
  The real constraint, named in one sentence.
  Confidence tag (should be High or Very High — if Medium, escalate before shipping).
  One-paragraph reframe per Pattern 8 if the constraint is FP #10.

SECTION 2 — What you told us / what we think the real question is (1 slide / 1 page)
  Two-column table per Pattern 4. 3–4 rows.
  Column 1: owner framing (verbatim or paraphrased).
  Column 2: Jirah's structural reframe — maps to a friction point, tagged visibly.

SECTION 3 — Findings, mapped to the 10 Friction Points (2–3 slides / 2–3 pages)
  For each friction point where signal emerged (typically 4–6 of the 10):
    - FP # and name
    - Finding (1–2 sentences)
    - Confidence tag (Very High / High / Medium)
    - Supporting evidence (1–2 verbatim quotes + data point if applicable)
    - Triangulation trail — how this was validated (per Pattern 6, show the methodology)

SECTION 4 — Action register (THE DELIVERABLE — 2–3 slides / 3–5 pages)
  See detailed format below.

SECTION 5 — Risks + mitigations (1 slide / 1 page)
  What could go wrong and how we handle it.
  Specific to this engagement — not generic consulting boilerplate.

SECTION 6 — Out of scope (1 slide / 0.5 page) — per Pattern 7
  "Not in this register — referred elsewhere."
  Items explicitly NOT addressed, with the reason (usually scope, referred partners, or execution-layer work).
  Example phrasing: "HR policy drafting — referred to [HR partner]. SOP authoring — client's ops team + internal tools."

SECTION 7 — Expansion paths (1 slide / 1 page)
  For strategic engagements: name the 3 paths per jirah-icp-wedge.md (Ops / Project / AI).
  For AI-pilot engagements: this section is where the /jirah-ai-opportunity-scan output ships.
  For retainer engagements already underway: this section names the Step 6 KPI Tracking cadence.

SECTION 8 — Next steps (1 slide / 0.5 page)
  Two 1-hour kickoff meetings per voice-doc convention.
  Step 6 KPI Tracking cadence confirmed.
  Who owns what on both sides in week 1 post-delivery.
```

### 4. Build the action register (the core of the deliverable)

Per `context/jirah-methodology.md` §4 — every row has this exact format:

| Priority | FP | Finding (1 sentence + confidence tag) | Recommendation (1 sentence) | Owner (client-side) | Concrete next step (verb-led) | Deadline | Dependencies |
|---|---|---|---|---|---|---|---|
| **Critical** | 10 | 9-partner voting structure creates decision drag on every >$50k commitment (**Very High**) | Formalize managing-partner role + delegate Category A decisions to a 3-person exec committee | Owner + Partnership chair | Draft governance amendment; bring to partner vote by [date] | YYYY-MM-DD | — |
| High | 5 | No operational layer between partners and ICs (**High**) | Hire GM role reporting to managing partner | Owner | Publish JD; first interview slot | YYYY-MM-DD | Depends on Critical #1 (governance must clarify GM's decision rights first) |
| ... |

**Priority definitions (write these into the doc):**
- **Critical** — moves the real constraint. Without this, other recommendations won't stick or will exacerbate friction (Falcon pattern — Recs 2 & 3 *worsen* the friction if Rec 1 isn't done first).
- **High** — supports the real constraint directly. Can run in parallel with Critical if dependencies allow.
- **Medium** — quick wins, second-order, not dependency-blocking.

**Item count guidelines:**
- Total register: 8–15 items
- Critical: 1–3 items (rarely more — if everything is Critical, nothing is)
- High: 3–6 items
- Medium: 2–6 items

**Confidence tag rules (non-negotiable):**
- No row ships without a confidence tag.
- Medium-confidence findings MAY ship as Medium-priority items IF the register makes the confidence visible and pairs the item with a triangulation-next-step. E.g., "Medium — triangulation plan: team survey + controller interview by [date]."
- Medium-confidence findings DO NOT ship as Critical or High — if a finding is Critical-shaped but only Medium-confidence, run `/jirah-triangulation` before drafting this register.

**Friction-point mapping rules:**
- Every item maps to exactly one primary FP. Cross-cutting items can name a secondary FP in the dependency column.
- If an item doesn't map to a friction point, it shouldn't be in the register (it's probably scope-creep).

**Dependency chain rules:**
- Dependencies are explicit. If Rec 1 must complete before Rec 2 starts, Rec 2's dependency cell names Rec 1's row number.
- The register should be readable as a roadmap, not a list.

### 5. Apply Mode A visual rules

Output is a **single-file HTML** following the S+A exemplar pattern:
- Full-viewport scroll-snap layout
- Fixed right-side nav dots (1 per section)
- Top progress bar
- Bottom-right slide counter
- Playfair Display (display) + DM Sans (body)
- Gold `#C5A55A` accents, Navy `#111827` primary ink, warm off-white `#FAF7F0` background
- Formal "JIRAH Growth Partners" header branding
- "J" monogram logo in gold

**Plus an xlsx export** of the action register itself, for client PM import (Jira, Asana, Monday, Notion). Structure:

```
Columns: Row # | Priority | FP | Finding | Confidence | Recommendation | Owner | Next step | Deadline | Dependencies | Status
```

Status column starts empty — populated during Step 6 KPI Tracking.

### 6. Voice self-checks (Claude rejects output failing any)

- [ ] Every finding has a confidence tag
- [ ] Every recommendation has an owner + next step + deadline
- [ ] Critical items number between 1 and 3
- [ ] Out-of-scope section names at least one item per Pattern 7
- [ ] Triangulation trail visible inside the deliverable per Pattern 6
- [ ] If FP #10 is the real constraint, Pattern 8 reframe is present
- [ ] No narrative prose sections longer than 1 paragraph
- [ ] Numbers > adjectives throughout — any "significant" got replaced by a number
- [ ] No hedging language on recommendations
- [ ] Risks paired with mitigations
- [ ] Pattern-library reference present (if this engagement shape matches one)

### 7. Output

```
engagements/[slug]/07-deliverables/
├── [slug]-action-register.html           (Mode A single-file HTML)
├── [slug]-action-register.xlsx           (register-only, for PM import)
├── [slug]-action-register.md             (markdown mirror, reference)
└── [slug]-action-register-appendices.md  (supporting evidence — transcripts, data pulls, triangulation logs)
```

OneDrive equivalent: `01 - Clients\Active\[ClientName]\07 - Deliverables\Final\`

Update engagement frontmatter:
- `currentStep: 5` → transitioning to 6
- `report_delivered_date: YYYY-MM-DD`
- `stage: retainer` (if KPI Tracking starts)
- `real_constraint: "[1-sentence]"` (new field — feeds pattern library on engagement close)
- `register_critical_count: N`
- `register_total_count: M`

### 8. Trigger the harvest loop

Post-delivery triggers (queued for Sprint 4 harvest skills):
- `/jirah-case-study` — auto-draft case study from this engagement
- `/jirah-testimonial-ask` — schedule 30 days out
- Pattern-library update — append transferable insight to `context/jirah-pattern-library.md`

Output to chat:

```
Action Register — [Client] — YYYY-MM-DD

Real constraint: "[1 sentence]" (FP #N, [confidence])

Register summary
- Critical: N items
- High: M items
- Medium: K items
- Total: [N+M+K]

Triangulation status
- Very High: [count]
- High: [count]
- Medium (flagged with next-step): [count]
- Dropped (couldn't triangulate): [count]

Out-of-scope: [items referred elsewhere]
Pattern-library match: [engagement] ([transferable insight])

Output
- HTML: [path]
- xlsx: [path]
- Markdown mirror: [path]

Next steps
- Client review meeting: [date]
- Step 6 KPI Tracking kickoff: [date]
- Harvest triggers: /jirah-case-study, /jirah-testimonial-ask (30d)
- Pattern library update: append this engagement's transferable insight to context/jirah-pattern-library.md
```

---

## Edge cases

- **No finding triangulated to High confidence** — do not ship. Run triangulation plans on the top-3 candidates; revisit in 1–2 weeks.
- **More than 3 items feel Critical** — force-rank by dependency chain (which must-be-done-first-for-others-to-work). Everything else drops to High.
- **Real constraint is NOT FP #10** (rare — 0/4 in pattern library but possible) — ship as-is; note in pattern-library update that this engagement broke the pattern. Investigate what's different.
- **Client asked for a narrative report alongside the register** — deliver the register, offer a 1-page executive summary covering Section 1+2, decline the multi-page narrative. Pattern discipline: the register IS the deliverable.
- **Owner pushed back during draft review on a Critical item** — do not soften the register. Schedule a partner sync with Jason + Joshua + Owner; if finding survives discussion, keep it; if triangulation gap surfaces, downgrade the confidence tag and flag.
- **Engagement wrapped without full data pulls** — ship with what we have, flag the missing pieces in the Risks section with "Limitation: [data pull] not obtained. Recommendation [N] is Medium-confidence pending [item]."
- **AI pilot embedded in the engagement** — Section 7 hosts the AI opportunity + pilot status; the register itself only lists strategic items unless the pilot surfaced its own action-register items.

## Related

- Upstream: [`jirah-sprint-facilitation`](../jirah-sprint-facilitation/SKILL.md), [`jirah-session-analyzer`](../jirah-session-analyzer/SKILL.md), [`jirah-triangulation`](../jirah-triangulation/SKILL.md), [`jirah-ai-opportunity-scan`](../jirah-ai-opportunity-scan/SKILL.md) (if AI track embedded)
- Downstream: [`jirah-kpi-tracker`](../jirah-kpi-tracker/SKILL.md) (Step 6), [`jirah-case-study`](../jirah-case-study/SKILL.md), [`jirah-testimonial-ask`](../jirah-testimonial-ask/SKILL.md)
- Adjacent: [`jirah-report-review`](../jirah-report-review/SKILL.md) — run this as a methodology-compliance check before shipping
- Context: jirah-process.md, jirah-methodology.md, jirah-friction-points.md, jirah-voice.md, jirah-visuals.md, jirah-pattern-library.md
