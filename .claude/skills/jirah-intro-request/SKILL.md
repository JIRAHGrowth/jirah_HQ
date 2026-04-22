---
name: jirah-intro-request
description: Draft the 2-email warm-intro package — Email A (short request to the introducer) + Email B (the forwardable intro written as if the introducer wrote it). Makes the introducer's job zero-effort. Uses people-graph for introducer profile + prospect/target research for the reason-to-meet. Use when a target prospect is identified and an introducer exists in the people graph, or when Jason says "draft the intro ask for [introducer] to introduce me to [target]," "intro request from Dana to Northcrest," or when /jirah-referral-ask response names a specific target.
---

# /jirah-intro-request

## Purpose

Make the introducer's job **zero-effort**. If they have to draft a new email to help Jirah, most of the time they won't. This skill produces the two-email package that removes that friction:

- **Email A (to introducer):** short ask, context, attached Email B
- **Email B (forwardable):** written as if the introducer wrote it — 2 paragraphs on who Jirah is, why this specific target is relevant, low-friction ask

The introducer forwards Email B verbatim (or lightly edited). The target lands in their inbox with a clean, personal-sounding intro — not a templated cold email.

## Pre-requisites (read before drafting)

- [context/jirah-voice.md](../../../context/jirah-voice.md) — partner voice + introducer-voice calibration
- [context/jirah-icp-wedge.md](../../../context/jirah-icp-wedge.md) — wedge, funnel routing (the forwardable email sets up the right funnel)
- [context/jirah-firm.md](../../../context/jirah-firm.md) — firm identity in 2–3 sentences (for Email B Jirah-context paragraph)
- Target prospect profile (`prospects/[slug]/` if exists; otherwise ad-hoc research first via `/jirah-lead-gen`)
- Introducer profile (`people/[slug].md`)

## Inputs (ask if not supplied)

- **Introducer** — slug from the people graph, or name (skill resolves slug)
- **Target** — prospect slug, or "[Name] at [Firm]"
- **Context** — (optional) why this intro is worth asking for now. Defaults to a strong observation from target's public signal
- **Send mode** — `--draft` (default, writes both emails) | `--dry` (chat-only)

---

## Process

### 1. Load introducer + target

Read:
- Introducer's people-graph file (`people/[slug].md`) — their relationship, last touch, strength, mutual-interest tags, prior intro history
- Target's prospect file (if exists) — industry, size, known contact, stage
- If target isn't in prospects yet — chain into `/jirah-lead-gen` briefly for research brief before drafting

### 2. Calibrate introducer-voice

Email B is written **as if the introducer wrote it** — so Claude must calibrate to:
- How formal is the introducer? (Check their people-graph `context` section for tone signals)
- What does the introducer know about Jirah? (So the Jirah-context paragraph rings true, not over-pitched)
- What's the introducer's relationship to the target? (Colleague, peer, advisor, board member, ex-employer — changes voice)

If the introducer-voice is genuinely uncertain, include a `--needs-editing` flag in chat output recommending Jason send Email B to introducer with "feel free to edit this to sound like you."

### 3. Draft Email A — to the introducer

Short. Partner voice. Respectful of their time.

```
Subject: [First name of introducer] — quick intro ask

[First name],

Hope the [specific thing last discussed from people-graph history, or simple
"start of May"] is treating you well.

Small ask: would you be open to introducing us to [Target name] at [Target firm]?
[One sentence on why now — usually a specific public signal: "They just announced
the Vancouver office, which is the exact multi-office pattern we work through."]

I've drafted the intro below — if you're comfortable, copy/paste or forward
directly. Edit to sound like you. Or if it feels off, just tell me and we'll
sort a different way in.

No urgency; only if it's easy.

[Email B attached below]

---

Jason [+ Joshua if joint]
```

### 4. Draft Email B — the forwardable intro

2-paragraph structure, introducer-voice, written from introducer → target.

```
Subject: [Target first name] — quick intro to Jirah

[Target first name],

Quick one: [1-line relationship anchor — "Jason and Joshua from Jirah Growth
Partners reached out; Jirah's the crew I mentioned working with on
[constraint] last year" — or appropriate variant based on introducer's actual
relationship to target]. Thought it was worth putting the two of you in touch.

[Target firm + specific observation — public signal that makes this relevant
*right now*, plus the wedge without pitching it: "You've been scaling fast out
of [location]; Jirah works with owner-led firms at that exact stage —
particularly the structural / governance work that tends to come up around
80–120 staff."]

Jason and Joshua are copied. Happy to let you take it from there.

[Introducer first name]
```

### 5. Apply the funnel routing

Per `context/jirah-icp-wedge.md`:
- **Funnel 1 (Kelowna / 4-hr drive):** Email B's close points to lunch, not an apply-form. Rephrase the ask to "Jason and Joshua are in [town] on [dates]; if there's interest, an hour over lunch is how they usually start."
- **Funnel 2 (out-of-market):** Email B's close points to the Friction Audit application or a phone call. "Jason and Joshua's typical first move is a short call or a paid Friction Audit day."

### 6. Voice checklist (Claude self-rejects if any fail)

Email A:
- [ ] Specific reference to introducer's last interaction (not generic opener)
- [ ] One-sentence "why this target, why now" — public signal grounded
- [ ] Email B attached with "edit to sound like you" permission
- [ ] Opt-out friendly close ("only if it's easy")

Email B:
- [ ] Sounds like the introducer wrote it, not Jirah
- [ ] References introducer's actual relationship to target (colleague, peer, etc.)
- [ ] Specific observation about target firm (not generic "they're doing interesting work")
- [ ] Wedge implied without being pitched ("works with owner-led firms at that stage")
- [ ] Target-friendly length (under 100 words in the forwardable body)
- [ ] No Jirah corporate-speak; introducer wouldn't use it

### 7. Output

```
people/[introducer-slug]/intro-requests/
└── [target-slug]-YYYY-MM-DD.md
```

(Both Email A and Email B in the same file, clearly labeled.)

OneDrive equivalent: `02 - Sales & Pipeline\Prospects\[Target Name]\intro-request-YYYY-MM-DD.md`

Also update:
- Introducer's people-graph file: append history entry "YYYY-MM-DD — Drafted intro request for [target]. Sent: pending Jason send-off."
- Target's prospect file (if exists, else create from template): set `source: Warm intro via [introducer name]`, `stage: warm`, append activity log entry.

### 8. Output to chat

```
Intro Request — [Introducer] → [Target]

Email A (to introducer): ready — [length: ~N words]
Email B (forwardable): ready — [introducer-voice calibration: confident / needs Jason review]
Funnel routing: [Funnel 1 lunch / Funnel 2 audit-apply]

Files: [path]

Next steps
- Internal review (5 min) — especially Email B voice calibration
- Send Email A to introducer
- When introducer forwards Email B: update prospect stage to `meeting-booked` or `proposal-sent` as appropriate
- People-graph updated: introducer history + target source
```

---

## Voice rules

- **Email A** is Jason/Joshua partner voice — direct, respectful, opt-out friendly
- **Email B** is introducer voice — calibrate per introducer's known tone; never pitch-y
- The forwardable must sound personal to the target — generic "hoping to explore synergies" kills the intro
- Public signal anchoring on the target — not a cold cold opener
- Funnel routing correct per geo — wrong funnel wastes the intro

## Edge cases

- **Introducer has never met target** (zero direct history) — Email B shifts to "I don't know [target] personally, but I know [mutual connection / reputational proxy], and this seemed worth a forward"; honesty beats pretense
- **Target is already a declined-audit or closed-lost contact** — do NOT send an intro request into that history. Flag. Recommend different target or different approach
- **Introducer has asked not to be asked for intros** (flagged in their people-graph) — skill rejects; surfaces the flag; asks Jason if this one overrides
- **Introducer-target relationship is strained** (people-graph notes conflict or distance) — flag; recommend choosing a different introducer
- **Target firm was the introducer's prior employer** (they left on bad terms) — flag; introducer's voice on Email B may not be effective; recommend different route
- **No mutual hook exists** (introducer and target don't share obvious overlap) — draft anyway with a thinner relationship anchor in Email B; flag as "weak intro — may land flat"
- **Request is urgent** (prospect is actively evaluating another consultant) — compress Email A to 3 sentences; still keep Email B warm and personal
- **Introducer is themselves a former client** — Email B gets an authentic "I worked with Jirah on [specific engagement, anonymized if needed]" line — more persuasive than abstract intro

## Related

- Upstream: [`jirah-people-graph`](../jirah-people-graph/SKILL.md) (source for introducer profile), [`jirah-referral-ask`](../jirah-referral-ask/SKILL.md) (when a referrer names a target), [`jirah-lead-gen`](../jirah-lead-gen/SKILL.md) (if target needs research first)
- Adjacent: [`jirah-email`](../jirah-email/SKILL.md) `--scenario intro-forward` (similar pattern — this skill is the specialized version when people-graph + target research both apply)
- Downstream: target's prospect file gets updated; follow-up cadence handled by normal pipeline flows
- Context: jirah-voice.md, jirah-icp-wedge.md, jirah-firm.md
