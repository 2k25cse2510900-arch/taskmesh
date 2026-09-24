import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/http";
import { userSyncSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const clerkUser = await currentUser();
    if (!clerkUser || clerkUser.id !== userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const data = userSyncSchema.parse(await request.json());
    const profile = {
      email: clerkUser.primaryEmailAddress?.emailAddress ?? null,
      name: clerkUser.fullName ?? null,
      username: clerkUser.username ?? null,
      avatarUrl: clerkUser.imageUrl ?? null,
      timezone: data.timezone
    };
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      create: { clerkId: userId, ...profile },
      update: profile
    });
    return NextResponse.json({ user });
  } catch (error) {
    return apiError(error);
  }
}
