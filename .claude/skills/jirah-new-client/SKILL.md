---
name: jirah-new-client
description: Create a new Active Client folder from the template, fill frontmatter, and cross-reference the AI workspace if applicable. Invoke when Jason or Joshua say "we just signed X" or "new client onboarding for Y".
---

# /jirah-new-client

## Purpose
Scaffold a new Active Client folder under OneDrive with the standard Jirah file set so that the client is immediately visible in the dashboard, daily briefing, and team workflows.

## Pre-requisites

Read before acting:
- [context/jirah-process.md](../../../context/jirah-process.md) — 6-step engagement flow (new clients start at Step 1: Discovery)
- [context/jirah-team.md](../../../context/jirah-team.md) — division of labor (for owner/co-owner)

## Inputs (ask if not supplied)
- **Client name** (e.g., "Summit Engineering Partners")
- **Primary owner** (JL or JM — which partner leads)
- **Co-owner** (the other partner)
- **Industry** (e.g., "Engineering", "Healthcare", "Accounting")
- **Geo** (e.g., "BC", "AB", "ON")
- **Contract value** (e.g., "$96,000 · 6 months")
- **Sponsor** (client-side contact, e.g., "Maya Linares, President")
- **Is AI pilot in scope?** (yes/no)

## Process

1. **Resolve OneDrive root.** Read `ONEDRIVE_ROOT` from `dashboard/.env.local` at the workspace root — that value is the per-machine path to the `NEW - JIRAH MASTER` folder (Jason's and Joshua's differ; OneDrive prefixes shared folders with the owner's name on the receiving side). **Locate template** at `[ONEDRIVE_ROOT]\01 - Clients\_template\`. If `ONEDRIVE_ROOT` is unset or the path doesn't resolve, stop and ask the user to configure `dashboard/.env.local`.
2. **Copy to new folder** at `01 - Clients\Active\[Client Name]\` using the client name verbatim. The template carries the full numbered scaffold (03 - Admin → 10 - Harvest).
3. **Fill `00 - Profile.md` frontmatter**:
   - `id` — slug of client name (lowercase, dashes)
   - `name` — client name
   - `industry`, `geo`, `owner`, `coOwner` — from inputs
   - `currentStep: 0` (Discovery)
   - `milestone: "Discovery kickoff"`
   - `dueLabel` — "Due " + (today + 2 weeks)
   - `lastContactDays: 0`
   - `contract` — contract value string
   - `sponsor` — sponsor string
   - `status: active`
   - `created` — today's date (ISO)
4. **Seed `02 - Comms Log.md`** with today's entry: "Engagement opened. Contract signed, kickoff in scheduling."
5. **Cross-reference AI workspace** if AI pilot scope:
   - Create `~\Desktop\Jirah-AI-[ClientName]\` directory
   - Add "Related workspaces" section to `00 - Profile.md` body pointing at the AI workspace path
   - Note: the client folder already has a `09 - AI Pilot/` subtree ready for pilot-plan and artifacts
6. **Update `seed-data/active-clients/index.md`** (if present) to include new client (dashboard-dev fallback).
7. **Confirm with user** — echo new folder path + what was filled. Ask if anything needs adjustment.

## Output

- New Active client folder at `01 - Clients\Active\[Client Name]\` with:
  - Root files: `00 - Profile.md` (filled), `01 - Engagement Plan.md`, `02 - Comms Log.md` (seeded)
  - Numbered subtrees (all present, most empty at creation):
    - `03 - Admin/` (Contract & DocuSign / Welcome Letter / Invoices)
    - `04 - Client Source Files/` (Financial / Legal & Governance / Policies & Handbooks / Marketing & Collateral)
    - `05 - Discovery & Discussion Doc/`
    - `06 - Sprint & Facilitation/` (Pre-read & Questionnaire / Interview Guides / Session Recordings & Transcripts / Facilitator Notes / Stakeholder Interviews)
    - `07 - Deliverables/` (Drafts / Final / Appendices)
    - `08 - Monthly Retainer/` (Monthly Meetings)
    - `09 - AI Pilot/` (Weekly Status / Artifacts)
    - `10 - Harvest/`
- Optional AI workspace at `~\Desktop\Jirah-AI-[Name]\`
- Echo confirmation

## After scaffolding

If the client already sent documents (contract, financials, policies, marketing collateral), run `/jirah-file-sort` next and point it at the directory those files are in — it'll classify and move them into the correct numbered subfolders inside the new client folder.

## Edge cases

- Client name has special characters — normalize for folder name; keep original in frontmatter `name`.
- Client already exists under Active or Inactive — warn, don't overwrite. Ask if we should reactivate an inactive client instead.
- OneDrive path doesn't resolve — show the path attempted and ask user to verify OneDrive is synced.
- Partner / owner not confirmed — don't guess. Ask explicitly.
