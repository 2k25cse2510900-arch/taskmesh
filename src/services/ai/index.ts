export type EvaluationInput = {
  initiative: { name: string; evaluationRubric: unknown };
  submission: { content: string | null; type: string };
};

export type EvaluationResult = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  improvements: string[];
  source: "DEMO" | "AI";
};

function rubricCriteria(rubric: unknown): string[] {
  if (rubric && typeof rubric === "object" && !Array.isArray(rubric)) {
    const criteria = Object.keys(rubric as Record<string, unknown>);
    if (criteria.length > 0) return criteria;
  }
  return ["clarity", "completeness", "relevance"];
}

function createDemoEvaluation(input: EvaluationInput): EvaluationResult {
  const criteria = rubricCriteria(input.initiative.evaluationRubric);
  const length = input.submission.content?.trim().length ?? 0;
  const score = length >= 500 ? 88 : length >= 150 ? 82 : 74;

  return {
    score,
    strengths: [
      `Addresses the ${criteria[0]} criterion for ${input.initiative.name}.`,
      `Provides a ${input.submission.type.toLowerCase()} submission in the expected format.`,
    ],
    weaknesses: [`The response could provide more evidence for ${criteria[1] ?? criteria[0]}.`],
    feedback: `Demo fallback evaluation — no external AI service was called. The submission was reviewed against the configured ${criteria.join(", ")} rubric criteria.`,
    improvements: [
      `Add a concrete example to strengthen ${criteria[0]}.`,
      `Revise the final response to improve ${criteria[1] ?? criteria[0]}.`,
    ],
    source: "DEMO",
  };
}

export async function evaluateSubmission(input: EvaluationInput): Promise<EvaluationResult> {
  // A future LLM adapter can be added here when AI_API_KEY is configured.
  // This MVP deliberately returns a labelled demo result and never impersonates an AI call.
  void process.env.AI_API_KEY;
  return createDemoEvaluation(input);
}
