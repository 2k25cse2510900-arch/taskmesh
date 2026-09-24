import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiError(error: unknown) {
  if (error instanceof ZodError) return NextResponse.json({ error: "Invalid request", issues: error.flatten() }, { status: 400 });
  if (error instanceof Error && error.message.includes("Environment variable not found")) {
    return NextResponse.json({ error: "Server database is not configured" }, { status: 503 });
  }
  console.error("TaskMesh API error", error instanceof Error ? error.message : "Unknown error");
  return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
}

