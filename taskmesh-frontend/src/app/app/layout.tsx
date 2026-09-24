import { AppShell } from "@/components/layout/shells";
import type { ReactNode } from "react";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return <AppShell role="student">{children}</AppShell>;
}
