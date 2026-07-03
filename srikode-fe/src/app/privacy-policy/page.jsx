import Container from "@/components/shared/Container";

export const metadata = {
  title: "Privacy Policy",
  description: "Read the Privacy Policy of SriKode to understand how we collect, protect, and use your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12" style={{ backgroundColor: "var(--sk-bg)" }}>
      <Container>
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black md:text-4xl" style={{ color: "var(--sk-text)" }}>Privacy Policy</h1>
            <p className="mt-3 text-sm" style={{ color: "var(--sk-text-muted)" }}>
              Last updated: July 4, 2026
            </p>
          </div>

          {/* Content */}
          <div className="prose-content space-y-6 text-sm leading-relaxed" style={{ color: "var(--sk-text-muted)" }}>
            <p>
              Welcome to SriKode (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). We are committed to protecting your privacy and ensuring you have a positive experience on our website.
            </p>
            <p>
              This Privacy Policy explains what information we collect when you visit our website, how we use it, and how we keep it secure.
            </p>

            <hr className="my-8" style={{ borderColor: "var(--sk-border)" }} />

            <h2 className="text-lg font-bold" style={{ color: "var(--sk-text)" }}>1. Information We Collect</h2>
            <p>
              We collect information to provide better services to our readers and developers. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Newsletter Subscriptions:</strong> When you subscribe to our newsletter, you provide us with your email address.
              </li>
              <li>
                <strong>Comments:</strong> If you choose to post comments on our tutorial articles, you provide your name and email address. Your email address is never published or shared.
              </li>
              <li>
                <strong>Usage Information:</strong> We may collect anonymous analytical logs automatically, such as page views, reading time, and click patterns, to improve website performance.
              </li>
            </ul>

            <h2 className="text-lg font-bold pt-4" style={{ color: "var(--sk-text)" }}>2. How We Use Your Information</h2>
            <p>
              We use your information only for legitimate educational and technical operations:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To send you updates regarding new tutorials, articles, or coding guides.</li>
              <li>To review and display comments under relevant tutorial posts.</li>
              <li>To evaluate analytics data to write more helpful content for modern web developers.</li>
            </ul>

            <h2 className="text-lg font-bold pt-4" style={{ color: "var(--sk-text)" }}>3. Cookies & Tracking Technologies</h2>
            <p>
              We may use cookies to persist your preferred website theme (light/dark mode) and capture analytics details. You can configure your browser to reject cookies, but some interface elements may not persist correctly.
            </p>

            <h2 className="text-lg font-bold pt-4" style={{ color: "var(--sk-text)" }}>4. Contact Me</h2>
            <p>
              If you have any questions about this Privacy Policy, feel free to drop a message through our Contact page or directly email at:
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
