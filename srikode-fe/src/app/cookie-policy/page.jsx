import Container from "@/components/shared/Container";
import LegalPageWrapper from "@/components/shared/LegalPageWrapper";

export const metadata = {
  title: "Cookie Policy",
  description: "Learn how SriKode uses cookies and browser storage to personalize your experience and remember preferences.",
};

export default function CookiePolicyPage() {
  return (
    <LegalPageWrapper titleWidth="w-60">
      <div className="py-12" style={{ backgroundColor: "var(--sk-bg)" }}>
      <Container>
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black md:text-4xl" style={{ color: "var(--sk-text)" }}>
              Cookie Policy
            </h1>
            <p className="mt-3 text-sm" style={{ color: "var(--sk-text-muted)" }}>
              Last updated: July 4, 2026
            </p>
          </div>

          {/* Content */}
          <div className="prose-content space-y-6 text-sm leading-relaxed" style={{ color: "var(--sk-text-muted)" }}>
            <p>
              This Cookie Policy explains how SriKode (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) uses cookies and similar storage technologies when you visit our website.
            </p>
            <p>
              We believe in transparency and respect for your privacy. We keep cookie usage minimal and essential for site performance and user experience.
            </p>

            <hr className="my-8" style={{ borderColor: "var(--sk-border)" }} />

            <h2 className="text-lg font-bold" style={{ color: "var(--sk-text)" }}>
              1. What Are Cookies?
            </h2>
            <p>
              Cookies are small data files placed on your browser or device when you visit websites. They are widely used by modern web applications to remember your preferences, provide security, and analyze site functionality.
            </p>

            <h2 className="text-lg font-bold pt-4" style={{ color: "var(--sk-text)" }}>
              2. How We Use Cookies & Local Storage
            </h2>
            <p>
              We utilize minimal cookies and local storage solely for functional and analytical purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>User Preferences:</strong> Storing your interface preferences such as dark mode or light mode selection so your choice persists between visits.
              </li>
              <li>
                <strong>Essential Analytics:</strong> Anonymous readership statistics (such as page visits, tutorial reading duration, and geographic region) to help us improve content quality.
              </li>
              <li>
                <strong>Security & Performance:</strong> Mitigating spam requests and improving resource load speeds via cached assets.
              </li>
            </ul>

            <h2 className="text-lg font-bold pt-4" style={{ color: "var(--sk-text)" }}>
              3. Third-Party Services & Embeds
            </h2>
            <p>
              Some tutorial articles may feature embedded YouTube video demonstrations, GitHub links, or CDN-hosted assets. These external services may independently set their own tracking or performance cookies subject to their respective privacy policies.
            </p>

            <h2 className="text-lg font-bold pt-4" style={{ color: "var(--sk-text)" }}>
              4. Controlling & Managing Cookies
            </h2>
            <p>
              Most web browsers automatically accept cookies, but you can modify your browser settings to decline or delete cookies at any time. Please note that disabling cookies may affect your experience, such as resetting your dark mode preference to default on page refresh.
            </p>

            <h2 className="text-lg font-bold pt-4" style={{ color: "var(--sk-text)" }}>
              5. Contact Us
            </h2>
            <p>
              If you have any questions regarding our use of cookies or tracking technologies, please contact us:
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
    </LegalPageWrapper>
  );
}
