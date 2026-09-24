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
  submission: { content: string | null; url: string | null };
};

export interface EvaluationProvider {
  evaluate(input: EvaluationInput): Promise<unknown>;
}

export function getEvaluationProvider(): EvaluationProvider {
  throw new Error("AI evaluation provider is not configured. Set an adapter before enabling evaluation.");
}

