---
name: jirah-survey-writing
description: Design stakeholder surveys — friction-point-indexed Likert + open-ended + NPS/eNPS mix. Used pre-audit to gauge team sentiment before the owner conversation, mid-engagement for pulse checks during sprint, and post-delivery to measure shift. Caps at 15 questions to protect completion rate. Produces survey text + deployment recommendation (Typeform / Google Forms / Microsoft Forms). Use when Jason says "design the survey for X," "pulse survey for this engagement," "staff survey before the audit."
---

# /jirah-survey-writing

## Purpose

Systematic stakeholder voice capture at scale — beyond what individual interviews can reach. A well-designed survey turns 30–80 team members into diagnostic signal; without one, Jirah is limited to 6–10 interview triangulation per engagement.

Surveys are especially load-bearing in the **Falcon pattern** (32-response staff survey segmented by department, leadership 1-on-1s indexed to 9 Friction Points) — a key reason the methodology ships visibly on the page per Pattern 6 in the library.

## Pre-requisites (read before designing)

- [context/jirah-friction-points.md](../../../context/jirah-friction-points.md) — all 10 lenses with diagnostic questions (source material for Likert + open-ended items)
- [context/jirah-methodology.md](../../../context/jirah-methodology.md) — triangulation rule + anonymity framing
- [context/jirah-voice.md](../../../context/jirah-voice.md) — non-corporate survey language
- [context/jirah-pattern-library.md](../../../context/jirah-pattern-library.md) — Falcon survey pattern (32 responses segmented by department) as the exemplar

## Inputs (ask if not supplied)

- **Purpose** — one of:
  - `pre-audit` — gauge team sentiment before the audit day; surfaces hypotheses for the morning owner session
  - `mid-engagement` — sprint-day pulse; tracks what's shifting as interviews unfold
  - `post-delivery` — 90 days after action register delivered; measures what's moved
  - `pre-sprint-baseline` — snapshot before sprint starts so post-delivery shift is measurable
- **Target respondents** — one of:
  - `all-staff` — default for pre-audit + baseline
  - `leadership-only` — partners / directors only (smaller firms)
  - `department-[name]` — single department for focused probing
  - `exited-last-24mo` — former employees if reachable (exit-interview proxy)
- **Engagement / client** — slug (if pre-existing) or fresh profile
- **Friction-point focus** — optional: 3–4 FPs to weight question allocation toward (default: all 10 lightly covered)

---

## Process

### 1. Design the question set — max 15 questions

Completion rate matters more than comprehensive coverage. 15 questions is the hard ceiling; 10–12 is better.

**Structure:**

```
Opening (2 questions)
  - Tenure / role (for segmentation — not demographics beyond what matters)
  - Warm-up: "What's gone well at the firm in the last year?" (open, short — gets respondents talking)

Friction-point Likert (8–10 questions)
  - 1–2 per friction-point focus area
  - Format: "How strongly do you agree? 1 = Strongly disagree → 5 = Strongly agree"
  - Derived from `context/jirah-friction-points.md` diagnostic questions
  - Example FP #10: "When our owner/managing partner is out for two weeks, the business keeps running smoothly" (1–5)
  - Example FP #5: "Decisions at my level get made quickly without bottlenecking above me" (1–5)

Open-ended high-leverage (2 questions)
  - "If you could change one thing about how this firm operates, what would it be?"
  - "What gets in the way of doing your best work here?"

NPS (1 question)
  - "How likely are you to recommend working at [Firm] to a peer? 0–10"
  - For post-delivery use, also ask "How likely would you have been 6 months ago?" to measure shift

[Optional, post-delivery only:]
Post-delivery shift (1–2 questions)
  - "What's changed at the firm in the last 90 days that you've noticed?"
  - "Has anything we recommended made a difference you can point to?"
```

### 2. Apply friction-point coverage rules

Default question-FP mapping:
- FP #10 Ownership Impact — ALWAYS 1 question, often 2 (this is the wedge; must be in every survey)
- FP #5 Structure — 1 question on decision rights
- FP #6 Culture — 1 question on what the firm is actually like
- FP #2 Revenue Generation — 1 question on business-development ownership (if applicable to role)
- Remaining 4–5 Likert questions — allocated based on `--friction-point-focus` input or default to FP #4, FP #7, FP #8, FP #1

Role-aware: if target-respondent is `leadership-only`, shift toward FP #4 Strategy + FP #10 Ownership Impact. If `all-staff`, lean toward FP #5 Structure + FP #6 Culture + FP #10.

### 3. Confidentiality framing

Non-negotiable. Every survey opens with:

```
This survey is anonymous and confidential. Responses are aggregated; no individual
response is shared with [Firm] leadership. JIRAH Growth Partners sees the raw
responses for analysis but does not share individual answers with leadership
without explicit permission.

Takes 8–12 minutes. No wrong answers.
```

If the client asks for individual-response visibility, refuse. Anonymity is what makes the data honest.

### 4. Voice calibration

Write questions in Jirah voice per `context/jirah-voice.md`:

- Direct and specific — "When [specific scenario happens], what do you do?" not "How do you handle challenging situations?"
- No corporate HR-speak ("synergy," "alignment," "stakeholder engagement")
- Active voice, first-person / second-person
- Ask about what people *do*, not what they *feel*, where possible (behavior > attitude = higher-signal data)

### 5. Deployment recommendation

Recommend based on firm context:

- **Typeform** — best UX, best completion rate; use for pre-audit + post-delivery where impression matters
- **Google Forms** — free, clients with Google Workspace integration; fine for internal-only pulse
- **Microsoft Forms** — use when client is on M365 (Jirah's default stack); easiest for client IT to approve
- **SurveyMonkey** — only if client has existing seat; otherwise skip
- **Typed into email + return text** — low-tech, only for <10 people

Deployment recs scale to target-respondent size:
- <10 people: consider skipping survey; just interview everyone
- 10–30 people: Forms / Typeform
- 30–100 people: Typeform strongly recommended for completion rate
- 100+ people: Typeform + segmentation by department

### 6. Output

```markdown
---
engagement: [slug]
purpose: pre-audit | mid-engagement | post-delivery | pre-sprint-baseline
target_respondents: all-staff | leadership-only | department-X | exited
friction_point_focus: [list]
target_completion_minutes: 8-12
designed_date: YYYY-MM-DD
---

# Survey — [Client] — [Purpose]

## Framing (shown to respondents)

[Confidentiality framing from step 3]

## Questions

### 1. Tenure + role
[Multiple choice: tenure band; free-text: role]

### 2. Warm-up (open, short)
What's gone well at the firm in the last year?

### 3. [FP #N Likert question]
[Question text]
☐ 1 Strongly disagree
☐ 2 Disagree
☐ 3 Neutral
☐ 4 Agree
☐ 5 Strongly agree

...

### N (second-to-last). Open-ended
[Prompt]

### N (last). NPS
How likely are you to recommend working at [Firm] to a peer?
☐ 0 ... ☐ 10

## Deployment recommendation
- Tool: [Typeform / Google Forms / MS Forms]
- Distribution: [how owner sends it — email template below]
- Timeline: open for 10 days; send reminder at day 5

## Email template (for owner to send)
Subject: Quick survey — [Firm]'s next phase

[Team],

We're working with JIRAH Growth Partners on [short scope description]. Part of
that work is hearing from each of you about what you see. The survey below is
anonymous — JIRAH sees aggregated results only.

It takes 8–12 minutes. Open for 10 days. Honest answers are the whole point.

[Link]

Thanks,
[Owner]

## Analysis plan (for /jirah-sprint-facilitation pre-sprint work)
- Segment Likert responses by role + tenure
- Find divergence: where does response distribution split (e.g., partners say 4/5, ICs say 2/5 on same question)?
- Open-ended responses: tag by friction point; cluster themes
- NPS: current score + segments
- Feeds triangulation plan — every divergent response is a hypothesis worth validating
```

Output path: `engagements/[slug]/06-sprint/survey/survey-design-YYYY-MM-DD.md`

OneDrive equivalent: `01 - Clients\Active\[ClientName]\06 - Sprint & Facilitation\`

### 7. Output to chat

```
Survey Design — [Client] — [purpose]

Question count: [N] (cap: 15)
Target respondents: [target]
Friction-point coverage: [list with counts]
Deployment: [recommended tool]
Est. completion: [8–12 min]

Output: [path]

Next steps
- Review + finalize with Joshua (methodology voice calibration)
- Send to client owner for approval before deployment
- Once responses land, feed results into /jirah-sprint-facilitation --analyze
- Post-delivery version: run 90 days after action register to measure shift
```

---

## Voice rules

- Every Likert question asks about behavior or observable pattern, not feelings
- Every open-ended question has a specific anchor ("one thing," "what gets in the way," not "tell us about the firm")
- Never use "synergy," "alignment," "engagement," "empowerment" in question text
- Confidentiality framing stated once at top + reinforced in the owner-send email; don't repeat it mid-survey
- Minimum viable survey beats maximally comprehensive survey — completion rate is king

## Edge cases

- **Firm is <10 people** — recommend skipping survey; do direct interviews via `/jirah-team-interview`
- **Client insists on individual-response visibility** — refuse; offer to restructure as non-anonymous "open conversation" format instead (but flag that signal quality drops)
- **Gen Z retention is the focus** (S+A pattern from library) — add 2 questions specifically on: "Do you see a growth path for yourself at the firm in 3 years?" + "When peers leave the firm, what do they tell you about why?"
- **Pre-audit + post-delivery use same survey** — lock the 8–10 core Likert questions so shift measurement works; vary only the open-ended and post-delivery-specific items
- **Client's own HR has run a recent survey** — read those results first (via `/jirah-document-review`); design THIS survey to fill gaps, not repeat questions
- **Regulated industry with specific compliance** (professional services, healthcare) — add HR-counsel review step before deployment; don't deploy without client's legal sign-off
- **Client wants to add their own questions** — accept 1–2 additions; resist adding more (completion rate); insist on keeping our core diagnostic intact
- **Multiple departments with very different experiences** — design a single core + 2–3 department-specific questions per segment; keep total at 15

## Related

- Upstream: [`jirah-friction-audit`](../jirah-friction-audit/SKILL.md) pre-audit preparation, [`jirah-kickoff-agenda`](../jirah-kickoff-agenda/SKILL.md) (mention survey in data asks)
- Analysis: [`jirah-sprint-facilitation`](../jirah-sprint-facilitation/SKILL.md) `--analyze` or direct data review
- Pairs with: [`jirah-team-interview`](../jirah-team-interview/SKILL.md) (survey = breadth; interviews = depth; triangulation needs both)
- Context: jirah-friction-points.md, jirah-methodology.md, jirah-voice.md, jirah-pattern-library.md (Falcon survey exemplar)
