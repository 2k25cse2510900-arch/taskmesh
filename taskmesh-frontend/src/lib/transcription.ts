export async function transcribeVideo(videoUrl: string, format: string | null) {
  const provider = process.env.TRANSCRIPTION_PROVIDER?.toLowerCase();
  const apiKey = process.env.TRANSCRIPTION_PROVIDER_KEY ?? process.env.OPENAI_API_KEY;
  if (provider !== "openai" || !apiKey) throw new Error("Video transcription is not configured. Set TRANSCRIPTION_PROVIDER=openai and TRANSCRIPTION_PROVIDER_KEY.");

  const videoResponse = await fetch(videoUrl);
  if (!videoResponse.ok) throw new Error("The uploaded video could not be retrieved for transcription");
  const size = Number(videoResponse.headers.get("content-length") ?? 0);
  if (size > 25 * 1024 * 1024) throw new Error("Videos larger than 25 MB cannot be transcribed by the configured provider");
  const contentType = videoResponse.headers.get("content-type") ?? "video/mp4";
  const extension = format || contentType.split("/")[1] || "mp4";
  const body = new FormData();
  body.append("model", process.env.TRANSCRIPTION_MODEL ?? "gpt-transcribe");
  body.append("languages[]", "en");
  body.append("file", new File([await videoResponse.arrayBuffer()], `submission.${extension}`, { type: contentType }));
  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: `Bearer ${apiKey}` }, body });
  if (!response.ok) throw new Error(`OpenAI transcription failed: ${await response.text()}`);
  const data = await response.json() as { text?: string };
  if (!data.text?.trim()) throw new Error("The transcription provider returned no transcript");
  return data.text.trim();
}
