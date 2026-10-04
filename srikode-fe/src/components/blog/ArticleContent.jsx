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
      <div className="code-scrollbar overflow-auto py-4 max-h-[450px]">
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

export function formatInlineMarkdown(str) {
  if (!str || typeof str !== "string") return "";
  let html = str;

  // 1. Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="rounded px-1.5 py-0.5 text-[13px] font-mono font-semibold bg-sk-bg-subtle text-sk-primary border border-sk-border/70">$1</code>');

  // 2. Bold: **text** or __text__
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-sk-text">$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong class="font-bold text-sk-text">$1</strong>');

  // 3. Italic: *text* or _text_
  html = html.replace(/(^|[^*])\*([^*\n\r]+?)\*([^*]|$)/g, '$1<em class="italic text-sk-text">$2</em>$3');
  html = html.replace(/(^|[^_])_([^_\n\r]+?)_([^_]|$)/g, '$1<em class="italic text-sk-text">$2</em>$3');

  // 4. Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|#[^\s)]+|\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-sk-primary hover:underline font-semibold inline-flex items-center gap-0.5">$1</a>');

  return html;
}

function Callout({ variant, title, text }) {
  const styles = {
    info: {
      bg: "bg-blue-50/50 border-blue-400 dark:bg-blue-950/20 dark:border-blue-700",
      icon: <Info size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />,
      titleColor: "text-blue-950 dark:text-blue-300 font-extrabold",
      textColor: "text-blue-950/85 dark:text-blue-200/90 font-medium",
    },
    warning: {
      bg: "bg-amber-50/50 border-amber-400 dark:bg-amber-950/20 dark:border-amber-700",
      icon: <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
      titleColor: "text-amber-950 dark:text-amber-300 font-extrabold",
      textColor: "text-amber-950/85 dark:text-amber-200/90 font-medium",
    },
    tip: {
      bg: "bg-emerald-50/50 border-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-700",
      icon: <Lightbulb size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
      titleColor: "text-emerald-950 dark:text-emerald-300 font-extrabold",
      textColor: "text-emerald-950/85 dark:text-emerald-200/90 font-medium",
    },
    danger: {
      bg: "bg-rose-50/50 border-rose-400 dark:bg-rose-950/20 dark:border-rose-700",
      icon: <AlertTriangle size={18} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />,
      titleColor: "text-rose-950 dark:text-rose-300 font-extrabold",
      textColor: "text-rose-950/85 dark:text-rose-200/90 font-medium",
    },
    success: {
      bg: "bg-emerald-50/50 border-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-700",
      icon: <Lightbulb size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
      titleColor: "text-emerald-950 dark:text-emerald-300 font-extrabold",
      textColor: "text-emerald-950/85 dark:text-emerald-200/90 font-medium",
    },
  };
  const s = styles[variant] || styles.info;
  return (
    <div className={`my-6 flex gap-3.5 rounded-2xl border-l-4 p-4.5 ${s.bg}`}>
      {s.icon}
      <div className="flex-1 space-y-1">
        {title && (
          <p
            className={`text-sm font-bold ${s.titleColor}`}
            dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(title) }}
          />
        )}
        <p
          className={`text-sm leading-relaxed ${s.textColor}`}
          dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(text) }}
        />
      </div>
    </div>
  );
}

function renderParagraphOrTable(text, key) {
  if (typeof text === "string" && text.includes("|") && (text.includes("---") || text.includes("--"))) {
    const normalized = text.replace(/\|\s*\|/g, "|\n|");
    const lines = normalized.trim().split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length >= 2 && lines.every((l) => l.startsWith("|"))) {
      const splitRow = (rowStr) => {
        let s = rowStr.trim();
        if (s.startsWith("|")) s = s.slice(1);
        if (s.endsWith("|")) s = s.slice(0, -1);
        return s.split("|").map((c) => c.trim());
      };
      const isSep = (rowStr) => {
        const stripped = rowStr.replace(/[|\s:]/g, "").replace(/-/g, "");
        return stripped === "" && rowStr.includes("-");
      };

      const headers = splitRow(lines[0]);
      let startIdx = 1;
      if (lines.length > 1 && isSep(lines[1])) startIdx = 2;

      const rows = [];
      for (let r = startIdx; r < lines.length; r++) {
        if (isSep(lines[r])) continue;
        const cells = splitRow(lines[r]);
        if (cells.length > 0 && cells.some((c) => c !== "")) {
          rows.push(cells);
        }
      }

      if (headers.length > 0 && rows.length > 0) {
        return (
          <div key={key} className="my-8 overflow-hidden rounded-2xl border border-sk-border bg-sk-bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-sk-bg-subtle/80 border-b border-sk-border">
                  <tr>
                    {headers.map((h, j) => (
                      <th
                        key={j}
                        className="px-5 py-3.5 font-bold text-sk-text tracking-wide text-xs uppercase"
                        dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(h) }}
                      />
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sk-border/70">
                  {rows.map((row, j) => (
                    <tr key={j} className="hover:bg-sk-bg-subtle/40 transition-colors even:bg-sk-bg-subtle/20">
                      {row.map((cell, k) => (
                        <td
                          key={k}
                          className="px-5 py-3.5 text-sk-text-muted leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell) }}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
    }
  }

  return (
    <p
      key={key}
      className="my-4 leading-relaxed text-sk-text-muted"
      dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(text) }}
    />
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
            return renderParagraphOrTable(block.text, i);
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
                  <figcaption
                    className="mt-2 text-center text-sm text-sk-text-faint italic"
                    dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(block.caption) }}
                  />
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
                {(block.items || []).map((item, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
                ))}
              </ol>
            ) : (
              <ul key={i} className="my-4 list-disc space-y-2 pl-6 text-sk-text-muted">
                {(block.items || []).map((item, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote key={i} className="my-6 border-l-4 border-sk-primary bg-sk-primary-light/40 px-5 py-4 rounded-r-xl">
                <p
                  className="italic text-sk-text font-semibold"
                  dangerouslySetInnerHTML={{ __html: `&ldquo;${formatInlineMarkdown(block.text)}&rdquo;` }}
                />
                {block.author && (
                  <footer className="mt-2 text-xs font-semibold text-sk-text-faint">
                    — {block.author}
                  </footer>
                )}
              </blockquote>
            );
          case "table":
            return (
              <div key={i} className="my-8 overflow-hidden rounded-2xl border border-sk-border bg-sk-bg-card shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-sk-bg-subtle/80 border-b border-sk-border">
                      <tr>
                        {(block.headers || []).map((h, j) => (
                          <th
                            key={j}
                            className="px-5 py-3.5 font-bold text-sk-text tracking-wide text-xs uppercase"
                            dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(h) }}
                          />
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sk-border/70">
                      {(block.rows || []).map((row, j) => (
                        <tr
                          key={j}
                          className="hover:bg-sk-bg-subtle/40 transition-colors even:bg-sk-bg-subtle/20"
                        >
                          {(row || []).map((cell, k) => (
                            <td
                              key={k}
                              className="px-5 py-3.5 text-sk-text-muted leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell) }}
                            />
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
