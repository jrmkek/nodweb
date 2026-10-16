---
version: 1
slug: "clients-bizoo-index-html"
primary_target: "clients/bizoo/index.html"
related_targets: []
---

# Bizoo Studio: pitch demo (homepage)

Scope: single-page bilingual (RO default, EN toggle, `?lang=en` deep link) demo for Bizoo Studio, interior design + archviz studio in Târgu Mureș (founded 2018 by Aliz Bocskor and Silviu Bleoca). Screen-shared on the sales call Mon 19 Oct, then browsed by the prospect. Visitor mode: Persuade (portfolio-first). Visitor: a homeowner or clinic/shop owner choosing an interior designer. Action: book a consultation. Proof on hand: project names only (Casa R4, Apartament WDW, Clinică Implant Dental Office, Apartament B, Casa C3). Constraints: Pexels stand-in photos labelled as demonstration; no copy from their RIDA/socials; contacts, portraits and logo are `[de completat]`; noindex, not in sitemap/nav; 3D is one optional upgrade section; pitch tier Website (€650 / €900 bilingual).

## Direction contract

THESIS: The page is an interior designer's colour fan deck. Each project is a chip strip in its own palette; the chip you hold open colours the interface. Refuses the category default of a white editorial grid of photos with a serif headline.

OWN-WORLD: Cool mineral-white ground, near-black ink, hairline rules, square corners. Chips are tall strips: three swatch bands with shade names, a project label at the foot. Colour lives in the chips at full chroma; the active project's deep chip (`--chip`) is the only accent and it moves. Jost for display and chip labels (geometric, lowercase-friendly), Hanken Grotesk body.

STORY: The visitor sees a finished room, fans through five projects whose palettes recolour the page, filters and opens one, drags a before/after, reads three services and a four-chip process, sees 3D offered as an upgrade, meets the two founders, books a consultation.

FIRST VIEWPORT: Full-bleed project photo. Bottom-left: large Jost headline, one-line positioning, ink CTA "Programează o consultație". Right edge: a fan of five project chips pivoting from a pin at the bottom; the held chip stands upright and its project fills the background. Mobile: the same fan, scaled down, held over the bottom-right corner of the photo, with the headline card below (changed during the build to keep the signature interaction on phones; approved by Iero on 2026-10-16: "Keep the scaled-down fan over the photo on mobile").

FORM: Paint fan deck, position 5 on the ordered list (assigned), seed key 2dfefc22. Signature interaction: fanning the deck; chips spring open (Motion), background crossfades, `--chip` retints CTA, filters and rules. Raises: one accent reserved for the item in motion (from the paper menagerie); total chroma commitment inside each chip (from the indoor sun).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
