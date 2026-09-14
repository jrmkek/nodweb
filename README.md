# NodWeb — WebTemplates

Plain HTML/CSS/JS templates for local-business websites, plus a shared
design system and NodWeb's own business site. No build step — open any
`index.html` directly, or serve the repo root with any static file server.

**This is the deploy root**, live at **https://nodweb.org** (hosted on
Netlify, DNS on Netlify DNS, form submissions via Netlify Forms).

## Structure

```
index.html               Homepage — NodWeb's own business site (English).
ro/index.html             Romanian translation of the homepage, for
                          Bucharest-based searches. Linked via hreflang.
portfolio.css             Layout + dark/technical theme for the homepage
                          (Bricolage Grotesque + JetBrains Mono, blue accent).
blog.css                  Layout for the blog/guides section.
blog/                     3 articles + an index, targeting long-tail local
                          search queries (pricing, "do I need a website",
                          launch checklist). Each has BlogPosting JSON-LD.
404.html                  Custom 404 page (noindex).
sitemap.xml               Lists every real page (home, ro, both demo
                          templates, blog index + 3 posts).
robots.txt                Allows all crawlers, points to sitemap.xml.
llms.txt                  Plain-language site summary for LLM crawlers.
_headers                  Netlify headers: caching for static assets/fonts,
                          basic security headers (X-Frame-Options, etc.).

assets/
  icons/                  favicon.svg, favicon.ico, apple-touch-icon.png, icon-*.png
  og/                     1200x630 JPG social share images, one per page
                          (kept as JPG — social platforms don't reliably
                          support WebP for link previews).
  images/                 WebP placeholder photos for the two demo templates
                          (generated, not real photography — swap for real
                          client photos when a template is customized).

shared/
  css/tokens.css          Design tokens (colors, spacing, type). Edit --color-accent
                          per client to reskin quickly.
  css/base.css            Reusable components: nav, breadcrumbs, buttons, cards,
                          forms, grid, skip-link, visually-hidden utility.
  css/fonts-*.css         Self-hosted @font-face rules per site (nodweb /
                          architecture / cafe) — no third-party request to
                          fonts.googleapis.com at runtime.
  fonts/                  The actual .woff2 files (latin + latin-ext subsets,
                          covers English and Romanian diacritics).
  js/site.js              Mobile nav toggle + scroll-reveal animation.
  js/form-validation.js   Inline validation for every form; forms with a
                          `name` attribute submit for real via Netlify Forms,
                          everything else (the demo templates) fakes success.

templates/
  architecture-studio/    Flagship template with an interactive 3D model viewer
                          (<model-viewer>). Swap the demo .glb for a client's
                          exported architectural model. Linked from the homepage
                          as "Atlas & Vine Architecture", with breadcrumbs back
                          to Home.
  local-business/         Generic template for cafés, salons, contractors, shops.
                          Linked from the homepage as "The Copper Kettle Café".

scripts/
  generate_images.py       One-off Pillow script that generated the placeholder
                            icons/OG images/content images. Not part of the
                            deployed site (requires `pip install Pillow`).
  self_host_fonts.py       One-off script that downloaded the self-hosted font
                            files from Google Fonts and wrote the fonts-*.css
                            files above. Rerun it if a site's font stack changes.
```

## Using a template for a new client

1. Copy the template folder (e.g. `templates/local-business`) to a new folder,
   ideally in its own project once it has a real domain (these two folders are
   demo pages of the NodWeb site, not meant to double as a client's live site).
2. Edit the HTML directly — every section that needs client content is marked
   with an `<!-- EDIT: ... -->` comment.
3. Replace the placeholder images in that copy with the client's real photos,
   and write real `alt` text describing each one.
4. Replace the example `LocalBusiness`/`CafeOrCoffeeShop` JSON-LD block in
   `<head>` with the client's real name, address, phone, and hours.
5. For the architecture template: replace the `<model-viewer src="...">` with
   the client's own `.glb` export (Blender, SketchUp, Revit, etc. can all
   export glTF/GLB). Add a `.usdz` version too if you want AR to work on iPhone.
6. Change `--color-accent` in `tokens.css` (or a page-level override, as
   `portfolio.css` does for NodWeb's own blue) to match the client's brand.
7. Update the page's `<title>`, meta description, canonical URL, and
   `sitemap.xml`/`robots.txt` for the client's real domain.
8. If the form should actually submit somewhere, give the `<form>` a real
   `name` attribute and (if deploying to Netlify) `data-netlify="true"` +
   a honeypot field — see the homepage's contact form for the pattern. The
   shared JS submits for real for any form with a `name`; the two demo
   templates deliberately have no `name` so they only fake success.

## Design rules these templates follow

Every template shares the same underlying rules, enforced by `shared/css`:

- One obvious primary action per screen (`.btn--primary`), secondary actions
  visually quieter.
- Large tap targets (44px minimum) for every button, link, and form field.
- Content grouped into clearly separated sections and cards, not walls of text.
- Interactions (hover, click, nav toggle) respond instantly — no animation
  longer than 350ms.
- Forms validate inline and explain exactly what to fix, without losing
  anything the visitor already typed.
- Consistent spacing, type, and color across every page and every template.

## SEO / technical status

- ✅ Unique `<title>`, meta description, and canonical tag per page.
- ✅ Exactly one `<h1>` per page; verified no heading level is skipped
  (visually-hidden `<h2>`s added where a section only had `<h3>` cards).
- ✅ `<main>` landmark + skip-to-content link on every page.
- ✅ `sitemap.xml`, `robots.txt`, `llms.txt`, favicon (SVG + ICO + Apple touch icon).
- ✅ Custom `404.html` (marked `noindex`).
- ✅ Breadcrumbs (visible + `BreadcrumbList` JSON-LD) on the demo templates
  and every blog post.
- ✅ `ProfessionalService`/`WebSite` JSON-LD for the homepage (NodWeb's real
  info); `LocalBusiness`/`CafeOrCoffeeShop` JSON-LD on the two demo pages
  (clearly commented as example data); `BlogPosting` JSON-LD on every article.
- ✅ Open Graph + Twitter Card tags with a generated 1200×630 share image per page.
- ✅ All content images are real `<img>` tags with descriptive `alt` text,
  served as WebP.
- ✅ Fonts self-hosted (no third-party request at runtime); `fetchpriority="high"`
  on the one real LCP image (café hero).
- ✅ `hreflang` (en / ro / x-default) linking the English and Romanian homepages.
- ✅ A blog with real, substantive articles targeting long-tail search queries.
- ✅ No console errors, no broken internal links — verified in-browser and
  via script across every page.
- **Not applicable to this project:** there is no build tool, bundler, or
  framework (no Vite/React/etc.), so there are no production source maps and
  no framework-generated JS bundle to shrink — the only JS is the two small
  hand-written files above.

**Still outside of what code can fix** — these matter more than any of the
above for actually ranking, and need to be done in Google/Bing's own tools,
not in this repo: verify the domain in Google Search Console and submit the
sitemap; set up a Google Business Profile (service-area business); earn real
backlinks and reviews once there are real clients. A brand-new domain with
zero backlinks won't outrank established competitors on technical SEO alone.

## Local preview

A `.claude/launch.json` is included for previewing inside Claude Code's
browser pane. To preview manually instead:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/` (or `/ro/`, `/blog/`,
`/templates/architecture-studio/`, `/templates/local-business/`, `/404.html`).

## Deploying

Live on Netlify, connected to this repo's `main` branch — every push
auto-deploys. Netlify serves `folder/index.html` at `/folder/` automatically,
so URLs come out clean (`/blog/`, `/ro/`, `/templates/architecture-studio/`)
with no `.html` needed, and picks up `404.html` at the root as the custom
error page automatically.
