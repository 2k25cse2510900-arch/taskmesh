import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Creates or updates the local profile for the Clerk user in the current,
 * verified server-side session. Clerk's user ID is the only lookup key.
 */
export async function syncAuthenticatedUser(timezone?: string) {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser || clerkUser.id !== userId) return null;

  const profile = {
    email: clerkUser.primaryEmailAddress?.emailAddress ?? null,
    name: clerkUser.fullName ?? null,
    username: clerkUser.username ?? null,
    avatarUrl: clerkUser.imageUrl ?? null,
    ...(timezone ? { timezone } : {})
  };

  return prisma.user.upsert({
    where: { clerkId: userId },
    create: { clerkId: userId, ...profile },
    update: profile
  });
}

export async function requireUser() {
  const { userId } = await auth();
  if (!userId) return { response: NextResponse.json({ error: "Authentication required" }, { status: 401 }) } as const;

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    ?? await syncAuthenticatedUser();
  if (!user) return { response: NextResponse.json({ error: "User profile is not synchronized" }, { status: 403 }) } as const;
  return { user } as const;
}

export async function requireRole(roles: Array<"PARTICIPANT" | "LEADER" | "ADMIN">) {
  const result = await requireUser();
  if ("response" in result) return result;
  if (!roles.includes(result.user.role)) return { response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) } as const;
  return result;
}

