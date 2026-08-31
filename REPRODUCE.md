# Reproduction Guide

## Requirements
- Node.js 20+
- A free Google AI Studio API key (`GEMINI_API_KEY`)
- Approx. runtime: ~1–2 minutes per JD pass
- Approx. cost: $0 — runs on the Gemini Free Tier

## Setup
```bash
git clone <your-repo-url>
cd tailor-agent
npm install
cp .env.example .env
# edit .env and add your GEMINI_API_KEY
```

## Data Structure
1. The structured Experience Bank is located in `src/experience-bank.json`[cite: 2, 4].
2. Test cases are stored as plain text files in `eval/jds/` (`case-1.txt` through `case-6.txt`, `hard-case-2.txt`)[cite: 2, 4].

## Run the baseline
```bash
npx tsx src/baseline.ts eval/jds/case-1.txt