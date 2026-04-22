---
name: jirah-audit-apply
description: Generate landing page copy + application form questions + scoring rubric for the free "Apply for Friction Audit" funnel front door. Use when launching or revising the public Friction Audit apply page, the embedded form, or the ICP scoring rubric that feeds triage. Output is Mode A, wedge-forward, copy-paste ready.
---

# /jirah-audit-apply

## Purpose

Produce the public-facing assets for Funnel 2 (out-of-market apply-for-audit). Three artifacts: **landing page copy**, **8–10 form questions**, and the **ICP scoring rubric** that `jirah-audit-triage` uses to rank applicants.

This is the top of the volume lane. The copy must (a) lead with the wedge, (b) repel non-ICP applicants, and (c) give us enough signal in the form to triage without a phone screen.

## Pre-requisites (read before drafting)

- [context/jirah-icp-wedge.md](../../../context/jirah-icp-wedge.md) — ICP bands, wedge copy, Funnel 2 shape (volume / prestige / commitment / constrained)
- [context/jirah-voice.md](../../../context/jirah-voice.md) — voice markers, naming conventions, don'ts
- [context/jirah-friction-points.md](../../../context/jirah-friction-points.md) — so form questions map cleanly to diagnostic lenses
- [context/jirah-visuals.md](../../../context/jirah-visuals.md) — Mode A palette (gold `#C5A55A`, navy `#111827`, warm off-white `#FAF7F0`)

## Inputs (ask if not supplied)

- **Mode** — `--mode landing` | `--mode form` | `--mode rubric` | `--mode all` (default)
- **Revision context** — if revising: what's failing? (applicants misqualified, drop-off mid-form, not enough signal to triage)

---

## Mode behavior

### `--mode landing`

Write copy for `audit-apply/landing-copy.md`. Structure:

```
Hero
  headline: the wedge, first person plural
  subhead: what the audit is in one sentence
  primary CTA: "Apply for an audit"

Who this is for
  bulleted ICP bands — owner-run, 30–150 staff, $6M–$20M revenue
  one line that explicitly disqualifies: "Under 25 staff? We're not your fit yet."

What happens if you're selected
  4 steps, plain language: application → screen → paid audit day → few-page findings + three expansion paths

What the day looks like
  morning / midday / afternoon / synthesis — same structure as /jirah-friction-audit
  name the deliverable: "A few pages. An action register. Three paths forward. No 60-page deck."

Why we charge $1,500
  one short paragraph: commitment test, constrained delivery, every applicant gets the same rigor
  do not apologize for the price

Proof
  one counter-intuitive finding from the pattern library ("One owner hired us to fix retention — the real constraint was owner-as-bottleneck.")
  redact client name if not cleared; say "a 90-person engineering firm" etc.

Who we are
  3 sentences: Jirah Growth Partners, Jason Lotoski + Joshua Marshall, extended-CEO team for owner-run B2B firms

Apply CTA (repeat)
```

Voice rules:
- Use "we" / "you" — never third-person corporate.
- Lead hero with the wedge verbatim or within 1 word of it.
- No em-dashes unless they earn their place. No generic industry flattery. No hedging.

### `--mode form`

Draft `audit-apply/form-questions.md` — 8–10 questions, each labeled with the friction point it probes + the scoring weight it feeds.

Required question set:

1. **Company name + website** (identity)
2. **Role** — buyer gate (owner / managing partner / GM / other). Non-owner → shortlist-only by default.
3. **Staff count** — bucket: <30 / 30–75 / 75–150 / 150+. Feeds staff weight.
4. **Annual revenue** — bucket: <$6M / $6–10M / $10–20M / $20M+. Feeds revenue weight.
5. **Industry** — engineering / building systems / professional services / accounting / other (open). Feeds industry-fit weight.
6. **Is the firm owner-run (owner actively leading the business)?** Yes / Partnership / No. Feeds owner-run weight.
7. **What do you think is holding the firm back right now?** (open-ended, ~150 words) — this is the **owner hypothesis** that the audit later triangulates. Feeds wedge-fit weight.
8. **When the owner is out for two weeks, what breaks?** (open-ended, short) — probes FP #10.
9. **What have you already tried to fix it?** (open-ended, short) — filters serial-consultant-buyers from first-time buyers.
10. **Optional: what would change for you personally if the constraint got removed?** — emotional signal, informs engagement framing.

Each question carries a `# weight:` comment in the file so the scoring rubric is traceable to form answers.

### `--mode rubric`

Write `audit-apply/scoring-rubric.md`. Fixed weights (total 100):

| Dimension | Weight | Source | Scoring |
|---|---|---|---|
| Revenue | 25 | Q4 | <$6M = 5; $6–10M = 18; $10–20M = 25; $20M+ = 20 (AI-build only) |
| Staff | 15 | Q3 | <30 = 3; 30–75 = 12; 75–150 = 15; 150+ = 10 |
| Industry fit | 20 | Q5 | Engineering / building systems = 20; prof services / accounting = 15; other B2B = 8; non-B2B = 0 |
| Wedge fit | 25 | Q7 + Q8 | 25 if open-text reveals structural / ownership signal; 15 if names symptom (revenue, retention) without structure; 5 if vague |
| Owner-run signal | 15 | Q2 + Q6 | 15 if owner/MP applying and firm owner-run; 8 if partnership; 0 if staff role or corporate subsidiary |

Tier bands (feed `jirah-audit-triage`):
- **Green 70–100** — auto-accept, invite to paid audit
- **Amber 40–69** — shortlist, 15-min strategic call first
- **Red <40** — decline with warm referral or content follow

Embed decision examples in the rubric: show one green (90), one amber (55), one red (25) walk-through so Jason and Joshua can score consistently without running the skill.

### `--mode all` (default)

Run landing → form → rubric in sequence. Output all three files + a one-page summary in chat showing the cross-references (which form question feeds which rubric dimension).

---

## Output paths

```
audit-apply/
├── landing-copy.md          ← --mode landing
├── form-questions.md        ← --mode form
└── scoring-rubric.md        ← --mode rubric
```

Create `audit-apply/` in the workspace root if absent.

---

## Revision triggers (when to re-run)

- Applications scoring Green but turning out to be poor-fit in the audit → tighten wedge-fit wording in Q7
- Drop-off mid-form (analytics from the host platform) → cut question count, reorder commitment questions later
- Too many Amber shortlist emails drafted → rubric is too generous; re-weight wedge-fit up, revenue down
- New vertical opens (e.g., construction) → add to Q5 + industry-fit scoring

---

## Edge cases

- **Applicant applies on behalf of someone else** (consultant, EA) — flag in form output, default to shortlist (not green) regardless of score.
- **Foreign country outside North America** — form does not gate geography; triage handles it.
- **AI-build-only prospect** (larger than ICP revenue cap) — note in rubric that $20M+ scores 20 (not 25) because AI-build pricing model differs from ops/project.

## Related

- Upstream: none (this is top of funnel)
- Downstream: `jirah-audit-triage`, `jirah-friction-audit`
- Context: jirah-icp-wedge.md, jirah-voice.md, jirah-friction-points.md
