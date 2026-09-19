// Persistent "back to NodWeb" pill for the example pages. Self-injecting:
//   <script type="module" src="…/back-home.js" data-href="…" data-label="…"></script>
// Motion drives three things: a springy entrance, a magnetic pull toward the
// cursor, and a circular wipe out of the pill on click before navigating.
// Without JS/Motion (or with reduced motion) it's still a plain fixed link.
// Dynamic import so a blocked CDN leaves the plain link instead of no link.
const animate = (await import("https://cdn.jsdelivr.net/npm/motion@11/+esm").catch(() => null))?.animate;

// currentScript is null in modules, so find our own tag.
const { href = "/", label = "Back to NodWeb" } =
  document.querySelector("script[data-href][src*='back-home']")?.dataset ?? {};

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

document.head.insertAdjacentHTML("beforeend", `<style>
.bh{position:fixed;left:16px;bottom:16px;z-index:9999;display:flex;align-items:center;gap:10px;
  padding:6px 18px 6px 6px;border-radius:999px;background:#17171a;color:#fff;text-decoration:none;
  font:600 14px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.01em;
  box-shadow:0 8px 24px rgba(0,0,0,.28),0 0 0 1px rgba(255,255,255,.12) inset}
.bh:focus-visible{outline:3px solid #fff;outline-offset:3px}
.bh-dot{width:34px;height:34px;border-radius:50%;background:#b5502f;display:grid;place-items:center;overflow:hidden}
.bh-dot svg{width:18px;height:18px}
.bh-txt{white-space:nowrap}
.bh-wipe{position:fixed;z-index:10000;border-radius:50%;background:#17171a;pointer-events:none}
@media(max-width:520px){.bh-txt{display:none}.bh{padding:6px}}
</style>`);

const a = document.createElement("a");
a.className = "bh";
a.href = href;
a.setAttribute("aria-label", label);
a.innerHTML = `<span class="bh-dot"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></span><span class="bh-txt">${label}</span>`;
document.body.append(a);

if (!reduced && animate) {
  const dot = a.querySelector(".bh-dot svg");
  animate(a, { opacity: [0, 1], transform: ["translateY(40px) scale(.7)", "translateY(0) scale(1)"] },
    { delay: 0.8, type: "spring", stiffness: 220, damping: 16 });

  if (fine) {
    // Magnetic: drift up to ~8px toward the cursor while it's near, snap back on leave.
    a.addEventListener("pointermove", (e) => {
      const r = a.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / r.width * 16;
      const y = (e.clientY - r.top - r.height / 2) / r.height * 16;
      animate(a, { transform: `translate(${x}px,${y}px) scale(1.05)` }, { duration: 0.2 });
      animate(dot, { transform: `translateX(${-4 + x / 2}px)` }, { duration: 0.2 });
    });
    a.addEventListener("pointerleave", () => {
      animate(a, { transform: "translate(0,0) scale(1)" }, { type: "spring", stiffness: 300, damping: 12 });
      animate(dot, { transform: "translateX(0px)" }, { type: "spring", stiffness: 300, damping: 12 });
    });
  }

  // Circular wipe from the pill, then navigate. Modified clicks fall through.
  a.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    e.preventDefault();
    const r = a.getBoundingClientRect();
    const size = Math.hypot(innerWidth, innerHeight) * 2;
    const w = document.createElement("div");
    w.className = "bh-wipe";
    Object.assign(w.style, { width: size + "px", height: size + "px",
      left: r.left + 23 - size / 2 + "px", top: r.top + r.height / 2 - size / 2 + "px" });
    document.body.append(w);
    animate(w, { transform: ["scale(0)", "scale(1)"] }, { duration: 0.55, easing: [0.7, 0, 0.2, 1] })
      .finished.then(() => (location.href = href));
    // bfcache restore (back button) would otherwise show the wipe forever
    addEventListener("pageshow", () => w.remove(), { once: true });
  });
}
