---
name: jirah-testimonial-ask
description: Draft the partner-voice testimonial ask — sent 30 days post-delivery when results have started to land. Offers 3 low-friction prompts the sponsor can respond to instead of drafting from scratch. Tailored to engagement outcome (ops / project / AI). Use when /jirah-kpi-tracker shows positive movement, when Jason says "time to ask X for a testimonial," "draft testimonial ask for Y," or on the 30-day post-delivery scheduled trigger.
---

# /jirah-testimonial-ask

## Purpose

Harvest testimonials systematically, at the right moment, with the right prompts. Most clients want to give a testimonial — they just don't want to draft one from scratch. This skill removes the blank-page friction.

Sent **30 days after action register delivery** when early KPI movement has shown up but engagement energy is still fresh. Too early → nothing has changed yet. Too late → client is onto other things.

## Pre-requisites (read before drafting)

- [context/jirah-voice.md](../../../context/jirah-voice.md) — partner voice, sign-off rules, don'ts
- Engagement profile, action register, KPI tracker outputs (if any), case-study draft (if one exists)

## Inputs (ask if not supplied)

- **Engagement** — slug or path
- **Trigger** — `30-day` (default; automated trigger) | `kpi-moved` (ad hoc when KPI tracker showed meaningful movement) | `client-initiated` (client said something warm unprompted; strike while iron is hot)
- **Sponsor** — client-side owner/buyer name. Resolved from engagement profile if set; asked if absent
- **Mode** — `--draft` (default, writes email) | `--dry` (draft in chat only)

---

## Process

### 1. Ingest the context

Read:
- Engagement profile — shape, duration, what it was about
- Action register — the real constraint + critical recommendation
- KPI tracker (if exists) — first month's movement
- Any pre-existing warm signals (client's own recent emails / Slacks / thank-yous — feed via `--quote`)

Determine what's LANDED, not just what was delivered:
- Has the Critical recommendation been implemented? (yes/no/partial)
- Has a KPI moved?
- Has the client said anything warm in recent correspondence?

If nothing has landed yet (engagement just wrapped, no KPI cycle): flag and recommend waiting 2–4 more weeks.

### 2. Pick the tailored prompt set

Testimonial prompts should match engagement outcome. Don't ask an ops client about "the AI pilot."

#### Ops optimization engagement
1. "What shifted inside the firm once [critical recommendation] was in place?"
2. "What was the most unexpected thing about how Jirah worked?"
3. "If a peer asked whether Jirah was worth the investment, what would you tell them?"

#### Project execution engagement (expansion, succession, M&A integration)
1. "What did the [project — expansion / succession / integration] look like before Jirah, vs. now?"
2. "Where did Jirah earn their stay — what moved that wouldn't have moved without them?"
3. "If another owner was about to go through something similar, what would you tell them about bringing Jirah in?"

#### AI pilot engagement
1. "What does the tool do day-to-day at [firm] now that it didn't before?"
2. "What was it like watching the Plan A / Plan B decision play out in week 1?"
3. "What would you tell a peer considering an AI pilot with Jirah about what to expect?"

#### Extended Advisory / Active Retainer engagement (Step 6 ongoing)
1. "What does Jirah add to the firm week-to-week that wouldn't be there otherwise?"
2. "When has having Jirah in the room changed a decision you were about to make?"
3. "If you were recommending Jirah to a peer firm at your stage, how would you describe what we do?"

### 3. Draft the email

Structure — partner voice, joint sign-off ("Jason and Joshua"):

```
Subject: [First name] — quick ask, no urgency

[First name],

It's been about a month since we delivered [action register / pilot plan / whatever
the specific deliverable was]. [One specific sentence referencing a concrete thing
that's landed — "the governance amendment is through," "the week-1 pilot demo
shipped," "[KPI] moved from X to Y" — whichever is current and true.]

Small ask: would you be up for a short testimonial? Two or three paragraphs on what
working with us was like, or what changed at [firm]. No rush — whenever you have
a clear-headed 20 minutes.

If it helps, here are three prompts you could respond to — pick whichever one you
actually have a view on, or combine:

1. [prompt 1 from matched set]
2. [prompt 2 from matched set]
3. [prompt 3 from matched set]

Reply with a few paragraphs, a voice memo, or even three bullet points — we'll
turn it into whatever form we need. If you're fine with us quoting you by name +
title, say so. If anonymized is better, that's fine too.

Thanks for letting us in close.

Jason and Joshua
```

Variants if context calls for it:
- Single-partner engagement (only Jason or only Joshua was active) — sign single; use "I" not "we"
- Very warm existing relationship (long-term retainer client) — loosen opening slightly, still partner voice
- Client volunteered warm feedback already — lead with quoting them back to themselves: "When you wrote [X] last week, that's exactly the kind of reflection we'd love to lock in..."

### 4. Output

```
engagements/[slug]/
└── testimonial-ask-YYYY-MM-DD.md
```

OneDrive equivalent: `01 - Clients\Active\[ClientName]\02 - Comms Log.md` (append-mode) + `10 - Harvest\testimonial-ask-YYYY-MM-DD.md`

Update engagement frontmatter:
- `testimonial_asked_date: YYYY-MM-DD`
- `testimonial_status: asked`
- `nextAction: [follow-up date 14 days out if no response]`

### 5. Output to chat

```
Testimonial Ask — [Client] — [engagement shape]

Trigger: [30-day / kpi-moved / client-initiated]
Sponsor: [name]
Specific-landing reference: [the concrete thing we named in opening]
Prompt set: [matched to engagement type]

Draft at: [path]

Follow-up
- If no response in 14 days: /jirah-email --scenario follow-up --target [slug]
- When response lands: process via [reply parsing — paste into engagement's harvest folder; run /jirah-case-study --quote if strong enough for reuse]
- Pair with /jirah-referral-ask if response is warm (goodwill moment)
```

---

## Voice rules

- "No urgency" framing is load-bearing — clients read deadlines as pressure; pressure reduces response rate
- Lead with the specific thing that's landed (not generic "hope things are going well")
- Offer the prompts, don't impose them — "pick whichever you actually have a view on"
- Make the format low-friction — "reply with paragraphs, voice memo, or bullet points"
- Acknowledge the attribution choice explicitly (named / anonymous)
- Sign joint as default; single only when engagement was single-partner

## Edge cases

- **KPI tracker shows NOT-landing** (recommendations are slipping, nothing's moved) — do NOT send a testimonial ask. Flag; recommend Jason reach out to understand why implementation stalled before asking for proof.
- **Client went cold / unresponsive** in the 30 days post-delivery — do NOT send a testimonial ask into silence. Send a warm check-in via `/jirah-email --scenario check-in` first.
- **Client already volunteered a testimonial** unprompted — skip the 3-prompt menu; just confirm attribution + ask if we can turn their words into something shareable. Keep it shorter.
- **Engagement was delivered but testimonial-ineligible** (Plan A failed, client kept paying but not thrilled) — don't ask. Instead: internal "lessons harvested" conversation → potentially `/jirah-referral-ask` targeted (peers who'd know the client is honest) instead of public testimonial.
- **Multi-stakeholder engagement** (several sponsors, not just owner) — default to owner; if owner asks to also get a COO / CFO testimonial, send a separate tailored ask rather than a shared-response form
- **Client is in a regulated industry and can't give written testimonials** (law firm compliance, public-company restrictions) — offer anonymized version or verbal quote only; adjust ask accordingly

## Related

- Upstream: [`jirah-kpi-tracker`](../jirah-kpi-tracker/SKILL.md) (signals whether it's time), [`jirah-case-study`](../jirah-case-study/SKILL.md) (paired harvest)
- Adjacent: [`jirah-email`](../jirah-email/SKILL.md) (for the follow-up if no response), [`jirah-referral-ask`](../jirah-referral-ask/SKILL.md) (pair with testimonial when response is warm)
- Downstream: responses feed back into `/jirah-case-study --quote` and `/jirah-thought-leadership` quote libraries
- Context: jirah-voice.md
- Cadence trigger: 30 days post-delivery; Sprint 4 scheduler fires the reminder (not the send — Jason/Joshua review every testimonial ask before it ships)
