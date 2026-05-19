"""
Build the editable .docx containing the two follow-up email drafts to Amir,
prepared for Rachel and Shanna at Hatch to choose between.

Draft A — surfaces both pricing options (Amir adds CM fee on top, OR Hatch
discounts to Amir and Amir presents one number to the client).
Draft B — Option 1 only, with "stronger together" framing and a first-right-
of-refusal as the mutual-win mechanism.

Mirrors the visual language of the prior 2026-04-30 Amir Discovery Call doc
so this sits cleanly alongside it in 08 - Monthly Retainer.
"""

from pathlib import Path
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

from _paths import ACTIVE_CLIENTS, assert_no_legacy_segment

# Brand palette (matches build-amir-questions-docx.py)
NAVY = RGBColor(0x0F, 0x26, 0x33)
PLUM = RGBColor(0x38, 0x21, 0x36)
GOLD = RGBColor(0xC7, 0xAD, 0x66)
GOLD_PALE = RGBColor(0xEC, 0xE2, 0xC6)
CREAM = RGBColor(0xF7, 0xF4, 0xE9)
INK = RGBColor(0x0F, 0x26, 0x33)
INK_MID = RGBColor(0x4A, 0x59, 0x68)
INK_LIGHT = RGBColor(0x7B, 0x86, 0x93)
RULE = RGBColor(0xD9, 0xD3, 0xBD)
AMBER = RGBColor(0xB6, 0x7E, 0x2B)

DISPLAY_FONT = "Cambria"
BODY_FONT = "Calibri"
MONO_FONT = "Consolas"

OUT_PATH = (
    ACTIVE_CLIENTS
    / "Hatch Interior Design"
    / "08 - Monthly Retainer"
    / "2026-05-13 Amir Follow-Up Email — Two Drafts for Rachel and Shanna.docx"
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


def bullet(doc, text=None, *, runs=None, size=11):
    p = doc.add_paragraph(style="List Bullet")
    pf = p.paragraph_format
    pf.space_after = Pt(3)
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


def callout_box(doc, *, label, body_runs, fill_hex, accent_hex, label_color):
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
    spacer.paragraph_format.space_after = Pt(6)
    return table


def header_block(doc):
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
    add_run(rp, "Follow-Up to Amir", font=DISPLAY_FONT, size=20,
            bold=True, color=NAVY)
    sub = right.add_paragraph()
    sub.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    sub.paragraph_format.space_before = Pt(0)
    add_run(sub, "HATCH INTERIOR DESIGN", font=BODY_FONT, size=9, bold=True,
            color=PLUM)
    date = right.add_paragraph()
    date.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    date.paragraph_format.space_before = Pt(0)
    add_run(date, "MAY 13, 2026 · TWO DRAFTS FOR RACHEL & SHANNA",
            font=BODY_FONT, size=8, color=INK_LIGHT)

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
    rule.paragraph_format.space_after = Pt(12)


def email_field(doc, label, value, *, bold_value=False):
    """One line — label in small caps gold, value in body ink."""
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    add_run(p, f"{label.upper()}   ", font=BODY_FONT, size=8, bold=True,
            color=GOLD)
    add_run(p, value, font=BODY_FONT, size=11, bold=bold_value, color=INK)
    return p


def email_body_para(doc, text, *, size=11, space_after=8):
    """A paragraph of email body — slightly inset to read like an email."""
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.left_indent = Inches(0.3)
    pf.right_indent = Inches(0.3)
    pf.space_after = Pt(space_after)
    add_run(p, text, font=BODY_FONT, size=size, color=INK)
    return p


def email_body_runs(doc, runs, *, space_after=8):
    """A mixed-run email body paragraph (for bolded inline phrases)."""
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.left_indent = Inches(0.3)
    pf.right_indent = Inches(0.3)
    pf.space_after = Pt(space_after)
    for r in runs:
        add_run(p, r["text"], font=r.get("font", BODY_FONT),
                size=r.get("size", 11),
                bold=r.get("bold", False),
                italic=r.get("italic", False),
                color=r.get("color", INK))
    return p


def email_numbered(doc, text, *, size=11):
    p = doc.add_paragraph(style="List Number")
    pf = p.paragraph_format
    pf.left_indent = Inches(0.7)
    pf.space_after = Pt(6)
    add_run(p, text, font=BODY_FONT, size=size, color=INK)
    return p


def email_numbered_runs(doc, runs, *, size=11):
    p = doc.add_paragraph(style="List Number")
    pf = p.paragraph_format
    pf.left_indent = Inches(0.7)
    pf.space_after = Pt(6)
    for r in runs:
        add_run(p, r["text"], font=r.get("font", BODY_FONT),
                size=r.get("size", size),
                bold=r.get("bold", False),
                italic=r.get("italic", False),
                color=r.get("color", INK))
    return p


def email_bullet(doc, text, *, size=11):
    p = doc.add_paragraph(style="List Bullet")
    pf = p.paragraph_format
    pf.left_indent = Inches(0.7)
    pf.space_after = Pt(4)
    add_run(p, text, font=BODY_FONT, size=size, color=INK)
    return p


def draft_label(doc, letter, title, subtitle):
    """Big DRAFT A / DRAFT B label that introduces each option."""
    table = doc.add_table(rows=1, cols=2)
    table.autofit = False
    table.columns[0].width = Inches(1.2)
    table.columns[1].width = Inches(5.8)

    # Letter cell — gold background, big letter
    left = table.cell(0, 0)
    left.width = Inches(1.2)
    set_cell_bg(left, "0F2633")
    left.text = ""
    lp = left.paragraphs[0]
    lp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    lp.paragraph_format.space_before = Pt(6)
    lp.paragraph_format.space_after = Pt(6)
    add_run(lp, f"DRAFT", font=BODY_FONT, size=8, bold=True, color=GOLD)
    lp2 = left.add_paragraph()
    lp2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    lp2.paragraph_format.space_after = Pt(6)
    add_run(lp2, letter, font=DISPLAY_FONT, size=32, bold=True, color=GOLD_PALE)

    # Title cell — cream background
    right = table.cell(0, 1)
    right.width = Inches(5.8)
    set_cell_bg(right, "F7F4E9")
    right.text = ""
    rp = right.paragraphs[0]
    rp.paragraph_format.space_before = Pt(8)
    rp.paragraph_format.space_after = Pt(2)
    add_run(rp, title, font=DISPLAY_FONT, size=14, bold=True, color=NAVY)
    rp2 = right.add_paragraph()
    rp2.paragraph_format.space_after = Pt(6)
    add_run(rp2, subtitle, font=BODY_FONT, size=10, italic=True, color=INK_MID)

    # Cell padding
    for cell in (left, right):
        tc_pr = cell._tc.get_or_add_tcPr()
        tc_mar = OxmlElement("w:tcMar")
        for side, val in [("top", 100), ("left", 200),
                          ("bottom", 100), ("right", 200)]:
            m = OxmlElement(f"w:{side}")
            m.set(qn("w:w"), str(val))
            m.set(qn("w:type"), "dxa")
            tc_mar.append(m)
        tc_pr.append(tc_mar)

    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_after = Pt(4)


# ─── Build the document ───────────────────────────────────────────────────
def build():
    doc = Document()

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

    # ── Intro / purpose
    heading(doc, "Two Drafts to Choose Between", size=16, color=NAVY,
            bottom_border_color="C7AD66", space_before=4)

    body_para(doc, runs=[
        {"text": "Following our debrief on Amir's interest in trialling a "
                 "few projects under the Dental Clinics Only concept, here "
                 "are two follow-up emails for you to choose between. Both "
                 "open the door to a small trial. Both keep each firm "
                 "billing the dentist directly. They differ on "},
        {"text": "what you put on the table about money", "italic": True},
        {"text": " — and on how directly you signal the bigger structural "
                 "vision."},
    ], space_after=8)

    callout_box(
        doc,
        label="HOW TO USE THIS",
        fill_hex="ECE2C6",
        accent_hex="C7AD66",
        label_color=PLUM,
        body_runs=[
            {"text": "Pick the draft that feels right for the relationship "
                     "as you read it today. ", "color": INK, "size": 11},
            {"text": "Edit either to land in your own voice — the words are "
                     "starting points, not finished copy. ", "color": INK,
             "size": 11},
            {"text": "If you want to blend (e.g., Draft B's framing with "
                     "Draft A's two-option transparency), say the word and "
                     "we'll spin a Draft C.", "color": INK, "size": 11},
        ],
    )

    # ── Quick comparison table-ish
    heading(doc, "Side-by-side", size=14, color=NAVY,
            bottom_border_color="C7AD66", space_before=10)

    # Two-column comparison
    cmp = doc.add_table(rows=4, cols=3)
    cmp.autofit = False
    cmp.columns[0].width = Inches(1.6)
    cmp.columns[1].width = Inches(2.7)
    cmp.columns[2].width = Inches(2.7)

    headers = ["", "Draft A", "Draft B"]
    for idx, h in enumerate(headers):
        c = cmp.cell(0, idx)
        c.text = ""
        set_cell_bg(c, "0F2633")
        hp = c.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.LEFT
        add_run(hp, h.upper(), font=BODY_FONT, size=9, bold=True,
                color=GOLD_PALE)

    rows = [
        ("Pricing", "Surfaces both options — Amir adds CM fee on top OR Hatch discounts and Amir presents one number.",
         "Option 1 only — Amir adds CM fee on top, Hatch invoices the dentist directly. Money flow stays separate."),
        ("Framing", "Neutral — \"both work for us in principle, what fits your model?\"",
         "\"Stronger together\" — top-tier design + top-tier construction, with a first-right-of-refusal as the binding mechanism."),
        ("On the money", "Asks Amir to choose between two structures in writing.",
         "Plants that there's a strong instinct on what fits, and signals that the commercial detail is best worked out in person."),
    ]
    for r_idx, (label, a, b) in enumerate(rows, start=1):
        for c_idx, content in enumerate((label, a, b)):
            c = cmp.cell(r_idx, c_idx)
            c.text = ""
            if c_idx == 0:
                set_cell_bg(c, "ECE2C6")
            else:
                set_cell_bg(c, "F7F4E9")
            p = c.paragraphs[0]
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(4)
            add_run(p, content, font=BODY_FONT, size=10,
                    bold=(c_idx == 0), color=(NAVY if c_idx == 0 else INK))
            # padding
            tc_pr = c._tc.get_or_add_tcPr()
            tc_mar = OxmlElement("w:tcMar")
            for side, val in [("top", 80), ("left", 120),
                              ("bottom", 80), ("right", 120)]:
                m = OxmlElement(f"w:{side}")
                m.set(qn("w:w"), str(val))
                m.set(qn("w:type"), "dxa")
                tc_mar.append(m)
            tc_pr.append(tc_mar)

    # spacer after table
    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_after = Pt(8)

    # ── Page break before Draft A
    doc.add_page_break()

    # ────────────────────────────── DRAFT A ──────────────────────────────
    draft_label(
        doc, "A",
        "Both pricing options on the table",
        "Neutral, transparent — invites Amir to pick the structure that fits his model.",
    )

    # Email metadata
    email_field(doc, "To", "Amir, Seasons Contracting")
    email_field(doc, "From", "Rachel and Shanna, Hatch / Dental Identity")
    email_field(doc, "Subject", "Following up — interested in trialling a couple of projects",
                bold_value=True)

    # Small visual gap before body
    gap = doc.add_paragraph()
    gap.paragraph_format.space_after = Pt(4)

    email_body_para(doc, "Amir,")

    email_body_para(doc,
        "Thank you for Thursday's call. We've had time to sit with the "
        "conversation and we want to test the concept in practice. Rather "
        "than work out every detail of a longer-term arrangement on paper, "
        "we'd like to run a couple of trial projects together and see how "
        "it actually flows.")

    email_body_para(doc,
        "The piece we'd value your input on is fee structure. Two options "
        "on our side:")

    email_numbered_runs(doc, [
        {"text": "Hatch / Dental Identity invoices the dentist directly at "
                 "our standard rate, and you add a construction management "
                 "fee on top", "bold": True},
        {"text": " (carried as a markup on your subs, billed by your firm "
                 "directly to the dentist). Each line item is transparent "
                 "to the client."},
    ])
    email_numbered_runs(doc, [
        {"text": "Hatch / Dental Identity discounts our rate to you, and "
                 "you carry the design fee inside what your firm bills the "
                 "dentist", "bold": True},
        {"text": " — so the client sees one number that matches what we'd "
                 "typically charge, rather than a stacked premium."},
    ])

    email_body_para(doc,
        "We'd rather hear what fits your model and your relationship with "
        "the dentist before locking in — or whether you see a third "
        "structure that works better.")

    email_body_para(doc,
        "A few things on our side that would apply either way:")

    email_bullet(doc,
        "Each firm signs its own contract with the dentist for the work "
        "it's doing.")
    email_bullet(doc,
        "Hatch retains design IP, photography rights, and case-study use "
        "on any clinic we design.")
    email_bullet(doc,
        "Cap the trial at two or three projects, with a check-in after the "
        "first one wraps to compare notes on what's working.")

    email_body_para(doc,
        "Henry Schein and the broader cross-Canada vision are the bigger "
        "conversations — we want those, and we think a couple of completed "
        "projects will give us much better ground to have them on.")

    email_body_para(doc,
        "Could we book 30 minutes in the next week or two to identify a "
        "specific project to start with? Happy to send a short outline "
        "ahead of the call if that's useful.")

    email_body_para(doc, "Rachel and Shanna", space_after=14)

    # Note on Draft A
    callout_box(
        doc,
        label="WORTH FLAGGING ON DRAFT A",
        fill_hex="ECE2C6",
        accent_hex="B67E2B",
        label_color=PLUM,
        body_runs=[
            {"text": "Option 2 (Hatch discounts to Amir, Amir invoices the "
                     "dentist at our standard rate and keeps the spread) "
                     "is the one to think carefully about. ", "bold": True,
             "color": NAVY},
            {"text": "It's the structure that flagged in the IDIBC analysis "
                     "we sent ahead of the Apr 30 call — disclosure of "
                     "compensation method (A.6) and the no-inducement clause "
                     "(A.7). Sending Draft A puts both options on Amir's "
                     "desk in writing, which is the most transparent "
                     "approach but commits you to having the IDIBC "
                     "conversation if he picks Option 2. ", "color": INK},
            {"text": "If you'd prefer not to surface Option 2 at all, "
                     "Draft B is the cleaner path.", "italic": True,
             "color": PLUM},
        ],
    )

    # ── Page break before Draft B
    doc.add_page_break()

    # ────────────────────────────── DRAFT B ──────────────────────────────
    draft_label(
        doc, "B",
        "Option 1 only — \"stronger together\" + first-right-of-refusal",
        "Warm peer framing, no Option 2 in writing, commercial detail signalled as in-person.",
    )

    email_field(doc, "To", "Amir, Seasons Contracting")
    email_field(doc, "From", "Rachel and Shanna, Hatch / Dental Identity")
    email_field(doc, "Subject", "Following up — building on Thursday's call",
                bold_value=True)

    gap = doc.add_paragraph()
    gap.paragraph_format.space_after = Pt(4)

    email_body_para(doc, "Amir,")

    email_body_para(doc,
        "Thank you for Thursday's call. We've sat with the conversation, "
        "and the more we've thought about it the more the shape feels "
        "right. Your construction side and our design side are both at the "
        "top end of the market in what we each do — and the dentists who "
        "care about getting it right are the ones who'd feel that "
        "combination. There's a real \"stronger together\" story for the "
        "right clients, and we'd like to test it in practice.")

    email_body_runs(doc, [
        {"text": "Our proposal: trial it on a couple of projects. Run one "
                 "start to finish, see how the workflow lands, then a "
                 "second to confirm. Each firm focused on what it does "
                 "best — your team owning the construction relationship "
                 "end to end, "},
        {"text": "including the CM fee on the build", "italic": True},
        {"text": "; our team owning the design through to handover. Each "
                 "firm signs its own scope with the dentist, so the client "
                 "sees clear value from both sides."},
    ])

    email_body_para(doc,
        "The way we'd make this mutually durable over time is a first-"
        "right-of-refusal between the firms on dental work. When a clinic "
        "lands with you, we get the first look on the design. When one "
        "comes in through us or Dental Identity, your team gets the first "
        "look on the construction. Each of us reinforces the other's "
        "pipeline that way, without anything more complicated. That's also "
        "what makes the cross-Canada vision real — we extend each other's "
        "reach into markets neither of us is in today.")

    email_body_para(doc,
        "How the commercial side ties together is worth working through in "
        "person rather than over email. We have a strong instinct on the "
        "shape that fits inside both firms' regulatory and brand "
        "frameworks, and we'd rather walk you through that face to face.")

    email_body_para(doc,
        "A few things we'd like to lock in:")

    email_bullet(doc,
        "A specific first project to trial together — your call on which "
        "one fits best.")
    email_bullet(doc,
        "A 30-minute follow-up in the next week or two to align on that "
        "project and work through structure.")
    email_bullet(doc,
        "A check-in after Project 1 wraps before we commit to a second.")

    email_body_para(doc,
        "Henry Schein, the cross-Canada vision, the broader white-glove "
        "model — those are real conversations and we want them. The "
        "fastest way to ground them is one completed project together.")

    email_body_para(doc, "What slot in the next two weeks works for you?")

    email_body_para(doc, "Rachel and Shanna", space_after=14)

    # Note on Draft B
    callout_box(
        doc,
        label="WORTH FLAGGING ON DRAFT B",
        fill_hex="ECE2C6",
        accent_hex="C7AD66",
        label_color=PLUM,
        body_runs=[
            {"text": "The line ", "color": INK},
            {"text": "\"a strong instinct on the shape that fits inside "
                     "both firms' regulatory and brand frameworks\"",
             "italic": True, "color": NAVY},
            {"text": " is the planted seed — signals to Amir that there's "
                     "a constraint without naming IDIBC, and pre-positions "
                     "the in-person follow-up as the place you bring him a "
                     "defined structure rather than asking him to invent "
                     "one. ", "color": INK},
            {"text": "If you want it softer, swap \"regulatory and brand "
                     "frameworks\" for \"brand and professional "
                     "frameworks\" — drops the word that most clearly "
                     "points at IDIBC.", "italic": True, "color": PLUM},
        ],
    )

    # ── Closing — what to do next
    doc.add_page_break()

    heading(doc, "What's next", size=16, color=NAVY,
            bottom_border_color="C7AD66", space_before=4)

    body_para(doc, runs=[
        {"text": "When you've decided which draft (or which blend) to send, "
                 "let us know — happy to take another pass before it goes "
                 "out, or send as-is. We're also ready to draft the "
                 "in-person agenda for the follow-up meeting with Amir so "
                 "you walk in with the commercial structure already mapped.",
         "color": INK, "size": 11},
    ], space_after=10)

    bullet(doc, runs=[
        {"text": "Send Draft A as-is. ", "bold": True, "color": NAVY},
        {"text": "Most transparent. Commits you to having the IDIBC "
                 "conversation if Amir picks Option 2."},
    ])
    bullet(doc, runs=[
        {"text": "Send Draft B as-is. ", "bold": True, "color": NAVY},
        {"text": "Cleaner posture. Reserves the structural conversation "
                 "for the in-person follow-up where you control the framing."},
    ])
    bullet(doc, runs=[
        {"text": "Ask Jirah for a Draft C. ", "bold": True, "color": NAVY},
        {"text": "Blend the two — e.g., Draft B's \"stronger together\" "
                 "opening + Draft A's explicit Option 1 mechanics so Amir "
                 "knows exactly what the fee structure looks like."},
    ])
    bullet(doc, runs=[
        {"text": "Park the email. ", "bold": True, "color": NAVY},
        {"text": "Pick up the phone instead and have the conversation "
                 "live. Email is a useful artifact, but a call moves "
                 "faster on this kind of trust-build."},
    ])

    # Footer
    footer_p = doc.add_paragraph()
    footer_p.paragraph_format.space_before = Pt(20)
    add_run(footer_p, "JIRAH · AMIR FOLLOW-UP EMAIL DRAFTS · HATCH · "
                      "PREPARED BY JOSHUA MARSHALL · jirahgrowth.com",
            font=BODY_FONT, size=7, bold=True, color=INK_LIGHT)

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    doc.save(OUT_PATH)
    print(f"Saved: {OUT_PATH}")


if __name__ == "__main__":
    build()
