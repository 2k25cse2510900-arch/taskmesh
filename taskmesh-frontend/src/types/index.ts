export type Role = "student" | "leader";

export type TaskType = "text" | "link" | "code" | "file" | "audio" | "video";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Initiative {
  id: string;
  title: string;
  description: string;
  category: string;
  skill: string;
  duration: string;
  taskFrequency: string;
  difficulty: Difficulty;
  members: number;
  activeMembers: number;
  completionRate: number;
  popularity: number;
  rating: number;
  color: string;
  accent: string;
  stage: string;
  privacy: "Public" | "Private";
  streakLeader: string;
  owner: string;
  goal: string;
}

export interface Task {
  id: string;
  initiativeId: string;
  title: string;
  description: string;
  due: string;
  dueLabel: string;
  difficulty: Difficulty;
  progress: number;
  status: "Pending" | "In progress" | "Submitted" | "Reviewed";
  submissionType: TaskType[];
  rubric: string[];
}

export interface FeedbackItem {
  id: string;
  submissionId: string;
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  tips: string[];
  tone: "Encouraging" | "Direct" | "Strategic";
}

export interface Submission {
  id: string;
  taskId: string;
  title: string;
  status: "Draft" | "Submitted" | "Evaluated";
  submittedAt: string;
  score: number;
  reviewer: string;
  channel: TaskType;
}

export interface Group {
  id: string;
  name: string;
  initiativeId: string;
  members: number;
  leaderboardRank: number;
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  kind: "feedback" | "streak" | "leader" | "system";
}

export interface MetricPoint {
  label: string;
  value: number;
}

export interface SkillScore {
  skill: string;
  score: number;
  target: number;
  delta: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  initiative: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  description?: string;
}
