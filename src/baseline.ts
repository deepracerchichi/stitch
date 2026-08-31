// BASELINE: the "reasonable basic way to handle the task" before the agent.
// One direct prompt, resume text pasted in raw, no structured data,
// no verification. This is the comparison point for the whole project —
// do not "improve" this file later. Iterate in src/agent/ instead.

import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync, writeFileSync } from "fs";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

// Simple, unstructured resume summary — intentionally not the experience bank.
// This is what a naive first attempt would use.
const RAW_RESUME = `
Chichi is a frontend-leaning full-stack developer.
Stack: Next.js, React, TypeScript, Tailwind, Node.js/Express, MongoDB.
Built a multi-tenant SaaS inspection platform with 2D/3D and 360 defect viewers.
Built nestFind, a real estate platform with JWT auth and real-time messaging.
`;

async function runBaseline(jdPath: string): Promise<string> {
  const jd = readFileSync(jdPath, "utf-8");

  const result = await model.generateContent(
    `Here is my resume summary:\n${RAW_RESUME}\n\nHere is a job description:\n${jd}\n\nWrite a tailored job application email.`
  );

  return result.response.text();
}

// CLI usage: tsx src/baseline.ts eval/jds/example.txt
const jdPath = process.argv[2];
if (!jdPath) {
  console.error("Usage: tsx src/baseline.ts <path-to-jd.txt>");
  process.exit(1);
}

runBaseline(jdPath).then((output) => {
  console.log(output);
  writeFileSync("baseline-output.txt", output);
});
