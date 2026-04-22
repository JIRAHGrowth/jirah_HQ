---
name: jirah-case-study
description: Auto-draft a case study from a finished (or 90-day-post-delivery) engagement in Jirah's signature "owner thought X, actual was Y" narrative. Mode A editorial. Pulls from action register + KPI tracker + session notes. Requires client sign-off before publishing. Feeds /jirah-thought-leadership, pitch decks, and the pattern library. Use when Jason says "draft case study for X," "write up the Y engagement," "turn Genesis into a case study," or at the 90-day post-delivery harvest trigger.
---

# /jirah-case-study

## Purpose

Convert a delivered engagement into a **proof artifact** that:
1. Feeds top-of-funnel content (`/jirah-thought-leadership`)
2. Becomes a named case in the pattern library (`context/jirah-pattern-library.md`)
3. Shows up in pitch materials when a new prospect looks like a similar shape
4. Anchors the referral + testimonial harvest loop

This is the **harvest end** of the growth machine. Every delivered engagement should produce one.

## Pre-requisites (read before drafting)

- [context/jirah-voice.md](../../../context/jirah-voice.md) — signature "owner thought X, actual was Y" format; voice markers
- [context/jirah-pattern-library.md](../../../context/jirah-pattern-library.md) — prior case-study patterns (Falcon, Genesis, Hatch, S+A); cross-engagement findings
- [context/jirah-visuals.md](../../../context/jirah-visuals.md) — **Mode A** (editorial, premium, JIRAH-branded)
- [context/jirah-friction-points.md](../../../context/jirah-friction-points.md) — for tagging the real constraint
- Engagement profile + action register + KPI tracker outputs + session notes

## Inputs (ask if not supplied)

- **Engagement** — slug or path to `engagements/[slug]/` / OneDrive active-client folder
- **Trigger moment** — `delivery` (right after action register shipped) | `90-day` (default — results have landed) | `retrospective` (>90 days; engagement long closed)
- **Attribution** — `--named` (client cleared for public attribution) | `--anonymous` (default — use descriptor like "a 90-person engineering firm")
- **Target outlets** — `--for linkedin` (short 200-word companion piece) | `--for pitch` (long editorial) | `--for pattern-library` (internal synthesis row)

---

## Process

### 1. Confirm the engagement is ready

Read engagement frontmatter. This skill needs:
- `report_delivered_date` — Step 5 action register was shipped
- `real_constraint` — the wedge finding from the engagement (populated by `/jirah-action-register`)
- `engagement_shape` — Sprint+Report / Active Advisory / Light Coaching / Parallel Strategic+AI
- Ideally: 90+ days since delivery + at least 1 KPI tracker cycle showing movement

If the engagement lacks `real_constraint` or never went through `/jirah-action-register`: flag and ask whether to proceed with looser evidence.

### 2. Ingest the engagement

Read in this order:
- Engagement profile (`00-profile.md` / OneDrive equivalent)
- Action register (the Step 5 deliverable — source of truth for findings + recommendations)
- All KPI tracker outputs (`08 - Monthly Retainer/` or `engagements/[slug]/kpi/`) — looking for numerical movement
- Session notes (for verbatim quote candidates)
- Triangulation plans (for the evidence trail)
- Prior case-study drafts if any

Extract the three anchors:
- **Owner's initial framing** — what they said at Discovery (verbatim if possible)
- **Jirah's finding** — the real constraint, with confidence tag
- **What moved** — specific numerical or structural changes post-delivery (from KPI tracker)

### 3. Apply the signature structure

The Jirah case-study format — all outputs follow this, adjusted for length per target outlet:

```
HOOK (1–2 sentences)
  Counter-intuitive specific observation. Not generic. Specific to this engagement.
  Example: "A 9-partner engineering firm was chasing $10M. The ceiling was the governance."

OWNER'S INITIAL FRAMING (1 paragraph)
  What they told us at Discovery. Verbatim or close paraphrase.
  This is the 'X' in 'owner thought X.'

WHAT THE DATA SHOWED (2–3 paragraphs)
  The triangulated evidence. Named friction-point shift.
  Specific numbers from the Sprint: interview counts, survey respondents, financial data,
  verbatim team-member quotes (anonymized to role unless cleared).
  This is the 'Y' in 'actual was Y.'
  Name the friction point explicitly (usually FP #10 per Pattern 1 in the library).

THE RECOMMENDATION (1–2 paragraphs)
  The critical recommendation from the action register. Not the whole register — the
  single Critical item that moved the real constraint.
  Include the sequencing argument if relevant (Falcon pattern: Rec 1 must precede Recs 2+3).

WHAT CHANGED (1 paragraph, numerical)
  Post-implementation movement from KPI tracker. Specific numbers, specific time horizons.
  "Within 90 days of the governance amendment: decision cycle on >$50k commitments
  dropped from 3 weeks average to 4 days."

THE TAKEAWAY (1–2 sentences)
  Counter-intuitive, memorable, reusable. The line that survives being screenshotted.
  Usually a reframing of FP #10 per Pattern 8: "These are not signs of weakness.
  They are signs of readiness for the next stage."

SOFT CTA (1 line)
  "Friction Audit applications open — link in bio"
  OR for pitch context: "We map this pattern in firms between 30 and 150 staff. If
  it sounds familiar — here's how we start."
```

### 4. Apply attribution rules

- `--named` — verify client has cleared attribution in writing. If not, flag and require partner confirmation before drafting.
- `--anonymous` (default) — use descriptor:
  - "a 90-person engineering firm in Western Canada"
  - "a 9-partner consulting group scaling past 100 staff"
  - "a multi-office professional services firm preparing for succession"
- Team-member quotes — always role-anonymized ("Ops lead said...") unless the person explicitly cleared naming
- Financial specifics — if cleared for naming, include verbatim. If anonymous, use bands ("mid-eight-figure revenue")

### 5. Calibrate length to target outlet

- `--for linkedin` — ~200 words, carries the full structure in compressed form
- `--for pitch` — 800–1200 words, headings, pull-quotes, Mode A editorial feel
- `--for pattern-library` — internal synthesis row; extract the transferable insight, not narrative. Appends to `context/jirah-pattern-library.md`.

### 6. Draft + render

For pitch-length:
- Apply Mode A single-file HTML: full-viewport scroll-snap or editorial scroll; Playfair Display + DM Sans; gold + navy + warm off-white; formal "JIRAH Growth Partners" header
- 2–3 pull-quotes that travel standalone (screenshot-ready)
- Cover image brief (Canva-ready once MCP wired) — stat card or quote card

For linkedin-length:
- Markdown only, copy-paste into LinkedIn
- 1 pull-quote line surfaced for image generation

For pattern-library:
- Markdown append to `context/jirah-pattern-library.md`:
  ```markdown
  ### [Engagement name] — [1-line shape descriptor]
  [1 paragraph: owner framing → finding → constraint named → what moved]
  **Transferable:** [1-sentence lesson this engagement teaches the library]
  ```

### 7. Client sign-off gate (non-negotiable for external publishing)

Before any `--for linkedin` or `--for pitch` output gets written to a "ready-to-publish" path:

- If engagement has `client_clearance: approved` in frontmatter → proceed
- Otherwise → output to `case-studies/drafts/[slug]-[outlet]-YYYY-MM-DD.md` and chain into `/jirah-email --scenario general` to draft the clearance ask

The clearance ask format (partner voice, single-send):

```
Subject: Case study draft — [firm name] — quick review before we publish

[First name],

We drafted a case study from our work together. Two versions attached — a 200-word
LinkedIn post and a longer 1,000-word piece.

Two asks before we share it anywhere:
1. Anything in the numbers or framing you'd change?
2. Are you comfortable with [named attribution / or: we've kept it anonymized as "a [descriptor]"]?

No rush — the work stays on pause until you confirm.

Jason and Joshua
```

### 8. Output paths

```
case-studies/
├── drafts/
│   └── [slug]-[outlet]-YYYY-MM-DD.md
└── published/
    ├── [slug]-linkedin.md         (once client-cleared)
    ├── [slug]-pitch.html          (once client-cleared)
    └── [slug]-pitch.md            (markdown mirror)

context/jirah-pattern-library.md   (pattern-library outlet appends here directly; internal IP — no sign-off needed)
```

OneDrive equivalent: `03 - Marketing & Content\Case Studies\[ClientName]\`

Update engagement frontmatter:
- `case_study_draft_date: YYYY-MM-DD`
- `case_study_status: drafted | client-review | published`
- `client_clearance: pending | approved | declined`

### 9. Trigger downstream

After a case study is published:
- `/jirah-thought-leadership --from-engagement [slug]` — post drawn from the case
- `/jirah-referral-ask` — referral moment: "publication" is a goodwill trigger
- `/jirah-testimonial-ask` — if not already asked, overlap the two asks carefully

### 10. Output to chat

```
Case Study — [Client / descriptor] — [outlet]

Structure
- Hook: [1-sentence summary]
- Framing: owner thought "[summary]"
- Finding: FP #N [name] ([confidence])
- Critical rec: [1-line]
- What moved: [key metric]
- Takeaway: "[pull-quote candidate]"

Attribution: [named / anonymous with descriptor]
Client clearance: [status]

Files
- Draft: [path]
- Pattern-library append: [queued / done]

Next steps
- Send clearance ask: /jirah-email --scenario general --target [slug]
- After approval: move to published/, trigger /jirah-thought-leadership + /jirah-referral-ask
```

---

## Voice rules (non-negotiable)

- Lead with counter-intuitive observation; never with statistic or "have you ever wondered"
- Numbers > adjectives — cut "significant" or "substantial," replace with a number from the KPI tracker
- Client takes the win; Jirah names the pattern — never make Jirah the hero
- No humble-brag phrasing ("we had the privilege of working with...")
- No generic industry flattery
- Every strong claim backed by a specific data point from the engagement

## Edge cases

- **No KPI tracker data yet** (pre-90-day trigger) — flag; draft the "delivery-moment" version (findings + recommendations, no post-change metrics yet); note the numbers will backfill after KPI data lands
- **Engagement closed unsuccessfully** (Plan A failed, client didn't implement, retainer didn't extend) — do NOT draft a happy-path case study. Write an internal-only pattern-library entry flagged `outcome: learning`; surface what the engagement taught. No external publication.
- **Client declined attribution AND the anonymization is too thin** (firm is recognizable by descriptor alone) — increase abstraction or decline to publish; flag for Jason.
- **Engagement was Mode B (AI pilot-primary)** — case study leans into the AI opportunity → pilot → integration arc; reference S+A Shop-Drawing pilot as pattern anchor
- **Multiple case studies for the same engagement** (post-delivery + 1-year post) — tag with date; both legitimate; the 1-year adds durability evidence
- **Findings conflict with current pattern library** (this engagement's real constraint was NOT FP #10) — surface as a notable exception in the pattern-library append; investigate what was structurally different
- **Sensitive content in sessions** (harassment allegation, financial issue) — do NOT include in case study, even anonymized; focus on the strategic findings only

## Related

- Upstream: [`jirah-action-register`](../jirah-action-register/SKILL.md), [`jirah-kpi-tracker`](../jirah-kpi-tracker/SKILL.md), [`jirah-session-analyzer`](../jirah-session-analyzer/SKILL.md) (for verbatim quote mining)
- Downstream: [`jirah-thought-leadership`](../jirah-thought-leadership/SKILL.md), [`jirah-testimonial-ask`](../jirah-testimonial-ask/SKILL.md), [`jirah-referral-ask`](../jirah-referral-ask/SKILL.md)
- Adjacent: [`jirah-email`](../jirah-email/SKILL.md) (clearance ask drafting)
- Context: jirah-voice.md, jirah-visuals.md, jirah-friction-points.md, jirah-pattern-library.md
- Cadence trigger: 90 days post-delivery; queue via Sprint 4 scheduler
