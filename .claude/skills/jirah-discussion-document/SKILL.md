---
name: jirah-discussion-document
description: Step 2 deliverable — produce the Mode A (JIRAH-branded) Discussion Document that codifies objectives, scope, explicit out-of-scope, timeline, and investment for a new engagement. Pattern sourced from the S&A exemplar (full-viewport scroll-snap HTML). Use after a Discovery call returns Fit = Yes, or when Jason says "draft the Discussion Document for X," "turn the X discovery into a proposal," or "codify scope for the [engagement] engagement."
---

# /jirah-discussion-document

## Purpose

Draft **Step 2**: the shared contract between Jirah and the prospect that names what we'll do, explicitly what we won't, timeline, and investment. This becomes the artifact the prospect approves before we schedule the Kickoff.

The Discussion Document is the single highest-leverage writing artifact in the engagement: it codifies scope discipline before the sprint, which is what prevents scope creep during the sprint. Pattern 4 from the library applies — two columns: *What you told us* | *What we think the real question is.*

## Pre-requisites (read before drafting)

- [context/jirah-process.md](../../../context/jirah-process.md) — Step 2 purpose, cadence, exit criteria
- [context/jirah-methodology.md](../../../context/jirah-methodology.md) — scope discipline (SOPs, handbooks, full HR policy usually OUT)
- [context/jirah-voice.md](../../../context/jirah-voice.md) — deliverable structure, voice markers
- [context/jirah-visuals.md](../../../context/jirah-visuals.md) — **Mode A** rules (gold + navy, Playfair + DM Sans, formal "JIRAH Growth Partners" branding)
- [context/jirah-pattern-library.md](../../../context/jirah-pattern-library.md) — engagement shapes + price anchors; two-column framing pattern
- `C:\Users\jason\Downloads\SA_Discussion_Document.html` — **structural exemplar**, full-viewport slide-deck style with scroll-snap, fixed right-side nav dots, top progress bar, slide counter

## Inputs (ask if not supplied)

- **Prospect** — name or path to `prospects/[slug]/` where discovery synthesis lives
- **Source** — typically `prospects/[slug]/discovery-notes.md` or equivalent; must contain owner framing + Jirah's read
- **Engagement shape** — one of:
  - `sprint-report` — $50–100k, 2-day sprint + 45-day action register (Falcon / Genesis default)
  - `active-advisory-retainer` — $10–25k+/month, ongoing, extended-CEO (post-sprint default)
  - `light-coaching-retainer` — ~$1k/mo + add-on sprints (Hatch outlier — use sparingly)
  - `parallel-strategic-ai` — strategic sprint + 4-week AI pilot in parallel (S+A shape)
  - `custom` — name the shape explicitly; anchor price to pattern library
- **Price anchor** — resolved from shape + pattern library; Jason can override with `--investment [amount]`

---

## Process

### 1. Ingest the discovery material

Read:
- Discovery synthesis (owner's framing + Jirah's read)
- Prospect frontmatter (industry, staff, revenue, geo, stage)
- Any pattern-library match flagged during discovery

### 2. Generate the two-column scope frame

**Pattern 4 from the library:** owners name symptoms; Jirah names constraints. The Discussion Document makes this visible to the prospect *on page 1* — it's the single feature that sells the diagnostic before the sprint even starts.

```markdown
| What you told us | What we think the real question is |
|---|---|
| "We need to get to $10M." | "Whether 9-partner governance can carry a firm past $10M without collapsing decision speed." |
| [owner verbatim symptom 2] | [our structural reframe 2] |
| ...up to 3–4 rows |
```

Keep the rows tight. Each right-column entry maps to a friction point (1–10) — tag it in a small footnote or color marker.

### 3. Build the 7-section structure

Follow [context/jirah-voice.md](../../../context/jirah-voice.md) deliverable structure, tuned for Discussion Document purpose:

```
SECTION 1 — What we heard (2 slides / 1 page)
  Owner's framing in their own words.
  2-column table (step 2 above).

SECTION 2 — What we think matters (2 slides / 1 page)
  Top 3 friction-point hypotheses with confidence tags (Medium at this stage — we haven't triangulated yet).
  Pattern-library match if one exists ("This shape most resembles [engagement]; transferable insight: [1 line]").

SECTION 3 — Scope of the engagement (2–3 slides / 1–2 pages)
  Concrete scope by phase:
  - Kickoff (Step 3) — 60–90 min; attendees; data asks
  - Sprint (Step 4) — duration + days, who attends, what transcripts we take
  - Triangulation — number of team interviews, external checks, data pulls
  - Action Register (Step 5) — delivered N days post-sprint
  - KPI Tracking (Step 6) — monthly cadence, what we review
  For AI pilots (parallel-strategic-ai shape): add AI track with weekly deliverables.

SECTION 4 — What is explicitly OUT of scope (1 slide / 0.5 page)
  Per jirah-methodology.md scope discipline:
  - SOP writing
  - Employee handbooks
  - Full HR policy drafting
  - Any other likely scope-creep item specific to this engagement
  State the reason: "These are execution artifacts owned by your ops team or an HR vendor. Expanding scope here would expand price without expanding value."
  If the prospect explicitly asked for one of these during discovery, name it here: "You mentioned SOPs — we'd recommend scoping that as a follow-on once the strategic layer is locked." Pattern 7 from the library: scope creep dies on the page.

SECTION 5 — Timeline (1 slide / 0.5 page)
  Gantt-style or week-numbered list:
  - Week 0 — Discussion Document sign-off
  - Week 1 — Kickoff
  - Week 2–3 — Sprint (or whatever the shape dictates)
  - Week 4–8 — Triangulation + Action Register drafting
  - Week 9 — Action Register delivery
  - Week 10+ — KPI Tracking begins (monthly)
  Name specific dates if discovery produced a start target.

SECTION 6 — Investment (1 slide / 0.5 page)
  One price band matching the engagement shape. No multi-option quote unless the client asked for it — that signals we haven't made a recommendation. Pricing pattern from library:
  - Sprint + Report: $50–100k (Falcon $49.9k + $17.3k amendment; Genesis similar)
  - Active Advisory Retainer: $10–25k+/mo M2M, 30-day notice
  - Light Coaching Retainer: $1k/mo + $2.75k/add-on (rare; use only when fit matches Hatch shape)
  - Parallel Strategic + AI: $121.5k strategic + AI hourly (S+A anchor)
  Include what's covered, what triggers change-order pricing, payment cadence, cancellation terms. No hedging language.

SECTION 7 — Why Jirah + Next Steps (1 slide / 0.5 page)
  Short ethos paragraph (from context/jirah-firm.md — Jason + Joshua, extended-CEO team, pattern library, dual-facilitator method).
  Pattern-library namecheck: the prior engagement(s) this shape matches.
  Next steps: "Two 1-hour kickoff meetings" — per voice-doc convention. Dates offered.
  Sign-off block: Jason Lotoski + Joshua Marshall, JIRAH Growth Partners, contact info.
```

### 4. Apply Mode A visual rules

Output is **single-file HTML** (per S+A exemplar pattern) with:

- **Full-viewport slide-deck layout** — each section = one full-screen slide, scroll-snap anchored
- **Fixed right-side nav dots** — one per section, active-state gold `#C5A55A`
- **Top progress bar** — shows scroll position
- **Bottom-right slide counter** — "3 / 7"
- **Playfair Display** for display type, **DM Sans** for body (Google Fonts via `<link>`)
- **Gold** `#C5A55A` for accents, **Navy** `#111827` for primary ink, **warm off-white** background `#FAF7F0`
- **Header / footer** — "JIRAH Growth Partners" on every slide (formal branding per Mode A)
- **Logo** — "J" monogram in gold, top-left
- No JavaScript beyond what scroll-snap + progress-bar update require (keep it vanilla; no build step)
- No external dependencies beyond Google Fonts

Reference the S+A HTML exemplar for CSS structure — steal verbatim, update copy.

### 5. Voice checklist (non-negotiable)

- [ ] Direct — no hedging on recommendations, no "it depends"
- [ ] Proofs of discipline embedded — mention triangulation, dual-facilitator, action register explicitly at least once
- [ ] Numbers > adjectives — every section with a stat has a specific number, not "significant" or "substantial"
- [ ] Out-of-scope is NAMED, not implied
- [ ] Plan A / Plan B decision forks shown only if there's real uncertainty (usually in AI track, rarely in strategic)
- [ ] Risks + mitigations section paired (can be embedded in Scope section rather than standalone if the engagement is low-risk)
- [ ] Formal "JIRAH Growth Partners" in titles; lowercase "Jirah" in body copy per visuals doc

### 6. Output

```
engagements/[slug]/01-discussion-document/
├── SA_source_reference.html (copy of the exemplar — do not edit)
├── [slug]-discussion-document.html
├── [slug]-discussion-document.md (markdown mirror, plain text reference)
└── draft-notes.md (internal — why we scoped it this way, what we pushed back on)
```

OneDrive equivalent when syncing to prod: `01 - Clients\Active\[ClientName]\05 - Discovery & Discussion Doc\` per the per-client folder convention in CLAUDE.md.

PDF export: Jason opens in Chrome, prints to PDF (scroll-snap renders page-per-slide naturally). No automated PDF toolchain needed.

Update prospect/engagement frontmatter:
- `currentStep: 2` (Step 2 drafted)
- `stage: proposal-sent`
- `nextAction: [date prospect is expected to respond]`
- `engagement_shape: [shape]` (new field)
- `investment_proposed: [$amount]` (new field)

### 7. Draft accompanying email

Optionally chain into `/jirah-email --scenario proposal-send` to generate the cover email that accompanies the Discussion Document.

Output to chat:

```
Discussion Document — [Prospect name] — [engagement shape]

7 sections drafted. Mode A. Single-file HTML at engagements/[slug]/01-discussion-document/.

Scope anchor: [1-sentence summary of the engagement shape]
Investment: [$amount]
Timeline: [start date → KPI phase]

Pattern-library match: [engagement]
Two-column reframe produced: [row count] rows

Next action: [send to prospect / internal review first / revise based on J+J debrief]

To generate the cover email: /jirah-email --scenario proposal-send --target [slug]
```

---

## Edge cases

- **Prospect explicitly pushed back on scope during discovery** (wants SOP work included) — keep the OUT-OF-SCOPE section intact, but add a dedicated "We heard you on SOPs — here's how we'd scope that separately" callout in Section 3. Never just quietly fold it into the main scope.
- **Multi-partner firm where discovery was with one owner only** — flag as Medium-confidence on anything governance-related; scope should include "governance-mapping workshop with all partners" as Kickoff prerequisite.
- **Investment band looks too rich for the prospect's revenue** — flag internally, don't lower price automatically. Pattern library shows most post-sprint retainers should land at $10–25k+/mo, not Hatch's $1k rate. Discuss with Jason+Joshua before sending.
- **Prospect came from Friction Audit** — Discussion Document is shorter / faster to produce because the Friction Audit already did the triangulation work. Reference the audit findings explicitly in Section 1 and 2.
- **AI pilot is the primary scope** (not parallel to strategic) — this is likely a **Mode B** doc, not Mode A. Invoke [`/jirah-pilot-plan`](../jirah-pilot-plan/SKILL.md) instead.
- **Prospect is in Funnel 1 (Kelowna / local)** — skip the heavy "Why Jirah" section; they've already had lunch. Lean the doc tighter — owner knows us, the artifact is about scope + price clarity.
- **Engagement shape is unclear after discovery** — do not draft. Flag to Jason+Joshua for shape decision first; the entire document hangs on shape.

## Related

- Upstream: [`jirah-discovery`](../jirah-discovery/SKILL.md) (produces the source material)
- Downstream: [`jirah-kickoff-agenda`](../jirah-kickoff-agenda/SKILL.md) (on sign-off)
- Adjacent: [`jirah-email`](../jirah-email/SKILL.md) (cover email on send), [`jirah-pilot-plan`](../jirah-pilot-plan/SKILL.md) (Mode B alternative for AI-primary scope)
- Context: jirah-process.md, jirah-methodology.md, jirah-voice.md, jirah-visuals.md, jirah-pattern-library.md
- Structural exemplar: `C:\Users\jason\Downloads\SA_Discussion_Document.html`
