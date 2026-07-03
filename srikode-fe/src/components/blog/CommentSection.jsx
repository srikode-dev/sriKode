"use client";

import { useState } from "react";
import { MessageCircle, Send, CheckCircle } from "lucide-react";

const PLACEHOLDER_COMMENTS = [
  {
    id: "c1",
    name: "Arjun Mehta",
    date: "2026-06-28",
    text: "Really well written! Loved the step-by-step explanations. Keep it up!",
    avatar: "A",
  },
  {
    id: "c2",
    name: "Priya Sharma",
    date: "2026-06-30",
    text: "This helped me understand the concept so much better. Thank you SriKode!",
    avatar: "P",
  },
];

function Comment({ comment }) {
  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sk-primary text-sm font-bold text-white">
        {comment.avatar}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-sk-text">{comment.name}</span>
          <span className="text-xs text-sk-text-faint">{comment.date}</span>
        </div>
        <p className="mt-1 text-sm text-sk-text-muted">{comment.text}</p>
      </div>
    </div>
  );
}

export default function CommentSection({ blogId }) {
  const [comments, setComments] = useState(PLACEHOLDER_COMMENTS);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <section className="mt-12 border-t border-sk-border pt-10">
      {/* Heading */}
      <div className="mb-6 flex items-center gap-3">
        <MessageCircle size={20} className="text-sk-primary" />
        <h2 className="text-xl font-bold text-sk-text">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Existing comments */}
      <div className="mb-10 flex flex-col gap-6">
        {comments.map((c) => (
          <Comment key={c.id} comment={c} />
        ))}
      </div>

      {/* Leave a comment */}
      <div className="rounded-xl border border-sk-border bg-sk-bg-subtle p-6">
        <h3 className="mb-4 text-base font-bold text-sk-text">Leave a Comment</h3>

        {submitted ? (
          <div
            className="flex items-center gap-3 rounded-xl border px-5 py-4"
            style={{
              backgroundColor: "rgba(34,197,94,0.06)",
              borderColor: "rgba(34,197,94,0.25)",
              color: "#16a34a",
            }}
          >
            <CheckCircle size={18} className="text-green-500" />
            <span className="text-sm font-semibold dark:text-green-400">
              Thanks! Your comment is pending review and will appear soon.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="comment-name" className="mb-1 block text-xs font-semibold text-sk-text-muted">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="comment-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full rounded-lg border border-sk-border-strong bg-sk-bg px-4 py-2.5 text-sm text-sk-text outline-none placeholder:text-sk-text-faint focus:border-sk-primary focus:ring-2 focus:ring-sk-primary/20 transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="comment-email" className="mb-1 block text-xs font-semibold text-sk-text-muted">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="comment-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email (not published)"
                  required
                  className="w-full rounded-lg border border-sk-border-strong bg-sk-bg px-4 py-2.5 text-sm text-sk-text outline-none placeholder:text-sk-text-faint focus:border-sk-primary focus:ring-2 focus:ring-sk-primary/20 transition-all duration-200"
                />
              </div>
            </div>
            <div>
              <label htmlFor="comment-message" className="mb-1 block text-xs font-semibold text-sk-text-muted">
                Comment <span className="text-red-500">*</span>
              </label>
              <textarea
                id="comment-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts..."
                required
                className="w-full resize-none rounded-lg border border-sk-border-strong bg-sk-bg px-4 py-2.5 text-sm text-sk-text outline-none placeholder:text-sk-text-faint focus:border-sk-primary focus:ring-2 focus:ring-sk-primary/20 transition-all duration-200"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-sk-text-faint">
                Your email won&apos;t be published. No registration needed.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-sk-primary px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-sk-primary-hover active:scale-95 disabled:opacity-60 transition-all duration-200"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Send size={14} />
                    Post Comment
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
