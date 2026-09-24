import { AppShell } from "@/components/layout/shells";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const result = await requireUser();
  if ("response" in result) redirect("/sign-in");

  return <AppShell role="student" user={result.user}>{children}</AppShell>;
}
