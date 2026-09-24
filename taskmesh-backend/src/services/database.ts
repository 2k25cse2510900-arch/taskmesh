import { PrismaClient } from "@prisma/client";

// One shared Prisma client for the small standalone backend process.
export const prisma = new PrismaClient();
