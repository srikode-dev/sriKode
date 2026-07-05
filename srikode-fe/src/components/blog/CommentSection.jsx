"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Send, CheckCircle, Clock } from "lucide-react";
import { getComments, submitComment } from "@/lib/api";

function Comment({ comment }) {
  const avatar = comment.name ? comment.name.charAt(0).toUpperCase() : "?";
  const dateFormatted = comment.createdAt 
    ? new Date(comment.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sk-primary text-sm font-bold text-white uppercase">
        {avatar}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-sk-text">{comment.name}</span>
          <span className="text-xs text-sk-text-faint flex items-center gap-1">
            <Clock size={10} />
            {dateFormatted}
          </span>
        </div>
        <p className="mt-1 text-sm text-sk-text-muted">{comment.text}</p>
      </div>
    </div>
  );
}

export default function CommentSection({ blogId, slug }) {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (slug) {
      async function loadComments() {
        try {
          const res = await getComments(slug);
          setComments(res.comments || []);
        } catch (error) {
          console.error("Failed to fetch comments for blog detail: ", error);
        } finally {
          setFetching(false);
        }
      }
      loadComments();
    }
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    
    setLoading(true);
    try {
      const res = await submitComment(slug, { name, email, text: message });
      if (res.success) {
        setSubmitted(true);
        setMessage("");
      } else {
        alert(res.message || "Failed to post comment.");
      }
    } catch (error) {
      alert("Error posting comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-12 border-t border-sk-border pt-10">
      {/* Heading */}
      <div className="mb-6 flex items-center gap-3">
        <MessageCircle size={20} className="text-sk-primary" />
        <h2 className="text-xl font-bold text-sk-text">
          Comments ({fetching ? "..." : comments.length})
        </h2>
      </div>

      {/* Existing comments */}
      {fetching ? (
        <div className="py-4 text-sm text-sk-text-faint italic">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="mb-10 text-sm text-sk-text-faint italic">No comments approved yet. Be the first to share your thoughts!</div>
      ) : (
        <div className="mb-10 flex flex-col gap-6">
          {comments.map((c) => (
            <Comment key={c._id || c.id} comment={c} />
          ))}
        </div>
      )}

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
