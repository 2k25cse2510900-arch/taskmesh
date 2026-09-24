import { EvaluationSource, PrismaClient, MembershipRole, SubmissionStatus, SubmissionType, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const leader = await prisma.user.upsert({
    where: { email: "maya.leader@taskmesh.demo" },
    update: { name: "Maya Patel", role: UserRole.LEADER },
    create: { email: "maya.leader@taskmesh.demo", name: "Maya Patel", role: UserRole.LEADER },
  });

  const students = await Promise.all([
    ["aisha.student@taskmesh.demo", "Aisha Khan"],
    ["rahul.student@taskmesh.demo", "Rahul Verma"],
    ["neha.student@taskmesh.demo", "Neha Singh"],
    ["arjun.student@taskmesh.demo", "Arjun Mehta"],
  ].map(([email, name]) => prisma.user.upsert({
    where: { email },
    update: { name, role: UserRole.STUDENT },
    create: { email, name, role: UserRole.STUDENT },
  })));

  const communication = await prisma.initiative.upsert({
    where: { name: "Communication" },
    update: {},
    create: {
      name: "Communication",
      description: "Build confidence through short daily speaking and writing tasks.",
      submissionType: "text-or-video",
      taskType: "daily-practice",
      evaluationRubric: { clarity: 40, structure: 30, confidence: 30 },
      scoringRules: { maxScore: 100 },
      schedule: { cadence: "daily" },
      rules: { lateSubmissionAllowed: true },
    },
  });
  const dsa = await prisma.initiative.upsert({
    where: { name: "DSA" },
    update: {},
    create: {
      name: "DSA",
      description: "Strengthen data structures and algorithms through daily problems.",
      submissionType: "text-or-link",
      taskType: "daily-problem",
      evaluationRubric: { correctness: 60, explanation: 40 },
      scoringRules: { maxScore: 100 },
      schedule: { cadence: "daily" },
      rules: { lateSubmissionAllowed: true },
    },
  });

  for (const initiative of [communication, dsa]) {
    await prisma.initiativeMember.upsert({
      where: { userId_initiativeId: { userId: leader.id, initiativeId: initiative.id } },
      update: { role: MembershipRole.LEADER },
      create: { userId: leader.id, initiativeId: initiative.id, role: MembershipRole.LEADER },
    });
    for (const student of students) {
      await prisma.initiativeMember.upsert({
        where: { userId_initiativeId: { userId: student.id, initiativeId: initiative.id } },
        update: { role: MembershipRole.MEMBER },
        create: { userId: student.id, initiativeId: initiative.id, role: MembershipRole.MEMBER },
      });
    }
  }

  const communicationTask = await prisma.task.upsert({
    where: { initiativeId_title: { initiativeId: communication.id, title: "Explain a personal achievement" } },
    update: {},
    create: { initiativeId: communication.id, title: "Explain a personal achievement", description: "Write a clear 150-word explanation.", dueAt: new Date() },
  });
  const dsaTask = await prisma.task.upsert({
    where: { initiativeId_title: { initiativeId: dsa.id, title: "Two Sum with explanation" } },
    update: {},
    create: { initiativeId: dsa.id, title: "Two Sum with explanation", description: "Submit an approach, complexity, and implementation link.", dueAt: new Date() },
  });

  const submissions = await Promise.all([
    prisma.submission.upsert({ where: { taskId_userId: { taskId: communicationTask.id, userId: students[0].id } }, update: {}, create: { taskId: communicationTask.id, userId: students[0].id, content: "I led a campus volunteer drive by setting a clear goal and coordinating a small team.", type: SubmissionType.TEXT, status: SubmissionStatus.EVALUATED } }),
    prisma.submission.upsert({ where: { taskId_userId: { taskId: communicationTask.id, userId: students[1].id } }, update: {}, create: { taskId: communicationTask.id, userId: students[1].id, content: "I improved our club event turnout by using a simple communication plan.", type: SubmissionType.TEXT, status: SubmissionStatus.EVALUATED } }),
    prisma.submission.upsert({ where: { taskId_userId: { taskId: dsaTask.id, userId: students[2].id } }, update: {}, create: { taskId: dsaTask.id, userId: students[2].id, content: "Used a hash map for O(n) time and explained the trade-off.", type: SubmissionType.CODE, status: SubmissionStatus.EVALUATED } }),
  ]);

  await Promise.all([
    prisma.evaluation.upsert({ where: { submissionId: submissions[0].id }, update: { score: 88, strengths: ["Clear structure"], weaknesses: ["Could add more evidence"], feedback: "Demo fallback evaluation — no external AI service was called.", improvements: ["Add a supporting example"], source: EvaluationSource.DEMO }, create: { submissionId: submissions[0].id, score: 88, strengths: ["Clear structure"], weaknesses: ["Could add more evidence"], feedback: "Demo fallback evaluation — no external AI service was called.", improvements: ["Add a supporting example"], source: EvaluationSource.DEMO } }),
    prisma.evaluation.upsert({ where: { submissionId: submissions[1].id }, update: { score: 79, strengths: ["Relevant example"], weaknesses: ["Conclusion is brief"], feedback: "Demo fallback evaluation — no external AI service was called.", improvements: ["Strengthen the conclusion"], source: EvaluationSource.DEMO }, create: { submissionId: submissions[1].id, score: 79, strengths: ["Relevant example"], weaknesses: ["Conclusion is brief"], feedback: "Demo fallback evaluation — no external AI service was called.", improvements: ["Strengthen the conclusion"], source: EvaluationSource.DEMO } }),
    prisma.evaluation.upsert({ where: { submissionId: submissions[2].id }, update: { score: 92, strengths: ["Correct approach"], weaknesses: ["Could show an edge case"], feedback: "Demo fallback evaluation — no external AI service was called.", improvements: ["Add an edge-case example"], source: EvaluationSource.DEMO }, create: { submissionId: submissions[2].id, score: 92, strengths: ["Correct approach"], weaknesses: ["Could show an edge case"], feedback: "Demo fallback evaluation — no external AI service was called.", improvements: ["Add an edge-case example"], source: EvaluationSource.DEMO } }),
  ]);

  await Promise.all([
    prisma.leaderboardEntry.upsert({ where: { userId_initiativeId: { userId: students[0].id, initiativeId: communication.id } }, update: { score: 88, rank: 1 }, create: { userId: students[0].id, initiativeId: communication.id, score: 88, rank: 1 } }),
    prisma.leaderboardEntry.upsert({ where: { userId_initiativeId: { userId: students[1].id, initiativeId: communication.id } }, update: { score: 79, rank: 2 }, create: { userId: students[1].id, initiativeId: communication.id, score: 79, rank: 2 } }),
    prisma.leaderboardEntry.upsert({ where: { userId_initiativeId: { userId: students[2].id, initiativeId: dsa.id } }, update: { score: 92, rank: 1 }, create: { userId: students[2].id, initiativeId: dsa.id, score: 92, rank: 1 } }),
    prisma.streak.upsert({ where: { userId_initiativeId: { userId: students[0].id, initiativeId: communication.id } }, update: { currentCount: 4 }, create: { userId: students[0].id, initiativeId: communication.id, currentCount: 4 } }),
    prisma.streak.upsert({ where: { userId_initiativeId: { userId: students[2].id, initiativeId: dsa.id } }, update: { currentCount: 3 }, create: { userId: students[2].id, initiativeId: dsa.id, currentCount: 3 } }),
  ]);

  await prisma.report.upsert({
    where: { id: "64b000000000000000000001" },
    update: { summary: "Communication members completed two evaluated submissions.", data: { activeMembers: 4, averageScore: 83.5 } },
    create: { id: "64b000000000000000000001", initiativeId: communication.id, summary: "Communication members completed two evaluated submissions.", data: { activeMembers: 4, averageScore: 83.5 } },
  });
}

main().then(() => prisma.$disconnect()).catch(async (error: unknown) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
