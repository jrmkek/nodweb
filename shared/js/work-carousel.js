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

  // Which card is nearest the middle, and how far off-centre it is (px).
  const nearest = () => {
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let dist = Infinity;
    slides.forEach((s, i) => {
      const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid);
      if (d < dist) { dist = d; best = i; }
    });
    return { i: best, dist };
  };

  const focusOn = (i) => {
    if (i === current) return;
    current = i;
    slides.forEach((s, n) => s.classList.toggle("is-active-preview", n === i));
    count.textContent = `${i + 1} / ${slides.length}`;
    prev.disabled = i === 0;
    next.disabled = i === slides.length - 1;
  };

  const update = () => {
    target = nearest().i;
    focusOn(target);
  };

  // Focus must not follow every frame (a fast swipe made each card flash
  // sharp and back to blurred as it flew past), but it also shouldn't wait
  // for the snap animation to finish, which felt laggy on phones. So:
  // 1. Where the browser reports the snap target it's heading for
  //    (scrollsnapchanging, Chromium), focus it the moment the finger lifts.
  // 2. Otherwise, focus as soon as a card is centred and the scroll has
  //    slowed right down, with a short timeout as the backstop.
  const predicts = "onscrollsnapchanging" in window;
  let touching = false;
  let pending = null;
  const applyPending = () => {
    const i = slides.indexOf(pending);
    if (i > -1) { target = i; focusOn(i); }
  };
  track.addEventListener("touchstart", () => (touching = true), { passive: true });
  track.addEventListener("touchend", () => { touching = false; applyPending(); }, { passive: true });
  track.addEventListener("scrollsnapchanging", (e) => {
    pending = e.snapTargetInline;
    if (!touching) applyPending();
  });

  let settle;
  let lastLeft = track.scrollLeft;
  track.addEventListener("scroll", () => {
    const moved = Math.abs(track.scrollLeft - lastLeft);
    lastLeft = track.scrollLeft;
    clearTimeout(settle);
    if (!predicts && !touching && moved < 6 && nearest().dist < 12) update();
    else settle = setTimeout(update, 80);
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

  // Open on the second card so there are blurred neighbours on both sides.
  const start = slides[1] ?? slides[0];
  track.scrollTo({ left: start.offsetLeft - (track.clientWidth - start.offsetWidth) / 2, behavior: "instant" });
  target = slides.indexOf(start);
  focusOn(target);
});
