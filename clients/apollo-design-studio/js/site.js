// Shared, dependency-free behavior for every site: mobile nav + scroll reveal.
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".site-nav__toggle");
  const links = document.querySelector(".site-nav__links");
  if (toggle && links) {
    const focusableSelector = "a[href], button:not([disabled])";

    const closeMenu = ({ returnFocus = false } = {}) => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      if (returnFocus) toggle.focus();
    };

    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        // Move focus into the panel so keyboard/screen-reader users land
        // on its content instead of staying on a toggle that now sits
        // behind a full-screen overlay.
        links.querySelector(focusableSelector)?.focus();
      }
    });

    links.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => closeMenu())
    );

    links.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu({ returnFocus: true });
        return;
      }
      // Trap Tab/Shift+Tab inside the open panel — without this, focus
      // would escape into content sitting visually underneath it.
      if (event.key !== "Tab") return;
      const focusable = Array.from(links.querySelectorAll(focusableSelector));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
});
