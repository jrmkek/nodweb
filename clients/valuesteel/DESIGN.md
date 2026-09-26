---
name: ValueSteel
description: Steel structures designed, fabricated and installed in Bucharest; the lattice-panel logo runs the page.
colors:
  ground: "#ffffff"
  ink: "#111111"
  ink-2: "#4a4a4a"
  mute: "#858585"
  hair: "#dedede"
  orange: "#f0592a"
  orange-hi: "#f46d43"
  orange-tint: "#fde4da"
  built: "#ececec"
  error: "#a3300b"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(3.2rem, 7vw, 6rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2.8rem, 6vw, 5.4rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2.1rem, 4.6vw, 4rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
    fontFeature: "tnum"
  label:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.04em"
  member-mark:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "11px"
    fontWeight: 800
    lineHeight: 1.3
rounded:
  none: "0"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  column-gap: "clamp(24px, 3vw, 48px)"
  section: "clamp(80px, 11vw, 150px)"
  grid-gap: "10px"
  max-width: "1440px"
components:
  button-primary:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "16px 22px"
  button-primary-hover:
    backgroundColor: "{colors.orange-hi}"
  button-arrow:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    size: "44px"
  button-arrow-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  segmented-toggle-on:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "5px 9px"
  input:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "13px 14px"
  caption-tag:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "5px 9px"
  member-label:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.member-mark}"
    rounded: "{rounded.none}"
    padding: "2px 6px"
  proof-field:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  ink-panel:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.none}"
---

# Design System: ValueSteel

## Overview

**Creative North Star: "The Orange Triangle Means Here"**

The ValueSteel mark, a tapered lattice panel of steel legs and K-bracing with orange triangles between the members, is the operating system of the page. One triangle symbol is reused everywhere. Drawn as an ink outline on white it is structure; filled orange it marks where the visitor is: the section in view in the nav, the focused structure in the Warren-truss pager, the service row crossing the middle of the screen, the process level being read on the lattice tower, and the triangle leading the primary action (drawn solid ink there, because the button itself is the orange field).

The world is a white ground, 1px ink rules and heavy condensed uppercase type that echoes the VALUESTEEL wordmark. The client's own truss pattern, redrawn as a hairline orange lattice, sits behind the carousel stage and the footer and turns white on the one orange field (the proof band). Orange is committed as a field (button, proof band, pager fill, "here" fills) with ink text on it; it is never a text colour on white. The page reads like a shop drawing: square frames, member marks on leader lines, tabular numerals. Motion is a spring: cards, triangles and the pager fill overshoot a touch and settle.

The page is bilingual (Romanian default, English toggle), with both languages present in the markup and the root `lang` choosing which shows.

**Key Characteristics:**
- One triangle symbol: outlined is structure, orange-filled is "here", exactly one lit per group.
- The client's lattice as ground texture: orange hairline on white, white hairline on orange.
- Barlow Condensed 700/800 uppercase display, Barlow 400/600 body, tabular numerals throughout.
- Square corners, 1px ink rules, no shadows; the traced logo's rounded panel is the only curve.
- Engineering annotation: member marks (T, D, S, F...) on leader lines pinned to models and photos.
- Spring motion (a CSS `linear()` easing) for everything moving into place.

## Colors

White and near-black steel with one committed logo orange.

### Primary
- **Logo Orange** (orange): the primary action background, the proof band field, the "here" triangle fill, the sliding pager fill, member-label nodes, the lattice line colour, focus outline, text selection and the input caret. On orange, text is always ink.
- **Hot Orange** (orange-hi): hover state of the primary action only.
- **Orange Wash** (orange-tint): hover and keyboard-focus fill on pager triangles; never a surface.

### Neutral
- **White Ground** (ground): the page, cards, tags, inputs, arrow buttons, member labels; the header at 92% with a 10px blur.
- **Steel Ink** (ink): text, every 1px frame rule (the `--line` token is the same value), outlines of the triangle symbol, the pressed toggle, the ink tile in the work grid.
- **Ink 2** (ink-2): lede, section intros, secondary copy, nav links at rest, metadata.
- **Unread Grey** (mute): process step headings not yet reached. Display-size only.
- **Hair** (hair): quiet internal dividers that do not frame content: header bottom edge, rows of the contact list.
- **Built Grey** (built): tower levels already read, and the placeholder fill behind photos while they load.
- **Error Brick** (error): form error text and invalid field borders only.

### Named Rules
**The Here Rule.** Orange fill on a triangle is a state, never ornament. In any group of triangles exactly one is lit, and it is the current one.

**The Field Rule.** Orange is laid down as a field with ink on it (button, proof band, pager fill). Never set orange text on white; the hero's orange is an underline under ink words, not ink turned orange.

## Typography

**Display Font:** Barlow Condensed 700 and 800 (with Arial Narrow, sans-serif), self-hosted woff2, latin and latin-ext subsets.
**Body Font:** Barlow 400 and 600 (with system-ui, sans-serif), same subsets.

**Character:** Condensed heavy caps doing the wordmark's job at every heading level; plain Barlow underneath for reading. Numerals are tabular everywhere, so counters and member IDs sit like drawing annotations.

### Hierarchy
- **Display** (800, clamp(3.2rem, 7vw, 6rem), 1.02): hero headline only, uppercase, one clause per line; the key phrase gets a 0.12em orange underline.
- **Headline** (800, clamp(2.8rem, 6vw, 5.4rem), 0.92): section heads, uppercase, ending in a full stop. Contact runs larger (clamp(3rem, 6.4vw, 5.8rem)).
- **Title** (800, clamp(2.1rem, 4.6vw, 4rem), 0.92): service names; process steps at clamp(2.2rem, 4.2vw, 3.6rem), unread ones in mute. The carousel's current name runs at clamp(22px, 2vw, 28px).
- **Body** (400, 17px, 1.55): running copy at a 42 to 52ch measure; ink-2 for supporting text; process copy at 18px.
- **Label** (600, 13px, 0.04em): RO/EN and Render/3D toggles, caption tags, the 13px note under the carousel name.
- **Member mark** (Barlow Condensed 800 inside an 11px Barlow 600 tag): the letter-and-number ID on member labels (T1, D2, S3).
- **Proof numeral** (800, clamp(7rem, 19vw, 16rem), 0.78): the single statistic on the orange band, with a 700 uppercase condensed line beside it.

### Named Rules
**The Wordmark Rule.** Every heading is Barlow Condensed, uppercase, 700 or heavier, tracked -0.01em, line height under 1.05. Body type never goes condensed.

## Layout

Content sits in a 1440px max container with a fluid gutter. The recurring grid is a 5fr/7fr split, used by the hero, every section head (heading left, intro right, bottom-aligned), the process block and contact. Sections breathe with the section padding; a section that follows a rule-bordered list drops its top padding. The work gallery is a 6-column modular grid with 10px gaps and mixed spans, one span filled by an ink tile. Services are a full-width ruled list (56px triangle column, name, description). Process pairs a sticky lattice tower (150px wide, top 110px) with the ruled steps.

Breakpoints: at 1080px the nav hides and the language toggle takes its place; at 900px every 5/7 split stacks, the gallery goes to 2 columns, the tower shrinks to a 44px sticky column beside the steps and the carousel card widens to min(72vw, 360px); at 560px the header phone hides, the dock wraps the arrows under the pager, and the form, proof band and photo pairs go single-column.

## Elevation & Depth

Flat. There are no box-shadows and no gradient fills. Depth comes only from the carousel's perspective (1400px; translateZ, rotateY, blur and desaturation on neighbours) and from the live 3D models themselves. Gradients appear only as masks: the carousel stage fades out at its edges and the footer lattice fades out to the right.

### Named Rules
**The Drawn Not Cast Rule.** If something needs separating, give it a 1px ink rule. Never a drop shadow.

## Shapes

Square everywhere (0), including inputs, which reset the platform radius. Every frame is a 1px ink rule; hair rules are for internal dividers only. The non-rectangular vocabulary is triangles: the symbol (viewBox 22x20, 1.3 non-scaling stroke, miter joins), the pager triangles clipped with `clip-path: polygon()`, and the tower levels traced from the lattice. The only rounded form is the client's traced mark (a 62-unit radius panel), which is the logo's own shape and is never extended to UI.

The lattice pattern is `assets/lattice.svg` (281x141 tile, 1px orange miter stroke) and `assets/lattice-white.svg` for the orange field; they are the client's pattern, not a generic grid.

## Components

### Buttons
Blunt and committed.
- **Shape:** square (0).
- **Primary:** orange field, ink text, 600 16px, 16px 22px padding, led by a solid ink triangle.
- **Hover / Focus:** hot orange; the triangle turns 90deg on the spring. Press nudges down 1px. Focus is the global 2px orange outline, 3px offset.
- **Arrow (secondary):** 44px square, white with a 1px ink rule and an inline SVG chevron; hover inverts to ink.
- **Phone link:** 600 18px with a 1px ink underline rule and a 13px ink-2 subline.

### Segmented toggles (RO/EN, Render/3D)
- **Style:** 1px ink box, borderless buttons inside, 5px 9px, label type.
- **State:** the pressed option is filled ink with white text (`aria-pressed`). Render/3D is only visible on the focused card and waits for the model to load.

### Cards / Containers
- **Coverflow card:** 4:5, white, 1px ink rule, square; a 52px foot bar split by an ink rule holds the structure name and the Render/3D toggle.
- **Caption tag:** white chip with a 1px ink rule, 13px 600, pinned bottom-left over photos.
- **Ink tile:** solid ink with white text inside the work grid.
- **Proof field:** full-bleed orange with the white lattice at 50%, ink type.
- **Shadow Strategy:** none (see Elevation & Depth).

### Inputs / Fields
- **Style:** 1px ink rule, white, square, 13px 14px padding, orange caret; labels 14px 600 above, optional hints in 400 ink-2.
- **Focus:** 2px orange outline, -1px offset.
- **Error:** border and 13px 600 message in error brick, shown after blur or submit.

### Navigation
Sticky 64px bar, white at 92% with blur and a hair bottom rule. Brand is the client's traced mark (`#mark` symbol, from `assets/valuesteel-mark.svg`) at 38px plus "VALUESTEEL" in 27px Barlow Condensed 800. The mark is never redrawn with the page's triangle symbol. Links are 15px 600 in ink-2; hover and the current section go ink, and the current one gains a small orange triangle that drops in on the spring.

### Warren-truss pager (signature)
One inset triangle per structure, alternating up and down along a 36px strip so the gaps between them read as members. A single orange layer sits under the outlines and its `clip-path` polygon slides to the focused triangle on the spring (.7s). Pager triangles warm to orange wash on hover and keyboard focus. Beside it: the structure name in condensed caps, its type, and a tabular `01 / 06` counter between the arrow buttons.

### Coverflow carousel (signature)
Each card gets `--d` (signed distance from focus) and `--a` (its absolute value); CSS derives translateX (0.74 card widths per step), translateZ (-240px per step), rotateY (-34deg per step), blur (3.5px per step, capped at 2), desaturation and opacity. Cards more than two away hide; the row loops. Transform uses the spring (.9s), filter and opacity the out-curve. Only the focused card holds a live 3D model, which wipes in from the right over the render.

### Member labels (signature)
Engineering annotation on the live model and on process photos: a 9px orange node with an ink rule, a 1px ink leader at -40deg, and a white ink-ruled tag carrying a member mark (T chord, D web, S column, F truss, P purlin, CV bracing, G beam...) plus the member name in the current language. Near the right edge the leader flips left. Labels appear one after another once the 3D wipe has passed.

### Lattice tower (signature)
The process is a four-level tower traced from the lattice, built bottom-up: levels already read fill built grey, the level being read fills orange, the rest stay white with ink outlines. The step heading being read goes ink; the others sit in mute.

## Do's and Don'ts

### Do:
- **Do** reuse the single triangle symbol and colour it through `--tri-fill` / `--tri-line`; one orange triangle per group, on the current item.
- **Do** lay orange down as a field with ink on it, and keep the lattice orange on white or white on orange.
- **Do** frame with 1px ink rules and keep every corner square (0).
- **Do** set headings in Barlow Condensed uppercase at 700 or 800, with tabular numerals for counts and member IDs.
- **Do** annotate structures with member marks on leader lines, the way the client's shop drawings do.
- **Do** move things into place with the spring easing, and honour reduced motion (transitions collapse to near-zero).
- **Do** ship both languages in the markup as `lang` spans and let the root `lang` pick.

### Don't:
- **Don't** set orange text on white.
- **Don't** light a triangle orange as decoration; orange fill means "here".
- **Don't** use drop shadows or gradient fills (edge-fade masks are the only gradients).
- **Don't** round corners on cards, buttons, inputs, tags or labels; the rounded panel belongs to the logo alone.
- **Don't** redraw the client's mark from the triangle symbol, or swap the lattice for a generic grid or dot pattern.
