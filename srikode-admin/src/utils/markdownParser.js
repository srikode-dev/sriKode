/**
 * Utility to parse Markdown (with YAML-like Frontmatter) or JSON
 * into SriKode's structured Blog article schema.
 */

/**
 * Parse frontmatter string into key-value map
 */
function parseFrontmatter(rawYaml) {
  const meta = {};
  const lines = rawYaml.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    let val = trimmed.slice(colonIndex + 1).trim();

    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }

    // Parse booleans
    if (val.toLowerCase() === "true") val = true;
    else if (val.toLowerCase() === "false") val = false;
    // Parse arrays: ["tag1", "tag2"] or [tag1, tag2]
    else if (val.startsWith("[") && val.endsWith("]")) {
      val = val
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean);
    }

    meta[key] = val;
  }

  return meta;
}

/**
 * Converts inline markdown into semantic, styled HTML
 */
export function parseInlineMarkdown(text) {
  if (!text || typeof text !== "string") return "";
  let res = text;
  // Inline code: `code`
  res = res.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 font-mono text-xs border border-zinc-700/60">$1</code>');
  // Bold: **text** or __text__
  res = res.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  res = res.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  // Italic: *text* or _text_
  res = res.replace(/(^|[^*])\*([^*\n\r]+?)\*([^*]|$)/g, "$1<em>$2</em>$3");
  res = res.replace(/(^|[^_])_([^_\n\r]+?)_([^_]|$)/g, "$1<em>$2</em>$3");
  // Links: [text](url)
  res = res.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline font-semibold hover:text-blue-700">$1</a>');
  return res;
}

/**
 * Main parser: converts raw markdown or JSON string into Blog Editor state
 */
export function parseBlogInput(rawInput) {
  if (!rawInput || typeof rawInput !== "string") {
    throw new Error("Input is empty");
  }

  const trimmed = rawInput.trim();

  // ── 1. CHECK IF INPUT IS JSON ─────────────────────────────────────
  if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
    try {
      const data = JSON.parse(trimmed);
      const blogData = Array.isArray(data) ? data[0] : data;

      if (!blogData || typeof blogData !== "object") {
        throw new Error("Invalid JSON structure");
      }

      return {
        title: blogData.title || "",
        slug: blogData.slug || "",
        excerpt: blogData.excerpt || "",
        description: blogData.description || "",
        category: blogData.category || "React",
        tags: Array.isArray(blogData.tags) ? blogData.tags : (blogData.tags ? String(blogData.tags).split(",").map(t => t.trim()) : []),
        difficulty: blogData.difficulty || "Beginner",
        coverImage: blogData.coverImage || "",
        githubUrl: blogData.githubUrl || "",
        liveUrl: blogData.liveUrl || "",
        videoUrl: blogData.videoUrl || "",
        isPublished: !!blogData.isPublished,
        isFeatured: !!blogData.isFeatured,
        content: Array.isArray(blogData.content) ? blogData.content : [],
        faq: Array.isArray(blogData.faq) ? blogData.faq : [],
        seo: {
          title: blogData.seo?.title || blogData.title || "",
          description: blogData.seo?.description || blogData.excerpt || "",
          keywords: Array.isArray(blogData.seo?.keywords) ? blogData.seo.keywords : [],
        },
        source: "json",
      };
    } catch (jsonErr) {
      console.warn("Input looked like JSON but parse failed, trying markdown parser...", jsonErr.message);
    }
  }

  // ── 2. MARKDOWN WITH FRONTMATTER PARSER ───────────────────────────
  let frontmatter = {};
  let body = trimmed;

  const fmRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
  const match = trimmed.match(fmRegex);

  if (match) {
    frontmatter = parseFrontmatter(match[1]);
    body = match[2].trim();
  }

  // Extract title from first H1 if not in frontmatter
  let title = frontmatter.title || "";
  const lines = body.split(/\r?\n/);
  
  if (!title && lines.length > 0 && lines[0].startsWith("# ")) {
    title = lines[0].replace(/^#\s+/, "").trim();
    lines.shift();
    body = lines.join("\n").trim();
  }

  const contentBlocks = [];
  const faqItems = [];
  let inFaqSection = false;

  const bodyLines = body.split(/\r?\n/);
  let i = 0;

  while (i < bodyLines.length) {
    const line = bodyLines[i];
    const trimmedLine = line.trim();

    // Skip empty lines
    if (!trimmedLine) {
      i++;
      continue;
    }

    // ── CODE BLOCK ──────────────────────────────────────────
    if (trimmedLine.startsWith("```")) {
      const info = trimmedLine.slice(3).trim();
      let language = "javascript";
      let filename = "";

      if (info) {
        // e.g. ```jsx filename="App.jsx" or ```jsx:App.jsx or ```jsx App.jsx
        const fnMatch = info.match(/filename=["']?([^"'\s]+)["']?/i) || info.match(/[:\s]([a-zA-Z0-9_\-\.\/]+)$/);
        if (fnMatch) {
          filename = fnMatch[1];
        }

        const langMatch = info.match(/^([a-zA-Z0-9_+#\-]+)/);
        if (langMatch) {
          language = langMatch[1].toLowerCase();
        }
      }

      i++;
      const codeLines = [];
      while (i < bodyLines.length && !bodyLines[i].trim().startsWith("```")) {
        codeLines.push(bodyLines[i]);
        i++;
      }
      i++; // Skip closing ```

      contentBlocks.push({
        type: "code",
        language: ["html", "css", "javascript", "jsx", "bash", "json", "python", "typescript"].includes(language) ? language : "javascript",
        filename,
        code: codeLines.join("\n"),
      });
      continue;
    }

    // ── HEADINGS ────────────────────────────────────────────
    if (trimmedLine.startsWith("#### ")) {
      const headingText = trimmedLine.replace(/^####\s+/, "").trim();
      contentBlocks.push({ type: "heading", level: 4, text: headingText });
      i++;
      continue;
    }

    if (trimmedLine.startsWith("### ")) {
      const headingText = trimmedLine.replace(/^###\s+/, "").trim();

      // If we are in FAQ section, this is an FAQ question!
      if (inFaqSection) {
        i++;
        const answerLines = [];
        while (i < bodyLines.length && !bodyLines[i].trim().startsWith("#") && !bodyLines[i].trim().startsWith("```")) {
          if (bodyLines[i].trim()) {
            answerLines.push(bodyLines[i].trim());
          }
          i++;
        }
        faqItems.push({
          question: headingText.replace(/^Q:\s*/i, ""),
          answer: parseInlineMarkdown(answerLines.join(" ")),
        });
        continue;
      }

      contentBlocks.push({ type: "heading", level: 3, text: headingText });
      i++;
      continue;
    }

    if (trimmedLine.startsWith("## ")) {
      const headingText = trimmedLine.replace(/^##\s+/, "").trim();
      
      // Check if this marks the beginning of the FAQ section
      if (/faq|frequently\s+asked\s+questions|common\s+questions/i.test(headingText)) {
        inFaqSection = true;
        i++;
        continue;
      } else {
        inFaqSection = false;
      }

      contentBlocks.push({ type: "heading", level: 2, text: headingText });
      i++;
      continue;
    }

    // ── IMAGE ───────────────────────────────────────────────
    // e.g. ![alt text | Prompt: artistic prompt](https://example.com/pic.jpg "caption")
    // or ![alt text]( "caption")
    const imgMatch = trimmedLine.match(/^!\[(.*?)\]\((.*?)(?:\s+["'](.*?)["'])?\)$/);
    if (imgMatch) {
      let rawAlt = imgMatch[1] || "";
      let imagePrompt = "";
      
      // Extract prompt if embedded in alt: "Alt text | Prompt: ..."
      if (rawAlt.includes("| Prompt:") || rawAlt.includes("| prompt:")) {
        const parts = rawAlt.split(/\|\s*prompt:\s*/i);
        rawAlt = parts[0].trim();
        imagePrompt = parts.slice(1).join(" ").trim();
      } else if (rawAlt.toLowerCase().startsWith("prompt:")) {
        imagePrompt = rawAlt.replace(/^prompt:\s*/i, "").trim();
        rawAlt = "Diagram / Illustration";
      }

      contentBlocks.push({
        type: "image",
        alt: rawAlt,
        src: imgMatch[2] || "",
        caption: parseInlineMarkdown(imgMatch[3] || ""),
        imagePrompt: imagePrompt || undefined,
      });
      i++;
      continue;
    }

    // ── CALLOUT OR QUOTE ────────────────────────────────────
    if (trimmedLine.startsWith(">")) {
      const quoteLines = [];
      while (i < bodyLines.length && bodyLines[i].trim().startsWith(">")) {
        quoteLines.push(bodyLines[i].trim().replace(/^>\s?/, ""));
        i++;
      }

      const fullQuoteText = quoteLines.join("\n");

      // Check for Github-style callouts: > [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT], > [!CAUTION]
      const calloutMatch = fullQuoteText.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|INFO|DANGER|SUCCESS)\](?:\s*(.*))?(\n[\s\S]*)?$/i);
      if (calloutMatch) {
        const typeTag = calloutMatch[1].toUpperCase();
        let variant = "info";
        if (["TIP", "SUCCESS"].includes(typeTag)) variant = "success";
        else if (["WARNING", "IMPORTANT"].includes(typeTag)) variant = "warning";
        else if (["CAUTION", "DANGER"].includes(typeTag)) variant = "danger";

        const title = calloutMatch[2] || `${typeTag.charAt(0) + typeTag.slice(1).toLowerCase()}`;
        const rest = calloutMatch[3] ? calloutMatch[3].trim() : "";

        contentBlocks.push({
          type: "callout",
          variant,
          title: parseInlineMarkdown(title),
          text: parseInlineMarkdown(rest || title),
        });
      } else {
        contentBlocks.push({
          type: "quote",
          text: parseInlineMarkdown(fullQuoteText),
          author: "",
        });
      }
      continue;
    }

    // ── TABLE ────────────────────────────────────────────────
    if (trimmedLine.startsWith("|")) {
      const tableLines = [];
      while (i < bodyLines.length && bodyLines[i].trim().startsWith("|")) {
        tableLines.push(bodyLines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const splitRow = (rowStr) => {
          let s = rowStr.trim();
          if (s.startsWith("|")) s = s.slice(1);
          if (s.endsWith("|")) s = s.slice(0, -1);
          return s.split("|").map((c) => parseInlineMarkdown(c.trim()));
        };

        const isSeparator = (rowStr) => {
          const stripped = rowStr.replace(/[|\s:\-]/g, "");
          return stripped === "" && rowStr.includes("-");
        };

        const headers = splitRow(tableLines[0]);
        let startIndex = 1;
        if (tableLines.length > 1 && isSeparator(tableLines[1])) {
          startIndex = 2;
        }

        const rows = [];
        for (let r = startIndex; r < tableLines.length; r++) {
          if (isSeparator(tableLines[r])) continue;
          const cells = splitRow(tableLines[r]);
          if (cells.length > 0 && cells.some((c) => c !== "")) {
            rows.push(cells);
          }
        }

        if (headers.length > 0 && rows.length > 0) {
          contentBlocks.push({
            type: "table",
            headers,
            rows,
          });
          continue;
        }
      }
    }

    // ── HORIZONTAL DIVIDER ───────────────────────────────────
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmedLine)) {
      contentBlocks.push({ type: "divider" });
      i++;
      continue;
    }

    // ── LIST (ORDERED OR UNORDERED) ─────────────────────────
    const isUnordered = trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ");
    const isOrdered = /^\d+\.\s+/.test(trimmedLine);

    if (isUnordered || isOrdered) {
      const items = [];
      const style = isOrdered ? "ordered" : "unordered";

      while (i < bodyLines.length) {
        const cur = bodyLines[i].trim();
        if (isOrdered && /^\d+\.\s+/.test(cur)) {
          items.push(cur.replace(/^\d+\.\s+/, ""));
          i++;
        } else if (!isOrdered && (cur.startsWith("- ") || cur.startsWith("* "))) {
          items.push(cur.replace(/^[-*]\s+/, ""));
          i++;
        } else {
          break;
        }
      }

      contentBlocks.push({
        type: "list",
        style,
        items: items.map((item) => parseInlineMarkdown(item)),
      });
      continue;
    }

    // ── PARAGRAPH ───────────────────────────────────────────
    const paraLines = [];
    while (
      i < bodyLines.length &&
      bodyLines[i].trim() &&
      !bodyLines[i].trim().startsWith("#") &&
      !bodyLines[i].trim().startsWith("```") &&
      !bodyLines[i].trim().startsWith(">") &&
      !bodyLines[i].trim().startsWith("- ") &&
      !bodyLines[i].trim().startsWith("* ") &&
      !/^\d+\.\s+/.test(bodyLines[i].trim()) &&
      !bodyLines[i].trim().startsWith("![") &&
      !(bodyLines[i].trim().startsWith("|") && bodyLines[i].trim().endsWith("|")) &&
      !/^(\-{3,}|\*{3,}|_{3,})$/.test(bodyLines[i].trim())
    ) {
      paraLines.push(bodyLines[i].trim());
      i++;
    }

    if (paraLines.length > 0) {
      contentBlocks.push({
        type: "paragraph",
        text: parseInlineMarkdown(paraLines.join(" ")),
      });
    }
  }

  // Determine teaser excerpt
  let excerpt = frontmatter.excerpt || "";
  if (!excerpt && contentBlocks.length > 0) {
    const firstPara = contentBlocks.find((b) => b.type === "paragraph");
    if (firstPara && firstPara.text) {
      // Strip HTML tags for clean card excerpt
      const cleanExcerpt = firstPara.text.replace(/<[^>]+>/g, "");
      excerpt = cleanExcerpt.slice(0, 160) + (cleanExcerpt.length > 160 ? "..." : "");
    }
  }

  // Tags normalization
  let tags = [];
  if (Array.isArray(frontmatter.tags)) {
    tags = frontmatter.tags;
  } else if (typeof frontmatter.tags === "string") {
    tags = frontmatter.tags.split(",").map((t) => t.trim()).filter(Boolean);
  }

  return {
    title: title || "Untitled Article",
    slug: frontmatter.slug || "",
    excerpt: excerpt || "A practical coding guide on SriKode.",
    description: frontmatter.description || excerpt || "",
    category: frontmatter.category || "React",
    tags,
    difficulty: ["Beginner", "Intermediate", "Advanced"].includes(frontmatter.difficulty)
      ? frontmatter.difficulty
      : "Beginner",
    coverImage: frontmatter.coverImage || "",
    coverImagePrompt: frontmatter.coverImagePrompt || frontmatter.imagePrompt || "",
    githubUrl: frontmatter.githubUrl || "",
    liveUrl: frontmatter.liveUrl || "",
    videoUrl: frontmatter.videoUrl || "",
    isPublished: frontmatter.isPublished === true,
    isFeatured: frontmatter.isFeatured === true,
    content: contentBlocks,
    faq: faqItems,
    seo: {
      title: frontmatter.seoTitle || title || "",
      description: frontmatter.seoDescription || excerpt || "",
      keywords: Array.isArray(frontmatter.seoKeywords)
        ? frontmatter.seoKeywords
        : (frontmatter.seoKeywords ? String(frontmatter.seoKeywords).split(",").map(k => k.trim()) : tags),
    },
    source: "markdown",
  };
}

/**
 * Dynamically builds a comprehensive prompt for Claude / ChatGPT
 */
export function generateCustomAiPrompt({
  topic = "Building a Full-Stack Feature with React and Node.js",
  wordCount = "1800 - 2200 words (Comprehensive Guide)",
  category = "React",
  difficulty = "Intermediate",
  tone = "Practical, code-heavy, professional production-ready",
  customInstructions = "",
} = {}) {
  const cleanSlug = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  return `You are a Principal Full-Stack Software Engineer and Senior Technical Writer for SriKode (a modern developer tutorial platform).

Write an exhaustive, high-quality, production-ready tutorial on the topic:
"${topic}"

ARTICLE SPECIFICATIONS:
- Target Category: ${category}
- Target Difficulty Level: ${difficulty}
- Target Length: At least ${wordCount}. Do NOT write a shallow or brief summary. Write a deep, complete, step-by-step masterclass with thorough explanations for every decision.
- Tone & Style: ${tone}
${customInstructions ? `- Special User Requirements: ${customInstructions}\n` : ""}

CRITICAL FORMATTING RULES FOR SRIKODE PARSER:
1. Output ONLY the raw Markdown starting directly with YAML frontmatter at the very top (between --- delimiters). Do NOT wrap the entire response in outer markdown fences and do not add conversational pleasantries before or after.
2. For Tables: ALWAYS use standard clean Markdown table format with pipe characters (e.g. | Feature | Description | Status |) and standard hyphen separator line (e.g. | --- | --- | --- |). NEVER use ASCII art graphs, raw pipes without closed columns, or box-drawing characters.
3. For Inline Formatting: Always format bold terms cleanly with **bold** and inline code with \`code\`. Never leave unbalanced asterisks.
4. For Code Blocks: ALWAYS specify the language AND filename attribute (e.g. \`\`\`jsx filename="src/components/MyComponent.jsx" or \`\`\`javascript filename="server/index.js"). Provide COMPLETE, functioning code, not placeholders like "// write code here".
5. For Tips & Callouts: Use GitHub-style blockquotes (e.g. > [!NOTE], > [!TIP], > [!WARNING], > [!CAUTION]).
6. For Visual Diagrams & AI Image Generation:
   - Provide a creative 16:9 Cover Image prompt in frontmatter (\`coverImagePrompt\`).
   - Include 1-2 in-article diagram placeholders with detailed AI image generation prompts inside the alt tag using:
     \`![Diagram Title | Prompt: Detailed art direction prompt for Midjourney/DALL-E, 1:1 or 3:2 aspect ratio, modern dark tech UI aesthetic]( "Figure 1: Diagram Caption")\`
7. For FAQ Section: End the article with "## Frequently Asked Questions" followed by individual questions formatted as "### Question Here" followed by the clear, practical answer.

EXACT FRONTMATTER FORMAT REQUIRED:
---
title: "${topic}"
slug: "${cleanSlug}"
excerpt: "1-2 sentence compelling teaser summary of what the reader will build or master."
category: "${category}"
difficulty: "${difficulty}"
tags: ["${category}", "Tutorial", "WebDev", "FullStack"]
coverImage: ""
coverImagePrompt: "A vibrant 16:9 technical concept art illustration of ${topic}, sleek dark-mode background, neon accents, isometric 3D developer aesthetic, 1200x630"
isFeatured: false
isPublished: false
---

FOLLOW THIS STRUCTURE IN THE ARTICLE:
## Introduction & Problem Context
Explain the real-world problem and why it matters in modern web applications.

## Key Concepts & Architecture Overview
Include an architectural explanation or Markdown comparison table.

![System Architecture Overview | Prompt: Clean technical flow diagram showing ${topic} step-by-step workflow, sleek dark mode aesthetic, vibrant accents, 16:9]( "Figure 1: Architectural System Overview")

## Prerequisites
- List tools, packages, and prerequisites

> [!NOTE]
> Add helpful developer notes or prerequisite versions.

## Step 1: Core Setup & Configuration
Detailed step-by-step implementation with code blocks containing filename attributes.

## Step 2: Full Implementation
Continue with in-depth code explanations and best practices.

## Common Gotchas & Troubleshooting
> [!WARNING]
> Highlight dangerous pitfalls, security issues, or performance traps.

## Summary & Key Takeaways
- Bullet points summarizing core concepts.

## Frequently Asked Questions

### First common question?
Clear, detailed answer explaining the solution.

### Second common question?
Clear, detailed answer explaining the solution.
`;
}

/**
 * Default copyable template
 */
export const AI_PROMPT_TEMPLATE = generateCustomAiPrompt({
  topic: "CORS Errors Explained: Why They Happen and How to Fix Them",
  wordCount: "1800 - 2200 words",
  category: "JavaScript",
  difficulty: "Intermediate",
  customInstructions: "Include comparison tables of CORS headers, Express middleware code, and Next.js proxy config."
});
