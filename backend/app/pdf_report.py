"""PDF report generator (ReportLab only — no GTK/WeasyPrint system deps)."""

from __future__ import annotations

import io
from datetime import datetime
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import (
    BaseDocTemplate,
    Flowable,
    Frame,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

from . import content
from .config import CONTACT
from .content import t

NAVY = colors.HexColor("#0B1020")
INK = colors.HexColor("#1E293B")
MUTED = colors.HexColor("#64748B")
ACCENT = colors.HexColor("#0891B2")
ACCENT_2 = colors.HexColor("#6366F1")
LIGHT = colors.HexColor("#F1F5F9")
LINE = colors.HexColor("#E2E8F0")
RED = colors.HexColor("#DC2626")
AMBER = colors.HexColor("#D97706")
GREEN = colors.HexColor("#059669")

PAGE_W, PAGE_H = A4
MARGIN = 17 * mm
CONTENT_W = PAGE_W - 2 * MARGIN


def _clean(text: str) -> str:
    """Make text safe for the standard WinAnsi fonts."""
    return (
        str(text)
        .replace("\u2212", "-")
        .replace("\u2011", "-")
        .replace("\u00a0", " ")
        .replace("\u2019", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
    )


def _p(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(escape(_clean(text)), style)


def _styles() -> dict[str, ParagraphStyle]:
    return {
        "kicker": ParagraphStyle(
            "kicker", fontName="Helvetica-Bold", fontSize=8, leading=10,
            textColor=ACCENT, spaceAfter=4,
        ),
        "h1": ParagraphStyle(
            "h1", fontName="Helvetica-Bold", fontSize=22, leading=26,
            textColor=NAVY, spaceAfter=4,
        ),
        "subtitle": ParagraphStyle(
            "subtitle", fontName="Helvetica", fontSize=10, leading=14,
            textColor=MUTED, spaceAfter=2,
        ),
        "h2": ParagraphStyle(
            "h2", fontName="Helvetica-Bold", fontSize=13, leading=16,
            textColor=NAVY, spaceBefore=12, spaceAfter=6,
        ),
        "h3": ParagraphStyle(
            "h3", fontName="Helvetica-Bold", fontSize=10, leading=13,
            textColor=NAVY, spaceBefore=6, spaceAfter=3,
        ),
        "body": ParagraphStyle(
            "body", fontName="Helvetica", fontSize=9.2, leading=13.6,
            textColor=INK, alignment=TA_LEFT,
        ),
        "small": ParagraphStyle(
            "small", fontName="Helvetica", fontSize=8, leading=11, textColor=MUTED
        ),
        "cell": ParagraphStyle(
            "cell", fontName="Helvetica", fontSize=8.4, leading=11.5, textColor=INK
        ),
        "cell_bold": ParagraphStyle(
            "cell_bold", fontName="Helvetica-Bold", fontSize=8.4, leading=11.5,
            textColor=NAVY,
        ),
        "quote": ParagraphStyle(
            "quote", fontName="Helvetica-Oblique", fontSize=10, leading=14,
            textColor=ACCENT,
        ),
        "cta": ParagraphStyle(
            "cta", fontName="Helvetica", fontSize=9.4, leading=14, textColor=INK
        ),
    }


class ScoreBars(Flowable):
    """Horizontal bar chart drawn directly on the canvas."""

    def __init__(self, rows: list[tuple], width: float = CONTENT_W) -> None:
        super().__init__()
        self.rows = rows
        self.width = width
        self.row_h = 15
        self.height = max(1, len(rows)) * self.row_h + 4
        self.label_w = 62 * mm
        self.value_w = 10 * mm

    def wrap(self, avail_width: float, avail_height: float) -> tuple[float, float]:
        return self.width, self.height

    def draw(self) -> None:
        canvas = self.canv
        bar_x = self.label_w + 2 * mm
        bar_w = self.width - self.label_w - self.value_w - 2 * mm
        y = self.height - self.row_h

        for row in self.rows:
            label, value = row[0], row[1]
            invert = bool(row[2]) if len(row) > 2 else False
            effective = 100 - value if invert else value
            color = GREEN if effective >= 70 else AMBER if effective >= 40 else RED
            canvas.setFillColor(INK)
            canvas.setFont("Helvetica", 8.2)
            canvas.drawString(0, y + 3.5, label[:52])
            canvas.setFillColor(LIGHT)
            canvas.roundRect(bar_x, y + 2, bar_w, 6, 3, stroke=0, fill=1)
            canvas.setFillColor(color)
            canvas.roundRect(bar_x, y + 2, max(1.5, bar_w * value / 100), 6, 3, stroke=0, fill=1)
            canvas.setFillColor(MUTED)
            canvas.setFont("Helvetica-Bold", 8.2)
            canvas.drawRightString(self.width, y + 3.5, str(value))
            y -= self.row_h


class FitBars(Flowable):
    """People vs Systems fit comparison."""

    def __init__(self, people: int, systems: int, labels: tuple[str, str]) -> None:
        super().__init__()
        self.people = people
        self.systems = systems
        self.labels = labels
        self.width = CONTENT_W
        self.height = 34

    def wrap(self, avail_width: float, avail_height: float) -> tuple[float, float]:
        return self.width, self.height

    def draw(self) -> None:
        canvas = self.canv
        label_w = 28 * mm
        bar_w = self.width - label_w - 12 * mm
        for index, (label, value, color) in enumerate(
            (
                (self.labels[0], self.people, ACCENT),
                (self.labels[1], self.systems, ACCENT_2),
            )
        ):
            y = 20 - index * 16
            canvas.setFont("Helvetica", 8.2)
            canvas.setFillColor(INK)
            canvas.drawString(0, y + 2, label)
            canvas.setFillColor(LIGHT)
            canvas.roundRect(label_w, y, bar_w, 7, 3, stroke=0, fill=1)
            canvas.setFillColor(color)
            canvas.roundRect(label_w, y, max(1.5, bar_w * value / 100), 7, 3, stroke=0, fill=1)
            canvas.setFont("Helvetica-Bold", 8.2)
            canvas.setFillColor(MUTED)
            canvas.drawRightString(self.width, y + 2, str(value))


def _section(title: str, styles: dict[str, ParagraphStyle]) -> Paragraph:
    return _p(title, styles["h2"])


def _box(flowables: list, background: colors.Color, border: colors.Color) -> Table:
    table = Table([[flowables]], colWidths=[CONTENT_W])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), background),
                ("BOX", (0, 0), (-1, -1), 0.7, border),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return table


def _footer(canvas, doc) -> None:
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.6)
    canvas.line(MARGIN, 15 * mm, PAGE_W - MARGIN, 15 * mm)
    canvas.setFont("Helvetica", 7.2)
    canvas.setFillColor(MUTED)
    canvas.drawString(MARGIN, 10.5 * mm, _clean(f"{t('es', 'pdf.footer_note')}"))
    canvas.drawString(MARGIN, 7 * mm, _clean(f"{CONTACT['website']}  ·  {CONTACT['phone']}  ·  {CONTACT['email']}"))
    canvas.drawRightString(PAGE_W - MARGIN, 10.5 * mm, f"{t('es', 'pdf.page')} {doc.page}")
    canvas.restoreState()


def render_pdf(answers: dict, result: dict) -> bytes:
    lang = result.get("language", "es")
    styles = _styles()
    buffer = io.BytesIO()

    doc = BaseDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN,
        bottomMargin=22 * mm,
        title=_clean(f"{t(lang, 'pdf.title')} · {answers['company_name']}"),
        author="Cloud Automate",
        subject=_clean(t(lang, "pdf.subtitle")),
    )
    frame = Frame(MARGIN, 22 * mm, CONTENT_W, PAGE_H - MARGIN - 22 * mm, id="body")
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=_footer)])

    profile = result["profile"]
    scores = result["scores"]
    story: list = []

    # ---- Cover / header -------------------------------------------------
    story.append(_p(t(lang, "app.brand").upper(), styles["kicker"]))
    story.append(_p(t(lang, "pdf.title"), styles["h1"]))
    story.append(_p(t(lang, "pdf.subtitle"), styles["subtitle"]))
    story.append(Spacer(1, 5 * mm))

    header_rows = [
        [_p(t(lang, "pdf.prepared_for"), styles["small"]), _p(profile["company_name"], styles["cell_bold"])],
        [_p(t(lang, "pdf.date"), styles["small"]), _p(datetime.now().strftime("%d/%m/%Y"), styles["cell"])],
        [_p(t(lang, "pdf.contact"), styles["small"]), _p(f"{profile['contact_name']} · {profile['email']}", styles["cell"])],
    ]
    header_table = Table(header_rows, colWidths=[32 * mm, CONTENT_W - 32 * mm])
    header_table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
                ("TOPPADDING", (0, 0), (-1, -1), 2),
            ]
        )
    )
    story.append(header_table)
    story.append(Spacer(1, 3 * mm))
    story.append(_p(t(lang, "pdf.confidential").upper(), styles["kicker"]))
    story.append(Spacer(1, 2 * mm))

    # ---- Profile --------------------------------------------------------
    profile_rows = [
        [_p(t(lang, "employees.label"), styles["small"]), _p(profile["employees"], styles["cell"]),
         _p(t(lang, "profile.sector"), styles["small"]), _p(profile["sector_label"], styles["cell"])],
        [_p(t(lang, "profile.budget"), styles["small"]), _p(profile["budget_label"], styles["cell"]),
         _p(t(lang, "profile.privacy"), styles["small"]), _p(profile["confidentiality_label"], styles["cell"])],
        [_p(t(lang, "profile.maturity"), styles["small"]), _p(profile["ai_maturity_label"], styles["cell"]),
         _p(t(lang, "profile.urgency"), styles["small"]), _p(profile["urgency_label"], styles["cell"])],
    ]
    profile_table = Table(profile_rows, colWidths=[22 * mm, 64 * mm, 22 * mm, CONTENT_W - 108 * mm])
    profile_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), LIGHT),
                ("BOX", (0, 0), (-1, -1), 0.5, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.3, colors.white),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(profile_table)

    # ---- Executive summary ---------------------------------------------
    story.append(_section(t(lang, "section.summary"), styles))
    story.append(_p(result["summary"], styles["body"]))

    # ---- Scores ---------------------------------------------------------
    story.append(_section(t(lang, "section.scores"), styles))
    score_rows = [
        (
            t(lang, f"score.{key}"),
            scores[key],
            key == "compliance_risk",
        )
        for key in (
            "data_maturity",
            "digital_infrastructure",
            "ai_readiness",
            "change_readiness",
            "pain_intensity",
            "budget_capacity",
            "compliance_risk",
        )
    ]
    story.append(ScoreBars(score_rows))
    story.append(Spacer(1, 3 * mm))
    white_bold = ParagraphStyle(
        "white_bold", parent=styles["cell_bold"], textColor=colors.white
    )
    overall = Table(
        [[
            _p(t(lang, "score.overall"), white_bold),
            _p(f"{scores['overall']} / 100", white_bold),
            _p(f"{t(lang, 'score.grade')} {result['grade']}", white_bold),
        ]],
        colWidths=[CONTENT_W - 70 * mm, 40 * mm, 30 * mm],
    )
    overall.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), NAVY),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
            ]
        )
    )
    story.append(overall)

    # ---- Data health ----------------------------------------------------
    story.append(_section(t(lang, "section.data_health"), styles))
    health = result["data_health"]
    health_color = {"red": RED, "amber": AMBER, "green": GREEN}[health["level"]]
    story.append(
        _box(
            [
                _p(health["title"], styles["h3"]),
                _p(health["message"], styles["body"]),
                Spacer(1, 2 * mm),
                _p(health["quote"], styles["quote"]),
            ],
            colors.HexColor("#FFF7ED") if health["level"] == "red" else colors.HexColor("#F8FAFC"),
            health_color,
        )
    )

    # ---- Strategy -------------------------------------------------------
    story.append(_section(t(lang, "section.strategy"), styles))
    story.append(_p(result["strategy_label"], styles["h3"]))
    story.append(_p(result["strategy_desc"], styles["body"]))
    story.append(Spacer(1, 3 * mm))
    story.append(
        FitBars(
            result["fit"]["people"],
            result["fit"]["systems"],
            (t(lang, "fit.people"), t(lang, "fit.systems")),
        )
    )

    # ---- Tech stack -----------------------------------------------------
    story.append(_section(t(lang, "section.tech"), styles))
    tech_rows = [[_p(t(lang, "tech.col_tool"), styles["cell_bold"]), _p(t(lang, "tech.col_why"), styles["cell_bold"])]]
    for item in result["tech_stack"]:
        tech_rows.append([_p(item["name"], styles["cell_bold"]), _p(item["why"], styles["cell"])])
    tech_table = Table(tech_rows, colWidths=[52 * mm, CONTENT_W - 52 * mm], repeatRows=1)
    tech_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), LIGHT),
                ("LINEBELOW", (0, 0), (-1, -1), 0.3, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(tech_table)

    # ---- Pilot ----------------------------------------------------------
    pilot = result["pilot"]
    story.append(_section(t(lang, "section.pilot"), styles))
    pilot_rows = [
        [_p(pilot["title"], styles["h3"])],
        [_p(pilot["description"], styles["body"])],
        [
            _p(
                f"{pilot['metric']}  ·  {pilot['baseline']}  ·  {pilot['target']}",
                styles["small"],
            )
        ],
        [_p(f"{pilot['duration']}  ·  {pilot['risk']}  ·  {pilot['note']}", styles["small"])],
    ]
    pilot_table = Table(pilot_rows, colWidths=[CONTENT_W])
    pilot_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F0F9FF")),
                ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#BAE6FD")),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                ("TOPPADDING", (0, 0), (0, 0), 8),
                ("BOTTOMPADDING", (0, -1), (-1, -1), 8),
            ]
        )
    )
    story.append(pilot_table)

    # ---- Change plan ----------------------------------------------------
    story.append(_section(t(lang, "section.change"), styles))
    for index, item in enumerate(result["change_plan"], start=1):
        story.append(
            Paragraph(
                f"<b>{index}. {escape(_clean(item['title']))}</b>", styles["body"]
            )
        )
        story.append(_p(item["description"], styles["body"]))
        story.append(Spacer(1, 1.5 * mm))

    # ---- Roadmap --------------------------------------------------------
    story.append(_section(t(lang, "section.roadmap"), styles))
    for phase in result["roadmap"]:
        block = [_p(phase["title"], styles["h3"])]
        block += [_p(f"• {action}", styles["body"]) for action in phase["actions"]]
        block.append(Spacer(1, 2 * mm))
        story.append(KeepTogether(block))

    # ---- Quick wins & risks --------------------------------------------
    story.append(_section(t(lang, "section.quick_wins"), styles))
    for win in result["quick_wins"]:
        story.append(_p(f"• {win}", styles["body"]))

    story.append(_section(t(lang, "section.risks"), styles))
    for risk in result["risks"]:
        story.append(
            Paragraph(f"<b>{escape(_clean(risk['title']))}</b>", styles["body"])
        )
        story.append(_p(risk["description"], styles["body"]))
        story.append(Spacer(1, 1.2 * mm))

    # ---- CTA + contact --------------------------------------------------
    story.append(Spacer(1, 4 * mm))
    white_h3 = ParagraphStyle("white_h3", parent=styles["h3"], textColor=colors.white)
    white_cta = ParagraphStyle("white_cta", parent=styles["cta"], textColor=colors.white)
    white_link = ParagraphStyle(
        "white_link", parent=styles["cell_bold"], textColor=colors.white
    )
    story.append(
        _box(
            [
                _p(result["cta"]["title"], white_h3),
                _p(result["cta"]["body"], white_cta),
                Spacer(1, 2 * mm),
                _p(
                    f"{CONTACT['phone']}  ·  {CONTACT['email']}  ·  {CONTACT['website']}",
                    white_link,
                ),
            ],
            NAVY,
            NAVY,
        )
    )

    story.append(Spacer(1, 3 * mm))
    story.append(_p(t(lang, "pdf.disclaimer"), styles["small"]))

    doc.build(story)
    return buffer.getvalue()
