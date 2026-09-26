// ValueSteel: 3D focus carousel, the orange "here" triangle, RO/EN toggle
// and the contact form. CSS moves the cards (a spring written as linear());
// Motion (motion.dev) adds the authored moments on top: the member labels
// popping onto the live model, the name swapping, the render-to-3D wipe.

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

// model-viewer (~1 MB) and Motion load on the visitor's first sign of life,
// not with the page. Until then the renders are the carousel, a finished state.
const firstInteraction = new Promise((resolve) => {
  const events = ["pointermove", "pointerdown", "touchstart", "wheel", "scroll", "keydown"];
  const go = () => { events.forEach((e) => removeEventListener(e, go)); resolve(); };
  events.forEach((e) => addEventListener(e, go, { once: true, passive: true }));
});
let motion = null;
const motionReady = reduced ? Promise.resolve(null)
  : firstInteraction.then(() => import("https://cdn.jsdelivr.net/npm/motion@11/+esm")).then((m) => (motion = m), () => null);
const ease = [0.16, 1, 0.3, 1];
const play = (el, keyframes, options = {}) =>
  motion ? motion.animate(el, keyframes, { duration: 0.6, ease, ...options }) : null;

/* ---------- language ---------- */
const langButtons = document.querySelectorAll("[data-lang]");
const langListeners = [];
const setLang = (lang) => {
  document.documentElement.lang = lang;
  langButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  document.querySelectorAll("[data-aria-ro]").forEach((el) => el.setAttribute("aria-label", el.dataset[`aria${lang === "ro" ? "Ro" : "En"}`]));
  document.querySelectorAll("[data-ph-ro]").forEach((el) => (el.placeholder = el.dataset[`ph${lang === "ro" ? "Ro" : "En"}`]));
  document.querySelectorAll("img[data-alt-en]").forEach((img) => {
    img.dataset.altRo ??= img.alt;
    img.alt = lang === "ro" ? img.dataset.altRo : img.dataset.altEn;
  });
  document.title = document.querySelector("title").dataset[lang];
  langListeners.forEach((fn) => fn(lang));
  try { localStorage.setItem("valuesteel-lang", lang); } catch {}
};
langButtons.forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
const lang = () => document.documentElement.lang;
const t = (el, key) => el.dataset[lang()].split("|")[key];

/* ---------- member labels for the demo models (model space, metres) ---------- */
const MEMBERS = {
  // [RO, EN, member mark as it would sit on a shop drawing]
  chord: ["talpă", "chord", "T"], web: ["diagonală", "web member", "D"], column: ["stâlp", "column", "S"],
  truss: ["fermă", "truss", "F"], purlin: ["pană", "purlin", "P"], bracing: ["contravântuire", "bracing", "CV"],
  beam: ["grindă", "beam", "G"], rafter: ["căprior", "rafter", "C"], tie: ["tirant", "tie rod", "TR"],
  cantilever: ["consolă", "cantilever", "K"], stringer: ["vang", "stringer", "V"], tread: ["treaptă", "tread", "TP"],
  handrail: ["mână curentă", "handrail", "MC"], arch: ["arc", "arch", "A"], sheeting: ["policarbonat", "polycarbonate", "PC"],
};
const PINS = {
  "space-frame-canopy": [["chord", "0 5.3 -3.75"], ["web", "4.12 4.75 1.88"], ["column", "-3.75 2 -1.5"]],
  "roof-trusses": [["truss", "0 5.1 6"], ["purlin", "3 5.8 0"], ["column", "6 2.2 6"], ["bracing", "-6 2.25 -4"]],
  "carport": [["beam", "0 2.82 2.7"], ["rafter", "1.4 3.04 0"], ["column", "3 1.3 2.7"]],
  "cantilever-canopy": [["tie", "1.8 4.4 4.5"], ["cantilever", "3.06 3.5 -1.5"], ["column", "0 1.6 4.5"]],
  "steel-stair": [["stringer", "1.37 0.78 0.55"], ["tread", "2.74 1.86 0"], ["handrail", "2.16 2.34 -0.6"]],
  "barrel-canopy": [["arch", "1.88 3.82 4.5"], ["sheeting", "0 4.31 0"], ["column", "3.2 1.1 4.5"]],
};
const pinWords = (viewer) => viewer.querySelectorAll(".pin").forEach((p) => {
  p.querySelector("i").textContent = MEMBERS[p.dataset.key][lang() === "ro" ? 0 : 1];
});

/* ---------- 3D focus carousel ----------
   Every card knows its signed distance from the focused one (--d); CSS turns
   that into position, depth, turn and blur. Only the focused card holds a
   live <model-viewer>; the others show their render. */
const root = document.querySelector("[data-carousel]");
if (root) {
  const stage = root.querySelector(".stage");
  const cards = [...stage.querySelectorAll(".card")];
  const n = cards.length;
  const pager = root.querySelector(".pager");
  const here = pager.querySelector(".pager__here");
  const now = Object.fromEntries([...root.querySelectorAll("[data-now]")].map((el) => [el.dataset.now, el]));
  const count = root.querySelector("[data-count]");
  const pad = (i) => String(i + 1).padStart(2, "0");
  const library = firstInteraction.then(() => import("https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"));

  // Pager: a Warren truss, one triangle per structure, alternating up and down.
  // The gaps between the inset triangles read as the members, like the logo.
  const P = 36, H = 36, GAP = 2.6;
  const tri = (i) => {
    const x = (i * P) / 2;
    return i % 2 ? [[x, 0], [x + P, 0], [x + P / 2, H]] : [[x, H], [x + P, H], [x + P / 2, 0]];
  };
  const inset = (pts, d) => { // shrink toward the incentre by d
    const len = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const [A, B, C] = pts, a = len(B, C), b = len(A, C), c = len(A, B), s = a + b + c;
    const I = [(a * A[0] + b * B[0] + c * C[0]) / s, (a * A[1] + b * B[1] + c * C[1]) / s];
    const r = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / s;
    const k = (r - d) / r;
    return pts.map(([x, y]) => [I[0] + (x - I[0]) * k, I[1] + (y - I[1]) * k]);
  };
  const shapes = cards.map((_, i) => inset(tri(i), GAP));
  pager.style.width = `${((n + 1) * P) / 2}px`;
  const svgNS = "http://www.w3.org/2000/svg";
  const outline = document.createElementNS(svgNS, "svg");
  outline.setAttribute("aria-hidden", "true");
  shapes.forEach((s) => {
    const poly = document.createElementNS(svgNS, "polygon");
    poly.setAttribute("points", s.map((p) => p.join(",")).join(" "));
    outline.append(poly);
  });
  const pips = cards.map((card, i) => {
    const b = document.createElement("button");
    b.type = "button";
    Object.assign(b.style, {
      left: `${(i * P) / 2}px`, width: `${P}px`, height: `${H}px`,
      clipPath: i % 2 ? "polygon(0 0, 100% 0, 50% 100%)" : "polygon(0 100%, 100% 100%, 50% 0)",
    });
    b.addEventListener("click", () => go(i));
    pager.insertBefore(b, here);
    return b;
  });
  pager.append(outline);

  const label = (card) => {
    card.querySelector(".card__tag").textContent = t(card, 0);
    card.setAttribute("aria-label", t(card, 0));
  };
  const labelPips = () => pips.forEach((b, i) => b.setAttribute("aria-label", `${pad(i)}: ${t(cards[i], 0)}`));
  cards.forEach(label);
  labelPips();

  // Render / 3D switch, one per card; enabled once the model is ready.
  const WORDS = { ro: ["Randare", "3D"], en: ["Render", "3D"] };
  const HINT = { ro: "Trage ca să rotești", en: "Drag to turn" };
  cards.forEach((card) => {
    const box = card.querySelector(".toggle");
    box.setAttribute("role", "group");
    box.innerHTML = '<button type="button" data-view="render" aria-pressed="true"></button><button type="button" data-view="3d" aria-pressed="false" disabled></button>';
    box.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (b && !b.disabled) show3d(card, b.dataset.view === "3d");
    });
    card.querySelector(".card__art").insertAdjacentHTML("beforeend", '<span class="card__hint"><svg class="tri" aria-hidden="true"><use href="#tri" /></svg><span></span></span>');
  });
  const wordToggles = () => cards.forEach((card) => {
    const [r, d] = card.querySelectorAll(".toggle button");
    [r.textContent, d.textContent] = WORDS[lang()];
    card.querySelector(".card__hint > span").textContent = HINT[lang()];
  });
  wordToggles();

  const show3d = (card, on) => {
    card.classList.toggle("is-3d", on);
    card.querySelectorAll(".toggle button").forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.view === "3d") === on)));
    const viewer = card.querySelector("model-viewer");
    if (!viewer) return;
    play(viewer, { clipPath: on ? ["inset(0 0 0 100%)", "inset(0 0 0 0%)"] : ["inset(0 0 0 0%)", "inset(0 0 0 100%)"] }, { duration: 0.8 });
    // the member labels land one after another once the wipe has passed
    if (on) play(viewer.querySelectorAll(".pin > span"), { opacity: [0, 1], x: [-8, 0] }, { duration: 0.45, delay: motion ? motion.stagger(0.12, { startDelay: 0.55 }) : 0 });
  };

  const mount = (card) => {
    let viewer = card.querySelector("model-viewer");
    if (!viewer) {
      viewer = document.createElement("model-viewer");
      for (const [k, v] of Object.entries({
        "camera-controls": "", "disable-zoom": "", "disable-tap": "", "interaction-prompt": "none", loading: "eager",
        "camera-orbit": "35deg 64deg 102%", "auto-rotate-delay": "0", "rotation-per-second": "12deg",
        "environment-image": "legacy", "shadow-intensity": "1", "shadow-softness": "0.5", exposure: "0.8", "touch-action": "pan-y",
        alt: t(card, 0),
      })) viewer.setAttribute(k, v);
      const name = card.dataset.model.split("/").pop().replace(".glb", "");
      (PINS[name] || []).forEach(([key, pos], i) => {
        const pin = document.createElement("div");
        Object.assign(pin, { className: "pin", slot: `hotspot-${i}` });
        pin.dataset.position = pos;
        pin.dataset.key = key;
        pin.innerHTML = `<span><b>${MEMBERS[key][2]}${i + 1}</b><i></i></span>`;
        viewer.append(pin);
      });
      pinWords(viewer);
      // Tags near the card's right edge flip their leader to the left as the model turns.
      let queued = false;
      viewer.addEventListener("camera-change", () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          const edge = card.getBoundingClientRect().right - 130;
          viewer.querySelectorAll(".pin").forEach((pin) => pin.classList.toggle("is-left", pin.getBoundingClientRect().left > edge));
        });
      });
      viewer.setAttribute("src", card.dataset.model);
      card.querySelector(".card__art").append(viewer);
      // "load" waits for a rendered frame and can be missed on a cached,
      // instant load; `loaded` flips as soon as the model is parsed.
      const poll = setInterval(() => {
        if (!viewer.loaded) return;
        clearInterval(poll);
        card.querySelector('[data-view="3d"]').disabled = false;
        // The first time a model is ready, it takes over its card by itself.
        if (card.classList.contains("is-focus")) show3d(card, true);
      }, 100);
    }
    cards.forEach((c) => c.querySelector("model-viewer")?.toggleAttribute("auto-rotate", c === card && !reduced));
  };

  let current = -1;
  const focus = (i) => {
    i = (i + n) % n;
    if (i === current) return;
    const first = current === -1;
    current = i;
    cards.forEach((card, k) => {
      let d = k - i;
      if (d > n / 2) d -= n;          // shortest way round, so the row loops
      if (d < -n / 2) d += n;
      card.style.setProperty("--d", d);
      card.style.setProperty("--a", Math.abs(d));
      card.toggleAttribute("data-far", Math.abs(d) > 2);
      card.classList.toggle("is-focus", d === 0);
      card.setAttribute("aria-hidden", String(d !== 0));
      card.inert = d !== 0;
    });
    const card = cards[i];
    now.name.textContent = t(card, 0);
    now.type.textContent = t(card, 1);
    count.textContent = `${pad(i)} / ${pad(n - 1)}`;
    pips.forEach((b, k) => b.setAttribute("aria-current", String(k === i)));
    // the orange fill slides along the truss, flipping as it crosses each member
    here.style.clipPath = `polygon(${shapes[i].map(([x, y]) => `${x}px ${y}px`).join(", ")})`;
    if (!first) play([now.name, now.type], { opacity: [0, 1], y: [10, 0] }, { duration: 0.5 });
    library.then(() => current === i && mount(card)).catch(() => {}); // offline: the renders stay
  };
  const go = (i) => focus(i);

  // Neighbours are inert, so clicks land on the stage: map the pointer to the card under it.
  stage.addEventListener("click", (e) => {
    if (e.target.closest(".card.is-focus")) return;
    const hit = cards.find((c) => !c.hasAttribute("data-far") && !c.classList.contains("is-focus") && (() => {
      const r = c.getBoundingClientRect();
      return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    })());
    if (hit) go(cards.indexOf(hit));
  });

  // Swipe anywhere on the stage except on the live model (dragging that turns it).
  let startX = null;
  stage.addEventListener("pointerdown", (e) => {
    startX = e.target.closest(".card.is-focus.is-3d model-viewer") ? null : e.clientX;
  });
  stage.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
  });
  stage.addEventListener("keydown", (e) => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    go(current + d);
  });
  root.querySelectorAll("[data-dir]").forEach((b) => b.addEventListener("click", () => go(current + Number(b.dataset.dir))));

  langListeners.push(() => {
    cards.forEach(label);
    labelPips();
    wordToggles();
    stage.querySelectorAll("model-viewer").forEach(pinWords);
    now.name.textContent = t(cards[current], 0);
    now.type.textContent = t(cards[current], 1);
  });

  focus(0);
}

/* ---------- "here": nav follows the section in view; the tower follows the step ---------- */
const navLinks = new Map([...document.querySelectorAll(".nav a")].map((a) => [a.hash.slice(1), a]));
// A thin band across the middle of the viewport decides what is "here".
const watch = (els, fn) => {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && fn(e.target)), { rootMargin: "-45% 0px -50% 0px" });
  els.forEach((el) => io.observe(el));
};
watch(document.querySelectorAll("[data-nav]"), (s) => navLinks.forEach((a, id) => a.classList.toggle("is-here", id === s.id)));

// Process: the tower is built from the ground up; the step being read lights its panel,
// the ones below it stay built (grey), the ones above are still outlines.
const levels = [...document.querySelectorAll(".tower .lvl")];
const steps = [...document.querySelectorAll("[data-step]")];
if (levels.length && steps.length) {
  const place = (i) => {
    steps.forEach((s, k) => s.classList.toggle("is-here", k === i));
    levels.forEach((l) => {
      const k = Number(l.dataset.level);
      l.classList.toggle("is-here", k === i);
      l.classList.toggle("is-built", k < i);
    });
  };
  place(0);
  watch(steps, (s) => place(Number(s.dataset.step)));
}

// Services: exactly one row holds the orange triangle: the one crossing the middle
// of the screen, or the one under the mouse (touch taps don't count).
const svc = [...document.querySelectorAll(".svc li")];
const markRow = (li) => svc.forEach((o) => o.classList.toggle("is-here", o === li));
watch(svc, markRow);
svc.forEach((li) => li.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && markRow(li)));

motionReady.then((m) => {
  if (!m) return;
  // Work photos rise into place once, the first time the grid scrolls in.
  m.inView(".work", (info) => {
    const el = info.target ?? info; // Motion 11 passes the IntersectionObserverEntry
    m.animate([...el.children], { opacity: [0.001, 1], y: [40, 0] }, { duration: 0.9, ease, delay: m.stagger(0.06) });
  }, { amount: 0.15 });
  // The space frame drifts against the scroll, like looking up while walking under it.
  const band = document.querySelector(".band img");
  if (band) m.scroll(m.animate(band, { y: ["-15%", "0%"] }, { ease: "linear" }), { target: band.parentElement, offset: ["start end", "end start"] });
});

/* ---------- contact form (demo: validates, then confirms without sending) ---------- */
const form = document.querySelector(".form");
if (form) {
  const status = form.querySelector(".form__status");
  const fields = [...form.querySelectorAll("input[required], textarea[required]")];
  const check = (f) => {
    const ok = f.value.trim() !== "";
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
    status.textContent = lang() === "ro"
      ? "Mulțumim! Mesajul a ajuns, te sunăm cât de curând."
      : "Thank you! Your message is in, we’ll call you back soon.";
    setTimeout(() => { form.reset(); button.disabled = false; status.textContent = ""; }, 4000);
  });
}

// Language last, so every listener above is registered: ?lang=en, then the saved choice.
let saved = new URLSearchParams(location.search).get("lang");
try { saved ||= localStorage.getItem("valuesteel-lang"); } catch {}
if (saved === "en" || saved === "ro") setLang(saved);
