import { AppRouterFrame } from "@/features/workspaces";

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolved = await params;
  return <AppRouterFrame role="student" slug={resolved.slug ?? []} />;
}
