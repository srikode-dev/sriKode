import Container from "@/components/shared/Container";

export const metadata = {
  title: "Terms of Service",
  description: "Read the Terms of Service of SriKode to understand our rules, guidelines, and terms.",
};

export default function TermsOfServicePage() {
  return (
    <div className="py-12" style={{ backgroundColor: "var(--sk-bg)" }}>
      <Container>
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black md:text-4xl" style={{ color: "var(--sk-text)" }}>Terms of Service</h1>
            <p className="mt-3 text-sm" style={{ color: "var(--sk-text-muted)" }}>
              Last updated: July 4, 2026
            </p>
          </div>

          {/* Content */}
          <div className="prose-content space-y-6 text-sm leading-relaxed" style={{ color: "var(--sk-text-muted)" }}>
            <p>
              By accessing and reading SriKode (&quot;our website&quot;), you agree to comply with and be bound by the following Terms of Service.
            </p>

            <hr className="my-8" style={{ borderColor: "var(--sk-border)" }} />

            <h2 className="text-lg font-bold" style={{ color: "var(--sk-text)" }}>1. Use of Content & Tutorials</h2>
            <p>
              All guides, blog articles, screenshots, and visual components provided on SriKode are for general educational purposes.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Code Usage:</strong> The sample codes, repositories, and demonstration code snippets are provided under MIT-style permissions. You are encouraged to copy and use them in personal or commercial projects.
              </li>
              <li>
                <strong>Text Restrictions:</strong> The written articles, text explanations, and layouts may not be repubishing or copy-pasted onto other programming blogs without direct written permission.
              </li>
            </ul>

            <h2 className="text-lg font-bold pt-4" style={{ color: "var(--sk-text)" }}>2. Disclaimers</h2>
            <p>
              The tutorials and coding techniques are provided &quot;as is&quot; without any warranty or guarantees of any kind. Web APIs and code libraries (React, Next.js, etc.) evolve rapidly; while we try to keep articles accurate, we do not claim responsibility for deprecated structures, compile errors, or bugs.
            </p>

            <h2 className="text-lg font-bold pt-4" style={{ color: "var(--sk-text)" }}>3. Code Submissions & Comments</h2>
            <p>
              Comments posted on articles should remain professional, clear, and relevant to the coding topics. We reserve the right to remove any spam, abusive content, or advertisement links from the comments thread.
            </p>

            <h2 className="text-lg font-bold pt-4" style={{ color: "var(--sk-text)" }}>4. Contact Me</h2>
            <p>
              If you have any questions or feedback regarding these terms, please contact me through our Contact page or email:
            </p>
            <a
              href="mailto:hello@srikode.dev"
              className="font-semibold underline"
              style={{ color: "var(--sk-primary)" }}
            >
              hello@srikode.dev
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
