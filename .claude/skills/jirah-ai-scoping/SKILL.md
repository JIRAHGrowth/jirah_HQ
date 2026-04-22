---
name: jirah-ai-scoping
description: Take an AI opportunity surfaced by /jirah-ai-opportunity-scan (or named directly by a client) and produce the internal technical pilot-scoping document. Maps data sources + access, defines Plan A (preferred) / Plan B (fallback) model approach, names the Day-2 decision trigger, specifies the 0-hallucination evaluation harness, and lays out weekly deliverables. This is the INTERNAL scoping doc — /jirah-pilot-plan renders the client-facing Mode B deliverable from it. Use when a client has selected one AI path from the audit's three expansion paths, or when an existing client wants to scope an AI pilot independently.
---

# /jirah-ai-scoping

## Purpose

Take an AI opportunity and produce the technical scoping document that precedes the client-facing pilot plan. This is the **engineering and evaluation blueprint** — where we stress-test feasibility, data access, and risk before putting Jirah's name on a delivery commitment.

**Workflow:**
```
/jirah-ai-opportunity-scan → opportunity memo
  ↓
/jirah-ai-scoping → internal technical scope (this skill)
  ↓
/jirah-pilot-plan → client-facing Mode B deliverable (the close)
  ↓
/jirah-ai-pilot-status → weekly during execution
```

## Pre-requisites (read before scoping)

- [context/jirah-voice.md](../../../context/jirah-voice.md) — Plan A/B decision forks, 0-hallucination standards, weekly demo cadence, voice rules
- [context/jirah-icp-wedge.md](../../../context/jirah-icp-wedge.md) — AI-build positioning + 3 monetization paths
- [context/jirah-pattern-library.md](../../../context/jirah-pattern-library.md) — **Smith + Andersen Shop-Drawing Pilot** as the reference shape/pricing anchor
- [context/jirah-methodology.md](../../../context/jirah-methodology.md) — "AI supports, it does not decide" — human review required on every output
- Upstream: `/jirah-ai-opportunity-scan` output (or client-supplied opportunity brief)
- Client profile + workflow context

## Inputs (ask if not supplied)

- **Opportunity source** — one of:
  - `--from-opportunity audit-sessions/[client]/02-findings.md` (from Friction Audit)
  - `--from-memo clients/[slug]/ai-opportunity-memo-YYYY-MM-DD.md` (from ad-hoc scan)
  - `--opportunity "[free text description]"` (least preferred; forces Claude to re-score with the 5 signals from opportunity-scan before proceeding)
- **Client** — slug / path to engagement folder
- **Duration** — `--duration 4w` (default — S+A anchor) | `--duration 6w` | custom
- **Model-family bias** — `--model-default claude` (default) | `--model-allow-openai` if client has an OpenAI contract | `--model-constrained` if client has specific security / hosting requirements

---

## Process

### 1. Ingest the opportunity

Read the opportunity source. Extract:
- Current-state workflow description (hours, frequency, who touches it)
- Proposed pilot shape (from the opportunity scan's 4-week template)
- Expected leverage (hours saved, cycle-time reduction, specialist-hours freed)
- Friction-point mapping

### 2. Data sources + access plan

The single highest-risk item in any AI pilot: whether we actually have the data we need.

```markdown
## Data sources + access

### Required inputs
| Source | Format | Volume | Owner | Access plan | Risk |
|---|---|---|---|---|---|
| [doc type / system] | [PDF, CSV, API, etc.] | [N units per period] | [client role] | [how we get it — shared drive / API key / export / DB read-only] | [low / medium / high + reason] |
| ... |

### Required outputs (what the AI produces)
| Output | Format | Destination | Human review cadence |
|---|---|---|---|
| ... |

### Access milestones (blocks Plan A if unmet)
- By week 1 day 2: client provides sample of N units of input data for scaffold testing
- By week 1 day 5: production data pipeline tested end-to-end
- By week 2 day 1: access to full-volume dataset confirmed
- If any milestone slips >2 days: trigger Plan B conversation (see below)
```

Risk-rate each access item. High-risk items (API we don't yet have, regulated data that needs legal review) get triaged into Plan B design.

### 3. Model approach — Plan A (preferred) + Plan B (fallback)

Per voice rules — Plan A/B with an explicit decision trigger, not hedging.

```markdown
## Model approach

### Plan A (preferred)
**Goal:** [end-state automation target — e.g., "end-to-end review with 0 hallucinated findings, senior-engineer review before external delivery"]

**Model:** [e.g., Claude Opus 4.x with prompt caching; Claude Sonnet 4.x if volume demands]
**Reason for model pick:** [thinking capacity, cost per unit, document-handling capability, regulatory constraint]

**Architecture:**
- Input pipeline: [how data flows in]
- Prompt strategy: [system prompt design, caching plan, any tool use]
- Validation layer: [citation enforcement, source doc attachment, rule-book cross-check]
- Output format: [structured markdown / JSON / direct into client's PM tool]

**Why this wins when it wins:** [leverage calculation — hours saved vs human baseline]

### Plan B (fallback — copilot version)
**Goal:** [AI-generated first-pass that senior reviewer approves — always a human in the loop]

**When we drop to Plan B:** [specific observable trigger, see next section]

**Architecture changes from Plan A:**
- [what simplifies — fewer automation steps, human review on every unit]
- [what stays — citation discipline, 0-hallucination standard]

**Why this still ships:** [value story at Plan B — typically still 2–3x productivity, just not 10x]
```

### 4. Day-2 decision trigger

This is the explicit observable that tells us whether Plan A holds or we pivot.

```markdown
## Day-2 decision trigger

**Question:** Is Plan A's edge-case failure rate acceptable?

**Observable signal:** On a sample of 50 real inputs, Plan A's output:
- Hallucination rate (claims without source doc citation): <2% = Plan A continues; 2–10% = tune prompts + retest day 3; >10% = switch to Plan B immediately
- Accuracy vs gold-standard human reviewer: >90% agreement = Plan A; 75–90% = copilot-with-review (hybrid); <75% = Plan B
- Cycle time per unit: if Plan A is slower than baseline human = re-examine pipeline; if faster AND accuracy holds = Plan A locked

**Decision owner:** [Jirah — typically Jason for commercial / Joshua for methodology; or named engineer]
**Decision deadline:** end of week 1 day 2 (fail-fast principle — we don't absorb Plan A risk past 48 hours without validation)
```

### 5. Evaluation harness (0-hallucination enforcement)

```markdown
## Evaluation harness

### Every output must
1. **Cite source** — every factual claim maps back to a specific input doc, page/section, and quote snippet
2. **Be human-reviewed before external use** (Plan A + Plan B both — per jirah-methodology.md "AI supports, it does not decide")
3. **Pass the gold-standard spot-check** — 10% of outputs per week sampled against a human senior reviewer; disagreement logged as training signal

### Harness mechanics
- Test set: [N units of historical data with known correct answers, set aside for evaluation]
- Metrics tracked weekly:
  - Hallucination rate (citation-less claims)
  - Accuracy vs gold-standard
  - Cycle time per unit
  - Human review burden (minutes per output)
- Regression test: run evaluation suite at end of every week before weekly demo

### What we log
- Every output + its input + its human review decision (approved / rejected / edited)
- This log IS the product eventually — it's what the client uses to audit AI decisions
```

### 6. Weekly deliverables

Per voice rules: every week ends with something demo-able. No "nothing to show until week 4."

```markdown
## Weekly deliverables

### Week 1
- **Day 1–2:** scaffold deployed; demo at end of day 2 with 3 sample inputs
- **Day 3–5:** full-volume data pipeline working; Plan A vs Plan B decision trigger fires at end of day 2 (or day 5 if adjusted)
- **Week 1 demo:** Friday — show Plan A output on real data for 5 units. Client reviews.

### Week 2
- **Day 1–3:** edge-case coverage — run on 20 units that the week-1 demo didn't cover
- **Day 4–5:** harness fully wired; first full weekly evaluation run
- **Week 2 demo:** Friday — side-by-side: Plan A output vs human baseline on 20 units, with hallucination rate + accuracy metric

### Week 3
- **Day 1–3:** integration with client's existing workflow (PM tool, dashboard, email template, etc.)
- **Day 4–5:** training run with client's team on how they'll use the tool
- **Week 3 demo:** Friday — end-to-end walk through production workflow with client's team at the wheel

### Week 4
- **Day 1–3:** production handoff; documentation written; runbook for what happens when AI output is wrong
- **Day 4–5:** final evaluation suite run; pilot report drafted
- **Week 4 close:** pilot report + recommendation: continue on a retainer / monthly billing, or wrap with learnings only

If `--duration` is longer than 4 weeks, stretch week 2–3 and add additional edge-case / scale-up work. The week 1 Day-2 decision trigger does NOT move.
```

### 7. Risks + mitigations

Paired, specific, no boilerplate:

```markdown
## Risks + mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Data access slips past week 1 day 5 | [low/med/high] | blocks Plan A | Escalate to owner day 3; drop to Plan B if day 5 passes |
| Hallucination rate >10% despite prompt tuning | [l/m/h] | Plan A unsustainable | Plan B path is pre-designed; pivot within 48 hours of signal |
| Client team doesn't adopt post-handoff | [l/m/h] | pilot value doesn't compound | Training session week 3 + runbook week 4; follow-up at 30 days |
| Model cost-per-unit exceeds estimate | [l/m/h] | margin compression | Prompt-caching + Haiku fallback for high-volume paths |
| Edge case surfaces in production that wasn't in test set | [l/m/h] | one-off bad output | Human review layer catches; log → tune next iteration |
| Regulatory / privacy constraint surfaces late | [l/m/h] | scope stop-work | Legal review at kickoff; data sample anonymized for initial scaffold |
```

### 8. Investment + timeline

Pricing per pattern-library anchor:
- **S+A Shop-Drawing pilot** — 4 weeks, 10 hrs/week Jirah engineering time, [pricing anchor]
- Adjustments from the anchor:
  - More data sources + complex pipeline → increase
  - Client has existing engineering team that co-builds → decrease
  - Regulatory-heavy context → increase (legal review + additional validation layers)

```markdown
## Investment + timeline

**Duration:** [4 weeks default or as specified]
**Jirah effort:** [hours/week × weeks]
**Price:** [$band matching pattern-library anchor]
**Post-pilot integration:** [hourly rate or monthly retainer — typically $10–25k+/mo if this moves into ongoing ownership]

**Payment cadence:**
- [25% at kickoff / 50% at week 2 Plan A-or-B confirmed / 25% at handoff] — adjust per engagement shape
```

### 9. Output

```
engagements/[slug]/09-ai-pilot/
├── 00-opportunity-memo.md          (input — from /jirah-ai-opportunity-scan)
├── 01-technical-scope.md           (this skill's output — internal)
├── 02-pilot-plan.html              (will be produced by /jirah-pilot-plan — client-facing Mode B)
└── weekly/
    └── (populated by /jirah-ai-pilot-status each Friday)
```

OneDrive equivalent: `01 - Clients\Active\[ClientName]\09 - AI Pilot\`

Output to chat:

```
AI Pilot Scope — [Client] — [opportunity name]

Plan A: [1-line summary]
Plan B: [1-line summary]
Day-2 trigger: [observable signal]

Data access plan: [N sources, [high-risk items count]]
Evaluation harness: [hallucination rate target, accuracy target]
Weekly deliverables: [week 1 demo date / week 4 close date]
Investment: [$amount, payment cadence]

Flags
- [high-risk access items]
- [model-choice constraints]
- [regulatory considerations]

Next step
- Internal review with Jason + Joshua
- Then /jirah-pilot-plan to produce the client-facing Mode B deliverable
```

---

## Voice rules (non-negotiable)

- Plan A AND Plan B both exist, with a decision trigger. No hedging.
- Every week has a demo. State what will be demo-able and when.
- 0-hallucination standard stated explicitly, enforced by the harness.
- "AI supports, it does not decide" — human review layer named for every AI output path.
- Numbers > adjectives — hours, units, accuracy %, cycle time in minutes.
- Pattern-library reference present (S+A Shop-Drawing anchor if applicable).

## Edge cases

- **Client wants to skip Plan B design** ("we're confident in Plan A") — decline. Pattern discipline: every pilot has a fallback designed before kickoff. Reference S+A methodology.
- **Client supplies their own data access pipeline** — audit it; add to Risks if the pipeline has gaps; shift scope if pipeline-build was in original opportunity scope.
- **Opportunity requires custom model training** — flag as out-of-scope for Jirah pilot shape (we do pilot-shaped integration, not ML research). Refer out or reshape opportunity to prompt-based workflow.
- **Client is highly regulated** (healthcare, accounting, legal) — default to Plan B as primary path; escalate human-review layer; add regulatory review as week 0 prerequisite.
- **Data sample for scaffold is unavailable** (client can't share even anonymized data) — cannot proceed. Flag, propose a 1-week pre-pilot data-access discovery before full pilot kicks off.
- **Model-family constraint** (client has OpenAI-only contract, or on-prem hosting requirement) — adjust Plan A architecture; note in Risks; ensure pricing reflects any added work.

## Related

- Upstream: [`jirah-ai-opportunity-scan`](../jirah-ai-opportunity-scan/SKILL.md)
- Downstream: [`jirah-pilot-plan`](../jirah-pilot-plan/SKILL.md) (client-facing Mode B from this scope), [`jirah-ai-pilot-status`](../jirah-ai-pilot-status/SKILL.md) (weekly during execution)
- Context: jirah-voice.md, jirah-icp-wedge.md, jirah-pattern-library.md, jirah-methodology.md
- External tooling: `/claude-api` skill for any hands-on implementation work during the pilot itself
