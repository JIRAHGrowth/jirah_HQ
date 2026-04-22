---
name: jirah-financial-audit
description: Turn client financial statements (P&L, balance sheet, cash flow, AR aging) into friction-point signals. Pattern-checks margin by service line, client concentration, AR aging, working capital, 3-year trend lines, partner comp ratio. Maps each finding to a friction point with confidence tag. Feeds Friction Audit afternoon data pass, sprint triangulation, discovery-stage pre-engagement review. Use during a Friction Audit day, when Jason says "review the financials for X," "red flags on these numbers," or when a client shares statements pre-engagement.
---

# /jirah-financial-audit

## Purpose

Financial statements are one of the **most underexploited triangulation sources** in owner-run B2B firms. Owners walk into Discovery with a framing ("we need to get to $10M"); the financials usually tell a different story. This skill surfaces the structural signals the numbers are carrying — before the friction audit's synthesis hour needs them.

Integrates with:
- **`/jirah-friction-audit`** afternoon data pass — where most financial reviews run
- **`/jirah-sprint-facilitation`** — when statements become available mid-sprint
- **`/jirah-discovery`** — when statements are supplied pre-engagement
- **`/jirah-triangulation`** — when a hypothesis needs financial validation

## Pre-requisites (read before reviewing)

- [context/jirah-friction-points.md](../../../context/jirah-friction-points.md) — so every finding maps to a lens (FPs 2, 3, 4, 5, 7 most common)
- [context/jirah-methodology.md](../../../context/jirah-methodology.md) — triangulation + confidence tagging
- [context/jirah-voice.md](../../../context/jirah-voice.md) — how findings get written up (direct, numbers > adjectives)
- [context/jirah-pattern-library.md](../../../context/jirah-pattern-library.md) — prior engagement financial signals (Falcon partner comp, Genesis retention-vs-revenue split)

## Inputs (ask if not supplied)

- **Engagement / client** — slug or path
- **Statements provided** — at least one of:
  - 3-year P&L (most important — trend lines live here)
  - Balance sheet (current + year-ago)
  - Cash flow statement (current year)
  - AR aging report (most recent month)
  - Client concentration list (top 10 by revenue)
  - Partner / owner comp breakdown (optional but high-signal for FP #10)
- **Mode** — `--audit-pass` (fast, <1 hour, during Friction Audit day) | `--deep` (full analysis, feeds Step 5 Action Register) | `--validate [hypothesis]` (single-hypothesis triangulation)

---

## Process

### 1. Validate statements are usable

Read file(s). Confirm:
- Period labels are clear (FY2024, 2024-Q4, etc.)
- Line items are at least service-line or department level (not just "Revenue" + "Expenses" — that's too aggregated)
- Units are consistent (thousands / millions — flag if ambiguous)
- Currency is named (CAD vs USD matters for Jirah's BC/AB client base)

If statements are aggregated to the point of un-analyzability (e.g., single-line "Revenue: $X"), flag and stop. Ask for more detail.

For binary formats (PDF / xlsx):
- Read with appropriate tool; flag any garbled sections
- For xlsx, extract sheet structure first; work through revenue / expense / balance-sheet / cash-flow sheets in order

### 2. Run the 7 red-flag checks

Each check produces a finding mapped to a friction point.

#### Check 1: Margin by service line

- Compute gross margin % per service line (or best-available segmentation)
- Flag service lines with margin <15% that aren't explicit loss-leaders
- Flag margin compression W/W: any line whose margin dropped >5pp in last 12 months
- Flag margin dispersion: if highest vs lowest service line gross margin differs by >25pp, there's structural mismatch

**Maps to:** FP #3 (Product/Service Mix), often FP #4 (Strategy — resources aren't following margin)

**Confidence:** Medium by default (single-source); upgrade to High if triangulated by a team interview that surfaces the same pattern.

#### Check 2: Client concentration

- Compute top-3 clients = what % of revenue
- Flag if top-3 >40% (heavy concentration risk)
- Flag if top-1 >20% (single-client dependency)
- Flag if concentration is growing year-over-year (firm is getting less diversified, not more)

**Maps to:** FP #2 (Revenue Generation)

**Confidence:** High (the numbers are what the numbers are); add context from owner/team interview about *why* the concentration exists.

#### Check 3: AR aging

- Categorize AR by days outstanding: 0–30 / 31–60 / 61–90 / 90+
- Flag if 60+ bucket is >15% of total AR (collection issues)
- Flag if 90+ bucket has specific large balances (customer-relationship risk + cash-flow drag)
- Compute Days Sales Outstanding (DSO) = (AR / revenue) × period days; flag if trending up year-over-year

**Maps to:** FP #2 (Revenue Generation — cash-to-revenue quality), FP #5 (Structure — who owns collections)

**Confidence:** High for the aging itself; Medium for the *cause* (system vs. person vs. client-relationship)

#### Check 4: Working capital / runway

- Compute current ratio (current assets / current liabilities); flag if <1.5
- Compute quick ratio (excluding inventory); flag if <1.0
- Compute cash runway (cash / monthly burn rate) if cash-flow statement available; flag if <3 months
- Note if debt load is increasing faster than revenue

**Maps to:** FP #7 (Lifecycle — is the firm's capital position matched to its growth stage?)

**Confidence:** High. These are pure balance-sheet facts.

#### Check 5: 3-year trend lines

- Revenue YoY growth rate — is it accelerating, steady, or decelerating?
- EBITDA margin — expanding, stable, compressing?
- Headcount growth vs revenue growth — which is outpacing which?
- Revenue per FTE — trend direction

**Maps to:** FP #7 (Lifecycle), FP #5 (Structure — staff growth outpacing revenue = classic missing-middle signal from pattern library), FP #2 (Revenue)

**Confidence:** Medium (trends can be cyclical); Medium unless a 5+ year trend is visible.

#### Check 6: Partner / owner comp ratio (FP #10 signal)

- If partner comp breakdown is available:
  - Compute partner comp as % of revenue
  - Benchmark against industry norms (engineering consulting: 15–25% typical for firm with 5+ partners; prof services: 20–35%)
  - Flag if wildly out of band — over means partners are over-extracting; under means owner/partners are subsidizing
- Note: comp structure often IS the FP #10 signal. If partners are making $2M+ each while the firm has no GM, that's the bottleneck funded

**Maps to:** FP #10 (Ownership Impact) — this is a direct financial proxy for the wedge

**Confidence:** Medium default; upgrade to High when paired with org-chart + hiring-pattern evidence.

#### Check 7: Comp benchmarking (if staff roster exists)

- Compare staff comp bands against industry norms (rough — we're not a salary-survey firm)
- Flag significant under-pay (retention risk — FP #6) or over-pay (margin drag — FP #3)
- Flag unusual bonus / profit-share structures that suggest partner-led wealth extraction vs. team-wide participation

**Maps to:** FP #6 (Culture), FP #3 (Product/Service Mix margins)

**Confidence:** Low (external benchmarks are imprecise). Surface as a probe question, not a finding.

### 3. Apply pattern-library cross-reference

For each finding, check `context/jirah-pattern-library.md` for matching prior-engagement patterns:

- Falcon: "9-partner comp structure and $8.5M revenue revealed governance-first wedge in financials"
- Genesis: "Revenue growth without proportional infrastructure investment"
- S+A: "9 Principals billing $2.6–2.7M each — missing-middle visible in per-partner revenue"
- Hatch: valuation work ($524k across 3 methods) as internal anchor

If the current client's signals match one of these precedents, note it explicitly.

### 4. Draft the review

```markdown
---
engagement: [slug]
mode: audit-pass | deep | validate
statements_reviewed:
  - [filename] ([period])
  - ...
reviewed_date: YYYY-MM-DD
reviewer: JL | JM
---

# Financial Review — [Client] — [period]

## Statements reviewed
[List with periods + units + currency]

## Red-flag summary

### Critical (affect Action Register Critical tier)
- **[FP #N, specific finding]** — [1-sentence]. Confidence: [H/M].
  - Evidence: [specific numbers]
  - Implication: [what this means for the engagement]

### High (affect High-tier recommendations)
- ...

### Medium (watch-list, probe during sprint)
- ...

## 7-check run

### 1. Margin by service line
- Top-line: [result]
- Flags: [list with numbers]
- FP mapping: #3, #4

### 2. Client concentration
- Top-3 = [X%]; top-1 = [Y%]
- Flags: [list]
- FP mapping: #2

### 3. AR aging
- 60+ bucket: [%]; 90+ bucket: [% with specific balances if notable]
- DSO: [days, trend]
- FP mapping: #2, #5

### 4. Working capital
- Current ratio: [X]; quick ratio: [Y]; runway: [Z months]
- FP mapping: #7

### 5. Trend lines (3yr)
- Revenue YoY: [pattern]
- EBITDA margin: [pattern]
- Headcount vs revenue: [pattern]
- Revenue per FTE: [pattern]
- FP mapping: #2, #5, #7

### 6. Partner / owner comp ratio
- Partner comp / revenue: [X%]
- Benchmark: [industry norm]
- FP mapping: #10 ← the wedge
- Pattern-library match: [Falcon / S+A / none]

### 7. Comp benchmarking
- [observations with low-confidence flag]
- FP mapping: #6, #3

## Pattern-library cross-reference
- [Matches found]

## Hypotheses surfaced for triangulation
- [Numbered list — these feed /jirah-triangulation planning]
  1. "Hypothesis: [structural claim]." — Friction point #N. Needs: team interview + data pull X.
  2. ...

## Out of scope (flagged; NOT addressed here)
- [E.g., "Tax strategy — refer to accounting partner"; "Loan covenant compliance — legal review needed"]

## Questions to surface with client
- [Numbered — for Joshua to work into the morning owner session or afternoon interviews]
```

### 5. Output

```
engagements/[slug]/06-sprint/financial-review/
└── financial-review-YYYY-MM-DD.md
```

OneDrive equivalent: `01 - Clients\Active\[ClientName]\06 - Sprint & Facilitation\`

Update engagement frontmatter:
- `financial_review_date: YYYY-MM-DD`
- `financial_review_critical_flags: N`
- `financial_review_hypotheses_surfaced: K`

### 6. Cross-skill triggers

- **Feeds [`jirah-triangulation`](../jirah-triangulation/SKILL.md):** each surfaced hypothesis queues as a triangulation-planning candidate
- **Feeds [`jirah-action-register`](../jirah-action-register/SKILL.md):** Critical / High flags feed register rows at Step 5
- **Feeds [`jirah-friction-audit`](../jirah-friction-audit/SKILL.md) synthesis:** during audit day, this skill's output drops directly into the findings doc
- **Feeds [`jirah-pattern-library-query`](../jirah-pattern-library-query/SKILL.md):** if the financial shape matches a prior engagement, flag for Jason

### 7. Output to chat

```
Financial Review — [Client] — [period]

Mode: [audit-pass / deep / validate]
Statements reviewed: [count]

Flag summary
- Critical: [count]
- High: [count]
- Medium: [count]

Pattern-library matches: [engagement names or none]
Wedge signal (FP #10): [surfaced / not surfaced — partner comp ratio]

Top hypotheses surfaced
1. [hypothesis — friction point + confidence]
2. ...

Output: [path]

Next steps
- During audit day: drops into findings doc synthesis
- Post-sprint: queue /jirah-triangulation on Medium-confidence hypotheses
- For action register: [count] findings ready to feed Step 5 drafting
```

---

## Voice rules

- Numbers, not adjectives. Every flag cites the specific number that triggered it.
- Confidence tag on every finding per `context/jirah-methodology.md`
- Out-of-scope items named explicitly (tax strategy, loan compliance, audit-firm audit quality)
- No "the financials suggest" hedging — if the pattern is there, name it; if the single-source confidence is Medium, say so
- Internal document — partners read it, not clients (this feeds the action register, not a standalone deliverable)

## Edge cases

- **Only one year of P&L available** — cannot compute trend lines; skill still runs checks 1, 2, 3, 6, 7; flag the gap in Check 5
- **No AR aging report** — note the absence; request it for next pass (or use DSO as proxy if balance-sheet AR total + revenue are available)
- **Cash / CFO-level detail unavailable** (partners unwilling to share) — scope the review to P&L-only; flag limitation; downgrade confidence on Checks 4 and 6
- **Statements are tax-basis not GAAP** (common for SMB) — note in output; interpretations still valid but margin comparisons less clean
- **Owner comp is hidden in operating expenses** (not broken out) — flag; ask for comp detail; Check 6 can't run without it
- **Foreign currency** (USD client reporting in CAD or vice versa) — normalize to single currency before trending; flag if ambiguity exists
- **Service-line margin isn't broken out** — can only run aggregate gross-margin; flag the gap; recommend restructuring finance books as a possible engagement scope item
- **Loss-making firm** (negative EBITDA) — shift emphasis to Check 4 (runway); runway <3 months is a scope-reset signal for the engagement itself

## Related

- Upstream callers:
  - [`jirah-friction-audit`](../jirah-friction-audit/SKILL.md) `--mode synthesize` (afternoon data pass)
  - [`jirah-sprint-facilitation`](../jirah-sprint-facilitation/SKILL.md) when financials arrive mid-sprint
  - [`jirah-discovery`](../jirah-discovery/SKILL.md) `--synthesize` if statements supplied pre-engagement
- Downstream: [`jirah-triangulation`](../jirah-triangulation/SKILL.md), [`jirah-action-register`](../jirah-action-register/SKILL.md)
- Subagent alternative: [`jirah-document-reviewer`](../../agents/jirah-document-reviewer.md) for general doc review; this skill is financially-specialized
- Context: jirah-friction-points.md, jirah-methodology.md, jirah-pattern-library.md, jirah-voice.md
