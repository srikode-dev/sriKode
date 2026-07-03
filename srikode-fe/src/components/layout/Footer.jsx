import Link from "next/link";
import Container from "../shared/Container";
import { categories, navLinks } from "@/data/navigation";

export default function Footer() {
  return (
    <footer className="border-t border-sk-border bg-sk-bg-subtle text-sk-text-muted transition-colors duration-300">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-2xl font-black tracking-widest text-sk-text hover:text-sk-primary transition-colors"
            >
              SRIKODE
            </Link>

            <p className="mt-4 text-sm text-sk-text-muted leading-relaxed">
              Learn HTML, CSS, JavaScript, React, Next.js and modern web development through practical tutorials and projects.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-bold text-sm uppercase tracking-wider text-sk-text">
              Quick Links
            </h3>

            <div className="space-y-2.5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-sm text-sk-text-muted hover:text-sk-primary transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 font-bold text-sm uppercase tracking-wider text-sk-text">
              Categories
            </h3>

            <div className="space-y-2.5">
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="block text-sm text-sk-text-muted hover:text-sk-primary transition-colors duration-200"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter Placeholder */}
          <div>
            <h3 className="mb-4 font-bold text-sm uppercase tracking-wider text-sk-text">
              Stay Updated
            </h3>

            <p className="mb-4 text-sm text-sk-text-muted leading-relaxed">
              Subscribe for new tutorials, projects and development tips.
            </p>

            <input
              type="email"
              placeholder="Your email"
              className="w-full rounded-lg border border-sk-border-strong bg-sk-bg-card px-3 py-2 text-sm text-sk-text outline-none focus:border-sk-primary transition-colors duration-200 placeholder:text-sk-text-faint"
            />

            <button
              className="mt-3 w-full rounded-lg bg-sk-primary px-4 py-2 text-white text-sm font-semibold hover:bg-sk-primary-hover active:scale-[0.98] transition-all duration-200"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sk-border py-6 text-center text-xs font-semibold text-sk-text-faint">
          © 2026 SRIKODE. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}