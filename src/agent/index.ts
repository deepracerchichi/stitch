import "dotenv/config";
import { readFileSync, writeFileSync } from "fs";
import { draft } from "./draft.js";
import { verify } from "./verify.js";
import { revise } from "./revise.js";

async function runAgent(jdPath: string) {
  const jd = readFileSync(jdPath, "utf-8");
  const trajectory: Record<string, unknown>[] = [];

  const draftText = await draft(jd);
  trajectory.push({ step: "draft", output: draftText });

  const verification = await verify(draftText);
  trajectory.push({ step: "verify", output: verification });

  let finalText = draftText;
  if (verification.verdict === "needs_revision") {
    finalText = await revise(draftText, verification);
    trajectory.push({ step: "revise", output: finalText });

    // Re-verify once after revision so the trajectory shows the checkpoint closing.
    const reverify = await verify(finalText);
    trajectory.push({ step: "reverify", output: reverify });
  } else {
    trajectory.push({ step: "no_revision_needed" });
  }

  const jdName = jdPath.split("/").pop()?.replace(".txt", "") ?? "unknown";
  writeFileSync(
    `trajectories/${jdName}.json`,
    JSON.stringify(trajectory, null, 2)
  );
  writeFileSync(`agent-output-${jdName}.txt`, finalText);

  console.log(finalText);
  console.log(`\n[trajectory saved to trajectories/${jdName}.json]`);
}

const jdPath = process.argv[2];
if (!jdPath) {
  console.error("Usage: tsx src/agent/index.ts <path-to-jd.txt>");
  process.exit(1);
}

runAgent(jdPath);
