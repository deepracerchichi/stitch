import { GoogleGenerativeAI } from "@google/generative-ai";
import experienceBank from "../experience-bank.json" with { type: "json" };
import type { VerificationResult } from "./verify.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-3.6-flash",
  systemInstruction: `Revise the draft to fix the flagged issues, using ONLY the
experience bank below. Remove or replace unsupported claims. Rephrase any
sentence that names a gap, without lying about it — just don't name it.

EXPERIENCE BANK:
${JSON.stringify(experienceBank, null, 2)}`,
});

export async function revise(
  draftText: string,
  issues: VerificationResult
): Promise<string> {
  const result = await model.generateContent(
    `DRAFT:\n${draftText}\n\nISSUES TO FIX:\n${JSON.stringify(issues, null, 2)}`
  );
  return result.response.text();
}
