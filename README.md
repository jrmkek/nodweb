# NodWeb — WebTemplates

Plain HTML/CSS/JS templates for local-business websites, plus a shared
design system and NodWeb's own business site. No build step — open any
`index.html` directly, or serve the repo root with any static file server.

**This is your deploy root.** Point your host (Netlify, Vercel static,
GitHub Pages, or any shared host) at this folder directly — `index.html`
here is the homepage.

## Domain

No domain is registered yet. Every absolute URL in the project (canonical
tags, Open Graph tags, `sitemap.xml`, `robots.txt`, `llms.txt`, JSON-LD)
uses the placeholder **`https://nodweb.org`**. Once a real domain is
registered, find-and-replace `nodweb.org` across the project:

```bash
grep -rl "nodweb.org" --include="*.html" --include="*.xml" --include="*.txt" .
```

## Structure

```
index.html               Homepage — NodWeb's own business site.
portfolio.css             Layout for the homepage (sets NodWeb's blue accent).
404.html                  Custom 404 page (noindex).
sitemap.xml               Lists the 3 real pages.
robots.txt                Allows all crawlers, points to sitemap.xml.
llms.txt                  Plain-language site summary for LLM crawlers.

assets/
  icons/                  favicon.svg, favicon.ico, apple-touch-icon.png, icon-*.png
  og/                     1200x630 social share images, one per page.
  images/                 Abstract placeholder photos for the two demo templates
                          (generated, not real photography — swap for real
                          client photos when a template is customized).

shared/
  css/tokens.css          Design tokens (colors, spacing, type). Edit --color-accent
                          per client to reskin quickly.
  css/base.css            Reusable components: nav, breadcrumbs, buttons, cards,
                          forms, grid.
  js/site.js              Mobile nav toggle + scroll-reveal animation.
  js/form-validation.js   Inline form validation (used by every contact form).

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
                            icons/OG images/content images above. Not part of the
                            deployed site — rerun it if you want to regenerate them
                            (requires `pip install Pillow`).
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

## SEO / technical checklist status

- ✅ Unique `<title>`, meta description, and canonical tag per page.
- ✅ Exactly one `<h1>` per page.
- ✅ `sitemap.xml`, `robots.txt`, `llms.txt`, favicon (SVG + ICO + Apple touch icon).
- ✅ Custom `404.html` (marked `noindex`).
- ✅ Breadcrumbs (visible + `BreadcrumbList` JSON-LD) on both demo template pages.
- ✅ `ProfessionalService` JSON-LD for the homepage (NodWeb's real info);
  `LocalBusiness`/`CafeOrCoffeeShop` JSON-LD on the two demo pages (clearly
  commented as example data to replace with a real client's details).
- ✅ Open Graph + Twitter Card tags with a generated 1200×630 share image per page.
- ✅ All content images are real `<img>` tags with descriptive `alt` text
  (no bare background-image divs left for meaningful content).
- ✅ No console errors, verified in-browser on all four pages.
- **Not applicable to this project:** there is no build tool, bundler, or
  framework (no Vite/React/etc.), so there are no production source maps and
  no framework-generated JS bundle to shrink — the only JS is the two small
  hand-written files above.

## Local preview

A `.claude/launch.json` is included for previewing inside Claude Code's
browser pane. To preview manually instead:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/` (or `/templates/architecture-studio/`,
`/templates/local-business/`, `/404.html`).

## Deploying

Deploy this repo's root as-is to Netlify, Vercel (static), GitHub Pages, or
any shared host. Static hosts serve `folder/index.html` at `/folder/`
automatically, so the demo template URLs come out as
`/templates/architecture-studio/` and `/templates/local-business/` with no
`.html` needed. Most hosts (Netlify, GitHub Pages) also pick up `404.html`
at the root automatically as the custom error page.
