// Inline validation: catch mistakes before submit, show exactly which field
// needs fixing, and clear the error the moment the visitor corrects it.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;

  // Announce submit-button status changes ("Sending…", "Message sent", …)
  // to screen readers, since updating textContent alone is silent.
  form.querySelector("button[type=submit]")?.setAttribute("aria-live", "polite");

  const validateField = (field) => {
    const wrapper = field.closest(".field");
    if (!wrapper) return true;
    const valid = field.checkValidity();
    wrapper.classList.toggle("field--invalid", !valid);
    field.setAttribute("aria-invalid", String(!valid));
    return valid;
  };

  form.querySelectorAll("input, textarea, select").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.closest(".field")?.classList.contains("field--invalid")) {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = Array.from(form.querySelectorAll("input, textarea, select"));
    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) {
      fields.find((f) => !f.checkValidity())?.focus();
      return;
    }

    const button = form.querySelector("button[type=submit]");
    const original = button.textContent;
    const ro = document.documentElement.lang === "ro";

    // Forms with an `action` post there (the pricing page's installment
    // form → /api/installments); forms with only a `name` submit via
    // Web3Forms (api.web3forms.com). Everything else (the demo templates)
    // has no backend to send to, so it just simulates success for preview.
    const endpoint = form.getAttribute("action") || (form.name && "https://api.web3forms.com/submit");
    if (endpoint) {
      button.disabled = true;
      button.textContent = ro ? "Se trimite…" : "Sending…";
      fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      })
        .then((response) => response.json().then((data) => ({ ok: response.ok && data.success, data })))
        .then(({ ok, data }) => {
          if (!ok) throw new Error(data?.message || "Form submission failed");
        })
        .then(() => {
          button.textContent = ro ? "Mesaj trimis" : "Message sent";
          form.reset();
          form.dispatchEvent(new Event("change"));
          setTimeout(() => {
            button.textContent = original;
            button.disabled = false;
          }, 3000);
        })
        .catch(() => {
          button.textContent = ro ? "Nu s-a trimis, încearcă din nou" : "Couldn't send, try again";
          button.disabled = false;
          setTimeout(() => {
            button.textContent = original;
          }, 3000);
        });
      return;
    }

    button.textContent = "Message sent";
    button.disabled = true;
    setTimeout(() => {
      button.textContent = original;
      button.disabled = false;
      form.reset();
    }, 2500);
  });
});
