// Est Rise Architecture: 3D focus carousel, title-block sheet numbers and the
// contact form. Motion (motion.dev) drives the one authored moment, the focus
// change: dimension lines drawing in and the spec cells swapping value. Every
// piece of content is visible without it.

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Nothing third-party loads with the page: model-viewer (~1 MB) and Motion
// arrive on the visitor's first sign of life (pointer, touch, scroll, key).
// Until then the render photos are the carousel, which is a finished state.
const firstInteraction = new Promise((resolve) => {
  const events = ["pointermove", "pointerdown", "touchstart", "wheel", "scroll", "keydown"];
  const go = () => { events.forEach((e) => removeEventListener(e, go)); resolve(); };
  events.forEach((e) => addEventListener(e, go, { once: true, passive: true }));
});
let motion = null;
if (!reduced) firstInteraction.then(() => import("https://cdn.jsdelivr.net/npm/motion@11/+esm")).then((m) => (motion = m), () => {});
const ease = [0.16, 1, 0.3, 1];
const play = (el, keyframes, options = {}) =>
  motion ? motion.animate(el, keyframes, { duration: 0.6, ease, ...options }) : null;

/* ---------- 3D focus carousel ----------
   Native scroll-snap does the swiping. The centred card is "in focus": sharp,
   full size, and its <model-viewer> is live; the render photo shrinks into a
   corner detail. Viewers are created on first focus, share one WebGL context,
   and only the focused one rotates. */
const root = document.querySelector("[data-carousel]");
if (root) {
  const track = root.querySelector(".field__track");
  const cards = [...track.querySelectorAll(".card")];
  const dims = root.querySelector(".dims");
  const dimLine = { w: dims.querySelector("[data-dim-line=w]"), h: dims.querySelector("[data-dim-line=h]") };
  const dimLabel = { w: dims.querySelector("[data-dim=w]"), h: dims.querySelector("[data-dim=h]") };
  const count = root.querySelector("[data-count]");
  const spec = Object.fromEntries([...root.querySelectorAll("[data-spec]")].map((el) => [el.dataset.spec, el]));
  const metres = (n) => n.toFixed(2);
  // White-card study model: every material set to the paper tone, so the model
  // reads as the architect's volume study and the corner render as the result.
  const PAPER = [0.96, 0.96, 0.94, 1];
  // Bounding-box corners as ±1 multipliers: 0–3 bottom, 4–7 the same corners on top.
  const CORNERS = [[-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [-1, 1, -1], [1, 1, -1], [-1, 1, 1], [1, 1, 1]];

  const library = firstInteraction.then(() => import("https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"));

  const mount = (card) => {
    let viewer = card.querySelector("model-viewer");
    if (!viewer) {
      viewer = document.createElement("model-viewer");
      for (const [k, v] of Object.entries({
        "camera-controls": "", "disable-zoom": "", "interaction-prompt": "none", loading: "eager",
        "camera-orbit": "35deg 72deg 105%", "auto-rotate-delay": "0", "rotation-per-second": "14deg",
        "shadow-intensity": "0.6", exposure: "1.05", alt: `Studiu de volum 3D: ${card.dataset.name}`,
      })) viewer.setAttribute(k, v);
      // Three corners of the bounding box, placed once the model is parsed;
      // their on-screen positions are what the dimension lines are drawn from.
      viewer.innerHTML = '<span slot="progress-bar"></span>' +
        CORNERS.map((_, i) => `<span class="dims__pin" slot="hotspot-${i}" data-position="0 0 0"></span>`).join("");
      viewer.setAttribute("src", card.dataset.model);
      card.querySelector(".card__stage").prepend(viewer);
      // "load" waits for a rendered frame and can be missed on a cached,
      // instant load; `loaded` flips as soon as the model is parsed.
      const poll = setInterval(() => {
        if (!viewer.loaded) return;
        clearInterval(poll);
        viewer.model?.materials.forEach((m) => m.pbrMetallicRoughness.setBaseColorFactor(PAPER));
        const c = viewer.getBoundingBoxCenter();
        const d = viewer.getDimensions();
        // All eight bounding-box corners; measure() picks the ones nearest the
        // camera at each frame, so the lines never cross the model's faces.
        for (const [i, [sx, sy, sz]] of CORNERS.entries()) {
          viewer.updateHotspot({ name: `hotspot-${i}`, position: `${c.x + sx * d.x / 2} ${c.y + sy * d.y / 2} ${c.z + sz * d.z / 2}` });
        }
        // Demo models aren't to scale, so they get letters; a card marked
        // data-real (a model exported to scale) prints its extents in metres.
        const real = "real" in card.dataset;
        card.dataset.w = real ? `${metres(d.x)} m` : "L";
        card.dataset.h = real ? `${metres(d.y)} m` : "H";
        card.classList.add("is-live");
        if (card.classList.contains("is-focus")) showDims(card);
      }, 100);
    }
    cards.forEach((c) => c.querySelector("model-viewer")?.toggleAttribute("auto-rotate", c === card && !reduced));
  };

  // Witness lines follow the model's front-bottom edge (width) and front-right
  // edge (height), pushed off the model by a fixed gap, like a drawn dimension.
  const GAP = 18;
  const measure = (card) => {
    const stage = card.querySelector(".card__stage").getBoundingClientRect();
    const pt = CORNERS.map((_, i) => {
      const r = card.querySelector(`[slot=hotspot-${i}]`).getBoundingClientRect();
      return { x: r.left + r.width / 2 - stage.left, y: r.top + r.height / 2 - stage.top };
    });
    // The camera looks down on the model, so the bottom corner lowest on screen
    // is the nearest. Width runs from it along x; height rises from whichever
    // end of that edge is further right, so both lines sit outside the volume.
    const bottom = [0, 1, 2, 3];
    const near = bottom.reduce((best, i) => (pt[i].y > pt[best].y ? i : best), 0);
    const along = bottom.find((i) => i !== near && CORNERS[i][2] === CORNERS[near][2]);
    const [a, b] = pt[near].x < pt[along].x ? [pt[near], pt[along]] : [pt[along], pt[near]];
    const right = pt[near].x < pt[along].x ? along : near;
    const c = pt[right + 4];
    const line = (p, q, nx, ny) => {
      const [p2, q2] = [p, q].map((s) => ({ x: s.x + nx * GAP, y: s.y + ny * GAP }));
      const t = 5; // tick half-length, perpendicular to the dimension line
      return `M${p2.x} ${p2.y}L${q2.x} ${q2.y}M${p2.x - nx * t} ${p2.y - ny * t}L${p2.x + nx * t} ${p2.y + ny * t}M${q2.x - nx * t} ${q2.y - ny * t}L${q2.x + nx * t} ${q2.y + ny * t}`;
    };
    const place = (el, p, q, nx, ny) => {
      el.style.left = `${(p.x + q.x) / 2 + nx * GAP}px`;
      el.style.top = `${(p.y + q.y) / 2 + ny * GAP}px`;
    };
    dimLine.w.setAttribute("d", line(a, b, 0, 1));
    dimLine.h.setAttribute("d", line(b, c, 1, 0));
    place(dimLabel.w, a, b, 0, 1);
    place(dimLabel.h, b, c, 1, 0);
  };

  // Auto-rotate turns the model, not the camera (no camera-change event), so
  // the lines are redrawn every frame while a focused card is live.
  let tracking = null;
  const track3d = () => {
    if (dims.hidden || !tracking) return (tracking = null);
    measure(tracking);
    requestAnimationFrame(track3d);
  };
  const showDims = (card) => {
    dimLabel.w.textContent = card.dataset.w;
    dimLabel.h.textContent = card.dataset.h;
    card.querySelector(".card__stage").append(dims);
    measure(card);
    dims.hidden = false;
    if (!tracking) requestAnimationFrame(track3d);
    tracking = card;
    play(dims.querySelector("svg"), { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] }, { duration: 0.9, delay: 0.2 });
    play(Object.values(dimLabel), { opacity: [0, 1] }, { duration: 0.4, delay: 0.7 });
  };

  let current = -1;
  const focus = (i) => {
    if (i === current) return;
    current = i;
    const card = cards[i];
    cards.forEach((c) => c.classList.toggle("is-focus", c === card));
    count.textContent = card.dataset.n;

    // "Fără scară" is the drawing note for not-to-scale; only real exports state a scale.
    const values = { name: card.dataset.name, type: card.dataset.type, scale: "real" in card.dataset ? card.dataset.scale : "Fără scară" };
    Object.entries(values).forEach(([k, v], n) => {
      if (spec[k].textContent === v) return;
      spec[k].textContent = v;
      play(spec[k], { opacity: [0, 1], y: [8, 0] }, { duration: 0.45, delay: n * 0.05 });
    });

    dims.hidden = true;
    if (card.classList.contains("is-live")) showDims(card);
    library.then(() => current === i && mount(card)).catch(() => {}); // offline: the renders stay
  };

  const centre = (i, behavior = reduced ? "auto" : "smooth") => {
    const card = cards[i];
    track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2, behavior });
  };
  // moving = a scroll we started is in flight; the settle check must not
  // refocus a card the animation is only passing over.
  let moving = false;
  const go = (i) => {
    i = (i + cards.length) % cards.length;
    focus(i);
    moving = true;
    centre(i);
  };

  const nearest = () => {
    const mid = track.scrollLeft + track.clientWidth / 2;
    const dist = (c) => Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
    return cards.reduce((best, c, i) => (dist(c) < dist(cards[best]) ? i : best), 0);
  };

  // Focus changes when a swipe settles, not on every frame it passes through.
  let settle;
  track.addEventListener("scroll", () => {
    clearTimeout(settle);
    settle = setTimeout(() => (moving ? (moving = false) : focus(nearest())), moving ? 400 : 110);
  }, { passive: true });
  track.addEventListener("pointerdown", () => (moving = false), { passive: true });

  root.querySelectorAll("[data-dir]").forEach((b) => b.addEventListener("click", () => go(current + Number(b.dataset.dir))));
  cards.forEach((c, i) => c.addEventListener("click", () => i !== current && go(i)));
  track.addEventListener("keydown", (e) => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    go(current + d);
  });
  addEventListener("resize", () => {
    centre(current, "auto");
    if (!dims.hidden) measure(cards[current]);
  });

  // Open on the card numbered 01 (second in the row), so a neighbour shows on each side.
  const first = cards.findIndex((c) => c.dataset.n === "01");
  focus(first);
  centre(first, "auto");
}

/* ---------- Title block: sheet number follows the section in view ---------- */
const sheetNo = document.querySelector("[data-sheet-no]");
const sheetTitle = document.querySelector("[data-sheet-title]");
const sheetObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting || sheetNo.textContent === e.target.dataset.sheet) return;
    sheetNo.textContent = e.target.dataset.sheet;
    sheetTitle.textContent = e.target.dataset.title;
    play([sheetNo, sheetTitle], { opacity: [0, 1], y: [6, 0] }, { duration: 0.35 });
  });
}, { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("[data-sheet]").forEach((s) => sheetObserver.observe(s));

/* ---------- Contact form (demo: validates, then confirms without sending) ---------- */
const form = document.querySelector(".form");
if (form) {
  const status = form.querySelector(".form__status");
  const fields = [...form.querySelectorAll("input, textarea")];
  const check = (f) => {
    const ok = f.value.trim() !== "" || !f.required;
    f.closest(".form__row").classList.toggle("is-invalid", !ok);
    f.setAttribute("aria-invalid", String(!ok));
    return ok;
  };
  fields.forEach((f) => {
    f.addEventListener("blur", () => check(f));
    f.addEventListener("input", () => f.closest(".is-invalid") && check(f));
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const bad = fields.filter((f) => !check(f));
    if (bad.length) return bad[0].focus();
    const button = form.querySelector("button");
    button.disabled = true;
    status.textContent = "Mulțumim! Mesajul a ajuns, te contactăm cât de curând.";
    setTimeout(() => { form.reset(); button.disabled = false; status.textContent = ""; }, 4000);
  });
}
