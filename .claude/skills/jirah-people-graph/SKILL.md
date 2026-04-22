---
name: jirah-people-graph
description: Track and query the wider Jirah relationship network — introducers, alumni, advisors, prospects' colleagues, peers. Markdown-per-person store with structured frontmatter. Supports add / warm-intro path query / stale-tie scan / org-roster query. Owner-run firms run on trust networks; this skill is how Jirah tracks the firm's network systematically. Use when Jason says "met [name] at [event] — log her," "who do I know at [company]," "who haven't I touched in 90+ days," "add [person] to the people graph."
---

# /jirah-people-graph

## Purpose

Owner-run B2B firms run on **trust networks**. Jirah's growth machine depends on Jason + Joshua's wider relationship graph — introducers, prospects' colleagues, advisors, alumni from prior firms, board members, peers in the consulting ecosystem. This skill is the systematic tracker.

**Not a CRM.** Closer to a personal network index with just-enough structure to query: "Who do I know at Northcrest?" "Who's stale?" "Who's the intro path to this target?"

## Pre-requisites (read before running)

- [context/jirah-voice.md](../../../context/jirah-voice.md) — notes written in partner voice, neutral on relationship strength assessments

## Inputs

- **Mode** — one of:
  - `--add [name]` — add / update a person entry
  - `--warm-intro [target-org]` — find intro paths to a target company
  - `--stale` — list people with strong ties who haven't been touched in 90+ days
  - `--by-org [org]` — list all contacts at a given organization
  - `--query [free text]` — natural-language search ("who's my connection to engineering firms in Alberta?")
- Additional per-mode inputs (see below)

---

## File structure

Each person lives at `people/[slug].md`.

```markdown
---
slug: dana-whitfield
name: Dana Whitfield
role: Principal
org: Northcrest Structural
email: dana@northcrest.com
linkedin: https://linkedin.com/in/dana-whitfield-example
relationship: prospect-side-contact       # introducer / alumnus / advisor / client-side / prospect-side-contact / peer / board
source: Referral via Larkspur (Elena Kovač) — met at ACEC-BC event 2024-09
first_met: 2024-09-18
last_touch: 2026-04-02
strength: warm                            # cold / warm / strong
tags: [structural, BC, succession-prep, 52-staff]
---

# Dana Whitfield — Northcrest Structural

## Context
Principal at Northcrest Structural, 52 staff, Burnaby BC. Technical co-founder.
Husband retired from the firm last year; Dana is now sole owner preparing for
a 3-year succession. Known for rigorous technical work in mid-rise multi-family
residential structural engineering.

## Mutual interests
- Succession planning (overlap with Genesis pattern)
- APEGBC governance reform

## History
- 2024-09-18 — Introduced via Elena at ACEC-BC event. Discussed succession; she
  referenced the "ownership cliff" signal indirectly.
- 2025-11-22 — Jason forwarded Falcon case study excerpt; she responded warmly,
  asked about our process.
- 2026-04-02 — Coffee meeting; Kelowna trip; discussed 12-month road to
  possible engagement. Flagged: she wants to wait until Q3 when current
  project wraps.

## Warm-intro paths through her
- Introduced us to: (none yet)
- Could introduce us to: APEGBC governance committee, other mid-size BC
  structural firms in her referral circle
```

Frontmatter fields (all required unless noted):
- `slug` — URL-safe identifier
- `name` — full name
- `role` — current role
- `org` — current organization
- `email` — primary (blank if unknown)
- `linkedin` — URL (blank if unknown)
- `relationship` — one of: introducer / alumnus / advisor / client-side / prospect-side-contact / peer / board
- `source` — how we met (plain English)
- `first_met` — ISO date
- `last_touch` — ISO date (updated on every interaction)
- `strength` — cold / warm / strong
- `tags` — list of freeform tags for query (industry, geo, pattern, size band)

---

## Mode: `--add [name]`

### Process

1. Check if person already exists (slug match). If yes, switch to update mode — prompt Jason on which fields to update; append new history line.
2. If new, prompt for each frontmatter field. Pre-fill from Jason's input if provided:
   - `/people-graph --add "Dana Whitfield at Northcrest, BC structural eng, 52 staff, met via Elena at ACEC"` — skill parses as much as possible and asks only for missing fields
3. Generate slug from name (lowercase, hyphens).
4. Write to `people/[slug].md`.
5. Append to a master index at `people/_index.md` (auto-regenerated each run):
   ```markdown
   | Slug | Name | Org | Role | Relationship | Strength | Last touch |
   |---|---|---|---|---|---|---|
   ```

### Output to chat

```
Added: Dana Whitfield — Northcrest Structural (prospect-side-contact, warm)
File: people/dana-whitfield.md
Index updated: people/_index.md
```

---

## Mode: `--warm-intro [target-org]`

### Process

1. Scan `people/*.md` for anyone with:
   - `org == [target-org]` (direct — 0 hops)
   - History mentioning the target-org name (1-hop)
   - Tag matching the target-org industry + geo (potential bridge)
2. Rank by hop distance + relationship strength:
   - 0-hop, strong: top priority
   - 0-hop, warm: second
   - 1-hop, strong: third
   - 1-hop, warm: fourth
   - tag-bridge only: fifth (flag as weak)
3. For each candidate path, surface:
   - Name, their org, their role
   - Relationship strength + how we know them
   - The specific mention / bridge that links them to target-org
4. Recommend chain: `/jirah-intro-request --introducer [slug] --target [target-org]`

### Output to chat

```
Warm-intro paths to [target-org]

0-hop (direct — they work there)
- [Name] ([role], [strength]) — last touched [date] — [link]

1-hop (they know someone there)
- [Name] at [their-org] ([strength]) — mentioned [target-org] in [history entry]

Tag-bridge (industry/geo adjacency only — weaker signal)
- [Name] at [their-org] — matches target profile tags [tags]

Recommended next step
- If 0-hop: /jirah-intro-request --introducer [top-candidate-slug] --target [target-org]
- If 1-hop: warm the introducer first (meet / check-in) before asking for intro
- If tag-bridge only: tighten target research or skip to cold outreach via /jirah-lead-gen
```

---

## Mode: `--stale`

### Process

1. Scan `people/*.md` for entries where:
   - `strength: strong` AND
   - `last_touch` is >90 days ago
2. Rank by staleness (oldest last-touch first).
3. For each, surface a suggested touch action:
   - If relationship is "introducer" — "They've introduced us before; any warm update would refresh the bond"
   - If "client-side" — "Consider a check-in email (see /jirah-email --scenario check-in)"
   - If "peer" — "Low-lift: share a recent piece of thought-leadership; see /jirah-thought-leadership"
   - If "advisor" — "Offer an update on the firm; they'll want to hear how it's going"

### Output to chat

```
Stale strong ties — [N]

1. [Name] ([org], [relationship]) — last touched [N] days ago
   Suggested: [specific touch action + skill chain if applicable]

2. ...
```

---

## Mode: `--by-org [org]`

### Process

Glob `people/*.md` where frontmatter `org == [org]` (exact or partial match).

Return:
- All contacts at that org
- Their role, relationship, strength, last touch

Use case: "Who do I know at Smith + Andersen?" → lists every person at S+A + their relationship shape.

### Output to chat

```
Contacts at [org] — [N]

| Name | Role | Relationship | Strength | Last touch |
|---|---|---|---|---|
| ... |
```

---

## Mode: `--query [free text]`

### Process

Natural-language search across `people/*.md` — matches on:
- Frontmatter fields (name, org, role, relationship, strength, tags)
- History text
- Context section

Return top 10 matches with a 1-line "why matched" per result.

Examples:
- `"engineering firms in Alberta"` → anyone whose org is engineering + geo AB
- `"knew from HSBC"` → anyone whose `source` mentions HSBC
- `"board members"` → anyone whose `relationship: board`
- `"succession-prep"` → anyone with that tag

### Output to chat

```
Query: "[query]"
Matches — top 10

1. [Name] ([org], [role]) — why matched: [reason]
2. ...
```

---

## Cadence hygiene

The skill itself doesn't push updates — but it surfaces signal for [`jirah-weekly-review`](../jirah-weekly-review/SKILL.md) Section 6: "People graph — touches needed this week" reads `--stale` output.

Maintenance:
- Every add / update re-writes `people/_index.md` so the index stays fresh
- Every warm-intro query logs to `people/_query-log.md` — so Jason can see "which targets did I ask about in last 30 days?"

## Edge cases

- **Duplicate names** — require `--org` disambiguator in --add mode; slug includes org-shortcode if needed (`dana-whitfield-northcrest`)
- **Someone changed orgs** — in --add on existing slug: move current `org`/`role` to a history entry; update frontmatter; preserve the old relationship context
- **Someone who was a prospect becomes a client** — update `relationship: client-side`, retain prospect-phase history
- **Relationship downgrade** (strong → warm → cold over time from lack of touch) — skill does NOT auto-downgrade; Jason updates manually via `--add` mode when the relationship shifts
- **Bulk import from LinkedIn export** — out of scope for v1; add manually as people come up in work context
- **Someone requests to be removed** — delete the file; remove from index; log the removal in a `_removed.md` audit file (date + slug only, no content — respect the ask)
- **Confidential contacts** (e.g., board members at sensitive firms) — add a `sensitive: true` flag in frontmatter; warm-intro mode suppresses these from output unless `--include-sensitive` passed

## Related

- Downstream: [`jirah-intro-request`](../jirah-intro-request/SKILL.md) (uses people-graph to identify introducer paths), [`jirah-email`](../jirah-email/SKILL.md) `--scenario check-in` (for stale-tie touches), [`jirah-referral-ask`](../jirah-referral-ask/SKILL.md) (tracks referrers)
- Feeder: [`jirah-weekly-review`](../jirah-weekly-review/SKILL.md) Section 6 reads `--stale` output
- Context: jirah-voice.md
