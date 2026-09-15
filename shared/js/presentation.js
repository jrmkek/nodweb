// Bespoke behavior for presentation.html only: header scroll state, the
// matrix-rain hero canvas, and the GSAP-pinned process panel stack.
// Mobile nav (open/close/focus-trap) and scroll-reveal are handled by
// site.js, which this page also loads unchanged.
document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Header: transparent -> solid on scroll ----------
  const header = document.querySelector(".site-nav");
  if (header) {
    const onScroll = () => {
      header.dataset.scrolled = window.scrollY > 40 ? "true" : "false";
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---------- Hero matrix-rain canvas ----------
  const canvas = document.querySelector(".matrix-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const chars = "01アイウエオカキクケコ{}[]<>/*+-=;:.,#$%&";
    const fontSize = 14;
    let columns = 0;
    let drops = [];
    let running = false;
    let rafId = null;
    let last = 0;

    const accent = getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim() || "#d4ff4f";
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--color-bg").trim() || "#0b0b0c";
    const [bgR, bgG, bgB] = hexToRgb(bg);

    function hexToRgb(hex) {
      const m = hex.replace("#", "").match(/.{1,2}/g) || ["0b", "0b", "0c"];
      return m.map((h) => parseInt(h, 16));
    }

    function resize() {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      columns = Math.max(1, Math.floor(canvas.offsetWidth / fontSize));
      drops = new Array(columns).fill(0).map(() => Math.random() * -100);
    }

    function draw() {
      ctx.fillStyle = `rgba(${bgR}, ${bgG}, ${bgB}, 0.08)`;
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < columns; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.8;
        ctx.fillText(char, x, y);
        ctx.globalAlpha = 1;
        if (y > canvas.offsetHeight && Math.random() > 0.98) drops[i] = 0;
        drops[i] += 0.3;
      }
    }

    function loop(t) {
      if (!running) return;
      if (t - last > 80) {
        draw();
        last = t;
      }
      rafId = requestAnimationFrame(loop);
    }

    function start() {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    }

    window.addEventListener("resize", resize);
    resize();

    const toggle = document.querySelector(".hero__toggle");
    const setToggleLabel = (isRunning) => {
      if (!toggle) return;
      toggle.textContent = isRunning ? "❙❙" : "▶";
      toggle.setAttribute("aria-label", isRunning ? "Pause background animation" : "Play background animation");
    };

    if (prefersReducedMotion) {
      // Draw one static frame instead of looping.
      draw();
      setToggleLabel(false);
    } else {
      start();
      setToggleLabel(true);
      // Pause off-screen to save battery/CPU.
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(
          (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
          { threshold: 0 }
        ).observe(canvas);
      }
    }

    toggle?.addEventListener("click", () => {
      if (running) {
        stop();
        setToggleLabel(false);
      } else {
        start();
        setToggleLabel(true);
      }
    });
  }

  // ---------- Pinned process panel stack ----------
  const stack = document.getElementById("panel-stack");
  if (stack) {
    const panels = Array.from(stack.querySelectorAll(".panel"));
    const total = panels.length;
    const fill = stack.querySelector(".panel-stack__bar-fill");
    const counter = stack.querySelector(".panel-stack__counter");
    const words = Array.from(stack.querySelectorAll(".panel__word-stack .w"));

    const setActive = (index) => {
      panels.forEach((p, i) => p.classList.toggle("is-active", i === index));
      words.forEach((w, i) => w.classList.toggle("is-current", i === index));
      if (counter) counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
      if (fill) fill.style.width = `${(index / Math.max(1, total - 1)) * 100}%`;
    };

    const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

    if (hasGsap && !prefersReducedMotion) {
      gsap.registerPlugin(ScrollTrigger);
      setActive(0);
      ScrollTrigger.create({
        trigger: stack,
        start: "top top",
        end: () => `+=${total * 100}%`,
        pin: true,
        snap: total > 1 ? 1 / (total - 1) : undefined,
        onUpdate: (self) => {
          const index = Math.round(self.progress * (total - 1));
          setActive(index);
        },
      });
    } else {
      // No GSAP (CDN blocked/offline) or reduced-motion: fall back to a
      // normally-scrolling stack of full sections, all content reachable.
      stack.classList.add("no-scrolltrigger");
      panels.forEach((p) => p.classList.add("is-active"));
      if (words.length) words[0].classList.add("is-current");
    }
  }
});
