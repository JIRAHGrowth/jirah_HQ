---
name: jirah-ai-opportunity-scan
description: Scan a client's workflow for AI leverage opportunities and produce 2-3 pilot-shaped recommendations. Embedded in every Friction Audit synthesis; also invokable ad hoc for existing clients evaluating AI fit. Output is a structured AI-opportunity memo that feeds /jirah-ai-scoping and /jirah-pilot-plan. Anchored to Smith + Andersen Shop-Drawing pilot as the benchmark pricing reference.
---

# /jirah-ai-opportunity-scan

## Purpose

Every Friction Audit must end with "and here's where AI would unlock this." This skill is the systematic scan that produces those recommendations — not hand-wavy AI talk, but concrete 4-week pilot shapes with real leverage points, known pricing anchors, and Plan A/B decision forks per `context/jirah-voice.md`.

AI-build is Jirah's flagship differentiator (the 3rd of 3 monetization paths in `jirah-icp-wedge.md`). This skill is how we consistently surface it.

## Pre-requisites (read before scanning)

- [context/jirah-icp-wedge.md](../../../context/jirah-icp-wedge.md) — three monetization paths, AI-build positioning
- [context/jirah-pattern-library.md](../../../context/jirah-pattern-library.md) — Smith + Andersen Shop-Drawing pilot (the price/shape anchor)
- [context/jirah-voice.md](../../../context/jirah-voice.md) — Plan A/B decision forks, 0-hallucination standards, weekly demo cadence
- [context/jirah-friction-points.md](../../../context/jirah-friction-points.md) — FP #8 Innovation & Change, where this scan lives
- Audit findings file (`audit-sessions/[client-slug]/01-capture.md`) OR the active-client engagement profile — whatever state the current workflow-map sits in

## Inputs (ask if not supplied)

- **Client** — name + industry + staff count + revenue (usually resolved from an audit session or active-client profile)
- **Workflow surface** — which domains to scan? Default: full workflow. Narrow with `--focus review` | `--focus intake` | `--focus ops` | `--focus delivery`
- **Context source** — `--from-audit audit-sessions/falcon/01-capture.md` (default during audit synthesis) | `--from-client-profile 01 - Clients/Active/Falcon/00 - Profile.md`

---

## Process

### 1. Ingest workflow context

Read the source. Extract:
- What processes consume the most human hours? (repetitive tasks, document-heavy review, cross-referencing)
- Where is specialist knowledge held by 1–2 people? (bottleneck risk)
- What gets escalated to an owner/partner repeatedly? (FP #10 intersection)
- Which tasks generate high-volume structured outputs? (high-fidelity AI targets)
- Where does the firm currently sit on the AI-adoption curve? (FP #8 probe)

### 2. Score candidate opportunities against AI-leverage signals

For each candidate process, score 0–3 per signal (total 0–15):

| Signal | What it means | Why it matters |
|---|---|---|
| **Volume × frequency** | Task runs 10+ times per week | Leverage requires volume. One-off reviews aren't AI targets. |
| **Repetitive pattern** | Same structure, different inputs each time | Pattern-matching is AI's native strength |
| **Document-heavy** | Input is PDFs, drawings, transcripts, docs | Modern AI shines on unstructured doc input |
| **Cross-reference work** | Comparing one doc against another, or against a rulebook | Where human reviewers lose time today |
| **Specialist-trapped** | 1–2 senior people must review each instance | High-value time currently locked up |

**Any process scoring 10+ is a primary candidate. 7–9 is a secondary candidate. <7 is not worth piloting.**

### 3. Shape the top 2–3 opportunities into pilots

For each primary candidate, produce a structured pilot shape:

```markdown
### Opportunity: [one-line name]

**Current state:** [what the human workflow looks like today, with numbers — "12 submittals / week, 4 hours each, reviewed by 2 senior engineers"]

**Proposed pilot shape:**
- Duration: 4 weeks
- Scope: [what the AI tool does — verbatim task boundary]
- Integration: [where it sits — internal web app / Claude Code workflow / custom internal tool]
- Weekly demos: week 1 scaffold, week 2 real-data demo, week 3 edge-case coverage, week 4 production handoff + training

**Plan A / Plan B decision fork:**
- Plan A (preferred): [the full automation goal — e.g., "end-to-end review with 0 hallucinated findings"]
- Plan B (fallback): [the copilot version — e.g., "AI-generated first-pass that senior reviewer approves"]
- Day 2 decision trigger: [observable signal — e.g., "if edge-case failure rate is >15% on a 50-submittal sample, shift to Plan B"]

**0-hallucination standards:** every AI output must cite source doc + page + section. Human review required before external-facing use for Plan A; always required for Plan B.

**Estimated leverage:** [hours saved per week, or cycle-time reduction, or senior-person-hours freed]

**Pricing anchor:**
- 4-week pilot: $X (reference S+A Shop-Drawing pilot = [actual S+A number from pattern library] for a 4-week engagement with 10 hrs/week)
- Post-pilot integration: hourly or monthly retainer (name the range — typically $10–25k+/mo per `context/jirah-pattern-library.md`)

**Risks + mitigations:**
- [Specific technical risk] → [how we handle it]
- [Adoption risk — will the team actually use it?] → [training / rollout plan]
- [Data access risk — do we have the inputs?] → [fallback workflow]

**Friction-point mapping:** FP #8 (Innovation & Change) primary; often also FP #2 (Revenue) if freeing specialist time creates billing capacity, or FP #10 (Ownership Impact) if the bottleneck is owner-reviewed.
```

### 4. Cross-reference to Jirah pattern library

If a prior engagement has an analogous AI build, name it:
- Smith + Andersen Shop-Drawing Review — the exemplar 4-week pilot
- [add others as the library grows]

Use language like: *"This opportunity is shaped most like the S+A Shop-Drawing pilot — document-heavy review, 4-week timeline, $X pricing anchor."*

### 5. Output

Default path:
- During audit synthesis: append to `audit-sessions/[client-slug]/02-findings.md` as the "Expansion Path: AI" section alongside Ops and Project paths
- Ad hoc: write to `clients/[slug]/ai-opportunity-memo-YYYY-MM-DD.md`

Output format in chat:

```
AI Opportunity Scan — [Client] — YYYY-MM-DD

Workflow surfaces scanned: [list]
Primary candidates (score ≥10): K
Secondary candidates (7–9): M
Below threshold: N

Top opportunities
1. [name] — score [N] — [one-line shape] — pricing [anchor]
2. ...

Recommended next step
- If client is at Friction Audit stage: include top 1–2 in findings doc as AI expansion path
- If client is post-audit in scope-selection: run /jirah-ai-scoping on the chosen opportunity
- If none scored ≥10: explicitly note "no AI pilot recommended at current workflow maturity" and surface FP #8 diagnostic questions for later revisit
```

---

## Anti-patterns (Claude must reject)

- **"We could use AI for [vague task]"** — without scoring against the 5 signals, no opportunity ships
- **Opportunities that require data the client doesn't have** — flag as "not pilot-ready"
- **Pilot shapes without a Plan A/B fork** — violates voice rules
- **Pilot shapes without weekly demos** — violates voice rules ("no nothing-to-show-until-week-4")
- **Pilot shapes without a 0-hallucination standard** — non-negotiable Jirah commitment
- **Over-promising hour savings without evidence** — commit to numbers only when the math is grounded in current-state measurement

## Edge cases

- **Client's workflow is too small / too few repeated processes** — no primary candidates emerge. Output "no AI pilot recommended yet; revisit when [workflow X] hits [volume threshold]."
- **Client is already using AI tools ad hoc** — note current adoption, suggest the pilot shape is about *institutionalizing* an ad-hoc workflow into a repeatable tool.
- **Client is highly regulated** (accounting, legal, healthcare) — emphasize the 0-hallucination + human-review-before-external-use standard up front; push Plan B (copilot) as default.
- **Client requests AI scope outside Jirah's capability** (e.g., custom foundation-model training) — flag and refer out; Jirah's wedge is pilot-shaped integration work, not ML research.
- **AI opportunity surfaces mid-audit but is structurally different from FP #10 finding** — include it, but do not let AI opportunities drown out the real-constraint finding. Ops / project paths come before AI in the expansion-path sequence.

## Related

- Upstream: [`jirah-friction-audit`](../jirah-friction-audit/SKILL.md) (synthesize mode) — this skill is called during that mode
- Downstream: `jirah-ai-scoping` (turns opportunity into proposal), `jirah-pilot-plan` (Mode B client-facing deliverable), `jirah-ai-pilot-status` (weekly during pilot)
- Context: jirah-icp-wedge.md, jirah-pattern-library.md, jirah-voice.md, jirah-friction-points.md
