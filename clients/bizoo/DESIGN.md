---
name: Bizoo Studio
description: Interior design and 3D visualisation studio in Târgu Mureș; a black-and-white frame cut from the Bizoo mark holds a colour fan deck of the studio's projects.
colors:
  ground: "oklch(98.6% 0 0)"
  paper: "oklch(100% 0 0)"
  grey: "oklch(94.5% 0 0)"
  ink: "oklch(14% 0 0)"
  ink-hover: "oklch(30% 0 0)"
  ink-2: "oklch(42% 0 0)"
  on-ink-2: "oklch(76% 0 0)"
  hair: "oklch(87% 0 0)"
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
    fontWeight: 400
    lineHeight: 0.96
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Jost, Futura, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Jost, Futura, system-ui, sans-serif"
    fontSize: "clamp(1.4rem, 2vw, 1.9rem)"
    fontWeight: 600
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
  wordmark:
    fontFamily: "Jost, Futura, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
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
  header:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    height: "64px"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "16px 22px"
  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
  button-on-ink:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "11px 16px"
  button-on-ink-hover:
    backgroundColor: "{colors.grey}"
  button-square:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    size: "44px"
  button-square-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  filter-tab-hover:
    backgroundColor: "{colors.grey}"
    textColor: "{colors.ink}"
  filter-tab-on:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "9px 16px"
  segmented-toggle-on:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
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
  next-palette-card:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "clamp(20px, 2.4vw, 32px)"
  next-palette-card-hover:
    backgroundColor: "{colors.ink-hover}"
---

# Design System: Bizoo Studio

## Overview

**Creative North Star: "The Mark Holds the Deck"**

The frame is the Bizoo mark: pure black and white, square geometry, 45° diamonds. The mark itself is a white square standing on its point, cut by an upper half-ring, a band to the left edge, a slot and one rounded corner. It is drawn as SVG geometry in `currentColor` through a mask, used once as a `<symbol>` in the black header and black footer, and served as the favicon. Every neutral in the frame has zero chroma.

Inside that frame the page is an interior designer's colour fan deck. Every project is a paint chip: a tall strip of three named shades, light to deep, with the project's name at its foot. Holding a chip in the hero fan swaps the room photo behind it; it does not recolour the interface. Colour lives only in the chips and the photos, at full strength, and nowhere else.

Type is Jost: 600 for headings and the wordmark, 500 for anything that labels, and a light 400 hero headline whose key phrase steps up to 700. Hanken Grotesk carries the reading. Motion is a spring for handled things (chips fan open and slide out, mini chips tilt, the mark turns a quarter on hover) and an out-curve for crossfades.

The page is bilingual (Romanian default, English toggle, `?lang=en` deep link), with both languages in the markup and the root `lang` choosing which shows. It is a pitch draft: photos are labelled Pexels stand-ins, and missing client facts show as `[de completat]` markers.

**Key Characteristics:**
- A zero-chroma frame: black header and footer, white ground and paper, greys between.
- The real Bizoo mark, in `currentColor`, in the header, the footer and the favicon.
- Three named shades per project, light to deep, always shown together as a chip; chips and photos are the only colour.
- Square corners, 1px rules, 45° diamonds as the inline glyph.
- Jost 600 headings, Jost 500 labels, Hanken Grotesk 400 for reading.
- Spring motion for things that are handled; soft cast shadow only on physical chips.

## Colors

A black-and-white frame with no hue at all, holding five three-shade project palettes at full chroma.

### Neutral
- **Mark Black** (ink): the header and footer, body text, the primary button, the "next palette" card, pressed filter tabs, the 1px framing rules (service rows, contact list top, filters, inputs), the dialog gallery ground, focus outline, text selection.
- **Pressed Black** (ink-hover): hover on ink surfaces (primary button, "next palette" card); the `[de completat]` marker in the footer.
- **Mark White** (ground): the page, the hero cover card, the project dialog, the hint and credit plates over photos, the pin hole.
- **Chip Stock** (paper): chips, cards, inputs, tags, square buttons, text and rules on black, the header button and the active RO/EN cell.
- **Quiet Grey** (grey): filter-tab hover, header-button hover, the `[de completat]` marker, the empty hero and 3D viewer frames behind loading media.
- **Ink 2** (ink-2): ledes, section intros, metadata, notes, dashed portrait placeholders.
- **On-Ink 2** (on-ink-2): secondary text on black (nav links at rest, the "studio" half of the wordmark, footer copy), the dashed empty bands in the "next palette" card.
- **Hairline** (hair): quiet dividers: the held-project line in the hero card, rows inside the contact list, tag borders, the 3D viewer frame, scrollbar thumb.
- **Error Brick** (error): form error text and invalid field borders only; the one hue outside a chip or photo.

### Project palettes (chip contents only)
Each project has exactly three shades, light / mid / deep, with names that live in the markup:
- **Casa C3:** Nisip (c3-sand), Miere (c3-honey), Castan (c3-chestnut). The default held project.
- **Casa R4:** Beton (r4-concrete), Stejar (r4-oak), Grafit (r4-graphite).
- **Apartament WDW:** Var (wdw-lime), Salvie (wdw-sage), Petrol (wdw-petrol).
- **Implant Dental Office:** Porțelan (cl-porcelain), Mentă (cl-mint), Turcoaz (cl-turquoise).
- **Apartament B:** In (b-linen), Fum (b-smoke), Prună (b-plum).

### Named Rules
**The Black and White Frame Rule.** Every interface colour is a zero-chroma OKLCH neutral. There is no accent: hover, focus, selection, pressed and emphasis states are carried by ink, ink-hover, grey and paper. Error brick is the only exception.

**The Colour Lives in the Chip Rule.** Project shades appear only inside chips (hero fan, project-card strips, the dialog palette, service mini chips), as the photo-loading fill behind a project's own image, and in content that belongs to a single project (the before/after "After" tag wears wdw-petrol because the slider shows Apartament WDW). They never become a UI colour, a section background or a text colour.

**The Three Shades Rule.** A palette is always three shades, light to deep, shown in that order with their names. Light and mid bands carry ink text; the deep band carries paper text.

## Typography

**Display Font:** Jost (with Futura, system-ui, sans-serif), self-hosted variable woff2 (300 to 700), latin and latin-ext subsets.
**Body Font:** Hanken Grotesk (with system-ui, sans-serif), self-hosted variable woff2 (400 to 700), latin and latin-ext subsets.

**Character:** Jost is the label printed on a paint chip and the geometry of the mark: round, square-shouldered, sentence case. Hanken Grotesk is the plain reading voice underneath it.

### Hierarchy
- **Display** (Jost 400, clamp(2.6rem, 5.2vw, 4.9rem), 0.96, -0.035em): the hero headline only; its key phrase is set in Jost 700, same colour.
- **Headline** (Jost 600, clamp(2.4rem, 5vw, 4.5rem), 1, -0.035em): section heads. Service names run at clamp(1.8rem, 3.6vw, 3.1rem), -0.03em; the dialog title at clamp(2rem, 3.4vw, 3.2rem).
- **Title** (Jost 600, clamp(1.4rem, 2vw, 1.9rem), 1, -0.02em): project card names and founders' names. Process steps run slightly larger (clamp(1.5rem, 2.2vw, 2.1rem)).
- **Wordmark** (Jost 600, 22px, -0.02em): "bizoo" beside the mark, with "studio" at 400 in on-ink-2.
- **Lead** (Jost 400, clamp(1.3rem, 2vw, 1.75rem), 1.35, -0.01em): the about lede, 30ch. The "next palette" line is Jost 500 clamp(1.5rem, 2.4vw, 2.2rem), 14ch.
- **Body** (Hanken Grotesk 400, 17px, 1.6): running copy at 32 to 52ch; ink-2 for supporting text; hero lede clamp(16px, 1.25vw, 18px) at 46ch.
- **Label** (Jost 500, 13 to 16px, line-height 1): buttons (16px, 15px in the header), filter tabs (15px), dialog counter (14px, tabular numerals), badge and photo tags (13 to 14px), the held project's name (600 16px). The RO/EN toggle is Jost 600 13px, 0.06em.
- **Shade name** (Jost 500, 11px, 1.2, 0.04em): the name printed in each swatch band, clamp(9px, 0.8vw, 11px) in the hero fan, hidden on phones.
- Small UI text in the body face (nav links, hints, form labels) is Hanken Grotesk 500 to 600 at 13 to 15px.

### Named Rules
**The Weight Ladder Rule.** Headings and the wordmark are Jost 600; labels and actions are Jost 500; the hero headline alone is 400 with a 700 emphasis. Emphasis is weight, never colour.

## Layout

Content sits in a 1440px container with a fluid gutter (clamp(16px, 4vw, 56px)) under a 64px sticky black header. Sections are padded clamp(80px, 10vw, 140px). Every section head is a 6fr / 5fr split, heading left and intro right, bottom-aligned, with clamp(20px, 4vw, 64px) between. Two-part sections (3D, about, contact) use 5fr / 7fr. The project grid is three columns with clamp(14px, 1.6vw, 24px) gaps; the process is four edge-to-edge bands with no gap, stepping white to black by mixing ink into paper at 5%, 14%, 72% and 100% (paper text on the last two).

The hero is a full-bleed photo of the held project, height max(560px, min(100svh minus the header, 940px)), on a grey frame while it loads. The cover card (ground, max 640px) sits on the bottom-left edge; the fan of five chips pivots from a pin at bottom-right.

Breakpoints: at 1080px the nav hides and the language toggle moves right; at 900px every split stacks, the project grid and process go to two columns, services keep the mini chip in a narrow first column; at 720px the hero becomes a column (photo 58svh, min 340px, then the cover card below), the fan shrinks to 50px chips held over the photo's bottom-right corner with shade names hidden, and the header button hides; at 560px everything goes single column, the before/after turns 4:5 and the wordmark drops "studio".

**Mobile hero:** the fan, scaled down, is held over the photo's bottom-right corner with the cover card below. It replaced the planned chip strip during the build so phones keep the fan interaction; Iero approved it on 2026-10-16.

## Elevation & Depth

Flat interface, physical chips. Surfaces, cards, the header and the dialog cast nothing; they separate by black against white, ground against paper, and 1px ink or hairline rules. The only things with a cast shadow are objects a hand would pick up: the fan chips, the service mini chips and the before/after knob. Shadows are soft and diffuse, never hard-offset.

### Shadow Vocabulary
- **Chip at rest** (`box-shadow: 0 1px 2px oklch(20% 0 0 / .18), 0 10px 24px -8px oklch(20% 0 0 / .35)`): fan chips.
- **Chip lifted** (`box-shadow: 0 1px 2px oklch(20% 0 0 / .18), 0 16px 32px -8px oklch(20% 0 0 / .45)`): fan chip on hover.
- **Mini chip** (`box-shadow: 0 6px 14px -6px oklch(20% 0 0 / .35)`): the small chip leading each service row.
- **Knob** (`box-shadow: 0 6px 18px -6px oklch(20% 0 0 / .5)`): the before/after handle.
- **Pin** (`box-shadow: inset 0 1px 2px oklch(20% 0 0 / .35)`): the rivet hole the fan pivots on.
- **Dialog backdrop** (`oklch(20% 0 0 / .62)`): the scrim behind an open project.

### Named Rules
**The Held Object Rule.** Only a chip, or a handle you drag, casts a shadow. If a card, panel or button needs separation, use black on white, paper on ground, or a rule.

## Shapes

Interface corners are square (0 radius), inputs included. Framing rules are 1px ink (1px paper on black); internal dividers are 1px hairline; dashed 1px rules mark what is not there yet (the empty bands of the "next palette" card, portrait placeholders, the optional 3D badge). The recurring inline glyph is a 45° diamond, a small square on its point taken from the mark's stance: 9px in buttons (it turns to 135° on hover), 8px in the badge. The mark is the only place the frame curves (its half-ring and one rounded corner), and it turns 90° on the spring when the brand link is hovered.

The signature silhouette is the tall chip: about 4.4 times as tall as wide, three equal swatch bands over a foot 2.3 widths tall carrying a vertical project name and a round pin hole, the only circle in the interface.

## Components

### Buttons
Black, square and plain until touched.
- **Primary:** ink, paper text, Jost 500 16px, 16px 22px padding, led by a 9px paper diamond.
- **Hover / Active:** background lifts to ink-hover and the diamond turns from 45° to 135° on the spring; press nudges down 1px. Focus is the global 2px ink outline, 3px offset (paper outline inside the header and footer). Disabled drops to 55% opacity.
- **On black (header):** inverted: paper with ink text and an ink diamond, 11px 16px, 15px; hover goes grey. Hidden under 720px.
- **Text link:** Jost 500 16px with a 1px currentColor underline rule; hover goes ink-2.
- **Square (dialog arrows, close):** 44px, paper with 1px ink rule, inline SVG chevron at 1.6 stroke; hover inverts to ink.

### Filter tabs and language toggle
- **Filter tabs:** 1px ink box, 9px 16px, Jost 500 15px; hover fills grey; pressed (`aria-pressed`) fills ink with paper text. Switching runs a view transition where supported.
- **RO/EN:** one 1px paper box on the black header, two cells of 5px 9px; the current language fills paper with ink text.

### Cards / Containers
- **Project card:** paper, square, no shadow. A 4:5 photo (placeholder fill is the project's light shade; image eases to 1.035 on hover and an "Open" plate fades in top-right), then a 44px three-band strip, then name and metadata at 16px 16px 18px.
- **Next palette card:** ink with paper text, a Jost line at 14ch, an underlined call to book, and three dashed on-ink-2 empty bands where the visitor's palette would go; hover lifts to ink-hover.
- **Process band:** a 420px-tall band per step (300 / 220 on smaller screens), title pushed to the foot, greyscale from near-white to black. Steps carry no numbers.
- **Plates over photos:** ground or paper, 6px 10px, Hanken 600 13px (hints, credit) or Jost 500 13 to 14px (tags).

### Inputs / Fields
- **Style:** 1px ink rule, paper, square, 13px 14px padding, ink caret; labels Hanken 600 14px above, optional parts in ink-2. Select uses a drawn CSS chevron.
- **Focus:** 2px ink outline at -1px offset.
- **Error:** border and 13px 600 message in error brick, checked on blur and on submit.

### Navigation
Sticky 64px black bar. Brand is the mark (34px, paper via `currentColor`) plus "bizoo" in Jost 600 22px and "studio" at 400 in on-ink-2. Links are Hanken 500 15px in on-ink-2; hover and the section in view go paper, and the current one draws a 2px paper underline from the left on the out-curve.

### Footer
Black, 44px / 56px padding, Hanken 14px in on-ink-2, links and the brand in paper, the same mark as the header.

### Fan deck (signature)
Five chips stacked on one pin at bottom-right of the hero. Each chip gets `--i` (its place in the deck); CSS rotates it `i * 12deg - 46deg` about the pin, and the held chip (`aria-pressed="true"`) slides out 16% of its height along its own axis and comes to the top. On load the deck opens from a closed stack with the spring. Clicking or arrow keys change the held chip, which crossfades the hero photo (0.9s) and swaps the held-project line under the CTA. Chips are buttons labelled with the project name.

### Service row with mini chip
One row per service between 1px ink rules: a 46px mini chip in that row's project palette, tilted -6deg, which springs to +6deg and lifts 4px when the row is hovered; then the name, then copy and paper tags with hairline borders.

### Before / after
A 3:2 frame (4:5 on phones) with a native range input driving `clip-path` on the after image, a 2px paper line and a 52px paper knob. It nudges once when it first enters view so the visitor sees it moves.

### Motion
- **Spring** (`--spring`, a `linear()` overshoot curve): chips (0.9s), mini chips and the mark (0.7s), the button diamond (0.5s), press feedback.
- **Out** (`cubic-bezier(0.16, 1, 0.3, 1)`, also the Motion library ease): photo crossfades, button and card hovers, nav underline, entrances.
- **Entrances** (Motion, once): project cards rise 36px with a 0.07s stagger; process bands rise 28px and untilt from -4deg like chips pulled from the deck. Defaults are already visible.
- Reduced motion collapses transitions to near zero, skips Motion and the view transition.

## Do's and Don'ts

### Do:
- **Do** keep every interface colour a zero-chroma neutral; carry state with ink, ink-hover, grey and paper.
- **Do** show every palette as a chip: three named shades, light to deep, ink text on the light two and paper text on the deep one.
- **Do** draw the Bizoo mark from the one `<symbol>` in `currentColor`; paper on black, ink on white.
- **Do** keep interface corners square and frame with 1px rules; hairlines for internal dividers; dashed rules only for what is still to come.
- **Do** use the 45° diamond as the inline glyph.
- **Do** set headings in Jost 600, labels and actions in Jost 500, reading in Hanken Grotesk 400.
- **Do** move handled things on the spring and crossfade on the out-curve; honour reduced motion.
- **Do** ship both languages in the markup as `lang` spans and let the root `lang` pick.

### Don't:
- **Don't** introduce an interface accent; colour belongs to the chips and the photos.
- **Don't** use project shades for buttons, rules, type or section backgrounds outside a chip.
- **Don't** redraw, recolour or re-proportion the mark; it stays the client's geometry.
- **Don't** cast shadows from cards, panels, buttons or the header; only chips and the drag knob are objects.
- **Don't** round interface corners; curves belong to the mark and the pin hole.
- **Don't** number steps, cards or sections.
