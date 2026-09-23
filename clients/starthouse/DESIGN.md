---
name: Starthouse
description: Architecture and design office in Pecica, Arad; the nine-cube logo runs the page.
colors:
  ground: "#ffffff"
  iso-top: "#ffffff"
  iso-left: "#e6e4df"
  iso-right: "#c9c6bf"
  ink: "#171514"
  ink-2: "#57534d"
  hair: "#dcd9d3"
  amber: "#ef6a1f"
  amber-hover: "#f47b34"
  dark-cube-top: "#3a3633"
  error: "#a3300b"
typography:
  display:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(3rem, 6.6vw, 6rem)"
    fontWeight: 850
    lineHeight: 0.9
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5vw, 4.6rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 4.2vw, 3.6rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.04em"
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
    backgroundColor: "{colors.amber}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "16px 22px"
  button-primary-hover:
    backgroundColor: "{colors.amber-hover}"
  button-arrow:
    backgroundColor: "{colors.iso-top}"
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
    backgroundColor: "{colors.iso-top}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "13px 14px"
  caption-tag:
    backgroundColor: "{colors.iso-top}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "5px 9px"
  ink-panel:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.none}"
---

# Design System: Starthouse

## Overview

**Creative North Star: "The Dark Cube Means Here"**

The Starthouse logo, nine isometric cubes with one dark, is the operating system of the page. A single SVG cube (top, left and right faces plus an ink edge) is reused everywhere, and whichever cube is dark marks where the visitor is: the focused project in the carousel pager, the section in view in the nav, the step being read on the process staircase, the service row under the pointer, the cube inside the primary action. Everything else stays white, square and quiet.

The world is a white ground with things extruded from it in three iso face tones and drawn with 1px ink rules. Density is calm: wide section padding, a 5/7 column split, heavy tight lowercase headlines that echo the wordmark, and regular-weight body copy in ink-2. The one warm note is a lit-window amber, kept for the primary action, keyboard focus and text selection. Motion is a spring: cards, cubes and markers overshoot a touch and settle, like pieces set down on a board.

The page is bilingual (Romanian default, English toggle), with both languages present in the markup and the root `lang` choosing which shows.

**Key Characteristics:**
- One cube symbol, three face tones, one dark state that always means "here".
- White ground, square corners, 1px ink rules as the only framing device.
- Heavy tight lowercase display type in one family (Schibsted Grotesk, 400 to 900).
- Amber is rare: primary action, focus, selection, the live-3D indicator. Nothing else.
- Spring motion (a CSS `linear()` easing) for everything that moves into place.

## Colors

A near-monochrome warm-grey iso palette with a single lit-window amber.

### Primary
- **Lit-Window Amber** (amber): the primary action background (every `btn`), the 2px focus outline, text selection, the input caret and the small square on the "drag to turn" hint. It is never a fill for sections, cards or type.

### Neutral
- **Paper Ground** (ground): the page, the header (at 92% with blur), and the text on ink surfaces.
- **Iso Top** (iso-top): the lit top face of every cube and the surface of raised things: cards, caption tags, inputs, arrow buttons.
- **Iso Left** (iso-left): the left face of a cube; also the placeholder fill behind photos while they load.
- **Iso Right** (iso-right): the shaded right face of a cube.
- **Ink** (ink): body text, every 1px rule and cube edge, the dark cube's left face, the pressed state of segmented toggles, and the two full-bleed ink blocks (the proof band and the Instagram tile).
- **Ink 2** (ink-2): lede, secondary copy, nav links at rest, metadata.
- **Hair** (hair): the quiet dividers that do not frame content: header bottom edge, rows inside the contact info list.
- **Dark Cube Top** (dark-cube-top): the top face of the dark cube; its right face is pure black.
- **Error Brick** (error): form error text and invalid field borders only.

### Named Rules
**The Lit Window Rule.** Amber marks the one thing to do and where the keyboard is. If a surface has two amber things that are not the primary action and focus, one is wrong.

**The Dark Cube Rule.** Dark (ink faces) is a state, not a decoration. On any cube group exactly one cube is dark, and it is the current one.

## Typography

**Display Font:** Schibsted Grotesk (with system-ui, sans-serif), self-hosted variable woff2, latin and latin-ext subsets, weight axis 400 to 900.
**Body Font:** Schibsted Grotesk, same file.

**Character:** One grotesk doing both jobs: at 800 to 900 with tight negative tracking and lowercase it becomes the wordmark; at 400 it is plain and readable.

### Hierarchy
- **Display** (850, clamp(3rem, 6.6vw, 6rem), 0.9): hero headline only, lowercase, each clause on its own line; the second clause drops to 700 in ink-2.
- **Headline** (800, clamp(2.4rem, 5vw, 4.6rem), 0.95): section heads, lowercase, ending in a full stop. Contact head runs larger (clamp(2.8rem, 6vw, 5.6rem)).
- **Title** (800, clamp(1.9rem, 4.2vw, 3.6rem), 0.95): service names and process steps. Inactive steps drop to a muted grey; the current one is ink.
- **Body** (400, 17px, 1.55): all running copy, 40 to 52ch measure, ink-2 for supporting text.
- **Label** (700, 13px, 0.04em): RO/EN and Render/3D toggles, caption tags (600), the carousel counter (600, tabular numerals).
- **Proof numeral** (900, clamp(6rem, 17vw, 15rem), 0.8): the single statistic on the ink band.

### Named Rules
**The Wordmark Rule.** Headlines are lowercase, heavy (800+) and tracked tight (-0.035em or tighter), like "starthouse". Body never goes above 400 except for emphasis in labels and links.

## Layout

Content sits in a 1440px max container with a fluid gutter (clamp(16px, 4vw, 56px)). The recurring grid is a 5fr/7fr split, used by the hero, every section head (heading left, intro right, bottom-aligned), the process block and contact; gaps are clamp(24px, 3vw, 48px). Sections breathe with clamp(80px, 11vw, 150px) vertical padding; consecutive sections drop their top padding so the rules carry the rhythm. The work gallery is a 6-column modular grid with 10px gaps and mixed spans, one span filled by an ink tile.

Breakpoints: at 1080px the nav hides and the language toggle takes its place on the right; at 900px every 5/7 split stacks, the gallery goes to 2 columns and the staircase stops being sticky; at 560px the header phone hides, the form goes single-column and the pager scales to 85%.

## Elevation & Depth

Flat. There are no box-shadows. Depth is drawn, not cast: iso extrusion (three face tones with ink edges) is the only way something reads as raised, and the carousel's perspective (translateZ, rotateY, blur and desaturation on neighbours) is the only spatial depth. The 3D model inside the focused card carries its own rendered ground shadow; that belongs to the model, not to the interface.

### Named Rules
**The Extrusion Rule.** If something needs to look raised, draw it as a cube face. Never use a drop shadow for it.

## Shapes

Square everywhere (0 radius), including inputs, which reset the platform radius. Every frame is a 1px ink rule; hair-coloured rules are for quiet internal dividers only. The one non-rectangular form is the isometric cube (viewBox 40x46) and its hexagonal hit area in the pager. Cube edges use a 1.4 non-scaling stroke with round joins.

## Components

### Buttons
Blunt and warm.
- **Shape:** square (0).
- **Primary:** amber ground, ink text, 700 weight 16px, 16px 22px padding, with a dark cube leading the label.
- **Hover / Focus:** a slightly lighter amber; the leading cube springs up 5px. Press nudges down 1px. Focus is the global 2px amber outline, 3px offset.
- **Arrow (secondary):** 44px square, iso-top face with 1px ink rule; hover inverts to ink with a white chevron.
- **Phone link:** 700 weight, ink underline rule, with a small ink-2 subline.

### Segmented toggles (RO/EN, Render/3D)
- **Style:** 1px ink box, borderless buttons inside, 5px 9px, label type.
- **State:** the pressed option is filled ink with white text (`aria-pressed`). Render/3D keeps its 3D option disabled until the model has loaded.

### Cards / Containers
- **Coverflow card:** 4:5, iso-top surface, 1px ink rule, square; a 52px foot bar split by an ink rule holds the project name and the Render/3D toggle.
- **Caption tag:** iso-top chip with a 1px ink rule, 13px 600, pinned bottom-left over photos.
- **Ink tile / proof band:** solid ink with white text; its cube draws its edges in white.
- **Shadow Strategy:** none (see Elevation & Depth).

### Inputs / Fields
- **Style:** 1px ink rule, iso-top background, square, 13px 14px padding, amber caret; labels 14px 600 above.
- **Focus:** 2px amber outline, -1px offset.
- **Error:** border and 13px 600 message in error brick, shown after blur or submit.

### Navigation
Sticky 64px bar, white at 92% with a 10px blur and a hair bottom rule. Brand is the client's own mark (`assets/starthouse-mark.svg`, traced from their logo: nine cubes on a flattened lattice with gaps, side faces only on the two front edges, the right-hand corner cube solid in logo brown `#321a0f`), inlined at 50px with a 1px non-scaling stroke, plus "starthouse®" at 23px 800. The mark is never redrawn with the page's cube symbol; `assets/starthouse-favicon.svg` is the heavier-stroke cut for 16-32px. Links are 15px 500 in ink-2; hover and the current section go ink, and the current one gains a small dark cube that drops in with the spring.

### Cube pager and "here" marker (signature)
Six cubes on an isometric 3x2 board (+column steps right-down, +row steps left-down, front-most drawn last). A separate dark cube hops to the focused one: up, across and down along an arc. Hovering a pager cube warms its top face faintly. The same hop drives the process staircase, where the dark cube climbs one tower per step as each step crosses the viewport's middle band.

### Coverflow carousel (signature)
Each card gets `--d` (signed distance from focus) and `--a` (its absolute value); CSS derives translateX (0.74 card widths per step), translateZ (-240px per step), rotateY (-34deg per step), blur (3.5px per step, capped at 2) and opacity. Cards more than two away hide. The stage fades at its edges with a mask and has 1400px perspective. Transitions use the spring for transform, the out-curve for filter and opacity. Only the focused card holds a live 3D model, which wipes in from the right over the render.

## Do's and Don'ts

### Do:
- **Do** reuse the single cube symbol and colour it through its face variables; one dark cube per group, on the current item.
- **Do** frame with 1px ink rules and keep every corner square (0).
- **Do** set headlines lowercase at 800 or heavier with tight negative tracking.
- **Do** keep amber for the primary action, focus, selection and the caret.
- **Do** move things into place with the spring easing, and honour reduced motion (transitions collapse to near-zero).
- **Do** ship both languages in the markup as `lang` spans and let the root `lang` pick.

### Don't:
- **Don't** use drop shadows for raised UI; draw iso faces instead.
- **Don't** round corners on cards, buttons, inputs or tags.
- **Don't** use gradient fills on surfaces or type (the carousel's edge-fade mask is the only gradient, and it is a mask).
- **Don't** use amber as a section, card or text colour.
- **Don't** make a cube dark as ornament; dark means "here".
