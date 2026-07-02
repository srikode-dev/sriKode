"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <section className="border-t border-b border-gray-100 bg-gray-50 py-16">
      <div className="mx-auto max-w-2xl px-4 text-center">
        {/* Icon accent */}
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-200">
          <Send size={24} />
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
          Never Miss a Tutorial
        </h2>
        <p className="mt-3 text-base text-gray-500">
          Get the latest web development tutorials, projects and tips delivered
          straight to your inbox. No spam — ever.
        </p>

        {submitted ? (
          <div className="mt-8 flex items-center justify-center gap-3 rounded-xl bg-green-50 border border-green-200 px-6 py-5 text-green-700">
            <CheckCircle size={22} className="text-green-500" />
            <span className="font-semibold">You&apos;re subscribed! Welcome to SriKode 🎉</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-0"
          >
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="flex-1 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:rounded-r-none sm:rounded-l-xl"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700 active:scale-95 disabled:opacity-60 sm:rounded-l-none sm:rounded-r-xl"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Send size={15} />
                  Subscribe
                </>
              )}
            </button>
          </form>
        )}

        <p className="mt-4 text-xs text-gray-400">
          Join 10,000+ developers learning with SriKode. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
