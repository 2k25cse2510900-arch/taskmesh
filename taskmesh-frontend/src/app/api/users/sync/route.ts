import { NextResponse } from "next/server";
import { syncAuthenticatedUser } from "@/lib/auth";
import { apiError } from "@/lib/http";
import { userSyncSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const data = userSyncSchema.parse(await request.json());
    const user = await syncAuthenticatedUser(data.timezone);
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    return NextResponse.json({ user });
  } catch (error) {
    return apiError(error);
  }
}
