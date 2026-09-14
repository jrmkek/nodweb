// Inline validation: catch mistakes before submit, show exactly which field
// needs fixing, and clear the error the moment the visitor corrects it.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;

  const validateField = (field) => {
    const wrapper = field.closest(".field");
    if (!wrapper) return true;
    const valid = field.checkValidity();
    wrapper.classList.toggle("field--invalid", !valid);
    return valid;
  };

  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.closest(".field")?.classList.contains("field--invalid")) {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = Array.from(form.querySelectorAll("input, textarea"));
    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) {
      fields.find((f) => !f.checkValidity())?.focus();
      return;
    }

    // No backend wired up yet — replace this with a real submit
    // (e.g. POST to Formspree, Netlify Forms, or your own endpoint).
    const button = form.querySelector("button[type=submit]");
    const original = button.textContent;
    button.textContent = "Message sent";
    button.disabled = true;
    setTimeout(() => {
      button.textContent = original;
      button.disabled = false;
      form.reset();
    }, 2500);
  });
});
