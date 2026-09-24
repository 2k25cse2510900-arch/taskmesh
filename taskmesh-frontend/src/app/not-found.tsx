import Link from "next/link";
import { Button, Card } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <Card className="w-full max-w-lg p-7 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-950">That TaskMesh view does not exist.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">The link may be outdated or the resource may have been removed.</p>
        <Button className="mt-6" asChild><Link href="/">Return home</Link></Button>
      </Card>
    </main>
  );
}

