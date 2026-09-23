// Starthouse: 3D focus carousel, the dark-cube "here" marker, RO/EN toggle
// and the contact form. CSS moves the cards (a spring written as linear());
// Motion (motion.dev) adds the authored moments on top: the dark cube hopping
// between cubes, the project name swapping, the render-to-3D wipe.

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

// Moves an element to (x, y) px. With Motion it hops: up, across and down,
// like a piece set on the board. Without it, it just jumps there.
const hop = (el, x, y, lift = 26) => {
  const [x0, y0] = (el.dataset.at ?? `${x},${y}`).split(",").map(Number);
  const at = (px, py) => `translate(${px}px, ${py}px)`;
  el.dataset.at = `${x},${y}`;
  if (!motion) return (el.style.transform = at(x, y));
  motion.animate(el, { transform: [at(x0, y0), at((x0 + x) / 2, Math.min(y0, y) - lift), at(x, y)] },
    { duration: 0.6, times: [0, 0.45, 1], ease: ["easeOut", [0.3, 0, 0.2, 1.4]] });
};

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
  try { localStorage.setItem("starthouse-lang", lang); } catch {}
};
langButtons.forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
const t = (el, key) => el.dataset[document.documentElement.lang].split("|")[key];

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

  // Pager: the cubes sit on an isometric 3×2 board. +column steps right-down,
  // +row steps left-down; drawing order front-most last so faces overlap right.
  const COLS = 3;
  const cell = (i) => {
    const c = i % COLS, r = Math.floor(i / COLS);
    return { x: 20 * c - 20 * r + 20, y: 11.5 * (c + r) + 23, z: c + r };
  };
  const pips = cards.map((card, i) => {
    const b = document.createElement("button");
    b.type = "button";
    const { x, y, z } = cell(i);
    Object.assign(b.style, { left: `${x}px`, top: `${y}px`, zIndex: z });
    b.innerHTML = '<svg class="cube" viewBox="0 0 40 46" aria-hidden="true"><use href="#cube" width="40" height="46" /></svg>';
    b.addEventListener("click", () => go(i));
    pager.append(b);
    return b;
  });

  const label = (card) => {
    card.querySelector(".card__tag").innerHTML = `<b>${t(card, 0)}</b>`;
    card.setAttribute("aria-label", t(card, 0));
  };
  const labelPips = () => pips.forEach((b, i) => b.setAttribute("aria-label", `${pad(i)}: ${t(cards[i], 0)}`));
  cards.forEach(label);
  labelPips();

  // Render / 3D switch, one per card; enabled once the model is ready.
  const WORDS = { ro: ["Randare", "3D"], en: ["Render", "3D"] };
  cards.forEach((card) => {
    const box = card.querySelector(".toggle");
    box.setAttribute("role", "group");
    box.innerHTML = '<button type="button" data-view="render" aria-pressed="true"></button><button type="button" data-view="3d" aria-pressed="false" disabled></button>';
    box.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (b && !b.disabled) show3d(card, b.dataset.view === "3d");
    });
  });
  const wordToggles = () => cards.forEach((card) => {
    const [r, d] = card.querySelectorAll(".toggle button");
    [r.textContent, d.textContent] = WORDS[document.documentElement.lang];
  });
  wordToggles();

  const show3d = (card, on) => {
    card.classList.toggle("is-3d", on);
    card.querySelectorAll(".toggle button").forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.view === "3d") === on)));
    const viewer = card.querySelector("model-viewer");
    if (viewer) play(viewer, { clipPath: on ? ["inset(0 0 0 100%)", "inset(0 0 0 0%)"] : ["inset(0 0 0 0%)", "inset(0 0 0 100%)"] }, { duration: 0.8 });
  };

  const mount = (card) => {
    let viewer = card.querySelector("model-viewer");
    if (!viewer) {
      viewer = document.createElement("model-viewer");
      for (const [k, v] of Object.entries({
        "camera-controls": "", "disable-zoom": "", "disable-tap": "", "interaction-prompt": "none", loading: "eager",
        "camera-orbit": "35deg 62deg 105%", "auto-rotate-delay": "0", "rotation-per-second": "16deg",
        "environment-image": "legacy", "shadow-intensity": "1", "shadow-softness": "0.5", exposure: "0.65", "touch-action": "pan-y",
        alt: t(card, 0),
      })) viewer.setAttribute(k, v);
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
    // inert cards can't be clicked; the stage handles clicks on neighbours below.
    const card = cards[i];
    now.name.textContent = t(card, 0);
    now.type.textContent = t(card, 1);
    count.textContent = `${pad(i)} / ${pad(n - 1)}`;
    pips.forEach((b, k) => b.setAttribute("aria-current", String(k === i)));
    const { x, y, z } = cell(i);
    here.style.zIndex = 9 + z;
    hop(here, x, y - 23);
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
    now.name.textContent = t(cards[current], 0);
    now.type.textContent = t(cards[current], 1);
  });

  focus(0);
}

/* ---------- "here": nav follows the section in view; the process stair follows the step ---------- */
const navLinks = new Map([...document.querySelectorAll(".nav a")].map((a) => [a.hash.slice(1), a]));
// A thin band across the middle of the viewport decides what is "here".
const watch = (els, fn) => {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && fn(e.target)), { rootMargin: "-45% 0px -50% 0px" });
  els.forEach((el) => io.observe(el));
};
watch(document.querySelectorAll("[data-nav]"), (s) => navLinks.forEach((a, id) => a.classList.toggle("is-here", id === s.id)));

const stairHere = document.querySelector(".stair__here");
const steps = [...document.querySelectorAll("[data-step]")];
if (stairHere && steps.length) {
  // Step i's dark cube sits on top of tower i: 20px right and 34.5px up per step.
  const place = (i) => {
    steps.forEach((s, k) => s.classList.toggle("is-here", k === i));
    hop(stairHere, 20 * i, -34.5 * i, 30);
  };
  place(0);
  watch(steps, (s) => place(Number(s.dataset.step)));
}

// Services: the row you point at takes the dark cube; "3D" holds it at rest.
const svc = [...document.querySelectorAll(".svc li")];
svc.forEach((li) => {
  li.addEventListener("pointerenter", () => svc.forEach((o) => o.classList.toggle("is-here", o === li)));
});
document.querySelector(".svc")?.addEventListener("pointerleave", () => svc.forEach((o) => o.classList.toggle("is-here", o.classList.contains("spice"))));

// Work photos rise into place once, the first time the grid scrolls in.
motionReady.then((m) => {
  if (!m) return;
  m.inView(".work", (el) => {
    m.animate(el.children, { opacity: [0.001, 1], y: [40, 0] }, { duration: 0.9, ease, delay: m.stagger(0.06) });
  }, { amount: 0.15 });
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
    status.textContent = document.documentElement.lang === "ro"
      ? "Mulțumim! Mesajul a ajuns, revenim cât de curând."
      : "Thank you! Your message is in, we’ll get back to you soon.";
    setTimeout(() => { form.reset(); button.disabled = false; status.textContent = ""; }, 4000);
  });
}

// Language last, so every listener above is registered: ?lang=en, then the saved choice.
let saved = new URLSearchParams(location.search).get("lang");
try { saved ||= localStorage.getItem("starthouse-lang"); } catch {}
if (saved === "en" || saved === "ro") setLang(saved);
