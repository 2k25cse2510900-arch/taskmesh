import { z } from "zod";

export const userSyncSchema = z.object({
  timezone: z.string().trim().min(1).max(80).optional()
});

export const initiativeCreateSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(1).max(2000),
  objective: z.string().trim().min(1).max(1000),
  category: z.string().trim().min(1).max(80),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
  cadence: z.enum(["DAILY", "WEEKLY", "CUSTOM"]).default("DAILY"),
  timezone: z.string().trim().min(1).max(80).default("UTC"),
  participantLimit: z.number().int().positive().max(100000).optional(),
  rules: z.array(z.string().trim().min(1).max(500)).max(20).default([])
});

export const submissionCreateSchema = z.object({
  taskId: z.string().min(1),
  content: z.string().trim().max(100000).optional(),
  programmingLanguage: z.string().trim().min(1).max(40).optional(),
  url: z.string().url().optional(),
  media: z.array(z.object({
    publicId: z.string().min(1).max(255),
    secureUrl: z.string().url(),
    resourceType: z.string().min(1).max(40),
    format: z.string().max(20).optional(),
    bytes: z.number().int().nonnegative().max(1000000000).optional(),
    duration: z.number().nonnegative().optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional()
  })).max(10).default([])
}).refine((value) => Boolean(value.content || value.url || value.media.length), { message: "A submission needs content, a URL, or media" });

export const resourceIdSchema = z.string().trim().min(1).max(100);

export const notificationPatchSchema = z.object({
  id: resourceIdSchema.optional(),
  all: z.boolean().optional()
}).refine((value) => Boolean(value.id || value.all), { message: "Notification id or all is required" });
