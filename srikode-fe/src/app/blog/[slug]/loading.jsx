import Container from "@/components/shared/Container";

export default function BlogLoading() {
  return (
    <div className="pt-6 pb-20 animate-pulse select-none">
      <Container>
        {/* Breadcrumb Skeleton */}
        <div className="mb-6 flex items-center gap-2">
          <div className="h-4 w-12 rounded-md bg-sk-border" />
          <div className="h-3 w-3 rounded-full bg-sk-border" />
          <div className="h-4 w-16 rounded-md bg-sk-border" />
          <div className="h-3 w-3 rounded-full bg-sk-border" />
          <div className="h-4 w-32 rounded-md bg-sk-border" />
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          {/* Main Article Column */}
          <div className="min-w-0">
            {/* Header Meta Pills */}
            <div className="mb-4 flex items-center gap-3">
              <div className="h-6 w-24 rounded-full bg-blue-100 dark:bg-blue-950/50" />
              <div className="h-4 w-20 rounded-md bg-sk-border" />
              <div className="h-4 w-16 rounded-md bg-sk-border" />
            </div>

            {/* Title Skeleton */}
            <div className="space-y-3 mb-6">
              <div className="h-10 w-11/12 rounded-xl bg-sk-border" />
              <div className="h-10 w-3/4 rounded-xl bg-sk-border" />
            </div>

            {/* Author Bar Skeleton */}
            <div className="mb-8 flex items-center gap-3 pb-6 border-b border-sk-border">
              <div className="h-10 w-10 rounded-full bg-sk-border" />
              <div className="space-y-1.5">
                <div className="h-4 w-28 rounded-md bg-sk-border" />
                <div className="h-3 w-20 rounded-md bg-sk-border" />
              </div>
            </div>

            {/* Cover Image Skeleton */}
            <div className="mb-8 aspect-video w-full rounded-2xl bg-sk-bg-subtle border border-sk-border flex items-center justify-center overflow-hidden">
              <div className="h-12 w-12 rounded-xl bg-sk-border/60" />
            </div>

            {/* Excerpt Lead Box Skeleton */}
            <div className="mb-8 rounded-r-xl border-l-4 border-sk-primary bg-sk-bg-subtle p-5 space-y-2">
              <div className="h-4 w-full rounded-md bg-sk-border" />
              <div className="h-4 w-5/6 rounded-md bg-sk-border" />
            </div>

            {/* Article Content Paragraph Skeletons */}
            <div className="space-y-4">
              <div className="h-4 w-full rounded-md bg-sk-border" />
              <div className="h-4 w-full rounded-md bg-sk-border" />
              <div className="h-4 w-4/5 rounded-md bg-sk-border" />
              <div className="h-4 w-11/12 rounded-md bg-sk-border" />
            </div>

            {/* Fake Heading */}
            <div className="mt-10 mb-4 h-7 w-48 rounded-lg bg-sk-border" />

            {/* Code Block Skeleton */}
            <div className="mb-8 h-48 w-full rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-3">
              <div className="flex gap-2 mb-2">
                <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
              </div>
              <div className="h-3.5 w-3/4 rounded-md bg-slate-800" />
              <div className="h-3.5 w-1/2 rounded-md bg-slate-800" />
              <div className="h-3.5 w-2/3 rounded-md bg-slate-800" />
            </div>
          </div>

          {/* Right Sidebar Skeleton */}
          <div className="space-y-6">
            {/* TOC Skeleton */}
            <div className="rounded-2xl border border-sk-border bg-sk-bg-card p-5 space-y-3">
              <div className="h-5 w-36 rounded-md bg-sk-border mb-4" />
              <div className="h-4 w-5/6 rounded-md bg-sk-border" />
              <div className="h-4 w-4/6 rounded-md bg-sk-border" />
              <div className="h-4 w-5/6 rounded-md bg-sk-border" />
              <div className="h-4 w-3/6 rounded-md bg-sk-border" />
            </div>

            {/* Most Popular Skeleton */}
            <div className="rounded-2xl border border-sk-border bg-sk-bg-card p-5 space-y-4">
              <div className="h-5 w-32 rounded-md bg-sk-border" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="h-14 w-20 shrink-0 rounded-lg bg-sk-border" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-full rounded-md bg-sk-border" />
                    <div className="h-3 w-16 rounded-md bg-sk-border" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
