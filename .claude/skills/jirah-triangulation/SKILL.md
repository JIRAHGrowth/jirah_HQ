---
name: jirah-triangulation
description: Utility skill — take a single owner hypothesis or finding sitting at Medium confidence and produce the validation plan that moves it to High or Very High. Names specific team interviews to run, external checks to make, and data pulls to request. Operationalizes the triangulation discipline (jirah-methodology.md §1). Use mid-audit, mid-sprint, or pre-report when a finding needs more evidence before it can ship, or when Jason says "triangulate this," "what do we need to confirm X," "plan validation for [finding]."
---

# /jirah-triangulation

## Purpose

**Triangulation is the Jirah discipline**: no finding ships without owner + team + external / data cross-check. This skill is the planning tool — given one hypothesis or finding at Medium confidence, it names the specific checks needed to promote it to High or Very High.

Confidence tiers (per jirah-methodology.md):
- **Very High** — owner + 3+ team interviews + external signal / data
- **High** — owner + 2+ team interviews OR owner + strong data signal
- **Medium** — owner hypothesis + partial validation; flagged for further probing

This skill bridges the gap. It doesn't DO the validation — it plans it.

## Pre-requisites (read before running)

- [context/jirah-methodology.md](../../../context/jirah-methodology.md) — triangulation rules + confidence tiers
- [context/jirah-friction-points.md](../../../context/jirah-friction-points.md) — mapping finding to lens + per-lens diagnostic questions
- Engagement profile + current session-analysis outputs (so we know what's already been tested)

## Inputs (ask if not supplied)

- **Hypothesis / finding** (required) — 1 sentence, phrased as a concrete claim: *"Revenue growth is capped by 9-partner governance, not by market demand."*
- **Friction-point mapping** — 1–10 (Claude can infer if not supplied)
- **Current confidence** — Medium (almost always; if already High, consider whether Very High promotion is worth it)
- **Engagement** — slug or path; required to read existing triangulation state
- **Time constraint** — `--fast` (in-audit 1-day window) | `--standard` (sprint-to-report timeline) | `--deep` (extended engagement)

---

## Process

### 1. Ingest the finding state

Read:
- The hypothesis as stated
- Engagement profile (staff, roles, known team structure)
- Any existing session-analysis files — so we don't duplicate interviews already done
- Triangulation log from any prior run on this engagement (so the plan builds on, not repeats, prior work)

### 2. Map the confidence trajectory

Write the path explicitly. This is what makes triangulation visible — per Pattern 6 in the library, the methodology is shown to the client on the page, not done backstage.

```markdown
## Confidence trajectory for this finding

Current: Medium (owner + [what's already validated])

Targets:
- High: + [what it takes]
- Very High: + [what it takes beyond High]
```

Example:

```
Current: Medium — owner framed this; sprint surfaced 1 supporting quote from finance lead
→ High: + 1 more team interview confirming the pattern (operations lead or longest-tenured IC)
→ Very High: + external check (advisor, former employee, or hard data signal from P&L)
```

### 3. Generate the validation plan

Three sections, each tuned to the friction point + engagement context:

#### Team interviews — role-specific probes

For each interview on the plan, name:
- **Role** (not name — the role is what we need; the client picks the person)
- **Why this role for this finding** — structural argument (what they'd see that the owner doesn't)
- **2–3 probes** (verbatim questions) sourced from `context/jirah-friction-points.md` for the mapped lens
- **What validates / refutes** — specific answer patterns that shift confidence

Example (for a FP #5 Structure hypothesis):

```markdown
### Team interview: Operations Lead / Senior PM

**Why this role:** Closest to the day-to-day decision flow. Sees what actually routes through the owner vs. what gets resolved below.

**Probes:**
1. "When a decision needs to be made about [X common scenario], who makes it, and how long does it take?"
2. "What decisions have you stopped surfacing to the owner because they take too long?"
3. "If the owner was out for two weeks, what queue would build up?"

**Validates if:** interviewee names 3+ specific decisions that bottleneck at the owner despite clear delegated authority existing on paper.

**Refutes if:** interviewee describes fluid decision-making with clear escalation rules that work.

**Expected signal strength:** Strong (this role is where the finding lives or dies).
```

Repeat for 2–4 roles. Cover diverse vantage points (ops, finance, IC, customer-facing).

#### External checks

Name specific external checks, not generic categories:

```markdown
### External checks

1. **Advisor / board member (if exists)**
   - Ask: "Where does the firm's growth ceiling come from in your view? How much of it is the owner's capacity vs. market or structure?"
   - Validates if: names owner-capacity explicitly
   - Refutes if: names market or external factor

2. **Former senior employee (within 24 months)**
   - Ask: "When you were there, what felt permanent about the way the firm was run? What would you have changed if you could have?"
   - Validates if: names the same structural pattern
   - Refutes if: describes different blockers

3. **Referral partner / client of the firm**
   - Ask: "Who do you typically deal with at the firm, and how does that work?"
   - Validates if: always the owner, never anyone else
   - Refutes if: names distributed contact structure
```

If no external check is feasible (client prohibits, no available advisor), note it and downgrade the target confidence from Very High → High.

#### Data pulls

Specific documents that would validate the pattern:

```markdown
### Data pulls

1. **Decision log / email archive sample** (if accessible)
   - What we're looking for: % of non-trivial decisions with owner in the CC/approve path
   - Threshold: >40% = confirms; <20% = refutes; middle = ambiguous

2. **Owner calendar sample (last 30 days)**
   - What we're looking for: % of internal meetings where owner is attendee vs. organizer
   - Threshold: high attendee ratio = confirms the bottleneck pattern

3. **Revenue growth + partner count over time**
   - What we're looking for: revenue plateau coincident with partner count growth past [threshold]
   - Pattern library reference: Falcon — $8.5M revenue / 9 partners was the ceiling

4. **Previously-conducted employee survey data**
   - What we're looking for: themes of "decision speed" or "bottlenecks" in open-text responses
```

### 4. Generate an execution schedule

Match to time constraint:

```markdown
## Execution schedule (--standard)

| Week | Item | Owner | Status |
|---|---|---|---|
| 1 | Team interview: Operations Lead | Jirah (Joshua) | ☐ |
| 1 | Team interview: Finance Lead | Jirah (Joshua) | ☐ |
| 2 | External check: Advisor | Jirah (Jason) | ☐ |
| 2 | Data pull: Owner calendar sample | Client (CFO to send) | ☐ |
| 3 | Synthesize: confidence update | Jirah (both) | ☐ |
```

For `--fast` (audit window): compress to same-day interviews + quick external call; drop any data pull that can't be obtained within the day.

### 5. Output

Default path: `engagements/[slug]/06-sprint/triangulation-plans/[finding-slug].md`

OneDrive equivalent: `01 - Clients\Active\[ClientName]\06 - Sprint & Facilitation\`

Markdown structure:

```markdown
---
engagement: [slug]
finding: "[1-sentence hypothesis]"
friction_point: N
current_confidence: Medium
target_confidence: High | Very High
time_constraint: fast | standard | deep
created: YYYY-MM-DD
---

# Triangulation Plan — [Finding Slug]

## Finding
> [1-sentence hypothesis, verbatim]

Mapped friction point: FP #N [name]

## Confidence trajectory
[from step 2]

## Team interview plan
[from step 3]

## External check plan
[from step 3]

## Data pull plan
[from step 3]

## Execution schedule
[from step 4]

## Post-triangulation
After all items execute, invoke /jirah-session-analyzer on the new transcripts + synthesize an updated confidence tag. Feed into /jirah-action-register.

## Risks to the plan
- [interview target may be unavailable]
- [data pull may be blocked by client privacy concerns]
- [advisor contact may not be authorized by owner]
```

Update engagement frontmatter:
- Append to `triangulation_plans` list: `[finding-slug]: pending`
- Set `nextAction: [first scheduled interview date]`

### 6. Output to chat

```
Triangulation plan — [finding summary]

Current confidence: Medium
Target: [High / Very High]
Time constraint: [fast/standard/deep]

Plan summary
- Team interviews: N (roles listed)
- External checks: M (each with specific ask)
- Data pulls: K (each with threshold)

Execution window: [week 1 → week N]

Output: [path]

Next step
- Book interviews (client-side scheduler)
- Request data pulls (send list to client CFO)
- After execution: /jirah-session-analyzer on new transcripts + revisit confidence
```

---

## Voice rules

- Every probe in the plan is verbatim — Joshua should be able to read it off the page
- Every external check has a specific person-type and a specific ask
- Every data pull has a threshold (what answer confirms / refutes)
- "Triangulate more" as a general instruction is not a plan — Claude rejects vague plans
- If the plan can't get to the target confidence within the time constraint, say so explicitly and recommend downgrading the finding instead of shipping under-evidenced work

## Edge cases

- **Finding is already at Very High** — confirm no more triangulation needed; return "no plan; finding is report-ready."
- **Only 1 team member available** (small firm, partnership structure) — flag limitation; cap target confidence at High; propose data pull + external check to partially substitute.
- **Owner blocks external check** — flag; cap target at High; note the limitation in the finding's confidence footnote in the final action register.
- **No relevant data exists** (client never tracked it) — propose a 2-week log-keeping exercise as the data substitute; adds cycle time but preserves rigor.
- **Finding crosses two friction points** — split into two hypotheses, plan each separately; triangulation plans combine often but not always.
- **Hypothesis phrased as a symptom, not a structural claim** (e.g., "revenue is stuck") — push back; ask for reformulation to structural claim before planning.

## Related

- Upstream sources: [`jirah-discovery`](../jirah-discovery/SKILL.md), [`jirah-sprint-facilitation`](../jirah-sprint-facilitation/SKILL.md), [`jirah-friction-audit`](../jirah-friction-audit/SKILL.md)
- Execution skills: [`jirah-team-interview`](../jirah-team-interview/SKILL.md), [`jirah-financial-audit`](../jirah-financial-audit/SKILL.md), [`jirah-session-analyzer`](../jirah-session-analyzer/SKILL.md)
- Downstream: [`jirah-action-register`](../jirah-action-register/SKILL.md) (feeds the Step 5 deliverable)
- Context: jirah-methodology.md, jirah-friction-points.md
