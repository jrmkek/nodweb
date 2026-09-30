// Installment ("plată în rate") requests from the pricing page.
// Cloudflare Pages Function, served at /api/installments.
//
// POST  validates the request, prices it server-side (the page's numbers
//       are display only), stores it in KV and emails a notification.
// GET   lists stored requests for the studio: Authorization: Bearer ADMIN_TOKEN.
//
// Configure in Pages → Settings → Functions / Variables:
//   INSTALLMENTS                 KV namespace binding, where requests are kept
//   ADMIN_TOKEN                  secret, required for GET
//   RESEND_API_KEY, NOTIFY_EMAIL optional, email notification via resend.com
// At least one of KV or email must be set, otherwise POST answers 503
// rather than silently dropping the lead.

// Keep in sync with the data-price values on /pricing and /ro/pricing.
export const PLANS = { starter: 350, website: 600 };
export const TERMS = [3, 6, 12];
export const SURCHARGE = 0.24;

// Monthly amount is rounded up to the cent, so the total is exactly
// months × monthly, the numbers the client sees always add up.
export function quote(plan, months) {
  const price = PLANS[plan];
  if (!price || !TERMS.includes(months)) return null;
  const monthlyCents = Math.ceil(Math.round(price * 100 * (1 + SURCHARGE)) / months);
  return { plan, price, months, monthly: monthlyCents / 100, total: (monthlyCents * months) / 100 };
}

const json = (data, status = 200) => Response.json(data, { status });

export async function onRequestPost({ request, env }) {
  const form = await request.formData().catch(() => null);
  if (!form) return json({ success: false, message: "Bad request" }, 400);
  if (form.get("botcheck")) return json({ success: true }); // honeypot: pretend it worked

  const field = (key, max) => String(form.get(key) ?? "").trim().slice(0, max);
  const name = field("name", 100);
  const email = field("email", 200);
  const q = quote(field("plan", 20), Number(form.get("months")));
  if (!q || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ success: false, message: "Invalid request" }, 422);
  }
  if (!env.INSTALLMENTS && !env.RESEND_API_KEY) {
    return json({ success: false, message: "Not configured" }, 503);
  }

  const entry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "pending",
    name,
    email,
    phone: field("phone", 40),
    business: field("business", 150),
    message: field("message", 2000),
    lang: field("lang", 5),
    ...q,
  };

  let saved = false;
  if (env.INSTALLMENTS) {
    await env.INSTALLMENTS.put(`req:${entry.createdAt}:${entry.id}`, JSON.stringify(entry));
    saved = true;
  }
  if (env.RESEND_API_KEY && env.NOTIFY_EMAIL) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.NOTIFY_FROM || "NodWeb <onboarding@resend.dev>",
        to: env.NOTIFY_EMAIL,
        reply_to: email,
        subject: `Installment request: ${q.plan}, ${q.months} × €${q.monthly.toFixed(2)}`,
        text: Object.entries(entry).map(([k, v]) => `${k}: ${v}`).join("\n"),
      }),
    }).catch(() => null);
    saved ||= Boolean(res?.ok);
  }
  if (!saved) return json({ success: false, message: "Could not save request" }, 502);

  return json({ success: true, quote: q });
}

export async function onRequestGet({ request, env }) {
  const enc = new TextEncoder();
  const got = enc.encode(request.headers.get("Authorization") || "");
  const want = enc.encode(`Bearer ${env.ADMIN_TOKEN}`);
  const authorized = env.ADMIN_TOKEN && got.byteLength === want.byteLength && crypto.subtle.timingSafeEqual(got, want);
  if (!authorized) return json({ success: false, message: "Unauthorized" }, 401);
  if (!env.INSTALLMENTS) return json({ success: false, message: "No KV binding" }, 503);

  const { keys } = await env.INSTALLMENTS.list({ prefix: "req:" });
  const items = await Promise.all(keys.map((k) => env.INSTALLMENTS.get(k.name, "json")));
  return json({ success: true, items: items.reverse() });
}
