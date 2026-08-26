import { EvalCase, CASES } from "./dataset";

const BASE = process.env.EVAL_URL ?? "http://localhost:3000";

export async function runEval(c: EvalCase) {
    const res = await fetch(`${BASE}/api/search`, {
        method: "POST",
        body: JSON.stringify({
            query: c.question,
            repo: c.repo
        })
    })
    const { data } = await res.json();
    const reasons: string[] = []
    const lower = (data ?? "").toLowerCase();

    if (c.expectedShas?.length) {
        const hit = c.expectedShas.some(s => data?.includes(s));
        if (!hit) {
            reasons.push(`retrieval miss — wanted ${c.expectedShas.join("|")}`);
        }
    }

    if (c.mustContain?.length) {
        const hit = c.mustContain.every(v => lower?.includes(v));
        if (!hit) {
            reasons.push(`missing terms: ${c.mustContain.filter(v => !data?.toLowerCase().includes(v)).join(", ")}`);
        }
    }

    if (c.shouldRefuse) {
        const refused = /don't|doesn't|not (mention|contain|found)|no (information|commits)|unable/.test(lower);
        if (!refused) reasons.push(`hallucinated instead of refusing: ${lower.slice(0, 120)}`);
    }

    return { id: c.id, question: c.question, pass: reasons.length === 0, reasons };
}

async function main() {
  const results = [];
  for (const c of CASES) {
    const r = await runEval(c);
    console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.id}  ${r.question}`);
    if (r.reasons.length) console.log("      " + r.reasons.join("\n      "));
    results.push(r);
  }
  const passed = results.filter(r => r.pass).length;
  const rate = passed / results.length;

  console.log(`\n${passed}/${results.length} passed (${Math.round(passed / results.length * 100)}%)`);
  if (rate < 0.7) process.exit(1);
}

main();