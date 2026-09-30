// Live installment calculator on the pricing page. Display only: it mirrors
// quote() in functions/api/installments.js, which re-prices every request.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("installments-form");
  const out = document.getElementById("installments-result");
  if (!form || !out) return;
  const surcharge = Number(form.dataset.surcharge);
  // Site convention: "€61.90" in English, "61,90€" in Romanian.
  const ro = document.documentElement.lang === "ro";
  const num = new Intl.NumberFormat(ro ? "ro-RO" : "en-IE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const eur = { format: (n) => (ro ? `${num.format(n)}€` : `€${num.format(n)}`) };

  const update = () => {
    const price = Number(form.plan.selectedOptions[0].dataset.price);
    const months = Number(form.months.value);
    const monthly = Math.ceil(Math.round(price * 100 * (1 + surcharge)) / months);
    out.textContent = `${months} × ${eur.format(monthly / 100)} = ${eur.format((monthly * months) / 100)}`;
  };
  form.addEventListener("change", update);
  update();

  // "or 12 × …" links under each package preselect that package.
  document.querySelectorAll("[data-plan-link]").forEach((link) =>
    link.addEventListener("click", () => {
      form.plan.value = link.dataset.planLink;
      form.months.value = "12";
      update();
    }),
  );
});
