"""
Build two Genesis-branded docx files for Trent's June 9, 2026
Vancouver team announcement of Derrick's Regional Manager role:

  1. Derrick-Announcement-Letter-v1.docx
     Works as printable handout AND as content Trent copy-pastes into a team
     email. Single body, ~400 words, warm + plainspoken in Trent's voice.

  2. June-9-Announcement-Speaker-Notes-v1.docx
     Internal-only. Speaker script for Trent with 10 timed sections; page
     break; then a 5-bullet pocket card on the final page Trent can detach
     and hold at the podium.

Both branded per Genesis brand-kit v1: Rubik headings, Lato body, charcoal
body text, Genesis Red as accent only, no logo (light-mode rule), 0.75"
margins, standard Genesis footer.

Output:
  [Genesis]/07 - Deliverables/Drafts/Derrick-Announcement-Letter-v1.docx
  [Genesis]/07 - Deliverables/Drafts/June-9-Announcement-Speaker-Notes-v1.docx
"""

from pathlib import Path
import sys

from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

# --- path guard ---
WS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(WS / "scripts"))
try:
    from _paths import assert_no_legacy_segment  # type: ignore
except ImportError:
    def assert_no_legacy_segment(p: Path) -> None:
        if "NEW - JIRAH MASTER" in str(p):
            raise RuntimeError(f"forbidden legacy segment in path: {p}")

ONEDRIVE = Path(r"C:\Users\joshu\OneDrive - jirahgrowth.consulting")
OUT_DIR = (
    ONEDRIVE
    / "JIRAH Growth Partners - Shared"
    / "01 - Clients"
    / "Active"
    / "Genesis Systems"
    / "07 - Deliverables"
    / "Drafts"
)
LETTER_PATH = OUT_DIR / "Derrick-Announcement-Letter-v1.docx"
NOTES_PATH = OUT_DIR / "June-9-Announcement-Speaker-Notes-v1.docx"
for p in (LETTER_PATH, NOTES_PATH):
    assert_no_legacy_segment(p)

# Genesis palette
RED = RGBColor(0xFF, 0x00, 0x1B)
CHARCOAL = RGBColor(0x2D, 0x2D, 0x2D)
MID_GREY = RGBColor(0x77, 0x77, 0x77)
SOFT_GREY = RGBColor(0xAA, 0xAA, 0xAA)
HEADING_FONT = "Rubik"
BODY_FONT = "Lato"
MONO_FONT = "JetBrains Mono"

EM = "—"
EN = "–"


# ---------------- shared helpers ----------------

def _set_color(run, rgb: RGBColor) -> None:
    run.font.color.rgb = rgb


def _set_para_border(paragraph, *, bottom=False, top=False,
                     color_hex="FF001B", size="8") -> None:
    p_pr = paragraph._p.get_or_add_pPr()
    p_bdr = OxmlElement("w:pBdr")
    for side_flag, side_name in ((top, "top"), (bottom, "bottom")):
        if side_flag:
            b = OxmlElement(f"w:{side_name}")
            b.set(qn("w:val"), "single")
            b.set(qn("w:sz"), size)
            b.set(qn("w:color"), color_hex)
            p_bdr.append(b)
    p_pr.append(p_bdr)


def _runs_with_bold(paragraph, text: str, *, font=BODY_FONT, size=11,
                     color: RGBColor = CHARCOAL, italic=False) -> None:
    parts = text.split("**")
    bold_flag = False
    for chunk in parts:
        if chunk == "":
            bold_flag = not bold_flag
            continue
        r = paragraph.add_run(chunk)
        r.font.name = font
        r.font.size = Pt(size)
        r.bold = bold_flag
        r.italic = italic
        _set_color(r, color)
        bold_flag = not bold_flag


def page_setup(doc: Document) -> None:
    sec = doc.sections[0]
    sec.page_width = Inches(8.5)
    sec.page_height = Inches(11.0)
    sec.top_margin = Inches(0.75)
    sec.bottom_margin = Inches(0.9)
    sec.left_margin = Inches(0.9)
    sec.right_margin = Inches(0.9)
    normal = doc.styles["Normal"]
    normal.font.name = BODY_FONT
    normal.font.size = Pt(11)
    normal.font.color.rgb = CHARCOAL


def brand_header(doc: Document, subline: str) -> None:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("GENESIS BUILDING CONTROLS LTD.")
    r.font.name = HEADING_FONT
    r.font.size = Pt(14)
    r.bold = True
    _set_color(r, CHARCOAL)
    rPr = r._r.get_or_add_rPr()
    spacing = OxmlElement("w:spacing")
    spacing.set(qn("w:val"), "30")
    rPr.append(spacing)

    p2 = doc.add_paragraph()
    p2.paragraph_format.space_after = Pt(8)
    r2 = p2.add_run(subline)
    r2.font.name = BODY_FONT
    r2.font.size = Pt(10)
    r2.italic = True
    _set_color(r2, MID_GREY)

    rule = doc.add_paragraph()
    rule.paragraph_format.space_before = Pt(0)
    rule.paragraph_format.space_after = Pt(14)
    _set_para_border(rule, bottom=True, color_hex="FF001B", size="14")


def meta_line(doc: Document, label: str, value: str) -> None:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    r1 = p.add_run(label.upper() + "  ")
    r1.font.name = BODY_FONT
    r1.font.size = Pt(8.5)
    r1.bold = True
    _set_color(r1, MID_GREY)
    rPr = r1._r.get_or_add_rPr()
    spacing = OxmlElement("w:spacing")
    spacing.set(qn("w:val"), "40")
    rPr.append(spacing)

    r2 = p.add_run(value)
    r2.font.name = BODY_FONT
    r2.font.size = Pt(10)
    _set_color(r2, CHARCOAL)


def h2(doc, text, color=CHARCOAL, size=13, space_before=16):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run(text)
    r.font.name = HEADING_FONT
    r.font.size = Pt(size)
    r.bold = True
    _set_color(r, color)


def h3(doc, text, color=RED, size=11):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run(text)
    r.font.name = HEADING_FONT
    r.font.size = Pt(size)
    r.bold = True
    _set_color(r, color)


def body(doc, text, *, justify=False, italic=False, size=11, space_after=8):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    if justify:
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    _runs_with_bold(p, text, italic=italic, size=size)


def bullet(doc, text, *, italic=False, space_after=3):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_after = Pt(space_after)
    _runs_with_bold(p, text, italic=italic)


def script_cue(doc, text):
    """Italic stage direction line — for speaker notes."""
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.left_indent = Inches(0.3)
    r = p.add_run("[ " + text + " ]")
    r.font.name = BODY_FONT
    r.font.size = Pt(9.5)
    r.italic = True
    _set_color(r, MID_GREY)


def quote_block(doc, text):
    """Indented quote — what Trent says verbatim."""
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.3)
    p.paragraph_format.space_after = Pt(6)
    _set_para_border(p, top=False, bottom=False)
    # Left red bar via a paragraph-level shading wouldn't add a border on left;
    # use a left border on the paragraph instead.
    p_pr = p._p.get_or_add_pPr()
    p_bdr = OxmlElement("w:pBdr")
    left = OxmlElement("w:left")
    left.set(qn("w:val"), "single")
    left.set(qn("w:sz"), "12")
    left.set(qn("w:color"), "FF001B")
    p_bdr.append(left)
    p_pr.append(p_bdr)
    r = p.add_run('"' + text + '"')
    r.font.name = BODY_FONT
    r.font.size = Pt(11)
    r.italic = True
    _set_color(r, CHARCOAL)


def footer_block(doc: Document) -> None:
    sec = doc.sections[0]
    foot = sec.footer
    foot.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER

    def _line(text: str, italic=False, size_pt=8.0):
        p = foot.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(text)
        r.font.name = BODY_FONT
        r.font.size = Pt(size_pt)
        r.italic = italic
        _set_color(r, MID_GREY)
        return p

    rule = foot.add_paragraph()
    rule.paragraph_format.space_before = Pt(0)
    rule.paragraph_format.space_after = Pt(4)
    _set_para_border(rule, top=True, color_hex="FF001B", size="8")

    _line("GENESIS BUILDING CONTROLS LTD.    |    Contractor License LEL0211900", size_pt=8.5)
    _line("Interior / Head Office: 3 - 3312 Appaloosa Rd, Kelowna, BC V1V 2W5  ·  250.448.5001")
    _line("Metro Vancouver Office: 101 - 19110 24th Ave, Surrey, BC V3Z 3S9  ·  604.385.6272")
    _line("info@genesiscontrols.ca  ·  genesiscontrols.ca  ·  Service: 24/7, 365", italic=True)


def page_break(doc):
    p = doc.add_paragraph()
    r = p.add_run()
    r.add_break(WD_BREAK.PAGE)


# ================================================================
# DOC 1 — ANNOUNCEMENT LETTER
# ================================================================

def build_announcement_letter() -> Path:
    doc = Document()
    page_setup(doc)
    brand_header(doc, "Team Announcement")

    meta_line(doc, "Document", "GC-LTR-TEAM-2026-06-09-V1")
    meta_line(doc, "Date", "June 9, 2026")
    meta_line(doc, "From", "Trent Novakowski, Owner")
    meta_line(doc, "To", "The Genesis Building Controls team")

    sp = doc.add_paragraph()
    sp.paragraph_format.space_after = Pt(8)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(10)
    r = p.add_run("Team,")
    r.font.name = BODY_FONT
    r.font.size = Pt(11.5)
    r.bold = True
    _set_color(r, CHARCOAL)

    body(doc,
         "I want to share a structural change that takes effect today, and the thinking behind it.",
         justify=True)

    body(doc,
         "Effective today, **Derrick [last name]** steps into the role of "
         "**Regional Manager " + EM + " Metro Vancouver**. He reports directly to me. "
         "The Vancouver-based team " + EM + " Project Managers, Controls Technologists, "
         "Controls Electricians, and the Metro Vancouver Service Technician(s) " + EM + " now "
         "reports to Derrick.",
         justify=True)

    h2(doc, "Why now")
    body(doc,
         "Vancouver has gone from one Genesis person on the ground to thirteen in two years. "
         "That is not a satellite anymore; it is a region. A region needs a leader who lives "
         "in it, who walks the jobsites, and who carries the weight of decisions every day "
         + EM + " not a remote owner trying to do that from Kelowna. Derrick has built what is "
         "there. He has earned this seat.",
         justify=True)

    h2(doc, "What changes in practice")
    body(doc,
         "**For the Vancouver team.** Derrick is your day-to-day. Schedules, project assignments, "
         "hiring within plan, jobsite escalations " + EM + " that is Derrick now. He has my full backing.",
         justify=True)
    body(doc,
         "**For the Kelowna team.** Nothing changes in your reporting. You report through the same "
         "people as yesterday. What does change: you will see Derrick more " + EM + " in our cross-office "
         "stand-ups, in regional and company-wide planning, and in the day-to-day rhythm we build "
         "with him as Vancouver matures.",
         justify=True)

    h2(doc, "What does not change")
    body(doc,
         "I still own this company. I am still very involved in everything that matters " + EM + " strategy, "
         "key client relationships, the Alberta launch, and our culture. I am not stepping back; "
         "I am building underneath. You will see me in Vancouver every six weeks at minimum, and I am a "
         "phone call away when you need me.",
         justify=True)

    h2(doc, "A word about Derrick")
    body(doc,
         "Two years ago Derrick was the only Genesis person in Vancouver. He took that office and "
         "built it one job at a time. He stayed late, drove the trucks, ran the wires, learned the "
         "buildings, and held the relationships when there was no one else to hold them. He is the "
         "right person for this seat. I trust him " + EM + " and you should too.",
         justify=True)

    h2(doc, "What is next")
    body(doc,
         "Alberta is coming. Derrick's role is the prototype for how Genesis runs regions as we grow. "
         "What works in Metro Vancouver becomes the template for Calgary and beyond. We are not done "
         "evolving " + EM + " and the changes ahead are all aimed at the same thing: making this company a "
         "better place to work and a more successful business.",
         justify=True)

    h2(doc, "What I am asking of you")
    body(doc,
         "Bring Derrick what you would bring me. He has my full backing and my full trust. If something "
         "is off " + EM + " about this, about anything " + EM + " come find me. I would rather hear it from "
         "you directly than have it sit.",
         justify=True)

    body(doc,
         "I am in Vancouver all week. Coffee is on me. Find me.",
         justify=True)

    # Sign-off
    sp = doc.add_paragraph()
    sp.paragraph_format.space_before = Pt(16)
    sp.paragraph_format.space_after = Pt(0)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run("Trent")
    r.font.name = BODY_FONT
    r.font.size = Pt(12)
    r.bold = True
    _set_color(r, CHARCOAL)

    p2 = doc.add_paragraph()
    p2.paragraph_format.space_after = Pt(0)
    r2 = p2.add_run("Trent Novakowski")
    r2.font.name = BODY_FONT
    r2.font.size = Pt(10)
    _set_color(r2, CHARCOAL)

    p3 = doc.add_paragraph()
    p3.paragraph_format.space_after = Pt(0)
    r3 = p3.add_run("Owner, Genesis Building Controls Ltd.")
    r3.font.name = BODY_FONT
    r3.font.size = Pt(9.5)
    r3.italic = True
    _set_color(r3, MID_GREY)

    footer_block(doc)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    doc.save(LETTER_PATH)
    return LETTER_PATH


# ================================================================
# DOC 2 — SPEAKER NOTES + POCKET CARD
# ================================================================

def _section_header(doc, num: str, title: str, time_minutes: str):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    _set_para_border(p, bottom=True, color_hex="FF001B", size="6")
    r = p.add_run(num + ".  " + title)
    r.font.name = HEADING_FONT
    r.font.size = Pt(13)
    r.bold = True
    _set_color(r, CHARCOAL)
    r2 = p.add_run("    " + time_minutes)
    r2.font.name = BODY_FONT
    r2.font.size = Pt(9.5)
    r2.italic = True
    _set_color(r2, MID_GREY)


def build_speaker_notes() -> Path:
    doc = Document()
    page_setup(doc)
    brand_header(doc, "Speaker Notes " + EM + " June 9 Team Announcement (Internal)")

    meta_line(doc, "Document", "GC-NOTES-TEAM-2026-06-09-V1")
    meta_line(doc, "Date", "June 9, 2026")
    meta_line(doc, "For", "Trent Novakowski, Owner")
    meta_line(doc, "Audience", "Genesis full team " + EM + " Metro Vancouver (in-room) + Kelowna (video)")
    meta_line(doc, "Run time", "~15 min spoken + 5" + EN + "10 min Q&A")
    meta_line(doc, "Classification", "Internal " + EM + " not for circulation")

    sp = doc.add_paragraph()
    sp.paragraph_format.space_after = Pt(6)

    # Intro framing
    body(doc,
         "Trent " + EM + " these notes are the structure you walk in with. Read them once before the room "
         "fills, then run from the section headers and bullet points. The verbatim quote blocks are "
         "suggestions, not script " + EM + " your own words will land better. The pocket card on the final "
         "page is what you hold at the podium.",
         italic=True, size=10.5)

    # === Pre-meeting checklist ===
    h2(doc, "Pre-meeting setup " + EM + " 5 minutes before", color=CHARCOAL)
    bullet(doc, "Kelowna team is on the video link (75-inch TV); confirm audio both directions.")
    bullet(doc, "Coffee and donuts are out " + EM + " informal vibe, not corporate.")
    bullet(doc, "Derrick is in the room and visible; you will reference him by name and pause for acknowledgement.")
    bullet(doc, "You have the pocket card (final page of this document) in hand.")
    bullet(doc, "Compensation conversations stay off the table today " + EM + " if a question lands there, defer cleanly: \"we are working on the broader incentive structure; more in the next few months.\"")

    # === Section 1 ===
    _section_header(doc, "1", "Open", "~1 min")
    bullet(doc, "Thanks for being here. Acknowledge this is not a normal Tuesday morning.")
    bullet(doc, "Name that you wanted both offices on the call at once.")
    script_cue(doc, "Pause. Look around the room. Then look at the Kelowna camera and address them directly.")
    quote_block(doc, "Thanks for being here. Some of you know this is not a normal Tuesday. I asked you here because there is something I want the whole team to hear at once " + EM + " both offices, together. Kelowna " + EM + " I see you on the screen. Thanks for being on.")

    # === Section 2 ===
    _section_header(doc, "2", "The announcement", "~1 min")
    bullet(doc, "Say the title clearly and slowly. Both syllables of \"Regional Manager.\"")
    bullet(doc, "Name Derrick directly. Reporting line: he reports to you.")
    script_cue(doc, "Pause. Let it land. Look at Derrick. Brief nod.")
    quote_block(doc, "Effective today, Derrick takes on the role of Regional Manager " + EM + " Metro Vancouver. He reports directly to me. The Vancouver team now reports to him.")

    # === Section 3 ===
    _section_header(doc, "3", "Why this, why now", "~2 min")
    bullet(doc, "Two years ago Derrick was the only Genesis person in Vancouver. Today there are thirteen.")
    bullet(doc, "That is not a satellite anymore. It is a region.")
    bullet(doc, "Region needs a leader who lives in it. You cannot run Vancouver from Kelowna and you should not try.")
    bullet(doc, "First regional leadership role in Genesis's history. What works here is what Alberta is built on.")
    quote_block(doc, "Two years ago Derrick was the only Genesis person in Vancouver. Today there are thirteen of you in that office. That is not a satellite anymore. It is a region. And a region needs a leader who lives in it. I have been trying to run Vancouver from Kelowna for too long " + EM + " that has to change, and it changes today.")

    # === Section 4 ===
    _section_header(doc, "4", "What changes " + EM + " Vancouver team", "~2 min")
    bullet(doc, "Look at the Vancouver people in the room when you say this.")
    bullet(doc, "Day-to-day reporting to Derrick: schedules, project assignments, hiring within plan, jobsite escalations.")
    bullet(doc, "He has your full backing. Name it.")
    bullet(doc, "You are still there when needed " + EM + " but Derrick is first.")
    quote_block(doc, "For the Vancouver team: Derrick is your day-to-day from this morning forward. Schedules, project assignments, hiring within plan, jobsite escalations " + EM + " bring him what you would bring me. He has my full backing. I am still here when you need me " + EM + " but find Derrick first.")

    # === Section 5 ===
    _section_header(doc, "5", "What changes " + EM + " Kelowna team", "~2 min")
    bullet(doc, "Turn to camera. Name them specifically.")
    bullet(doc, "Their reporting does not change. Same people, same day-to-day.")
    bullet(doc, "What changes: they will see Derrick in cross-office stand-ups and regional planning.")
    bullet(doc, "Position him as their counterpart in Vancouver, not above or below.")
    quote_block(doc, "Kelowna " + EM + " for you, your day-to-day reporting does not change. You report through the same people as yesterday. What does change: you will see more of Derrick. We have a cross-office stand-up running, and you will plan and solve cross-region issues with him directly. He is your regional counterpart in Vancouver " + EM + " not above you, not below you.")

    # === Section 6 ===
    _section_header(doc, "6", "What does NOT change", "~1 min")
    bullet(doc, "You still own the company. Direct statement.")
    bullet(doc, "Strategy, key clients, Alberta launch, culture " + EM + " still yours.")
    bullet(doc, "Not stepping back. Building underneath.")
    bullet(doc, "Six-week minimum cadence in Vancouver.")
    quote_block(doc, "I still own this company. I am still very involved in everything that matters " + EM + " strategy, key client relationships, the Alberta launch, our culture. I am not stepping back; I am building underneath. You will see me in Vancouver every six weeks at minimum, and I am a phone call away when you need me.")

    # === Section 7 ===
    _section_header(doc, "7", "Recognition of Derrick", "~1" + EN + "2 min")
    bullet(doc, "Specific, not generic. Name what he actually did.")
    bullet(doc, "Stayed late. Drove the trucks. Ran the wires. Learned the buildings. Held the relationships.")
    bullet(doc, "Trust framing: you trust him; the team should too.")
    script_cue(doc, "Look at Derrick if comfortable. Brief eye contact, then back to the room.")
    quote_block(doc, "Two years ago Derrick was the only Genesis person in Vancouver. He took that office and built it one job at a time. He stayed late, drove the trucks, ran the wires, learned the buildings, and held the relationships when there was no one else to hold them. He is the right person for this seat. I trust him " + EM + " and you should too. You will see why once he is in the chair.")

    # === Section 8 ===
    _section_header(doc, "8", "The road ahead", "~2 min")
    bullet(doc, "Alberta is coming. State it directly " + EM + " no surprises later.")
    bullet(doc, "Derrick's role is the prototype.")
    bullet(doc, "More changes ahead, all in service of the same thing.")
    quote_block(doc, "Alberta is coming. We have been working on the plan for months. Derrick's role is the prototype for how Genesis runs regions as we grow. What works in Metro Vancouver becomes the template for Calgary and beyond. We are not done evolving " + EM + " and the changes ahead are all aimed at the same thing: making this company a better place to work and a more successful business.")

    # === Section 9 ===
    _section_header(doc, "9", "Open the floor " + EM + " Q&A", "~3" + EN + "5 min")
    bullet(doc, "Invite questions. Mean it.")
    bullet(doc, "Make explicit: bring concerns directly to you. You would rather hear it now than have it sit.")
    bullet(doc, "If you do not have the answer: \"I do not have that locked in yet. Give me until [date] and I will come back to you specifically.\" Better than a vague answer.")
    bullet(doc, "If asked about comp: this announcement is about Derrick's role, not compensation changes for anyone else. Broader incentive program is being designed.")
    quote_block(doc, "I want to hear from you. Questions, feedback, things you want to know " + EM + " let us talk now. If something is off " + EM + " about this, about anything " + EM + " come find me directly. Today, tomorrow, this week. I would rather hear it from you than have it sit.")

    # === Section 10 ===
    _section_header(doc, "10", "Close", "~30 sec")
    bullet(doc, "Re-state you are in Vancouver all week. Open door.")
    bullet(doc, "Brief, warm, end on \"thanks.\"")
    quote_block(doc, "I am in Vancouver all week. Find me. Coffee is on me. Thanks for being part of this.")

    # === If-asked prep ===
    h2(doc, "If asked " + EM + " short answers you can use", color=CHARCOAL)
    bullet(doc, "**\"Does this affect my job?\"** " + EM + " \"If you are not on the Vancouver team, no. If you are: your day-to-day work does not change. The seat you escalate to changes.\"")
    bullet(doc, "**\"What about my own compensation?\"** " + EM + " \"This announcement is about Derrick's role. We are working on the broader incentive structure for everyone " + EM + " more on that within the next few months.\"")
    bullet(doc, "**\"Why Derrick and not [someone else]?\"** " + EM + " \"I have talked with the people I needed to talk with. Let us continue that conversation 1:1 if you want.\"")
    bullet(doc, "**\"Is Alberta happening this year?\"** " + EM + " \"We are in active planning. I will share the timeline when it is solid. The point of building regional structure in Vancouver first is so Alberta lands well.\"")
    bullet(doc, "**Anything you cannot answer cleanly:** \"Give me a week and I will come back to you specifically.\" Then write it down. Follow up.")

    # === Page break to pocket card ===
    page_break(doc)

    # === POCKET CARD ===
    # Large title
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("POCKET CARD")
    r.font.name = HEADING_FONT
    r.font.size = Pt(11)
    r.bold = True
    _set_color(r, RED)
    rPr = r._r.get_or_add_rPr()
    spacing = OxmlElement("w:spacing")
    spacing.set(qn("w:val"), "60")
    rPr.append(spacing)

    p2 = doc.add_paragraph()
    p2.paragraph_format.space_after = Pt(4)
    r2 = p2.add_run("June 9 Team Announcement " + EM + " 5 things to hit")
    r2.font.name = HEADING_FONT
    r2.font.size = Pt(20)
    r2.bold = True
    _set_color(r2, CHARCOAL)

    rule = doc.add_paragraph()
    rule.paragraph_format.space_after = Pt(18)
    _set_para_border(rule, bottom=True, color_hex="FF001B", size="14")

    def card_item(num: str, label: str, line: str):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(num + "    " + label)
        r.font.name = HEADING_FONT
        r.font.size = Pt(13)
        r.bold = True
        _set_color(r, RED)

        p2 = doc.add_paragraph()
        p2.paragraph_format.space_after = Pt(14)
        p2.paragraph_format.left_indent = Inches(0.45)
        _runs_with_bold(p2, line, size=13)

    card_item("1", "DECISION",
              "Effective today, Derrick is Regional Manager " + EM + " Metro Vancouver. He reports to me. Vancouver team reports to him.")
    card_item("2", "WHY",
              "Vancouver has earned a senior leader on-site. Alberta is next. This role is the prototype.")
    card_item("3", "STRUCTURE",
              "Vancouver: Derrick is day-to-day. Kelowna: no change to your reporting " + EM + " you will see Derrick more in cross-office work.")
    card_item("4", "WHAT I AM ASKING",
              "Bring Derrick what you would bring me. He has my full backing.")
    card_item("5", "WHAT IS NEXT",
              "I am in Vancouver all week. Questions, feedback, anything " + EM + " come find me.")

    footer_block(doc)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    doc.save(NOTES_PATH)
    return NOTES_PATH


# ---------------- run ----------------

if __name__ == "__main__":
    a = build_announcement_letter()
    b = build_speaker_notes()
    print(f"Wrote: {a}")
    print(f"Wrote: {b}")
