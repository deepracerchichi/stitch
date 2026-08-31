import { GoogleGenerativeAI } from "@google/generative-ai";
import experienceBank from "../experience-bank.json" with { type: "json" };

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-3.6-flash",
  systemInstruction: `You are a strict fact-checker. Compare the draft email against the
experience bank. Respond ONLY with JSON matching this shape exactly:
{"unsupported_claims": string[], "named_gaps": string[], "verdict": "pass" | "needs_revision"}

- unsupported_claims: any specific tool, skill, years, or achievement in the
  draft NOT present in the experience bank.
- named_gaps: any place the draft explicitly names or alludes to a known_gap
  from the experience bank (even softly, e.g. "still growing in Docker").
- verdict: "needs_revision" if either list is non-empty, else "pass".

EXPERIENCE BANK:
${JSON.stringify(experienceBank, null, 2)}`,
  generationConfig: {
    responseMimeType: "application/json",
  },
});

export interface VerificationResult {
  unsupported_claims: string[];
  named_gaps: string[];
  verdict: "pass" | "needs_revision";
}

export async function verify(draftText: string): Promise<VerificationResult> {
  const result = await model.generateContent(`DRAFT:\n${draftText}`);
  return JSON.parse(result.response.text());
}
