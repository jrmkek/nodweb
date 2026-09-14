"""
One-off generator for placeholder brand assets: favicon, OG/social share
images, and abstract content placeholders for the two template sites.
Not part of the deployed site — run once, commit the outputs, delete
or ignore this script's dependency on Pillow afterward if you like.
"""
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ICONS = ROOT / "assets" / "icons"
OG = ROOT / "assets" / "og"
IMAGES = ROOT / "assets" / "images"
FONT_DIR = Path(r"C:\Windows\Fonts")

GEORGIA_BOLD = str(FONT_DIR / "georgiab.ttf")
SEGOE = str(FONT_DIR / "segoeui.ttf")
SEGOE_BOLD = str(FONT_DIR / "segoeuib.ttf")

# ---- Brand palettes -------------------------------------------------
NODWEB = {"bg": (15, 19, 38), "bg2": (23, 29, 56), "accent": (58, 92, 235), "text": (245, 246, 250)}
ARCH = {"bg": (39, 33, 28), "bg2": (58, 46, 36), "accent": (181, 80, 47), "text": (250, 247, 243)}
CAFE = {"bg": (43, 34, 25), "bg2": (61, 47, 33), "accent": (181, 80, 47), "text": (250, 247, 243)}


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


def make_og(filename, palette, eyebrow, title, subtitle):
    size = (1200, 630)
    img = gradient(size, palette["bg"], palette["bg2"], angle=25)
    img = add_grain(img, amount=5)
    draw = ImageDraw.Draw(img)

    node_mark(draw, 1030, 150, 62, tuple(min(255, c + 30) for c in palette["accent"]), palette["text"], 5)

    eyebrow_font = ImageFont.truetype(SEGOE_BOLD, 28)
    title_font = ImageFont.truetype(GEORGIA_BOLD, 64)
    sub_font = ImageFont.truetype(SEGOE, 30)

    draw.text((80, 90), eyebrow.upper(), font=eyebrow_font, fill=palette["accent"])

    lines = wrap_text(draw, title, title_font, 1000)
    y = 150
    for line in lines:
        draw.text((80, y), line, font=title_font, fill=palette["text"])
        y += 76

    y += 20
    for line in wrap_text(draw, subtitle, sub_font, 900):
        draw.text((80, y), line, font=sub_font, fill=tuple(int(c * 0.85) for c in palette["text"]))
        y += 42

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

    # home page work-preview thumbnails (16:10)
    make_placeholder("home-work-architecture.jpg", 16 / 10, ARCH, seed=60)
    make_placeholder("home-work-cafe.jpg", 16 / 10, CAFE, seed=61)
    print("placeholders done")


if __name__ == "__main__":
    build_icons()
    build_og()
    build_placeholders()
