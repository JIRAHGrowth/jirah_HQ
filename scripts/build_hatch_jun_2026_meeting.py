"""
Build the editable .docx for the Hatch + JIRAH monthly meeting — June 2026.

Mirrors the structure of the January 2026 meeting doc (EOS-style agenda
with Rocks Tracker / Scorecard / Issues List tables) and refreshes the
content using April 23 session notes, the April tracker, and the post-
May 13 Amir partnership state.

Designed to be marked up live during the meeting and shared back with
Rachel + Shanna afterward.
"""

from pathlib import Path
from docx import Document
from docx.shared import Pt, RGBColor, Inches, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_ALIGN_VERTICAL
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

# ─── Brand palette (matches the Amir doc builder) ─────────────────────────
NAVY = RGBColor(0x0F, 0x26, 0x33)
PLUM = RGBColor(0x38, 0x21, 0x36)
GOLD = RGBColor(0xC7, 0xAD, 0x66)
GOLD_PALE = RGBColor(0xEC, 0xE2, 0xC6)
CREAM = RGBColor(0xF7, 0xF4, 0xE9)
INK = RGBColor(0x0F, 0x26, 0x33)
INK_MID = RGBColor(0x4A, 0x59, 0x68)
INK_LIGHT = RGBColor(0x7B, 0x86, 0x93)
RULE = RGBColor(0xD9, 0xD3, 0xBD)

DISPLAY_FONT = "Cambria"
BODY_FONT = "Calibri"

from _paths import ACTIVE_CLIENTS, assert_no_legacy_segment

OUT_PATH = (
    ACTIVE_CLIENTS
    / "Hatch Interior Design"
    / "08 - Monthly Retainer"
    / "Monthly Meetings"
    / "Hatch_JIRAH Monthly Meeting - Jun 2026.docx"
)
assert_no_legacy_segment(OUT_PATH)


# ─── Helpers ──────────────────────────────────────────────────────────────
def set_cell_bg(cell, hex_colour):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_colour)
    tc_pr.append(shd)


def set_cell_border(cell, side, hex_colour, sz=8):
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_borders = tc_pr.find(qn("w:tcBorders"))
    if tc_borders is None:
        tc_borders = OxmlElement("w:tcBorders")
        tc_pr.append(tc_borders)
    border = OxmlElement(f"w:{side}")
    border.set(qn("w:val"), "single")
    border.set(qn("w:sz"), str(sz))
    border.set(qn("w:color"), hex_colour)
    tc_borders.append(border)


def add_run(paragraph, text, *, font=BODY_FONT, size=11, bold=False,
            italic=False, color=INK):
    run = paragraph.add_run(text)
    run.font.name = font
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    rpr = run._element.get_or_add_rPr()
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = OxmlElement("w:rFonts")
        rpr.append(rfonts)
    rfonts.set(qn("w:ascii"), font)
    rfonts.set(qn("w:hAnsi"), font)
    return run


def heading(doc, text, *, size=20, color=NAVY, space_before=18, space_after=8,
            bottom_border_color=None):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.space_before = Pt(space_before)
    pf.space_after = Pt(space_after)
    add_run(p, text, font=DISPLAY_FONT, size=size, bold=True, color=color)
    if bottom_border_color is not None:
        p_pr = p._element.get_or_add_pPr()
        p_bdr = OxmlElement("w:pBdr")
        bottom = OxmlElement("w:bottom")
        bottom.set(qn("w:val"), "single")
        bottom.set(qn("w:sz"), "8")
        bottom.set(qn("w:space"), "4")
        bottom.set(qn("w:color"), bottom_border_color)
        p_bdr.append(bottom)
        p_pr.append(p_bdr)
    return p


def subheading(doc, text, *, size=13, color=PLUM, space_before=12,
               space_after=4):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.space_before = Pt(space_before)
    pf.space_after = Pt(space_after)
    add_run(p, text, font=DISPLAY_FONT, size=size, bold=True, color=color)
    return p


def body_para(doc, text=None, *, runs=None, size=11, space_after=6,
              left_indent=None):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.space_after = Pt(space_after)
    if left_indent is not None:
        pf.left_indent = Inches(left_indent)
    if runs:
        for r in runs:
            add_run(p, r["text"], font=r.get("font", BODY_FONT),
                    size=r.get("size", size),
                    bold=r.get("bold", False),
                    italic=r.get("italic", False),
                    color=r.get("color", INK))
    elif text:
        add_run(p, text, size=size)
    return p


def bullet(doc, text=None, *, runs=None, size=11, left_indent=0.25):
    p = doc.add_paragraph(style="List Bullet")
    pf = p.paragraph_format
    pf.space_after = Pt(3)
    pf.left_indent = Inches(left_indent + 0.25)
    if runs:
        for r in runs:
            add_run(p, r["text"], font=r.get("font", BODY_FONT),
                    size=r.get("size", size),
                    bold=r.get("bold", False),
                    italic=r.get("italic", False),
                    color=r.get("color", INK))
    elif text:
        add_run(p, text, size=size)
    return p


def agenda_row(doc, label, minutes):
    """Agenda item — label left, duration right, with a leader dot fill."""
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.space_after = Pt(3)
    # Tab stop on the right margin for the duration
    tab_stops = p.paragraph_format.tab_stops
    tab_stops.add_tab_stop(Inches(7.0), WD_ALIGN_PARAGRAPH.RIGHT)
    add_run(p, label, font=BODY_FONT, size=11, bold=False, color=INK)
    add_run(p, "\t")
    add_run(p, minutes, font=BODY_FONT, size=10, bold=True, color=PLUM)
    return p


def callout_box(doc, *, label, body_runs, fill_hex, accent_hex, label_color):
    """Single-cell callout."""
    table = doc.add_table(rows=1, cols=1)
    table.autofit = False
    table.columns[0].width = Inches(7.0)
    cell = table.cell(0, 0)
    cell.width = Inches(7.0)
    set_cell_bg(cell, fill_hex)
    set_cell_border(cell, "left", accent_hex, sz=24)
    set_cell_border(cell, "top", fill_hex, sz=4)
    set_cell_border(cell, "bottom", fill_hex, sz=4)
    set_cell_border(cell, "right", fill_hex, sz=4)
    cell.text = ""
    label_p = cell.paragraphs[0]
    add_run(label_p, label, font=BODY_FONT, size=8, bold=True,
            color=label_color)
    body_p = cell.add_paragraph()
    body_p.paragraph_format.space_before = Pt(4)
    for r in body_runs:
        add_run(body_p, r["text"], font=r.get("font", BODY_FONT),
                size=r.get("size", 11),
                bold=r.get("bold", False),
                italic=r.get("italic", False),
                color=r.get("color", INK))
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_mar = OxmlElement("w:tcMar")
    for side, val in [("top", 200), ("left", 240),
                      ("bottom", 200), ("right", 240)]:
        m = OxmlElement(f"w:{side}")
        m.set(qn("w:w"), str(val))
        m.set(qn("w:type"), "dxa")
        tc_mar.append(m)
    tc_pr.append(tc_mar)
    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_after = Pt(4)
    return table


def styled_table(doc, headers, rows, *, widths=None,
                 header_bg="0F2633", header_fg=CREAM,
                 alt_bg="F7F4E9"):
    """Generic styled table — navy header, cream alternating rows."""
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.autofit = False
    if widths is None:
        widths = [Inches(7.0 / len(headers))] * len(headers)
    for col_idx, w in enumerate(widths):
        for row in table.rows:
            row.cells[col_idx].width = w
        table.columns[col_idx].width = w

    # Header
    for col_idx, header in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.width = widths[col_idx]
        set_cell_bg(cell, header_bg)
        cell.text = ""
        p = cell.paragraphs[0]
        add_run(p, header, font=DISPLAY_FONT, size=10, bold=True,
                color=header_fg)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

    # Rows
    for r_idx, row_data in enumerate(rows, start=1):
        is_alt = (r_idx % 2 == 0)
        for c_idx, content in enumerate(row_data):
            cell = table.cell(r_idx, c_idx)
            cell.width = widths[c_idx]
            if is_alt:
                set_cell_bg(cell, alt_bg)
            cell.text = ""
            # Each content cell is a list of (text, opts) tuples OR a string
            if isinstance(content, str):
                p = cell.paragraphs[0]
                add_run(p, content, font=BODY_FONT, size=10, color=INK)
            else:
                first = True
                for piece in content:
                    if isinstance(piece, str):
                        text = piece
                        opts = {}
                    else:
                        text, opts = piece
                    if first:
                        p = cell.paragraphs[0]
                        first = False
                    else:
                        p = cell.add_paragraph()
                        p.paragraph_format.space_before = Pt(2)
                        p.paragraph_format.space_after = Pt(0)
                    add_run(p, text, font=opts.get("font", BODY_FONT),
                            size=opts.get("size", 10),
                            bold=opts.get("bold", False),
                            italic=opts.get("italic", False),
                            color=opts.get("color", INK))
            # Light border around every cell
            for side in ("top", "bottom", "left", "right"):
                set_cell_border(cell, side, "D9D3BD", sz=4)
            cell.vertical_alignment = WD_ALIGN_VERTICAL.TOP

    # Spacer after the table
    sp = doc.add_paragraph()
    sp.paragraph_format.space_after = Pt(6)
    return table


def header_block(doc):
    """First-page header — JIRAH wordmark left, doc title right."""
    table = doc.add_table(rows=1, cols=2)
    table.autofit = False
    table.columns[0].width = Inches(3.5)
    table.columns[1].width = Inches(3.5)

    left = table.cell(0, 0)
    left.width = Inches(3.5)
    left.text = ""
    p = left.paragraphs[0]
    add_run(p, "JIRAH", font=DISPLAY_FONT, size=32, bold=True, color=NAVY)
    sub = left.add_paragraph()
    sub.paragraph_format.space_before = Pt(0)
    add_run(sub, "GROWTH PARTNERS", font=BODY_FONT, size=8, bold=True,
            color=PLUM)

    right = table.cell(0, 1)
    right.width = Inches(3.5)
    right.text = ""
    rp = right.paragraphs[0]
    rp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    add_run(rp, "Monthly Meeting", font=DISPLAY_FONT, size=20,
            bold=True, color=NAVY)
    sub = right.add_paragraph()
    sub.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    sub.paragraph_format.space_before = Pt(0)
    add_run(sub, "HATCH INTERIOR DESIGN  ·  DENTAL IDENTITY",
            font=BODY_FONT, size=9, bold=True, color=PLUM)
    date = right.add_paragraph()
    date.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    date.paragraph_format.space_before = Pt(0)
    add_run(date, "JUNE 4, 2026  ·  09:00–10:00  ·  KELOWNA",
            font=BODY_FONT, size=8, color=INK_LIGHT)

    # Bottom rule under the header table
    rule = doc.add_paragraph()
    rule_pr = rule._element.get_or_add_pPr()
    p_bdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "16")
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), "0F2633")
    p_bdr.append(bottom)
    rule_pr.append(p_bdr)
    rule.paragraph_format.space_after = Pt(10)


# ─── Build the document ───────────────────────────────────────────────────
def build():
    doc = Document()

    # Page setup — Letter, narrow margins
    for section in doc.sections:
        section.page_height = Inches(11.0)
        section.page_width = Inches(8.5)
        section.left_margin = Inches(0.55)
        section.right_margin = Inches(0.55)
        section.top_margin = Inches(0.5)
        section.bottom_margin = Inches(0.5)

    style = doc.styles["Normal"]
    style.font.name = BODY_FONT
    style.font.size = Pt(11)
    style.font.color.rgb = INK

    # ── Header
    header_block(doc)

    # ── Framing callout — sets the new posture (more direction, not less)
    callout_box(
        doc,
        label="HOW WE'RE RUNNING THIS MEETING",
        fill_hex="0F2633",
        accent_hex="C7AD66",
        label_color=GOLD,
        body_runs=[
            {"text": "Two brands in motion, one team. ", "bold": True,
             "color": GOLD_PALE, "size": 11},
            {"text": "Hatch is the established core; Dental Identity is the "
                     "growth bet. This month we run a tighter, more "
                     "purposeful rhythm — clear Rocks, clear owners, clear "
                     "due dates — split across the two brands so nothing "
                     "drops between them. ", "color": CREAM, "size": 11},
            {"text": "Goal of today: ", "bold": True, "color": GOLD_PALE,
             "size": 11},
            {"text": "score last month, lock the June Rocks, work the "
                     "Issues List, agree what success looks like by July's "
                     "session.", "color": CREAM, "size": 11},
        ],
    )

    # ── Agenda
    heading(doc, "Agenda", size=18, color=NAVY,
            bottom_border_color="C7AD66", space_before=10, space_after=6)

    agenda_row(doc, "Welcome & Context — focus on implementation of "
                    "items from the strategic plan", "10 min")
    body_para(doc, runs=[
        {"text": "Ground rules: ", "bold": True, "color": NAVY, "size": 10},
        {"text": "start at 9:00, end at 10:00. Phones away. Candor and "
                 "accountability.", "size": 10, "italic": True,
         "color": INK_MID},
    ], left_indent=0.3, space_after=6)

    agenda_row(doc, "Review Core Values, 1-3-10 Year Targets", "5 min")
    agenda_row(doc, "Score last month's Rocks (May commitments)", "10 min")
    agenda_row(doc, "Establish June Rocks — Hatch + Dental Identity",
               "15 min")
    agenda_row(doc, "Issues List — what's blocking, frustrating, costing",
               "15 min")
    agenda_row(doc, "Close & Score Meeting", "5 min")

    # ── 1-Year Plan (refreshed)
    heading(doc, "1-Year Plan — Where 2026 Lands", size=16, color=NAVY,
            bottom_border_color="C7AD66", space_before=14)
    body_para(doc, runs=[
        {"text": "Revenue: ", "bold": True, "color": NAVY},
        {"text": "$1.1M+ "},
        {"text": "(Q1 tracking ~$93k/mo average) ", "italic": True,
         "color": INK_MID, "size": 10},
        {"text": "  ·  Profit: ", "bold": True, "color": NAVY},
        {"text": "17–20% "},
        {"text": "(Profit First live; first owner dividend distributed end "
                 "of March)", "italic": True, "color": INK_MID, "size": 10},
    ], space_after=8)

    subheading(doc, "Top 6 Goals — status check at June")
    bullet(doc, runs=[
        {"text": "✓ ", "bold": True, "color": NAVY},
        {"text": "Profit First implementation — ", "bold": True},
        {"text": "live, Q1 closed, allocations tuned (+3% payroll, "
                 "+1% profit)"},
    ])
    bullet(doc, runs=[
        {"text": "↻ ", "bold": True, "color": GOLD},
        {"text": "Dental IDentity structured & launched — ", "bold": True},
        {"text": "structure in place; invoicing + email separation + first "
                 "external invoice still in flight"},
    ])
    bullet(doc, runs=[
        {"text": "↻ ", "bold": True, "color": GOLD},
        {"text": "Dental IDentity website — ", "bold": True},
        {"text": "status check today: Untold framework state, copy "
                 "completion, PDC-to-launch timing"},
    ])
    bullet(doc, runs=[
        {"text": "○ ", "bold": True, "color": INK_LIGHT},
        {"text": "Succession structure finalized — ", "bold": True},
        {"text": "Amy + Madison engagement layer (profit share) is the "
                 "near-term lever; equity is a later conversation"},
    ])
    bullet(doc, runs=[
        {"text": "○ ", "bold": True, "color": INK_LIGHT},
        {"text": "Office expansion — ", "bold": True},
        {"text": "spring/summer 2026; revisit timing in light of "
                 "Dental Identity geographic push"},
    ])
    bullet(doc, runs=[
        {"text": "○ ", "bold": True, "color": INK_LIGHT},
        {"text": "Project Management tool rolled out — ", "bold": True},
        {"text": "still in evaluation; Amy / Izzy pilot not yet started"},
    ])

    body_para(doc, runs=[
        {"text": "Legend: ", "bold": True, "size": 9, "color": INK_LIGHT},
        {"text": "✓ delivered  ·  ↻ in flight  ·  ○ not yet started",
         "size": 9, "color": INK_LIGHT, "italic": True},
    ], space_after=4)

    # ── Last month — what shipped (May)
    heading(doc, "Last Month — What Shipped (May 2026)", size=16,
            color=NAVY, bottom_border_color="C7AD66")

    bullet(doc, runs=[
        {"text": "Amir partnership — discovery call held Apr 30; ",
         "bold": True, "color": NAVY},
        {"text": "decision landed on "},
        {"text": "trial 2–3 projects, each firm bills the dentist directly. ",
         "italic": True, "color": PLUM},
        {"text": "Canadian Precedent research delivered May 13. "
                 "Two follow-up email drafts (A vs B) prepared; "},
        {"text": "decision needed today on which version Rachel + Shanna "
                 "send.", "bold": True, "color": NAVY},
    ])
    bullet(doc, runs=[
        {"text": "Sinclair direct referral flow — ", "bold": True,
         "color": NAVY},
        {"text": "4-rep meeting held Apr 23 following Sinclair's in-house "
                 "design collapse. Status check today on referrals "
                 "received since."},
    ])
    bullet(doc, runs=[
        {"text": "Henry Schein direct relationship — ", "bold": True,
         "color": NAVY},
        {"text": "lunch held Apr 28 (Rachel + Shanna + Seth). Status check "
                 "today on whether the \"Hatch = Patterson's designer\" "
                 "perception is shifting."},
    ])
    bullet(doc, runs=[
        {"text": "Profit sharing for Madison + Amy — ", "bold": True,
         "color": NAVY},
        {"text": "% decided (Rachel 10% / Shanna 5%); confirm rollout "
                 "status and Joshua's involvement in the conversation."},
    ])
    bullet(doc, runs=[
        {"text": "Madison 1:1 check-in — ", "bold": True, "color": NAVY},
        {"text": "scheduled by Rachel. Read on stress, role fit, "
                 "engagement now that profit-share signal is in the room."},
    ])
    bullet(doc, runs=[
        {"text": "Subscription audit — ", "bold": True, "color": NAVY},
        {"text": "target was May 15. Status check on the audit sheet "
                 "and any cancellations made."},
    ])
    bullet(doc, runs=[
        {"text": "Profit First category patch — ", "bold": True,
         "color": NAVY},
        {"text": "target was May 31. Personal tax, meals/entertainment, "
                 "annual subscriptions, credit card liability now closed?"},
    ])

    # Page break — keep the Rocks table on a fresh page
    doc.add_page_break()

    # ── June Rocks — Hatch
    heading(doc, "June Rocks — Hatch Interior Design", size=16,
            color=NAVY, bottom_border_color="C7AD66",
            space_before=0)
    body_para(doc, runs=[
        {"text": "The local core. ", "bold": True, "color": NAVY},
        {"text": "Keep Hatch's reputation and cash engine strong while "
                 "Dental Identity gets its second-child energy.", "size": 11,
         "italic": True, "color": INK_MID},
    ], space_after=6)

    styled_table(
        doc,
        ["Rock", "Owner", "Due Date", "Status"],
        [
            [[("Sinclair + Henry Schein referral flow — formalize",
               {"bold": True}),
              ("Lock cadence for direct referrals post-Apr meetings. "
               "Quantify: # of qualified leads received in May → June "
               "target.", {"size": 9, "color": INK_MID})],
             "Rachel + Shanna",
             "June 30, 2026", ""],
            [[("Profit First — Q2 close + Q3 allocation decisions",
               {"bold": True}),
              ("Confirm payroll / profit / tax % held through Q2. "
               "Decide Q3 dividend timing.", {"size": 9, "color": INK_MID})],
             "Shanna + Joshua",
             "June 30, 2026", ""],
            [[("Madison + Amy profit-share rollout — completed",
               {"bold": True}),
              ("Conversation held, written summary delivered to each, "
               "first distribution timing communicated. Joshua to join.",
               {"size": 9, "color": INK_MID})],
             "Rachel + Shanna + Joshua",
             "June 20, 2026", ""],
            [[("Subscription audit — final decisions",
               {"bold": True}),
              ("Carry from May. Walk the list today, cancel what's "
               "non-essential, log monthly savings.",
               {"size": 9, "color": INK_MID})],
             "Shanna",
             "June 15, 2026", ""],
        ],
        widths=[Inches(2.9), Inches(1.7), Inches(1.2), Inches(1.2)],
    )

    # ── June Rocks — Dental Identity
    heading(doc, "June Rocks — Dental Identity", size=16,
            color=NAVY, bottom_border_color="C7AD66",
            space_before=10)
    body_para(doc, runs=[
        {"text": "The growth bet. ", "bold": True, "color": NAVY},
        {"text": "Move from \"exists on paper\" to operationally live — "
                 "first external invoice and first Amir trial project "
                 "are the proof points.", "size": 11, "italic": True,
         "color": INK_MID},
    ], space_after=6)

    styled_table(
        doc,
        ["Rock", "Owner", "Due Date", "Status"],
        [
            [[("Amir follow-up email — sent, response received",
               {"bold": True}),
              ("Decide A vs B today. Send this week. Book the in-person "
               "follow-up meeting within 2 weeks of send.",
               {"size": 9, "color": INK_MID})],
             "Rachel + Shanna",
             "June 11, 2026", ""],
            [[("Amir trial — Project #1 identified + scoped",
               {"bold": True}),
              ("First specific dental clinic project named. Each firm "
               "scopes its contract with the dentist directly.",
               {"size": 9, "color": INK_MID})],
             "Rachel + Shanna + Joshua",
             "June 30, 2026", ""],
            [[("Dental Identity invoicing + email — live",
               {"bold": True}),
              ("Bank account resolved, Gmail/YAMM signature logic working, "
               "info@ routing decided. First DI invoice issuable.",
               {"size": 9, "color": INK_MID})],
             "Rachel",
             "June 30, 2026", ""],
            [[("First Dental Identity by Hatch external invoice",
               {"bold": True}),
              ("One Lower Mainland project in flight → first invoice goes "
               "out under DI brand. Carry to July if June isn't realistic.",
               {"size": 9, "color": INK_MID})],
             "Rachel",
             "July 31, 2026", ""],
            [[("Calgary trip — first Sinclair + Henry Schein contacts",
               {"bold": True}),
              ("Rep outreach list built; girlfriend-visit trip dates "
               "locked; 2–3 in-person meetings booked.",
               {"size": 9, "color": INK_MID})],
             "Rachel",
             "June 30, 2026", ""],
        ],
        widths=[Inches(2.9), Inches(1.7), Inches(1.2), Inches(1.2)],
    )

    # ── Issues List — long-term running
    heading(doc, "Issues List — Running", size=16, color=NAVY,
            bottom_border_color="C7AD66", space_before=10)
    body_para(doc, runs=[
        {"text": "Working list. Promote to Rock when an issue is ready to "
                 "own a 30–90 day window.",
         "italic": True, "size": 10, "color": INK_MID},
    ], space_after=6)

    styled_table(
        doc,
        ["#", "Issue", "Category", "Owner", "P", "Notes / Next Step"],
        [
            ["1",
             [("Hatch ↔ Dental Identity communication plan",
               {"bold": True}),
              ("Client-facing and team-facing messaging on how the two "
               "brands relate. Currently unowned.",
               {"size": 9, "color": INK_MID})],
             "Marketing",
             "Rachel", "H",
             "Name an owner this month. Worth 60 min of design + voice "
             "work."],
            ["2",
             [("Email platform — multi-brand signature logic",
               {"bold": True}),
              ("Gmail + YAMM behaviour with two brands.",
               {"size": 9, "color": INK_MID})],
             "Process",
             "Rachel + Joshua", "H",
             "Joshua to bring a specific recommendation to July's "
             "session."],
            ["3",
             "PM tool selection",
             "Process",
             "Amy", "M",
             "Amy + Izzy pilot on 1–2 projects before broader adoption. "
             "Still parked."],
            ["4",
             "Hatch brand positioning refresh (local vs DI-by-Hatch)",
             "Marketing",
             "Rachel + Shanna", "M",
             "Potential add-on sprint ($2,750). Defer until DI momentum "
             "is proven."],
            ["5",
             "Spring 2026 junior hire — admin / jr. designer",
             "People",
             "Amy", "M",
             "Amy to train. Confirm timing in light of current capacity."],
            ["6",
             "Equity conversations with Madison + Amy",
             "People",
             "Rachel + Shanna", "L",
             "Parked. Profit share runs first; equity follows once "
             "pattern holds (6–12 months out)."],
            ["7",
             "Satellite / Regina-type relocation",
             "Growth",
             "Rachel", "L",
             "12+ month horizon. Re-read when Calgary trips show traction."],
            ["8",
             "Commercial property purchase analysis",
             "Finance",
             "Shanna", "L",
             "Start talking to a CRE agent. Forecast small vs large "
             "contract profitability mix."],
        ],
        widths=[Inches(0.3), Inches(2.4), Inches(0.9), Inches(1.2),
                Inches(0.3), Inches(1.9)],
    )

    # Page break before reference content
    doc.add_page_break()

    # ── Reference — Core Values, Vision (carried month to month)
    heading(doc, "Core Values", size=16, color=NAVY,
            bottom_border_color="C7AD66", space_before=0)
    body_para(doc, runs=[
        {"text": "Collaborative  ·  Creativity with Purpose  ·  "
                 "Excellence & Professionalism  ·  Balance & Well-Being  "
                 "·  Integrity & Care",
         "size": 11, "italic": True, "color": PLUM},
    ], space_after=8)

    heading(doc, "Core Focus", size=14, color=NAVY,
            bottom_border_color="C7AD66", space_before=10, space_after=4)
    body_para(doc, runs=[
        {"text": "Purpose / Cause / Passion: ", "bold": True,
         "color": NAVY},
        {"text": "To design beautiful, functional, and meaningful spaces "
                 "that reflect our clients' identity and purpose."},
    ])
    body_para(doc, runs=[
        {"text": "Niche: ", "bold": True, "color": NAVY},
        {"text": "Commercial design — professional environments and "
                 "dental clinic fit-outs (locally as Hatch; broader "
                 "Canadian markets as Dental Identity by Hatch)."},
    ], space_after=8)

    heading(doc, "10-Year Target", size=14, color=NAVY,
            bottom_border_color="C7AD66", space_before=10, space_after=4)
    body_para(doc,
              "$5M annual revenue. Hatch has bought a commercial property. "
              "Hatch and Dental Identity are distinctly different brands "
              "with their own teams. Acquired a design firm on the Coast.",
              space_after=8)

    heading(doc, "3-Year Picture (2029)", size=14, color=NAVY,
            bottom_border_color="C7AD66", space_before=10, space_after=4)
    body_para(doc, runs=[
        {"text": "Revenue: ", "bold": True, "color": NAVY},
        {"text": "$1.5M – $2M  ·  "},
        {"text": "Profit: ", "bold": True, "color": NAVY},
        {"text": "17–20%"},
    ])
    bullet(doc, "Dental Identity has full market presence across BC + AB.")
    bullet(doc,
           "Project Management system and SOPs fully adopted firm-wide.")
    bullet(doc,
           "Succession pathway for any senior designer in progress or "
           "completed.")
    bullet(doc,
           "Owners in strategic / mentorship roles rather than daily "
           "operations.")

    # ── Scorecard placeholder — minimal, room to write
    heading(doc, "Scorecard — Monthly Tracking", size=16, color=NAVY,
            bottom_border_color="C7AD66", space_before=14)
    body_para(doc, runs=[
        {"text": "Fill live during the meeting. Carry forward to "
                 "July's session.",
         "italic": True, "size": 10, "color": INK_MID},
    ], space_after=4)

    styled_table(
        doc,
        ["Metric", "Target", "Actual (May)", "Variance",
         "Owner", "Notes"],
        [
            ["Monthly billing (revenue)", "$93k+", "", "", "Shanna", ""],
            ["Profit allocation % of revenue", "17–20%", "", "", "Shanna",
             ""],
            ["AR outstanding (eom)", "<$60k", "", "", "Shanna", ""],
            ["Cash on hand — OPEX account", "1 mo runway", "", "",
             "Shanna", ""],
            ["# active projects on schedule", "", "", "", "Rachel", ""],
            ["# proposals sent", "", "", "", "Rachel", ""],
            ["# proposals closed", "", "", "", "Rachel", ""],
            ["Dental Identity invoices issued", "0 → 1", "", "",
             "Rachel", ""],
            ["Sinclair / HS direct leads received", "", "", "",
             "Rachel", ""],
            ["Team satisfaction (qualitative)", "Stable+", "", "",
             "Shared", ""],
        ],
        widths=[Inches(1.9), Inches(0.8), Inches(0.9), Inches(0.7),
                Inches(0.9), Inches(1.8)],
    )

    # ── Close — score the meeting
    heading(doc, "Close & Score Meeting", size=16, color=NAVY,
            bottom_border_color="C7AD66", space_before=10)
    body_para(doc, runs=[
        {"text": "Each person scores 1–10. ", "bold": True, "color": NAVY},
        {"text": "Anything below 8 names what was missing.", "italic": True,
         "color": INK_MID},
    ], space_after=8)

    score_table = doc.add_table(rows=2, cols=4)
    score_table.autofit = False
    headers = ["Rachel", "Shanna", "Joshua", "Jason"]
    for c_idx, h in enumerate(headers):
        cell = score_table.cell(0, c_idx)
        cell.width = Inches(1.75)
        set_cell_bg(cell, "382136")
        cell.text = ""
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        add_run(p, h, font=DISPLAY_FONT, size=10, bold=True,
                color=CREAM)
    for c_idx in range(4):
        cell = score_table.cell(1, c_idx)
        cell.width = Inches(1.75)
        set_cell_bg(cell, "F7F4E9")
        cell.text = ""
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        add_run(p, "   /  10", font=BODY_FONT, size=14, color=INK_LIGHT)
        for side in ("top", "bottom", "left", "right"):
            set_cell_border(cell, side, "D9D3BD", sz=4)

    # ── Next steps callout
    callout_box(
        doc,
        label="BEFORE WE LEAVE THE ROOM",
        fill_hex="ECE2C6",
        accent_hex="382136",
        label_color=PLUM,
        body_runs=[
            {"text": "Decisions to confirm: ", "bold": True, "color": NAVY,
             "size": 11},
            {"text": "Amir email (A vs B) sent this week; June Rocks "
                     "locked with owners + dates; subscription audit "
                     "decisions made today, not deferred again. ",
             "size": 11},
            {"text": "Next session: ", "bold": True, "color": NAVY,
             "size": 11},
            {"text": "first Thursday of July 2026, 09:00 Kelowna.",
             "italic": True, "color": PLUM, "size": 11},
        ],
    )

    # Footer
    footer_p = doc.add_paragraph()
    footer_p.paragraph_format.space_before = Pt(16)
    add_run(footer_p, "JIRAH GROWTH PARTNERS  ·  HATCH MONTHLY  ·  "
                      "JUNE 2026  ·  PREPARED BY JOSHUA MARSHALL  ·  "
                      "jirahgrowth.com",
            font=BODY_FONT, size=7, bold=True, color=INK_LIGHT)

    # Save
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    doc.save(OUT_PATH)
    print(f"Saved: {OUT_PATH}")


if __name__ == "__main__":
    build()
