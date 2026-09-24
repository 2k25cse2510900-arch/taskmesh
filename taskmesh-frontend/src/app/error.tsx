"use client";

import { Button, Card } from "@/components/ui";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <Card className="w-full max-w-lg p-7 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Something went wrong</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-950">TaskMesh could not load this view.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Try again, or return to the workspace if the problem continues.</p>
        <Button className="mt-6" onClick={() => reset()}>Try again</Button>
      </Card>
    </main>
  );
}
