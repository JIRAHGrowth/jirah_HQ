---
name: jirah-document-review
description: Review client-sent artifacts (strategy decks, policies, financials, legal docs, prior-consultant reports, partnership agreements) through the jirah-document-reviewer subagent. Extends the global doc-review skill with Jirah methodology lens and friction-point mapping. Supports batch review of multiple files in parallel. Use when a client shares documents for scoping review, pre-engagement data pass, mid-sprint document arrives, or when Jason says "review these docs," "what's in [document]," "flag concerns in [file]," "doc review on [path]."
---

# /jirah-document-review

## Purpose

Let Jason and Joshua review documents **without pulling 50-page content into the main context**. This skill extends the global `/doc-review` with:
1. Jirah-methodology lens (friction-point mapping, wedge alignment, scope-discipline flags)
2. Subagent isolation (raw document content stays out of main conversation)
3. Parallel batch review when multiple files arrive at once

Use this skill when Jirah-specific lens matters (the document is a client artifact relevant to an engagement). Use global `/doc-review` for non-Jirah documents (blog posts, external reading, general critique).

## Pre-requisites (read before reviewing)

- [context/jirah-friction-points.md](../../../context/jirah-friction-points.md) — so concerns get FP-tagged
- [context/jirah-methodology.md](../../../context/jirah-methodology.md) — scope-discipline flags, triangulation integration
- [context/jirah-icp-wedge.md](../../../context/jirah-icp-wedge.md) — for ICP-fit lens on business documents
- Engagement profile if a specific engagement context applies

## Inputs (ask if not supplied)

- **File(s)** — one or more paths. `.pdf`, `.docx`, `.pptx`, `.xlsx`, `.md`, `.html`, `.txt`
- **Review lens** (required) — the specific question to answer. Examples:
  - `scoping-fit` — does the document align with what our engagement scope claims?
  - `red-flags` — what would make us reconsider taking / continuing this engagement?
  - `strategic-clarity` — is the client's strategy coherent + actionable?
  - `financial-health` — chain to `/jirah-financial-audit` if it's a financial statement
  - `prior-consultant-trauma` — what did another consultant try and why didn't it stick?
  - `partnership-agreement` — governance-rights review (legal notes flagged as out-of-scope if beyond Jirah)
  - `policy-deck` — strategic strategy deck from a prior planning cycle
  - `methodology-match` — does this align with Jirah's deliverable standards? (chain to `/jirah-report-review` if it's our own draft)
  - `custom` — freeform question in plain English
- **Engagement context** (optional) — slug if documents belong to a specific engagement
- **Friction-point focus** (optional) — 1–3 FPs to index concerns against

---

## Process

### 1. Dispatch lens

If lens is `financial-health`: chain to [`/jirah-financial-audit`](../jirah-financial-audit/SKILL.md). That skill is specialized for financial documents.

If lens is `methodology-match` and the document is a Jirah-authored draft: chain to [`/jirah-report-review`](../jirah-report-review/SKILL.md).

Otherwise proceed with this skill.

### 2. Fan out document-reviewer subagents

For each file in the input:
- Spawn one [`jirah-document-reviewer`](../../agents/jirah-document-reviewer.md) subagent
- Pass: file path, review lens, optional friction-point focus
- If 2+ files, run subagents in a single parallel message (cap at 10 concurrent)

Each subagent reads the file in isolation and returns: summary, concerns (critical/high/medium), questions to raise, strengths, friction-point mapping, flags.

### 3. Apply Jirah-methodology lens on the aggregate

Beyond what the subagent returns, Claude layers:

- **Scope-discipline check** — does the document carry items that, if we let them creep into scope, would violate `context/jirah-methodology.md` §3 (SOPs, handbooks, full HR policy)? Flag explicitly.
- **Wedge-alignment check** — does the document carry signals of FP #10 (Ownership Impact)? Specifically: who drafted it? Is the owner over-signing everything? Is the document itself a symptom of owner-bottleneck?
- **Pattern-library cross-reference** — does this document's shape match a prior-engagement pattern? (Falcon governance doc, S+A Gen Z-retention policy, etc.)
- **Triangulation opportunity** — which concerns in the document could be triangulated through a team interview or data pull?

### 4. Aggregate into a single review

```markdown
---
engagement: [slug or ad-hoc]
lens: [lens name]
files_reviewed: N
reviewed_date: YYYY-MM-DD
reviewer: JL | JM
---

# Document Review — [engagement or descriptor]
**Lens:** [lens]
**Files:** [N]

---

## Summary (3–5 sentences)

[What the documents collectively say, aggregated.]

## Concerns (Jirah-methodology overlay on subagent output)

### Critical (affect engagement go / no-go)
- [page/section] [concern]. Friction point: FP #N. Source file: [file].
  - Why it matters: [1 line]
  - Recommended next step: [specific action or question to raise with client]

### High (must raise with client before proceeding)
- ...

### Medium (watch-list, probe during sprint)
- ...

## Questions to raise with client (partner-voice phrasing)

[List 5–7 questions from subagent output, refined to Jirah partner voice.
Each one asks in a way that's low-friction for the client to answer.]

## Strengths to acknowledge

[From subagent output — honest, not flattery.]

## Scope-discipline check (Jirah overlay)

[Items in the document(s) that, if they became engagement scope, would violate
scope discipline: SOPs, handbooks, full HR policy drafting. If nothing: state
"no scope-creep items present" explicitly.]

## Wedge-alignment check (FP #10)

[Signals of Ownership Impact visible in the documents themselves — who drafted,
who signed, who approved. Often the document IS the FP #10 finding.]

## Pattern-library cross-reference

[If document shape matches a prior-engagement pattern, name it.]

## Triangulation opportunities

[Specific concerns in the document that would benefit from a team interview
or data pull during the sprint — feeds /jirah-triangulation planning.]

## Out-of-scope (Jirah flag)

[Items the subagent flagged as requiring specialist review (legal counsel,
regulatory expert, forensic accountant, etc.).]

## Flags for caller

- [Extraction issues per file]
- [Sensitive content requiring partner-level decision]
- [Documents referenced that we should also request]
```

### 5. Output

```
engagements/[slug]/04-client-source-files/review-notes/
└── [lens]-review-YYYY-MM-DD.md
```

Ad-hoc (no engagement): `document-reviews/[descriptor]-YYYY-MM-DD.md` in workspace root.

OneDrive equivalent: `01 - Clients\Active\[ClientName]\04 - Client Source Files\`

Update engagement frontmatter:
- `last_document_review_date: YYYY-MM-DD`
- `document_review_critical_flags: N`

### 6. Chain to downstream skills

- **If Critical flags raised** — queue a partner sync before continuing engagement
- **If triangulation opportunities surfaced** — chain to [`/jirah-triangulation`](../jirah-triangulation/SKILL.md) for each
- **If the review informed a draft response** — chain to [`/jirah-email --scenario general`](../jirah-email/SKILL.md) for the partner-voice client reply
- **If the document is the client's own strategy doc + concerns are surfaced** — they may become evidence in the Step 5 Action Register

### 7. Output to chat

```
Document Review — [engagement or descriptor]
Lens: [lens]
Files: [count, names]

Concerns
- Critical: [count]
- High: [count]
- Medium: [count]

Scope-discipline flags: [count]
Wedge-alignment (FP #10): [surfaced / not surfaced]
Pattern-library match: [engagement names / none]

Top 3 concerns
1. [1-line summary]
2. ...

Questions to raise with client: [count]

Output: [path]

Next steps
- Partner review of Critical flags (if any) before next client touchpoint
- Queue /jirah-triangulation on opportunities surfaced
- If reply needed: /jirah-email --scenario general --target [slug]
```

---

## Extends global `/doc-review`

This skill wraps the global [`/doc-review`](../../../CLAUDE.md) / `/doc-review-jason` pattern (doc-review-jason is Jason's personal version) with:

1. Subagent isolation (raw content stays out of main context)
2. Jirah friction-point mapping
3. Scope-discipline check
4. Wedge-alignment check (FP #10 specifically)
5. Pattern-library cross-reference
6. Engagement-folder output routing

For non-Jirah documents (external reading, generic critique), use the global skill instead — no need for the Jirah overlay.

## Edge cases

- **Document is 50+ pages** — subagent handles chunked reading; output focuses on specific page/section citations; caller doesn't see the full content
- **Document is encrypted / password-protected** — subagent returns "could not extract"; flag; ask client to re-share in accessible format
- **Document is commercially sensitive** (ongoing litigation, M&A discussions) — acknowledge sensitivity; output stays internal; flag in chat that any client reply must be partner-reviewed
- **Client sends a batch of 10+ documents** — cap parallel review at 10; run second batch after first completes; aggregate across both batches
- **Document is actually a Jirah prior-engagement artifact** (old case study, old proposal) — flag as internal review; different chain than client-document review
- **Document contains PII or regulated data** (healthcare records, payroll) — flag for partner-level decision before proceeding; may require engagement-scope-adjustment conversation with client
- **Prior-consultant report in the batch** — apply extra attention: what was recommended, what got implemented, what didn't, what the client blames (signal of change-fatigue per `context/jirah-friction-points.md` FP #8)
- **Document contradicts what the owner said at Discovery** — this is high-value intel. Surface prominently in Concerns; feed into hypothesis register for triangulation

## Related

- Subagent: [`jirah-document-reviewer`](../../agents/jirah-document-reviewer.md) (parallel fan-out, per file)
- Specialized chain-targets:
  - [`jirah-financial-audit`](../jirah-financial-audit/SKILL.md) — for financial statements
  - [`jirah-report-review`](../jirah-report-review/SKILL.md) — for Jirah-authored draft deliverables
- Extends: global `/doc-review` / `/doc-review-jason`
- Downstream: [`jirah-triangulation`](../jirah-triangulation/SKILL.md), [`jirah-email`](../jirah-email/SKILL.md)
- Context: jirah-friction-points.md, jirah-methodology.md, jirah-icp-wedge.md, jirah-pattern-library.md
