---
name: jirah-audit-triage
description: ICP-score incoming Friction Audit applications, rank them, draft partner-voice accept / shortlist / decline emails, update application status frontmatter. Invoke on Monday triage cadence, when new applications land in the inbox, or when Jason asks "work the audit queue."
---

# /jirah-audit-triage

## Purpose

Process the `audit-applications/` inbox. For each pending application:
1. Score against the ICP rubric (from `jirah-audit-apply`)
2. Tier into green / amber / red
3. Draft the corresponding partner-voice email
4. Update status frontmatter on the applicant `.md`

Green = accept to paid audit. Amber = shortlist for 15-min call. Red = warm decline.

## Pre-requisites (read before scoring)

- [context/jirah-icp-wedge.md](../../../context/jirah-icp-wedge.md) — ICP bands, wedge, Funnel 2 shape
- [context/jirah-voice.md](../../../context/jirah-voice.md) — email voice, sign-off rules, don'ts
- [.claude/skills/jirah-audit-apply/SKILL.md](../jirah-audit-apply/SKILL.md) — scoring rubric source
- `audit-apply/scoring-rubric.md` if produced — the canonical rubric file

## Inputs (ask if not supplied)

- **Scope** — `--scope pending` (default, all `status: pending`) | `--scope new` (submitted in last 7 days) | `--scope id:a7` (single applicant)
- **Draft only?** — `--draft` (default: draft emails and mutate frontmatter) | `--dry` (score + summary only, no file writes)

---

## Where applications live

`[ONEDRIVE_ROOT]\02 - Sales & Pipeline\Audit Applications\[ApplicantName]\` — the application form is one of the files in the applicant's folder.

Resolve `[ONEDRIVE_ROOT]` from `dashboard/.env.local` (same mechanism the dashboard uses — see `dashboard/lib/onedrive.ts`). If unset, stop and ask the user to configure it.

---

## Process

### 1. Gather pending applications

Glob `audit-applications/*.md` (exclude `_template.md` + `drafts/*`). Filter on `status: pending` unless `--scope id:...` specifies one.

For each applicant, read the full file — frontmatter + "Why they applied" body text (this is the owner-hypothesis signal for wedge-fit scoring).

### 2. Score each applicant

Apply the rubric from [jirah-audit-apply](../jirah-audit-apply/SKILL.md):

| Dimension | Max | Source |
|---|---|---|
| Revenue | 25 | `revenue:` frontmatter |
| Staff | 15 | `staff:` frontmatter |
| Industry fit | 20 | `company:` line (parses industry) |
| Wedge fit | 25 | "Why they applied" body + FP #10 probe answer if present |
| Owner-run | 15 | `role:` frontmatter |

Write the score to `icp:` in frontmatter (overwrite any prior value). Record the 5 dimension sub-scores in a `## Triage scoring` section inside the applicant file — so future re-scoring is auditable.

### 3. Tier and route

| Score | Tier | Action |
|---|---|---|
| 70–100 | Green | Accept — draft paid-audit invitation email |
| 40–69 | Amber | Shortlist — draft 15-min strategic call email |
| <40 | Red | Decline — draft warm decline email with referral or content offer |

**Override rules** (Claude must apply automatically):
- Non-owner role (Q2 = staff / director / EA) → cap tier at Amber regardless of score
- Applicant applied on behalf of someone else → cap at Amber, flag in chat summary
- Revenue under $4M AND staff under 25 → auto-Red (too small for current offer)
- AI-build signal in "why they applied" body + revenue >$20M → tag `ai-build-candidate: true` in frontmatter even if overall tier is Red for the standard offer

### 4. Draft email — per tier

All emails follow `context/jirah-voice.md`. Direct, specific, no corporate fluff. Sign **"Jason and Joshua"** (joint sends from the partnership).

#### Green — accept template

```
Subject: Your Friction Audit — invitation to book

[First name],

Your application reads clearly. [One specific line referencing what they named as the constraint — e.g., "A 72-person firm trying to scale past the managing partner is exactly the pattern we work with."]

Next step: book the paid audit — $1,500, one full day, a few pages and an action register at the end.

Booking link: [calendar URL]

A few practical notes before the day:
- We'll ask to interview 2–3 people on your team (not just you)
- We'll ask for a 3-year financial snapshot and an org chart in advance
- The findings are short on purpose — prioritized actions, three paths forward, no 60-page deck

If the dates don't work or you want to talk first, reply and we'll sort it.

Jason and Joshua
```

#### Amber — shortlist template

```
Subject: Friction Audit application — let's talk first

[First name],

Your application is close to our typical shape but there are a couple of things worth pressure-testing before we commit either side to the full day.

[1–2 specific points — e.g., "Your revenue sits just under where we usually get the most value out of the audit." or "You named X as the constraint — we'd want to understand the shape before we'd pitch you a paid diagnostic."]

Can we do 15 minutes on the phone this week? No slide deck, no pitch. Just a conversation to figure out whether the audit is the right first move for your firm.

Booking link: [short-call calendar URL]

Jason and Joshua
```

#### Red — warm decline template

```
Subject: Friction Audit application — not the right fit for us today

[First name],

Thanks for applying. Being direct: we're not the right fit for your firm right now.

[One specific reason — size, vertical, stage — chosen from the low-scoring dimensions. Don't list all five. Pick the one that's most actionable feedback.]

Where we could still be useful:
- [If industry/vertical was the issue] Our LinkedIn feed carries the same pattern work — worth following if operational ceilings start showing up.
- [If size was the issue] When you're through $6M / 30 staff, the offer lands better. Worth re-applying at that point.
- [If one surfaced, optional] Here's someone who works with firms at your stage: [referral if a fit exists in the people graph; omit otherwise]

No hard feelings either way. Good luck with what you're building.

Jason and Joshua
```

Replace bracketed sections with applicant-specific detail — no template-feel output.

### 5. Write drafts + update frontmatter

- Drafts → `audit-applications/drafts/[id]-YYYY-MM-DD.md` (markdown body only, ready to paste into Outlook — once Outlook MCP is wired, gains a `--send` flag)
- Update applicant `.md` frontmatter:
  - `icp: <new score>`
  - `status: accepted` | `shortlist` | `declined`
  - `triaged: YYYY-MM-DD` (new field)
  - `triaged_by: JL` (or JM if Joshua invokes)
- Preserve "Why they applied" body; append "## Triage scoring" and "## Triage notes" sections.

### 6. Output to chat

One summary block:

```
Triaged N applications — X green / Y amber / Z red

Green (accept)
- [name] (score) — [one-line why accepted]
...

Amber (shortlist)
- [name] (score) — [one-line why shortlisted]
...

Red (decline)
- [name] (score) — [one-line why declined]
...

Flags
- [any override that fired — non-owner, outsized ai-build candidate, behalf-of applicant]

Drafts written to audit-applications/drafts/
Frontmatter updated on N files
```

If `--dry`, skip the frontmatter mutation + draft writes; print the summary only.

---

## Edge cases

- **No `revenue:` or `staff:` in frontmatter** — score the dimension as 0 and flag in chat summary ("Applicant file missing revenue field — human review required").
- **Ambiguous industry** (company name doesn't reveal vertical) — score industry-fit using the "Why they applied" text; if still unclear, default to "other B2B" (8 points).
- **Duplicate application** — same applicant applying twice — treat newer submission as canonical; archive older by appending `_superseded` to filename.
- **Applicant explicitly asks to skip the audit and go straight to engagement** — auto-shortlist + flag; do not accept to paid audit without partner conversation.
- **Frontmatter says `status: accepted` already** (re-triage run) — skip unless `--rescore` flag; otherwise don't overwrite a decision made by Jason or Joshua manually.

## Related

- Upstream: `jirah-audit-apply` (produces the scoring rubric this skill consumes)
- Downstream: `jirah-friction-audit` (accepted applicants flow here)
- Adjacent: `jirah-email` (for custom one-off follow-up emails outside the three templates)
- Context: jirah-icp-wedge.md, jirah-voice.md
- Future MCP: Outlook Mail (Sprint 2) — adds `--send` flag that actually ships the draft
