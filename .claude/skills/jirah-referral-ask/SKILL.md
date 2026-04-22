---
name: jirah-referral-ask
description: Draft the partner-voice referral ask at a win moment — contract signed, testimonial collected, case study published, or any spontaneous thank-you note from a client. Low-friction, specific ask ("know any other owner-led engineering firms your size?"), offers to draft the forwardable intro so the referrer does zero work. Owner-run firms refer owner-run firms. Use when Jason says "draft referral ask for X," "time to ask Y for intros," or triggered by an upstream harvest moment (/jirah-testimonial-ask response, /jirah-case-study publication).
---

# /jirah-referral-ask

## Purpose

Make referral asks a **systematic part** of Jirah's growth loop — not an awkward afterthought months after engagements close. Owner-run B2B firms refer other owner-run B2B firms; Jirah needs the mechanism to ask at the right moment with zero friction for the referrer.

## Pre-requisites (read before drafting)

- [context/jirah-voice.md](../../../context/jirah-voice.md) — partner voice, sign-off rules, opt-out friendliness
- [context/jirah-icp-wedge.md](../../../context/jirah-icp-wedge.md) — ICP shape; the ask has to name the ICP so the referrer knows who to think of
- Client profile + the trigger moment context

## Inputs (ask if not supplied)

- **Client / referrer** — slug or path
- **Trigger moment** — one of:
  - `contract-signed` — client just re-upped or expanded scope (goodwill + commitment)
  - `testimonial-collected` — they just said something kind (momentum)
  - `case-study-published` — advocacy moment (their story is now out in the world)
  - `spontaneous-thanks` — ad-hoc thank-you note from the client (strike while iron is hot)
  - `kpi-milestone` — quantified win confirmed (e.g., retention lift hit target)
- **Target ICP override** (optional) — if Jirah is actively recruiting a specific vertical, name it (e.g., "engineering firms in Alberta" rather than the default ICP)

---

## Process

### 1. Ingest context

Read:
- Client profile (relationship depth, tenure, referral history, known network)
- The trigger artifact (signed contract, testimonial response, published case study, or the thank-you email)
- People-graph entries associated with the client (do they have known peer firms we've already discussed?)

### 2. Calibrate the ask specificity

The single biggest failure mode of referral asks: **being too broad.**

- ❌ "Know anyone who'd benefit from working with Jirah?"
- ✅ "Know any other owner-led engineering firms between 30 and 100 staff that are hitting the kind of growth ceiling we worked through together?"

Build the specific ICP descriptor from:
- Engagement industry (engineering / building systems / professional services / accounting / other)
- Size band matching Jirah's ICP (30–150 staff, $6–20M rev, owner-run)
- Real-constraint shape (FP #10 ownership, multi-office, succession, missing-middle, etc.)
- Geographic preference if relevant (Kelowna vs out-of-market per `context/jirah-icp-wedge.md` funnel routing)

The ask names two to three of these dimensions — specific enough to trigger a "yes, actually..." response.

### 3. Pick the matched trigger-specific opener

Different trigger moments → different openers. The opener references the specific moment so the ask doesn't feel out-of-the-blue.

#### contract-signed

```
[First name],

Great to have the renewal locked in. Next 12 months feel like they have a clear shape.

Small ask — while we're riding the momentum of this decision: ...
```

#### testimonial-collected

```
[First name],

Thank you for what you wrote about working together. The line about [specific
line from their testimonial] is the kind of reflection most consultants don't
get — we'll treasure it.

One ask off the back of that: ...
```

#### case-study-published

```
[First name],

The case study is live — link: [url]. Genuinely glad you let us tell the story.

A small ask now that it's out in the world: ...
```

#### spontaneous-thanks

```
[First name],

Your note today means more than you probably realize. Thank you.

If you're open to it, one small ask while the moment is fresh: ...
```

#### kpi-milestone

```
[First name],

Saw the latest numbers — [specific metric, e.g., "retention in the engineering
team hit the target we set at the sprint"]. That's the kind of movement we
work for.

A small ask off that momentum: ...
```

### 4. Draft the ask itself

Partner voice per `context/jirah-voice.md`. Structure of the ask paragraph:

```
Small ask: do you know any other [SPECIFIC ICP DESCRIPTOR] that are hitting
[SPECIFIC CONSTRAINT PATTERN, usually the one this client faced]?

Not looking for a wide net — just a name or two where you think a
15-minute conversation might be useful, either for them or for us to learn
from them. If it helps, I'm happy to draft the intro email you can forward —
takes you zero effort.

If nothing comes to mind, that's a perfectly fine answer too.

Jason and Joshua
```

### 5. Opt-out friendliness

Every referral ask ends with an explicit opt-out line — not a guilt hook, just clean permission to say no:

- "If nothing comes to mind, that's a perfectly fine answer too."
- "No obligation — I know this is one more thing on your plate."
- "If this lands at a busy moment, just ignore it. We're not tracking."

Referrers who feel pressured refer less over time. Referrers who feel respected refer more.

### 6. Offer the forwardable intro draft

Explicit "I'll draft the intro email you can forward verbatim" — this is what turns intent into action. When the referrer names a target, chain into [`/jirah-intro-request`](../jirah-intro-request/SKILL.md) with the target name.

### 7. Output

```
clients/[slug]/harvest/referral-ask-YYYY-MM-DD.md
```

OneDrive equivalent: `01 - Clients\Active\[ClientName]\10 - Harvest\referral-ask-YYYY-MM-DD.md`

Update client frontmatter:
- `referral_asked_date: YYYY-MM-DD`
- `referral_trigger: [trigger moment]`
- `referral_status: asked`
- Append to activity log: "Referral ask sent off [trigger moment]. Specific ICP: [descriptor]"

### 8. Output to chat

```
Referral Ask — [Client] — [trigger moment]

ICP descriptor in ask: "[verbatim descriptor]"
Opt-out clause: ✓
Forwardable-intro offer: ✓
Sign-off: [joint / single]

Draft at: [path]

Follow-up
- If referrer names a target: /jirah-intro-request --introducer [client slug] --target [name]
- If no response in 21 days: /jirah-email --scenario check-in (light, no re-ask)
- Update people-graph: track which clients have been asked + when (pacing — don't ask same client twice in 6 months)
```

---

## Voice rules

- Lead with the specific trigger moment (contract / testimonial / case study / thanks / KPI) — never generic
- ICP descriptor in the ask must be specific ("owner-led engineering firms 30–100 staff hitting growth-ceiling") — never "anyone who'd benefit"
- Offer the forwardable intro explicitly — zero-work path for the referrer
- Opt-out line at the close, unambiguous
- Partner voice — direct, factual, no corporate softeners ("We'd be so grateful if...")
- Numbers when relevant (size band) beats adjectives

## Edge cases

- **Client already referred recently** (within 6 months) — do NOT ask again. Flag to Jason that pacing has elapsed; if they still want to ask, calibrate it as a "quick update" rather than a fresh ask.
- **Client is in a market segment Jirah isn't actively recruiting** (e.g., Hatch light-coaching retainer, not a core-ICP engineering firm) — still ask but calibrate ICP descriptor to their network's shape; a non-core client may still know core-fit peers via their own network
- **Client declined prior ask** ("nothing comes to mind") — don't re-ask on the next trigger; wait for a stronger trigger (case study publication, not just a thank-you) and loosen the ask to "just let me know if someone surfaces"
- **Trigger moment was artificial** (client didn't actually say thanks; Jirah invented the trigger) — do NOT ask; wait for a real trigger
- **Client is a referrer themselves** (they've already referred Jirah multiple times) — shift ask language to "You've been generous already — completely optional, but if the right name comes to mind, you know our ICP by now"
- **Client is mid-engagement + engagement is struggling** — do NOT ask for referrals while delivery energy is shaky; wait until things are back in the green
- **Testimonial response was mild** ("it was fine, here's a paragraph") — don't pair referral ask with that; muted response is a signal, don't compound
- **Contract signed moment was contentious** (client pushed hard on scope or price and you closed anyway) — delay the referral ask to the testimonial / case study moment; goodwill isn't there yet

## Related

- Upstream triggers: [`jirah-testimonial-ask`](../jirah-testimonial-ask/SKILL.md), [`jirah-case-study`](../jirah-case-study/SKILL.md), [`jirah-kpi-tracker`](../jirah-kpi-tracker/SKILL.md)
- Downstream: [`jirah-intro-request`](../jirah-intro-request/SKILL.md) (when referrer names a target), [`jirah-people-graph`](../jirah-people-graph/SKILL.md) (updates relationship network with new contact)
- Adjacent: [`jirah-email`](../jirah-email/SKILL.md) (for the follow-up, if needed)
- Context: jirah-voice.md, jirah-icp-wedge.md
- Cadence: event-driven, not scheduled — tied to specific win moments
