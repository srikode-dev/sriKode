import Container from "@/components/shared/Container";

export default function LegalPageSkeleton({ titleWidth = "w-64" }) {
  return (
    <div className="py-12 animate-pulse select-none" style={{ backgroundColor: "var(--sk-bg)" }}>
      <Container>
        <div className="mx-auto max-w-3xl">
          {/* Header Skeleton */}
          <div className="mb-10 text-center flex flex-col items-center">
            {/* Page Title */}
            <div className={`h-10 ${titleWidth} rounded-xl bg-sk-border`} />
            {/* Last Updated Date */}
            <div className="mt-4 h-4 w-44 rounded-md bg-sk-border/70" />
          </div>

          {/* Body Prose Skeleton */}
          <div className="space-y-6">
            {/* Introductory Paragraphs */}
            <div className="space-y-3">
              <div className="h-4 w-full rounded-md bg-sk-border" />
              <div className="h-4 w-11/12 rounded-md bg-sk-border" />
              <div className="h-4 w-4/5 rounded-md bg-sk-border" />
            </div>

            <div className="space-y-3">
              <div className="h-4 w-full rounded-md bg-sk-border" />
              <div className="h-4 w-5/6 rounded-md bg-sk-border" />
            </div>

            {/* Divider line */}
            <div className="my-8 h-px w-full bg-sk-border" />

            {/* Section 1 */}
            <div className="space-y-3 pt-2">
              <div className="h-6 w-56 rounded-lg bg-sk-border" />
              <div className="h-4 w-full rounded-md bg-sk-border" />
              <div className="h-4 w-10/12 rounded-md bg-sk-border" />

              {/* Bullet list items */}
              <div className="space-y-3 pl-4 pt-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sk-primary/50" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-4 w-1/3 rounded-md bg-sk-border" />
                      <div className="h-3.5 w-full rounded-md bg-sk-border/70" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-3 pt-6">
              <div className="h-6 w-60 rounded-lg bg-sk-border" />
              <div className="h-4 w-full rounded-md bg-sk-border" />
              <div className="h-4 w-11/12 rounded-md bg-sk-border" />
              <div className="h-4 w-4/5 rounded-md bg-sk-border" />
            </div>

            {/* Section 3 */}
            <div className="space-y-3 pt-6">
              <div className="h-6 w-48 rounded-lg bg-sk-border" />
              <div className="h-4 w-full rounded-md bg-sk-border" />
              <div className="h-4 w-3/4 rounded-md bg-sk-border" />
            </div>

            {/* Contact / Footer Section */}
            <div className="space-y-3 pt-6">
              <div className="h-6 w-36 rounded-lg bg-sk-border" />
              <div className="h-4 w-2/3 rounded-md bg-sk-border" />
              <div className="h-4 w-44 rounded-md bg-sk-primary/30" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
