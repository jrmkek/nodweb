---
name: Bizoo Studio
description: Interior design and 3D visualisation studio in Târgu Mureș; the page is a colour fan deck and the held chip colours the interface.
colors:
  ground: "oklch(96.6% 0.004 160)"
  paper: "oklch(99.3% 0.002 160)"
  ink: "oklch(21% 0.008 60)"
  ink-2: "oklch(43% 0.01 60)"
  hair: "oklch(85% 0.006 160)"
  error: "oklch(48% 0.16 28)"
  c3-sand: "oklch(91% 0.035 80)"
  c3-honey: "oklch(76% 0.11 72)"
  c3-chestnut: "oklch(39% 0.06 50)"
  r4-concrete: "oklch(80% 0.008 90)"
  r4-oak: "oklch(63% 0.09 62)"
  r4-graphite: "oklch(31% 0.006 250)"
  wdw-lime: "oklch(93% 0.012 90)"
  wdw-sage: "oklch(70% 0.05 150)"
  wdw-petrol: "oklch(35% 0.065 235)"
  cl-porcelain: "oklch(97% 0.008 210)"
  cl-mint: "oklch(81% 0.06 188)"
  cl-turquoise: "oklch(47% 0.085 205)"
  b-linen: "oklch(91% 0.02 85)"
  b-smoke: "oklch(67% 0.012 70)"
  b-plum: "oklch(37% 0.075 350)"
typography:
  display:
    fontFamily: "Jost, Futura, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 5.2vw, 4.9rem)"
    fontWeight: 500
    lineHeight: 0.96
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Jost, Futura, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Jost, Futura, system-ui, sans-serif"
    fontSize: "clamp(1.4rem, 2vw, 1.9rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Jost, Futura, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "normal"
  shade-name:
    fontFamily: "Jost, Futura, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.04em"
rounded:
  none: "0"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  section: "clamp(80px, 10vw, 140px)"
  column-gap: "clamp(20px, 4vw, 64px)"
  grid-gap: "clamp(14px, 1.6vw, 24px)"
  bar: "64px"
  max-width: "1440px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "16px 22px"
  button-square:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    size: "44px"
  button-square-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  filter-tab-on:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "9px 16px"
  segmented-toggle-on:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.none}"
    padding: "5px 9px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "13px 14px"
  tag:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "5px 10px"
  project-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "16px 16px 18px"
---

# Design System: Bizoo Studio

## Overview

**Creative North Star: "The Held Chip"**

The page is an interior designer's colour fan deck. Every project is a paint chip: a tall strip of three named shades, light to deep, with the project's name at its foot. The chip the visitor holds open decides the interface's one accent (`--chip`, the held project's deep shade, with `--chip-soft`, its light shade). Choosing a chip in the hero fan, or opening a project, sets `data-project` on the root and the primary button hover, nav underline, headline emphasis, process strip, "next palette" card, input focus, selection and brand mark all retint together. The accent belongs to whichever project is in hand, never to the studio.

Around the chips the world is quiet and mineral: a cool off-white ground, slightly brighter chip stock (paper), near-black ink, hairline rules and square corners. Colour is total inside a chip and nearly absent outside it. Type is Jost at a medium 500 with tight tracking for everything that names or labels, and Hanken Grotesk for reading. Motion is a spring: chips fan open and slide out of the deck, mini chips tilt, and the recolour crossfades over 0.6s.

The page is bilingual (Romanian default, English toggle, `?lang=en` deep link), with both languages in the markup and the root `lang` choosing which shows. It is a pitch draft: photos are labelled Pexels stand-ins, the two-bar brand mark is a provisional logo, and missing client facts show as `[de completat]` markers.

**Key Characteristics:**
- Three named shades per project, light to deep, always shown together as a chip.
- One accent, and it moves: `--chip` is the held project's deep shade.
- Mineral-white ground, paper chip stock, ink, hairlines, square corners.
- Jost 500 for names and labels, Hanken Grotesk 400 for reading.
- Spring motion for things that are handled; soft cast shadow only on physical chips.

## Colors

A cool, near-neutral mineral palette that carries no colour of its own, plus five three-shade project palettes at full chroma.

### Primary
- **The Held Chip** (`--chip`, resolves to the active project's deep shade: c3-chestnut, r4-graphite, wdw-petrol, cl-turquoise or b-plum): primary button hover, the 3px nav underline, the emphasised words of the hero headline, the "next palette could be yours" card, the darkest process step, the input focus outline and caret, text selection, the badge's chip bar, the second bar of the brand mark. Paper text sits on it (`--on-chip`).
- **The Held Chip, Light** (`--chip-soft`, the active project's light shade): the hero background behind the photo, the 3D viewer ground, filter-tab hover, the small chip bar inside buttons, the first bar of the brand mark, the `[de completat]` marker tint (mixed 70% into paper).

### Project palettes (chip contents only)
Each project has exactly three shades, light / mid / deep, with names that live in the markup:
- **Casa C3:** Nisip (c3-sand), Miere (c3-honey), Castan (c3-chestnut). The default held project.
- **Casa R4:** Beton (r4-concrete), Stejar (r4-oak), Grafit (r4-graphite).
- **Apartament WDW:** Var (wdw-lime), Salvie (wdw-sage), Petrol (wdw-petrol).
- **Implant Dental Office:** Porțelan (cl-porcelain), Mentă (cl-mint), Turcoaz (cl-turquoise).
- **Apartament B:** In (b-linen), Fum (b-smoke), Prună (b-plum).

### Neutral
- **Mineral Ground** (ground): the page, the sticky header, the hero card, the project dialog, the small hint and credit plates over photos.
- **Chip Stock** (paper): the body of every chip and card, inputs, tags, square buttons, text on ink and on the held chip.
- **Ink** (ink): body text, the primary button at rest, pressed filter tabs and language toggle, the 1px framing rules (service rows, contact list top, footer top, filters, inputs), the dialog gallery ground, focus outline.
- **Ink 2** (ink-2): ledes, section intros, metadata, nav links at rest, notes.
- **Hairline** (hair): quiet dividers: header bottom edge, the held-project line in the hero card, rows inside the contact list, tag borders, scrollbar thumb.
- **Error Brick** (error): form error text and invalid field borders only.

### Named Rules
**The Held Chip Rule.** The interface has one accent and it is `--chip`. Never hard-code a project shade as a UI colour; read it through `--chip` / `--chip-soft` (or `color-mix` of them) so it moves when the visitor picks another project. The one exception is content that belongs to a single project (the before/after "After" tag wears wdw-petrol because the slider shows Apartament WDW).

**The Full Chroma Inside the Chip Rule.** Project shades appear at full strength only inside chips: hero fan chips, project-card strips, the dialog palette, the service mini chips, and as the photo-loading fill behind a project's own image. Outside a chip, colour reaches the page only through the held chip.

**The Three Shades Rule.** A palette is always three shades, light to deep, shown in that order with their names. Light and mid bands carry ink text; the deep band carries paper text.

## Typography

**Display Font:** Jost (with Futura, system-ui, sans-serif), self-hosted variable woff2 (300 to 700), latin and latin-ext subsets.
**Body Font:** Hanken Grotesk (with system-ui, sans-serif), self-hosted variable woff2 (400 to 700), latin and latin-ext subsets.

**Character:** Jost is the label printed on a paint chip: geometric, medium weight, tight, sentence case. Hanken Grotesk is the plain reading voice underneath it.

### Hierarchy
- **Display** (Jost 500, clamp(2.6rem, 5.2vw, 4.9rem), 0.96, -0.035em): the hero headline only; its key phrase is set in `--chip`.
- **Headline** (Jost 500, clamp(2.4rem, 5vw, 4.5rem), 1, -0.035em): section heads. Service names run between headline and title at clamp(1.8rem, 3.6vw, 3.1rem), -0.03em; the dialog title at clamp(2rem, 3.4vw, 3.2rem).
- **Title** (Jost 500, clamp(1.4rem, 2vw, 1.9rem), 1, -0.02em): project card names and founders' names. Process steps run slightly larger (clamp(1.5rem, 2.2vw, 2.1rem)).
- **Lead** (Jost 400, clamp(1.3rem, 2vw, 1.75rem), 1.35, -0.01em): the one display-face paragraph, the about lede, 30ch.
- **Body** (Hanken Grotesk 400, 17px, 1.6): running copy at 32 to 52ch; ink-2 for supporting text; hero lede clamp(16px, 1.25vw, 18px) at 46ch.
- **Label** (Jost 500, 13 to 16px, line-height 1): buttons (16px), filter tabs and nav-bar button (15px), dialog counter (14px, tabular numerals), badge and photo tags (13 to 14px). The RO/EN toggle is Jost 600 13px, 0.06em.
- **Shade name** (Jost 500, 11px, 1.2, 0.04em): the name printed in each swatch band, scaling to clamp(9px, 0.8vw, 11px) in the hero fan.
- Small UI text in the body face (hints, form labels) is Hanken Grotesk 600 at 13 to 14px.

### Named Rules
**The Chip Label Rule.** Anything that names a thing (a project, a shade, a service, a step, a button) is set in Jost 500. Body copy never goes into Jost except the single about lede; nav links, hints and form labels stay in Hanken Grotesk.

## Layout

Content sits in a 1440px container with a fluid gutter (clamp(16px, 4vw, 56px)) under a 64px sticky header. Sections are padded clamp(80px, 10vw, 140px); consecutive sections drop their top padding so the rhythm runs on one gap. Every section head is a 6fr / 5fr split, heading left and intro right, bottom-aligned, with clamp(20px, 4vw, 64px) between. Two-part sections (3D, about, contact) use 5fr / 7fr. The project grid is three columns with clamp(14px, 1.6vw, 24px) gaps; the process is four edge-to-edge chips with no gap, tinted light to deep by mixing `--chip` into paper at 14%, 32%, 55% and 100%.

The hero is a full-bleed photo of the held project, height max(560px, min(100svh minus the header, 940px)). The cover card (ground, max 640px) sits on the bottom-left edge; the fan of five chips pivots from a pin at bottom-right.

Breakpoints: at 1080px the nav hides and the language toggle moves right; at 900px every split stacks, the project grid and process go to two columns, services keep the mini chip in a narrow first column; at 720px the hero becomes a column (photo 58svh, min 340px, then the cover card below), the fan shrinks to 50px chips held over the photo's bottom-right corner with shade names hidden, and the header button hides; at 560px everything goes single column and the before/after turns 4:5.

**Mobile hero:** the fan, scaled down, is held over the photo's bottom-right corner with the cover card below. It replaced the planned chip strip during the build so phones keep the fan interaction; Iero approved it on 2026-10-16.

## Elevation & Depth

Flat interface, physical chips. Surfaces, cards, the header and the dialog cast nothing; they separate by ground versus paper and by 1px ink or hairline rules. The only things with a cast shadow are objects a hand would pick up: the fan chips, the service mini chips and the before/after knob. Shadows are soft and warm-ink tinted, never hard-offset.

### Shadow Vocabulary
- **Chip at rest** (`box-shadow: 0 1px 2px oklch(20% 0.01 60 / .18), 0 10px 24px -8px oklch(20% 0.01 60 / .35)`): fan chips.
- **Chip lifted** (`box-shadow: 0 1px 2px oklch(20% 0.01 60 / .18), 0 16px 32px -8px oklch(20% 0.01 60 / .45)`): fan chip on hover.
- **Mini chip** (`box-shadow: 0 6px 14px -6px oklch(20% 0.01 60 / .35)`): the small chip leading each service row.
- **Knob** (`box-shadow: 0 6px 18px -6px oklch(20% 0.01 60 / .5)`): the before/after handle.
- **Pin** (`box-shadow: inset 0 1px 2px oklch(20% 0.01 60 / .35)`): the rivet hole the fan pivots on.
- **Dialog backdrop** (`oklch(20% 0.01 60 / .62)`): the scrim behind an open project.

### Named Rules
**The Held Object Rule.** Only a chip, or a handle you drag, casts a shadow. If a card, panel or button needs separation, use paper on ground or a rule.

## Shapes

Square everywhere (0 radius), inputs included. Framing rules are 1px ink; internal dividers are 1px hairline; dashed 1px rules mark what is not there yet (the empty slots of the "next palette" card, portrait placeholders, the optional 3D badge). The signature silhouette is the tall chip: about 4.4 times as tall as wide, three equal swatch bands over a foot 2.3 widths tall carrying a vertical project name and a round pin hole. That pin is the only circle in the system. Small rectangular chip bars (10x18px in buttons, 8x14px in the badge, 7px bars in the brand mark) repeat the chip as an inline glyph.

## Components

### Buttons
Ink, square and plain until touched.
- **Primary:** ink ground, paper text, Jost 500 16px, 16px 22px padding, led by a 10x18px bar in `--chip-soft`. In the header it shrinks to 11px 16px, 15px.
- **Hover / Active:** background turns `--chip` and the leading bar tips -14deg on the spring; press nudges down 1px. Focus is the global 2px ink outline, 3px offset. Disabled drops to 55% opacity.
- **Text link:** Jost 500 16px with a 1px currentColor underline rule; hover turns `--chip`.
- **Square (dialog arrows, close):** 44px, paper with 1px ink rule, inline SVG chevron at 1.6 stroke; hover inverts to ink.

### Filter tabs and language toggle
- **Filter tabs:** 1px ink box, 9px 16px, Jost 500 15px; hover fills `--chip-soft`; pressed (`aria-pressed`) fills ink with paper text. Switching runs a view transition where supported.
- **RO/EN:** one 1px ink box, two cells of 5px 9px; the current language fills ink.

### Cards / Containers
- **Project card:** paper, square, no shadow. A 4:5 photo (placeholder fill is the project's light shade; image eases to 1.035 on hover and an "Open" plate fades in top-right), then a 44px three-band strip, then name and metadata at 16px 16px 18px.
- **Next palette card:** fills `--chip` with paper text, a Jost line at 14ch, an underlined call to book, and three dashed empty bands where the visitor's palette would go.
- **Process chip:** a 420px-tall band per step (300 / 220 on smaller screens), title pushed to the foot, background mixed from `--chip`; the last step is full `--chip` with paper text. Steps carry no numbers.
- **Plates over photos:** ground or paper, 6px 10px, Hanken 600 13px (hints, credit) or Jost 500 13 to 14px (tags).

### Inputs / Fields
- **Style:** 1px ink rule, paper, square, 13px 14px padding, caret in `--chip`; labels Hanken 600 14px above, optional parts in ink-2. Select uses a drawn CSS chevron.
- **Focus:** 2px `--chip` outline at -1px offset.
- **Error:** border and 13px 600 message in error brick, checked on blur and on submit.

### Navigation
Sticky 64px bar on ground with a hairline bottom edge. Brand is the provisional two-bar mark (`--chip-soft`, `--chip`) plus "bizoo" in Jost 500 22px and "studio" at 400 in ink-2. Links are Hanken 500 15px in ink-2; hover and the section in view go ink, and the current one draws a 3px `--chip` underline from the left on the out-curve.

### Fan deck (signature)
Five chips stacked on one pin at bottom-right of the hero. Each chip gets `--i` (its place in the deck); CSS rotates it `i * 12deg - 46deg` about the pin, and the held chip (`aria-pressed="true"`) slides out 16% of its height along its own axis and comes to the top. On load the deck opens from a closed stack with the spring. Clicking or arrow keys change the held chip, which crossfades the hero photo (0.9s), retints the page and swaps the held-project line under the CTA. Chips are buttons labelled with the project name.

### Service row with mini chip
One row per service between 1px ink rules: a 46px mini chip in that row's project palette, tilted -6deg, which springs to +6deg and lifts 4px when the row is hovered; then the name, then copy and paper tags with hairline borders.

### Before / after
A 3:2 frame (4:5 on phones) with a native range input driving `clip-path` on the after image, a 2px paper line and a 52px paper knob. It nudges once when it first enters view so the visitor sees it moves.

### Motion
- **Spring** (`--spring`, a `linear()` overshoot curve): chips, mini chips, the button's leading bar, press feedback.
- **Out** (`cubic-bezier(0.16, 1, 0.3, 1)`, also the Motion library ease): recolours (0.6s), photo crossfades, nav underline, entrances.
- **Entrances** (Motion, once): project cards rise 36px with a 0.07s stagger; process chips rise 28px and untilt from -4deg like chips pulled from the deck. Defaults are already visible.
- Reduced motion collapses transitions to near zero, skips Motion and the view transition.

## Do's and Don'ts

### Do:
- **Do** show every palette as a chip: three named shades, light to deep, ink text on the light two and paper text on the deep one.
- **Do** route every interface accent through `--chip` / `--chip-soft` so it follows the held project.
- **Do** keep corners square and frame with 1px ink rules; hairlines for internal dividers; dashed rules only for what is still to come.
- **Do** set names, labels and actions in Jost 500 with tight tracking on large sizes; read in Hanken Grotesk 400.
- **Do** move handled things on the spring and recolour on the 0.6s out-curve; honour reduced motion.
- **Do** ship both languages in the markup as `lang` spans and let the root `lang` pick.

### Don't:
- **Don't** introduce a fixed brand accent beside `--chip`; the studio's colour is whichever palette is in hand.
- **Don't** spread project shades across sections, type or backgrounds outside a chip, except through the held chip.
- **Don't** cast shadows from cards, panels, buttons or the header; only chips and the drag knob are objects.
- **Don't** round corners; the pin hole is the only circle.
- **Don't** number steps, cards or sections.
