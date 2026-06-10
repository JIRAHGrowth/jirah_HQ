"""Convert Genesis Trent-pack drafts to .docx for client editing.

PDFs -> pdf2docx (preserves layout reasonably well)
HTMLs -> htmldocx (handles inline styles, lists, tables)
"""
from pathlib import Path
from pdf2docx import Converter
from htmldocx import HtmlToDocx
from docx import Document

DRAFTS = Path(
    r"C:\Users\joshu\OneDrive - jirahgrowth.consulting"
    r"\JIRAH Growth Partners - Shared\01 - Clients\Active"
    r"\Genesis Systems\07 - Deliverables\Drafts"
)

FILES = [
    "Lance-Offer-Letter-v1.pdf",
    "Email-to-Trent-Lance-Package-Cover.html",
    "Combined-RM-Announcement-Letter-v2.pdf",
    "Sales-Warranty-Coordinator-Nathan-v1.html",
]


def convert_pdf(src: Path, dst: Path) -> None:
    cv = Converter(str(src))
    cv.convert(str(dst), start=0, end=None)
    cv.close()


def convert_html(src: Path, dst: Path) -> None:
    html = src.read_text(encoding="utf-8")
    doc = Document()
    parser = HtmlToDocx()
    parser.add_html_to_document(html, doc)
    doc.save(str(dst))


def main() -> None:
    for name in FILES:
        src = DRAFTS / name
        dst = DRAFTS / (src.stem + ".docx")
        print(f"Converting: {name} -> {dst.name}")
        try:
            if src.suffix.lower() == ".pdf":
                convert_pdf(src, dst)
            elif src.suffix.lower() in (".html", ".htm"):
                convert_html(src, dst)
            else:
                print(f"  SKIP: unsupported extension {src.suffix}")
                continue
            print(f"  OK ({dst.stat().st_size:,} bytes)")
        except Exception as exc:
            print(f"  FAILED: {exc}")


if __name__ == "__main__":
    main()
