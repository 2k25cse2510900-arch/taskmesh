"use client";

import Link from "next/link";
import { SignIn as ClerkSignIn, SignUp as ClerkSignUp } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronRight,
  LineChart,
  ListTodo,
  Sparkles,
  Users2,
  Zap
} from "lucide-react";
import { HeroHeader } from "@/components/layout/shells";
import { Avatar, Badge, Button, Card, InlineStat, Input, MetricCard, Progress, SectionHeader, Textarea } from "@/components/ui";
import { HorizontalBars, MiniLineChart } from "@/components/charts";
import {
  activeTasks,
  consistencyData,
  currentLeader,
  currentStudent,
  feedback,
  groups,
  initiatives,
  leaderChart,
  leaderGroups,
  leaderMetrics,
  leaderboard,
  notifications,
  progressData,
  skillScores,
  submissions,
  todayTask
} from "@/mock";
import { cn, formatPercent } from "@/lib/utils";
import type { Initiative, Task } from "@/types";

type DatabaseInitiative = { id: string; slug: string; title: string; category: string };
type DatabaseTask = { id: string; initiativeId: string; title: string; description: string; dueAt: string | null; submissionTypes: string[]; initiative: DatabaseInitiative };

function initiativeKind(initiative: Pick<DatabaseInitiative, "slug" | "title" | "category">) {
  const label = `${initiative.slug} ${initiative.title} ${initiative.category}`.toLowerCase();
  if (/\benglish\b/.test(label)) return "english";
  if (/\bdsa\b|data structures|algorithms?/.test(label)) return "dsa";
  return null;
}

function taskKind(task: Pick<DatabaseTask, "submissionTypes" | "initiative">) {
  if (task.submissionTypes.includes("VIDEO") && initiativeKind(task.initiative) === "english") return "english";
  if (task.submissionTypes.includes("CODE") && initiativeKind(task.initiative) === "dsa") return "dsa";
  return null;
}

function presentTask(task: DatabaseTask): Task {
  return { id: task.id, initiativeId: task.initiativeId, title: task.title, description: task.description, due: task.dueAt ? new Date(task.dueAt).toLocaleString() : "No due date", dueLabel: task.dueAt ? "Scheduled" : "No due date", difficulty: "Medium", progress: 0, status: "In progress", submissionType: task.submissionTypes.map((type) => type.toLowerCase() as Task["submissionType"][number]), rubric: [] };
}

export function LandingPage() {
  return (
    <main className="text-slate-950">
      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-16 pt-10 lg:grid-cols-[1.06fr_0.94fr] lg:px-8 lg:pb-20 lg:pt-16">
        <div className="max-w-3xl">
          <Badge tone="slate" className="mb-5">AI-powered growth operations</Badge>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 md:text-7xl">
            Run initiatives,
            <span className="block text-slate-600">track progress, and keep feedback structured.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            TaskMesh helps participants complete recurring work, submit in the right format, and receive rubric-based feedback while leaders keep cohorts organized and visible.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href="/sign-up">
                Start a workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="#how">See the workflow</a>
            </Button>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <InlineStat label="Primary users" value="Participants + leaders" subtext="One product for both sides of the workflow" />
            <InlineStat label="Submission formats" value="Text, code, media" subtext="Supports the output type each task needs" />
            <InlineStat label="Feedback model" value="AI rubric review" subtext="Structured guidance after each submission" />
          </div>
        </div>

        <Card className="overflow-hidden border-slate-200 bg-slate-950 p-0 text-white shadow-[0_30px_90px_-36px_rgba(15,23,42,0.7)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_70%_30%,rgba(20,184,166,0.12),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(15,23,42,0.92))]" />
          <div className="relative p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/50">Workspace map</p>
                <p className="mt-2 text-lg font-semibold">Everything stays in one flow</p>
              </div>
              <Badge tone="green">Ready</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: "Initiatives", text: "Organize cohorts, rules, and cadence." },
                { title: "Tasks", text: "Publish recurring work with clear due dates." },
                { title: "Submissions", text: "Handle text, code, files, audio, and video." },
                { title: "Evaluation", text: "Turn AI review into structured feedback." }
              ].map((item) => (
                <div key={item.title} className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/68">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-[24px] border border-white/10 bg-white/6 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/50">Attention layer</p>
                  <p className="mt-1 text-sm font-medium text-white">What needs action next</p>
                </div>
                <Badge tone="slate">Participant + leader views</Badge>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/8 p-3">
                  <p className="text-xs text-white/55">Today</p>
                  <p className="mt-2 text-sm font-medium text-white">Task due</p>
                </div>
                <div className="rounded-2xl bg-white/8 p-3">
                  <p className="text-xs text-white/55">Feedback</p>
                  <p className="mt-2 text-sm font-medium text-white">Review ready</p>
                </div>
                <div className="rounded-2xl bg-white/8 p-3">
                  <p className="text-xs text-white/55">Leaders</p>
                  <p className="mt-2 text-sm font-medium text-white">Cohort health</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <SectionHeader
          eyebrow="Why TaskMesh"
          title="A coherent system for practice, review, and accountability"
          description="The product is organized around the actual workflow: assign, submit, evaluate, improve, and report."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["Task flow", "Recurring work, due dates, completion state, and supported submission types stay obvious at every step.", ListTodo],
            ["Structured feedback", "AI evaluation is presented as a report with scores, strengths, and next-step guidance.", Sparkles],
            ["Growth tracking", "Progress, streaks, ranking, and skill trends live in one consistent dashboard.", LineChart],
            ["Private groups", "Invite-only pods keep cohorts focused without exposing the rest of the workspace.", Users2],
            ["Leader insight", "Spot engagement gaps, watch initiative health, and triage attention with clarity.", BarChart3],
            ["Notification hub", "Reminders, feedback, announcements, and system updates are categorized in one place.", Bell]
          ].map(([title, description, Icon]) => (
            <Card key={title as string} className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-soft">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-950">{title as string}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description as string}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <SectionHeader
          eyebrow="How it works"
          title="A workflow that keeps users moving without clutter"
          description="TaskMesh is designed so participants know what to do next and leaders know what needs attention."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {[
            ["Join an initiative", "Pick a cohort or receive an invite from a leader."],
            ["Complete today's task", "Work in text, code, media, or files as needed."],
            ["Submit and evaluate", "The submission moves through a clear evaluation state."],
            ["Review progress", "Dashboards, streaks, and analytics update in one place."]
          ].map((step, index) => (
            <Card key={step[0]} className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">0{index + 1}</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-950">{step[0]}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step[1]}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="initiatives" className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <SectionHeader
          eyebrow="Initiative examples"
          title="Adaptable enough for coding, communication, and habit programs"
          description="The same structure supports different skills without changing the mental model."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {initiatives.map((initiative) => (
            <InitiativeCard key={initiative.id} initiative={initiative} />
          ))}
        </div>
      </section>

      <section id="insights" className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
        <Card className="overflow-hidden border-slate-200 !bg-white p-0 text-slate-950">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-8">
              <Badge tone="green">Participant and leader views</Badge>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
                Built to feel like one product, not two separate dashboards.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                Participants get clear next actions and trusted feedback. Leaders get health, engagement, and initiative management in the same system.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/sign-up">Start a workspace</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/leader/dashboard">Open leader view</Link>
                </Button>
              </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-50 p-8 lg:border-l lg:border-t-0">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Recurring task rhythm",
                  "AI evaluation reports",
                  "Private sub-groups",
                  "Role-based navigation",
                  "Progress and streak tracking",
                  "Notification center"
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}

export function SignInView() {
  return (
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-[1.02fr_0.98fr]">
      <div className="relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_15%,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_85%_80%,rgba(20,184,166,0.12),transparent_30%),linear-gradient(145deg,#0f172a_0%,#111827_100%)] px-6 py-12 text-white">
        <div className="absolute -right-24 top-20 h-56 w-56 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full border border-white/10" />
        <div className="relative w-full max-w-xl taskmesh-enter">
          <Badge tone="green" className="mb-5">Welcome back</Badge>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Return to your workspace.</h1>
          <p className="mt-4 text-base leading-7 text-white/70">Pick up active tasks, review new feedback, or switch into leader mode without losing context.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Tasks", "Today's work"],
              ["Feedback", "Ready to review"],
              ["Groups", "Private pods"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-[24px] border border-white/10 bg-white/8 p-4">
                <p className="text-xs text-white/55">{label}</p>
                <p className="mt-2 text-sm font-medium text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center border-l border-slate-200/70 bg-white px-6 py-12">
        <ClerkSignIn routing="path" path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/app/dashboard" />
      </div>
    </div>
  );
}

export function SignUpView() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.10),transparent_32%),linear-gradient(180deg,#f7f8ff_0%,#ffffff_60%)] px-6 py-12">
        <ClerkSignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/app/dashboard" />
      </div>
      <div className="flex items-center justify-center bg-slate-950 px-6 py-12 text-white">
        <div className="max-w-xl">
          <Badge tone="green" className="mb-5">For leaders</Badge>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Set a cadence people can actually follow.</h1>
          <p className="mt-4 text-base leading-7 text-white/70">Define work, track participation, review submissions, and keep private groups aligned inside the same workspace.</p>
        </div>
      </div>
    </div>
  );
}

function InitiativeCard({ initiative }: { initiative: Initiative }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden p-0">
      <div className={cn("min-h-[236px] bg-gradient-to-br p-5", initiative.color)}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge tone={initiative.accent.includes("green") ? "green" : "orange"}>{initiative.category}</Badge>
            <h3 className="mt-4 text-2xl font-semibold text-slate-950">{initiative.title}</h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{initiative.description}</p>
          </div>
          <Badge tone="slate">{initiative.privacy}</Badge>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <InlineStat label="Members" value={initiative.members.toString()} />
          <InlineStat label="Difficulty" value={initiative.difficulty} />
          <InlineStat label="Duration" value={initiative.duration} />
          <InlineStat label="Completion" value={formatPercent(initiative.completionRate)} />
        </div>
      </div>
      <div className="mt-auto space-y-3 p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Popularity</span>
          <span className="font-medium text-slate-950">{initiative.rating.toFixed(1)} / 5</span>
        </div>
        <Progress value={initiative.completionRate} />
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Leader: {initiative.owner}</span>
          <Link href={`/app/initiatives/${initiative.id}`} className="inline-flex items-center gap-1 font-medium text-orange-600">
            Explore
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}

export function StudentWorkspace({ slug }: { slug: string[] }) {
  const section = slug[0] ?? "dashboard";

  if (section === "initiatives") {
    if (slug.length > 1) {
      return <DetailInitiative initiative={initiatives.find((item) => item.id === slug[1]) ?? initiatives[0]} role="student" />;
    }

    return (
      <div className="space-y-8">
        <HeroHeader
          title="Discover initiatives that match how you want to grow."
          subtitle="Browse public initiatives, filter by skill and difficulty, and join accountability spaces that fit your goals."
          actions={
            <>
              <Button variant="outline" asChild><Link href="/app/initiatives">Browse all</Link></Button>
              <Button asChild><Link href="/app/initiatives#recommended">Join an initiative</Link></Button>
            </>
          }
        />
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-5">
            <div className="flex flex-wrap gap-2">
              {["Skill", "Difficulty", "Duration", "Category", "Frequency"].map((item) => (
                <Badge key={item} tone="slate">
                  {item}
                </Badge>
              ))}
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {initiatives.map((item) => (
                <InitiativeCard key={item.id} initiative={item} />
              ))}
            </div>
          </Card>
          <div className="space-y-5">
            <Card id="recommended" className="p-5">
              <p className="text-sm font-medium text-slate-950">Recommended for you</p>
              <div className="mt-4 space-y-3">
                {initiatives.slice(0, 3).map((item) => (
                  <MiniInitiative key={item.id} item={item} />
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <p className="text-sm font-medium text-slate-950">My initiatives</p>
              <div className="mt-4 space-y-3">
                {groups.map((group) => (
                  <div key={group.id} className="rounded-2xl border border-slate-200 p-4">
                    <p className="font-medium text-slate-950">{group.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{group.members} members | Rank #{group.leaderboardRank}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (section === "tasks") {
    if (slug.length > 1) {
      return <TaskDetail taskId={slug[1]} />;
    }
    return (
      <div className="space-y-8">
        <HeroHeader title="Tasks" subtitle="Track what needs to be done today, this week, and across each initiative." />
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-5">
            <SectionHeader title="Today's tasks" description="Your current focus items across active initiatives." />
            <div className="mt-5 space-y-4">
              {activeTasks.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <SectionHeader title="Submission types" description="TaskMesh supports multiple output formats." />
            <div className="mt-5 space-y-3">
              {[
                ["Code", "Repository links, snippets, and coding exercises"],
                ["Audio", "Voice notes, spoken explanations, and interviews"],
                ["Video", "Screen recordings and presentation uploads"],
                ["Text", "Reflections, answers, and written submissions"],
                ["File", "Documents, PDFs, and slide decks"]
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl border border-slate-200 p-4">
                  <p className="font-medium text-slate-950">{title}</p>
                  <p className="mt-1 text-sm text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (section === "submissions") {
    if (slug.length > 1) return <SubmissionDetail submissionId={slug[1]} />;
    return <SubmissionsPage />;
  }

  if (section === "evaluation") {
    return <EvaluationPage submissionId={slug[1] ?? "sub-01"} />;
  }

  if (section === "progress") {
    return <ProgressPage />;
  }

  if (section === "leaderboard") {
    return <LeaderboardPage />;
  }

  if (section === "groups") {
    if (slug.length > 1) return <GroupDetail groupId={slug[1]} />;
    return <GroupsPage />;
  }

  if (section === "notifications") {
    return <NotificationsPage />;
  }

  if (section === "profile") {
    return <ProfilePage />;
  }

  if (section === "settings") {
    return <SettingsPage role="student" />;
  }

  return <DashboardPage role="student" />;
}

function MiniInitiative({ item }: { item: Initiative }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
      <div>
        <p className="font-medium text-slate-950">{item.title}</p>
        <p className="mt-1 text-sm text-slate-500">{item.skill} | {item.taskFrequency}</p>
      </div>
      <Link href={`/app/initiatives/${item.id}`} className="text-sm font-medium text-orange-600">
        Open
      </Link>
    </div>
  );
}

function TaskRow({ task }: { task: (typeof activeTasks)[number] }) {
  return (
    <div className="rounded-3xl border border-slate-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone={task.status === "Submitted" ? "green" : task.status === "Pending" ? "slate" : "orange"}>{task.status}</Badge>
            <Badge tone="orange">{task.difficulty}</Badge>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-slate-950">{task.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{task.description}</p>
        </div>
        <Link href={`/app/tasks/${task.id}`} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm text-white">
          Continue
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <InlineStat label="Due" value={task.dueLabel} />
        <InlineStat label="Progress" value={formatPercent(task.progress)} />
        <InlineStat label="Accepted types" value={task.submissionType.join(", ")} />
      </div>
    </div>
  );
}

export function DashboardPage({ role }: { role?: "student" | "leader" }) {
  const activeRole = role ?? "student";

  if (activeRole === "leader") {
    return <LeaderDashboard />;
  }

  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader
        title={`${currentStudent.headline}.`}
        subtitle={currentStudent.subtitle}
        actions={
          <>
            <Button variant="outline" asChild><Link href="/app/tasks">Today&apos;s plan</Link></Button>
            <Button asChild><Link href={`/app/tasks/${todayTask.id}`}>Continue task</Link></Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Current streak" value="12 days" delta="+3" tone="orange" />
        <MetricCard label="Weekly consistency" value="86%" delta="+7%" tone="green" />
        <MetricCard label="Average score" value="87" delta="+4" />
        <MetricCard label="Leaderboard rank" value="#08" delta="+2" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-0">
          <div className="border-b border-slate-200 p-5">
            <SectionHeader
              eyebrow="Today"
              title="Today's task"
              description={todayTask.description}
              action={<Badge tone="orange">{todayTask.difficulty}</Badge>}
            />
          </div>
          <div className="space-y-5 p-5">
            <div className="grid gap-3 md:grid-cols-4">
              <InlineStat label="Initiative" value="30 Days of DSA" />
              <InlineStat label="Due" value={todayTask.dueLabel} />
              <InlineStat label="Status" value={todayTask.status} />
              <InlineStat label="Submission" value={todayTask.submissionType.join(", ")} />
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-950">{todayTask.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{todayTask.description}</p>
                </div>
                <Badge tone="green">{todayTask.progress}% complete</Badge>
              </div>
              <Progress value={todayTask.progress} className="mt-4" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild><Link href={`/app/tasks/${todayTask.id}`}>Continue task</Link></Button>
              <Button variant="outline" asChild><Link href={`/app/tasks/${todayTask.id}#rubric`}>View rubric</Link></Button>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader eyebrow="Momentum" title="Recent feedback" description="AI evaluation in a structured, human-readable format." />
          <div className="mt-5 space-y-4">
            {feedback.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={currentStudent.name} />
                    <div>
                      <p className="font-medium text-slate-950">{item.summary.slice(0, 42)}...</p>
              <p className="text-sm text-slate-500">Score {item.score} | {item.tone}</p>
                    </div>
                  </div>
                  <Link href={`/app/evaluation/${item.submissionId}`} className="text-sm font-medium text-orange-600">Open</Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <MiniLineChart data={progressData} />
        <HorizontalBars data={skillScores} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-5">
          <SectionHeader eyebrow="Active initiatives" title="Continue where your momentum is strongest." />
          <div className="mt-5 space-y-3">
            {initiatives.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                <div>
                  <p className="font-medium text-slate-950">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.members} members | {item.streakLeader} leads the streaks</p>
                </div>
                <div className="w-40">
                  <Progress value={item.completionRate} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <SectionHeader eyebrow="Leaderboard" title="You're close to the top ten." />
          <div className="mt-5 space-y-3">
            {leaderboard.map((entry) => (
              <div key={entry.rank} className={cn("flex items-center justify-between rounded-2xl border p-4", entry.name === currentStudent.name ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200")}>
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl font-semibold", entry.name === currentStudent.name ? "bg-white text-slate-950" : "bg-slate-100 text-slate-700")}>{entry.avatar}</div>
                  <div>
                    <p className="font-medium">{entry.name}</p>
                    <p className={cn("text-sm", entry.name === currentStudent.name ? "text-white/70" : "text-slate-500")}>{entry.initiative}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{entry.score}</p>
                  <p className={cn("text-sm", entry.name === currentStudent.name ? "text-white/70" : "text-slate-500")}>{entry.streak} day streak</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function DetailInitiative({ initiative, role }: { initiative: Initiative; role: "student" | "leader" }) {
  const [joinState, setJoinState] = useState<"idle" | "joining" | "joined" | "error">("idle");
  const [joinError, setJoinError] = useState<string | null>(null);
  const fixtureKind = initiative.id === "speaking-club" ? "english" : initiative.id === "dsa-30" ? "dsa" : null;
  const [databaseInitiative, setDatabaseInitiative] = useState<DatabaseInitiative | null>(null);
  const [databaseTask, setDatabaseTask] = useState<DatabaseTask | null>(null);
  const [taskLoadError, setTaskLoadError] = useState<string | null>(null);
  useEffect(() => {
    if (!fixtureKind || role !== "student") return;
    let cancelled = false;
    async function loadSubmissionTask() {
      setTaskLoadError(null);
      setDatabaseTask(null);
      try {
        const initiativesResponse = await fetch("/api/initiatives");
        const initiativesBody = await initiativesResponse.json() as { error?: string; initiatives?: DatabaseInitiative[] };
        if (!initiativesResponse.ok || !initiativesBody.initiatives) throw new Error(initiativesBody.error ?? "Could not load initiatives");
        const matchedInitiative = initiativesBody.initiatives.find((item) => initiativeKind(item) === fixtureKind);
        if (!matchedInitiative) throw new Error(`No published ${fixtureKind === "dsa" ? "DSA" : "English"} initiative is available`);
        if (cancelled) return;
        setDatabaseInitiative(matchedInitiative);
        const tasksResponse = await fetch(`/api/tasks?initiativeId=${encodeURIComponent(matchedInitiative.id)}`);
        const tasksBody = await tasksResponse.json() as { error?: string; tasks?: DatabaseTask[] };
        if (!tasksResponse.ok || !tasksBody.tasks) throw new Error(tasksBody.error ?? "Could not load your initiative tasks");
        const matchedTask = tasksBody.tasks.find((item) => taskKind(item) === fixtureKind);
        if (!matchedTask) throw new Error(`No published ${fixtureKind === "dsa" ? "code" : "video"} task is available to your account`);
        if (!cancelled) setDatabaseTask(matchedTask);
      } catch (error) {
        if (!cancelled) setTaskLoadError(error instanceof Error ? error.message : "Could not load your submission task");
      }
    }
    void loadSubmissionTask();
    return () => { cancelled = true; };
  }, [fixtureKind, joinState, role]);
  async function handleJoin() {
    setJoinState("joining");
    setJoinError(null);
    try {
      const initiativeId = databaseInitiative?.id;
      if (!initiativeId) throw new Error("The real initiative is still loading");
      const response = await fetch(`/api/initiatives/${initiativeId}/join`, { method: "POST" });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Could not join this initiative");
      setJoinState("joined");
    } catch (error) {
      setJoinState("error");
      setJoinError(error instanceof Error ? error.message : "Could not join this initiative");
    }
  }
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader
        title={initiative.title}
        subtitle={initiative.description}
        actions={
          <>
            <Badge tone={initiative.privacy === "Private" ? "slate" : "green"}>{initiative.privacy}</Badge>
            {role === "student" ? <>
              <Button variant={joinState === "joined" ? "success" : "primary"} onClick={() => void handleJoin()} disabled={joinState === "joining" || joinState === "joined" || (fixtureKind !== null && !databaseInitiative)}>{joinState === "joining" ? "Joining..." : joinState === "joined" ? "Joined" : "Join initiative"}</Button>
              {databaseTask ? <Button variant="outline" asChild><Link href={`/app/tasks/${databaseTask.id}`}>{fixtureKind === "english" ? "Write in English" : "Write code"}</Link></Button> : null}
            </> : <Button asChild><Link href={`/leader/initiatives/${initiative.id}/analytics`}>View analytics</Link></Button>}
          </>
        }
      />
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Goal</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{initiative.goal}</p>
            </div>
            <Badge tone="orange">{initiative.stage}</Badge>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <InlineStat label="Skill" value={initiative.skill} />
            <InlineStat label="Frequency" value={initiative.taskFrequency} />
            <InlineStat label="Members" value={initiative.members.toString()} />
          </div>
          <div className="mt-6">
            <Progress value={initiative.completionRate} />
            <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
              <span>{initiative.completionRate}% completion</span>
              <span>{initiative.activeMembers} active this week</span>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-950">{role === "student" ? "Why this fits you" : "Management snapshot"}</p>
          <div className="mt-4 space-y-3">
            {[
              "Clear task rhythm with daily completion signals",
              "AI feedback turns submissions into actionable tips",
              "Leaderboard energy keeps practice visible",
              "Private groups support small cohort accountability"
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
                <p className="text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {joinError ? <p className="text-sm text-red-700" role="alert">{joinError}</p> : null}
      {taskLoadError ? <p className="text-sm text-red-700" role="alert">{taskLoadError}</p> : null}
    </div>
  );
}

export function TaskDetail({ taskId }: { taskId: string }) {
  const fixtureTask = activeTasks.find((item) => item.id === taskId);
  const fixtureKind = fixtureTask?.initiativeId === "speaking-club" ? "english" : fixtureTask?.initiativeId === "dsa-30" ? "dsa" : null;
  const [databaseTask, setDatabaseTask] = useState<DatabaseTask | null>(null);
  const [taskError, setTaskError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    async function loadTask() {
      try {
        const response = await fetch("/api/tasks");
        const body = await response.json() as { error?: string; tasks?: DatabaseTask[] };
        if (!response.ok || !body.tasks) throw new Error(body.error ?? "Could not load your task");
        const matchedTask = body.tasks.find((item) => item.id === taskId) ?? body.tasks.find((item) => taskKind(item) === fixtureKind);
        if (!matchedTask) throw new Error("This task is unavailable or you are not an active member");
        if (!cancelled) setDatabaseTask(matchedTask);
      } catch (error) {
        if (!cancelled) setTaskError(error instanceof Error ? error.message : "Could not load your task");
      }
    }
    void loadTask();
    return () => { cancelled = true; };
  }, [fixtureKind, taskId]);
  const task = databaseTask ? presentTask(databaseTask) : fixtureTask;
  const [submissionState, setSubmissionState] = useState<"idle" | "uploading" | "submitting" | "transcribing" | "submitted">("idle");
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("Java");
  const [video, setVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [review, setReview] = useState<{ summary: string; strengths: string[]; weaknesses: string[]; recommendations: string[] } | null>(null);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);
  const isDsaTask = (databaseTask ? taskKind(databaseTask) : fixtureKind) === "dsa";
  const isEnglishTask = (databaseTask ? taskKind(databaseTask) : fixtureKind) === "english";
  async function requestReview(id: string) {
    try {
      const reviewResponse = await fetch(`/api/submissions/${id}/evaluate`, { method: "POST" });
      const reviewBody = await reviewResponse.json() as { error?: string; evaluation?: { summary: string; strengths: string[]; weaknesses: string[]; recommendations: string[] } };
      if (reviewResponse.ok && reviewBody.evaluation) setReview(reviewBody.evaluation);
      else setReviewMessage(reviewBody.error ?? "AI review is not available for this submission yet.");
    } catch {
      setReviewMessage("AI review is not available for this submission yet.");
    }
  }

  async function uploadVideo(file: File) {
    if (file.size > 25 * 1024 * 1024) throw new Error("Choose a video up to 25 MB so it can be transcribed.");
    const signatureResponse = await fetch("/api/uploads/sign", { method: "POST" });
    const signature = await signatureResponse.json() as { error?: string; cloudName?: string; apiKey?: string; folder?: string; timestamp?: number; signature?: string };
    if (!signatureResponse.ok || !signature.cloudName || !signature.apiKey || !signature.folder || !signature.timestamp || !signature.signature) throw new Error(signature.error ?? "Video uploads are not configured");
    const form = new FormData();
    form.append("file", file);
    form.append("api_key", signature.apiKey);
    form.append("folder", signature.folder);
    form.append("timestamp", String(signature.timestamp));
    form.append("signature", signature.signature);
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/video/upload`, { method: "POST", body: form });
    const uploaded = await uploadResponse.json() as { error?: { message?: string }; public_id?: string; secure_url?: string; resource_type?: string; format?: string; bytes?: number; duration?: number; width?: number; height?: number };
    if (!uploadResponse.ok || !uploaded.public_id || !uploaded.secure_url) throw new Error(uploaded.error?.message ?? "Video upload failed");
    return uploaded;
  }

  async function handleSubmit() {
    setSubmissionState(isEnglishTask ? "uploading" : "submitting");
    setSubmissionError(null);
    setReview(null);
    setReviewMessage(null);
    let submissionWasSaved = false;
    try {
      const uploaded = isEnglishTask && video ? await uploadVideo(video) : null;
      setSubmissionState("submitting");
      if (!databaseTask) throw new Error("Your real task is still loading");
      const response = await fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ taskId: databaseTask.id, content: isDsaTask ? content : undefined, programmingLanguage: isDsaTask ? language : undefined, media: uploaded ? [{ publicId: uploaded.public_id, secureUrl: uploaded.secure_url, resourceType: uploaded.resource_type ?? "video", format: uploaded.format, bytes: uploaded.bytes, duration: uploaded.duration, width: uploaded.width, height: uploaded.height }] : [] }) });
      const body = await response.json() as { error?: string; submission?: { id: string } };
      if (!response.ok || !body.submission) throw new Error(body.error ?? "Could not save your submission");
      setSubmissionId(body.submission.id);
      submissionWasSaved = true;
      if (uploaded) {
        setVideoUrl(uploaded.secure_url);
        setSubmissionState("transcribing");
        const transcriptResponse = await fetch(`/api/submissions/${body.submission.id}/transcribe`, { method: "POST" });
        const transcriptBody = await transcriptResponse.json() as { error?: string; transcript?: string };
        if (!transcriptResponse.ok || !transcriptBody.transcript) throw new Error(transcriptBody.error ?? "Video transcription failed");
        setTranscript(transcriptBody.transcript);
      }
      await requestReview(body.submission.id);
      setSubmissionState("submitted");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not save your submission";
      if (submissionWasSaved) {
        setReviewMessage(message);
        setSubmissionState("submitted");
      } else {
        setSubmissionState("idle");
        setSubmissionError(message);
      }
    }
  }
  if (!task) return <Card className="p-5"><p className="text-sm text-slate-600">{taskError ?? "Loading your task..."}</p></Card>;
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader
        title={task.title}
        subtitle={task.description}
        actions={
          <>
            <Badge tone="orange">{task.difficulty}</Badge>
            <Button onClick={() => document.getElementById("submission")?.scrollIntoView({ behavior: "smooth" })}>Submit work</Button>
          </>
        }
      />
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-5">
          <SectionHeader eyebrow="Task" title="Task details" description="Keep the objective, submission format, and rubric in view while you work." />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <InlineStat label="Due" value={task.due} />
            <InlineStat label="Progress" value={formatPercent(task.progress)} />
            <InlineStat label="Submission types" value={task.submissionType.join(" / ")} />
            <InlineStat label="Status" value={task.status} />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[28px] bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-950">Objective</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{task.description}</p>
            </div>
            <div className="rounded-[28px] bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-950">Accepted formats</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{task.submissionType.join(", ")}</p>
            </div>
          </div>
          <div id="rubric" className="mt-5 rounded-[28px] bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-950">Rubric</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {task.rubric.map((item) => (
                <Badge key={item} tone="slate">{item}</Badge>
              ))}
            </div>
          </div>
        </Card>
        <Card id="submission" className="p-5">
          <p className="text-sm font-medium text-slate-950">Submission area</p>
          {submissionState === "submitted" ? <SubmissionProcessing task={task} submissionId={submissionId} content={content} language={language} videoUrl={videoUrl} transcript={transcript} review={review} reviewMessage={reviewMessage} /> : <div className="mt-4 space-y-3">
            {isEnglishTask ? <>
              <label className="block text-sm font-medium text-slate-950" htmlFor="english-video">English video</label>
              <input id="english-video" type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(event) => setVideo(event.target.files?.[0] ?? null)} className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white" />
              <p className="text-xs text-slate-500">MP4, WebM, or MOV; maximum 25 MB for transcription.</p>
            </> : <>
              <label className="block text-sm font-medium text-slate-950" htmlFor="programming-language">Programming language</label>
              <select id="programming-language" value={language} onChange={(event) => setLanguage(event.target.value)} className="h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none focus:border-primary focus:ring-4 focus:ring-ring/15"><option>Java</option><option>Python</option><option>JavaScript</option><option>C++</option></select>
              <label className="sr-only" htmlFor="submission-content">Your code</label>
              <textarea id="submission-content" value={content} onChange={(event) => setContent(event.target.value)} spellCheck={false} className="min-h-[280px] w-full rounded-2xl border border-slate-300 p-4 font-mono text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-ring/15" placeholder="Paste or write your code here..." />
            </>}
            <Button className="w-full" onClick={() => void handleSubmit()} disabled={!databaseTask || (isEnglishTask ? !video : !content.trim()) || submissionState !== "idle"}>{submissionState === "uploading" ? "Uploading video..." : submissionState === "transcribing" ? "Transcribing video..." : submissionState === "submitting" ? "Saving..." : "Submit"}</Button>
            {submissionError || taskError ? <p className="text-sm text-red-700" role="alert">{submissionError ?? taskError}</p> : <p className="text-xs text-slate-500">{isEnglishTask ? "Your video will be saved, transcribed, and sent for review." : "Your code and language will be saved, then sent for review without being executed."}</p>}
          </div>}
        </Card>
      </div>
    </div>
  );
}

function SubmissionProcessing({ task, submissionId, content, language, videoUrl, transcript, review, reviewMessage }: { task: Task; submissionId: string | null; content: string; language: string; videoUrl: string | null; transcript: string | null; review: { summary: string; strengths: string[]; weaknesses: string[]; recommendations: string[] } | null; reviewMessage: string | null }) {
  return <div className="mt-4 rounded-[28px] border border-slate-200 bg-slate-50 p-5 taskmesh-enter">
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
        <CheckCircle2 className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-slate-950">Submission saved</p>
        <p className="mt-1 text-sm text-slate-500">
          Your work is stored on the server. {review ? "Your AI review is ready below." : "AI review will appear here when a provider is configured."}
        </p>
      </div>
    </div>
    <div className="mt-5 grid gap-3 md:grid-cols-2">
      <InlineStat label="Submission" value={submissionId ? `#${submissionId.slice(0, 8)}` : "Saved"} />
      <InlineStat label="Next step" value={review ? "Review ready" : "Review pending"} />
    </div>
    <div className="mt-5 rounded-[22px] border border-dashed border-slate-300 bg-white p-4 text-sm leading-6 text-slate-600">
      {task.submissionType.includes("code") ? <><p className="font-medium text-slate-950">Your submitted {language} code</p><pre className="mt-2 whitespace-pre-wrap break-words font-mono text-sm text-slate-700">{content}</pre></> : <><p className="font-medium text-slate-950">Your submitted English video</p>{videoUrl ? <video className="mt-3 w-full rounded-2xl" controls src={videoUrl}>Your browser does not support video playback.</video> : null}{transcript ? <><p className="mt-4 font-medium text-slate-950">Transcript</p><p className="mt-2 whitespace-pre-wrap text-slate-700">{transcript}</p></> : null}</>}
    </div>
    {review ? <div className="mt-5 rounded-[22px] border border-green-100 bg-green-50 p-4 text-sm leading-6 text-slate-700"><p className="font-medium text-slate-950">AI review</p><p className="mt-2">{review.summary}</p><p className="mt-3 font-medium text-slate-950">Suggestions</p><ul className="mt-1 list-disc pl-5">{[...review.weaknesses, ...review.recommendations].map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
    {reviewMessage ? <p className="mt-4 text-sm text-slate-500">{reviewMessage}</p> : null}
  </div>;
}

export function SubmissionsPage() {
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader title="Submissions" subtitle="Review work status, submission type, and evaluation progress." />
      <Card className="p-5">
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge tone={submission.status === "Evaluated" ? "green" : "orange"}>{submission.status}</Badge>
                  <Badge tone="slate">{submission.channel}</Badge>
                </div>
                <p className="mt-3 font-medium text-slate-950">{submission.title}</p>
                <p className="mt-1 text-sm text-slate-500">Submitted {submission.submittedAt} | {submission.reviewer}</p>
              </div>
              <Link href={`/app/submissions/${submission.id}`} className="text-sm font-medium text-orange-600">
                Review
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function SubmissionDetail({ submissionId }: { submissionId: string }) {
  const submission = submissions.find((item) => item.id === submissionId) ?? submissions[0];
  const fb = feedback.find((item) => item.submissionId === submission.id) ?? feedback[0];
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader title={submission.title} subtitle={`Submission status: ${submission.status}.`} />
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-5">
          <SectionHeader eyebrow="Submission" title="Status and metadata" />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <InlineStat label="Submitted" value={submission.submittedAt} />
            <InlineStat label="Channel" value={submission.channel} />
            <InlineStat label="Reviewer" value={submission.reviewer} />
            <InlineStat label="Score" value={submission.score ? submission.score.toString() : "Pending"} />
          </div>
        </Card>
        <Card className="p-5">
          <SectionHeader eyebrow="Feedback" title="AI evaluation snapshot" />
          <p className="mt-4 text-sm leading-7 text-slate-600">{fb.summary}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Card className="bg-slate-50 p-4 shadow-none">
              <p className="text-sm font-medium text-slate-950">Strengths</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {fb.strengths.map((item) => <li key={item}>- {item}</li>)}
              </ul>
            </Card>
            <Card className="bg-slate-50 p-4 shadow-none">
              <p className="text-sm font-medium text-slate-950">Improve next</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {fb.improvements.map((item) => <li key={item}>- {item}</li>)}
              </ul>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function EvaluationPage({ submissionId }: { submissionId: string }) {
  const fb = feedback.find((item) => item.submissionId === submissionId) ?? feedback[0];
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 180);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader title="Evaluation" subtitle="Detailed AI review with scoring, strengths, and actionable tips." />
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Score</p>
              <p className={cn("mt-2 text-5xl font-semibold text-slate-950 transition-all duration-700", visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")}>{fb.score}</p>
            </div>
            <Badge tone="green">{fb.tone}</Badge>
          </div>
          <div className="mt-6">
            <Progress value={fb.score} />
          </div>
          <div className="mt-6 space-y-3">
            {fb.tips.map((tip) => (
              <div key={tip} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{tip}</div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-950">What the AI noticed</p>
          <div className="mt-4 space-y-4">
            {fb.strengths.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <p className="text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
            {fb.improvements.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <Zap className="mt-0.5 h-4 w-4 text-amber-600" />
                <p className="text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function ProgressPage() {
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader title="Progress" subtitle="See long-term consistency, trends, and milestones." />
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <MiniLineChart data={progressData} />
        <Card className="p-5">
          <SectionHeader eyebrow="Consistency" title="Weekly consistency" />
          <div className="mt-5 space-y-4">
            {consistencyData.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-800">{item.label}</span>
                  <span className="text-slate-500">{item.value}%</span>
                </div>
                <Progress value={item.value} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function LeaderboardPage() {
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader title="Leaderboard" subtitle="Competition stays healthy when progress is visible." />
      <Card className="p-5">
        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <div key={entry.rank} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 font-semibold text-slate-700">{entry.rank}</div>
                <Avatar name={entry.name} />
                <div>
                  <p className="font-medium text-slate-950">{entry.name}</p>
                  <p className="text-sm text-slate-500">{entry.initiative}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-950">{entry.score}</p>
                <p className="text-sm text-slate-500">{entry.streak} day streak</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function GroupsPage() {
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader title="Groups" subtitle="Private sub-groups for accountability, peer review, and focused cohorts." />
      <div className="grid gap-5 lg:grid-cols-2">
        {groups.map((group) => (
          <Card key={group.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-950">{group.name}</p>
                <p className="mt-1 text-sm text-slate-500">{group.description}</p>
              </div>
              <Badge tone="slate">Private</Badge>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <InlineStat label="Members" value={group.members.toString()} />
              <InlineStat label="Leaderboard" value={`#${group.leaderboardRank}`} />
              <InlineStat label="Initiative" value={group.initiativeId} />
            </div>
            <div className="mt-4 rounded-[24px] bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              <p className="font-medium text-slate-950">Group purpose</p>
              <p className="mt-1">Use private groups for peer review, support pods, or invite-only cohorts. A join code can be issued by the leader when the group is ready.</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function GroupDetail({ groupId }: { groupId: string }) {
  const group = groups.find((item) => item.id === groupId) ?? groups[0];
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader title={group.name} subtitle={group.description} />
      <Card className="p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <InlineStat label="Members" value={group.members.toString()} />
          <InlineStat label="Rank" value={`#${group.leaderboardRank}`} />
          <InlineStat label="Initiative" value={group.initiativeId} />
        </div>
      </Card>
    </div>
  );
}

export function NotificationsPage() {
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader title="Notifications" subtitle="Feedback, reminders, announcements, and milestone updates in one place." />
      <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <Card className="p-5">
          <SectionHeader eyebrow="Channels" title="Notification categories" description="Group updates by intent so important events do not disappear into noise." />
          <div className="mt-5 space-y-3">
            {[
              ["Feedback", "Evaluation results and AI review summaries"],
              ["Task reminders", "Due-date nudges and submission prompts"],
              ["Leader updates", "Announcements, cohort updates, and schedule changes"],
              ["System", "Account or workspace notices"]
            ].map(([label, description]) => (
              <div key={label} className="rounded-[24px] border border-slate-200 bg-white px-4 py-3">
                <p className="font-medium text-slate-950">{label}</p>
                <p className="mt-1 text-sm text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <SectionHeader eyebrow="Inbox" title="Recent updates" description="Unread and processed items can be separated by backend state when available." />
          <div className="mt-5 space-y-3">
            {notifications.map((item) => (
              <div key={item.id} className="rounded-[24px] border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge tone={item.kind === "feedback" ? "green" : item.kind === "leader" ? "slate" : "orange"}>{item.kind}</Badge>
                    <p className="font-medium text-slate-950">{item.title}</p>
                  </div>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function ProfilePage() {
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader title={currentStudent.name} subtitle={`${currentStudent.location} | ${currentStudent.plan}`} />
      <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <Card className="p-5">
          <Avatar name={currentStudent.name} className="h-16 w-16 text-lg" />
          <p className="mt-4 text-lg font-semibold text-slate-950">{currentStudent.name}</p>
          <p className="text-sm text-slate-500">Participant profile</p>
          <div className="mt-5 rounded-[24px] bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            <p className="font-medium text-slate-950">Account overview</p>
            <p className="mt-1">Profile settings, notifications, and organization metadata should be backed by the account service once the backend is connected.</p>
          </div>
        </Card>
        <Card className="p-5">
          <SectionHeader title="Profile settings" description="Keep the controls grouped by concern so this can grow into a full account area." />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <InlineStat label="Notifications" value="Enabled" />
            <InlineStat label="Theme" value="Warm neutral" />
            <InlineStat label="Language" value="English" />
            <InlineStat label="Timezone" value="IST" />
          </div>
        </Card>
      </div>
    </div>
  );
}

export function SettingsPage({ role }: { role: "student" | "leader" }) {
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader title="Settings" subtitle={role === "leader" ? "Manage initiative defaults and workspace preferences." : "Tune your experience and notification preferences."} />
      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="p-5">
          <SectionHeader eyebrow="Account" title="Profile" description="Identity, email, and workspace membership." />
          <div className="mt-5 space-y-4">
            <InlineStat label="Role" value={role} />
            <InlineStat label="Email" value="Connected" />
          </div>
        </Card>
        <Card className="p-5">
          <SectionHeader eyebrow="Preferences" title="Experience" description="Theme, language, and notification cadence." />
          <div className="mt-5 space-y-4">
            <InlineStat label="Theme" value="Warm neutral" />
            <InlineStat label="Notifications" value="Daily summary" />
          </div>
        </Card>
        <Card className="p-5">
          <SectionHeader eyebrow="Security" title="Access" description="Session controls and future authentication settings." />
          <div className="mt-5 space-y-4">
            <InlineStat label="Password" value="Managed externally" />
            <InlineStat label="MFA" value="Ready for backend" />
          </div>
        </Card>
      </div>
    </div>
  );
}

export function LeaderWorkspace({ slug }: { slug: string[] }) {
  const section = slug[0] ?? "dashboard";

  if (section === "initiatives") {
    if (slug.length > 2 && slug[2] === "tasks") return <LeaderInitiativeTasks initiativeId={slug[1]} />;
    if (slug.length > 2 && slug[2] === "members") return <LeaderInitiativeMembers initiativeId={slug[1]} />;
    if (slug.length > 2 && slug[2] === "analytics") return <LeaderInitiativeAnalytics initiativeId={slug[1]} />;
    if (slug.length > 2 && slug[2] === "reports") return <LeaderInitiativeReports initiativeId={slug[1]} />;
    if (slug.length > 1 && slug[1] === "create") return <LeaderCreateInitiative />;
    if (slug.length > 1) return <DetailInitiative initiative={initiatives.find((item) => item.id === slug[1]) ?? initiatives[0]} role="leader" />;
    return <LeaderInitiativesPage />;
  }

  if (section === "groups") return <LeaderGroupsPage />;
  if (section === "notifications") return <LeaderNotificationsPage />;
  if (section === "settings") return <SettingsPage role="leader" />;
  return <DashboardPage role="leader" />;
}

function LeaderDashboard() {
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader
        title={currentLeader.headline}
        subtitle={currentLeader.subtitle}
        actions={
          <>
            <Button variant="outline" asChild><Link href="/leader/notifications">Send announcement</Link></Button>
            <Button asChild><Link href="/leader/initiatives/create">Create initiative</Link></Button>
          </>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {leaderMetrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} value={metric.value} delta={metric.delta} tone={metric.label === "At-risk members" ? "orange" : "green"} />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <MiniLineChart data={leaderChart} />
        <Card className="p-5">
          <SectionHeader eyebrow="Groups" title="Private cohort health" />
          <div className="mt-5 space-y-4">
            {leaderGroups.map((group) => (
              <div key={group.name} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-950">{group.name}</p>
                  <Badge tone={group.completion > 85 ? "green" : "orange"}>{group.completion}%</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">{group.members} members | {group.active} active this week</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function LeaderInitiativesPage() {
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader title="Initiatives" subtitle="Manage initiatives, create tasks, inspect members, and review performance." actions={<Button asChild><Link href="/leader/initiatives/create">Create initiative</Link></Button>} />
      <div className="grid gap-5 md:grid-cols-2">
        {initiatives.map((initiative) => (
          <Card key={initiative.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-950">{initiative.title}</p>
                <p className="mt-1 text-sm text-slate-500">{initiative.goal}</p>
              </div>
              <Badge tone={initiative.privacy === "Private" ? "slate" : "green"}>{initiative.privacy}</Badge>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <span>{initiative.members} members</span>
              <span>{initiative.completionRate}% completion</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" asChild><Link href={`/leader/initiatives/${initiative.id}`}>Open</Link></Button>
              <Button variant="ghost" asChild><Link href={`/leader/initiatives/${initiative.id}/analytics`}>Analytics</Link></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LeaderCreateInitiative() {
  const [status, setStatus] = useState<"idle" | "draft" | "published">("idle");
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader title="Create initiative" subtitle="Set the goal, frequency, rubric, and privacy model before inviting participants." />
      <Card className="p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Input aria-label="Initiative title" placeholder="Initiative title" />
          <Input aria-label="Category" placeholder="Category" />
          <Input aria-label="Task frequency" placeholder="Task frequency" />
          <Input aria-label="Privacy" placeholder="Privacy" />
          <Textarea aria-label="Initiative goal" className="md:col-span-2" placeholder="Describe the initiative goal and success criteria" />
        </div>
        <div className="mt-5 flex gap-3">
          <Button onClick={() => setStatus("draft")}>{status === "draft" ? "Draft saved" : "Save draft"}</Button>
          <Button variant="outline" onClick={() => setStatus("published")}>{status === "published" ? "Published" : "Publish"}</Button>
        </div>
        {status !== "idle" ? <p className="mt-3 text-sm text-green-700" role="status">{status === "draft" ? "Your initiative is saved as a draft." : "Your initiative is live and ready for members."}</p> : null}
      </Card>
    </div>
  );
}

function LeaderInitiativeTasks({ initiativeId }: { initiativeId: string }) {
  const initiative = initiatives.find((item) => item.id === initiativeId) ?? initiatives[0];
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader title={`${initiative.title} tasks`} subtitle="Define the work stream and keep the flow consistent." />
      <Card className="p-5">
        <div className="space-y-4">
          {activeTasks.filter((task) => task.initiativeId === initiative.id).map((task) => (
            <div key={task.id} className="rounded-2xl border border-slate-200 p-4">
              <p className="font-medium text-slate-950">{task.title}</p>
              <p className="mt-1 text-sm text-slate-500">{task.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function LeaderInitiativeMembers({ initiativeId }: { initiativeId: string }) {
  const initiative = initiatives.find((item) => item.id === initiativeId) ?? initiatives[0];
  const memberRows = [
    { name: "Meera", status: "Consistent", streak: 31 },
    { name: "Rahul", status: "At risk", streak: 1 },
    { name: "Aarav", status: "On track", streak: 12 },
    { name: "Nina", status: "Excellent", streak: 22 }
  ];
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader title={`${initiative.title} members`} subtitle="Monitor participation, streaks, and risk signals." />
      <Card className="p-5">
        <div className="space-y-3">
          {memberRows.map((member) => (
            <div key={member.name} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <Avatar name={member.name} />
                <div>
                  <p className="font-medium text-slate-950">{member.name}</p>
                  <p className="text-sm text-slate-500">{member.status}</p>
                </div>
              </div>
              <Badge tone={member.status === "At risk" ? "orange" : "green"}>{member.streak} day streak</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function LeaderInitiativeAnalytics({ initiativeId }: { initiativeId: string }) {
  const initiative = initiatives.find((item) => item.id === initiativeId) ?? initiatives[0];
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader title={`${initiative.title} analytics`} subtitle="Review completion, engagement, and skill gaps over time." />
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <MiniLineChart data={leaderChart} />
        <HorizontalBars data={skillScores} />
      </div>
    </div>
  );
}

function LeaderInitiativeReports({ initiativeId }: { initiativeId: string }) {
  const initiative = initiatives.find((item) => item.id === initiativeId) ?? initiatives[0];
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader title={`${initiative.title} reports`} subtitle="Export-ready summaries for stakeholders and the community." />
      <Card className="p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <InlineStat label="Completion" value={`${initiative.completionRate}%`} />
          <InlineStat label="Active members" value={initiative.activeMembers.toString()} />
          <InlineStat label="Risk alerts" value="7" />
        </div>
      </Card>
    </div>
  );
}

function LeaderGroupsPage() {
  return (
    <div className="space-y-8 pb-20 xl:pb-6">
      <HeroHeader title="Groups" subtitle="Manage private pods for focused cohorts and peer reviews." />
      <div className="grid gap-5 lg:grid-cols-2">
        {groups.map((group) => (
          <Card key={group.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-950">{group.name}</p>
                <p className="mt-1 text-sm text-slate-500">{group.description}</p>
              </div>
              <Badge tone="orange">Private</Badge>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <InlineStat label="Members" value={group.members.toString()} />
              <InlineStat label="Rank" value={`#${group.leaderboardRank}`} />
              <InlineStat label="Cohort" value={group.initiativeId} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LeaderNotificationsPage() {
  return <NotificationsPage />;
}

export function AppRouterFrame({ role, slug }: { role: "student" | "leader"; slug: string[] }) {
  if (role === "leader") return <LeaderWorkspace slug={slug} />;
  return <StudentWorkspace slug={slug} />;
}
