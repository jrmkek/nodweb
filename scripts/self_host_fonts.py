"""
One-off script: fetch Google Fonts @font-face CSS for each site's font
stack, keep only the latin + latin-ext subsets (covers English and
Romanian diacritics), download the woff2 files locally, and write a
self-hosted CSS file per site. Removes the render-blocking third-party
request to fonts.googleapis.com/fonts.gstatic.com from every page.
"""
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FONTS_DIR = ROOT / "shared" / "fonts"
CSS_DIR = ROOT / "shared" / "css"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

SITES = {
    "fonts-nodweb.css": "family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=JetBrains+Mono:wght@400;500;700",
    "fonts-architecture.css": "family=Big+Shoulders+Display:wght@600;800&family=Spectral:ital,wght@0,400;0,500;1,400&family=IBM+Plex+Mono:wght@500;600",
    "fonts-cafe.css": "family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;1,9..144,500&family=Karla:wght@400;500;700&family=Caveat:wght@600",
}

KEEP_SUBSETS = {"latin", "latin-ext"}


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    return urllib.request.urlopen(req).read().decode("utf-8")


def slugify(family, weight, style, index):
    base = family.lower().replace(" ", "-")
    style_part = "italic" if style == "italic" else "normal"
    return f"{base}-{weight}-{style_part}-{index}.woff2"


def process(filename, query):
    css = fetch(f"https://fonts.googleapis.com/css2?{query}&display=swap")
    blocks = re.split(r"(?=/\*)", css)
    kept_rules = []
    counters = {}

    for block in blocks:
        subset_match = re.match(r"/\*\s*([\w-]+)\s*\*/", block)
        if not subset_match or subset_match.group(1) not in KEEP_SUBSETS:
            continue

        family_match = re.search(r"font-family:\s*'([^']+)'", block)
        weight_match = re.search(r"font-weight:\s*([\d\s]+);", block)
        style_match = re.search(r"font-style:\s*(\w+);", block)
        url_match = re.search(r"src:\s*url\(([^)]+)\)\s*format\('woff2'\)", block)
        unicode_match = re.search(r"unicode-range:\s*([^;]+);", block)
        if not (family_match and weight_match and style_match and url_match):
            continue

        family = family_match.group(1)
        weight = weight_match.group(1).strip().split()[-1]
        style = style_match.group(1)
        font_url = url_match.group(1)

        key = (family, weight, style)
        counters[key] = counters.get(key, 0) + 1
        local_name = slugify(family, weight, style, counters[key])
        local_path = FONTS_DIR / local_name
        if not local_path.exists():
            FONTS_DIR.mkdir(parents=True, exist_ok=True)
            data = fetch(font_url) if False else urllib.request.urlopen(
                urllib.request.Request(font_url, headers={"User-Agent": UA})
            ).read()
            local_path.write_bytes(data)
            print(f"downloaded {local_name} ({len(data)} bytes)")

        rule = (
            "@font-face {\n"
            f"  font-family: '{family}';\n"
            f"  font-style: {style};\n"
            f"  font-weight: {weight};\n"
            "  font-display: swap;\n"
            f"  src: url('../fonts/{local_name}') format('woff2');\n"
        )
        if unicode_match:
            rule += f"  unicode-range: {unicode_match.group(1).strip()};\n"
        rule += "}\n"
        kept_rules.append(rule)

    out_path = CSS_DIR / filename
    out_path.write_text("\n".join(kept_rules), encoding="utf-8")
    print(f"wrote {out_path} ({len(kept_rules)} @font-face rules)")


if __name__ == "__main__":
    for filename, query in SITES.items():
        process(filename, query)
