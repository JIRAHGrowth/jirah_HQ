"""HTML -> DOCX converter for Genesis canonical letter and JD templates.

Mirrors the visual format of the two canonical reference docs:
  - Derrick-Offer-Letter.docx       (LETTER format)
  - Regional-Manager-Metro-Vancouver.docx  (JD format)

Auto-detects mode from the source HTML structure:
  - <div class="letterhead">  -> LETTER mode (Lato, no tables, plain section heads)
  - <h1> at top of page       -> JD mode    (Calibri, navy/cream tables, ALL-CAPS sections)

Run:
    python scripts/html_to_word_genesis.py path/to/source.html path/to/out.docx

Or import `convert(html_path, out_path)` from a builder script.
"""
from __future__ import annotations

import sys
from pathlib import Path

from bs4 import BeautifulSoup, NavigableString, Tag
from docx import Document
from docx.enum.table import WD_ALIGN_VERTICAL
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor


# ---- palettes ----
INK = RGBColor(0x1F, 0x29, 0x37)         # body text both modes
INK_SOFT_LETTER = RGBColor(0x77, 0x77, 0x77)  # letterhead doctype + meta labels
INK_SOFT_JD = RGBColor(0x59, 0x59, 0x59)      # JD subtitle
TABLE_HEADER_BG = "1F2937"
TABLE_HEADER_INK = RGBColor(0xFF, 0xFF, 0xFF)
TABLE_ALT_BG = "F4F1EA"
RULE_HEX = "D9D2C4"


# ---------- OOXML helpers ----------

def _shade_cell(cell, fill_hex: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), fill_hex)
    tc_pr.append(shd)


def _set_cell_borders(cell, *, color: str = RULE_HEX, size: str = "4") -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    borders = OxmlElement("w:tcBorders")
    for side in ("top", "left", "bottom", "right"):
        b = OxmlElement(f"w:{side}")
        b.set(qn("w:val"), "single")
        b.set(qn("w:sz"), size)
        b.set(qn("w:color"), color)
        borders.append(b)
    existing = tc_pr.find(qn("w:tcBorders"))
    if existing is not None:
        tc_pr.remove(existing)
    tc_pr.append(borders)


def _clear_table_borders(table) -> None:
    tbl_pr = table._tbl.tblPr
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        b = OxmlElement(f"w:{edge}")
        b.set(qn("w:val"), "nil")
        borders.append(b)
    existing = tbl_pr.find(qn("w:tblBorders"))
    if existing is not None:
        tbl_pr.remove(existing)
    tbl_pr.append(borders)


# ---------- document setup ----------

def configure_letter(doc: Document) -> None:
    section = doc.sections[0]
    section.top_margin = Cm(1.9)
    section.bottom_margin = Cm(1.9)
    section.left_margin = Cm(2.3)
    section.right_margin = Cm(2.3)
    normal = doc.styles["Normal"]
    normal.font.name = "Lato"
    normal.font.size = Pt(10)
    normal.font.color.rgb = INK
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.2


def configure_jd(doc: Document) -> None:
    section = doc.sections[0]
    section.top_margin = Cm(2.6)
    section.bottom_margin = Cm(2.0)
    section.left_margin = Cm(2.3)
    section.right_margin = Cm(2.3)
    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(10.5)
    normal.font.color.rgb = INK
    normal.paragraph_format.space_after = Pt(5)
    normal.paragraph_format.line_spacing = 1.2


# ---------- inline runs ----------

def _add_run(paragraph, text: str, *, bold=False, italic=False,
             color: RGBColor | None = None, font: str | None = None,
             size_pt: float | None = None):
    if text == "":
        return None
    run = paragraph.add_run(text)
    if bold:
        run.bold = True
    if italic:
        run.italic = True
    if color is not None:
        run.font.color.rgb = color
    if font:
        run.font.name = font
    if size_pt is not None:
        run.font.size = Pt(size_pt)
    return run


def render_inline(paragraph, node, *, bold=False, italic=False) -> None:
    """Emit runs for an HTML inline subtree.

    Preserves leading/trailing whitespace on text nodes so that
    `<strong>Reports to:</strong> Owner` renders with a real space
    between the colon and the next word (the prior `" ".join(text.split())`
    on a stripped string swallowed it).
    """
    if isinstance(node, NavigableString):
        text = str(node)
        if not text:
            return
        if not text.strip():
            _add_run(paragraph, " ", bold=bold, italic=italic)
            return
        leading = " " if text[0].isspace() else ""
        trailing = " " if text[-1].isspace() else ""
        collapsed = " ".join(text.split())
        _add_run(paragraph, leading + collapsed + trailing, bold=bold, italic=italic)
        return

    if not isinstance(node, Tag):
        return

    name = node.name.lower()
    if name in ("strong", "b"):
        for ch in node.children:
            render_inline(paragraph, ch, bold=True, italic=italic)
    elif name in ("em", "i"):
        for ch in node.children:
            render_inline(paragraph, ch, bold=bold, italic=True)
    elif name == "br":
        paragraph.add_run().add_break()
    elif name in ("span", "a"):
        for ch in node.children:
            render_inline(paragraph, ch, bold=bold, italic=italic)
    else:
        for ch in node.children:
            render_inline(paragraph, ch, bold=bold, italic=italic)


# ---------- LETTER mode block handlers ----------

def add_letterhead(doc: Document, node: Tag) -> None:
    company = node.find(class_="company")
    doctype = node.find(class_="doctype")
    if company:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(2)
        _add_run(p, company.get_text(" ", strip=True),
                 bold=True, size_pt=14, font="Lato")
    if doctype:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(14)
        _add_run(p, doctype.get_text(" ", strip=True),
                 italic=True, size_pt=10, color=INK_SOFT_LETTER, font="Lato")


def add_meta_block(doc: Document, node: Tag) -> None:
    rows = node.find_all(class_="row")
    if not rows:
        return
    table = doc.add_table(rows=len(rows), cols=2)
    _clear_table_borders(table)
    table.autofit = False
    table.columns[0].width = Cm(2.5)
    table.columns[1].width = Cm(13.5)
    for i, row in enumerate(rows):
        lbl_div = row.find(class_="lbl")
        val_div = row.find(class_="val")
        cell_l = table.cell(i, 0)
        cell_l.width = Cm(2.5)
        cell_l.text = ""
        p = cell_l.paragraphs[0]
        p.paragraph_format.space_after = Pt(2)
        _add_run(p, (lbl_div.get_text(" ", strip=True) if lbl_div else "").upper(),
                 bold=True, size_pt=8.5, color=INK_SOFT_LETTER, font="Lato")
        cell_r = table.cell(i, 1)
        cell_r.width = Cm(13.5)
        cell_r.text = ""
        p2 = cell_r.paragraphs[0]
        p2.paragraph_format.space_after = Pt(2)
        if val_div:
            for ch in val_div.children:
                render_inline(p2, ch)
        for run in p2.runs:
            if run.font.size is None:
                run.font.size = Pt(10)
            if run.font.name is None:
                run.font.name = "Lato"
    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_after = Pt(4)


def add_greeting(doc: Document, node: Tag) -> None:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(10)
    text = node.get_text(" ", strip=True)
    _add_run(p, text, bold=True, size_pt=11.5, font="Lato")


def add_signoff(doc: Document, node: Tag) -> None:
    closer = node.find("p", class_="closer")
    if closer:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(24)
        _add_run(p, closer.get_text(" ", strip=True), size_pt=10, font="Lato")
    name = node.find(class_="name")
    if name:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(0)
        _add_run(p, name.get_text(" ", strip=True), bold=True, size_pt=10, font="Lato")
    role = node.find(class_="role")
    if role:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(0)
        _add_run(p, role.get_text(" ", strip=True),
                 size_pt=9.5, color=INK_SOFT_LETTER, font="Lato")


def add_letter_section_heading(doc: Document, text: str) -> None:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    _add_run(p, text, bold=True, size_pt=13, font="Lato")


# ---------- JD mode block handlers ----------

def add_jd_title(doc: Document, text: str) -> None:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    _add_run(p, text.upper(), bold=True, size_pt=18, font="Calibri")


def add_jd_subtitle(doc: Document, text: str) -> None:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(14)
    _add_run(p, text, italic=True, size_pt=11, color=INK_SOFT_JD, font="Calibri")


def add_jd_section_heading(doc: Document, text: str) -> None:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    _add_run(p, text.upper(), bold=True, size_pt=12, font="Calibri")


def add_jd_subheading(doc: Document, text: str) -> None:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    _add_run(p, text, bold=True, size_pt=11, font="Calibri")


def add_jd_table(doc: Document, node: Tag) -> None:
    """Native Word table styled like the RM-MV reference (navy header, cream alt rows)."""
    rows = node.find_all("tr")
    if not rows:
        return

    # Identify header row
    first_has_th = any(rows[0].find_all("th"))
    if first_has_th:
        header_cells = rows[0].find_all(["th", "td"])
        body_trs = rows[1:]
    else:
        header_cells = []
        body_trs = rows

    body_rows = [tr.find_all(["th", "td"]) for tr in body_trs]
    ncols = max(len(header_cells), max((len(r) for r in body_rows), default=0))
    nrows = (1 if header_cells else 0) + len(body_rows)
    table = doc.add_table(rows=nrows, cols=ncols)
    table.autofit = True

    row_idx = 0
    if header_cells:
        for i, c in enumerate(header_cells):
            cell = table.cell(row_idx, i)
            cell.text = ""
            _shade_cell(cell, TABLE_HEADER_BG)
            _set_cell_borders(cell, color=TABLE_HEADER_BG, size="4")
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            _add_run(p, c.get_text(" ", strip=True),
                     bold=True, color=TABLE_HEADER_INK, size_pt=10, font="Calibri")
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        row_idx += 1

    for r_i, cells in enumerate(body_rows):
        is_alt = r_i % 2 == 1
        for c_i, c in enumerate(cells):
            cell = table.cell(row_idx + r_i, c_i)
            cell.text = ""
            if is_alt:
                _shade_cell(cell, TABLE_ALT_BG)
            _set_cell_borders(cell, color=RULE_HEX, size="4")
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            for child in c.children:
                render_inline(p, child)
            for run in p.runs:
                if run.font.size is None:
                    run.font.size = Pt(10)
                if run.font.name is None:
                    run.font.name = "Calibri"
            cell.vertical_alignment = WD_ALIGN_VERTICAL.TOP


# ---------- shared block handlers ----------

def add_paragraph(doc: Document, node: Tag, *, font: str) -> None:
    cls = node.get("class") or []
    p = doc.add_paragraph()
    if "subhead" in cls:
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(4)
        _add_run(p, node.get_text(" ", strip=True), bold=True, size_pt=11 if font == "Calibri" else 10, font=font)
        return
    p.paragraph_format.space_after = Pt(5)
    for child in node.children:
        render_inline(p, child)
    for run in p.runs:
        if run.font.name is None:
            run.font.name = font


def add_list(doc: Document, node: Tag, *, ordered: bool, start: int, font: str) -> None:
    """Render <ul>/<ol> as Word List Bullet / List Number paragraphs.

    The Word style emits the bullet or number automatically. We do NOT
    prepend a literal "•  " / "1. " in the run text — that produced a
    visible double bullet/number that Trent had to strip by hand.
    Fallback: if the named style doesn't exist (non-default doc), we
    emit the prefix manually so the list is still readable.
    """
    style_name = "List Number" if ordered else "List Bullet"
    counter = start
    for li in node.find_all("li", recursive=False):
        style_applied = True
        try:
            p = doc.add_paragraph(style=style_name)
        except KeyError:
            p = doc.add_paragraph()
            style_applied = False
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.left_indent = Cm(0.7)
        if not style_applied:
            # No list style available — emit a manual bullet/number so the
            # output is still readable. Default path skips this entirely.
            if ordered:
                _add_run(p, f"{counter}. ", font=font)
            else:
                _add_run(p, "•  ", font=font)
        if ordered:
            counter += 1
        for child in li.children:
            render_inline(p, child)
        for run in p.runs:
            if run.font.name is None:
                run.font.name = font


# ---------- mode detection and dispatch ----------

def detect_mode(soup: BeautifulSoup) -> str:
    if soup.find(class_="letterhead") is not None:
        return "letter"
    if soup.find("h1") is not None:
        return "jd"
    # Fallback: if there's a div.page or div.wrap, look deeper
    body = soup.body or soup
    if body.find("h1") is not None:
        return "jd"
    return "letter"


def walk_letter(doc: Document, root: Tag) -> None:
    for node in root.children:
        if isinstance(node, NavigableString):
            continue
        if not isinstance(node, Tag):
            continue
        name = node.name.lower()
        classes = node.get("class") or []
        if name == "div" and "page" in classes:
            walk_letter(doc, node)
        elif name == "div" and "letterhead" in classes:
            add_letterhead(doc, node)
        elif name == "div" and "meta" in classes:
            add_meta_block(doc, node)
        elif name == "p" and "greeting" in classes:
            add_greeting(doc, node)
        elif name == "div" and "signoff" in classes:
            add_signoff(doc, node)
        elif name == "h2":
            add_letter_section_heading(doc, node.get_text(" ", strip=True))
        elif name == "h3":
            # Letters use inline bold subheads; emit as bold paragraph.
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(4)
            _add_run(p, node.get_text(" ", strip=True), bold=True, size_pt=10, font="Lato")
        elif name == "p":
            add_paragraph(doc, node, font="Lato")
        elif name == "ul":
            add_list(doc, node, ordered=False, start=1, font="Lato")
        elif name == "ol":
            start_attr = node.get("start")
            start = int(start_attr) if start_attr and start_attr.isdigit() else 1
            add_list(doc, node, ordered=True, start=start, font="Lato")
        else:
            walk_letter(doc, node)


def walk_jd(doc: Document, root: Tag) -> None:
    for node in root.children:
        if isinstance(node, NavigableString):
            continue
        if not isinstance(node, Tag):
            continue
        name = node.name.lower()
        classes = node.get("class") or []
        if name == "div" and ("page" in classes or "wrap" in classes):
            walk_jd(doc, node)
        elif name == "h1":
            add_jd_title(doc, node.get_text(" ", strip=True))
        elif name == "p" and "subtitle" in classes:
            add_jd_subtitle(doc, node.get_text(" ", strip=True))
        elif name == "h2":
            add_jd_section_heading(doc, node.get_text(" ", strip=True))
        elif name == "h3":
            add_jd_subheading(doc, node.get_text(" ", strip=True))
        elif name == "h4":
            # treat h4 same as h3 for canonical simplicity
            add_jd_subheading(doc, node.get_text(" ", strip=True))
        elif name == "p":
            add_paragraph(doc, node, font="Calibri")
        elif name == "ul":
            add_list(doc, node, ordered=False, start=1, font="Calibri")
        elif name == "ol":
            start_attr = node.get("start")
            start = int(start_attr) if start_attr and start_attr.isdigit() else 1
            add_list(doc, node, ordered=True, start=start, font="Calibri")
        elif name == "table":
            add_jd_table(doc, node)
        else:
            walk_jd(doc, node)


# ---------- public entry ----------

def convert(html_path: Path, out_path: Path) -> str:
    html = html_path.read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "html.parser")
    mode = detect_mode(soup)
    doc = Document()
    if mode == "letter":
        configure_letter(doc)
        walk_letter(doc, soup.body or soup)
    else:
        configure_jd(doc)
        walk_jd(doc, soup.body or soup)
    doc.save(str(out_path))
    return mode


def main() -> None:
    if len(sys.argv) != 3:
        print("Usage: python html_to_word_genesis.py <source.html> <output.docx>")
        sys.exit(2)
    src = Path(sys.argv[1])
    dst = Path(sys.argv[2])
    mode = convert(src, dst)
    print(f"OK [{mode}] {dst} ({dst.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
