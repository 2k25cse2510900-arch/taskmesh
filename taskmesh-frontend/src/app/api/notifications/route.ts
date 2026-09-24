import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { apiError } from "@/lib/http";
import { notificationPatchSchema } from "@/lib/validation";

export async function GET() {
  try {
    const result = await requireUser();
    if ("response" in result) return result.response;
    const notifications = await prisma.notification.findMany({ where: { userId: result.user.id }, orderBy: { createdAt: "desc" }, take: 50 });
    return NextResponse.json({ notifications });
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const result = await requireUser();
    if ("response" in result) return result.response;
    const body = notificationPatchSchema.parse(await request.json());
    if (body.all) {
      await prisma.notification.updateMany({ where: { userId: result.user.id, readAt: null }, data: { readAt: new Date() } });
    } else if (body.id) {
      await prisma.notification.updateMany({ where: { id: body.id, userId: result.user.id }, data: { readAt: new Date() } });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
