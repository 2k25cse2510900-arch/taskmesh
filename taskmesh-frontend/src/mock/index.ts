import type {
  FeedbackItem,
  Group,
  Initiative,
  LeaderboardEntry,
  MetricPoint,
  NotificationItem,
  SkillScore,
  Submission,
  Task
} from "@/types";

export const currentStudent = {
  name: "Aarav Mehta",
  role: "student" as const,
  headline: "Good morning, Aarav",
  subtitle: "Here's how you're progressing today.",
  location: "Mumbai, India",
  plan: "TaskMesh Pro"
};

export const currentLeader = {
  name: "Priya Sharma",
  role: "leader" as const,
  headline: "Initiative command center",
  subtitle: "Monitor consistency, guide members, and automate the busywork.",
  organization: "TaskMesh Community Lab"
};

export const initiatives: Initiative[] = [
  {
    id: "dsa-30",
    title: "30 Days of DSA",
    description: "Daily structured coding drills with AI feedback on correctness and clarity.",
    category: "Coding",
    skill: "Problem Solving",
    duration: "30 days",
    taskFrequency: "Daily",
    difficulty: "Medium",
    members: 248,
    activeMembers: 216,
    completionRate: 91,
    popularity: 98,
    rating: 4.9,
    color: "from-orange-500/20 to-amber-200/20",
    accent: "text-orange-600",
    stage: "Momentum",
    privacy: "Public",
    streakLeader: "Meera",
    owner: "TaskMesh Academy",
    goal: "Build problem-solving stamina"
  },
  {
    id: "speaking-club",
    title: "Communication Challenge",
    description: "Short speaking prompts, voice uploads, rubric-based scoring, and peer practice.",
    category: "Communication",
    skill: "Public Speaking",
    duration: "21 days",
    taskFrequency: "Daily",
    difficulty: "Hard",
    members: 186,
    activeMembers: 160,
    completionRate: 87,
    popularity: 92,
    rating: 4.8,
    color: "from-green-500/20 to-emerald-200/20",
    accent: "text-green-600",
    stage: "Growing",
    privacy: "Private",
    streakLeader: "Rahul",
    owner: "SpeakUp Circle",
    goal: "Speak with clarity under pressure"
  },
  {
    id: "fitness-streak",
    title: "Consistency Sprint",
    description: "Habit tracking for fitness, reading, and life routines with accountability pods.",
    category: "Habits",
    skill: "Consistency",
    duration: "14 days",
    taskFrequency: "Twice daily",
    difficulty: "Easy",
    members: 94,
    activeMembers: 82,
    completionRate: 96,
    popularity: 84,
    rating: 4.7,
    color: "from-slate-500/20 to-slate-200/30",
    accent: "text-slate-700",
    stage: "Stable",
    privacy: "Public",
    streakLeader: "Nina",
    owner: "LifeOS Group",
    goal: "Turn routines into streaks"
  },
  {
    id: "aptitude-crash",
    title: "Aptitude Practice Lab",
    description: "Timed practice sets with adaptive difficulty and automated weakness analysis.",
    category: "Placement Prep",
    skill: "Accuracy",
    duration: "45 days",
    taskFrequency: "Daily",
    difficulty: "Medium",
    members: 322,
    activeMembers: 271,
    completionRate: 79,
    popularity: 95,
    rating: 4.8,
    color: "from-orange-500/20 to-green-200/25",
    accent: "text-orange-600",
    stage: "Scaling",
    privacy: "Private",
    streakLeader: "Sana",
    owner: "Campus Bridge",
    goal: "Improve speed and accuracy"
  }
];

export const todayTask: Task = {
  id: "task-binary-search",
  initiativeId: "dsa-30",
  title: "Binary Search Challenge",
  description: "Complete two binary-search problems and explain your approach in 90 seconds.",
  due: "Today, 9:00 PM",
  dueLabel: "Due in 7h 24m",
  difficulty: "Medium",
  progress: 68,
  status: "In progress",
  submissionType: ["code", "text"],
  rubric: ["Correctness", "Approach clarity", "Time complexity", "Edge cases"]
};

export const activeTasks: Task[] = [
  todayTask,
  {
    id: "task-voice-1",
    initiativeId: "speaking-club",
    title: "60-second self-introduction",
    description: "Record a confident intro and focus on pace, tone, and structure.",
    due: "Tomorrow, 8:00 AM",
    dueLabel: "Due tomorrow",
    difficulty: "Easy",
    progress: 34,
    status: "Submitted",
    submissionType: ["audio", "video"],
    rubric: ["Clarity", "Confidence", "Pacing", "Vocabulary"]
  },
  {
    id: "task-aptitude-1",
    initiativeId: "aptitude-crash",
    title: "Ratio and proportion test",
    description: "Solve 12 timed questions and review your error patterns.",
    due: "Today, 11:59 PM",
    dueLabel: "Due tonight",
    difficulty: "Hard",
    progress: 52,
    status: "Pending",
    submissionType: ["text", "file"],
    rubric: ["Accuracy", "Speed", "Consistency", "Confidence"]
  }
];

export const submissions: Submission[] = [
  {
    id: "sub-01",
    taskId: "task-binary-search",
    title: "Binary Search Challenge",
    status: "Evaluated",
    submittedAt: "2 hours ago",
    score: 87,
    reviewer: "AI Coach",
    channel: "code"
  },
  {
    id: "sub-02",
    taskId: "task-voice-1",
    title: "60-second self-introduction",
    status: "Submitted",
    submittedAt: "Yesterday",
    score: 0,
    reviewer: "Pending review",
    channel: "audio"
  }
];

export const feedback: FeedbackItem[] = [
  {
    id: "fb-01",
    submissionId: "sub-01",
    score: 87,
    summary: "Strong reasoning and clean implementation. Your explanation was structured but could be more concise.",
    strengths: ["Correct algorithm choice", "Good edge-case coverage", "Clear variable naming"],
    improvements: ["Trim the walk-through to 60 seconds", "Call out complexity earlier", "Add one example input"],
    tips: ["Use a one-line summary before diving into code.", "Practice narrating tradeoffs while typing."],
    tone: "Encouraging"
  },
  {
    id: "fb-02",
    submissionId: "sub-02",
    score: 74,
    summary: "Warm tone and confident opening. The response would benefit from a sharper structure.",
    strengths: ["Friendly energy", "Natural voice", "Good eye contact"],
    improvements: ["Use a 3-part intro", "Reduce filler words", "Slow the ending slightly"],
    tips: ["Open with who you are, what you do, and what you're aiming for.", "Record two takes and compare clarity."],
    tone: "Strategic"
  }
];

export const groups: Group[] = [
  {
    id: "grp-alpha",
    name: "Binary Search Pod",
    initiativeId: "dsa-30",
    members: 24,
    leaderboardRank: 2,
    description: "A private accountability pod for daily algorithm practice."
  },
  {
    id: "grp-voice",
    name: "Voice Sprint Circle",
    initiativeId: "speaking-club",
    members: 18,
    leaderboardRank: 4,
    description: "Private group for speech practice and weekly live reviews."
  }
];

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    title: "New feedback is ready",
    body: "Your Binary Search Challenge submission received an 87 score and improvement tips.",
    time: "10 min ago",
    kind: "feedback"
  },
  {
    id: "n2",
    title: "Streak protected",
    body: "Your morning check-in kept your streak alive. Two more days to unlock the next badge.",
    time: "1 hour ago",
    kind: "streak"
  },
  {
    id: "n3",
    title: "Leader announcement",
    body: "New group review session tomorrow at 7 PM with optional live Q&A.",
    time: "4 hours ago",
    kind: "leader"
  }
];

export const progressData: MetricPoint[] = [
  { label: "Mon", value: 54 },
  { label: "Tue", value: 62 },
  { label: "Wed", value: 58 },
  { label: "Thu", value: 74 },
  { label: "Fri", value: 78 },
  { label: "Sat", value: 85 },
  { label: "Sun", value: 87 }
];

export const consistencyData: MetricPoint[] = [
  { label: "Week 1", value: 63 },
  { label: "Week 2", value: 69 },
  { label: "Week 3", value: 74 },
  { label: "Week 4", value: 86 }
];

export const skillScores: SkillScore[] = [
  { skill: "Problem Solving", score: 86, target: 90, delta: 8 },
  { skill: "Communication", score: 74, target: 82, delta: 11 },
  { skill: "Consistency", score: 91, target: 88, delta: 4 },
  { skill: "Accuracy", score: 79, target: 84, delta: 6 }
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Meera", avatar: "M", score: 968, streak: 31, initiative: "30 Days of DSA" },
  { rank: 2, name: "Rahul", avatar: "R", score: 955, streak: 29, initiative: "Communication Challenge" },
  { rank: 3, name: "Aarav Mehta", avatar: "A", score: 938, streak: 12, initiative: "30 Days of DSA" },
  { rank: 4, name: "Nina", avatar: "N", score: 920, streak: 22, initiative: "Consistency Sprint" }
];

export const leaderMetrics = [
  { label: "Active participants", value: "1,248", delta: "+14%" },
  { label: "Tasks completed today", value: "482", delta: "+9%" },
  { label: "At-risk members", value: "37", delta: "-12%" },
  { label: "Avg review time", value: "8m", delta: "-22%" }
];

export const leaderChart: MetricPoint[] = [
  { label: "Mon", value: 62 },
  { label: "Tue", value: 68 },
  { label: "Wed", value: 71 },
  { label: "Thu", value: 84 },
  { label: "Fri", value: 88 },
  { label: "Sat", value: 90 },
  { label: "Sun", value: 93 }
];

export const leaderGroups = [
  { name: "DSA Cohort A", members: 128, completion: 92, active: 111 },
  { name: "English Lab Beta", members: 84, completion: 87, active: 69 },
  { name: "Aptitude Sprint", members: 143, completion: 79, active: 121 }
];
