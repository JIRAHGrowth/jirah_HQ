---
name: jirah-thought-leadership
description: Draft LinkedIn posts and long-form POV pieces in Jirah's signature "owner thought X, actual was Y" format. Weekly post cadence (Tuesdays) + monthly longform (1st of month). Source material is drawn from finished engagements, pattern-library findings, or win/loss insights. Produces LinkedIn-ready copy + optional image brief for Canva. Use when Jason asks for a post, says "draft this week's post," "turn this case study into a post," "write a LinkedIn piece," or surfaces a pattern insight worth publishing.
---

# /jirah-thought-leadership

## Purpose

Fill the top of Jirah's demand-gen funnel with content carrying the wedge: counter-intuitive stories about what the real constraint actually was. Every post reinforces that Jirah names the problem most consultants won't name — Ownership Impact (FP #10) or its structural cousins.

## Pre-requisites (read before drafting)

- [context/jirah-voice.md](../../../context/jirah-voice.md) — voice markers, don'ts
- [context/jirah-pattern-library.md](../../../context/jirah-pattern-library.md) — cross-engagement patterns, primary source material
- [context/jirah-friction-points.md](../../../context/jirah-friction-points.md) — so the constraint named in the post maps cleanly
- [context/jirah-firm.md](../../../context/jirah-firm.md) — positioning, brand rules
- [reports/pattern-library-codification-2026-04-18.md](../../../reports/pattern-library-codification-2026-04-18.md) — if referencing a specific engagement, verify the fact base

## Inputs (ask if not supplied)

- **Format** — `post` (default, ~200 words LinkedIn) | `longform` (~800–1200 words, headings + pull-quotes) | `carousel` (6–8 slides, for image-led LinkedIn)
- **Source** — one of:
  - `--from-engagement Falcon` (name the engagement from pattern library)
  - `--from-pattern "Missing middle"` (name the cross-engagement pattern)
  - `--from-winloss [insight]` (only valid when the Sprint 1e win/loss report produced one, else raise)
  - `--from-situation "[free text]"` (freeform prompt — least preferred; use only if no real engagement fits)
- **Angle** — optional: "retention," "succession," "AI adoption," "multi-office expansion," "partnership governance" — steers which friction point becomes the hook
- **Publish date** — defaults to next Tuesday for `post`, next 1st of month for `longform`

---

## Process

### 1. Select and verify source material

Read the source identified above. If `--from-engagement`, pull the specific numbers, quotes, and findings from pattern-library.md or the full codification report. **Never fabricate numbers or client quotes.** If the source material is thin (e.g., "Vulcan — unverified"), either pick a different source or write the post without specific numerics, anchored on pattern framing only.

If client name is NOT yet cleared for public attribution, use anonymized descriptor instead:
- "a 90-person engineering firm in Western Canada"
- "a 9-partner consulting group scaling past 100 staff"
- "a multi-office professional services firm preparing for succession"

Flag the anonymization so Jason can swap in the real name if permission lands later.

### 2. Apply signature structure

All Jirah content follows the **"owner thought X, actual was Y"** structure. Do not deviate.

#### `post` (LinkedIn, ~200 words)

```
Hook (1–2 sentences)
  Counter-intuitive specific observation. Not a question. Not "have you ever wondered..." Never start with a statistic.

What the owner thought was the problem (2–3 sentences)
  Verbatim or paraphrased. Specific symptom they named.

What the data actually showed (3–4 sentences, with numbers)
  The triangulated evidence — team interview, survey, data pull, external check.
  Commit to numbers where numbers exist.

What changed (2–3 sentences)
  The recommendation. The sequencing. What actually moved when they acted.

Takeaway (1 sentence)
  Counter-intuitive, memorable, reusable. The line that would survive being screenshotted.

Soft CTA (1 line)
  "Friction Audit applications open — link in bio"
  or "DM if this pattern sounds familiar in your own firm"
```

Voice: per `context/jirah-voice.md`. Numbers > adjectives. No corporate-speak. No em-dashes without purpose. No generic flattery. No hashtag spam (1–3 max if any).

#### `longform` (~800–1200 words)

```
Title — direct, specific, POV-led
  NOT "5 lessons we learned" or "Why founders struggle"
  Instead: "The 9-partner vote is the ceiling, not the market"

Opening section (~150 words)
  Situate the pattern. Why this matters now. Name the counter-intuitive claim up front.

"What the owner thought" section (~200 words)
  Specific example. The symptom-framing. What the owner opened the conversation with.

"What the data showed" section (~300 words)
  Triangulated evidence. Numbers, quotes, structural signal.
  Optional pull-quote.

"What we recommended" section (~200 words)
  The sequencing. What to do in what order and why order matters.
  Name the dependency chain (Rec 1 before Recs 2/3, etc. — Falcon pattern).
  Optional pull-quote.

Takeaway / principle (~100 words)
  Generalize the specific into a principle. Name the friction point explicitly.
  End with the Jirah wedge, re-stated in the vocabulary of this post.

Soft CTA
  More detail about the Friction Audit than the short-form post: 1–2 sentences.
```

#### `carousel` (6–8 slides)

Slide 1: Hook
Slide 2: Owner's framing ("They thought it was X")
Slide 3: The signal that pointed somewhere else (quote / stat)
Slide 4: The structural finding ("Actually it was Y")
Slide 5: The counter-intuitive principle
Slide 6: What changed / outcome
Slide 7 (optional): Pattern across multiple engagements
Slide 8: CTA

Each slide = ~20–40 words max. Claude outputs the slide copy + an image brief per slide ready for Canva (once MCP wired in Sprint 2–3).

### 3. Pull-quote + visual brief

For `longform` and `carousel`, surface 2–3 pull-quote candidates — lines that can be screenshotted and travel standalone:

> *"The real constraint is almost never what the owner thinks it is."*

> *"These aren't signs of weakness. They're signs of readiness for the next stage."*

Flag which pull-quote is strongest for the hook image.

Generate image brief (Canva-ready, once MCP wired):
- Mode A palette (gold `#C5A55A`, navy `#111827`, warm off-white `#FAF7F0`)
- Typography: Playfair Display (display) + DM Sans (body)
- Image shape: stat card / pull-quote card / before-after / text-only
- Copy to place on image

### 4. Output

Default: print in chat, ready to paste into LinkedIn.

`--save`: write to `content/drafts/YYYY-MM-DD-[slug].md` with frontmatter:

```yaml
---
format: post | longform | carousel
source: engagement:Falcon | pattern:missing-middle | ...
publish_date: YYYY-MM-DD
status: draft | approved | published
angle: [angle]
---
```

Append to `content/content-log.md` once published (Sprint 4 adds the log file).

### 5. Cadence guidance (for scheduling)

- **Tuesday** — `post` format (weekly)
- **1st of month** — `longform` (monthly, anchor content)
- **Ad hoc** — `carousel` when an engagement produces especially strong visual storytelling (before/after numbers, sequencing diagram, friction-point taxonomy)

Sprint 4 adds a cron trigger that prompts Jason every Monday morning to pick source material for Tuesday's post.

---

## Voice anti-patterns (Claude self-rejects if draft drifts into any of these)

- Generic industry flattery: *"In today's rapidly evolving consulting landscape..."*
- Unbacked superlatives: *"game-changing," "revolutionary," "best-in-class"*
- Listicles for the sake of them: *"5 things every owner should know"*
- Advice with no story: *"Here's why you need to delegate more."*
- The humble-brag: *"I was honored to work with..."*
- Any framing that makes Jirah the hero instead of the owner who acted. The client takes the win; Jirah names the pattern.

---

## Edge cases

- **Source material is pre-OneDrive / unverified** (Vulcan) — write the post without specific numbers; use pattern framing only. Flag in chat.
- **Angle requested doesn't have evidence in pattern library** — offer a neighboring angle that does, or recommend deferring until evidence exists.
- **Client hasn't cleared public attribution** — anonymize with descriptor. Flag for Jason to seek attribution later if the post lands well.
- **Topic trending but off-wedge** (AI hype, generic market commentary) — do not draft. Recommend Jason either skip the week or redirect to a wedge-adjacent angle.
- **Post would name a currently-active client while the engagement is mid-delivery** — do not draft. Post after engagement wraps + testimonial captured.

## Related

- Upstream data: `jirah-case-study` (once built, feeds post source), `jirah-win-loss` (once 50-proposal archive surfaces), `jirah-pattern-library-query`
- Downstream: published content feeds the top of funnel (prospects mentioning the post become warm leads in `/jirah-lead-gen`)
- Context: jirah-voice.md, jirah-pattern-library.md, jirah-friction-points.md
- Future MCP: Canva (Sprint 2–3) — `--render-canva` flag produces the image directly
