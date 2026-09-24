import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { apiError } from "@/lib/http";

export async function POST() {
  try {
    const result = await requireUser();
    if ("response" in result) return result.response;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) return NextResponse.json({ error: "Media uploads are not configured" }, { status: 503 });
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `taskmesh/${result.user.id}`;
    const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest("hex");
    return NextResponse.json({ cloudName, apiKey, folder, timestamp, signature });
  } catch (error) {
    return apiError(error);
  }
}

