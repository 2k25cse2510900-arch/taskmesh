import { z } from "zod";

export const evaluationResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  criterionScores: z.array(z.object({
    criterionId: z.string(),
    score: z.number().min(0),
    rationale: z.string().max(2000).optional()
  })),
  strengths: z.array(z.string().max(500)).max(20),
  weaknesses: z.array(z.string().max(500)).max(20),
  recommendations: z.array(z.string().max(500)).max(20),
  summary: z.string().max(3000),
  confidence: z.number().min(0).max(1).optional()
});

export type EvaluationInput = {
  taskInstructions: string;
  initiativeContext: string;
  rubric: Array<{ id: string; name: string; description: string; maxScore: number; weight: number; instructions: string | null }>;
  submission: { content: string | null; transcript?: string | null; programmingLanguage?: string | null; url: string | null };
};

export interface EvaluationProvider {
  evaluate(input: EvaluationInput): Promise<unknown>;
}

export function getEvaluationProvider(): EvaluationProvider {
  const provider = process.env.AI_PROVIDER?.toLowerCase();
  const apiKey = process.env.AI_PROVIDER_KEY ?? process.env.OPENAI_API_KEY;
  if (provider !== "openai" || !apiKey) throw new Error("AI evaluation provider is not configured. Set AI_PROVIDER=openai and AI_PROVIDER_KEY.");

  return {
    async evaluate(input) {
      const criteria = input.rubric.map((criterion) => `- ${criterion.id}: ${criterion.name} (maximum ${criterion.maxScore}): ${criterion.description}`).join("\n");
      const submission = input.submission.transcript ?? input.submission.content;
      const request = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: process.env.AI_MODEL ?? "gpt-4o-mini",
          input: `You are reviewing a student ${input.submission.programmingLanguage ? `${input.submission.programmingLanguage} code` : "English transcript or text"} submission. Give concrete, constructive feedback only from the provided submission. For English, cover grammar, punctuation, wording, and a short summary. For code, cover likely bugs, inefficiencies, readability, improvements, and time/space complexity when possible. Do not claim code was executed.\n\nInitiative: ${input.initiativeContext}\nTask: ${input.taskInstructions}\nRubric:\n${criteria}\n\nSubmission:\n${submission ?? ""}`,
          text: {
            format: {
              type: "json_schema",
              name: "submission_review",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  overallScore: { type: "number" },
                  criterionScores: { type: "array", items: { type: "object", properties: { criterionId: { type: "string" }, score: { type: "number" }, rationale: { type: "string" } }, required: ["criterionId", "score", "rationale"], additionalProperties: false } },
                  strengths: { type: "array", items: { type: "string" } },
                  weaknesses: { type: "array", items: { type: "string" } },
                  recommendations: { type: "array", items: { type: "string" } },
                  summary: { type: "string" },
                  confidence: { type: "number" }
                },
                required: ["overallScore", "criterionScores", "strengths", "weaknesses", "recommendations", "summary", "confidence"],
                additionalProperties: false
              }
            }
          }
        })
      });
      if (!request.ok) throw new Error(`OpenAI evaluation failed: ${await request.text()}`);
      const response = await request.json() as { output_text?: string; output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
      const outputText = response.output_text ?? response.output?.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text;
      if (!outputText) throw new Error("OpenAI evaluation returned no structured output");
      return JSON.parse(outputText);
    }
  };
}

