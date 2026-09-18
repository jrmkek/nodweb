// Apollo Design — Motion One (motion.dev) animation sequence.
// Loaded from the CDN build matching the version pinned in package.json,
// so it works with no bundler (this project has no build step). If the
// import fails (offline demo, CDN blocked), every [data-animate] element
// is already visible per apollo.css and nothing breaks.

if (!document.documentElement.classList.contains('reduced-motion')) {
  try {
    const { animate, stagger, inView, scroll } = await import('https://cdn.jsdelivr.net/npm/motion@13.4.0/+esm');

    const EASE_OUT = [0.16, 1, 0.3, 1];

    // ---- Hero load sequence -------------------------------------------
    animate('.hero__glyph', { opacity: [0, 1], scale: [0.9, 1], rotate: [-4, 0] }, { duration: 0.7, easing: EASE_OUT });
    animate('.hero__triad span', { opacity: [0, 1], y: [28, 0] }, { duration: 0.6, delay: stagger(0.09, { startDelay: 0.15 }), easing: EASE_OUT });
    animate('.hero__lede', { opacity: [0, 1], y: [14, 0] }, { duration: 0.5, delay: 0.55, easing: EASE_OUT });
    animate('.hero__actions', { opacity: [0, 1], y: [14, 0] }, { duration: 0.5, delay: 0.65, easing: EASE_OUT });

    // ---- Scroll-triggered reveals ---------------------------------------
    const reveal = (selector, keyframes, options = {}) => {
      inView(selector, (element) => {
        animate(element, keyframes, { duration: 0.6, easing: EASE_OUT, ...options });
      }, { margin: '0px 0px -10% 0px' });
    };

    reveal('.panel', { opacity: [0, 1], y: [24, 0] }, { delay: stagger(0.12) });
    reveal('.statement__glyph', { opacity: [0, 1], scale: [0.92, 1] });
    reveal('.statement h2', { opacity: [0, 1], y: [20, 0] }, { delay: 0.1 });
    reveal('.statement p', { opacity: [0, 1], y: [20, 0] }, { delay: 0.2 });
    reveal('.section-head', { opacity: [0, 1], y: [20, 0] });
    reveal('.render-tile', { opacity: [0, 1], y: [36, 0], scale: [0.96, 1] }, { delay: stagger(0.08) });
    reveal('.project-row', { opacity: [0, 1], x: [-24, 0] }, { delay: stagger(0.08) });
    reveal('.contact__lede', { opacity: [0, 1], y: [16, 0] });
    reveal('.contact__meta', { opacity: [0, 1], y: [16, 0] }, { delay: 0.1 });
    reveal('form', { opacity: [0, 1], y: [16, 0] }, { delay: 0.1 });
    // The contact heading isn't scroll-reveal-worthy on its own — pair it with the lede.
    document.querySelectorAll('.contact h2[data-animate]').forEach((el) => {
      inView(el, () => animate(el, { opacity: [0, 1], y: [16, 0] }, { duration: 0.6, easing: EASE_OUT }), { margin: '0px 0px -10% 0px' });
    });

    // ---- Scroll-linked parallax on the brand statement's glyph -----------
    const statement = document.querySelector('.statement');
    const statementGlyph = document.querySelector('.statement__glyph');
    if (statement && statementGlyph) {
      scroll(
        animate(statementGlyph, { rotate: [0, 10], y: [0, -30] }, { easing: 'linear' }),
        { target: statement, offset: ['start end', 'end start'] }
      );
    }

    // ---- Render tile hover: a small architectural "lift" -----------------
    document.querySelectorAll('.render-tile, .project-row__media').forEach((el) => {
      const target = el.querySelector('svg, img') || el;
      el.addEventListener('mouseenter', () => animate(target, { scale: 1.045 }, { duration: 0.35, easing: EASE_OUT }));
      el.addEventListener('mouseleave', () => animate(target, { scale: 1 }, { duration: 0.35, easing: EASE_OUT }));
    });

    // ---- Button / link tactile press feedback -----------------------------
    document.querySelectorAll('.btn, .link-underline').forEach((el) => {
      el.addEventListener('pointerdown', () => animate(el, { scale: 0.96 }, { duration: 0.15, easing: EASE_OUT }));
      el.addEventListener('pointerup', () => animate(el, { scale: 1 }, { duration: 0.25, easing: EASE_OUT }));
      el.addEventListener('pointerleave', () => animate(el, { scale: 1 }, { duration: 0.25, easing: EASE_OUT }));
    });

    // ---- Safety net: a fast fling, a smooth anchor-jump, or a tall section
    // can carry an element past the viewport between two rendered frames,
    // so IntersectionObserver never reports it as entering. Anything left
    // at opacity 0 but already on screen (or scrolled past) gets a plain
    // fade-in instead of staying invisible forever.
    let sweepQueued = false;
    const sweep = () => {
      sweepQueued = false;
      document.querySelectorAll('[data-animate]').forEach((el) => {
        if (getComputedStyle(el).opacity !== '0') return;
        if (el.getBoundingClientRect().top < window.innerHeight * 1.3) {
          animate(el, { opacity: [0, 1] }, { duration: 0.4, easing: EASE_OUT });
        }
      });
    };
    const queueSweep = () => {
      if (sweepQueued) return;
      sweepQueued = true;
      requestAnimationFrame(sweep);
    };
    window.addEventListener('scroll', queueSweep, { passive: true });
    window.addEventListener('resize', queueSweep);
    setTimeout(sweep, 1200);
  } catch (error) {
    // CDN unreachable or import failed: reveal everything immediately
    // rather than leaving [data-animate] elements stuck at opacity 0.
    document.querySelectorAll('[data-animate]').forEach((el) => { el.style.opacity = '1'; });
    console.warn('Apollo motion: animation library failed to load, showing static page.', error);
  }
}
