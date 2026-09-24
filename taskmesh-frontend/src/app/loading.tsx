export default function Loading() {
  return (
    <main className="flex min-h-[40vh] items-center justify-center bg-background px-6">
      <div className="flex items-center gap-3 text-sm text-slate-500" role="status" aria-live="polite">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
        Loading TaskMesh...
      </div>
    </main>
  );
}

