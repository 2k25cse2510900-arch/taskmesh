import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { apiError } from "@/lib/http";

export async function GET(request: Request) {
  try {
    const result = await requireUser();
    if ("response" in result) return result.response;
    const initiativeId = new URL(request.url).searchParams.get("initiativeId");
    const tasks = await prisma.task.findMany({ where: { initiativeId: initiativeId || undefined, status: "PUBLISHED", initiative: { memberships: { some: { userId: result.user.id, status: "ACTIVE" } } } }, include: { initiative: { select: { id: true, slug: true, title: true, category: true } } }, orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }], take: 100 });
    return NextResponse.json({ tasks });
  } catch (error) {
    return apiError(error);
  }
}

