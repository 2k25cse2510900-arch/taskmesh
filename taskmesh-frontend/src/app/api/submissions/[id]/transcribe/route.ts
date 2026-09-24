import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { apiError } from "@/lib/http";
import { transcribeVideo } from "@/lib/transcription";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const result = await requireUser();
    if ("response" in result) return result.response;
    const { id } = await params;
    const submission = await prisma.submission.findFirst({ where: { id, userId: result.user.id }, include: { media: { where: { resourceType: "video" }, orderBy: { createdAt: "desc" }, take: 1 } } });
    if (!submission) return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    if (submission.transcript) return NextResponse.json({ transcript: submission.transcript });
    const video = submission.media[0];
    if (!video) return NextResponse.json({ error: "This submission has no uploaded video" }, { status: 422 });
    const transcript = await transcribeVideo(video.secureUrl, video.format);
    await prisma.submission.update({ where: { id }, data: { transcript } });
    return NextResponse.json({ transcript });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("not configured") || error.message.includes("larger than") || error.message.includes("could not be retrieved") || error.message.includes("returned no transcript"))) return NextResponse.json({ error: error.message }, { status: 503 });
    return apiError(error);
  }
}
