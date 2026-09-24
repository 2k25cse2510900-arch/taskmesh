import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { apiError } from "@/lib/http";
import { initiativeCreateSchema } from "@/lib/validation";

export async function GET() {
  try {
    const initiatives = await prisma.initiative.findMany({
      where: { status: { in: ["PUBLISHED", "ACTIVE"] }, visibility: "PUBLIC" },
      select: { id: true, slug: true, title: true, description: true, objective: true, category: true, status: true, cadence: true, startDate: true, endDate: true, _count: { select: { memberships: true, tasks: true } } },
      orderBy: { createdAt: "desc" },
      take: 50
    });
    return NextResponse.json({ initiatives });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const result = await requireRole(["LEADER", "ADMIN"]);
    if ("response" in result) return result.response;
    const data = initiativeCreateSchema.parse(await request.json());
    const initiative = await prisma.initiative.create({ data: { ...data, ownerId: result.user.id } });
    return NextResponse.json({ initiative }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

