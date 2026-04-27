# JIRAH Shared Drive Migration Manifest

**Generated:** 2026-04-25
**Source:** `C:\Users\joshu\OneDrive - jirahgrowth.consulting\JIRAH Growth Partners - Shared\`
**Target:** `...\JIRAH Growth Partners - Shared\NEW - JIRAH MASTER\` (to be promoted to top level after migration)
**Holding folder:** `C:\Users\joshu\OneDrive - jirahgrowth.consulting\_REVIEW - To Sort\` (Joshua-only, outside shared library)

## Status
- **Phase 1 (Inventory):** Complete
- **Phase 2 (Scaffolding):** Complete
- **Phase 3 (Classification manifest):** Complete (this document)
- **Phase 4 (Staged execution):** Complete (1,928 files migrated)
- **Phase 5 (Promote to top level):** Complete except for 2 locked-file residues

## Final state (2026-04-26)

### JGP-Shared root (now Jason's authoritative schema, lifted from NEW - JIRAH MASTER)
- `01 - Clients\` — 1,292 files, 1.9 GB (7 Active, 19 Inactive)
- `02 - Sales & Pipeline\` — 80 files, 159 MB
- `03 - Marketing & Content\` — 231 files, 289 MB
- `04 - Deliverable Templates\` — 100 files, 469 MB
- `05 - Corporate\` — 217 files, 108 MB
- `06 - Ops Command Center\` — 8 files
- `README.md`, `onedrivesync.md`

### HOLDING folder (`C:\Users\joshu\OneDrive - jirahgrowth.consulting\_REVIEW - To Sort\`)
- `Joshua Personal Archive\` — 642 files, 5.98 GB (Joshua folder, Coaching, Jiroventures, VJHF, MBA Teaching, Business Acquisition)
- `Personal - Possibly Not JIRAH\` — 88 files, 1.44 GB (10X Rule, Financial Discipleship, Hockey, Soccer, OLGC Volunteer, Photos, Property Tax)
- `Archive Candidates\` — 570 files, 1.00 GB (zz Archived older snapshots, headshots pending delete, Marketing deletes, Screenshots, Social Media Library)
- `Ambiguous - Joshua to Classify\` — 34 files (dupes routed for review)
- `Credentials & Sensitive\` — `JIRAH PWs.xlsx`

### Manual cleanup needed (2 locked files)
1. **`JIRAH - Client Tracker.xlsx`** still at JGP-Shared root, locked by open Excel session. Close Excel, then move to `06 - Ops Command Center\Pipeline Snapshots\`.
2. **`Regional-Manager-Metro-Vancouver.docx`** — file successfully copied to `01 - Clients\Active\Genesis Systems\07 - Deliverables\Drafts\`, but a stale source copy remains in `NEW - JIRAH MASTER\01 - Clients\Active\Genesis Systems\07 - Deliverables\Drafts\` (locked by another process — probably Word). Once unlocked, delete the residue and the empty `NEW - JIRAH MASTER\` wrapper.

### Phase 5 promotion observations
- 5 of 6 main branches promoted via single Move-Item; `01 - Clients\` required Robocopy due to deep paths in Falcon's Marketing tree.
- `Documents - JIRAH Growth Sharepoint` (phantom SharePoint mount) at OneDrive root left as-is — can be unpinned later if not needed.
- Skills (`/jirah-new-client`, `/jirah-file-sort`, etc.) reference paths under `01 - Clients\Active\[Name]\03 - Admin → 10 - Harvest` — verified to still resolve correctly post-promotion.

## Schema (authoritative — Jason's structure + 7 approved extensions)

```
NEW - JIRAH MASTER\
├── 01 - Clients\
│   ├── Active\           (per-client folders use _template subfolders 03-10)
│   ├── Inactive\
│   └── _template\
├── 02 - Sales & Pipeline\
│   ├── Audit Applications\
│   ├── Outreach Collateral\
│   ├── Prospects\
│   └── Target Lists\
├── 03 - Marketing & Content\
│   ├── Brand Assets\           (1_Logo, 2_Styleguide, 3_Textures, 4_Icons, 5_Font)
│   ├── Case Studies\
│   ├── Email & Outreach Templates\
│   ├── Events & Speaking\      ← NEW
│   └── Thought Leadership\
├── 04 - Deliverable Templates\
│   ├── AI Pilot Plan\
│   ├── Discovery & Discussion Docs\
│   ├── Exemplars\
│   ├── Friction Audit Pack\
│   ├── Meetings & PM\
│   ├── Monthly Retainer\
│   ├── Reference Frameworks\   ← NEW
│   ├── Sprint Facilitation\
│   └── Strategic Reports\
├── 05 - Corporate\
│   ├── Accounting\
│   │   └── Receipts\           ← NEW
│   ├── Firm Identity\
│   ├── HR\                     ← NEW
│   ├── Insurance\              ← NEW
│   ├── Invoices\
│   ├── Legal & Agreements\
│   ├── Partner Alignment\
│   ├── Strategic Planning\     ← NEW
│   └── Time Tracking\
└── 06 - Ops Command Center\
    ├── Automations\            ← NEW
    ├── Daily Briefings\
    ├── Partner Memos\
    ├── Pipeline Snapshots\
    └── Weekly Reviews\
```

---

## Section A: Client Disposition

### A.1 Active clients (final state in `01 - Clients\Active\`)

| Client (final name) | Source | Action | Notes |
|---|---|---|---|
| Falcon Engineering | Already in NEW (115 files) + `2. Clients\Falcon Engineering\` (6 files) | MERGE residue from old → existing NEW folder | Old folder almost empty (mostly migrated) |
| Genesis Systems | Already in NEW (70 files, 574 MB) | KEEP (no source) | Plus 4 Genesis docs in `6. Attachments\` to migrate in (see C.3) |
| Hatch Interior Design | Already in NEW (22 files) + `2. Clients\Hatch Design\` (35 files) | MERGE old → existing NEW; old name "Hatch Design" deprecates to "Hatch Interior Design" | DEDUPE concern: Two Day Planning Report exists in both + at OneDrive root |
| Vernon Christian | `2. Clients\Vernon Christian\` (83 files, 81 MB, last touched 2026-04-13) | MOVE → `01 - Clients\Active\Vernon Christian\` + scaffold `_template` | Plus PRE Qualification files in `6. Attachments\` |
| Team Construction | `2. Clients\Team Construction\` (104 files, 215 MB, last touched 2026-02-02) | MOVE → `01 - Clients\Active\Team Construction\` + scaffold | DEDUPE: drop `zz. Archived\Team Construction\` (verified identical) |
| Travis Hoy Goaltending | `2. Clients\Travis Hoy Goaltending\` (1 file) | MOVE → `01 - Clients\Active\Travis Hoy Goaltending\` + scaffold | Origin client → stixanalytix; preserved per Joshua direction |
| Urban Systems | `2. Clients\Urban Systems\` (1 file) | MOVE → `01 - Clients\Active\Urban Systems\` + scaffold | Renewal expected; plus `Urban Systems - Growth Strategy Plan - April 2025` proposal in `1. Proposals\` |

### A.2 Inactive clients (final state in `01 - Clients\Inactive\`)

Each gets a folder. `_template` scaffold optional for inactive (only scaffold if there's enough content to warrant it).

| Client | Source(s) | Notes |
|---|---|---|
| OLGC (Our Lady of Good Counsel) | `2. Clients\OLGC (Our Lady of Good Counsel)\` (82 files) + `6. Attachments\OLGC_Peliminary Case_Draft_05b Jan 16 2025.pdf` | Plus proposal `1. Proposals\Lady of Good Counsel - Discussion Document - February 2023.pptx.pdf` |
| Machen Manufacturing Ltd | `2. Clients\Machen Manufacturing Ltd\` (133 files) | DEDUPE: drop `zz. Archived\Machen Manufacturing Ltd\` (138 files, Nov 2024 snapshot — older). Plus `Welcome Letter - Machen Manufacturing Aug 2024.pdf` at OneDrive root. Plus 2 proposals in `1. Proposals\` |
| CMHA - Vernon | `2. Clients\CMHA  - Vernon\` (125 files) | Fix double-space typo on move. DEDUPE: drop `zz. Archived\CMHA  - Vernon\` (132 files older snapshot). Plus 2 proposals + Prospect ID files in `6. Attachments\` |
| Mastermind - Trades | `2. Clients\Mastermind - Trades\` (18 files) | |
| GrainMatch | `2. Clients\GrainMatch\` (8 files) | Plus `Welcome Letter - GrainMatch 2025.docx` in `6. Attachments\` |
| Trimlight Kelowna | `2. Clients\Trimlight Kelowna\` (10 files) | Plus `Letter to Trimlight Kelowna - Apr 2024.docx/pdf` in `1. Proposals\` |
| Sirocco Wine Food Consulting | `2. Clients\Sirocco Wine Food Consulting\` (3 files) | DEDUPE: drop `zz. Archived\Sirocco Wine Food Consulting\` (3 files). Plus `Sirocco Consulting - Growth Strategy Coaching - April 2024.pdf` at OneDrive root |
| Jonas Gordon | `2. Clients\Jonas Gordon\` (2 files) | Plus 2 proposals in `1. Proposals\` |
| Helen's Acres - Trinity Legacy Foundation | `2. Clients\zz. Archived\Helen's Acres - Trinity Legacy Foundation\` (3 files) + 3 loose `Helen's Acres ___.docx` at `2. Clients\` root | Combine into one folder |
| 5 and 2 Network | `2. Clients\zz. Archived\5 and 2 Network\` (29 files, more recent) | DEDUPE: drop `2. Archived\5 and 2 Network\` (28 files, older). Plus 3 proposals in `1. Proposals\` |
| One Step Foot Care | `2. Clients\zz. Archived\One Step Foot Care\` (52 files) | DEDUPE: drop `2. Archived\One Step Foot Care\` (52 files identical) |
| Kelley Associates | `2. Clients\zz. Archived\Kelley Associates\` (2 files) | DEDUPE: drop `2. Archived\Kelley Associates\` (2 files). Plus proposal in `1. Proposals\` |
| Emma House (Maternity) | `2. Clients\zz. Archived\Emma House\` (5 files) | DEDUPE: drop `2. Archived\` twin. Plus proposal in `1. Proposals\` |
| Homes First | `2. Clients\zz. Archived\Homes First\` (25 files) | DEDUPE: drop `2. Archived\` twin |
| All Six Letters | `2. Clients\zz. Archived\All Six Letters\` (5 files) | DEDUPE: drop `2. Archived\` twin |
| BOSS Assistants | `2. Clients\zz. Archived\BOSS Assistants\` (2 files) | DEDUPE: drop `2. Archived\` twin. Plus proposal in `1. Proposals\` |
| HIS Drywall | `2. Clients\zz. Archived\HIS Drywall - Half Day Planning Report - January 2024.docx` (loose at archive root, both copies) | Tiny one-off; folder = single file. Plus `Letter to His Dry Wall - Dec 2023.docx/pdf` proposals |
| OSFC | `6. Attachments\OSFC2019-FS.pdf` + `OSFC2020-FS.pdf` + `OSFC2021-FS.pdf` + `OSFC2022-FS.pdf` + `OSFC Inc. - 2023 - Financial Statements.pdf` | New folder; financials only |
| Clear Worth Financial Group | `6. Attachments\Clear Worth Financial Group LOGO ___.png/jpg` (10 logo files) | New folder; logos only |

### A.3 Redirects (NOT clients — go elsewhere)

| Source | Action | Destination |
|---|---|---|
| `2. Clients\Build Conference\` (14 files) | MOVE | `03 - Marketing & Content\Events & Speaking\Build Conference\` |
| `2. Clients\New Folder\` (empty) | DELETE | — |
| `2. Clients\Cressman Homes\` (empty) | DELETE | (Cressman engaged via Social Media proposal but no folder content) |
| `2. Clients\Lunch and Learn RSVP's.xlsx` | MOVE | `03 - Marketing & Content\Events & Speaking\` |
| `2. Clients\Business Growth Consulting - JIRAH Growth Partners JULY 2024.docx/.pdf` | MOVE | `02 - Sales & Pipeline\Outreach Collateral\Archive\` (deprecated outreach piece) |
| `2. Clients\Client Onboarding Questions.docx` | MOVE | `04 - Deliverable Templates\Discovery & Discussion Docs\` |
| `2. Clients\Contract Template.docx` | COMPARE & MERGE | Compare with `JGP-Shared\TEMPLATE - Consulting Service Agreement (Sprint).docx`; keep newer; drop other |
| `2. Clients\Redacted Sample of Recommendations - Two Day Planning Report - 2024.docx` | MOVE | `04 - Deliverable Templates\Exemplars\` |

### A.4 Category folders inside `2. Clients\`

| Source | Action |
|---|---|
| `2. Clients\1. Proposals\` (82 files) | SPLIT — see Section B |
| `2. Clients\2. Agreements\` (2 files: Cressman + Hatch) | SPLIT: Hatch DocuSign → `01-Clients\Active\Hatch Interior Design\03 - Admin\Contract & DocuSign\`; Cressman DocuSign → HOLDING (no live Cressman client) |
| `2. Clients\3. Prospecting\Contacts_JIRAH.xlsx` | MOVE | `02 - Sales & Pipeline\Target Lists\` |
| `2. Clients\2. Archived\` (after dedupe) | DELETE empty | |
| `2. Clients\zz. Archived\` (after dedupe) | DELETE empty | |

---

## Section B: Historical Proposals (`2. Clients\1. Proposals\`)

82 PPTX/PDF proposal files for 30+ prospects. Split:

### B.1 Won-client proposals (move to client's `05 - Discovery & Discussion Doc\` folder)

| Proposal | Client (in NEW or Inactive) |
|---|---|
| Falcon Engineering - Growth Strategy Plan - June 2025.pdf/pptx | Active\Falcon Engineering |
| Hatch Design - Growth Strategy Coaching - January 2024.pdf/pptx | Active\Hatch Interior Design |
| Urban Systems - Growth Strategy Plan - April 2025.pdf/pptx | Active\Urban Systems |
| Vernon Christian School - Campaign Counsel - May 2022.pdf/pptx | Active\Vernon Christian |
| TEAM Construction - Proposal - June 2022.ppt/pptx | Active\Team Construction |
| Machen Manufacturing - Business Growth Coaching - August 2024.pdf + Growth Strategy Coaching pptx | Inactive\Machen Manufacturing Ltd |
| CMHA Vernon - Campaign Management - June 2023.pdf + May 2023.pptx | Inactive\CMHA - Vernon |
| Jonas Gordon - Growth Strategy Coaching - October 2024.pdf/pptx | Inactive\Jonas Gordon |
| Sirocco Consulting - Growth Strategy Coaching - April 2024.pptx | Inactive\Sirocco Wine Food Consulting |
| Lady of Good Counsel - Discussion Document - February 2023.pptx.pdf | Inactive\OLGC |
| Five and Two Network - Executive Strategy Coaching (Jan 2023 + Feb 2023, 3 files) | Inactive\5 and 2 Network |
| BOSS Assistants - Growth Strategy Coaching - March 2024.pdf/pptx | Inactive\BOSS Assistants |
| Kelley Assoc - Growth Strategy Coaching - March 2023.pdf/pptx | Inactive\Kelley Associates |
| Emma Maternity House Society - Major Donor Kick Off - September 2022.pdf/pptx | Inactive\Emma House |
| Letter to His Dry Wall - Dec 2023.docx/pdf | Inactive\HIS Drywall |
| Letter to Trimlight Kelowna - Apr 2024.docx/pdf | Inactive\Trimlight Kelowna |

### B.2 Lost / never-engaged prospects (preserve as historical archive)

Move to `02 - Sales & Pipeline\Prospects\_Historical Proposals\` (new subfolder):

- Adeara - Fundraising Support - Oct 2022 (pdf+pptx)
- Balancing the Books - Growth Franchising Strategy Plan - May 2025
- Bezulu Intl - Strategy and Implementation - May 2022
- BlueGreenArchitecture - Growth Strategy Coaching (Apr 2024 pptx + May 2024 pdf)
- Cressman Homes Social Media Mangement March 2025 (pdf+pptx)
- Discovery Meeting Imperial Finishing - JUNE 2023
- Imperial Finishing - Discussion Document - June 2023 (docx+pptx)
- EMMS - Growth Strategy Plan - July 2025
- Emmy Deveaux - Growth Strategy Coaching (Apr 2024 pptx + Jul 2024 pdf) + Website Audit (docx+pdf)
- Evolve Leadership Development - Growth Strategy Coaching (Mar 2024 pdf+pptx + May 2024 pdf)
- GBBC - Campaign Management (May+June 2023, 3 files)
- Kamloops Orchestra/Symphony Society - Fundraising Support (5 files across Oct/Nov 2022, Jan 2023, Oct 2024)
- Keats Camps - Study + Campaign Counsel - April 2022 (pdf+pptx)
- KGM Troy McKnight - Executive Strategy Coaching - July 2024 (pdf+pptx)
- Letter to Nelson Civic Theatre - Dec 2023 (docx+pdf) + Nelson Civic Theatre Sept 2023 + June 2022
- Oak n Iron - Growth Strategy Plan - April 2025
- Sherpa Group Events - Growth Strategy Coaching - July 2023 (3 files)
- Sovereign Lake Nordic Centre - Campaign Study & Coaching - March 2023 (pdf+pptx)
- Sproing Creative - Discussion Document - April 2023 (pdf+pptx)
- StyleLine - Growth Strategy Coaching - April 2024 (pdf+pptx)
- The Roxy Cafe - Growth Strategy Coaching - May 2023 (pdf+pptx)
- Vivian Yu - Growth Strategy Coaching - November 2024 (pdf+pptx)

---

## Section C: Old branches → NEW destinations

### C.1 `1. Business\` (209 files, 554 MB)

| Source | Destination |
|---|---|
| `Business Documents\` (28 files, 57 MB) | SPLIT: corporate docs → `05 - Corporate\Firm Identity\` or `Legal & Agreements\` (per file inspection) |
| `Business Documents\2024-2025 Commercial Insurance Package\` (5 files) | `05 - Corporate\Insurance\` |
| `Coaching\` (9 files, 10 MB) | `04 - Deliverable Templates\Reference Frameworks\` |
| `Financial\` (12 files, 1.2 MB) | `05 - Corporate\Accounting\` |
| `Financial\Insurance\` (4 files) | `05 - Corporate\Insurance\` |
| `Financial\Invoices\` (20 files) | `05 - Corporate\Invoices\` |
| `Financial\New folder\` (empty) | DELETE |
| `Financial\Taxes\` (subfolders by year) | `05 - Corporate\Accounting\Taxes\` (preserve year subfolders) |
| `Planning\` (11 files, 1.1 MB) | `05 - Corporate\Strategic Planning\` |
| `The 10X Rule Audio\` (54 MP3, 457 MB) + `__MACOSX\` ghost dirs | HOLDING `Personal - Possibly Not JIRAH\10X Rule Audiobook\`. DELETE `__MACOSX\` ghost dirs (macOS metadata cruft) |
| `VA Info and Resumes\` (7 files) | `05 - Corporate\HR\Contractor Records\` |
| Loose root files (1.png, 2.png, Business Card - Back, Admin Services for Trades, Art Science of Change, Change Readiness Survey, Compensation_Proposal_Jason_to_Joshua, agreement-termination docs, etc.) | INSPECT each: most → `05 - Corporate\` various; Compensation Proposal → `Partner Alignment\`; Termination docs → `Legal & Agreements\` |

### C.2 `4. Resources\` (558 files, 1.1 GB)

| Source | Destination |
|---|---|
| `BDC_Business_Plan_Kit\` | `04 - Deliverable Templates\Reference Frameworks\BDC Business Plan Kit\` |
| `Fundraising Tools\` (13 files, 30 MB) | `04 - Deliverable Templates\Reference Frameworks\Fundraising\` |
| `Jiroventures Documents\` (62 files across DYOL/Forms/Goals/Guidelines/Personal/Professional/Relationships) | HOLDING `Joshua Personal Archive\Jiroventures\` (per March flag — Joshua to decide if any belongs in JIRAH) |
| `Screenshots\` (101 files, 47 MB) | HOLDING `Archive Candidates\Screenshots\` (likely cruft — review for delete) |
| `Templates\Hello Fresh Documents\` (6 files, 54 MB) | HOLDING `Ambiguous - Joshua to Classify\` (looks like client reference material from prior work) |
| `Templates\Stollery Kids Documents\` (6 files, 61 MB) | HOLDING `Ambiguous - Joshua to Classify\` (similar) |
| `Templates\` (loose 13 files, 86 MB) | INSPECT — likely → `04 - Deliverable Templates\Reference Frameworks\` or HOLDING |
| `Tools (EOS_Scaling Up)\` (17 files, 18 MB) | `04 - Deliverable Templates\Reference Frameworks\EOS & Scaling Up\` |
| `VJHF Files\` (Vernon Jubilee Hospital Foundation? — 100+ files, includes Donor Wall pictures 543 MB) | HOLDING `Joshua Personal Archive\VJHF Files\` (prior NFP role artifacts) |

### C.3 `6. Attachments\` (68 files, 1.3 GB) — SPLIT

| Source | Destination |
|---|---|
| `Genesis_Alberta_Expansion_Plan.docx` + `_Revised.docx` | `01 - Clients\Active\Genesis Systems\07 - Deliverables\Drafts\` (or appropriate sprint folder) |
| `Genesis_JIRAH AI Pilot Agreement.docx` | `01 - Clients\Active\Genesis Systems\03 - Admin\Contract & DocuSign\` |
| `Genesis_JIRAH Strategic Execution Advisory Agreement.docx` | `01 - Clients\Active\Genesis Systems\03 - Admin\Contract & DocuSign\` |
| `Hatch Interior Design - Two Day Planning Report - Spring 2025.docx` | DEDUPE: triple-copy concern (also in old Hatch + at OneDrive root). Compare and keep newest |
| `OLGC_Peliminary Case_Draft_05b Jan 16 2025.pdf` | `01 - Clients\Inactive\OLGC\07 - Deliverables\Drafts\` |
| `OSFC2019-FS.pdf` through `OSFC Inc. - 2023 - Financial Statements.pdf` (5 files) | `01 - Clients\Inactive\OSFC\04 - Client Source Files\Financial\` |
| `Welcome Letter - GrainMatch 2025.docx` | `01 - Clients\Inactive\GrainMatch\03 - Admin\Welcome Letter\` |
| `Project Brief - 2 Day Sprint - May 2025 1.docx` + `.docx` | DEDUPE; keep one → `04 - Deliverable Templates\Sprint Facilitation\` |
| `BEEM One Pager - March 2025.pptm` | `02 - Sales & Pipeline\Outreach Collateral\` (or BEEM-specific prospect folder) |
| `Baptist Housing Contract Jan 2024.pdf` | HOLDING `Ambiguous` (prior client? need ID) |
| `Sienna Senior Living Contract Jul 2020.pdf` | HOLDING `Ambiguous` (prior client?) |
| `EmploymentAgreement-Administration.docx` | `05 - Corporate\HR\` |
| `Shaun Grundle Resume - Senior Consultant.docx` | `05 - Corporate\HR\Contractor Records\` |
| `Clear Worth Financial Group LOGO ___.png/jpg` (10 files) | `01 - Clients\Inactive\Clear Worth Financial Group\04 - Client Source Files\Marketing & Collateral\` |
| `Build Conference (1).png` + `.jpg` | `03 - Marketing & Content\Events & Speaking\Build Conference\` |
| `DocuSign Cressman Homes MAR2025.docx` + `MAR2025 1.docx` | DEDUPE; keep one → HOLDING (Cressman not a live client) |
| `Feb 5 - Making Money PPT - Draft 1.pptx` + `Draft.pptx` (35 MB each) | DEDUPE; one → `03 - Marketing & Content\Events & Speaking\` |
| `Lunch N Learn - Back to Basics JAN2024.pptx` | `03 - Marketing & Content\Events & Speaking\` |
| `Final signup and table allocation Aug 6.xlsx` | `03 - Marketing & Content\Events & Speaking\` |
| `BTBYW Sustainable Growth ___` (2 files) | `03 - Marketing & Content\Events & Speaking\` |
| `2024-2025 Schedule & Topic List.xlsx` | `03 - Marketing & Content\Events & Speaking\` |
| `MailChimp Email List - Version 1 - July 31 2023 JP edits.xlsx` | `03 - Marketing & Content\Email & Outreach Templates\` |
| `Meeting Rhythms Document - Oct 2023.docx` | `04 - Deliverable Templates\Meetings & PM\` |
| `Chamber Lists - Feb 11 2025.xlsx` | `02 - Sales & Pipeline\Target Lists\` |
| `Super Special Contacts.xlsx` | `02 - Sales & Pipeline\Target Lists\` |
| `Q380994 - JIRAH - FLEXFIT CAPS.pdf` + `Q380995 - JIRAH_PEN_P318 MATTE BLUE.pdf` | `03 - Marketing & Content\Brand Assets\6_Merch\` (new sub) |
| `Nelson Civic Theatre - Capital Campaign Discussion Document - Sept 2023R.docx` + `2022.docx` | `02 - Sales & Pipeline\Prospects\_Historical Proposals\` |
| `PRE Qualification Vernon Christian School - April 2023 (1).xlsx` + ` .xlsx` | DEDUPE; one → `01 - Clients\Active\Vernon Christian\05 - Discovery & Discussion Doc\` |
| `Vernon Christian School Pre Qualification Methdology - March 2023.docx` | `01 - Clients\Active\Vernon Christian\05 - Discovery & Discussion Doc\` |
| `Prospect ID Methodolgy - CMHA Vernon-Nov 2023.docx` + `Prospect Identification - CMHA Vernon - Nov 2023.xls` | `01 - Clients\Inactive\CMHA - Vernon\05 - Discovery & Discussion Doc\` |
| `Joshua Tamara Marshall Debt Story.mp4` (237 MB) | HOLDING `Personal - Possibly Not JIRAH\` |
| `Financial Discipleship - Session 2/3/5 .pptx` (713 MB total) + Survey + Schedule docs (8 files) | HOLDING `Personal - Possibly Not JIRAH\Financial Discipleship\` |
| `NFP Marketing - Walter_Wymer_Jr ___.pdf` (212 MB textbook?) | HOLDING `Archive Candidates\` (large reference PDF — keep or delete?) |
| `Thrive for Good Receipt 2024.pdf` | `05 - Corporate\Accounting\Receipts\` |
| `Business Growth Consulting - JIRAH Growth Partners JULY 2024.docx` | DEDUPE with same file in `2. Clients\` root |
| `JIRAH - Shared Drive Reorganization Plan - 2026-03.docx` | DEDUPE with same file at JGP-Shared root |

### C.4 `8. Marketing Communications\` (363 files, 421 MB)

| Source | Destination |
|---|---|
| `Bio\` (4 files) | `05 - Corporate\Firm Identity\Bios\` |
| `Build Conference\Logos\` (4 files) | `03 - Marketing & Content\Events & Speaking\Build Conference\Logos\` |
| `Business Cards\` (16 files) | `03 - Marketing & Content\Brand Assets\6_Business Cards\` (new sub) |
| `Clear Way Logos\` (10 files) | HOLDING `Ambiguous` (Clear Way = client? unknown) |
| `DoorKraft_ Logo and Testimony\` (2 files) | HOLDING `Ambiguous` (DoorKraft = client? unknown) |
| `FloDesk\` (2 files) | `03 - Marketing & Content\Email & Outreach Templates\` |
| `Hat Design 2023\` (17 files, 6 MB) | HOLDING `Ambiguous` (event design? Brand variant? unknown) |
| `Headshots\` + `Headshots\Adam` + `Dailene` + `Joshua` + `Taylor` (44 files total) | `03 - Marketing & Content\Brand Assets\7_Headshots\`. Adam/Dailene/Taylor are prior contractors — may belong in HR or Holding instead — needs your call |
| `LinkedIn Posts\` (20 files, 16 MB) | `03 - Marketing & Content\Thought Leadership\LinkedIn Archive\` |
| `Social Media Assets\` (160 files, 354 MB) | HOLDING `Archive Candidates\Social Media Library\` (large historical asset library — review for keep/delete) |
| `Social Media Assets\Unused\` (11 files, 10 MB) | HOLDING `Archive Candidates\` |
| `Social Media Templates\` + `Jpegs\` + `PNG\` (44 files) | `03 - Marketing & Content\Brand Assets\6_Social Templates\` (consolidate) |
| `Testimonials\` (8 files) | `03 - Marketing & Content\Thought Leadership\Testimonials\` |
| `__MACOSX\*` ghost folders | DELETE (macOS metadata cruft) |

### C.5 `5. Document Templates\` (11 files, 90 MB)

| Source | Destination |
|---|---|
| `JIRAH Report Template.docx` (76 MB) | `04 - Deliverable Templates\Strategic Reports\` (FLAG: 76 MB suggests embedded media — consider light version) |
| `JIRAH Report Presentation.pptx` (11 MB) | `04 - Deliverable Templates\Strategic Reports\` |
| `JIRAH Report Presentation FALCON.pptx` (3.7 MB) | `04 - Deliverable Templates\Exemplars\` (Falcon-specific = exemplar) |
| `DocuSign Template Oct 2024.docx` | `04 - Deliverable Templates\Discovery & Discussion Docs\` |
| `Letterhead\Jirah_Letterhead_template.pages/.docx` | `03 - Marketing & Content\Brand Assets\` (alongside Styleguide) |
| `Lunch & Learn Communications.docx` | `03 - Marketing & Content\Events & Speaking\` |
| `Workback Schedule Generator Template.xlsx` | `04 - Deliverable Templates\Meetings & PM\` |
| `ChatGPT Prompt using DMiller - AHormozi - SGodin Feb 2025.docx` | `06 - Ops Command Center\Automations\AI Prompts\` |
| `Meeting Rhythms Document - Oct 2023.docx` | `04 - Deliverable Templates\Meetings & PM\` (DEDUPE with `6. Attachments\` copy) |
| `Analyzing Your People - Template.xlsx` | `04 - Deliverable Templates\Sprint Facilitation\` |

### C.6 `3. Presentations\` (25 files, 68 MB)

All → `03 - Marketing & Content\Events & Speaking\`:
- `1 - 3 Email Campaign - Apr 2025.docx` + `.docx` (DEDUPE)
- `AccelerateOkanagan2025.pptx`
- `BEEM MAR2025.pptx`
- `BTBYW Sustainable Growth Eventbrite Listing.docx`
- `FFCS - April 25 2022.ppt`, `FFCS - Planning & Implementing a Capital Campaign` (pdf+pptx), `FFCS - ROI of Events - May 2023.pptx`, `FFCS - Toolkit May 2025` (docx+pdf)
- `Lunch & Learn Venue Options.xlsx`
- `Lunch N Learn - Back to Basics AUG2024 Final.pptx` + non-Final (DEDUPE)
- `Lunch N Learn - Back to Basics JAN2024.pptx`
- `Lunch N Learn - DEC 2023 FINAL.pptx` + `merged (1).pptx` (DEDUPE)
- `Lunch N Learn - Goal Setting DEC 2024.pptx`
- `Lunch N Learn - Less Hustle More Profit FEB2025.pptx` (20 MB)
- `Lunch N Learn - Oct 2023.pptx`, `Sep 2023.pptx`
- `Lunch_and_Learn_Presentation April 17 - Terrance Chad.pptx`
- `Navigate Conference Session Info and Bios - Joshua Marshall - Dec 21 2023.docx`
- `SCSBC Navigate Conference - April 2024.pptx`
- `2024-2025 Schedule & Topic List.xlsx` (DEDUPE — also in `6. Attachments\`)

### C.7 `9. Receipts\` (47 files, 8 MB)

All → `05 - Corporate\Accounting\Receipts\` (consider organizing by year on move; date metadata supports it)

### C.8 `HR Handbook Documents\` (24 files, 18 MB)

All → `05 - Corporate\HR\`:
- `Consultant Profile - June 2025.docx` → `HR\Contractor Records\`
- `Employee_Handbook_DRAFT.docx` → `HR\`
- `Resources\*` (22 policy docs + zip) → `HR\Policies\`

### C.9 `1. Team_Planning_Meetings\` (3 files)

| Source | Destination |
|---|---|
| `JIRAH - Growth Friction Planner - Jan 2025.xlsx` | `05 - Corporate\Strategic Planning\` |
| `JIRAH - Growth Friction Planner - March10 2025.pdf` | `05 - Corporate\Strategic Planning\` |
| `LinkedIn Script - JM March 2025.pptx` | `03 - Marketing & Content\Thought Leadership\LinkedIn Archive\` |

### C.10 `7. Volunteering\` (2 files)

| Source | Destination |
|---|---|
| `Chamber of Commerce\BEA Scoring 2023.pdf` + `Judges Information Package.pdf` | HOLDING `Personal - Possibly Not JIRAH\Volunteering\` (Joshua to decide if Chamber work belongs in JIRAH) |

### C.11 `Joshua\` (257 files, 5.3 GB)

Per Joshua's direction — entire branch is personal/adjacent-projects (MBA, StixAnalytix, business acquisition explorations, AFP archive, financial literacy program). NOT migrating into NEW.

→ Move entire `Joshua\` folder to HOLDING `Joshua Personal Archive\`. Joshua will then triage and either keep there, move to personal OneDrive root, or delete.

---

## Section D: JGP-Shared root loose files

| File | Action |
|---|---|
| `90 Day New Owner Internal Process Doc.docx` | `04 - Deliverable Templates\Discovery & Discussion Docs\` |
| `Build Conference Brand Identity Questions.docx` | `03 - Marketing & Content\Events & Speaking\Build Conference\` |
| `JIRAH - Client Tracker.xlsx` | `06 - Ops Command Center\Pipeline Snapshots\` (NOTE: file is currently OPEN — close before move) |
| `JIRAH - Shared Drive Reorganization Plan - 2026-03.docx` | HOLDING `Archive Candidates\` (superseded by Jason's structure) |
| `JIRAH - Tech Stack Setup Guide - 2026-03.docx` | `06 - Ops Command Center\Automations\` |
| `JIRAH PWs.xlsx` | HOLDING `Credentials & Sensitive\` (FLAG 1 — should not be in shared drive) |
| `Make Automation Prompts - Oct 2025.docx` | `06 - Ops Command Center\Automations\` |
| `Questions for Webinar Recording.docx` | `03 - Marketing & Content\Events & Speaking\` |
| `TEMPLATE - Consulting Service Agreement (Sprint).docx` | `04 - Deliverable Templates\Discovery & Discussion Docs\` (or `05 - Corporate\Legal & Agreements\Templates\`) |
| `TEMPLATE - Monthly Coaching Services Agreement.docx` | `04 - Deliverable Templates\Monthly Retainer\` |
| `TEMPLATE - Non-Disclosure Agreement.docx` | `05 - Corporate\Legal & Agreements\Templates\` |
| `.~lock.JIRAH - Client Tracker.xlsx#` | DELETE on close (Excel lock file) |

## Section E: OneDrive root loose files (~40 files)

JIRAH-related (route into NEW):

| File | Action |
|---|---|
| `Hatch Interior Design - Two Day Planning Report - Spring 2025.docx` | DEDUPE (also in 2 other locations); → `01 - Clients\Active\Hatch Interior Design\07 - Deliverables\Final\` |
| `JIRAH_First_90_Days_Client_Guide.docx` | `04 - Deliverable Templates\Discovery & Discussion Docs\` |
| `Partnership Pathway Hatch - Jan 2026 - JIRAH Growth.docx` | `01 - Clients\Active\Hatch Interior Design\08 - Monthly Retainer\` |
| `Sirocco Consulting - Growth Strategy Coaching - April 2024.pdf` | DEDUPE (also in 1. Proposals); → `01 - Clients\Inactive\Sirocco Wine Food Consulting\05 - Discovery & Discussion Doc\` |
| `Welcome Letter - Machen Manufacturing Aug 2024.pdf` | `01 - Clients\Inactive\Machen Manufacturing Ltd\03 - Admin\Welcome Letter\` |
| `About the teams.docx` | INSPECT — likely `05 - Corporate\Partner Alignment\` or `Firm Identity\` |
| `1.docx`, `Doc1.docx` | INSPECT (untitled drafts — likely DELETE if empty) |
| `Book.xlsx`, `Book1.xlsx` | INSPECT (default Excel filenames — likely DELETE if empty) |
| `DecisionMakers_kept.xlsx` | DEDUPE (already moved to `02 - Sales & Pipeline\Target Lists\`) |
| `JIRAH PWs.xlsx` | (See Section D — same file as JGP-Shared root? CONFIRM) |

NOT JIRAH (out of scope):

| File | Action |
|---|---|
| `20230613_*.jpg` (4 photos), `processed-*.jpeg` | HOLDING `Personal - Possibly Not JIRAH\Photos\` |
| `2024 Annual Report Filing for JIRAH Growth Consulting Ltd.pdf` | `05 - Corporate\Accounting\` (this IS JIRAH) |
| `20240531 Financial Information Statements.pdf` | `05 - Corporate\Accounting\` (also JIRAH) |
| `Acquisition Ace - How it works.docx` | HOLDING `Joshua Personal Archive\Business Acquisition\` |
| `BC Assessment Review Panel - 3610 Weston Rd - Feb 2024.*` (3 files) | HOLDING `Personal - Possibly Not JIRAH\` (property tax) |
| `Capital Campaign Meeting Agenda - Dec 13, 2023.docx` | HOLDING (likely OLGC or volunteer) |
| `Client Financial Contributions - Aug 2024.xlsx` | INSPECT — likely OLGC volunteer |
| `Consent form - class based project - 506 -1 - CaseyH ___` (2 files) | HOLDING `Joshua Personal Archive\MBA Teaching\` |
| `dobberhockey202425fantasyguide.pdf`, `Draft Order - 2024.25.xlsx`, ESPN files (3 files), `Get_Back_to_the_Podium`, `rankings_SS1.xlsx` | HOLDING `Personal - Possibly Not JIRAH\Hockey\` |
| `GK Session Plans - Sep 2025.docx`, `Judah Marshall-Spring 2025-2017B Gold.pdf`, `KCITY FC 2017 Boys Progress Report - Marshall, Judah ___` (2 files), `U7-10 BOYS 2026.xlsx` | HOLDING `Personal - Possibly Not JIRAH\Soccer\` |
| `OLGC Letterhead Template - Nov 2024.docx` | HOLDING (OLGC volunteer or client?) |
| `Reflections Questions Example.docx` | HOLDING `Joshua Personal Archive\MBA Teaching\` |
| `Joshua @ jirahgrowth.consulting.url` | DELETE (shortcut, no value) |
| `desktop.ini`, `.849C9593-...` | LEAVE (system files) |

---

## Section F: Documents - JIRAH Growth Sharepoint

Phantom mount — only 2 files (in `7. Volunteering\`) with overlap to JGP-Shared `7. Volunteering\`. After main migration completes:
- Verify the 2 files are duplicates of JGP-Shared content
- Action: Unpin the SharePoint sync from Joshua's machine (don't delete the library — Jason may still need it; just stop syncing locally)

## Section G: Phase 5 promotion checklist

After Phases 3 + 4 complete and JGP-Shared is empty except for `NEW - JIRAH MASTER\` and lock files:

1. Verify `NEW - JIRAH MASTER\` contains all expected migrated content
2. Verify `01 - Clients\` through `06 - Ops Command Center\` look correct under `NEW - JIRAH MASTER\`
3. Move children of `NEW - JIRAH MASTER\` up one level into `JGP-Shared\` root
4. Delete the empty `NEW - JIRAH MASTER\` folder
5. Update `dashboard/.env.local` `ONEDRIVE_ROOT` if path changed (likely unchanged)
6. Verify skills: `/jirah-new-client`, `/jirah-file-sort`, `/jirah-daily-briefing` etc still resolve correct paths
7. Update `CLAUDE.md` if any path references need correction
8. Joshua reviews `_REVIEW - To Sort\` at his pace; items either move back into NEW or move to OneDrive personal root

---

## Resolutions (2026-04-26)

1. **Headshots:** Keep `Adam\` only → `03 - Marketing & Content\Brand Assets\7_Headshots\Adam\`. Dailene, Joshua personal, Taylor + 8 loose root files → HOLDING `Archive Candidates\Headshots Pending Delete\` (staged delete — Joshua can purge).
2. **Clear Way Logos, DoorKraft Logo, Hat Design 2023:** DELETE → HOLDING `Archive Candidates\Marketing Deletes\` (staged delete).
3. **VJHF Files:** HOLDING `Joshua Personal Archive\VJHF Files\` (prior NFP role).
4. **Hello Fresh + Stollery Kids documents:** Reference templates → `04 - Deliverable Templates\Reference Frameworks\Hello Fresh\` and `\Stollery Kids\`.
5. **76 MB JIRAH Report Template:** Move per manifest. Joshua to review for brand-update pass in Claude after migration.
6. **Cressman Homes:** No client folder. Proposal lives in `02 - Sales & Pipeline\Prospects\_Historical Proposals\`.
7. **Inactive client folders:** Flat (no `_template` scaffold). Active clients still get full template.
