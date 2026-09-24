import OpenAI from "openai";
import { Readable } from "node:stream";

const apiKey =
  process.env.OPENAI_API_KEY ?? process.env.AI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not configured");
}

const openai = new OpenAI({
  apiKey,
});

export async function transcribeAudio(
  buffer: Buffer,
  filename: string,
  mimeType: string,
): Promise<string> {
  const file = await OpenAI.toFile(
    Readable.from(buffer),
    filename,
    {
      type: mimeType,
    },
  );

  const result =
    await openai.audio.transcriptions.create({
      file,
      model: "gpt-4o-transcribe",
    });

  return result.text.trim();
}