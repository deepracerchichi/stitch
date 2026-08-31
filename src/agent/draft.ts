import { GoogleGenerativeAI } from "@google/generative-ai";
import experienceBank from "../experience-bank.json" with { type: "json" };

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-3.6-flash",
  systemInstruction: `You write tailored job application emails. You may ONLY use the
experience, skills, and bullets provided in the candidate's experience bank
below. Never invent tools, years of experience, or projects not listed.
Follow every rule in "hard_rules" exactly. Select whichever 1-2 projects
best match the JD and lead with those.

EXPERIENCE BANK:
${JSON.stringify(experienceBank, null, 2)}`,
});

export async function draft(jd: string): Promise<string> {
  const result = await model.generateContent(
    `Job description:\n${jd}\n\nWrite a tailored application email.`
  );
  return result.response.text();
}
