import Image from "next/image";
import { Copy, Check, AlertTriangle, Info, Lightbulb } from "lucide-react";
import CopyButton from "./CopyButton";

function Heading({ level, text, id }) {
  const Tag = `h${level}`;
  const sizes = { 2: "text-2xl mt-10 mb-4", 3: "text-xl mt-8 mb-3", 4: "text-lg mt-6 mb-2" };
  return (
    <Tag
      id={id}
      className={`font-bold text-gray-900 scroll-mt-24 ${sizes[level] || sizes[2]}`}
    >
      {text}
    </Tag>
  );
}

function CodeBlock({ language, filename, code }) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-gray-200 bg-gray-950 shadow">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
          {filename && (
            <span className="ml-2 text-xs text-gray-400 font-mono">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {language && (
            <span className="rounded bg-gray-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              {language}
            </span>
          )}
          <CopyButton code={code} />
        </div>
      </div>
      {/* Code */}
      <pre className="overflow-x-auto p-5 text-sm leading-relaxed text-gray-100 font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Callout({ variant, title, text }) {
  const styles = {
    info: { bg: "bg-blue-50 border-blue-300", icon: <Info size={16} className="text-blue-500 shrink-0" />, titleColor: "text-blue-700" },
    warning: { bg: "bg-amber-50 border-amber-300", icon: <AlertTriangle size={16} className="text-amber-500 shrink-0" />, titleColor: "text-amber-700" },
    tip: { bg: "bg-green-50 border-green-300", icon: <Lightbulb size={16} className="text-green-500 shrink-0" />, titleColor: "text-green-700" },
  };
  const s = styles[variant] || styles.info;
  return (
    <div className={`my-5 flex gap-3 rounded-xl border-l-4 p-4 ${s.bg}`}>
      {s.icon}
      <div>
        {title && <p className={`mb-1 text-sm font-bold ${s.titleColor}`}>{title}</p>}
        <p className="text-sm text-gray-700">{text}</p>
      </div>
    </div>
  );
}

export default function ArticleContent({ content }) {
  if (!content) return null;

  return (
    <div className="prose-content text-gray-700">
      {content.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <Heading
                key={i}
                level={block.level}
                text={block.text}
                id={block.text.toLowerCase().replace(/\s+/g, "-")}
              />
            );
          case "paragraph":
            return (
              <p key={i} className="my-4 leading-relaxed text-gray-700">
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
                <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={block.src}
                    alt={block.alt || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 65vw"
                  />
                </div>
                {block.caption && (
                  <figcaption className="mt-2 text-center text-sm text-gray-400 italic">
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
              <ol key={i} className="my-4 list-decimal space-y-2 pl-6 text-gray-700">
                {block.items.map((item, j) => <li key={j}>{item}</li>)}
              </ol>
            ) : (
              <ul key={i} className="my-4 list-disc space-y-2 pl-6 text-gray-700">
                {block.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            );
          case "quote":
            return (
              <blockquote key={i} className="my-6 border-l-4 border-blue-500 bg-blue-50 px-5 py-4 rounded-r-xl">
                <p className="italic text-gray-700">&ldquo;{block.text}&rdquo;</p>
                {block.author && <footer className="mt-2 text-xs font-semibold text-gray-500">— {block.author}</footer>}
              </blockquote>
            );
          case "table":
            return (
              <div key={i} className="my-6 overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      {block.headers.map((h, j) => (
                        <th key={j} className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        {row.map((cell, k) => (
                          <td key={k} className="px-4 py-3 text-gray-600">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "divider":
            return <hr key={i} className="my-8 border-gray-200" />;
          case "video":
            return (
              <div key={i} className="my-8 overflow-hidden rounded-xl border border-gray-200">
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
