"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle, MessageSquare } from "lucide-react";
import { FaGithub, FaYoutube, FaTwitter, FaLinkedin } from "react-icons/fa";
import { submitContact } from "@/lib/api";
import Container from "@/components/shared/Container";

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((err) => ({ ...err, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    
    setLoading(true);
    try {
      const res = await submitContact(form);
      if (res.success) {
        setSubmitted(true);
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        alert(res.message || "Failed to submit query.");
      }
    } catch (error) {
      alert("Failed to send message. Please verify network connection.");
    } finally {
      setLoading(false);
    }
  };

  const socials = [
    { icon: FaGithub, label: "GitHub", handle: "@srikode-dev", href: "https://github.com/srikode-dev", baseColor: "text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800", hoverColor: "hover:bg-zinc-900 hover:text-white hover:border-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white" },
    { icon: FaYoutube, label: "YouTube", handle: "@srikode", href: "https://www.youtube.com/@srikode", baseColor: "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50", hoverColor: "hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-600" },
    { icon: FaTwitter, label: "Twitter / X", handle: "@srikode_dev", href: "https://x.com/srikode_dev", baseColor: "text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900/50", hoverColor: "hover:bg-sky-500 hover:text-white hover:border-sky-500 dark:hover:bg-sky-500" },
    { icon: FaLinkedin, label: "LinkedIn", handle: "@srikode", href: "https://www.linkedin.com/company/srikode", baseColor: "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50", hoverColor: "hover:bg-blue-700 hover:text-white hover:border-blue-700 dark:hover:bg-blue-600" },
  ];

  return (
    <div className="py-12" style={{ backgroundColor: "var(--sk-bg)" }}>
      <Container>
        {/* Header */}
        <div className="mb-10 text-center">
          <span
            className="mb-3 inline-block rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-widest"
            style={{
              backgroundColor: "var(--sk-primary-light)",
              color: "var(--sk-primary-text)",
            }}
          >
            Contact
          </span>
          <h1 className="text-3xl font-extrabold md:text-4xl" style={{ color: "var(--sk-text)" }}>Get in Touch</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm" style={{ color: "var(--sk-text-muted)" }}>
            Have a question, suggestion, or want to collaborate? Drop me a message — I read every one.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">

          {/* ── Contact Form ── */}
          <div
            className="rounded-2xl border p-8 shadow-sm"
            style={{
              backgroundColor: "var(--sk-bg-card)",
              borderColor: "var(--sk-border)",
            }}
          >
            <div className="mb-6 flex items-center gap-3">
              <MessageSquare size={20} style={{ color: "var(--sk-primary)" }} />
              <h2 className="text-lg font-bold" style={{ color: "var(--sk-text)" }}>Send a Message</h2>
            </div>

            {submitted ? (
              <div
                className="flex flex-col items-center justify-center gap-4 rounded-xl border p-10 text-center"
                style={{
                  backgroundColor: "rgba(34,197,94,0.06)",
                  borderColor: "rgba(34,197,94,0.25)",
                  color: "#16a34a",
                }}
              >
                <CheckCircle size={40} className="text-green-500" />
                <p className="text-lg font-bold dark:text-green-400">Message Sent!</p>
                <p className="text-sm dark:text-green-500">
                  Thanks for reaching out. I&apos;ll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                {/* Name + Email */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--sk-text-muted)" }}>
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter Your Name"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-sk-primary/20 ${errors.name ? "border-red-400 focus:border-red-400" : "border-sk-border-strong focus:border-sk-primary"}`}
                      style={{
                        backgroundColor: "var(--sk-bg)",
                        color: "var(--sk-text)",
                      }}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--sk-text-muted)" }}>
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-sk-primary/20 ${errors.email ? "border-red-400 focus:border-red-400" : "border-sk-border-strong focus:border-sk-primary"}`}
                      style={{
                        backgroundColor: "var(--sk-bg)",
                        color: "var(--sk-text)",
                      }}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--sk-text-muted)" }}>
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Guest post, collaboration, feedback..."
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-sk-primary/20 ${errors.subject ? "border-red-400 focus:border-red-400" : "border-sk-border-strong focus:border-sk-primary"}`}
                    style={{
                      backgroundColor: "var(--sk-bg)",
                      color: "var(--sk-text)",
                    }}
                  />
                  {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--sk-text-muted)" }}>
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me what's on your mind..."
                    className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-sk-primary/20 ${errors.message ? "border-red-400 focus:border-red-400" : "border-sk-border-strong focus:border-sk-primary"}`}
                    style={{
                      backgroundColor: "var(--sk-bg)",
                      color: "var(--sk-text)",
                    }}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white shadow transition active:scale-95 disabled:opacity-60"
                  style={{
                    backgroundColor: "var(--sk-primary)",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--sk-primary-hover)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--sk-primary)"}
                >
                  {loading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <><Send size={15} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* ── Right panel ── */}
          <div className="flex flex-col gap-6">
            {/* Direct email */}
            <div
              className="rounded-2xl border p-6 shadow-sm"
              style={{
                backgroundColor: "var(--sk-bg-card)",
                borderColor: "var(--sk-border)",
              }}
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: "var(--sk-primary-light)",
                  color: "var(--sk-primary)",
                }}
              >
                <Mail size={22} />
              </div>
              <h3 className="font-bold" style={{ color: "var(--sk-text)" }}>Email Directly</h3>
              <p className="mt-1 text-sm" style={{ color: "var(--sk-text-muted)" }}>Prefer email? Reach me at:</p>
              <a
                href="mailto:srikode.hq@gmail.com"
                className="mt-2 block text-sm font-semibold hover:underline"
                style={{ color: "var(--sk-primary)" }}
              >
                srikode.hq@gmail.com
              </a>
              <p className="mt-3 text-xs" style={{ color: "var(--sk-text-faint)" }}>I typically reply within 24–48 hours.</p>
            </div>

            {/* Social connect */}
            <div
              className="rounded-2xl border p-6 shadow-sm"
              style={{
                backgroundColor: "var(--sk-bg-card)",
                borderColor: "var(--sk-border)",
              }}
            >
              <h3 className="mb-4 font-bold" style={{ color: "var(--sk-text)" }}>Connect on Social</h3>
              <div className="flex flex-col gap-3">
                {socials.map(({ icon: Icon, label, handle, href, baseColor, hoverColor }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${baseColor} ${hoverColor}`}
                  >
                    <Icon size={18} className="transition-transform group-hover:scale-110" />
                    <span className="flex-1">{label}</span>
                    <span className="text-xs font-medium opacity-80 group-hover:opacity-100">{handle}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Guest post note */}
            <div
              className="rounded-2xl border border-dashed p-6"
              style={{
                backgroundColor: "var(--sk-primary-light)",
                borderColor: "var(--sk-primary)",
              }}
            >
              <h3 className="font-bold" style={{ color: "var(--sk-primary-text)" }}>Write for SriKode</h3>
              <p className="mt-2 text-sm" style={{ color: "var(--sk-primary-text)" }}>
                Got something valuable to share with the dev community? I welcome quality guest posts on web development topics.
              </p>
              <p className="mt-3 text-xs opacity-75" style={{ color: "var(--sk-primary-text)" }}>Use the contact form with subject: <strong>&quot;Guest Post&quot;</strong></p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
