import Link from "next/link";

import Container from "../shared/Container";
import { categories, navLinks } from "@/data/navigation";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-2xl font-bold"
            >
              SRIKODE
            </Link>

            <p className="mt-4 text-sm text-gray-600">
              Learn HTML, CSS, JavaScript,
              React, Next.js and modern web
              development through practical
              tutorials and projects.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">
              Quick Links
            </h3>

            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-sm text-gray-600 hover:text-blue-600"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 font-semibold">
              Categories
            </h3>

            <div className="space-y-2">
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="block text-sm text-gray-600 hover:text-blue-600"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter Placeholder */}
          <div>
            <h3 className="mb-4 font-semibold">
              Stay Updated
            </h3>

            <p className="mb-4 text-sm text-gray-600">
              Subscribe for new tutorials,
              projects and development tips.
            </p>

            <input
              type="email"
              placeholder="Your email"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />

            <button
              className="
                mt-3
                w-full
                rounded-lg
                bg-black
                px-4
                py-2
                text-white
                transition
                hover:bg-gray-800
              "
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="
            border-t
            py-6
            text-center
            text-sm
            text-gray-500
          "
        >
          © 2026 SRIKODE. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}