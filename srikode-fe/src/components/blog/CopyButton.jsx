"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy code"
      className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-gray-400 transition hover:bg-gray-700 hover:text-white"
    >
      {copied ? (
        <>
          <Check size={12} className="text-green-400" />
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy size={12} />
          Copy
        </>
      )}
    </button>
  );
}
