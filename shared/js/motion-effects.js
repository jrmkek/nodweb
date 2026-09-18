// Crazy micro-interactions for NodWeb's own homepage, powered by Motion —
// the same spring-physics engine behind React's "framer-motion", published
// as a dependency-free vanilla build. This project has no bundler/React
// (see README), so the React-only "framer-motion" package installed via npm
// can't actually run in a plain <script>; Motion's DOM API gives the same
// engine without one, loaded straight from a CDN the same way model-viewer
// is loaded for the architecture template.
//
// Progressive enhancement: every effect here is additive. If this module
// fails to load (offline, blocked CDN) or the user asks for reduced motion,
// the page falls back to the plain CSS keyframes/transitions already in
// portfolio.css and base.css — nothing here is required for the page to
// look and work correctly.
import { animate, inView } from "https://cdn.jsdelivr.net/npm/motion@11/+esm";

const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasFinePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const springy = { type: "spring", stiffness: 260, damping: 20 };

if (!prefersReducedMotion) {
  // Tell the stylesheet we're taking over from the CSS-only animations so
  // they don't run at the same time as the JS ones and fight for the same
  // properties.
  document.body.classList.add("js-motion-ready");

  // ---- Hero entrance: spring cascade instead of the CSS keyframe ----
  const heroItems = document.querySelectorAll(".hero .load-stagger > *");
  if (heroItems.length) {
    animate(
      heroItems,
      {
        opacity: [0, 1],
        transform: ["translateY(28px) scale(0.96)", "translateY(0px) scale(1)"],
      },
      { delay: (i) => 0.08 + i * 0.14, duration: 0.9, easing: [0.16, 1, 0.3, 1] }
    );
  }

  // ---- Breathing hero glows ----
  document.querySelectorAll(".hero-glow").forEach((glow, i) => {
    animate(
      glow,
      { transform: ["scale(1)", "scale(1.18)", "scale(1)"], opacity: [0.7, 1, 0.7] },
      { duration: 7 + i * 1.5, repeat: Infinity, easing: "ease-in-out" }
    );
  });

  // ---- Animated gradient text ----
  document.querySelectorAll(".gradient-text").forEach((el) => {
    el.style.backgroundSize = "200% 100%";
    animate(
      el,
      { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] },
      { duration: 6, repeat: Infinity, easing: "ease-in-out" }
    );
  });

  // ---- Spring pop-in for every scroll-reveal element (replaces the plain
  // fade from base.css's .reveal/.is-visible with a bouncier entrance) ----
  document.querySelectorAll(".reveal").forEach((el) => {
    const stop = inView(
      el,
      () => {
        animate(
          el,
          {
            opacity: [0, 1],
            transform: [
              "translateY(24px) rotate(-1.2deg) scale(0.96)",
              "translateY(0px) rotate(0deg) scale(1)",
            ],
          },
          { duration: 0.7, easing: [0.34, 1.56, 0.64, 1] }
        );
        stop();
      },
      { margin: "-10% 0px -10% 0px" }
    );
  });

  if (hasFinePointer) {
    // ---- Magnetic buttons ----
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("pointermove", (event) => {
        const rect = btn.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.3;
        animate(btn, { transform: `translate(${x}px, ${y}px)` }, { duration: 0.3, easing: [0.16, 1, 0.3, 1] });
      });
      btn.addEventListener("pointerleave", () => {
        animate(btn, { transform: "translate(0px, 0px)" }, springy);
      });
    });

    // ---- Tilt on work cards ----
    document.querySelectorAll(".card--link").forEach((card) => {
      card.style.perspective = "800px";
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        animate(
          card,
          { transform: `rotateY(${px * 10}deg) rotateX(${py * -10}deg) translateY(-4px) scale(1.02)` },
          { duration: 0.25, easing: [0.16, 1, 0.3, 1] }
        );
      });
      card.addEventListener("pointerleave", () => {
        animate(card, { transform: "rotateY(0deg) rotateX(0deg) translateY(0px) scale(1)" }, springy);
      });
    });

    // ---- Nav brand wiggle ----
    const brand = document.querySelector(".site-nav__brand");
    if (brand) {
      brand.addEventListener("pointerenter", () => {
        animate(
          brand,
          { transform: ["rotate(0deg)", "rotate(-6deg)", "rotate(4deg)", "rotate(0deg)"] },
          { duration: 0.5, easing: "ease-in-out" }
        );
      });
    }
  } else {
    // ---- Touch equivalent of the hover "browser window" preview: the
    // work card nearest the middle of the screen gets the same spotlight
    // (chrome bar + open icon + lift) as it scrolls through, since a phone
    // has no hover to trigger it with. ----
    document.querySelectorAll("#work .card--link").forEach((card) => {
      inView(card, () => {
        card.classList.add("is-active-preview");
        return () => card.classList.remove("is-active-preview");
      }, { margin: "-40% 0px -40% 0px" });
    });
  }
}
