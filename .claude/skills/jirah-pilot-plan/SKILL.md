---
name: jirah-pilot-plan
description: Render the internal AI scoping doc into the client-facing AI Pilot Plan — Mode B (co-branded, client as home team). Single-file HTML following the S+A Shop Drawing Pilot exemplar. Structure — Hero → Problem → Approach (Plan A / Plan B + trigger) → Timeline → Example Output → Risks → Next Steps. Use when /jirah-ai-scoping output is approved internally and the client needs the formal pilot plan to review + sign off on.
---

# /jirah-pilot-plan

## Purpose

Render the scoped pilot into the **shippable client deliverable** — the artifact that closes the AI-pilot sale. This is the Mode B (co-branded) HTML doc the client sees; it turns Jirah's internal scope into a client-friendly plan that positions the *client* as the home team.

**Workflow:**
```
/jirah-ai-opportunity-scan → opportunity memo
  ↓
/jirah-ai-scoping → internal technical scope
  ↓
/jirah-pilot-plan → client-facing Mode B deliverable (THIS SKILL)
  ↓
/jirah-ai-pilot-status → weekly during execution
```

## Pre-requisites (read before drafting)

- [context/jirah-voice.md](../../../context/jirah-voice.md) — reusable deliverable structure (Hero → Problem → Approach → Timeline → Example Output → Risks → Next Steps)
- [context/jirah-visuals.md](../../../context/jirah-visuals.md) — **Mode B** rules (client's brand palette + fonts; "Prepared by Jirah" branding secondary)
- [context/jirah-pattern-library.md](../../../context/jirah-pattern-library.md) — Smith + Andersen Shop-Drawing Pilot as the shape + price anchor
- Upstream: `/jirah-ai-scoping` output at `engagements/[slug]/09-ai-pilot/01-technical-scope.md`
- **Structural exemplar:** `C:\Users\jason\Downloads\Shop Drawing Pilot Plan.html` (S+A, co-branded)

## Inputs (ask if not supplied)

- **Client** — slug / engagement folder
- **Scope source** — default `engagements/[slug]/09-ai-pilot/01-technical-scope.md`
- **Client brand** — colors, fonts, logo. Pulled from client profile if set; ask if not
- **Example-output source** — real sample output if we have one; fabricated-but-tangible if not (per voice rules — fabricate rather than omit; tangible beats abstract)

---

## Process

### 1. Ingest the scope

Read the internal technical scope fully. Pull:
- Plan A / Plan B descriptions
- Day-2 decision trigger
- Weekly deliverables
- Data sources + access plan
- Evaluation harness
- Risks + mitigations
- Investment + timeline

**Translate from engineering voice to client voice** — the client doesn't need to see "prompt caching" or "citation enforcement layer." They need to see what happens each week and what they hold us to.

### 2. Resolve client brand

Pull from engagement profile or `01 - Clients\Active\[ClientName]\00 - Profile.md`:
- **Primary color** (navy / charcoal / whatever client uses)
- **Accent color** (orange / blue / whatever)
- **Secondary accent** (if used)
- **Heading font** (client's brand display font, via Google Fonts or web-safe fallback)
- **Body font** (client's brand body font)
- **Logo path** (usually SVG in client's brand kit — use URL or base64 inline if small)
- **"Prepared by Jirah" treatment** — small, lowercase "Jirah" in body copy, gold `#C5A55A` for Jirah accent color in limited placement

Example for Smith + Andersen (the anchor):
- Navy: `#003167`
- Orange: `#C26A2B`
- Mustard: `#FFB500`
- Fonts: Montserrat (display) + Proxima Nova Condensed (body); Proxima is licensed — if absent, Inter is a reasonable fallback
- Client logo: S+A navy mark, positioned top-left

### 3. Build the 7-section structure

Per `context/jirah-voice.md` reusable deliverable structure:

```
SECTION 1 — Hero (full-viewport slide)
  Title: "[Client name] × [Pilot name] — AI Pilot Plan"
  Subtitle: 1-sentence value proposition translated from scope
  Small "Prepared by Jirah" lower-right
  Client logo large; Jirah "J" monogram small
  No CTAs yet; this is the opening chord

SECTION 2 — Problem (with stat stack)
  1 paragraph of owner framing (translated — what the client said in discovery)
  Stat stack — 3–5 concrete numbers about the current-state workflow
  (e.g., "12 shop-drawing submittals per week × 4 hours per review × 2 senior engineers = 96 hours/week")
  Close with the single number we're targeting to change

SECTION 3 — Approach (Plan A / Plan B + decision trigger)
  Translate the Plan A/B from the scope into client voice:
  - Plan A (preferred) — what we're trying to build + how we'll know it's working
  - Plan B (fallback — still valuable) — what still ships if Plan A doesn't hold
  - **Day-2 decision trigger** stated clearly — "By day 2 of week 1, if we see [observable], we continue Plan A. Otherwise we pivot to Plan B immediately."
  This section is where Jirah's methodology discipline becomes visible to the client — they see we've already designed the fallback before writing the first line of code.

SECTION 4 — Timeline (weekly deliverables)
  Week-by-week grid:
    Week 1 — [demo artifact]
    Week 2 — [demo artifact]
    Week 3 — [demo artifact]
    Week 4 — [demo artifact / production handoff]
  Each week card has: goal, demo artifact, client touchpoint (training/review/feedback session)
  **Every week ends with something demo-able** — call this out explicitly

SECTION 5 — Example Output (tangible, named)
  Show a fabricated-but-realistic sample of what the AI will produce
  For S+A: a mock shop-drawing review finding with citations back to drawing sheet + grid ref
  Make it concrete — "This is what you'll see at 4pm on Friday of week 1."
  If a real sample is available (from scaffold testing), use it and flag as "real output from test run"

SECTION 6 — Risks + mitigations ("What could go wrong and how we handle it")
  Top 4–5 risks from the scope, client-voice translated
  Pair each risk with the specific mitigation — not generic "we'll monitor closely"
  Non-negotiable inclusion: the 0-hallucination standard + human review layer
  Example: "Every AI output cites its source document and section. Nothing leaves the tool without [client senior reviewer role]'s approval."

SECTION 7 — Next Steps + Investment
  Two 1-hour kickoff meetings (per voice-doc convention):
    1. Technical kickoff — data access confirmed, evaluation harness walkthrough
    2. Team kickoff — who from client's team touches the tool + how
  Investment: price + payment cadence (25/50/25 or as scoped)
  Post-pilot path: "If Plan A holds, handoff + monthly retainer of $X. If Plan B ships, pilot + learnings closes here or extends on hourly."
  Sign-off block: Jason Lotoski + Joshua Marshall, JIRAH Growth Partners, contact info
  Client sign-off line
```

### 4. Apply Mode B visual rules

**Single-file HTML** following S+A Shop Drawing Pilot Plan structure:

- **Full-viewport slide-deck layout** with scroll-snap
- **Client brand palette** primary (navy + accent + secondary accent)
- **Client brand fonts** via `<link>` Google Fonts if available, web-safe fallbacks otherwise
- **White / charcoal ink** background default (adjust to client's norm — S+A uses white)
- **Client logo** prominent top-left; Jirah "J" monogram small lower-right, gold `#C5A55A`
- **Formal title:** client's pilot name, followed by "Prepared by Jirah" in small lowercase
- **Navigation:** fixed nav dots right-side (1 per section), progress bar top, slide counter bottom-right
- **Example Output (Section 5)** formatted to resemble a real deliverable from the target workflow — if shop-drawing review, looks like a shop-drawing review; if contract clause extraction, looks like a contract review
- **No JavaScript beyond scroll-snap + progress-bar update** (vanilla; no build step)
- **No external dependencies** beyond Google Fonts

Reference `C:\Users\jason\Downloads\Shop Drawing Pilot Plan.html` for CSS structure — steal verbatim, update content + brand.

### 5. Voice checklist (Claude self-rejects if any fail)

- [ ] Hero is visually striking; client logo dominant, Jirah secondary
- [ ] Problem section has at least 3 concrete numbers (not adjectives)
- [ ] Plan A AND Plan B both present with decision trigger
- [ ] Every week in Timeline has a demo-able artifact
- [ ] Example Output is tangible — could be pasted into the client's tool tomorrow
- [ ] Risks are paired with specific mitigations (no generic "we'll monitor")
- [ ] 0-hallucination + human-review standard stated in Risks section
- [ ] "Prepared by Jirah" treatment is small; client branding is primary
- [ ] Formal "JIRAH Growth Partners" for sign-off block; lowercase "Jirah" in body copy
- [ ] Numbers > adjectives throughout
- [ ] No corporate-speak; no em-dashes unless earned

### 6. Output

```
engagements/[slug]/09-ai-pilot/
├── 00-opportunity-memo.md
├── 01-technical-scope.md
├── 02-pilot-plan.html           ← this skill's output
└── 02-pilot-plan.md             ← markdown mirror for reference
```

OneDrive equivalent: `01 - Clients\Active\[ClientName]\09 - AI Pilot\` — delivered file lives here.

PDF export: Jason opens in Chrome, prints to PDF (scroll-snap renders cleanly page-per-slide). No PDF toolchain needed.

Update engagement frontmatter:
- `ai_pilot_plan_sent_date: YYYY-MM-DD`
- `ai_pilot_status: proposed`
- `nextAction: [client response expected date]`

### 7. Trigger downstream

Once client signs off:
- `ai_pilot_status: in-flight`
- Sprint 4 trigger: `/jirah-ai-pilot-status --week 1` auto-fires each Friday of the pilot

Output to chat:

```
AI Pilot Plan — [Client] — [pilot name]

Mode B rendered with client brand: [palette + fonts summary]
7 sections drafted per voice-doc structure.

Plan A / Plan B both present with Day-2 trigger.
Weekly demos confirmed for weeks 1–4.
Example output: [fabricated / real from scaffold test]

Files
- HTML: [path]
- Markdown mirror: [path]

Next action
- Internal review (Jason + Joshua)
- Send via /jirah-email --scenario proposal-send
- Expected sign-off: [date]
- Once signed: /jirah-ai-pilot-status --week 1 fires each Friday
```

---

## Edge cases

- **Client brand kit unavailable** — use S+A palette as stand-in + flag for client to confirm; draft defaults to Mode A if client truly has no brand (rare — every B2B client has at least a logo).
- **Client wants Jirah branding primary** — push back; Mode B exists because pilots are client-owned work-product. If client insists, draft in Mode A and note the deviation.
- **Example Output is commercially sensitive** (real data that can't be fabricated cleanly) — anonymize aggressively; name in the doc that "this sample uses anonymized data."
- **Pilot duration isn't 4 weeks** (6-week, 8-week, etc.) — Timeline section expands but Day-2 trigger stays week 1 day 2; weekly-demo discipline holds through the longer window.
- **Pilot is ongoing-retainer-shaped**, not fixed-duration — Section 4 structure shifts: Month 1 / Month 2 / ongoing cadence. Flag as an unusual shape; pricing model should reflect.
- **Client asks for pricing options** (A/B/C menu) — default: one price. If client explicitly wants options, offer at most two (full Plan A scope / scope cut to Plan B only). Three options signals indecisiveness.
- **Internal scope has a high-risk item we want the client to accept up front** — surface it in Risks with the mitigation; don't bury. If the risk is so high Jirah may want to walk, flag to Jason before sending.

## Related

- Upstream: [`jirah-ai-scoping`](../jirah-ai-scoping/SKILL.md) (internal scope feeds this skill)
- Downstream: [`jirah-ai-pilot-status`](../jirah-ai-pilot-status/SKILL.md) (weekly during execution), [`jirah-action-register`](../jirah-action-register/SKILL.md) (pilot-close wraps into strategic register if parallel strategic+AI shape)
- Adjacent: [`jirah-email`](../jirah-email/SKILL.md) `--scenario proposal-send` for cover email, [`jirah-client-presentation`](../jirah-client-presentation/SKILL.md) if a slide deck accompanies
- Context: jirah-voice.md, jirah-visuals.md, jirah-pattern-library.md
- Structural exemplar: `C:\Users\jason\Downloads\Shop Drawing Pilot Plan.html`
