// Bizoo Studio: the fan deck (held chip recolours the page), project filter
// and dialog, before/after, the optional 3D viewer, RO/EN and the demo form.
// CSS does the resting motion (a spring written as linear()); Motion
// (motion.dev) adds the authored moments: the deck opening, cards and steps
// settling in, the held project's name swapping.

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;
let motion = null;
const motionReady = reduced ? Promise.resolve(null)
  : import("https://cdn.jsdelivr.net/npm/motion@11/+esm").then((m) => (motion = m), () => null);
const ease = [0.16, 1, 0.3, 1];
const play = (el, keyframes, options = {}) => motion?.animate(el, keyframes, { duration: 0.6, ease, ...options });
const lang = () => root.lang;

/* ---------- language: ?lang=en is the shareable address of the English page ---------- */
const langLinks = document.querySelectorAll("[data-lang]");
const langListeners = [];
const setLang = (l) => {
  root.lang = l;
  langLinks.forEach((a) => a.setAttribute("aria-current", String(a.dataset.lang === l)));
  const key = l === "ro" ? "Ro" : "En";
  document.querySelectorAll("[data-aria-ro]").forEach((el) => el.setAttribute("aria-label", el.dataset[`aria${key}`]));
  document.querySelectorAll("[data-ph-ro]").forEach((el) => (el.placeholder = el.dataset[`ph${key}`]));
  document.querySelectorAll("option[data-ro]").forEach((o) => (o.textContent = o.dataset[l]));
  document.querySelectorAll("img[data-alt-en]").forEach((img) => {
    img.dataset.altRo ??= img.alt;
    img.alt = l === "ro" ? img.dataset.altRo : img.dataset.altEn;
  });
  document.title = document.querySelector("title").dataset[l];
  langListeners.forEach((fn) => fn(l));
};
langLinks.forEach((a) => a.addEventListener("click", (e) => {
  e.preventDefault();
  setLang(a.dataset.lang);
  const url = new URL(location.href);
  url.searchParams.set("lang", a.dataset.lang);
  history.replaceState(null, "", url);
}));

/* ---------- projects, read once from the cards ---------- */
const cards = [...document.querySelectorAll(".pcard[data-p]")];
const project = Object.fromEntries(cards.map((c) => [c.dataset.p, c]));
const text = (el, sel) => el.querySelector(`${sel}[lang="${lang()}"]`)?.textContent ?? "";
const metaOf = (card) => text(card, ".pcard__meta span");

/* ---------- the fan deck ----------
   Each chip knows its place in the deck (--i); CSS turns that into the fan's
   angle and slides the held chip out. Holding a chip sets data-project on <html>, which
   moves --chip (the only accent) and swaps the room behind the deck. */
const fan = document.querySelector(".fan");
const chips = [...fan.querySelectorAll(".chip")];
const bgs = [...document.querySelectorAll(".hero__bg img")];
const heldName = document.querySelector('[data-held="name"]');
const heldMeta = document.querySelectorAll('[data-held="meta"]');
const hold = (p, animate = true) => {
  const i = chips.findIndex((c) => c.dataset.p === p);
  chips.forEach((c, k) => c.setAttribute("aria-pressed", String(k === i)));
  root.dataset.project = p;
  bgs.forEach((img) => img.classList.toggle("is-on", img.dataset.for === p));
  const card = project[p];
  heldName.textContent = card.querySelector("h3").textContent;
  heldMeta.forEach((el) => (el.textContent = card.querySelector(`.pcard__meta [lang="${el.lang}"]`).textContent));
  if (animate) play([heldName, ...heldMeta], { opacity: [0, 1], y: [8, 0] }, { duration: 0.45 });
};
chips.forEach((c, k) => {
  c.style.setProperty("--i", k);
  c.setAttribute("aria-label", project[c.dataset.p].querySelector("h3").textContent);
  c.addEventListener("click", () => hold(c.dataset.p));
});
fan.addEventListener("keydown", (e) => {
  const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
  if (!d) return;
  e.preventDefault();
  const i = chips.findIndex((c) => c.getAttribute("aria-pressed") === "true");
  const next = chips[(i + d + chips.length) % chips.length];
  hold(next.dataset.p);
  next.focus();
});
hold("c3", false);
// The deck opens once the first frame is painted: the chips spring from a
// closed stack into the fan (CSS spring; the closed state has no transition).
requestAnimationFrame(() => requestAnimationFrame(() => fan.classList.remove("is-closed")));

/* ---------- filter ---------- */
const filters = [...document.querySelectorAll("[data-filter]")];
filters.forEach((b) => b.addEventListener("click", () => {
  const f = b.dataset.filter;
  filters.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
  const apply = () => cards.forEach((c) => (c.hidden = f !== "all" && c.dataset.kind !== f));
  // A view transition slides the survivors into their new cells; without it they just reflow.
  if (document.startViewTransition && !reduced) document.startViewTransition(apply);
  else apply();
}));

/* ---------- project dialog ---------- */
const dlg = document.querySelector("dialog.proj");
const gal = dlg.querySelector(".proj__gal");
const count = dlg.querySelector(".proj__count");
const slot = (name) => dlg.querySelector(`[data-slot="${name}"]`);
let openCard = null;
const fill = (card) => {
  dlg.querySelector("h2").textContent = card.querySelector("h3").textContent;
  slot("meta").textContent = metaOf(card);
  slot("desc").textContent = text(card, "[data-desc]");
  slot("pal").innerHTML = card.querySelector(".pcard__strip").innerHTML;
};
const where = () => Math.round(gal.scrollLeft / gal.clientWidth);
const tally = () => (count.textContent = `${where() + 1} / ${gal.children.length}`);
const openProject = (card) => {
  openCard = card;
  const name = card.querySelector("h3").textContent;
  gal.innerHTML = card.dataset.imgs.split(",").map((s, i) =>
    `<img src="./assets/${s}.webp" alt="${name}, ${lang() === "ro" ? "imagine" : "image"} ${i + 1}" ${i ? 'loading="lazy"' : ""} />`).join("");
  fill(card);
  root.dataset.project = card.dataset.p; // the dialog holds this project's chip too
  dlg.showModal();
  gal.scrollLeft = 0;
  tally();
  play(dlg, { opacity: [0, 1], y: [24, 0] }, { duration: 0.5 });
};
cards.forEach((c) => c.addEventListener("click", () => openProject(c)));
gal.addEventListener("scroll", tally, { passive: true });
dlg.querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => {
  const n = gal.children.length;
  gal.scrollTo({ left: ((where() + Number(b.dataset.step) + n) % n) * gal.clientWidth, behavior: reduced ? "auto" : "smooth" });
}));
gal.addEventListener("keydown", (e) => {
  const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
  if (d) { e.preventDefault(); dlg.querySelector(`[data-step="${d}"]`).click(); }
});
dlg.querySelector("[data-close]").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", (e) => e.target === dlg && dlg.close()); // click on the backdrop
dlg.addEventListener("close", () => {
  root.dataset.project = chips.find((c) => c.getAttribute("aria-pressed") === "true").dataset.p;
  openCard?.focus();
});
langListeners.push(() => dlg.open && fill(openCard));

/* ---------- before / after: a native range drives the clip ---------- */
const ba = document.querySelector(".ba");
const range = ba.querySelector("input");
range.addEventListener("input", () => ba.style.setProperty("--x", `${range.value}%`));

/* ---------- 3D viewer: model-viewer (~1 MB) loads only when the section is near ---------- */
const viewer = document.querySelector(".viewer");
new IntersectionObserver((entries, io) => {
  if (!entries[0].isIntersecting) return;
  io.disconnect();
  import("https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js").then(() => {
    const mv = document.createElement("model-viewer");
    for (const [k, v] of Object.entries({
      src: viewer.dataset.model, "camera-controls": "", "disable-zoom": "", "interaction-prompt": "none",
      "camera-orbit": "35deg 62deg 105%", "rotation-per-second": "14deg", "environment-image": "legacy",
      "shadow-intensity": "1", "shadow-softness": "0.6", exposure: "0.7", "touch-action": "pan-y",
      alt: lang() === "ro" ? "Machetă 3D demonstrativă" : "Demonstration 3D massing model",
    })) mv.setAttribute(k, v);
    if (!reduced) mv.setAttribute("auto-rotate", "");
    mv.addEventListener("load", () => viewer.classList.add("is-ready"));
    viewer.prepend(mv);
  }).catch(() => viewer.querySelector(".viewer__wait").replaceChildren(lang() === "ro" ? "Modelul 3D nu s-a putut încărca." : "The 3D model could not load."));
}, { rootMargin: "300px" }).observe(viewer);

/* ---------- nav follows the section in view ---------- */
const navLinks = new Map([...document.querySelectorAll(".nav a")].map((a) => [a.hash.slice(1), a]));
const sectionWatch = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting &&
  navLinks.forEach((a, id) => a.classList.toggle("is-here", id === e.target.id))), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("[data-nav]").forEach((s) => sectionWatch.observe(s));

/* ---------- authored entrances: once, from an already-visible default ---------- */
motionReady.then((m) => {
  if (!m) return;
  m.inView(".grid", ({ target: el }) => {
    m.animate([...el.children], { opacity: [0.001, 1], y: [36, 0] }, { duration: 0.9, ease, delay: m.stagger(0.07) });
  }, { amount: 0.12 });
  // The process strip fans in like chips pulled from the deck, light to deep.
  m.inView(".steps", ({ target: el }) => {
    m.animate([...el.children], { opacity: [0.001, 1], rotate: [-4, 0], y: [28, 0] }, { duration: 0.8, ease, delay: m.stagger(0.09) });
  }, { amount: 0.25 });
  m.inView(".ba", () => {
    // One nudge of the handle so the visitor sees it moves.
    m.animate(50, [50, 38, 62, 50], { duration: 1.6, ease: "easeInOut", onUpdate: (v) => {
      range.value = v; ba.style.setProperty("--x", `${v}%`);
    } });
  }, { amount: 0.6 });
});

/* ---------- contact form (demo: validates, then confirms without sending) ---------- */
const form = document.querySelector(".form");
const status = form.querySelector(".form__status");
const fields = [...form.querySelectorAll("[required]")];
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
    ? "Mulțumim! Cererea a ajuns, revenim cât de curând cu o propunere de dată."
    : "Thank you! Your request is in, we’ll come back soon with a date.";
  setTimeout(() => { form.reset(); button.disabled = false; status.textContent = ""; }, 4000);
});

// Language last, so every listener above is registered.
const asked = new URLSearchParams(location.search).get("lang");
if (asked === "en" || asked === "ro") setLang(asked);
