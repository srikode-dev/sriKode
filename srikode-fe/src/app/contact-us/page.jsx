"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle, MessageSquare } from "lucide-react";
import { FaGithub, FaYoutube, FaTwitter, FaLinkedin } from "react-icons/fa";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1100);
  };

  const socials = [
    { icon: FaGithub, label: "GitHub", handle: "@srikant-sahu", href: "https://github.com", color: "border-gray-200 hover:border-gray-800 hover:bg-gray-900 hover:text-white" },
    { icon: FaYoutube, label: "YouTube", handle: "SriKode", href: "https://youtube.com", color: "border-gray-200 hover:border-red-500 hover:bg-red-600 hover:text-white" },
    { icon: FaTwitter, label: "Twitter / X", handle: "@srikantdev", href: "https://twitter.com", color: "border-gray-200 hover:border-sky-400 hover:bg-sky-500 hover:text-white" },
    { icon: FaLinkedin, label: "LinkedIn", handle: "Srikant Sahu", href: "https://linkedin.com", color: "border-gray-200 hover:border-blue-600 hover:bg-blue-700 hover:text-white" },
  ];

  return (
    <div className="py-12">
      <Container>
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
            Contact
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">Get in Touch</h1>
          <p className="mx-auto mt-3 max-w-lg text-gray-500">
            Have a question, suggestion, or want to collaborate? Drop me a message — I read every one.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">

          {/* ── Contact Form ── */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <MessageSquare size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Send a Message</h2>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-green-50 border border-green-200 p-10 text-center">
                <CheckCircle size={40} className="text-green-500" />
                <p className="text-lg font-bold text-green-800">Message Sent!</p>
                <p className="text-sm text-green-600">
                  Thanks for reaching out. I&apos;ll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                {/* Name + Email */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-1.5 block text-xs font-semibold text-gray-600">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Srikant Sahu"
                      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 transition focus:ring-2 focus:ring-blue-100 ${errors.name ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-blue-400"}`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-1.5 block text-xs font-semibold text-gray-600">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 transition focus:ring-2 focus:ring-blue-100 ${errors.email ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-blue-400"}`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-semibold text-gray-600">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Guest post, collaboration, feedback..."
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 transition focus:ring-2 focus:ring-blue-100 ${errors.subject ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-blue-400"}`}
                  />
                  {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="mb-1.5 block text-xs font-semibold text-gray-600">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me what's on your mind..."
                    className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 transition focus:ring-2 focus:ring-blue-100 ${errors.message ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-blue-400"}`}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700 active:scale-95 disabled:opacity-60"
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
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Mail size={22} />
              </div>
              <h3 className="font-bold text-gray-900">Email Directly</h3>
              <p className="mt-1 text-sm text-gray-500">Prefer email? Reach me at:</p>
              <a
                href="mailto:hello@srikode.dev"
                className="mt-2 block text-sm font-semibold text-blue-600 hover:underline"
              >
                hello@srikode.dev
              </a>
              <p className="mt-3 text-xs text-gray-400">I typically reply within 24–48 hours.</p>
            </div>

            {/* Social connect */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-gray-900">Connect on Social</h3>
              <div className="flex flex-col gap-3">
                {socials.map(({ icon: Icon, label, handle, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium text-gray-700 transition ${color}`}
                  >
                    <Icon size={18} />
                    <span className="flex-1">{label}</span>
                    <span className="text-xs text-gray-400 group-hover:text-current">{handle}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Guest post note */}
            <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-6">
              <h3 className="font-bold text-blue-900">Write for SriKode</h3>
              <p className="mt-2 text-sm text-blue-700">
                Got something valuable to share with the dev community? I welcome quality guest posts on web development topics.
              </p>
              <p className="mt-3 text-xs text-blue-500">Use the contact form with subject: <strong>&quot;Guest Post&quot;</strong></p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
