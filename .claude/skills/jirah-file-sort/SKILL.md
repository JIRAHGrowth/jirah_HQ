---
name: jirah-file-sort
description: Classify, rename, and move a batch of files into a client's canonical numbered folders (03 - Admin … 10 - Harvest). Invoke when Jason or Joshua say "sort these files into [Client]", "put these in the right place", "Genesis just sent us docs", or drops a directory of files that need to be filed. Works for active clients, prospects, and audit applicants.
---

# /jirah-file-sort

## Purpose

Take a batch of loose files (e.g., what a client just emailed, or a folder of downloads) and sort them into the correct numbered subfolder inside a specific client's folder. Optionally rename files to the Jirah convention (`YYYY-MM-DD - Title.ext`). Shows a **preview plan before moving** — no silent moves.

This skill pairs with `/jirah-new-client`:

- `/jirah-new-client` creates the folder scaffold.
- `/jirah-file-sort` fills it from whatever the client sent.

Run `/jirah-file-sort` any time files arrive — intake, mid-engagement, or retainer phase.

## Pre-requisites

Read before acting:

- [context/jirah-process.md](../../../context/jirah-process.md) — which artifacts belong to which engagement step
- The client's `00 - Profile.md` if it exists — tells you what engagement phase the client is in (affects where ambiguous files go)

## Inputs (ask if not supplied)

- **Target client** — client name, prospect name, or audit applicant. Must already have a folder under `01 - Clients/Active/`, `02 - Sales & Pipeline/Prospects/`, or `02 - Sales & Pipeline/Audit Applications/`. If not found, ask: "create new?" and route to `/jirah-new-client`.
- **Source path** — directory or list of files to sort. Common values:
  - `~\Downloads\` (Jason's Downloads)
  - `c:\Users\jason\Desktop\[something]\`
  - `[ClientFolder]\_inbox\` — convention for a client-specific inbox
  - A space-separated list of individual file paths
- **Rename?** (yes/no, default yes) — apply `YYYY-MM-DD - Title.ext` naming where a date can be extracted or reasonably inferred
- **Dry run?** (yes/no, default yes) — show the plan and wait for confirmation before moving

## Process

### 1. Resolve target

- Locate the client folder. If it's an active client: `01 - Clients/Active/[Name]/`. If prospect: `02 - Sales & Pipeline/Prospects/[Name]/`. If audit applicant: `02 - Sales & Pipeline/Audit Applications/[Name]/`.
- Prospects and audit applicants may not have the full numbered scaffold — for those, use a flatter target (`_files/` or the client folder root). Only active clients have the full 03–10 structure.
- If target doesn't exist: bail and suggest `/jirah-new-client`.

### 2. Enumerate source files

- Glob the source directory recursively. Skip `desktop.ini`, `.DS_Store`, `Thumbs.db`, and anything matching `~$*` (Office lock files).
- For each file, record: path, basename, extension, size, mtime.

### 3. Classify each file

Apply rules in order; first match wins. Match on filename (case-insensitive) and extension. For ambiguous files, peek at content via `Read` (first 1–2 pages for PDFs, first 50 lines for text-like formats).

| Pattern / Content Signal | Target Subfolder |
|---|---|
| `*Welcome Letter*`, `*Kick-Off Docs*` | `03 - Admin/Welcome Letter/` |
| `*Contract*`, `*DocuSign*`, `*Agreement*` (excluding *shareholders*), `*Engagement Letter*`, `*SOW*`, `*Statement of Work*` | `03 - Admin/Contract & DocuSign/` |
| `*Invoice*`, `*Receipt*` | `03 - Admin/Invoices/` |
| `*P&L*`, `*Profit and Loss*`, `*Balance Sheet*`, `*AR Aging*`, `*Valuation*`, `*BKGPkg*`, `*YE Docs*`, `*Year End*`, `*Financials*`, `*Cash Flow*`, `*Budget*` | `04 - Client Source Files/Financial/` |
| `*Shareholder*`, `*Shareholders Agreement*`, `*MSA*`, `*NDA*`, `*Bylaws*`, `*Articles of Incorporation*`, `*Minute Book*`, `*Amendment*` (when legal context) | `04 - Client Source Files/Legal & Governance/` |
| `*Handbook*`, `*Policy*`, `*Policies*`, `*Code of Conduct*`, `*SOP*`, `*Procedure*`, `*Manual*` | `04 - Client Source Files/Policies & Handbooks/` |
| `*Brochure*`, `*Capabilities*`, `*Company Profile*`, `*Case Study*` (client's own), `*Services Offered*`, `*Project List*`, `*Portfolio*` | `04 - Client Source Files/Marketing & Collateral/` |
| `*Discussion Document*`, `*Discovery*`, `*Intake*` | `05 - Discovery & Discussion Doc/` |
| `*Questionnaire*`, `*Pre-read*`, `*Pre Read*`, `*Managing Growth*`, `*Friction Points*` (sent to client) | `06 - Sprint & Facilitation/Pre-read & Questionnaire/` |
| `*Interview Guide*`, `*Staff Interview*`, `*Team Interview*` | `06 - Sprint & Facilitation/Interview Guides/` |
| `.mp3`, `.wav`, `.m4a`, `*Fireflies*`, `*Day 1*`, `*Day 2*`, `*Debrief*` (transcripts from sprint) | `06 - Sprint & Facilitation/Session Recordings & Transcripts/` |
| `*Ext Mtg*`, `*External Stakeholder*`, `*Stakeholder Interview*`, `*Partner Feedback*` | `06 - Sprint & Facilitation/Stakeholder Interviews/` |
| `*Jason's Notes*`, `*Facilitator Notes*`, `*Internal Reference*`, `*Project Brief*` | `06 - Sprint & Facilitation/Facilitator Notes/` |
| `*Final*`, `*Strategic Report*`, `*Action Register*`, `*Planning Report*`, `*Expansion Plan*` (finished), `*Action Steps*`, `*Key Actions*` | `07 - Deliverables/Final/` |
| `*Draft*`, `*Doc1*`, `*TOC_Structure*`, `*Research_Integrated*`, `*v2*`, `*v3*`, `*Revised*` (if a Final also exists) | `07 - Deliverables/Drafts/` |
| `*Monthly Meeting*`, `*Monthly Coaching*`, `*Meeting Minutes*`, `*[Month] [Year]*` (e.g. "Jan 2026") in an active client | `08 - Monthly Retainer/Monthly Meetings/` |
| `*Pilot Plan*`, `*Weekly Status*`, `*AI Pilot*` | `09 - AI Pilot/` (sub: `Weekly Status/` if status doc; root for plan) |
| `*Case Study Draft*`, `*Testimonial*`, `*Referral*` (Jirah-produced post-engagement) | `10 - Harvest/` |

**Ambiguity rules:**

- If a file matches multiple patterns, prefer the more specific one (Final > Draft if "Final" appears).
- If unclear, read content: look for keywords that disambiguate (e.g., a `.docx` with "Shareholder" in the body → Legal & Governance; with "Budget" → Financial).
- If still unclear, place in the client's root with a `_unsorted/` prefix subfolder and flag in the review.

### 4. Propose rename (if rename=yes)

For each file, propose a cleaner name:

- Extract date from filename (e.g., `- Jan 2026.docx` → `2026-01-01`) or file mtime → prefix as `YYYY-MM-DD - `.
- Strip redundant prefixes (`Hatch_JIRAH Monthly Meeting - Dec 2025.docx` → `2025-12-01 - Monthly Meeting.docx` inside the Hatch folder — client name is implicit from the folder).
- Preserve extension.
- Skip rename if the file already has an ISO-date prefix.

### 5. Show plan

Print a table:

```
Source                                          → Target                                             (rename)
───────────────────────────────────────────────  ───────────────────────────────────────────────────  ─────
~\Downloads\Welcome Letter.pdf                   → 03 - Admin\Welcome Letter\2026-04-20 - Welcome.pdf  (y)
~\Downloads\2026 P&L.xlsx                        → 04 - Client Source Files\Financial\2026 P&L.xlsx   (no)
~\Downloads\employee handbook.pdf                → 04 - Client Source Files\Policies & Handbooks\...  (y)
~\Downloads\mysterious_file.docx                 → _unsorted\ (flag: no matching rule)                 —
```

**Wait for user confirmation before executing moves** unless the user passed `--execute` or `dry_run=no`.

### 6. Execute moves

Use robocopy for OneDrive compatibility:

```powershell
robocopy "[source_dir]" "[target_dir]" "[filename]" /MOV /R:3 /W:2 /NFL /NDL /NJH /NJS /NC /NS
```

After each move, verify the file lands in dest and doesn't remain in source. Batch related moves (same source dir, same target dir) into one robocopy call when possible.

If a file has a rename proposal: robocopy moves it (keeping original name), then `Rename-Item` at the destination.

### 7. Report

- Summary: moved N files, skipped M (unmatched), flagged K ambiguous.
- If any file went to `_unsorted/`, list them so Jason can resolve manually.
- Log the operation to the client's `02 - Comms Log.md` if substantive (e.g., ≥5 files moved).

## Output

- Files moved to their correct numbered subfolders.
- Cleaner, date-prefixed filenames where applicable.
- Preview plan shown before execution.
- Summary report at the end.

## Edge cases

- **OneDrive sync lock** (`Device or resource busy`): retry via robocopy `/R:3 /W:2`. If still locked, skip and list in the summary.
- **OneDrive cloud-only placeholders** (file listed but `Test-Path` returns false in PowerShell): use bash `mv` or robocopy — they handle reparse points correctly.
- **File already exists at destination**: show diff of mtime + size; default to NOT overwriting; ask user.
- **No matching pattern**: place in `_unsorted/` subfolder at client root, surface in the report. Do NOT guess.
- **Client folder doesn't exist**: bail, suggest `/jirah-new-client`.
- **Prospect / audit applicant folder (flat, not numbered)**: use a simpler split — `contract/`, `financials/`, `notes/`, `_unsorted/`. Don't try to apply the full 03–10 scheme.
- **Files from an inactive client**: warn if sorting into an `Inactive/` folder — ask if they should be reactivated.
- **Audio files >50MB**: just move; don't try to read/transcribe inline. Flag their presence so Jason knows they need processing by `/jirah-session-analyzer`.
- **Conflict: Final and Draft of the same report**: if both exist in source, move Final to `07 - Deliverables/Final/` and Draft to `07 - Deliverables/Drafts/`. Verify by reading first page if ambiguous.
