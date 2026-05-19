"""
Build the Letter of Appointment — Regional Manager · Metro Vancouver
addressed from Trent Novakowski to Derrick.

Genesis-branded per brand-kit v1:
  - Rubik for headings, Lato for body (system fallbacks for Word substitution)
  - Charcoal #2D2D2D body text
  - Genesis Red #FF001B as accent (section rules, signature line) — never as bg flood
  - Letter-size, 0.75" margins
  - Standard Genesis footer
  - Doc ID: GC-LTR-DERRICK-V1
  - Light-mode (white paper) — text-only branding (no logo per brand-kit rule until
    light-mode logo variant exists)

Output:
  [Genesis]/07 - Deliverables/Drafts/Derrick-Offer-Letter-v1.docx
"""

from pathlib import Path
import sys

from docx import Document
from docx.shared import Pt, Inches, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
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
OUT_PATH = OUT_DIR / "Derrick-Offer-Letter-v1.docx"
assert_no_legacy_segment(OUT_PATH)

# Genesis palette
RED = RGBColor(0xFF, 0x00, 0x1B)
CHARCOAL = RGBColor(0x2D, 0x2D, 0x2D)
SOFT_GREY = RGBColor(0xAA, 0xAA, 0xAA)
MID_GREY = RGBColor(0x77, 0x77, 0x77)
HEADING_FONT = "Rubik"
BODY_FONT = "Lato"

EM = "—"
EN = "–"


# ---------------- helpers ----------------

def _set_run_color(run, rgb: RGBColor) -> None:
    run.font.color.rgb = rgb


def _set_para_border(paragraph, *, bottom: bool = False, top: bool = False,
                     color_hex: str = "FF001B", size: str = "8") -> None:
    p_pr = paragraph._p.get_or_add_pPr()
    p_bdr = OxmlElement("w:pBdr")
    if top:
        b = OxmlElement("w:top")
        b.set(qn("w:val"), "single")
        b.set(qn("w:sz"), size)
        b.set(qn("w:color"), color_hex)
        p_bdr.append(b)
    if bottom:
        b = OxmlElement("w:bottom")
        b.set(qn("w:val"), "single")
        b.set(qn("w:sz"), size)
        b.set(qn("w:color"), color_hex)
        p_bdr.append(b)
    p_pr.append(p_bdr)


def _add_runs_with_bold(paragraph, text: str, *, font=BODY_FONT, size=11,
                         color: RGBColor = CHARCOAL) -> None:
    """Parse **bold** markers and emit runs with consistent styling."""
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
        _set_run_color(r, color)
        bold_flag = not bold_flag


def brand_header(doc: Document) -> None:
    # Wordmark line
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("GENESIS BUILDING CONTROLS LTD.")
    r.font.name = HEADING_FONT
    r.font.size = Pt(14)
    r.bold = True
    _set_run_color(r, CHARCOAL)
    # subtle letter-spacing via a sibling element
    rPr = r._r.get_or_add_rPr()
    spacing = OxmlElement("w:spacing")
    spacing.set(qn("w:val"), "30")  # 30 twentieths of a point
    rPr.append(spacing)

    # Subline
    p2 = doc.add_paragraph()
    p2.paragraph_format.space_after = Pt(8)
    r2 = p2.add_run("Letter of Appointment")
    r2.font.name = BODY_FONT
    r2.font.size = Pt(10)
    r2.italic = True
    _set_run_color(r2, MID_GREY)

    # Red accent rule
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
    _set_run_color(r1, MID_GREY)
    rPr = r1._r.get_or_add_rPr()
    spacing = OxmlElement("w:spacing")
    spacing.set(qn("w:val"), "40")
    rPr.append(spacing)

    r2 = p.add_run(value)
    r2.font.name = BODY_FONT
    r2.font.size = Pt(10)
    _set_run_color(r2, CHARCOAL)


def heading2(doc: Document, text: str) -> None:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(16)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run(text)
    r.font.name = HEADING_FONT
    r.font.size = Pt(13)
    r.bold = True
    _set_run_color(r, CHARCOAL)


def heading3(doc: Document, text: str) -> None:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run(text)
    r.font.name = HEADING_FONT
    r.font.size = Pt(11)
    r.bold = True
    _set_run_color(r, RED)


def body(doc: Document, text: str, *, justify: bool = False) -> None:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(8)
    if justify:
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    _add_runs_with_bold(p, text)


def bullet(doc: Document, text: str) -> None:
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_after = Pt(3)
    _add_runs_with_bold(p, text)


def signature_line(doc: Document, label_left: str, label_right: str = "Date:") -> None:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(28)
    p.paragraph_format.space_after = Pt(2)
    r1 = p.add_run("_" * 48 + "        " + label_right + " " + "_" * 16)
    r1.font.name = BODY_FONT
    r1.font.size = Pt(10)
    _set_run_color(r1, CHARCOAL)

    p2 = doc.add_paragraph()
    p2.paragraph_format.space_after = Pt(0)
    r2 = p2.add_run(label_left)
    r2.font.name = BODY_FONT
    r2.font.size = Pt(9.5)
    _set_run_color(r2, MID_GREY)


def footer_block(doc) -> None:
    sec = doc.sections[0]
    foot = sec.footer
    # Clear default paragraph
    foot_p = foot.paragraphs[0]
    foot_p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    def _foot_line(text: str, italic: bool = False, size_pt: float = 8.0):
        p = foot.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(text)
        r.font.name = BODY_FONT
        r.font.size = Pt(size_pt)
        r.italic = italic
        _set_run_color(r, MID_GREY)
        return p

    # Red rule
    rule = foot.add_paragraph()
    rule.paragraph_format.space_before = Pt(0)
    rule.paragraph_format.space_after = Pt(4)
    _set_para_border(rule, top=True, color_hex="FF001B", size="8")

    _foot_line("GENESIS BUILDING CONTROLS LTD.    |    Contractor License LEL0211900",
               size_pt=8.5)
    _foot_line("Interior / Head Office: 3 - 3312 Appaloosa Rd, Kelowna, BC V1V 2W5  ·  250.448.5001")
    _foot_line("Metro Vancouver Office: 101 - 19110 24th Ave, Surrey, BC V3Z 3S9  ·  604.385.6272")
    _foot_line("info@genesiscontrols.ca  ·  genesiscontrols.ca  ·  Service: 24/7, 365",
               italic=True)


# ---------------- build ----------------

def build() -> Path:
    doc = Document()

    # Page setup per brand kit
    sec = doc.sections[0]
    sec.page_width = Inches(8.5)
    sec.page_height = Inches(11.0)
    sec.top_margin = Inches(0.75)
    sec.bottom_margin = Inches(0.9)
    sec.left_margin = Inches(0.9)
    sec.right_margin = Inches(0.9)

    # Default font
    normal = doc.styles["Normal"]
    normal.font.name = BODY_FONT
    normal.font.size = Pt(11)
    normal.font.color.rgb = CHARCOAL

    # === HEADER ===
    brand_header(doc)

    # === META ===
    meta_line(doc, "Document", "GC-LTR-DERRICK-V1")
    meta_line(doc, "Date", "[Date Trent signs]")
    meta_line(doc, "From", "Trent Novakowski, Owner, Genesis Building Controls Ltd.")
    meta_line(doc, "To", "Derrick [last name]")
    # spacer
    sp = doc.add_paragraph()
    sp.paragraph_format.space_after = Pt(8)

    # === SALUTATION ===
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(10)
    r = p.add_run("Dear Derrick,")
    r.font.name = BODY_FONT
    r.font.size = Pt(11.5)
    r.bold = True
    _set_run_color(r, CHARCOAL)

    # === OPENING ===
    body(doc,
         "Two years ago you walked into Vancouver as the only Genesis person on the ground and built that "
         "office one job at a time. The reason I am writing to you today is the reason we sat down last "
         "week: that office is not just a location anymore — it is a region, and the region needs a leader. "
         "I am writing to formally offer you the role of **Regional Manager " + EM + " Metro Vancouver**.",
         justify=True)

    # === POSITION CONFIRMATION ===
    heading2(doc, "Position")
    body(doc,
         "Effective **[start date]**, your title becomes **Regional Manager " + EM + " Metro Vancouver**. "
         "You will report directly to me. This is the first regional leadership role in Genesis's history; "
         "the standard you set will define how every region we open after this one is run.",
         justify=True)

    # === RESPONSIBILITY ===
    heading2(doc, "What you are responsible for")
    body(doc,
         "You carry single-point accountability for the Metro Vancouver office. That accountability has four parts:",
         justify=True)
    bullet(doc, "**The people.** Project Managers, Controls Technologists, Controls Electricians (Journeyperson and Apprentice), and the Service Technician(s) assigned to Metro Vancouver report to you.")
    bullet(doc, "**The projects.** Every project delivered out of Metro Vancouver — quality, schedule, budget, and safety on the jobsite.")
    bullet(doc, "**The performance.** Regional gross margin, employee retention, on-time / on-budget completion, service response time, and the safety scorecard. Reviewed monthly.")
    bullet(doc, "**The face of Genesis in the region.** Relationships with Metro Vancouver general contractors, consulting engineers, building owners, and existing service clients are yours to maintain and grow.")
    body(doc,
         "The full role definition lives in the Job Description (**GC-JD-REGIONALMGR-V2**), which we walked "
         "through together and which forms part of this offer.",
         justify=True)

    # === AUTHORITY (two-tier, over time) ===
    heading2(doc, "What you have authority over")
    body(doc,
         "Authority lands in two stages. This is by design — you grow into the seat as the structure stands "
         "up around you, and the authority you carry expands as the role lands.",
         justify=True)

    heading3(doc, "Day One " + EM + " initial authority")
    bullet(doc, "Day-to-day scheduling, project assignment, and field resource allocation inside the region " + EM + " yours, no escalation required.")
    bullet(doc, "Operational purchases (parts, tools, materials, subcontractor services) up to **$[X]** per single transaction.")
    bullet(doc, "Hiring within the approved Metro Vancouver headcount plan " + EM + " trade, technologist, service roles.")
    bullet(doc, "Project commitments and contract authority up to **$[X]** in project value.")
    bullet(doc, "Customer concession authority for service-recovery situations up to **$[X]** per incident.")
    bullet(doc, "Subcontractor engagement on regional projects, within the Lead Estimator's pricing and scope framework.")
    bullet(doc, "Termination and disciplinary decisions for regional staff, in consultation with me.")

    heading3(doc, "Six-month role confirmation " + EM + " expanded authority")
    body(doc,
         "At the end of October, after your first six months in role, we sit down for a formal "
         "role-confirmation review. The default expectation is that the role is confirmed and your "
         "authority expands:",
         justify=True)
    bullet(doc, "Higher single-transaction spend authority.")
    bullet(doc, "Wider hiring latitude beyond the approved plan, subject to my consult only.")
    bullet(doc, "Larger contract-authority threshold.")
    bullet(doc, "The standing right to recommend mid-cycle plan changes I previously owned.")
    body(doc,
         "The full **Authority Matrix** with the numerical thresholds is appended to the Job Description "
         "and will be confirmed in writing within 14 days of your acceptance of this letter.",
         justify=True)

    # === COMPENSATION ===
    heading2(doc, "Compensation")
    body(doc,
         "Effective **[start date]**, your compensation moves from your current package to the following structure. "
         "We agreed at our Tuesday May 5 sit-down that the dollar values land in a dedicated compensation "
         "conversation within 14 days; the structure is confirmed here so the role and the numbers are not "
         "negotiated as one package.",
         justify=True)
    bullet(doc, "**Base salary:** $[current base] " + EM + " " + EN + ">  $[new base] per annum.")
    bullet(doc, "**Performance variable:** target $[X] per annum, paid annually against the regional KPI scorecard (gross margin, retention, safety, project on-time / on-budget rate). Specific weighting confirmed within 14 days.")
    bullet(doc, "**Vehicle / phone / professional development allowance:** $[X] per month.")
    bullet(doc, "**Annual review:** every April, with an informal mid-year touch in October.")
    bullet(doc, "**Long-term incentive eligibility:** as Genesis finalizes the multi-year incentive plan (RRSP / DPSP / hybrid currently being modeled), this role is eligible.")
    body(doc,
         "The dollar values above will be filled in by hand before this letter is signed.",
         justify=True)

    # === MY COMMITMENTS ===
    heading2(doc, "What I am committing to you")
    body(doc,
         "You are not stepping into this role alone. The commitments I am making to you are part of "
         "how the role is designed " + EM + " not optional add-ons.",
         justify=True)
    bullet(doc, "A **weekly 1:1** with me " + EM + " 45 minutes, on the calendar.")
    bullet(doc, "An **onsite visit to Metro Vancouver** from me **every six weeks**, minimum two full days each visit.")
    bullet(doc, "A **weekly mentor session**, Mondays " + EM + " where you ask me anything about how I run the company.")
    bullet(doc, "A **daily Vancouver stand-up** plus a **cross-office video stand-up** with Kelowna leadership " + EM + " installed by you, attended by me when I am there.")
    bullet(doc, "A **monthly regional business review** where you present Vancouver performance to me.")
    bullet(doc, "**Coaching, not commanding.** When you bring me a question, my first move will be to ask what you think. That is not a deflection " + EM + " it is the muscle the role needs you to build.")

    # === ROLE CONFIRMATION ===
    heading2(doc, "Six-month role confirmation")
    body(doc,
         "At six months " + EM + " end of October 2026 " + EM + " we hold a formal role-confirmation review. "
         "The default expectation is **role confirmed**. This is a fairness mechanism, not a probationary "
         "trap. It gives both of us an honest checkpoint, and it ensures that if anything is off, we name "
         "it and correct it together rather than letting it drift.",
         justify=True)

    # === CLOSING ===
    heading2(doc, "Closing")
    body(doc,
         "What you have built in Vancouver is the reason this region is worth investing in. Stepping into "
         "the regional manager seat is the next chapter of that work, and it is the seat I want you in.",
         justify=True)
    body(doc,
         "If everything in this letter matches what we agreed, sign below and we move forward together.",
         justify=True)

    # === SIGN-OFF ===
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("Sincerely,")
    r.font.name = BODY_FONT
    r.font.size = Pt(11)
    _set_run_color(r, CHARCOAL)

    # space for handwritten sig
    sp = doc.add_paragraph()
    sp.paragraph_format.space_after = Pt(28)

    p2 = doc.add_paragraph()
    p2.paragraph_format.space_after = Pt(0)
    r2 = p2.add_run("Trent Novakowski")
    r2.font.name = BODY_FONT
    r2.font.size = Pt(11)
    r2.bold = True
    _set_run_color(r2, CHARCOAL)

    p3 = doc.add_paragraph()
    p3.paragraph_format.space_after = Pt(0)
    r3 = p3.add_run("Owner, Genesis Building Controls Ltd.")
    r3.font.name = BODY_FONT
    r3.font.size = Pt(10)
    r3.italic = True
    _set_run_color(r3, MID_GREY)

    # === ACCEPTANCE BLOCK ===
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(24)
    p.paragraph_format.space_after = Pt(2)
    _set_para_border(p, top=True, color_hex="FF001B", size="6")

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("Acceptance")
    r.font.name = HEADING_FONT
    r.font.size = Pt(12)
    r.bold = True
    _set_run_color(r, CHARCOAL)

    body(doc,
         "I accept the role of Regional Manager " + EM + " Metro Vancouver under the terms set out above.",
         justify=False)

    signature_line(doc, "Derrick [last name]")

    # === FOOTER ===
    footer_block(doc)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    doc.save(OUT_PATH)
    return OUT_PATH


if __name__ == "__main__":
    p = build()
    print(f"Wrote: {p}")
