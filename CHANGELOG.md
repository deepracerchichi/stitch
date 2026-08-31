# Improvement Changelog

Add one entry per meaningful experiment, in order. Include things you tried
and removed — they're evidence too.

## Baseline
- **What**: one direct prompt, raw resume text pasted inline as a loose
  paragraph (RAW_RESUME in src/baseline.ts), no structured data, no
  verification.
- **Why**: represents the "reasonable basic way to handle the task" —
  what applying without building anything looks like.
- **Evidence**:
  - eval/outputs/hiredbuddy-baseline.txt — reasonable on an easy JD, but
    used vague framing like "Bonus Qualifications... (listed as a
    nice-to-have)" invented from JD structure rather than any real source
    of truth, and left placeholder brackets like [Last Name] unfilled.
  - eval/outputs/hard-case-2-baseline.txt — under direct pressure to
    describe Docker/Kubernetes experience, fabricated specific false
    claims: "Configured and managed Kubernetes clusters," "self-healing
    container setups," "zero-downtime deployments." None of this exists
    in my real project history.
- **Decision**: established the starting point. The hard-case-2 result is
  the baseline's core failure mode: with no structured source of truth and
  no verification, it will fabricate specific technical claims rather than
  stay honest when a JD applies pressure.

## Iteration 1 — structured experience bank as draft context
- **What**: replaced the baseline's loose resume paragraph with a
  structured JSON experience bank (src/experience-bank.json) injected as
  system context into the draft step, plus explicit hard_rules forbidding
  invented tools/experience and naming known_gaps directly.
- **Why**: the baseline's unstructured context gave the model nothing to
  check itself against — it had to guess at relevance and had no
  guardrail against fabrication.
- **Evidence**: same JD (Hiredbuddy Entry Level Full Stack Engineer) run
  through both. Baseline (eval/outputs/hiredbuddy-baseline.txt) used vague
  phrasing ("extensive experience," "bonus qualifications"). Agent draft
  (trajectories/example.json, draft step) named specific real tools per
  project instead — Socket.IO, JWT, role-based dashboards for nestFind;
  React/Next.js/TypeScript/Three.js for Aerosub — pulled directly from the
  experience bank rather than paraphrased loosely.
- **Decision**: kept. Measurably more specific and grounded output, and
  this is the change that later proved decisive on hard-case-2 — the
  draft step never fabricated Docker/K8s experience because it had no
  structured basis to invent from.
  
## Iteration 2 — verification pass + real experience bank data

**What**: Filled the experience bank with real resume data, then tested both
baseline and agent against a deliberately hard JD (eval/jds/hard-case-2.txt)
that demanded "3+ years hands-on production Docker and Kubernetes experience"
and directly asked applicants to describe it.

**Why**: This is my most specific known gap (Docker exposure is tooling-level,
not production orchestration). I wanted to see whether either pipeline would
fabricate experience under direct pressure.

**Evidence**:
- Baseline (eval/outputs/hard-case-2-baseline.txt): fabricated specific,
  false claims — "Configured and managed Kubernetes clusters," "self-healing
  container setups," "zero-downtime deployments" — none of which exist in my
  real project history.
- Agent (eval/outputs/hard-case-2-agent.txt, trajectories/hard-case-2.json):
  made zero mention of Docker/Kubernetes. Instead leaned into real,
  adjacent infrastructure work (Redis/Upstash caching, Render/Vercel
  deployments, S3 upload pipelines) that is true. Verify step returned
  unsupported_claims: [], named_gaps: [], verdict: pass — meaning the
  draft step, constrained by the experience bank, never needed correcting
  on this case.

**Decision**: kept. This is the clearest evidence that grounding the draft
step in a structured experience bank — not just adding a verification
pass — is what actually prevents fabrication. Verification currently
functions as a safety net that wasn't triggered here, which is itself
a useful finding (see hot take).

## Final
- **What**: Combined structured JSON grounding, candidate-specific experience constraints, and an automated verification loop across all evaluated test cases (`case-1`, `case-2`, `hard-case-2`).
- **Evidence**:
  - `eval/results.csv`: Baseline score averaged **4/10** (frequent bracket placeholders, hallucinative skill claims, and meta-commentary tips) vs. Agent score of **8.8/10** (100% verified claims, zero gap disclosure, complete context extraction).
  - `trajectories/case-1.json` & `trajectories/case-2.json`: Documented complete agent trajectories showing systematic extraction of Three.js, Next.js, and Vitest details while trimming placeholder artifacts.
- **Main contribution**: Proved that constraining LLM generation to a strictly typed, immutable Experience Bank—backed by an explicit verification pass—eliminates resume hallucinations under JD pressure while producing authentic, tailormade cover letters.