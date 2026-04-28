"""Shared path constants for JIRAH builder scripts.

DO NOT hardcode OneDrive paths inside individual builder scripts. Import
constants from here. If the JIRAH OneDrive root ever moves (e.g., when
JIRAH gets its own SharePoint tenant), only this file needs updating.

The `NEW - JIRAH MASTER` subfolder was promoted to top-level in the
April 2026 migration. Paths MUST NOT include that segment. The
`assert_no_legacy_segment` guard rejects any path that still does.
"""
from pathlib import Path


# Root of the shared JIRAH OneDrive workspace.
JIRAH_ROOT = Path(
    r"C:\Users\joshu\OneDrive - jirahgrowth.consulting"
    r"\JIRAH Growth Partners - Shared"
)

# Common subpaths (mirror the canonical 6-branch schema in CLAUDE.md).
ACTIVE_CLIENTS = JIRAH_ROOT / "01 - Clients" / "Active"
INACTIVE_CLIENTS = JIRAH_ROOT / "01 - Clients" / "Inactive"
SALES_PIPELINE = JIRAH_ROOT / "02 - Sales & Pipeline"
MARKETING = JIRAH_ROOT / "03 - Marketing & Content"
DELIVERABLE_TEMPLATES = JIRAH_ROOT / "04 - Deliverable Templates"
CORPORATE = JIRAH_ROOT / "05 - Corporate"
OPS_COMMAND_CENTER = JIRAH_ROOT / "06 - Ops Command Center"


def assert_no_legacy_segment(path):
    """Reject paths still referencing the pre-migration `NEW - JIRAH MASTER` folder.

    Call this on any output path before writing. Catches regressions from
    Claude sessions or scripts that recall the old structure.
    """
    if "NEW - JIRAH MASTER" in str(path):
        raise ValueError(
            f"Forbidden path segment 'NEW - JIRAH MASTER' detected in:\n  {path}\n\n"
            "That folder was promoted to top-level in the April 2026 migration. "
            "Update the path to drop the '\\NEW - JIRAH MASTER\\' segment — "
            "outputs go directly under 'JIRAH Growth Partners - Shared\\01 - Clients\\...'."
        )
