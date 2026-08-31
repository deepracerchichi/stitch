// Loops every JD in eval/jds/ through baseline and agent, saves raw outputs
// side by side. Scoring against the rubric (unsupported claims, named gaps,
// "would I send this" 1-5) is currently a manual step — fill eval/results.csv
// by hand after reading the paired outputs, or extend this script once the
// scoring approach is finalized.

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { execSync } from "child_process";

const JD_DIR = "eval/jds";
const OUT_DIR = "eval/outputs";
mkdirSync(OUT_DIR, { recursive: true });

const jdFiles = readdirSync(JD_DIR).filter((f) => f.endsWith(".txt"));

if (jdFiles.length === 0) {
  console.error(
    `No JDs found in ${JD_DIR}. Drop 10+ real job descriptions in there as .txt files first.`
  );
  process.exit(1);
}

for (const file of jdFiles) {
  const jdPath = `${JD_DIR}/${file}`;
  const name = file.replace(".txt", "");
  console.log(`\n=== ${name} ===`);

  console.log("-- baseline --");
  execSync(`npx tsx src/baseline.ts ${jdPath}`, { stdio: "inherit" });
  const baselineOut = readFileSync("baseline-output.txt", "utf-8");
  writeFileSync(`${OUT_DIR}/${name}-baseline.txt`, baselineOut);

  console.log("-- agent --");
  execSync(`npx tsx src/agent/index.ts ${jdPath}`, { stdio: "inherit" });
  const agentOut = readFileSync(`agent-output-${name}.txt`, "utf-8");
  writeFileSync(`${OUT_DIR}/${name}-agent.txt`, agentOut);
}

console.log(
  `\nDone. Paired outputs in ${OUT_DIR}/. Score each pair by hand into eval/results.csv.`
);
