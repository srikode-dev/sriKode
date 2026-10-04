"use client";

import { useState, useEffect } from "react";
import { Share2, Link as LinkIcon, Check } from "lucide-react";
import { FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";

export default function SocialShare({ title = "", slug = "" }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, [slug]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(shareUrl)}&via=srikode`;

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl
  )}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${title} — ${shareUrl}`
  )}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-sk-border bg-sk-bg-subtle/40 p-4 sm:p-5">
      <div className="flex items-center gap-2 text-sm font-bold text-sk-text">
        <Share2 size={16} className="text-sk-primary" />
        <span>Share this tutorial:</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-xl border border-sk-border bg-sk-bg-card px-3.5 py-2 text-xs font-semibold text-sk-text shadow-2xs hover:border-sk-primary hover:text-sk-primary transition-all active:scale-95 cursor-pointer"
          title="Copy Link to Clipboard"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-500" />
              <span className="text-emerald-600 font-bold">Link Copied!</span>
            </>
          ) : (
            <>
              <LinkIcon size={14} />
              <span>Copy Link</span>
            </>
          )}
        </button>

        {/* X / Twitter */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-sk-border bg-sk-bg-card px-3 py-2 text-xs font-semibold text-sk-text shadow-2xs hover:bg-[#0f1419] hover:text-white hover:border-[#0f1419] dark:hover:bg-white dark:hover:text-black transition-all active:scale-95"
          title="Share on X / Twitter"
        >
          <FaTwitter size={13} />
          <span className="hidden sm:inline">Post</span>
        </a>

        {/* LinkedIn */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-sk-border bg-sk-bg-card px-3 py-2 text-xs font-semibold text-sk-text shadow-2xs hover:bg-[#0a66c2] hover:text-white hover:border-[#0a66c2] transition-all active:scale-95"
          title="Share on LinkedIn"
        >
          <FaLinkedin size={13} />
          <span className="hidden sm:inline">Share</span>
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-sk-border bg-sk-bg-card px-3 py-2 text-xs font-semibold text-sk-text shadow-2xs hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all active:scale-95"
          title="Share on WhatsApp"
        >
          <FaWhatsapp size={14} />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
