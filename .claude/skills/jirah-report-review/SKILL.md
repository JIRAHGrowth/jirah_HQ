---
name: jirah-report-review
description: Self-audit Jirah deliverables against methodology compliance before they ship to a client. Catches voice drift, missing confidence tags, scope creep, wrong mode, missing out-of-scope callouts, narrative-report patterns that should be action-register format. Extends global doc-review with Jirah methodology lens. Produces a line-referenced review note with suggested edits. Use before sending any action register / Discussion Document / pilot plan / case study / presentation. Use when Jason says "review my draft before I send," "methodology check on [doc]," "report-review this."
---

# /jirah-report-review

## Purpose

**Catch methodology drift before the client sees it.** Every Jirah deliverable ships with:
- Confidence tags on every finding
- Explicit out-of-scope callouts
- Action-register format (not narrative-report prose)
- Risks paired with mitigations
- Correct Mode (A vs B)
- Proofs of discipline embedded
- Voice per `context/jirah-voice.md`

When any of those slip, the deliverable undermines Jirah's positioning. This skill is the last-mile gate before send.

## Pre-requisites (read before reviewing)

- [context/jirah-voice.md](../../../context/jirah-voice.md) — voice markers, deliverable structure, don'ts
- [context/jirah-methodology.md](../../../context/jirah-methodology.md) — triangulation + confidence tagging + action-register format + scope discipline
- [context/jirah-visuals.md](../../../context/jirah-visuals.md) — Mode A vs Mode B rules
- [context/jirah-friction-points.md](../../../context/jirah-friction-points.md) — so finding-to-FP mappings are verified
- [context/jirah-pattern-library.md](../../../context/jirah-pattern-library.md) — so pattern-library references in the draft are verified, not hallucinated

## Inputs (ask if not supplied)

- **Draft file path** (required) — the draft to review. Supported: `.md`, `.html`, `.pdf` (limited), `.docx`
- **Deliverable type** (required) — one of:
  - `discussion-document` — Step 2 Mode A
  - `action-register` — Step 5 Mode A
  - `pilot-plan` — Mode B AI pilot
  - `case-study` — Mode A editorial
  - `presentation` — general deck (Mode A or B)
  - `monthly-kpi-note` — Step 6 retainer note
  - `pilot-status` — weekly Mode B status
  - `custom` — flag the mode + structure expectations inline
- **Engagement** (optional) — slug for context; helps verify pattern-library references
- **Severity focus** — `--all` (default) | `--blockers-only` (critical items that must change before send)

---

## Process

### 1. Read the draft

Full pass. Identify:
- Overall structure (matches voice-doc structure?)
- Mode signals (palette, fonts, branding — especially in HTML deliverables)
- Confidence tags (count + placement)
- Out-of-scope callouts (present or missing)
- Risks + mitigations pairing (present?)
- Pattern-library references (if any — verify they exist)

### 2. Run the methodology compliance checklist

Apply each check per deliverable-type:

#### Universal checks (all deliverables)

- [ ] **Voice markers** (per `context/jirah-voice.md`)
  - Numbers > adjectives — flag any "significant / substantial / considerable" that could be a number
  - No corporate-speak ("leverage synergies," "paradigm shift," "best-in-class," "thought leadership" itself as a phrase)
  - No em-dashes unless they earn their place
  - No generic industry flattery
  - No hedging on recommendations
- [ ] **Naming**
  - Formal "JIRAH Growth Partners" in headers + sign-off of Mode A deliverables
  - Lowercase "Jirah" in body copy
  - Never "The JIRAH" / "a JIRAH consultant"
- [ ] **Sign-off** (where applicable)
  - Joint: "Jason and Joshua" (partner voice default)
  - Single: first name only

#### `discussion-document` (Step 2 Mode A)

- [ ] 7 sections present: What we heard / What we think matters / Scope / Out-of-scope / Timeline / Investment / Why Jirah + Next Steps
- [ ] Two-column symptoms-vs-constraints table in Section 2 (Pattern 4 from library)
- [ ] Out-of-scope section names specific items: SOPs, handbooks, full HR policy (scope-discipline Pattern 7)
- [ ] Investment is a single recommended band (not multi-option menu)
- [ ] Mode A visual: gold `#C5A55A` + navy `#111827` + Playfair/DM Sans
- [ ] Full-viewport scroll-snap HTML structure matching S+A exemplar
- [ ] Pattern-library match named in Section 7 if one exists
- [ ] Next steps names "two 1-hour kickoff meetings"

#### `action-register` (Step 5 Mode A)

- [ ] Real constraint named in Section 1 Executive Summary (1 sentence + confidence tag ≥ High)
- [ ] FP #10 reframe (Pattern 8) present if FP #10 is the constraint
- [ ] Two-column symptoms-vs-constraints table (Pattern 4)
- [ ] Every register row has: priority, FP #, finding + confidence tag, recommendation, owner, next step, deadline, dependencies
- [ ] Critical count between 1 and 3 (force-rank if more)
- [ ] Medium-confidence findings only appear as Medium-priority rows (not Critical or High)
- [ ] Out-of-scope section per Pattern 7
- [ ] Triangulation trail visible per Pattern 6 (Section 3 findings show validation evidence)
- [ ] Expansion paths section (Ops / Project / AI) present
- [ ] xlsx register snapshot exists alongside HTML
- [ ] Mode A visual

#### `pilot-plan` (Mode B)

- [ ] 7 sections: Hero / Problem / Approach / Timeline / Example Output / Risks / Next Steps
- [ ] Plan A AND Plan B both present with Day-2 decision trigger
- [ ] Every week has a demo-able artifact named
- [ ] Example Output is tangible (fabricated-but-realistic or real sample)
- [ ] 0-hallucination standard + human-review layer stated in Risks
- [ ] Client brand primary; "Prepared by Jirah" small / secondary
- [ ] Formal "JIRAH Growth Partners" in sign-off block only
- [ ] Two 1-hour kickoff meetings in Next Steps

#### `case-study` (Mode A editorial)

- [ ] "Owner thought X, actual was Y" structure
- [ ] Pattern-library match named
- [ ] Confidence tag visible on the finding
- [ ] Attribution correct: named (with client clearance) OR anonymized with descriptor
- [ ] Takeaway is counter-intuitive + memorable
- [ ] Soft CTA at close
- [ ] Mode A visual

#### `presentation` (Mode A or B general)

- [ ] Correct Mode per chooser table
- [ ] Voice-doc structure (7 sections) present
- [ ] Example Output slide is tangible
- [ ] Risks + mitigations paired

#### `monthly-kpi-note` (Step 6)

- [ ] Register status column populated (Delivered / On track / At risk / Slipped for every row)
- [ ] Stuck items have recommended next move (not just status)
- [ ] Focus for next month named (1–3 actions)
- [ ] Owner-time signal flagged if creeping past 5% (FP #10 re-emergence)
- [ ] Partner voice (direct, no corporate softeners)

#### `pilot-status` (weekly Mode B)

- [ ] Demo artifact named (skill rejects if missing)
- [ ] Plan A/B state declared (locked / at trigger / Plan B engaged)
- [ ] Metrics from eval harness present (or explicit "first eval run week 2" note)
- [ ] Risks categorized: new / resolved / persistent
- [ ] Next week's commitment named
- [ ] Fits on one page

### 3. Pattern-library reference verification

Any reference to Vulcan / Hatch / Falcon / Genesis / S+A must be:
- Verified against `context/jirah-pattern-library.md`
- Not hallucinated ("Vulcan $49.9k engagement" when library doesn't cite that number → flag)
- Attributed correctly if named; anonymized if not cleared

### 4. Draft the review note

```markdown
---
draft_reviewed: [path]
deliverable_type: [type]
engagement: [slug if applicable]
reviewed_date: YYYY-MM-DD
reviewer: JL | JM
severity_focus: [all / blockers-only]
---

# Report Review — [deliverable descriptor]

## Summary (3 sentences)

[Overall: is this ship-ready? How close?]

## Verdict

**[Ship as-is / Ship with [N] edits / Do not ship — [reason]]**

## Blockers (must fix before send)

### [Blocker 1]
- Location: [section / line reference]
- Issue: [specific — "Rec #4 has no confidence tag"]
- Fix: [specific edit]
- Why this is a blocker: [methodology reference — "per jirah-methodology.md §1, no finding ships without a confidence tag"]

### ...

## Should-fix (edit before send, not technically blocking)

- [line ref] — [issue] — [fix]
- ...

## Nice-to-have (polish)

- [line ref] — [suggestion]
- ...

## Voice-markers audit

- Numbers > adjectives: [pass / N instances flagged]
- No corporate-speak: [pass / flagged: "leverage synergies" at line X]
- No hedging: [pass / flagged]
- Naming: "JIRAH Growth Partners" in headers: [pass / issue]

## Methodology compliance

### Confidence tags
- Findings present: [N]
- Findings with confidence tag: [M]
- Missing tags: [list locations]

### Out-of-scope callout
- [present / missing]

### Action-register format (if applicable)
- Rows with complete fields: [N/total]
- Rows missing required fields: [list]

### Risks + mitigations paired
- Risks present: [N]
- Mitigations paired: [M]
- Paired complete: [pass / issue]

### Mode correctness
- Declared mode: [A / B]
- Palette match: [pass / issue]
- Font match: [pass / issue]
- Branding hierarchy: [correct / issue]

### Pattern-library references
- Count: [N]
- Verified against context/jirah-pattern-library.md: [pass / M unverifiable]

## Proofs-of-discipline check

- [ ] Triangulation explicitly named
- [ ] Dual-facilitator method referenced (where applicable)
- [ ] Action register referenced as format
- [ ] Scope-creep items explicitly named as out-of-scope
- [ ] Numbers embedded rather than adjectives

[If any unchecked: name where the proof is missing + recommend where to add]

## Specific edit suggestions

[Numbered list of specific line-by-line edits]
1. Section X, line Y: change "[current]" to "[suggested]"
2. ...

## Ready-to-send path

If verdict is "Ship with [N] edits": here's the order —
1. Apply blockers
2. Apply should-fix
3. Re-render HTML if Mode visuals affected
4. [If applicable:] Partner sign-off before send
```

### 5. Output

```
engagements/[slug]/07-deliverables/reviews/
└── [deliverable-type]-review-YYYY-MM-DD.md
```

Ad-hoc (no engagement): `reviews/report-reviews/[descriptor]-YYYY-MM-DD.md`

### 6. Output to chat

```
Report Review — [deliverable descriptor]

Verdict: [Ship as-is / Ship with N edits / Do not ship — reason]

Blockers: [count]
Should-fix: [count]
Nice-to-have: [count]

Compliance summary
- Voice markers: [pass / N issues]
- Confidence tags: [N/M findings tagged]
- Out-of-scope callout: [present / missing]
- Mode correctness: [correct / issue]
- Pattern-library references: [N verified]
- Proofs of discipline: [N/5 explicit]

Output: [path]

Next steps
- Apply [N] blocker edits
- [If verdict is Do-Not-Ship:] schedule partner sync before revising
- [If Ship-as-is:] proceed to send
```

---

## Extends global `/doc-review`

This skill wraps the global [`doc-review`](../../../CLAUDE.md) / `doc-review-jason` pattern with:

1. **Jirah methodology compliance checklist** (confidence tags, action-register format, out-of-scope)
2. **Mode A / Mode B visual audit**
3. **Voice-marker enforcement** (numbers > adjectives, no corporate-speak, naming rules)
4. **Pattern-library reference verification** (not hallucinated)
5. **Proofs-of-discipline audit** (triangulation named, scope discipline visible, register format)

For non-Jirah document reviews (external docs, client's artifact), use [`/jirah-document-review`](../jirah-document-review/SKILL.md) with an appropriate lens instead.

## Edge cases

- **Draft is 50+ pages** — focus blocker review on Sections 1–4; sample-review Sections 5+ for voice + visual compliance
- **Draft is a partial draft** (only Sections 1–3 written, rest TBD) — review what's there; flag missing sections against deliverable-type checklist; don't verdict-ship incomplete drafts
- **Draft is a second revision** — compare against prior review if one exists; confirm blockers from prior pass are resolved
- **Draft introduces a new engagement shape not in pattern library** — don't flag as error; note as new-pattern-capture opportunity
- **Draft has Jason + Joshua both listed as joint authors but style inconsistency** (some sections in one partner's voice, others in another's) — flag; recommend a single-voice unification pass
- **Draft is for a regulated industry deliverable** (healthcare, legal, finance) — additional layer: flag any statement that could be interpreted as compliance advice; recommend legal review before send
- **HTML draft has broken scroll-snap or fonts** — flag separately from voice/methodology; treat as pre-visual-review fix

## Related

- Extends: global `doc-review` / `doc-review-jason`
- Callers — skills this gate runs against:
  - [`jirah-discussion-document`](../jirah-discussion-document/SKILL.md)
  - [`jirah-action-register`](../jirah-action-register/SKILL.md)
  - [`jirah-pilot-plan`](../jirah-pilot-plan/SKILL.md)
  - [`jirah-case-study`](../jirah-case-study/SKILL.md)
  - [`jirah-client-presentation`](../jirah-client-presentation/SKILL.md)
  - [`jirah-kpi-tracker`](../jirah-kpi-tracker/SKILL.md) (monthly note review)
  - [`jirah-ai-pilot-status`](../jirah-ai-pilot-status/SKILL.md) (weekly status review)
- Context: jirah-voice.md, jirah-methodology.md, jirah-visuals.md, jirah-friction-points.md, jirah-pattern-library.md
