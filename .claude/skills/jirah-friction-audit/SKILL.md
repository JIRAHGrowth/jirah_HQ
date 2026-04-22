---
name: jirah-friction-audit
description: Deliver the 1-full-day Friction Audit product — diagnose through the 10 Friction Points, enforce triangulation with confidence tags, produce a few-page action register with ops / project / AI expansion paths. Invoke when a handpicked audit applicant has paid the $1,500 fee and booked their day. Use --mode to select prep / capture / synthesize.
---

# /jirah-friction-audit

## Purpose
Execute Jirah's flagship diagnostic product: the paid **$1,500 / 1-full-day Friction Audit** that surfaces the *real* constraint in an owner-run B2B firm and offers three paths forward. This skill is the product — it must hit the methodology exactly.

## Pre-requisites (Claude reads before anything)

- [context/jirah-friction-points.md](../../../context/jirah-friction-points.md) — the 10 diagnostic lenses + diagnostic questions per lens
- [context/jirah-methodology.md](../../../context/jirah-methodology.md) — triangulation, confidence tags, scope discipline, dual-facilitator
- [context/jirah-voice.md](../../../context/jirah-voice.md) — voice markers, Hero → Problem → Approach structure
- [context/jirah-icp-wedge.md](../../../context/jirah-icp-wedge.md) — wedge + three monetization paths
- [context/jirah-pattern-library.md](../../../context/jirah-pattern-library.md) — prior engagement patterns (Vulcan → Hatch → Falcon → Genesis)

## Inputs (ask if not supplied)
- **Applicant file** — path to `audit-applications/[id].md` (carries ICP score, revenue, staff, why-they-applied, contact info)
- **Audit date** — today if not specified
- **Mode** — `--mode prep` | `--mode capture` | `--mode synthesize`

---

## 1-day delivery framework

**Morning (3 hrs) — Owner hypothesis intake**
- Owner walks through what they think the problem is
- Jason takes notes; watches for contradiction, language shift, emotional markers
- Capture owner's framing against all 10 Friction Points (even ones the owner doesn't mention)

**Midday (1 hr) — Team interviews**
- 2–3 stakeholders outside the owner (ops lead, finance lead, top salesperson, longest-tenured IC)
- Triangulate against morning hypotheses
- Divergence between team view and owner view is the signal

**Afternoon (2 hrs) — Data pass + external check**
- Financial snapshot (revenue trend, margin by service, client concentration)
- External: 1–2 quick calls with referrals, advisors, or a former employee if available
- Confirm / refute preliminary findings

**Synthesis (1 hr) — Action register**
- Identify the 1 real constraint (the wedge finding — almost never what owner named in the morning)
- 3–5 supporting findings mapped to friction points
- Confidence tag each: Very High / High / Medium
- 3 expansion paths: Ops / Project / AI

---

## Mode behavior

### `--mode prep`

1. Read the applicant file. Extract: industry, revenue, staff, owner's why.
2. Generate **pre-audit hypothesis brief** including:
   - Top 3 likely primary friction points given ICP + why-they-applied
   - 2–3 diagnostic questions per likely point (sourced from `context/jirah-friction-points.md`)
   - Suggested team interview targets (roles — we ask owner for names)
   - Data pulls to request in advance (3-year financials, org chart, client concentration list)
   - Pattern match from library if any (reference specific Vulcan/Hatch/Falcon/Genesis finding)
3. Output to `audit-sessions/[client-slug]/00-prep-brief.md` in Mode A style.

### `--mode capture` (during the day)

1. Read prep brief + running capture notes.
2. For each observation Jason or Joshua shares, log:
   - **Source:** owner / team / data / external
   - **Friction point:** 1–10
   - **Observation:** verbatim or paraphrased with source
   - **Flag if contradicts owner's morning framing**
3. Output to `audit-sessions/[client-slug]/01-capture.md` (append mode throughout the day).

### `--mode synthesize` (end of day)

1. Read all capture notes + prep brief + applicant file.
2. Apply triangulation rules:
   - Owner + 2+ team agreement → **High**
   - + external check or data confirmation → **Very High**
   - Single source → **Medium** (flag for probing / exclude from Critical register items)
3. Identify **the real constraint** — usually the most-triangulated finding the owner did NOT name in the morning. Name it explicitly, per the wedge. Back it with the evidence trail.
4. Build the **action register** (3–5 rows):
   - Priority (Critical / High / Medium)
   - Friction point mapped (1–10)
   - Finding (1 sentence + confidence tag)
   - Recommendation (1 sentence)
   - Expansion path suggested: Ops / Project / AI
   - Owner (client-side; flag TBD if not clear)
   - Next step (verb-led) + suggested timeline
5. Produce **3 expansion proposals** (one per path):
   - **Ops optimization** — what + rough scope + price band
   - **Project execution** — what + rough scope + price band
   - **AI build** — what leverage opportunity + 4-week pilot shape + price band (reference `jirah-ai-opportunity-scan` when built)
6. Output to `audit-sessions/[client-slug]/02-findings.md` in Mode A style using the voice-doc structure:
   ```
   Hero → Problem (stat stack) → Approach → Real Constraint →
   Action Register → Three Expansion Paths → Risks + Mitigations →
   Next Steps (two 1-hour kickoff meetings)
   ```

---

## Output file paths

All under `audit-sessions/[client-slug]/`:
- `00-prep-brief.md` — from `--mode prep`
- `01-capture.md` — from `--mode capture` (appended throughout the day)
- `02-findings.md` — from `--mode synthesize` (the few-page deliverable)

---

## Voice requirements (non-negotiable)

- Direct, factual, no marketing fluff
- Numbers > adjectives (cut an adjective; add a number)
- Proofs of discipline embedded in prose ("every finding triangulated across owner + team + external")
- Risks with mitigations always paired
- Confidence tags on every finding
- Name Ownership Impact (FP #10) explicitly when it's the real constraint — this is the Jirah wedge

---

## Edge cases

- **Only 1 team interview available** — downgrade all findings to Medium by default; name the limitation in the findings doc's Risks section.
- **Owner refuses team interviews** — flag audit as constrained; deliver a hypothesis register with lower confidence; offer to re-run synthesis after interviews.
- **Data access limited** (no financials) — proceed with qualitative triangulation; note missing data as a Medium-confidence risk.
- **Mid-day ICP mismatch discovered** (firm is smaller/larger than expected) — flag immediately with Jason and Joshua; do not force-fit recommendations. Offer a refund-and-graceful-exit option.
- **Owner gets defensive when FP #10 (Ownership Impact) is surfaced** — back off, reframe as "growth ceiling capacity," return to it with specific team-interview evidence. Never wage it as accusation.
