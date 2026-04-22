---
name: jirah-email
description: Draft partner-voice emails — cold outreach, follow-up, proposal send, check-in, warm nurture, introduction forward. Signs "Jason and Joshua" for joint sends, first-name only for single-partner sends. Pulls prospect/client context from their .md file. Use when Jason or Joshua says "draft an email to X," "follow up with Y," "send proposal to Z," "check in on the Ironwood thread," or any ad-hoc email writing that isn't covered by a more specific skill (intro cold emails live in /jirah-lead-gen; triage accept/decline emails live in /jirah-audit-triage).
---

# /jirah-email

## Purpose

The general-purpose email-drafting skill. Catch-all for emails that don't fit one of the specialized skills. Produces drafts in Jirah's voice — direct, factual, specific, no marketing fluff — ready to copy-paste into Outlook.

Once Outlook MCP is wired (Sprint 2), gains a `--send` flag that ships the draft directly.

## Pre-requisites

- [context/jirah-voice.md](../../../context/jirah-voice.md) — voice rules, sign-off conventions, don'ts
- Target's `.md` file (prospect / audit applicant / active-client) — context on stage, prior activity, commitments made

## Inputs (ask if not supplied)

- **Recipient** — name + role + firm. Resolve to a prospect/client file if one exists.
- **Scenario** — one of:
  - `follow-up` — no response yet, chasing prior email
  - `proposal-send` — accompanying a Discussion Document / Pilot Plan / engagement proposal
  - `check-in` — warm relationship maintenance, no active thread
  - `warm-nurture` — surfacing a content piece, case study, or pattern insight to a cooled prospect
  - `intro-forward` — draft for an introducer to forward verbatim (see also `jirah-intro-request` once built)
  - `post-lunch` — Funnel 1 lunch debrief + next-step ask
  - `post-audit` — day-after thank you + findings-drop framing
  - `general` — freeform, describe the situation
- **Sender** — `joint` (Jason + Joshua, default for business dev / proposals) | `jason` | `joshua`
- **Desired outcome** — what do we want the reader to do? (book call / reply yes/no / forward / read and sit with it)
- **Save mode** — `--save` writes to `drafts/` folder; default prints to chat only

---

## Process

### 1. Resolve context

Find the recipient's `.md` file:
- Prospect: `prospects/*.md` (match by name, role, firm)
- Audit applicant: `audit-applications/*.md`
- Active client: OneDrive `01 - Clients\Active\[ClientName]\00 - Profile.md`
- Introducer / alumni: `people-graph/*.md` (once built)

Read the file. Extract:
- Stage / status
- Last contact + what was said
- Commitments made (ours and theirs)
- Relationship notes (how we met, prior interactions)
- Known preferences (in-person vs phone, directness level, etc.)

If no file exists, ask Jason for the context directly — do not draft blind.

### 2. Apply scenario template

Each scenario has a structural skeleton. Claude fills it with target-specific content, not template boilerplate.

#### follow-up
```
Subject: RE: [prior subject] — quick nudge
Body: 2–4 sentences.
- Line 1: surface specific prior thread ("last week you mentioned X")
- Line 2: the ask, re-stated, low-friction
- Line 3: give them an out ("happy to park this if timing is wrong")
```

#### proposal-send
```
Subject: [Firm name] — Discussion Document / Pilot Plan attached
Body: 3–5 sentences.
- Line 1: name the doc and what's in it (1 sentence)
- Line 2: name the decision it's asking them to make
- Line 3: name the two next-step options (usually "call this week" + "take it away and sit with it")
- Line 4: closing low-key — "happy to walk it through with you if that helps"
```

#### check-in
```
Subject: Quick hello from Jirah
Body: 3–4 sentences.
- Line 1: specific reference to last time we spoke ("At lunch in February you mentioned the Calgary expansion — how's that playing out?")
- Line 2: optional — relevant insight or content piece to share ("We published something on the multi-office friction pattern — [link]")
- Line 3: no hard ask. Offer 30 minutes if useful.
```

#### warm-nurture
```
Subject: Thought of you when this came up
Body: 3–5 sentences.
- Line 1: a specific trigger (a case study, a pattern, a news item about their firm or industry)
- Line 2: the connection to them, 1 sentence
- Line 3: no ask, or a very soft "if worth a 20-min conversation, let me know"
```

#### intro-forward
```
Subject: [Introducer decides]
Body: pre-written paragraph the introducer can forward as-is.
- Written in 3rd person to the target, with a line of context from the introducer at the top.
- 4–6 sentences.
- Includes the Jirah wedge in one sentence, a specific reason we're asking about *this* target, and a low-friction ask.
```

#### post-lunch
```
Subject: Good to sit down today
Body: 4–6 sentences.
- Line 1: single specific moment from the lunch ("The bit about the 9-partner vote gave me a clear picture of where the friction lives.")
- Line 2: our read in one sentence ("Based on what you described, the shape that fits is a Friction Audit — $1.5k, one full day — before anything bigger.")
- Line 3: the concrete next step + booking link / date options
- Line 4: the usual partner send-off
```

#### post-audit
```
Subject: Findings draft — [Firm] — [date]
Body: 3–5 sentences.
- Line 1: doc attached, what it is ("Action register + 3 expansion paths — the deliverable from Thursday's day on-site.")
- Line 2: the single most important line from the findings ("Short version: the constraint is FP #10, not what we opened with.")
- Line 3: the next step ("Two 1-hour kickoff meetings — earliest slots [dates].")
- Line 4: low-key close.
```

#### general
Claude drafts per voice rules using the supplied situation. Ask follow-up questions only if the situation is too vague to write directionally.

### 3. Draft 1–3 variants if Jason asks for options

Default: one draft. If `--variants 3` or Jason says "give me options," produce 3 variants differing on tone (more direct / more warm / more brief) — never on facts. Every variant passes voice-rule checklist.

### 4. Voice checklist (Claude self-checks before outputting)

- [ ] Direct — no hedging, no "just wanted to" softeners
- [ ] Specific — at least one concrete reference (name / number / event / prior thread)
- [ ] Numbers > adjectives — any adjective candidate gets replaced by a number if one exists
- [ ] No em-dashes unless they serve a real purpose
- [ ] No corporate-speak ("leverage," "synergies," "paradigm," "best-in-class")
- [ ] No generic industry flattery
- [ ] Sign-off matches sender: joint → "Jason and Joshua"; single → first name only
- [ ] Subject line is specific, not "Quick question" or "Touching base"
- [ ] Clear ask — the reader knows what to do next, or knows explicitly there's no ask

### 5. Output

Default: print draft(s) in chat, ready to copy-paste.
`--save`: write to one of:
- Prospect: `prospects/drafts/[slug]-[scenario]-YYYY-MM-DD.md`
- Audit applicant: `audit-applications/drafts/[id]-[scenario]-YYYY-MM-DD.md`
- Client: OneDrive `01 - Clients\Active\[ClientName]\02 - Comms Log.md` append-mode

After save, update the target's `## Activity log` (or Comms Log) with a one-line entry noting the draft + scenario.

---

## Edge cases

- **Recipient not yet in any .md file** — ask Jason for context, don't invent a relationship history.
- **Prior thread has commitments we haven't met** ("I'll send the pattern-library piece by Friday" — Friday has passed) — surface the slip and acknowledge it in the opening line before asking for anything.
- **Joint send but Joshua is on vacation / out** — switch to Jason-only sign-off with Jason's explicit confirmation.
- **Sensitive topic** (price objection, scope dispute, partner disagreement) — flag as `--review-before-send`, recommend Jason or Joshua read before anything goes out; do not save to drafts folder without the flag.
- **Recipient is a closed-lost or declined-audit contact** — flag in chat; re-confirm scenario makes sense (warm-nurture only; never cold intro again).

## Related

- More specific skills — use these instead of this one when they apply:
  - `jirah-lead-gen` — first-time intro outreach to a new cold prospect
  - `jirah-audit-triage` — accept / shortlist / decline emails to audit applicants
  - `jirah-intro-request` (Sprint 4) — warm-intro asks to introducers
  - `jirah-testimonial-ask` (Sprint 4) — post-engagement testimonial ask
  - `jirah-referral-ask` (Sprint 4) — post-win referral ask
- Context: jirah-voice.md
- Future MCP: Outlook Mail (Sprint 2) — `--send` flag ships directly to Outlook drafts or sends outright
