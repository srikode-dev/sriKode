"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Info, AlertTriangle, Lightbulb, Check, Copy } from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";

function Heading({ level, text, id }) {
  const Tag = `h${level}`;
  const sizes = {
    2: "text-2xl mt-10 mb-4",
    3: "text-xl mt-8 mb-3",
    4: "text-lg mt-6 mb-2",
  };
  return (
    <Tag
      id={id}
      className={`font-extrabold text-sk-text scroll-mt-24 tracking-tight ${sizes[level] || sizes[2]}`}
    >
      {text}
    </Tag>
  );
}

function formatCode(code, language) {
  if (!code) return "";
  if (code.includes("\n")) return code;
  const lang = language?.toLowerCase();
  if (lang === "css") {
    return code
      .replace(/\{/g, " {\n  ")
      .replace(/\}/g, "\n}\n")
      .replace(/;/g, ";\n  ")
      .replace(/  \n\}/g, "}")
      .trim();
  }
  if (lang === "html" || lang === "xml" || lang === "markup") {
    let formatted = code.replace(/>\s*</g, ">\n<");
    const lines = formatted.split("\n");
    let indentLevel = 0;
    const result = lines.map((line) => {
      let currentIndent = indentLevel;
      if (line.match(/^<\/[a-zA-Z0-9]+>/)) {
        indentLevel = Math.max(0, indentLevel - 1);
        currentIndent = indentLevel;
      } else if (line.match(/^<[a-zA-Z0-9]+[^>]*>/) && !line.match(/\/>$/) && !line.includes("</")) {
        indentLevel++;
      }
      return "  ".repeat(currentIndent) + line;
    });
    return result.join("\n");
  }
  if (["javascript", "js", "typescript", "ts", "jsx", "tsx"].includes(lang)) {
    return code
      .replace(/\{/g, " {\n  ")
      .replace(/\}/g, "\n}\n")
      .replace(/;/g, ";\n  ")
      .replace(/  \n\}/g, "}")
      .trim();
  }
  return code;
}

function CodeBlock({ language, filename, code }) {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState("");

  useEffect(() => {
    try {
      const lang = language?.toLowerCase() || "javascript";
      const formatted = formatCode(code, lang);
      const prismLang = Prism.languages[lang] || Prism.languages.javascript;
      const html = Prism.highlight(formatted, prismLang, lang);
      setHighlightedHtml(html);
    } catch {
      setHighlightedHtml(code);
    }
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const lines = highlightedHtml ? highlightedHtml.split("\n") : code.split("\n");

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-zinc-200/10 bg-[#1e1e1e] shadow-lg">
      {/* VS Code Top Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-[#181818] px-4 py-2.5 select-none">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          {filename && (
            <span className="ml-3 font-mono text-xs text-zinc-400">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {language && (
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              {language}
            </span>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            {copied ? (
              <>
                <Check size={12} className="text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      {/* Code body with line numbers */}
      <div className="overflow-x-auto py-4">
        <table className="w-full border-collapse font-mono text-sm leading-relaxed text-zinc-100">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="group hover:bg-[#252525]">
                <td className="w-10 select-none text-right pr-4 text-zinc-600 font-mono text-xs border-r border-zinc-800/40">
                  {idx + 1}
                </td>
                <td className="pl-4 whitespace-pre font-mono text-zinc-100 text-[13px]">
                  {highlightedHtml ? (
                    <span dangerouslySetInnerHTML={{ __html: line || " " }} />
                  ) : (
                    <span>{line || " "}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Callout({ variant, title, text }) {
  const styles = {
    info: {
      bg: "bg-blue-50/40 border-blue-200 dark:border-blue-800/45",
      icon: <Info size={16} className="text-sk-primary shrink-0" />,
      titleColor: "text-sk-primary-text font-extrabold",
      textColor: "text-sk-text font-semibold",
    },
    warning: {
      bg: "bg-amber-50/40 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/45",
      icon: <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />,
      titleColor: "text-amber-900 dark:text-amber-400 font-extrabold",
      textColor: "text-sk-text font-semibold",
    },
    tip: {
      bg: "bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/45",
      icon: <Lightbulb size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />,
      titleColor: "text-emerald-900 dark:text-emerald-400 font-extrabold",
      textColor: "text-sk-text font-semibold",
    },
  };
  const s = styles[variant] || styles.info;
  return (
    <div className={`my-5 flex gap-3 rounded-xl border-l-4 p-4 ${s.bg}`}>
      {s.icon}
      <div>
        {title && <p className={`mb-1 text-sm font-bold ${s.titleColor}`}>{title}</p>}
        <p className={`text-sm ${s.textColor}`}>{text}</p>
      </div>
    </div>
  );
}

export default function ArticleContent({ content, toc = [] }) {
  if (!content) return null;

  return (
    <div className="prose-content text-sk-text-muted">
      {content.map((block, i) => {
        switch (block.type) {
          case "heading": {
            const matchingToc = toc.find(
              (item) =>
                item.title.toLowerCase() === block.text.toLowerCase() ||
                block.text.toLowerCase().includes(item.title.toLowerCase())
            );
            const headingId = matchingToc
              ? matchingToc.id
              : block.text.toLowerCase().replace(/\s+/g, "-");
            return (
              <Heading key={i} level={block.level} text={block.text} id={headingId} />
            );
          }
          case "paragraph":
            return (
              <p key={i} className="my-4 leading-relaxed text-sk-text-muted">
                {block.text}
              </p>
            );
          case "code":
            return (
              <CodeBlock
                key={i}
                language={block.language}
                filename={block.filename}
                code={block.code}
              />
            );
          case "image":
            return (
              <figure key={i} className="my-8">
                <div className="relative aspect-video overflow-hidden rounded-xl border border-sk-border bg-sk-bg-subtle">
                  <Image
                    src={block.src}
                    alt={block.alt || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 65vw"
                  />
                </div>
                {block.caption && (
                  <figcaption className="mt-2 text-center text-sm text-sk-text-faint italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          case "callout":
            return <Callout key={i} variant={block.variant} title={block.title} text={block.text} />;
          case "tip":
            return <Callout key={i} variant="tip" text={block.text} />;
          case "warning":
            return <Callout key={i} variant="warning" text={block.text} />;
          case "list":
            return block.style === "ordered" ? (
              <ol key={i} className="my-4 list-decimal space-y-2 pl-6 text-sk-text-muted">
                {block.items.map((item, j) => <li key={j}>{item}</li>)}
              </ol>
            ) : (
              <ul key={i} className="my-4 list-disc space-y-2 pl-6 text-sk-text-muted">
                {block.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            );
          case "quote":
            return (
              <blockquote key={i} className="my-6 border-l-4 border-sk-primary bg-sk-primary-light/40 px-5 py-4 rounded-r-xl">
                <p className="italic text-sk-text font-semibold">&ldquo;{block.text}&rdquo;</p>
                {block.author && (
                  <footer className="mt-2 text-xs font-semibold text-sk-text-faint">
                    — {block.author}
                  </footer>
                )}
              </blockquote>
            );
          case "table":
            return (
              <div key={i} className="my-6 overflow-x-auto rounded-xl border border-sk-border bg-sk-bg-card">
                <table className="w-full text-sm">
                  <thead className="bg-sk-bg-subtle text-left">
                    <tr>
                      {block.headers.map((h, j) => (
                        <th key={j} className="border-b border-sk-border px-4 py-3 font-bold text-sk-text">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sk-border">
                    {block.rows.map((row, j) => (
                      <tr key={j} className="hover:bg-sk-bg-subtle/50 transition-colors">
                        {row.map((cell, k) => (
                          <td key={k} className="px-4 py-3 text-sk-text-muted">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "divider":
            return <hr key={i} className="my-8 border-sk-border" />;
          case "video":
            return (
              <div key={i} className="my-8 overflow-hidden rounded-xl border border-sk-border">
                <div className="relative aspect-video">
                  <iframe
                    src={block.url.replace("watch?v=", "embed/")}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                    title="Embedded video"
                  />
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
