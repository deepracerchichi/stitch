# Reproduction Guide

## Requirements
- Node.js 20+
- A free Google AI Studio API key (Gemini 2.5 Flash free tier — no billing required)
- Approx. runtime: REPLACE_ME (e.g. ~1 min per JD for baseline, ~2 min for agent)
- Approx. cost: $0 — runs entirely on the Gemini free tier (rate-limited, not
  metered by dollars)

## Setup
```bash
git clone <this-repo-url>
cd tailor-agent
npm install
cp .env.example .env
# edit .env and add your GEMINI_API_KEY (get one free at aistudio.google.com/apikey)
```

## Fill in required data (not committed to the repo)
1. Fill in `src/experience-bank.json` with real project bullets (currently
   has REPLACE_ME placeholders).
2. Drop 10+ real job descriptions as `.txt` files into `eval/jds/`.

## Run the baseline
```bash
npm run baseline -- eval/jds/example.txt
```
Output printed to console and saved to `baseline-output.txt`.

## Run the agent
```bash
npm run agent -- eval/jds/example.txt
```
Output printed to console, saved to `agent-output-<jdname>.txt`, and the full
trajectory (draft → verify → revise → reverify) saved to
`trajectories/<jdname>.json`.

## Run the full evaluation
```bash
npm run eval
```
Runs every JD in `eval/jds/` through both baseline and agent, saving paired
outputs to `eval/outputs/`. Score each pair manually into `eval/results.csv`
(unsupported claims, named gaps, "would I send this" 1-5), then summarize the
totals in the README's "Does the agent solve it well" section.

## Expected output
For each JD, you should get:
- `eval/outputs/<jdname>-baseline.txt` — one plain-prompt draft
- `eval/outputs/<jdname>-agent.txt` — the verified/revised draft
- `trajectories/<jdname>.json` — the full step-by-step trajectory for that JD
