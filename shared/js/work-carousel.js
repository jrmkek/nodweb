// Work carousel on the homepage. Native scroll-snap does the swiping; this
// only marks the centred card (.is-active-preview, styled in portfolio.css),
// wires the arrow buttons, and centres a side card on click or keyboard
// focus instead of opening it. Without JS it's still a scrollable row of links.
document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;
  const track = root.querySelector(".work-carousel__track");
  const slides = [...track.children];
  const count = root.querySelector("[data-count]");
  const [prev, next] = root.querySelectorAll("[data-dir]");
  const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  // current = the card in focus; target = where the carousel is heading, so
  // quick repeated arrow presses keep advancing before the scroll settles.
  let current = -1;
  let target = 0;

  const go = (i) => {
    target = Math.max(0, Math.min(slides.length - 1, i));
    const s = slides[target];
    track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2, behavior });
  };

  const update = () => {
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    slides.forEach((s, i) => {
      const d = (el) => Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
      if (d(s) < d(slides[best])) best = i;
    });
    target = best;
    if (best === current) return;
    current = best;
    slides.forEach((s, i) => s.classList.toggle("is-active-preview", i === best));
    count.textContent = `${best + 1} / ${slides.length}`;
    prev.disabled = best === 0;
    next.disabled = best === slides.length - 1;
  };

  // Only move focus once the scroll comes to rest. Updating every frame made
  // each card flash sharp and back to blurred as a fast swipe flew past it.
  let settle;
  track.addEventListener("scroll", () => {
    clearTimeout(settle);
    settle = setTimeout(update, 120);
  }, { passive: true });
  track.addEventListener("scrollend", () => { clearTimeout(settle); update(); });

  // The thumbnails are lazy so they don't cost anything up in the hero, but a
  // fast swipe outruns lazy loading and they pop in late. Start fetching them
  // all once the carousel is getting close to the screen.
  new IntersectionObserver((entries, io) => {
    if (!entries[0].isIntersecting) return;
    track.querySelectorAll("img[loading=lazy]").forEach((img) => (img.loading = "eager"));
    io.disconnect();
  }, { rootMargin: "800px 0px" }).observe(root);
  addEventListener("resize", () => go(target));

  prev.addEventListener("click", () => go(target - 1));
  next.addEventListener("click", () => go(target + 1));

  slides.forEach((s, i) => {
    // A blurred side card comes into focus first; the centred one opens.
    s.addEventListener("click", (e) => {
      if (i !== current) { e.preventDefault(); go(i); }
    });
    s.addEventListener("focus", () => go(i));
  });

  track.addEventListener("keydown", (e) => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (d && slides[target + d]) { e.preventDefault(); slides[target + d].focus(); }
  });

  update();
});
