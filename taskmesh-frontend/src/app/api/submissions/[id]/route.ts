import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { apiError } from "@/lib/http";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const result = await requireUser();
    if ("response" in result) return result.response;
    const { id } = await params;
    const submission = await prisma.submission.findFirst({ where: { id, OR: [{ userId: result.user.id }, { task: { initiative: { ownerId: result.user.id } } }] }, include: { media: true, task: { include: { initiative: { select: { id: true, title: true, objective: true, ownerId: true }, }, } }, evaluations: { include: { criterionScores: true, feedback: true }, orderBy: { createdAt: "desc" }, take: 1 } } });
    if (!submission) return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    return NextResponse.json({ submission });
  } catch (error) {
    return apiError(error);
  }
}

