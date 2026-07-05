"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { subscribeNewsletter } from "@/lib/api";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await subscribeNewsletter(email);
      if (res.success) {
        setSubmitted(true);
        setEmail("");
      } else {
        alert(res.message || "Failed to subscribe.");
      }
    } catch (error) {
      alert("Failed to subscribe. Please verify network connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="py-16"
      style={{
        backgroundColor: "var(--sk-bg-subtle)",
        borderTop: "1px solid var(--sk-border)",
        borderBottom: "1px solid var(--sk-border)",
      }}
    >
      <div className="mx-auto max-w-2xl px-4 text-center">
        {/* Icon accent */}
        <div
          className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
          style={{ backgroundColor: "var(--sk-primary)", boxShadow: "0 8px 24px color-mix(in srgb, var(--sk-primary) 35%, transparent)" }}
        >
          <Send size={24} />
        </div>

        <h2
          className="text-3xl font-extrabold md:text-4xl"
          style={{ color: "var(--sk-text)" }}
        >
          Never Miss a Tutorial
        </h2>
        <p
          className="mt-3 text-base"
          style={{ color: "var(--sk-text-muted)" }}
        >
          Get the latest web development tutorials, projects and tips delivered
          straight to your inbox. No spam — ever.
        </p>

        {submitted ? (
          <div
            className="mt-8 flex items-center justify-center gap-3 rounded-xl border px-6 py-5"
            style={{
              backgroundColor: "rgba(34,197,94,0.08)",
              borderColor: "rgba(34,197,94,0.3)",
              color: "#16a34a",
            }}
          >
            <CheckCircle size={22} className="text-green-500" />
            <span className="font-semibold dark:text-green-400">You&apos;re subscribed! Welcome to SriKode 🎉</span>
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
              className="flex-1 rounded-xl border px-5 py-3.5 text-sm outline-none sm:rounded-r-none sm:rounded-l-xl focus:ring-2"
              style={{
                backgroundColor: "var(--sk-bg-card)",
                borderColor: "var(--sk-border-strong)",
                color: "var(--sk-text)",
                "--tw-ring-color": "color-mix(in srgb, var(--sk-primary) 20%, transparent)",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white shadow transition active:scale-95 disabled:opacity-60 sm:rounded-l-none sm:rounded-r-xl"
              style={{
                backgroundColor: "var(--sk-primary)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--sk-primary-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--sk-primary)"}
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

        <p
          className="mt-4 text-xs"
          style={{ color: "var(--sk-text-faint)" }}
        >
          Join 10,000+ developers learning with SriKode. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
