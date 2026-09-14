"""
One-off generator for placeholder brand assets: favicon, OG/social share
images, and abstract content placeholders for the two template sites.
Not part of the deployed site — run once, commit the outputs, delete
or ignore this script's dependency on Pillow afterward if you like.
"""
import io
import math
import random
from pathlib import Path

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ICONS = ROOT / "assets" / "icons"
OG = ROOT / "assets" / "og"
IMAGES = ROOT / "assets" / "images"
FONT_DIR = Path(r"C:\Windows\Fonts")
BRAND_FONTS_DIR = ROOT / "shared" / "fonts"

GEORGIA_BOLD = str(FONT_DIR / "georgiab.ttf")
SEGOE = str(FONT_DIR / "segoeui.ttf")
SEGOE_BOLD = str(FONT_DIR / "segoeuib.ttf")

_ttf_cache = {}


def brand_font_bytes(woff2_name):
    """Convert one of the site's self-hosted woff2 files (see
    self_host_fonts.py) to ttf in memory, so ImageFont can load it —
    Pillow/FreeType can't read woff2 directly. Cached per run."""
    if woff2_name not in _ttf_cache:
        font = TTFont(str(BRAND_FONTS_DIR / woff2_name))
        font.flavor = None
        buf = io.BytesIO()
        font.save(buf)
        _ttf_cache[woff2_name] = buf.getvalue()
    return _ttf_cache[woff2_name]


def load_font(woff2_name, size, weight=None, opsz=None):
    """Load a brand woff2 as a PIL font, pinning variable-font axes
    (weight, optical size) to a specific value instead of silently using
    the font's default instance — several of these brand fonts default
    to Thin, not the weight the site's CSS renders via font-weight ranges."""
    font = ImageFont.truetype(io.BytesIO(brand_font_bytes(woff2_name)), size)
    try:
        axes = font.get_variation_axes()
    except OSError:
        return font  # not a variable font
    wanted = {"weight": weight, "optical size": opsz}
    values = []
    for axis in axes:
        name = axis["name"].decode().lower() if isinstance(axis["name"], bytes) else axis["name"].lower()
        values.append(wanted.get(name) if wanted.get(name) is not None else axis["default"])
    font.set_variation_by_axes(values)
    return font


# Real brand fonts — filenames from shared/fonts/, see self_host_fonts.py —
# so OG cards match each page's actual typography.
BRICOLAGE = "bricolage-grotesque-800-normal-2.woff2"
JETBRAINS_MONO = "jetbrains-mono-700-normal-2.woff2"
BIG_SHOULDERS = "big-shoulders-display-800-normal-2.woff2"
IBM_PLEX_MONO = "ibm-plex-mono-600-normal-2.woff2"
FRAUNCES = "fraunces-700-normal-2.woff2"
KARLA = "karla-500-normal-2.woff2"

# ---- Brand palettes (colors match each site's actual --color-accent) ----
NODWEB = {
    "bg": (15, 19, 38), "bg2": (23, 29, 56), "accent": (109, 135, 255), "text": (245, 246, 250),
    "title_font": BRICOLAGE, "title_weight": 800, "title_opsz": 96,
    "label_font": JETBRAINS_MONO, "label_weight": 700,
}
ARCH = {
    "bg": (39, 33, 28), "bg2": (58, 46, 36), "accent": (168, 70, 31), "text": (250, 247, 243),
    "title_font": BIG_SHOULDERS, "title_weight": 800, "title_opsz": None,
    "label_font": IBM_PLEX_MONO, "label_weight": None,
}
CAFE = {
    "bg": (43, 34, 25), "bg2": (61, 47, 33), "accent": (189, 91, 44), "text": (250, 247, 243),
    "title_font": FRAUNCES, "title_weight": 700, "title_opsz": 144,
    "label_font": KARLA, "label_weight": 500,
}


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient(size, c1, c2, angle=45):
    w, h = size
    img = Image.new("RGB", size, c1)
    px = img.load()
    diag = w * math.cos(math.radians(angle)) + h * math.sin(math.radians(angle))
    for y in range(h):
        for x in range(w):
            t = (x * math.cos(math.radians(angle)) + y * math.sin(math.radians(angle))) / diag
            px[x, y] = lerp(c1, c2, max(0, min(1, t)))
    return img


def add_grain(img, amount=6):
    w, h = img.size
    noise = Image.effect_noise((w, h), 24).convert("L")
    noise = noise.point(lambda p: 128 + (p - 128) * amount // 24)
    base = img.convert("RGB")
    out = Image.blend(base, Image.merge("RGB", (noise, noise, noise)), 0.035)
    return out


def node_mark(draw, cx, cy, r, color, line_color, line_w):
    pts = [
        (cx, cy - r),
        (cx - r * 0.87, cy + r * 0.5),
        (cx + r * 0.87, cy + r * 0.5),
    ]
    for i in range(3):
        for j in range(i + 1, 3):
            draw.line([pts[i], pts[j]], fill=line_color, width=line_w)
    dot_r = max(2, int(r * 0.16))
    for p in pts:
        draw.ellipse([p[0] - dot_r, p[1] - dot_r, p[0] + dot_r, p[1] + dot_r], fill=color)


# ---- Favicon / app icons --------------------------------------------
def make_icon(size):
    img = Image.new("RGB", (size, size), NODWEB["bg"])
    draw = ImageDraw.Draw(img)
    cx, cy = size / 2, size / 2 + size * 0.03
    r = size * 0.30
    line_w = max(1, round(size * 0.045))
    accent = tuple(min(255, c + 40) for c in NODWEB["accent"])
    node_mark(draw, cx, cy, r, accent, NODWEB["text"], line_w)
    return img


def build_icons():
    ICONS.mkdir(parents=True, exist_ok=True)
    sizes = [16, 32, 48, 180, 192, 512]
    imgs = {s: make_icon(s) for s in sizes}
    imgs[512].save(ICONS / "icon-512.png")
    imgs[192].save(ICONS / "icon-192.png")
    imgs[180].save(ICONS / "apple-touch-icon.png")
    imgs[32].save(
        ICONS / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )
    print("icons done")


# ---- OG / social share images (1200x630) -----------------------------
def wrap_text(draw, text, font, max_width):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=font) <= max_width:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def centered_text(draw, cy, text, font, fill, canvas_w=1200):
    w = draw.textlength(text, font=font)
    draw.text(((canvas_w - w) / 2, cy), text, font=font, fill=fill)


def make_og(filename, palette, eyebrow, title, subtitle):
    # Everything is horizontally centered and kept within the middle ~630px
    # column: WhatsApp (and some other apps) crop link-preview images to a
    # roughly square thumbnail from the center, so anything living near the
    # left/right edges — like a left-aligned wordmark — gets cut off.
    size = (1200, 630)
    img = gradient(size, palette["bg"], palette["bg2"], angle=25)
    img = add_grain(img, amount=5)
    draw = ImageDraw.Draw(img)

    eyebrow_font = load_font(palette["label_font"], 26, weight=palette["label_weight"])
    title_font = load_font(palette["title_font"], 72, weight=palette["title_weight"], opsz=palette["title_opsz"])
    sub_font = ImageFont.truetype(SEGOE, 28)

    mark_accent = tuple(min(255, c + 30) for c in palette["accent"])
    node_mark(draw, 600, 110, 40, mark_accent, palette["text"], 4)

    centered_text(draw, 180, eyebrow.upper(), eyebrow_font, palette["accent"])

    title_lines = wrap_text(draw, title, title_font, 1000)
    y = 225
    for line in title_lines:
        centered_text(draw, y, line, title_font, palette["text"])
        y += 84

    y += 16
    sub_lines = wrap_text(draw, subtitle, sub_font, 820)
    for line in sub_lines:
        centered_text(draw, y, line, sub_font, tuple(int(c * 0.85) for c in palette["text"]))
        y += 40

    img.save(OG / filename, quality=90)


def build_og():
    OG.mkdir(parents=True, exist_ok=True)
    make_og(
        "home.jpg",
        NODWEB,
        "Bucharest \u2022 Web design for local businesses",
        "NodWeb",
        "Fast, modern websites for cafes, contractors, salons, and studios.",
    )
    make_og(
        "architecture-studio.jpg",
        ARCH,
        "Template example \u2014 by NodWeb",
        "Atlas & Vine Architecture",
        "An architecture studio template with an interactive 3D model viewer.",
    )
    make_og(
        "local-business.jpg",
        CAFE,
        "Template example \u2014 by NodWeb",
        "The Copper Kettle Cafe",
        "A local-business template for cafes, salons, contractors, and shops.",
    )
    print("og images done")


# ---- Abstract content placeholders (no text, alt text carries meaning) ---
def make_placeholder(filename, ratio_wh, palette, seed):
    random.seed(seed)
    w = 1200
    h = int(w / ratio_wh)
    hue_shift = random.uniform(-10, 10)
    c1 = tuple(max(0, min(255, c + hue_shift)) for c in palette["bg"])
    c2 = palette["accent"]
    angle = random.choice([20, 45, 70, 110, 160])
    img = gradient((w, h), tuple(int(c) for c in c1), tuple(int(c) for c in c2), angle=angle)
    img = img.filter(ImageFilter.GaussianBlur(2))
    img = add_grain(img, amount=4)
    IMAGES.mkdir(parents=True, exist_ok=True)
    img.save(IMAGES / filename, quality=87)


def build_placeholders():
    # architecture-studio project gallery (4:3)
    for i, name in enumerate([
        "arch-birchwood-residence.jpg",
        "arch-harbor-line-offices.jpg",
        "arch-kestrel-community-center.jpg",
        "arch-maple-9th-infill.jpg",
    ]):
        make_placeholder(name, 4 / 3, ARCH, seed=10 + i)

    # local-business hero (5:4), menu items (4:3), about (4:3), map (4:3)
    make_placeholder("cafe-hero.jpg", 5 / 4, CAFE, seed=20)
    for i, name in enumerate([
        "cafe-menu-espresso.jpg",
        "cafe-menu-croissant.jpg",
        "cafe-menu-matcha-latte.jpg",
        "cafe-menu-sourdough-toast.jpg",
    ]):
        make_placeholder(name, 4 / 3, CAFE, seed=30 + i)
    make_placeholder("cafe-about.jpg", 4 / 3, CAFE, seed=40)
    make_placeholder("cafe-map.jpg", 4 / 3, CAFE, seed=50)

    # home-work-architecture.jpg / home-work-cafe.jpg (16:10) are NOT
    # generated here on purpose: the homepage's "Live example sites" cards
    # now use real screenshots of the two templates (captured via headless
    # Chrome) instead of abstract gradient placeholders, so they read as
    # actual product rather than filler art. Re-run this function and
    # they'll stay untouched; recapture them manually if the templates
    # change enough to need a fresh screenshot.
    print("placeholders done")


if __name__ == "__main__":
    build_icons()
    build_og()
    build_placeholders()
