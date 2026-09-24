import type { Prisma } from "@prisma/client";

function dayStart(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

// Uses persisted submission timestamps only; clients never provide streak dates.
export async function recordSubmissionStreak(
  transaction: Prisma.TransactionClient,
  submission: { id: string; userId: string; initiativeId: string; createdAt: Date },
) {
  const [existing, previous] = await Promise.all([
    transaction.streak.findUnique({ where: { userId_initiativeId: { userId: submission.userId, initiativeId: submission.initiativeId } } }),
    transaction.submission.findFirst({
      where: { userId: submission.userId, id: { not: submission.id }, task: { initiativeId: submission.initiativeId }, createdAt: { lt: submission.createdAt } },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);

  const today = dayStart(submission.createdAt).getTime();
  const previousDay = previous ? dayStart(previous.createdAt).getTime() : undefined;
  const oneDay = 24 * 60 * 60 * 1000;
  const currentCount = previousDay === today
    ? (existing?.currentCount ?? 1)
    : previousDay === today - oneDay
      ? (existing?.currentCount ?? 0) + 1
      : 1;

  return transaction.streak.upsert({
    where: { userId_initiativeId: { userId: submission.userId, initiativeId: submission.initiativeId } },
    update: { currentCount },
    create: { userId: submission.userId, initiativeId: submission.initiativeId, currentCount },
  });
}
