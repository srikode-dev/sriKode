import Container from "@/components/shared/Container";

export default function RootLoading() {
  return (
    <div className="py-12 animate-pulse select-none">
      <Container>
        {/* Header Hero Skeleton */}
        <div className="mb-12 max-w-2xl space-y-4">
          <div className="h-6 w-32 rounded-full bg-blue-100 dark:bg-blue-950/50" />
          <div className="h-10 w-full rounded-xl bg-sk-border" />
          <div className="h-4 w-3/4 rounded-md bg-sk-border" />
        </div>

        {/* 2-Column Content Skeleton */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          {/* Post Grid Skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-sk-border bg-sk-bg-card p-4 space-y-3">
                <div className="aspect-video w-full rounded-xl bg-sk-bg-subtle" />
                <div className="h-5 w-3/4 rounded-md bg-sk-border" />
                <div className="h-3.5 w-full rounded-md bg-sk-border" />
                <div className="flex justify-between pt-2">
                  <div className="h-3 w-20 rounded-md bg-sk-border" />
                  <div className="h-3 w-16 rounded-md bg-sk-border" />
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-sk-border bg-sk-bg-card p-5 space-y-4">
              <div className="h-5 w-32 rounded-md bg-sk-border" />
              <div className="h-20 w-full rounded-xl bg-sk-bg-subtle" />
            </div>
            <div className="rounded-2xl border border-sk-border bg-sk-bg-card p-5 space-y-3">
              <div className="h-5 w-28 rounded-md bg-sk-border" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-full rounded-lg bg-sk-bg-subtle" />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
