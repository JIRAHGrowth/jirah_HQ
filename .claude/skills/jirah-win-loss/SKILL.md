---
name: jirah-win-loss
description: One-shot retrospective across Jirah's historical proposal archive. Fans out 5 jirah-proposal-miner subagents in parallel over the discovered set. Aggregates into win rate by industry/offer/price, clustered loss reasons, price-point patterns, revivable lost-deal list, and ICP refinements that update context files. Calibrates /jirah-pipeline-forecast conversion rates. Re-run quarterly as archive grows. Use when Jason says "run the win-loss retrospective," "time to calibrate the forecast," "what the archive tells us about ICP," or when a fresh batch of historical proposals surfaces (email/Google Drive/Dropbox/pre-OneDrive filing).
---

# /jirah-win-loss

## Purpose

Replace intuition with data. Mine the proposal archive to:
1. **Sharpen ICP** — what does the data say vs. what `context/jirah-icp-wedge.md` currently says?
2. **Validate the wedge** — which offers resonate; which languages fell flat
3. **Calibrate pricing** — what won at $X; what lost at $Y
4. **Surface revivable lost-deal candidates** — prospects worth re-approaching with sharpened positioning
5. **Calibrate `/jirah-pipeline-forecast`** — replace default conversion rates with real ones

**Context:** Sprint 1e discovered the OneDrive archive held ~4 engagements, not ~50 as originally scoped. The Sprint 1e pattern-library codification ran across those 4 as a re-scoped retrospective — `reports/pattern-library-codification-2026-04-18.md`. This skill is the **full-archive retrospective** that will run when a larger proposal archive surfaces (email, Google Drive, Dropbox, pre-OneDrive filing), or as a quarterly re-run when the archive has grown from new engagements.

## Pre-requisites (read before running)

- [context/jirah-icp-wedge.md](../../../context/jirah-icp-wedge.md) — current ICP (to compare against data findings)
- [context/jirah-pipeline.md](../../../context/jirah-pipeline.md) — current pipeline state, conversion-rate calibration block
- [context/jirah-pattern-library.md](../../../context/jirah-pattern-library.md) — existing pattern library (this skill updates it)
- [reports/pattern-library-codification-2026-04-18.md](../../../reports/pattern-library-codification-2026-04-18.md) — prior (partial) run from Sprint 1e

## Inputs (ask if not supplied)

- **Archive scope** — one of:
  - `onedrive` (default) — scan OneDrive active / inactive / sales-targets folders
  - `--source-dirs [paths...]` — explicit list of directories to scan (for email-export batches, Google Drive mirrors, Dropbox exports, etc.)
  - `--include-audit-sessions` — also include audit-session outputs as mini-engagements (Friction Audits that did or didn't expand)
- **Filter** — optional:
  - `--since YYYY-MM-DD` — only proposals from this date forward
  - `--industry [name]` — single-vertical analysis
- **Mode** — `--full` (default — run all aggregations + update context) | `--read-only` (produce report only; don't write updates to context files)

---

## Process

### 1. Discover the archive

Scan:
- `01 - Clients\Active\*\` (won — current)
- `01 - Clients\Inactive\*\` (completed / wound-down)
- `01 - Clients\_archive\*\` if exists (legacy)
- `02 - Sales & Pipeline\Prospects\*\` — current + historical pipeline
- `02 - Sales & Pipeline\_lost\*\` if exists — explicit closed-lost archive
- `02 - Sales & Pipeline\Audit Applications\*\` (if `--include-audit-sessions`)

For each engagement / prospect / applicant, identify the proposal file (or files — some may have master + amendments; treat as one row for the most-recent version).

Generate proposal-file list. Dedupe.

### 2. Split into balanced batches

For N proposals, split into 5 batches of size ≈ N/5 (balanced on count; include a mix of won/lost in each batch if possible — helps each subagent produce meaningful batch-level patterns).

If N < 10: don't fan out; run sequentially. If N > 200: expand to 10 batches.

### 3. Fan out jirah-proposal-miner subagents in parallel

Spawn 5 [`jirah-proposal-miner`](../../agents/jirah-proposal-miner.md) subagents **in a single message with parallel tool calls**.

Each subagent receives:
- Batch paths (list of proposal files)
- Batch label (e.g., "2024-H2", "Engineering-vertical", or just "Batch 1")

Each subagent returns a per-proposal tagged summary table + batch-level patterns observed + flags for the aggregator.

### 4. Aggregate into the canonical retrospective

Collect all subagent returns. Normalize:
- Outcome buckets: won / lost / ghosted / unknown
- Industry taxonomy: engineering / building systems / prof services / accounting / other
- Staff bands: <25 / 25–75 / 75–150 / 150+
- Revenue bands: <$3M / $3–6M / $6–10M / $10–20M / $20M+
- Offer types: Friction Audit / Discovery / Discussion Document / full engagement / AI pilot / advisory retainer / other
- Price bands: <$5k / $5–15k / $15–50k / $50–100k / $100k+

Compute aggregations:

#### Win rate by dimension

| Dimension | Won | Lost | Ghosted | Total | Win rate |
|---|---|---|---|---|---|
| By industry | ... | ... | ... | ... | ... |
| By offer type | ... |
| By price band | ... |
| By staff band | ... |
| By revenue band | ... |

Identify the **highest-win-rate segment** and the **lowest-win-rate segment**. Explain what's different about each.

#### Loss reason clustering

For all `outcome: lost` proposals with a loss reason captured:
- Cluster into 5–8 categories (price / timing / scope / fit / competitor / no-decision / other)
- Rank by frequency
- Name the top 3 loss reasons with example proposals

#### Price-point patterns

For each offer type, identify:
- Price at which win rate is highest
- Price at which win rate drops
- Price bands with no data (proposals not yet offered at that price — opportunity or gap?)

Example output:
- "Sprint+Report offer wins at $50–100k. 3 proposals at $100–150k all ghosted. 2 at <$30k all won (but undercut the positioning — flag)."

#### Revivable lost-deal list

For each closed-lost proposal, score revival potential:
- Recency — closed within last 18 months (not too stale)
- Fit — still matches current ICP
- Loss reason — was it timing? price? competitor? (timing = most revivable; fit-mismatch = not revivable)
- Relationship — did we maintain any warm connection post-loss?

Rank top 10 revival candidates. For each: the loss reason, the specific sharpening of our pitch that addresses it, and a recommended re-approach cadence.

#### ICP refinements

Compare data-derived ICP to current `context/jirah-icp-wedge.md`:
- Does the data agree that 30–150 staff / $6–20M rev is where we win?
- Is there a sub-band inside that (e.g., 50–100 staff, $8–12M rev) where we win dramatically more?
- Any vertical the data says we should sharpen into or exit?
- Any pattern about owner role (founder-owner vs. managing-partner vs. 2nd-gen owner) that predicts wins?

Produce a diff:

```markdown
## ICP diff (data vs context/jirah-icp-wedge.md current)

### Confirmed by data
- [item] — current ICP says X, data shows X% win rate — keep as is

### Recommended sharpening
- [item] — current ICP says 30–150 staff; data shows 60–120 staff is the sweet spot (win rate [A]% vs [B]% for full range) — consider tightening

### Recommended expansion
- [item] — data shows [surprise vertical / size] wins — worth testing

### Recommended retirement
- [item] — current ICP includes [X] but data shows [X%] win rate — consider dropping
```

#### Pipeline-forecast calibration

Extract real conversion rates from the data:
- What % of `stage: proposal-sent` closed-won?
- What % of `stage: meeting-booked` advanced to proposal-sent?
- What % of warm prospects ever booked a meeting?

Produce a calibration block to write to `context/jirah-pipeline.md`:

```yaml
# context/jirah-pipeline.md - calibration block
calibration:
  last_updated: YYYY-MM-DD
  source: win-loss-YYYY-MM-DD
  rates:
    cold: [actual rate]
    warm: [actual rate]
    meeting_booked: [actual rate]
    proposal_sent: [actual rate]
```

### 5. Write the canonical retrospective

```
reports/win-loss-YYYY-MM-DD.md
```

Structure:
```markdown
---
date: YYYY-MM-DD
archive_scope: [onedrive / explicit list]
proposals_analyzed: N
batches: 5 (or N)
mode: full | read-only
---

# Win/Loss Retrospective — YYYY-MM-DD

## Summary (5 sentences)
[Overall: N proposals, [won/lost/ghosted counts], top win pattern, top loss pattern, top action]

## Headline findings

1. [Data-grounded finding]
2. ...

## Win rate by dimension
[Tables from step 4]

## Top 5 loss reason clusters
[Ranked with frequency + example]

## Price-point patterns
[Per offer-type analysis]

## Top 10 revivable lost-deal candidates
[Ranked list with loss reason + re-approach recommendation]

## ICP diff (data vs current context)
[Recommended sharpening / expansion / retirement]

## Pipeline-forecast calibration
[Real conversion rates vs defaults — diff visible]

## Pattern-library updates
[New cross-engagement patterns surfaced — feed context/jirah-pattern-library.md]

## Flags from subagents
[Aggregated from batch returns — data gaps, ambiguous outcomes, unusual cases worth partner review]

## What to do with this
1. Update context/jirah-icp-wedge.md with recommended sharpening (confirm with Jason first)
2. Update context/jirah-pipeline.md with calibration block
3. Re-run /jirah-pipeline-forecast with new rates
4. Queue /jirah-email --scenario warm-nurture on top 10 revival candidates
5. Feed top-3 loss-reason patterns into /jirah-thought-leadership source material
6. Schedule next re-run [quarterly — YYYY-MM-DD]
```

### 6. Update context files (if `--full` mode)

- **`context/jirah-icp-wedge.md`:** append a "Data-derived refinements (YYYY-MM-DD)" section with the diff; do NOT overwrite existing ICP prose — partners decide whether to adopt refinements
- **`context/jirah-pipeline.md`:** add/update the calibration block
- **`context/jirah-pattern-library.md`:** append any new cross-engagement patterns surfaced

All updates are **diff-flagged** — clearly shown so Jason can review before committing.

If `--read-only`: skip updates; produce only the report + prompt Jason to apply manually.

### 7. Trigger downstream

- Pipeline forecast recalibration: run `/jirah-pipeline-forecast --calibration from-winloss` after updates applied
- Content source: feed top loss patterns to `/jirah-thought-leadership` as new source material
- Revival push: queue `/jirah-email --scenario warm-nurture` for top-10 revival candidates

### 8. Output to chat

```
Win/Loss Retrospective — YYYY-MM-DD

Archive: [N proposals analyzed across 5 batches in parallel]
Outcomes: [won/lost/ghosted breakdown]

Top 3 headline findings
1. [finding]
2. ...

ICP diff
- Recommended sharpening: [count]
- Recommended expansion: [count]
- Recommended retirement: [count]

Pipeline forecast calibration
- Rate change on [stage]: [old → new]
- ...

Revivable lost-deals: top 10 identified

Output: [path]

Next steps
- Partner review of ICP diff (before applying to context/jirah-icp-wedge.md)
- Apply pipeline calibration to context/jirah-pipeline.md
- Re-run /jirah-pipeline-forecast
- Queue warm-nurture emails to top 10 revival candidates
- Schedule next re-run [quarterly — YYYY-MM-DD]
```

---

## Voice rules (for the report)

- Numbers throughout. Every finding cites a count / percentage / dollar figure.
- No hedging. If the data shows [X], say [X]; name the sample size + confidence ("N=23, 95% CI roughly ±10pp at this sample size").
- Flag sample-size issues explicitly — small-N findings marked "directional, not conclusive."
- Every recommendation has an action verb + owner + deadline (Jason / Joshua, date).
- Partner voice — internal document, terse, signal-dense.

## Edge cases

- **Archive is < 10 proposals** — skill runs sequentially, not fanned out; flag low-N explicitly; all findings directional only; no calibration update until more data
- **Archive is > 200 proposals** — expand to 10 batches; may need to run in 2 passes if subagent concurrency is an issue
- **Proposal files in obsolete formats** (old .ppt, .pages, .doc) — subagent flags unreadable; proceed with what's extractable; count unreadables in Flags
- **Outcome unclear for many proposals** — if >20% are `outcome: unknown`, flag as a filing-hygiene issue; findings still valid but less sharp
- **All data is from one engagement shape** (e.g., only Sprint+Report — no Active Advisory history) — scope findings to that shape; flag the gap; recommend explicitly recruiting the untested shape
- **Conflicting data across sources** (same client appears in Active + Closed-lost folders) — flag for manual reconciliation before aggregation
- **Old win that's since become a closed-lost** (churned retainer) — include in the analysis; note the churn in the outcome; feeds retention-pattern analysis
- **Archive reveals a pattern the library doesn't name** — new cross-engagement pattern; append to library with evidence from this run
- **Pricing inflation over time** (3-year-old $50k proposal ≠ today's $50k proposal in real terms) — normalize to today's dollars if running multi-year analysis; flag the normalization assumption

## Related

- Subagent: [`jirah-proposal-miner`](../../agents/jirah-proposal-miner.md) (5-way parallel fan-out; Sprint 1b working)
- Downstream: [`jirah-pipeline-forecast`](../jirah-pipeline-forecast/SKILL.md) (calibration consumer), [`jirah-thought-leadership`](../jirah-thought-leadership/SKILL.md) (content source), [`jirah-email`](../jirah-email/SKILL.md) (`--scenario warm-nurture` for revival candidates), [`jirah-industry-pulse`](../jirah-industry-pulse/SKILL.md) (may reshape targeting)
- Updates: `context/jirah-icp-wedge.md`, `context/jirah-pipeline.md`, `context/jirah-pattern-library.md`
- Prior run (partial): [`reports/pattern-library-codification-2026-04-18.md`](../../../reports/pattern-library-codification-2026-04-18.md) — Sprint 1e pattern codification across 4 engagements
- Cadence: one-shot; re-run quarterly or when archive grows materially
