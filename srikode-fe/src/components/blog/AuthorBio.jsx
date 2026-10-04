"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Sparkles, User } from "lucide-react";
import { FaGithub, FaTwitter, FaYoutube } from "react-icons/fa";

export default function AuthorBio({ author = {} }) {
  const [imgError, setImgError] = useState(false);
  const name = author?.name || "SriKode Team";
  const role = author?.role || "Web Developers & Technical Editors";
  const avatar = author?.avatar;
  const bio =
    author?.bio ||
    "Crafting clean, production-ready web apps with React, Next.js, and Node.js. Sharing real-world tutorials and architectural insights on SriKode.";

  return (
    <div className="my-10 rounded-2xl border border-sk-border bg-linear-to-br from-sk-bg-card via-sk-bg-card to-sk-bg-subtle/50 p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
        {/* Author Avatar with subtle status ring or Initials fallback */}
        <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-2xl border-2 border-sk-border bg-sk-bg-subtle shadow-xs flex items-center justify-center">
          {!imgError && avatar ? (
            <Image
              src={avatar}
              alt={name}
              fill
              onError={() => setImgError(true)}
              className="object-cover"
              sizes="72px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xl tracking-tight select-none">
              {name.split(" ").map(n => n[0]).join("").slice(0, 2) || "SK"}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-sk-primary">
                  Written by
                </p>
              </div>
              <h3 className="text-lg font-extrabold text-sk-text">{name}</h3>
            </div>
            <span className="inline-flex self-center sm:self-auto items-center gap-1 rounded-full bg-sk-primary-light px-3 py-1 text-xs font-bold text-sk-primary-text border border-sk-primary/20">
              <Sparkles size={12} />
              {role}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-sk-text-muted">{bio}</p>

          {/* Social Links & About CTA */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs font-semibold text-sk-text-muted">
            <Link
              href="/about"
              className="inline-flex items-center gap-1 text-sk-primary hover:underline font-bold"
            >
              <span>About SriKode</span>
              <ExternalLink size={12} />
            </Link>
            <span className="text-sk-border-strong">•</span>
            <a
              href="https://github.com/srikode"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-sk-text transition-colors"
            >
              <FaGithub size={13} />
              <span>GitHub</span>
            </a>
            <span className="text-sk-border-strong">•</span>
            <a
              href="https://youtube.com/@srikode"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-sk-text transition-colors"
            >
              <FaYoutube size={13} className="text-red-500" />
              <span>YouTube</span>
            </a>
            <span className="text-sk-border-strong">•</span>
            <a
              href="https://x.com/srikode"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-sk-text transition-colors"
            >
              <FaTwitter size={12} />
              <span>X</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
