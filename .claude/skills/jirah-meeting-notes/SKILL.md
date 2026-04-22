---
name: jirah-meeting-notes
description: Turn a Fireflies transcript into clean meeting notes (PDF) plus a follow-up email draft (in chat). Use when Jason or Joshua drop a Fireflies transcript and say "meeting notes", "write up this meeting", "turn this into notes", "notes + follow-up", "send me notes on this call", or paste/attach a `.md`, `.txt`, or `.vtt` Fireflies file. NOT for Jirah methodology pattern work — that's `/jirah-session-analyzer`. This skill is the everyday hygiene pass: summary, decisions, action items with owner+deadline, open questions → PDF. Plus a partner-voice follow-up email draft rendered in chat for Jason to paste and send.
---

# /jirah-meeting-notes

## Purpose

Every meeting Jirah runs generates a Fireflies transcript. This skill turns that raw transcript into two artifacts Jason actually uses:

1. **Meeting notes PDF** — saved next to the transcript. Sections: Summary, Decisions, Action Items (with owner + deadline), Open Questions.
2. **Follow-up email draft** — rendered in chat, in Jirah partner voice, ready to paste into Gmail.

This is distinct from `/jirah-session-analyzer`, which does deep pattern work (language shifts, contradictions, friction-point tags) for diagnostic purposes. Run *this* skill for every meeting. Run *that* skill on top when the session is a Jirah audit/sprint/interview that needs pattern intelligence.

## When to invoke

- Transcript dropped in chat with phrases like "meeting notes", "write this up", "notes + follow-up", "summarize this call", "send notes to [name]"
- A Fireflies file path is pasted (`.md`, `.txt`, `.vtt`)
- Jason or Joshua explicitly types `/jirah-meeting-notes <path>`

Works for any meeting type — client discovery, sprint session, prospect call, internal partner sync, advisor call. Output adapts to meeting type.

## Inputs

**Required:**
- Transcript file path OR pasted transcript text.

**Optional (ask only if genuinely ambiguous):**
- Meeting title/topic (usually in transcript filename or first few lines)
- Attendees (usually in transcript header)
- Who the follow-up email goes to (default: the other side of the meeting — the non-Jirah party)
- Whether to auto-file the PDF to a client folder (default: save next to transcript; ask if client is obvious)

Don't ask for things you can extract from the transcript. Read first, ask second.

## Workflow

### Step 1: Load the transcript

- If path given, read it with the Read tool.
- If pasted, work from the pasted text.
- Pull from the transcript: date, attendees, meeting title/topic, duration if present.

### Step 2: Classify the meeting type

Same taxonomy as `/meeting-prep-jason`:
- JIRAH discovery (prospect)
- JIRAH existing client (sprint session, retainer check-in, audit conversation)
- Partnership / referral conversation
- Intro / network call
- Internal partner sync (Jason + Joshua)
- AI build / technical working session

Classification shapes emphasis — a discovery call's "decisions" will be about next steps and fit; a sprint session's "decisions" will be about the engagement work itself.

### Step 3: Extract the four sections

**Summary** (1 paragraph, 4–6 sentences max)
- What the meeting was about
- The shape of the conversation (not a blow-by-blow — the arc)
- Where it landed

**Decisions** (bullet list)
- Anything explicitly agreed to
- Anything tacitly accepted (someone proposed X, nobody objected, the conversation moved on)
- Include *who* agreed, when relevant
- Skip non-decisions ("we should probably look at that" without commitment belongs in Open Questions)

**Action Items** (table-style)
- Each action item must have: **Owner** (name, not "someone"), **Action**, **Deadline** (specific date if stated; otherwise best inference like "before next sprint session" or "this week")
- If a deadline was never stated and can't reasonably be inferred, write "TBD — Jason to set" rather than inventing one
- Separate Jirah-side actions from client/other-party-side actions if both exist
- Flag any action item where the owner is ambiguous — don't guess silently

**Open Questions** (bullet list)
- Things raised but not resolved
- Explicit parking-lot items
- Things Jason/Joshua should dig into before next touchpoint
- Things the other side said they'd come back on (also appears in their action items, but surface it here too so nobody forgets)

### Step 4: Build the HTML

Use the embedded template (see below). Clean, professional, scannable. Not Jirah-branded with heavy visuals — this is an internal/shared working document, not a client deliverable. Default to neutral professional typography.

Save the HTML to a temp path (resolves to the current user's temp folder on either machine):
```
%TEMP%\jirah-meeting-notes-<timestamp>.html
```

### Step 5: Convert to PDF via Edge headless

Microsoft Edge ships with Windows 11. Use its headless print-to-PDF mode:

```bash
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
  --headless \
  --disable-gpu \
  --print-to-pdf="<output_pdf_path>" \
  --print-to-pdf-no-header \
  "<input_html_path>"
```

**Output path logic:**
- If transcript is a file, save PDF next to it: same folder, same basename, `.pdf` extension, with `-notes` suffix.
  - e.g. `AI-Trevor-and-Jason-54f4d8bf-3abe.md` → `AI-Trevor-and-Jason-54f4d8bf-3abe-notes.pdf`
- If no source file (pasted text only), save to `%USERPROFILE%\Documents\meeting-notes\YYYY-MM-DD-<slug>.pdf` (resolves per-machine to Jason's or Joshua's user profile).
- If the meeting clearly ties to an active Jirah client and the user asked to file it there, save to that client's `06 - Sprint & Facilitation\` or `08 - Monthly Retainer\` folder as appropriate. Ask before auto-filing to a client folder.

Verify the PDF was written before moving on.

### Step 6: Draft the follow-up email (render in chat, not in the PDF)

Partner voice (see `context/jirah-voice.md` for rules). Default conventions:
- **From:** Jason (solo) OR Jason + Joshua together (if joint meeting) — match who was on the call
- **Sign-off:** "Jason" or "Jason and Joshua" — never "Team Jirah" or first-name only with no close
- **Tone:** peer-to-peer, direct, no corporate filler, no "hope this finds you well", no "just circling back"
- **Structure:**
  1. One line thanks + reference to the specific thing that stood out
  2. Brief recap of what was agreed (bullets, not prose)
  3. Clear next step with who owns it + timeline
  4. Open door — specific, not generic ("if X question comes up as you think through it, send it over")

Render the email in chat as a code block (so Jason can copy verbatim) with subject line on top.

### Step 7: Report back

Short summary in chat:
- Path to PDF
- PDF sections confirmed (summary / decisions / actions / open questions)
- Follow-up email rendered above
- Flag anything ambiguous Jason should verify (action item owners, deadlines, decisions he may have missed)

## HTML template

Use this structure. Inline CSS. No external dependencies except Google Fonts via `<link>`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Meeting Notes — {{TITLE}}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  @page { size: Letter; margin: 0.75in; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #1a1a1a;
    line-height: 1.55;
    font-size: 11pt;
    margin: 0;
    padding: 0;
  }
  .header {
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 12px;
    margin-bottom: 24px;
  }
  .header .eyebrow {
    font-size: 9pt;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #6b6b6b;
    font-weight: 600;
  }
  .header h1 {
    font-size: 20pt;
    font-weight: 700;
    margin: 4px 0 8px 0;
    line-height: 1.2;
  }
  .header .meta {
    font-size: 10pt;
    color: #4a4a4a;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  .header .meta span { white-space: nowrap; }
  h2 {
    font-size: 13pt;
    font-weight: 600;
    margin: 24px 0 10px 0;
    padding-bottom: 4px;
    border-bottom: 1px solid #e0e0e0;
    color: #1a1a1a;
  }
  h2:first-of-type { margin-top: 0; }
  p { margin: 0 0 10px 0; }
  ul { margin: 0 0 10px 0; padding-left: 20px; }
  li { margin-bottom: 6px; }
  .summary p { color: #2a2a2a; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 14px 0;
    font-size: 10.5pt;
  }
  thead th {
    text-align: left;
    font-weight: 600;
    font-size: 9.5pt;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #6b6b6b;
    padding: 8px 10px 8px 0;
    border-bottom: 1.5px solid #1a1a1a;
  }
  tbody td {
    padding: 10px 10px 10px 0;
    vertical-align: top;
    border-bottom: 1px solid #eeeeee;
  }
  tbody td.owner { font-weight: 600; white-space: nowrap; width: 18%; }
  tbody td.deadline { color: #6b6b6b; white-space: nowrap; width: 20%; font-size: 10pt; }
  .side-label {
    font-size: 9.5pt;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #6b6b6b;
    margin: 14px 0 6px 0;
  }
  .footer {
    margin-top: 32px;
    padding-top: 10px;
    border-top: 1px solid #e0e0e0;
    font-size: 9pt;
    color: #8a8a8a;
    font-family: 'JetBrains Mono', monospace;
  }
</style>
</head>
<body>
  <div class="header">
    <div class="eyebrow">Meeting Notes</div>
    <h1>{{TITLE}}</h1>
    <div class="meta">
      <span><strong>Date:</strong> {{DATE}}</span>
      <span><strong>Attendees:</strong> {{ATTENDEES}}</span>
      {{DURATION_BLOCK}}
    </div>
  </div>

  <h2>Summary</h2>
  <div class="summary">
    <p>{{SUMMARY}}</p>
  </div>

  <h2>Decisions</h2>
  <ul>
    {{DECISIONS_LIST}}
  </ul>

  <h2>Action Items</h2>
  {{ACTIONS_BLOCK}}

  <h2>Open Questions</h2>
  <ul>
    {{OPEN_QUESTIONS_LIST}}
  </ul>

  <div class="footer">
    Source: {{SOURCE_FILENAME}} · Generated {{GENERATED_AT}}
  </div>
</body>
</html>
```

**Action Items block format** (inside `{{ACTIONS_BLOCK}}`):

```html
<div class="side-label">Jirah</div>
<table>
  <thead><tr><th>Owner</th><th>Action</th><th>Deadline</th></tr></thead>
  <tbody>
    <tr><td class="owner">Jason</td><td>...</td><td class="deadline">...</td></tr>
  </tbody>
</table>

<div class="side-label">Client / Other Party</div>
<table>
  <thead><tr><th>Owner</th><th>Action</th><th>Deadline</th></tr></thead>
  <tbody>
    <tr><td class="owner">Trevor</td><td>...</td><td class="deadline">...</td></tr>
  </tbody>
</table>
```

If only one side has action items, skip the empty side-label/table entirely.

## Voice rules for the follow-up email

These extend `context/jirah-voice.md`. Specific to meeting follow-ups:

- **Subject line:** specific, not generic. "Recap + next step on [specific thing]" beats "Following up".
- **No filler openers.** Skip "great to connect today" on its own — pair it with a *specific* thing that stood out from the call.
- **Bullets for what was agreed.** Makes it easy for the other side to confirm or correct.
- **One clear next step.** Not three. Not "let me know what you think" as the close. Something the recipient can say yes/no to.
- **Sign Jason + Joshua** if both were on the call. Sign just Jason if only he was.
- **Never invent details** the transcript doesn't support. If the transcript is ambiguous about a deliverable, say "want to confirm — [X] by [Y], correct?" rather than stating it.

## Anti-patterns

- **No generic summaries.** "We discussed business opportunities." — delete and rewrite. Every sentence in the summary should be specific to *this* meeting.
- **No hallucinated action items.** If nobody committed to doing something, it's an Open Question, not an Action Item.
- **No fake deadlines.** "By end of week" only if someone said end of week. Otherwise "TBD".
- **No padding the PDF** to look more substantial. Four crisp sections beat eight bloated ones.
- **No Jirah-methodology depth** in this skill (no friction-point tags, no confidence ratings, no triangulation notes). That's `/jirah-session-analyzer`.
- **No auto-filing to client folders without asking.** Save next to transcript by default.
- **No opening Edge visibly.** Must use `--headless`. Jason should never see a browser window pop up.

## Related

- `/jirah-session-analyzer` — deep pattern extraction for Jirah audit/sprint/interview methodology (run *after* this skill when methodology work is needed)
- `/jirah-sprint-facilitation` — upstream orchestrator during active engagements
- `/jirah-email` — general partner-voice email drafting (this skill embeds a simplified version for follow-up only)
- Context: [context/jirah-voice.md](../../../context/jirah-voice.md)
