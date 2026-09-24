import { createClerkClient, verifyToken } from "@clerk/backend";
import type { IncomingMessage } from "node:http";
import { UserRole } from "@prisma/client";
import { prisma } from "../database";

export type AuthenticatedTaskMeshUser = {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  role: UserRole;
};

export class AuthenticationError extends Error {}
export class AuthorizationError extends Error {}

function clerkSecretKey() {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) throw new AuthenticationError("Clerk is not configured on the API server");
  return secretKey;
}

function bearerToken(request: IncomingMessage) {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw new AuthenticationError("A Clerk session token is required");
  const token = header.slice("Bearer ".length).trim();
  if (!token) throw new AuthenticationError("A Clerk session token is required");
  return token;
}

/** Verifies Clerk's signed session token and safely links its subject to MongoDB. */
export async function requireAuthenticatedUser(request: IncomingMessage): Promise<AuthenticatedTaskMeshUser> {
  const secretKey = clerkSecretKey();
  let clerkId: string | undefined;
  try {
    clerkId = (await verifyToken(bearerToken(request), { secretKey }))?.sub;
  } catch {
    throw new AuthenticationError("Invalid or expired Clerk session token");
  }
  if (!clerkId) throw new AuthenticationError("Clerk session has no user identity");

  const clerkUser = await createClerkClient({ secretKey }).users.getUser(clerkId);
  const email = clerkUser.emailAddresses.find((address) => address.id === clerkUser.primaryEmailAddressId)?.emailAddress;
  if (!email) throw new AuthenticationError("Clerk user does not have a primary email address");
  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || clerkUser.username || null;

  const existing = await prisma.user.findUnique({ where: { clerkId } })
    ?? await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: { clerkId, name: name ?? existing.name },
      select: { id: true, clerkId: true, email: true, name: true, role: true },
    }) as Promise<AuthenticatedTaskMeshUser>;
  }

  return prisma.user.create({
    data: { clerkId, email, name, role: UserRole.STUDENT },
    select: { id: true, clerkId: true, email: true, name: true, role: true },
  }) as Promise<AuthenticatedTaskMeshUser>;
}

export function requireRole(user: AuthenticatedTaskMeshUser, ...roles: UserRole[]) {
  if (!roles.includes(user.role)) throw new AuthorizationError("You do not have permission for this action");
}
