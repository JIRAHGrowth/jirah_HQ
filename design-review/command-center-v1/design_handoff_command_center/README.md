# Handoff: JIRAH Growth Partners — Command Center

## Overview
A single-page internal dashboard for JIRAH Growth Partners — a boutique growth-consulting firm run by two partners (Jason + Joshua) that operates as an "Extended CEO team" for owner-run B2B services firms. The Command Center is their daily operating surface: pipeline, inbound audit applications, active engagements, and a generated briefing.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing intended look and behavior, not production code to copy directly. The task is to **recreate these HTML designs in the target codebase's existing environment**. The user has stated they will be building the real thing in **Next.js**, so use that (App Router is recommended). Use the codebase's established patterns, component library, and styling approach — if none exists yet, Tailwind + shadcn/ui is a good default match for this aesthetic.

## Fidelity
**High-fidelity (hifi)**. Colors, typography, spacing, badge variants, and interactions are all final. Recreate pixel-perfectly using the target stack's primitives. Data is placeholder but structure should be preserved.

## Tech Recommendation (Next.js)
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS with CSS variables for tokens listed below
- **Fonts**: `next/font/google` for Playfair Display + DM Sans
- **Icons**: `lucide-react` (thin weight, 14–18px)
- **State**: React useState for tab + drawer. No global store needed at this stage.
- **Data**: Inline mock data to start; backend schema notes below.

## Screens / Views

The app is a single page with persistent chrome (header, focus bar, tabs, right-side briefing panel) and one of three main views switched by the tabs.

### Global Layout
- CSS grid, two columns: main content (flex) + briefing panel (340px fixed).
- Below 1200px: stacks to single column, briefing moves to bottom.
- Header spans full width and contains: brand bar → focus bar → tabs.

### 1. Brand Bar (persistent header)
- Height: ~62px, padding 18px 40px 14px.
- Left: circular navy mark (30px, gold "J") + serif wordmark "JIRAH Growth Partners" (20px Playfair 500) + uppercase kicker "COMMAND CENTER" (11px DM Sans, 0.18em tracking, muted).
- Right: date pill (white bg, 1px border, 999px radius, calendar icon + "Saturday, April 18"), vertical 1px separator, "Jason · Joshua" label, two owner avatars.
- Border bottom: 1px var(--border).

### 2. Focus Bar (persistent, under brand bar)
- Navy background (#111827), ~90px tall, 4 equal columns separated by thin rgba(255,255,255,0.08) dividers.
- Each chip: uppercase label (10.5px, 0.16em tracking, warm-white 65%), large serif number (32px Playfair, gold #C5A55A), muted hint (11.5px, warm-white 55%), thin icon top-right.
- Chips:
  1. "Overdue Follow-ups" — 3 — "2 since Monday" — AlertTriangle — clickable (jumps to briefing scroll)
  2. "Audit Apps Pending" — 5 — "Awaiting triage" — ClipboardList — jumps to Audit tab
  3. "Engagements at Risk" — 1 — "Cascade Physio" — Flame — jumps to Engagements tab
  4. "Content This Week" — "Not started" (rendered as sans 16px uppercase, muted) — "Thought-piece draft" — FileText — static/no jump
- Hover: background rgba(255,255,255,0.04).

### 3. Tabs
- Below focus bar, padding 0 40px, 1px bottom border.
- Three tabs: Pipeline (13), Audit Applications (8), Active Engagements (3). Count shown in small pill (11px, navy@8% bg).
- Selected tab: ink color, 2px gold bottom border (overlaps the 1px container border).
- Unselected: --ink-soft, hover → --ink.

### 4. Pipeline View (tab)
**Kanban board**: 6 columns — Cold · Warm · Meeting Booked · Proposal Sent · Closed Won · Closed Lost.
- View header: serif title (28px) + sub ("13 opportunities · $Nk weighted across stages") + Filter + "Add opportunity" (primary navy) buttons.
- Columns: navy@4% bg, 1px border, 8px radius, 12px padding, min-height 420px. Column head: small dot (7px, color per stage) + uppercase stage label + count. Below: small muted "$Nk potential" summary line.
- Card (`.kcard`): white bg, 1px border, 8px radius, 12px padding, flex column 8px gap.
  - Top row: serif company name (16px, line-height 1.2) + owner avatar (navy "JL" 22px / gold "JM" 22px).
  - Meta row: industry tag (pill, navy@4% bg) + geo tag (outlined pill with MapPin).
  - Footer row (1px dashed top border): left = Clock icon + "Last contact Nd ago" (11.5px, --ink-soft); right = if stage has nextAction → "Next · Apr 22" (ink, 500), else → serif $Nk value.
  - Hover: border-strong, translate(-1px).
- Click card → Pipeline drawer.

**Stage dot colors**: Cold=slate #334155, Warm=amber #B45309, Booked=blue #1D4ED8, Proposal=indigo #4338CA, Won=green #047857, Lost=gray #6B7280.

### 5. Audit Applications View (tab)
**Table**:
- View header: serif title + sub + "Export CSV" ghost + "Open triage queue" primary.
- Filter chips row: All / Pending / Shortlisted / Accepted / Declined. Active = navy pill, warm-white text.
- Table wrap: white card, 1px border, overflow hidden.
- Columns: Applicant (serif name + muted company sub), Submitted (tabular nums), ICP Score (big serif number + 6px bar), Status (badge), empty (Triage button).
- Header row: bg --bg-alt, uppercase 10.5px labels 0.14em. Sortable headers (Submitted, ICP Score) show caret ↕ / ▲ / ▼; active sort caret in gold.
- Row: 16px 18px padding, hover → navy@4% bg, cursor pointer → opens Audit drawer.
- ICP color tiers: <40 red #B42318, 40–70 amber #B45309, >70 green #047857. Bar uses matching fill at same hue.

### 6. Active Engagements View (tab)
**Card grid**: 3 columns, 18px gap (stacks to 1 below 1200px).
- Each card: white, 1px border, 12px radius, 22px padding, min-height 300px, flex column 18px gap.
  - Head: serif name (22px) + uppercase industry/geo kicker (11px, 0.08em) + stack of two owner avatars (lead + partner).
  - **Stepper**: 6 equal steps in a horizontal flex with connecting 1px line behind circles. Each step = 18px circle + uppercase label (9.5px, 0.04em).
    - Done: navy circle filled with white check; connector line navy.
    - Current: gold circle with 4px rgba(197,165,90,0.18) glow ring; label --ink, weight 600.
    - Future: outlined circle (--bg fill, border-strong), muted label.
  - **Milestone block**: --bg fill, 1px border, 12px padding. Gold Target icon + uppercase "Current milestone" label + serif milestone name (15px) + muted due label.
  - Footer (1px top border, margin-top auto): left = Clock icon + "Last contact Nd ago" (warn state uses AlertTriangle + amber-ink color); right = "Step N / 6" uppercase.
- Click card → Engagement drawer.

**Steps** (keep short to fit card width): Discovery · Disc. Doc · Kickoff · Sprint · Report · KPIs.

### 7. Today's Briefing Panel (persistent right side)
- 340px wide, background #FCFAF3, 1px left border, 28px/24px padding.
- Header: uppercase gold kicker "TODAY'S BRIEFING" (10px, 0.2em) + serif date "Saturday, April 18" (22px) + muted meta "Partner sync · 8:30 AM PT · Prepared by Claude".
- Three sections, each: uppercase 10.5px heading + small colored pill count (red/amber/gold wash).
  1. **Overdue** (red pill, 2 items) — items: serif name + right-aligned "N days" label + muted body + gold-underlined "Open drafted reply →" CTA.
  2. **Sprint Risks** (amber pill, 1 item) — same item layout.
  3. **Warm Prospects** (gold pill, 2 items) — same item layout.
- Dashed bottom border between items in the same section.
- Footer: italic muted "Briefing regenerates at 6am daily from pipeline, engagements and inbox signal."

### 8. Detail Drawer (shared)
- Fixed right, 480px wide, full height, white bg, shadow -12px 0 40px rgba(17,24,39,0.12).
- Backdrop: rgba(17,24,39,0.28), closes on click. Esc also closes.
- Header: 22px/26px padding, 1px bottom border, gold uppercase kicker + serif title (24px) + pills/badges row + close X.
- Body: scrollable, sectioned. Each section: uppercase small heading + `.kv-row` grid (130px label · 1fr value, dashed bottom border).
- Timeline component used for activity: 1px left border, 16px padding, gold ring dot per item, uppercase date + body.
- Footer: 16px 26px, 1px top border, right-aligned button row. Primary action uses gold button (`.btn-gold`, bg #C5A55A, ink #1B1500).

Drawer variants by opener:
- **Pipeline**: Overview (owner, contact, source, est. value, last contact, next action) + Working notes + Recent activity. Actions: Log email / Schedule follow-up / Move to next stage (gold).
- **Audit**: ICP fit (giant colored number + bar) + Applicant (contact, role, company, revenue, headcount) + Why they applied. Actions: Decline / Shortlist / Accept to discovery (gold).
- **Engagement**: Progress (full stepper + current-step summary) + Engagement (sponsor, contract, lead, partner, last contact) + Recent activity timeline. Actions: Log contact / Schedule sync / Advance to next step (gold).

## Interactions & Behavior
- **Tab switching** via top tab bar; persisted to `localStorage.jirah_tab`.
- **Card click** → opens the matching drawer.
- **Drawer close** via backdrop click, X button, or Escape key.
- **Focus chips** 1–3 navigate to respective tab; chip 4 is static.
- **Audit table** sort by ICP score and Submitted date (asc/desc). Status filter chips narrow the row set.
- **Audit row click** opens drawer; the inline "Triage" button also opens it (stopPropagation).
- **Hover states**: cards lift by translate(-1px) and strengthen border; table rows tint to navy@4%; buttons tint to navy@4% or darker for filled variants.
- **No drag-and-drop** on kanban (explicitly out of scope for this phase).

## State Management
- `tab`: 'pipeline' | 'audit' | 'engagements' — persisted.
- `drawer`: `{ kind: 'pipeline'|'audit'|'engagement', item } | null`.
- Audit view local: `sortKey`, `sortDir`, `filter`.
- No data fetching in the prototype. In the real app, each view maps to one API/route handler.

## Design Tokens

### Colors
```
--gold:        #C5A55A   (primary accent)
--gold-soft:   #E8DAB2
--gold-wash:   #F5EEDC

--navy:        #111827   (primary dark)
--navy-80/60/40/20/12/08/04: alpha steps on #111827

--bg:          #FAF7F0   (warm off-white page)
--bg-alt:      #F3EFE4   (table header)
--card:        #FFFFFF

--border:        rgba(17,24,39,0.08)
--border-strong: rgba(17,24,39,0.16)

--ink:         #111827
--ink-soft:    #4B5563
--muted:       #6B7280

Status pairs (ink / wash):
  red    #B42318 / #FEF2F2
  amber  #B45309 / #FEF6E7
  green  #047857 / #ECFDF4
  blue   #1D4ED8 / #EFF4FE
  indigo #4338CA / #F0EFFC
  slate  #334155 / #F1F3F6
```

### Typography
- Headings & stat numerals: **Playfair Display** 400/500/600, letter-spacing -0.01em.
- Body, labels, tables: **DM Sans** 400/500/600/700.
- Body base 14px / 1.45. Uppercase labels 10.5–11px with 0.14–0.18em tracking.
- Serif 16px for card names, 22–28px for screen/section titles, 32px for focus-bar stat numbers.

### Spacing / Radii / Shadows
- Radii: `--radius-sm` 4px, `--radius` 8px, `--radius-lg` 12px.
- Generous spacing — card padding 12–22px, view main padding 28px 40px 56px.
- No heavy shadows. Drawer uses -12px 0 40px rgba(17,24,39,0.12). Gold current-step ring: 0 0 0 4px rgba(197,165,90,0.18).

### Owner badges
- 22px circles, 9.5px semi-bold letters.
  - JL: navy #111827 background, white text.
  - JM: gold #C5A55A background, #2B1F00 text.

## Assets
- No bitmap assets. All icons are lucide-react-equivalent SVGs rendered inline.
- Fonts from Google Fonts: Playfair Display, DM Sans.

## Data Shape (inline mock — replace with API)

```ts
type PipelineItem = {
  id: string;
  name: string;
  stage: 'cold'|'warm'|'booked'|'proposal'|'won'|'lost';
  industry: string;
  geo: string;
  owner: 'JL'|'JM';
  lastContactDays: number;
  nextAction: string; // ISO date or '—'
  value: number;
  contact: string;
  source: string;
  notes: string;
};

type AuditApp = {
  id: string;
  applicant: string;
  contact: string;
  role: string;
  company: string;    // "Name (Industry, Region)"
  submitted: string;  // ISO date
  icp: number;        // 0-100
  status: 'pending'|'shortlist'|'accepted'|'declined';
  revenue: string;    // "$11.2M"
  staff: number;
  why: string;
};

type Engagement = {
  id: string;
  name: string;
  industry: string;
  geo: string;
  owner: 'JL'|'JM';
  coOwner: 'JL'|'JM';
  currentStep: 0|1|2|3|4|5;   // 0=Discovery … 5=KPIs
  milestone: string;
  dueLabel: string;
  lastContactDays: number;
  warn?: boolean;
  contract: string;
  sponsor: string;
  timeline: { date: string; body: string }[];
};

type Briefing = {
  date: string;
  overdue: BriefingItem[];
  sprint:  BriefingItem[];
  warm:    BriefingItem[];
};
type BriefingItem = { id: string; name: string; when: string; body: string; cta: string };
```

## Files in this bundle
- `Command Center.html` — entry HTML with font + script imports
- `styles.css` — all styles, CSS variable tokens at top
- `data.js` — mock data (pipeline, audits, engagements, briefing)
- `shared.jsx` — Avatar, StageBadge, AuditBadge, Ic (icon set), formatters
- `shell.jsx` — FocusBar, Tabs, Drawer, DrawerHead, KV
- `pipeline.jsx` — PipelineView, PipelineDrawer
- `audit.jsx` — AuditView, AuditDrawer
- `engagements.jsx` — EngagementsView, EngagementDrawer, Stepper
- `briefing.jsx` — BriefingPanel
- `app.jsx` — root App composition

## Build Notes for the Developer
1. Stand up the Next.js app and install Tailwind + lucide-react + the two Google fonts.
2. Port tokens from `styles.css` `:root` block to `tailwind.config.ts` extensions (or a `globals.css` `:root` if staying close to vanilla CSS).
3. Build the shared primitives first: Avatar, StageBadge, AuditBadge, Button (variants: default, primary, gold, ghost, sm), Tag, Drawer.
4. Port each view, keeping the markup structure in the reference HTML — the JSX is close to one-to-one translatable.
5. Swap the inline mock data for real API routes once the UI lands.
6. Mobile is out of scope for this phase — focus on ≥1200px desktop; below 1200px is a graceful stack, not a redesigned mobile UI.
