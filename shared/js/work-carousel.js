// Work carousel on the homepage. Native scroll-snap does the swiping; this
// marks the centred card (.is-active-preview, styled in portfolio.css),
// wires the arrow buttons, centres a side card on click or keyboard focus
// instead of opening it, and makes the row loop. Without JS it's still a
// scrollable row of links.
document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;
  const track = root.querySelector(".work-carousel__track");
  const count = root.querySelector("[data-count]");
  const [prev, next] = root.querySelectorAll("[data-dir]");
  const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

  // Looping: a copy of the last card goes before the first and a copy of the
  // first after the last, so both ends have a neighbour. The copies are
  // decoration only: hidden from assistive tech and out of the tab order.
  const real = [...track.children];
  const n = real.length;
  const copy = (el) => {
    const c = el.cloneNode(true);
    c.setAttribute("aria-hidden", "true");
    c.tabIndex = -1;
    return c;
  };
  track.prepend(copy(real[n - 1]));
  track.append(copy(real[0]));
  const slides = [...track.children];
  const last = slides.length - 1;
  // A thumbnail still downloading would otherwise pop in under an already
  // focused card on a first visit; fade it in when it arrives instead.
  track.querySelectorAll("img").forEach((img) => {
    if (img.complete) return;
    img.style.opacity = 0;
    const show = () => { img.style.transition = "opacity 0.3s"; img.style.opacity = ""; };
    img.addEventListener("load", show, { once: true });
    img.addEventListener("error", show, { once: true });
  });
  // Each copy's twin is the real card it stands in for.
  const twin = (i) => (i === 0 ? n : i === last ? 1 : i);

  // current = the card in focus; target = where the carousel is heading, so
  // quick repeated arrow presses keep advancing before the scroll settles.
  let current = -1;
  let target = 1;

  const centreOf = (i) => slides[i].offsetLeft - (track.clientWidth - slides[i].offsetWidth) / 2;
  // moving = a scroll we started (arrows, clicks, keys) is still in flight.
  let moving = false;
  const go = (i, how = behavior) => {
    target = Math.max(0, Math.min(last, i));
    moving = how !== "instant";
    track.scrollTo({ left: centreOf(target), behavior: how });
    focusOn(target);
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

  // A copy and its real twin are always focused together, so jumping from
  // one to the other is invisible.
  const focusOn = (i) => {
    if (i === current) return;
    current = i;
    const t = twin(i);
    slides.forEach((s, k) => s.classList.toggle("is-active-preview", twin(k) === t));
    count.textContent = `${t} / ${n}`;
  };

  // Resting on a copy: jump to the real card without animating.
  const unloop = () => {
    const t = twin(current);
    if (t === current) return;
    track.scrollTo({ left: track.scrollLeft + slides[t].offsetLeft - slides[current].offsetLeft, behavior: "instant" });
    current = target = t;
  };

  const update = () => {
    target = nearest().i;
    focusOn(target);
    unloop();
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
  track.addEventListener("touchstart", () => { touching = true; moving = false; }, { passive: true });
  track.addEventListener("touchend", () => { touching = false; applyPending(); }, { passive: true });
  track.addEventListener("scrollsnapchanging", (e) => {
    if (moving) return;
    pending = e.snapTargetInline;
    if (!touching) applyPending();
  });
  // The visitor grabbing the carousel mid-animation hands control back to them.
  const release = () => (moving = false);
  track.addEventListener("pointerdown", release, { passive: true });
  track.addEventListener("wheel", release, { passive: true });

  let settle;
  let lastLeft = track.scrollLeft;
  track.addEventListener("scroll", () => {
    const moved = Math.abs(track.scrollLeft - lastLeft);
    lastLeft = track.scrollLeft;
    clearTimeout(settle);
    if (moving) { settle = setTimeout(() => { moving = false; update(); }, 250); return; }
    if (!predicts && !touching && moved < 6 && nearest().dist < 12) update();
    else settle = setTimeout(update, 80);
  }, { passive: true });
  track.addEventListener("scrollend", () => { clearTimeout(settle); moving = false; update(); });

  // The thumbnails are lazy so they don't cost anything up in the hero, but a
  // fast swipe outruns lazy loading and they pop in late. Start fetching them
  // all once the carousel is getting close to the screen.
  new IntersectionObserver((entries, io) => {
    if (!entries[0].isIntersecting) return;
    track.querySelectorAll("img[loading=lazy]").forEach((img) => (img.loading = "eager"));
    io.disconnect();
  }, { rootMargin: "800px 0px" }).observe(root);
  addEventListener("resize", () => go(target, "instant"));

  prev.addEventListener("click", () => go(target - 1));
  next.addEventListener("click", () => go(target + 1));

  // A blurred side card comes into focus first; only the centred one opens.
  // Whether a card was centred is decided at pointerdown: by click time the
  // press has already focused the link and scrolled it towards the middle,
  // so checking then would open cards that were blurred when clicked.
  // Keyboard activation (detail 0) opens directly: focusing it centred it.
  let pressedCentred = false;
  slides.forEach((s, i) => {
    s.addEventListener("pointerdown", () => (pressedCentred = twin(i) === twin(current)));
    s.addEventListener("click", (e) => {
      if (e.detail === 0 || pressedCentred) return;
      e.preventDefault();
      go(i);
    });
    if (twin(i) === i) s.addEventListener("focus", () => go(i));
  });

  // Arrow keys step through the real cards and wrap at the ends.
  track.addEventListener("keydown", (e) => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    slides[twin(twin(target) + d)].focus();
  });

  // Open on the first card, with the last one peeking in on its left.
  go(1, "instant");
});
