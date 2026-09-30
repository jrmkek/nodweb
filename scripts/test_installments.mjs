// node scripts/test_installments.mjs
import assert from "node:assert/strict";
import { quote, onRequestPost } from "../functions/api/installments.js";

assert.deepEqual(quote("starter", 12), { plan: "starter", price: 350, months: 12, monthly: 36.17, total: 434.04 });
assert.equal(quote("website", 12).monthly, 62);
assert.equal(quote("premium", 12), null);
assert.equal(quote("starter", 3).total, 434.01);
assert.equal(quote("starter", 5), null);
assert.equal(quote("custom", 3), null);

const post = (fields, env) => {
  const body = new FormData();
  for (const [k, v] of Object.entries(fields)) body.set(k, v);
  return onRequestPost({ request: new Request("http://x/api/installments", { method: "POST", body }), env });
};
const kv = new Map();
const env = { INSTALLMENTS: { put: async (k, v) => kv.set(k, v) } };
const ok = { plan: "website", months: "6", name: "Ana", email: "ana@example.com" };

assert.equal((await post(ok, env)).status, 200);
assert.equal(JSON.parse([...kv.values()][0]).total, 744);
assert.equal((await post({ ...ok, email: "nope" }, env)).status, 422);
assert.equal((await post({ ...ok, months: "24" }, env)).status, 422);
assert.equal((await post(ok, {})).status, 503);
console.log("ok");
