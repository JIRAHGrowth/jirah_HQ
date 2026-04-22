---
name: jirah-pipeline-forecast
description: Turn the Kanban into a probabilistic forecast. Reads all pipeline markdown files, applies stage-conversion rates to weighted value, outputs expected close this quarter with an uncertainty band + top 3 deals most-likely-to-close + top 3 deals at risk. Feeds /jirah-weekly-review Section 1. Calibration improves over time once win/loss data surfaces. Use weekly before the Monday partner sync, before a partner decision that hinges on pipeline state, or when Jason says "what's the pipeline looking like," "forecast for this quarter," "pipeline forecast."
---

# /jirah-pipeline-forecast

## Purpose

Turn the Kanban pipeline into a **forecast Jason and Joshua can trust** — calibrated stage-probabilities applied to weighted values, with a specific expected-close number and uncertainty band.

Owner-led B2B consulting runs on gut feel most of the time. This skill replaces "I think Q2 is going to be solid" with "$X expected to close by Jun 30, ±$Y at one sigma." Feeds the weekly partner review and quarter-end planning.

## Pre-requisites (read before running)

- [context/jirah-pipeline.md](../../../context/jirah-pipeline.md) — pipeline stages, current clients + prospects snapshot
- [context/jirah-icp-wedge.md](../../../context/jirah-icp-wedge.md) — engagement shapes + price anchors (Sprint+Report $50–100k / Active Advisory $10–25k+/mo / Parallel Strategic+AI $121.5k + pilot)
- [context/jirah-pattern-library.md](../../../context/jirah-pattern-library.md) — price-point anchors by engagement shape

## Inputs (ask if not supplied)

- **Horizon** — `--quarter` (default — expected close by quarter-end) | `--30d` / `--60d` / `--90d` | `--ytd` (year to date)
- **Calibration** — `--default` (stage-conversion rates built-in) | `--from-winloss` (once `/jirah-win-loss` produces real calibration data) | `--override [stage]=[%]` (manual tuning)
- **Scope** — `--all` (default) | `--owner JL` / `--owner JM` | `--vertical engineering`
- **Mode** — `--full` (default — write output file) | `--quick` (chat-only summary)

---

## Process

### 1. Read pipeline state

Glob + read all pipeline `.md` files:
- `prospects/*.md` (skip `_template.md`)
- `audit-applications/*.md` (where `status: accepted` — these become pipeline)

Extract per prospect:
- `stage` — cold / warm / meeting-booked / proposal-sent / closed-won / closed-lost
- `value` — estimated engagement value (if unset, default from engagement-shape frontmatter or use shape-band midpoint)
- `nextAction` — ISO date (used for timing bucket)
- `owner` — JL / JM (for `--owner` filter)
- `industry` — for `--vertical` filter

### 2. Apply conversion rates

**Default conversion rates** (replaceable via `--override`):

| Stage | Default probability |
|---|---|
| Cold | 5% |
| Warm | 15% |
| Meeting booked | 30% |
| Proposal sent | 55% |
| Closed won | 100% |
| Closed lost | 0% |

These are **starting defaults — not calibrated**. Once `/jirah-win-loss` runs and produces real win-rate data, override this table with calibrated values. Until then, flag output as "default conversion rates — not yet calibrated."

### 3. Compute weighted pipeline

Per stage:
- Sum value × probability across all prospects in that stage
- Aggregate: total weighted pipeline = sum across stages

### 4. Compute expected close in horizon

- Horizon = `--quarter` default: end of current quarter
- For each prospect with `nextAction <= horizon-end`:
  - Include its `value × probability` in expected close
- Expected close = sum
- Uncertainty band = ±(standard deviation estimate):
  - At low N: use crude rule-of-thumb — σ ≈ sqrt(Σ(value × probability × (1 − probability)))
  - Flag that σ is crude when N<15

### 5. Identify top 3 most-likely + top 3 at risk

**Most-likely (top 3):** sort by `value × probability`, descending. Take top 3. Include:
- Name, stage, value, probability, next action date, owner

**At risk (top 3):** flag prospects where:
- `stage: proposal-sent` AND `nextAction` is in the past (proposal sitting)
- `stage: meeting-booked` AND `lastContactDays > 14` (meeting went quiet)
- `stage: warm` AND no `nextAction` set

Take top 3 by at-risk-magnitude (combination of value and staleness).

### 6. Draft the forecast memo

```markdown
---
horizon: [quarter-end YYYY-MM-DD / --30d / --60d / --90d]
generated: ISO timestamp
calibration: default | calibrated-from-winloss
scope: all | owner:X | vertical:Y
---

# Pipeline Forecast — [Horizon label]

> Generated: [timestamp]
> Scope: [all / owner / vertical]
> Calibration: [default — not yet validated by win-loss data / calibrated from win-loss YYYY-MM-DD]

## Weighted pipeline by stage

| Stage | Prospects | Raw value | × Probability | Weighted |
|---|---|---|---|---|
| Cold | N | $X | 5% | $Y |
| Warm | ... |
| Meeting booked | ... |
| Proposal sent | ... |
| Subtotal (open) | | $X | | **$Y** |
| Closed won (YTD) | | $X | | $X |

## Expected close by [horizon]

**$X, ±$Y at one sigma**

Range: $[X-Y] to $[X+Y] with ~68% confidence.

## Top 3 most-likely-to-close

1. **[Name]** ([stage], [owner]) — value $X × prob [%] = $Y — next action: [date]
2. ...
3. ...

## Top 3 at risk

1. **[Name]** ([stage], [owner]) — value $X — risk signal: [specific — proposal sitting N days / meeting went quiet / no next action]
2. ...
3. ...

## Interpretation (1 paragraph)

[Plain-English partner voice — is the pipeline healthy? What's the shape? Are we proposal-heavy or prospect-heavy? Is the expected-close number consistent with target revenue for the horizon? Name one specific thing to do this week based on the forecast.]

## Flags

- [Default conversion rates in use — flag to run /jirah-win-loss for calibration once proposal archive surfaces]
- [Low N concern — σ is crude when fewer than 15 deals in pipeline]
- [Stale prospects — count with no nextAction set]
- [Missing value field — count of prospects without a value estimate; using shape-band midpoint fallback]
```

### 7. Output

```
reviews/forecasts/
└── forecast-YYYY-MM-DD-[horizon].md
```

OneDrive equivalent: `06 - Ops Command Center\forecasts\`

### 8. Feed weekly review

If `/jirah-weekly-review` will run later this week, write forecast summary to a predictable location the weekly review can ingest:
- `reviews/latest-forecast.md` (overwrite each run — always current)

### 9. Output to chat

```
Pipeline Forecast — [horizon]

Weighted pipeline (open): $X
Expected close by [horizon-date]: $Y ±$Z

Top 3 most-likely
1. [name] — $X × [prob%] — [owner]
2. ...
3. ...

Top 3 at risk
1. [name] — [risk signal]
2. ...

Interpretation: "[1-sentence summary of pipeline health]"

Flags: [calibration, low-N, missing values]

File: [path]
```

---

## Calibration over time

The most important field this skill produces is the **calibration source**:
- `default` until `/jirah-win-loss` runs
- `calibrated-from-winloss YYYY-MM-DD` after win-loss pass provides real rates

When `/jirah-win-loss` produces real conversion rates per stage (i.e., "of all proposals sent, X% closed won"), those rates should replace the defaults. Document the calibration event in `context/jirah-pipeline.md`:

```yaml
# context/jirah-pipeline.md - calibration block
calibration:
  last_updated: YYYY-MM-DD
  source: win-loss-YYYY-MM-DD
  rates:
    cold: 0.05
    warm: 0.15
    meeting_booked: 0.30
    proposal_sent: 0.55
```

This skill reads that block on each run; falls back to defaults if absent.

## Edge cases

- **Pipeline is nearly empty** (<5 open prospects) — forecast is close to useless. Flag low-N; still produce the report; expected-close number is point-estimate only (σ not meaningful)
- **Prospect has no `value` set** — use engagement-shape midpoint from pattern library:
  - Sprint+Report: $75k midpoint
  - Active Advisory: $17,500/mo × 12 = $210k annualized (use 6-month expected value = $105k for forecast)
  - Light Coaching: $12k annualized
  - Parallel Strategic+AI: $150k
- **Prospect stage is missing or nonstandard** — skip from forecast; flag count in Flags
- **Prospect has `nextAction` in the distant future** (>6 months out) — include in weighted pipeline but exclude from `--quarter` expected-close
- **Multi-year retainer prospects** (Active Advisory) — compute annualized value but use 6-month bounded value for horizon forecast
- **Closed-lost deals still in file** — include in YTD closed-lost aggregate; exclude from open pipeline
- **Prospect has been in same stage >45 days** — flag as "stalled-in-stage"; probability should haircut by 50% (e.g., warm stalled 60 days = 7.5% not 15%). Apply automatically; note in Flags.
- **Calibration data is stale** (>6 months since last win-loss) — flag; recommend re-running `/jirah-win-loss` if enough new proposals have flowed through

## Related

- Upstream: [`jirah-industry-pulse`](../jirah-industry-pulse/SKILL.md), [`jirah-lead-gen`](../jirah-lead-gen/SKILL.md) (feed prospects into pipeline)
- Calibration source: [`jirah-win-loss`](../jirah-win-loss/SKILL.md) (converts defaults → real rates)
- Downstream: [`jirah-weekly-review`](../jirah-weekly-review/SKILL.md) (consumes forecast in Section 1)
- Context: jirah-pipeline.md, jirah-icp-wedge.md, jirah-pattern-library.md
- Cadence: weekly before Monday partner sync (Sprint 4 scheduled trigger fires Sunday 22:00 so Monday review has fresh data)
