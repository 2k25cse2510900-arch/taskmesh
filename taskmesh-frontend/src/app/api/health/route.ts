import { NextResponse } from "next/server";

export function GET() {
  const checks = {
    database: Boolean(process.env.DATABASE_URL),
    clerk: Boolean(process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
    cloudinary: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
    evaluation: Boolean(process.env.AI_PROVIDER && process.env.AI_PROVIDER_KEY)
  };
  const ready = Object.values(checks).every(Boolean);
  return NextResponse.json({ status: ready ? "ready" : "configuration_required", checks }, { status: ready ? 200 : 503 });
}

