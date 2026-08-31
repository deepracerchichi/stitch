# Gap-Silent Job Application Tailoring Agent

## Who has this problem
A full-stack software developer applying to international remote roles who works with modern Web/TypeScript tech (React, Next.js, Node.js, Express) but has a defined set of gaps (no production Docker/Kubernetes depth, no WordPress, no competitive programming background). The core problem is tailoring every application specifically to a Job Description (JD) without ever explicitly naming or calling attention to those missing skills[cite: 3].

## What bottleneck makes it worth solving
For every JD, deciding which project to lead with and rewriting bullets to mirror the JD's language—while ensuring no missing skill is accidentally highlighted or hallucinated—is slow, tedious, and easy to mess up under time pressure[cite: 3].

## Does the agent solve it well
Yes. In our evaluation benchmark (`results.csv`), the baseline prompt averaged **4/10**—frequently making up false production claims (e.g., fabricating Docker/Kubernetes cluster experience) or leaving unpopulated template placeholders (`[Your Last Name]`)[cite: 2]. 

In contrast, the agent pipeline averaged **8.8/10**, generating 100% verified, evidence-backed cover letters that align closely with JD keywords without ever fabricating skills or surfacing background gaps[cite: 2].

## Can another person reproduce the result
Yes, full step-by-step instructions are provided in `REPRODUCE.md`[cite: 3].

## What existed before this competition vs. what was added
- **Existing:** Personal resume, project data (Aerosub, nestFind, Coupon Dash), and past application drafts[cite: 3].
- **Added during the hackathon:** The structured JSON Experience Bank (`src/experience-bank.json`), the baseline evaluation script (`src/baseline.ts`), the multi-step draft/verify/revise pipeline, the automated evaluation harness (`eval/run-eval.ts`), and step-by-step trajectory logging (`trajectories/`)[cite: 2, 3, 4].

## Improvement Changelog

| Stage | What you tried and why | Evidence | Decision / learning |
|---|---|---|---|
| Baseline | One plain prompt, raw resume text inline | `eval/outputs/hard-case-2-baseline.txt` (Fabricated Docker/K8s experience)[cite: 2] | Established failure mode: LLMs hallucinate skills under JD pressure when unconstrained[cite: 2]. |
| Iteration 1 | Added structured Experience Bank as context | `trajectories/example.json` (Pulled exact tools: Socket.IO, JWT, Three.js)[cite: 2] | Grounding drafts in structured JSON drastically improved specificity and accuracy[cite: 2]. |
| Iteration 2 | Added verification pass to check ground truth | `eval/outputs/hard-case-2-agent.txt` (0 mentions of Docker; leaned on Redis/Vercel)[cite: 2] | Proved that constraining context + verification prevents hallucinations completely[cite: 2]. |
| Final | Combined Experience Bank, hard constraints, & verification | `eval/results.csv` (Average score jumped from 4/10 to 8.8/10)[cite: 2] | Identified main contribution: Grounded, gap-silent application tailoring[cite: 2]. |

## Main failure mode
Unconstrained plain prompts tend to fabricate specific technical experience (e.g., claiming to manage production Kubernetes clusters) or soften missing skills into "areas I am eager to learn," which directly exposes gaps to the recruiter[cite: 2].

## Hot take
Verification passes are great safety nets, but enforcing strict grounding at the **draft phase** via a typed, immutable Experience Bank is what actually prevents LLMs from hallucinating under pressure[cite: 2].