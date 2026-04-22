---
name: jirah-client-presentation
description: Build client-facing presentations (pitch decks, Discussion Document deep-dive readouts, mid-sprint partner readouts, AI pilot kickoff/demo decks) as single-file browser-rendered HTML. Extends the global html-brief skill with Jirah's Mode A (JIRAH-branded) or Mode B (co-branded, client as home team) visual rules. Reuses voice-doc structure (Hero → Problem → Approach → Timeline → Example Output → Risks → Next Steps). Use when Jason says "build the pitch deck for X," "create a readout deck for Y," "presentation for the kickoff," or needs any HTML-rendered presentation distinct from the specialized skills (/jirah-discussion-document is Step 2, /jirah-pilot-plan is Mode B AI).
---

# /jirah-client-presentation

## Purpose

The **general-purpose presentation skill** — for the client-facing HTML decks that don't fit a more specialized skill. Extends the global [`html-brief`](../../../CLAUDE.md) / `html-brief-jason` with Jirah Mode A / Mode B discipline.

**Use the more specialized skill when it applies:**
- Discussion Document (Step 2) → [`/jirah-discussion-document`](../jirah-discussion-document/SKILL.md)
- AI Pilot Plan (Mode B) → [`/jirah-pilot-plan`](../jirah-pilot-plan/SKILL.md)
- Case study → [`/jirah-case-study`](../jirah-case-study/SKILL.md) (`--for pitch` outlet)
- Action Register → [`/jirah-action-register`](../jirah-action-register/SKILL.md)

Use THIS skill for everything else:
- **Pitch decks** for new-prospect conversations (pre-Discovery)
- **Mid-sprint readouts** — interim deliverables between Step 4 and Step 5
- **Kickoff decks** (Step 3) when a visual is warranted beyond the written agenda
- **Client training / handoff decks** at the end of AI pilot integration
- **Quarterly business reviews** during Step 6 retainer phase
- **Ad hoc strategic presentations** at client's ask

## Pre-requisites (read before drafting)

- [context/jirah-voice.md](../../../context/jirah-voice.md) — deliverable structure (Hero → Problem → Approach → Timeline → Example Output → Risks → Next Steps), voice markers
- [context/jirah-visuals.md](../../../context/jirah-visuals.md) — **Mode A / Mode B chooser table**; exact palette + fonts + structural patterns
- Structural exemplars (resolve `[ONEDRIVE_ROOT]` from `dashboard/.env.local`):
  - Mode A: `[ONEDRIVE_ROOT]\04 - Deliverable Templates\Exemplars\SA_Discussion_Document.html`
  - Mode B: `[ONEDRIVE_ROOT]\04 - Deliverable Templates\Exemplars\Shop Drawing Pilot Plan.html`

## Inputs (ask if not supplied)

- **Purpose** — one of: `pitch-deck` | `mid-sprint-readout` | `kickoff-deck` | `training-deck` | `qbr` | `custom`
- **Mode** — `A` (JIRAH-authority voice) | `B` (client-home-team) | ask if ambiguous (use `context/jirah-visuals.md` chooser table)
- **Audience** — partner-level / full-team / mixed — tunes depth + length
- **Client / engagement** — slug if existing; fresh profile if pitch for a new prospect
- **Source material** — what content the deck needs to carry. Pulls from engagement files if slug supplied; otherwise Jason provides brief
- **Desired length** — 7-slide standard; 10–12 for QBR / longer readouts; 5 for compressed kickoff

---

## Process

### 1. Resolve mode

Run the chooser table from `context/jirah-visuals.md`:

| Scenario | Mode |
|---|---|
| Pitch deck for new prospect | A |
| Discovery readout | A |
| Mid-sprint strategic readout | A |
| Kickoff deck for new engagement | A |
| AI pilot kickoff / demo | B |
| Training / handoff deck (post-AI-pilot) | B |
| QBR (Step 6) | A (premium/authority feel) |
| Client-hosted event / presentation where client is the face | B |

If mode is truly ambiguous, ask Jason explicitly.

### 2. Resolve visual system

**Mode A:**
- Gold `#C5A55A`, Navy `#111827`, warm off-white `#FAF7F0`
- Playfair Display (display) + DM Sans (body)
- Formal "JIRAH Growth Partners" header branding
- "J" monogram in gold

**Mode B:**
- Client's brand palette — pulled from client profile or requested from Jason
- Client's brand fonts — Google Fonts if available, web-safe fallbacks otherwise
- White / charcoal-ink default
- Client logo prominent; "Prepared by Jirah" small

### 3. Build structure

Standard 7-section per `context/jirah-voice.md` deliverable structure — tuned per purpose:

#### `pitch-deck` (Mode A, ~7 slides)

```
1. Hero — firm identity + wedge statement
2. Problem — the specific friction pattern we address (FP #10 forward)
3. Approach — the 6-step process + three monetization paths
4. Track record — 2–3 pattern-library exemplars (Falcon, Genesis, S+A — anonymized if client-cleared attribution isn't yet in place)
5. Example output — sample action register page + sample AI pilot findings
6. Risks + mitigations ("What could go wrong and how we handle it") — common consulting concerns + Jirah's answers
7. Next steps — "Two 1-hour kickoff meetings" + Friction Audit as typical entry
```

#### `mid-sprint-readout` (Mode A, ~5–7 slides)

```
1. Hero — engagement name + week/day marker
2. What we've heard so far — owner + team + data; key verbatim quotes (anonymized)
3. Top 3 emerging hypotheses (with confidence tags — Medium at mid-sprint)
4. What we still need to triangulate — interviews remaining, data pulls pending
5. What happens next — sprint wrap + 45-day path to Action Register
6. Risks we're carrying — what could change the findings
7. Open questions for client leadership — 2–3 specific asks for next partner sync
```

#### `kickoff-deck` (Mode A, ~5 slides — complements the [`/jirah-kickoff-agenda`](../jirah-kickoff-agenda/SKILL.md) written agenda)

```
1. Hero — engagement name + partnership both-sides
2. Why we're here — 1-page recap of Discussion Document scope
3. Sprint design visual — dates + attendees + daily shape
4. Triangulation plan — interviews + data asks + external checks
5. Next steps — calendar view of 45-day path to Action Register
```

#### `training-deck` (Mode B, ~6–8 slides — post-AI-pilot handoff)

```
1. Hero — tool / workflow handoff
2. What the tool does — 1-page description
3. Daily workflow — how client team uses it day-to-day
4. When it's right / when to escalate to human
5. Troubleshooting — common issues + recovery
6. Metrics we'll track — what "healthy" looks like post-handoff
7. Support — Jirah's continuing role; escalation path
8. Next 30 days — post-handoff checkpoint
```

#### `qbr` (Mode A, ~10–12 slides — Step 6 quarterly)

```
1. Hero — [Client] × JIRAH — Q[N] [Year]
2. Last quarter's critical register items — delivered / on track / slipped
3. KPI movement — the 3–5 key metrics we agreed to track
4. What moved vs plan — numbers
5. What stuck — diagnosis + recommended pivot
6. What we learned — insights that update the engagement-level hypothesis
7. Three expansion paths — ops / project / AI — any refresh?
8. Risks + mitigations — new risks for next quarter
9. Next quarter's focus — top 3 priorities
10. Cadence + investment — retainer continuation / adjustment
11. Open questions for leadership
12. Close — sign-off + next QBR date
```

#### `custom`

Jason describes the purpose + audience. Claude proposes a slide structure for confirmation before building.

### 4. Render single-file HTML

- Full-viewport scroll-snap layout (per S+A / Shop-Drawing exemplars)
- Fixed right-side nav dots (one per section)
- Top progress bar
- Bottom-right slide counter
- Google Fonts via `<link>` tag (mode-dependent)
- Vanilla JS — scroll position tracker + nav-dot highlighting only; no build step
- No external dependencies beyond Google Fonts

### 5. Voice checklist (Claude self-rejects if any fail)

- [ ] Mode correctly applied (A vs B per chooser table)
- [ ] Hero carries the primary voice (Jirah authority OR client-as-home-team)
- [ ] Numbers > adjectives on every stat-bearing slide
- [ ] Example output slide is tangible, not abstract
- [ ] Risks paired with mitigations (never a risk without a mitigation named)
- [ ] Proofs of discipline embedded (triangulation, confidence tags, action register reference)
- [ ] No corporate-speak ("leverage synergies," "paradigm shift," "best-in-class")
- [ ] Formal "JIRAH Growth Partners" in Mode A headers / sign-off; lowercase "Jirah" in body copy
- [ ] Mode B: client brand primary, Jirah secondary
- [ ] Font + palette match `context/jirah-visuals.md` exactly

### 6. Output

```
engagements/[slug]/presentations/
└── [purpose]-YYYY-MM-DD.html

OR (ad-hoc, no engagement):

presentations/[descriptor]-YYYY-MM-DD.html
```

OneDrive equivalent: `03 - Marketing & Content\Decks\` for pitch decks; per-client `07 - Deliverables\` for client-specific decks.

PDF export: Jason opens in Chrome; prints to PDF; scroll-snap renders cleanly page-per-slide.

Update engagement frontmatter if applicable:
- `presentations_delivered: [list with dates]`

### 7. Output to chat

```
Client Presentation — [purpose] — [client / descriptor]

Mode: [A / B] — [reason from chooser table]
Slides: [count]
Source material: [files read]

Voice checklist: all pass
Structural exemplar: [S+A / Shop-Drawing / custom]

Output
- HTML: [path]
- Open in Chrome to preview; print-to-PDF for attached send

Next steps
- Internal review (Jason + Joshua) — especially Mode + brand calibration
- If Mode B, verify client-brand palette with Jason before send
- [If pitch-deck:] queue /jirah-email --scenario general for cover email
- [If mid-sprint-readout:] schedule readout meeting; partner sync on questions before
```

---

## Extends global `html-brief`

This skill wraps the global [`html-brief`](../../../CLAUDE.md) / `html-brief-jason` pattern with:

1. Mode A / Mode B rules (Jirah-specific)
2. Voice-doc reusable structure (Hero → Problem → Approach → Timeline → Example → Risks → Next Steps)
3. Engagement-folder output routing
4. Cross-skill links (reads from engagement files, not freeform)

For non-Jirah presentations (Jason's personal pitches, listingbox briefs, other contexts), use the global skill instead.

## Edge cases

- **Client brand kit unavailable for Mode B** — use S+A palette as stand-in; flag for client to confirm on send
- **Purpose is actually a Discussion Document** — redirect to [`/jirah-discussion-document`](../jirah-discussion-document/SKILL.md); this skill is for non-Step-2 decks
- **Purpose is a case study presentation** — use [`/jirah-case-study --for pitch`](../jirah-case-study/SKILL.md) instead; it generates the editorial-long-form case study in Mode A HTML
- **Mixed audience** (some partners, some ICs) — tune to partner-level; include an "appendix" section for deeper detail ICs might want
- **Pitch deck for a prospect where we have no prior engagement data** — pull 2–3 pattern-library exemplars anonymized; focus Hero + Problem on the wedge, not on logos
- **QBR where the quarter was rough** (multiple Slipped items) — do not soften. Honest diagnosis + clear recommended pivot. Retainer relationships survive honest status, not polished ones.
- **Training deck for a highly non-technical team** — simplify vocabulary; shift Example Output slide toward "what you'll see on your screen" rather than architecture
- **Client asks for PowerPoint instead of HTML** — push back gently; offer PDF from the HTML render as first option; if they insist on PPT, flag as separate work — this skill doesn't produce .pptx

## Related

- Specialized skills (use these when they apply):
  - [`/jirah-discussion-document`](../jirah-discussion-document/SKILL.md) — Step 2 deliverable
  - [`/jirah-pilot-plan`](../jirah-pilot-plan/SKILL.md) — Mode B AI pilot
  - [`/jirah-case-study`](../jirah-case-study/SKILL.md) — case study with `--for pitch` outlet
  - [`/jirah-action-register`](../jirah-action-register/SKILL.md) — Step 5 deliverable
- Extends: global `html-brief` / `html-brief-jason`
- Context: jirah-voice.md, jirah-visuals.md
- Structural exemplars: SA_Discussion_Document.html (Mode A), Shop Drawing Pilot Plan.html (Mode B)
