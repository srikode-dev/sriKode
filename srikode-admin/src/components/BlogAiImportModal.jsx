import { useState } from "react";
import { 
  X, 
  Sparkles, 
  Upload, 
  Copy, 
  Check, 
  FileText, 
  FileCode, 
  Sliders,
  AlertCircle,
  Wand2,
  Layers,
  BookOpen
} from "lucide-react";
import { parseBlogInput, generateCustomAiPrompt } from "../utils/markdownParser.js";
import { toast } from "sonner";

export default function BlogAiImportModal({ isOpen, onClose, onImport }) {
  const [activeTab, setActiveTab] = useState("paste"); // "paste" | "prompt-generator"
  const [rawText, setRawText] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedSample, setCopiedSample] = useState(false);
  const [parseError, setParseError] = useState("");

  // Prompt Generator States
  const [promptTopic, setPromptTopic] = useState("Mastering React 19 Actions & Optimistic UI");
  const [promptWordCount, setPromptWordCount] = useState("1800 - 2200 words (Comprehensive Guide)");
  const [promptCategory, setPromptCategory] = useState("React");
  const [promptDifficulty, setPromptDifficulty] = useState("Intermediate");
  const [promptInstructions, setPromptInstructions] = useState(
    "Include comparison tables of React 18 vs 19 features, real production form code with useActionState, and common pitfall warnings."
  );

  if (!isOpen) return null;

  const currentGeneratedPrompt = generateCustomAiPrompt({
    topic: promptTopic.trim() || "Full-Stack Development Tutorial",
    wordCount: promptWordCount,
    category: promptCategory,
    difficulty: promptDifficulty,
    customInstructions: promptInstructions.trim(),
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        setRawText(content);
        setParseError("");
        toast.info(`Loaded file: ${file.name}`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExecuteImport = () => {
    if (!rawText.trim()) {
      setParseError("Please paste Markdown or JSON text, or upload a file first.");
      return;
    }

    try {
      setParseError("");
      const parsed = parseBlogInput(rawText);

      onImport(parsed);
      toast.success(
        `Imported "${parsed.title}" with ${parsed.content.length} sections and ${parsed.faq.length} FAQs!`
      );
      onClose();
    } catch (err) {
      console.error("Import parse error:", err);
      setParseError(err.message || "Failed to parse input. Please ensure valid Markdown or JSON format.");
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(currentGeneratedPrompt);
    setCopiedPrompt(true);
    toast.success("Tailored Claude prompt copied to clipboard! Paste it into Claude or ChatGPT.");
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const sampleMarkdown = `---
title: "Mastering React 19 Actions & Optimistic UI"
slug: "mastering-react-19-actions-and-optimistic-ui"
excerpt: "A practical step-by-step tutorial on using Server Actions, useActionState, and useOptimistic in real production apps."
category: "React"
difficulty: "Intermediate"
tags: ["React", "React 19", "JavaScript"]
coverImage: ""
isFeatured: true
isPublished: false
---

## Introduction & Context
React 19 revolutionizes form handling and mutations. In this guide, we will build a full example step-by-step.

| Hook Name | Purpose | React 19 Support |
| :--- | :--- | :--- |
| useActionState | Manages action pending state and result | Native Built-in |
| useOptimistic | Immediate optimistic UI response | Native Built-in |
| useFormStatus | Nested submit button status | Native Built-in |

> [!NOTE]
> Ensure you have React 19 installed in your project before trying these hooks.

## Step 1: Implementation
Here is how simple form handling becomes:

\`\`\`jsx filename="src/components/Counter.jsx"
import { useActionState } from "react";

async function updateName(previousState, formData) {
  const name = formData.get("name");
  return { name };
}
\`\`\`

## Key Takeaways
- No more manual loading states
- Built-in error handling
- Works with standard HTML forms

## Frequently Asked Questions

### Is useActionState available in client components?
Yes, useActionState is designed specifically for React Client Components.
`;

  const handleCopySample = () => {
    navigator.clipboard.writeText(sampleMarkdown);
    setCopiedSample(true);
    toast.success("Sample template copied to clipboard!");
    setTimeout(() => setCopiedSample(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                AI Article Generator & Import Studio
              </h2>
              <p className="text-xs text-slate-500">
                Generate tailored Claude prompts with custom word counts, or paste/import existing .md files
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-white gap-2">
          <button
            onClick={() => setActiveTab("paste")}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
              activeTab === "paste"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Upload className="h-4 w-4" />
            1. Paste or Upload Markdown
          </button>
          <button
            onClick={() => setActiveTab("prompt-generator")}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
              activeTab === "prompt-generator"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Wand2 className="h-4 w-4" />
            2. Tailor AI Prompt (Word Count & Topic)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: PASTE / UPLOAD */}
          {activeTab === "paste" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-blue-50/70 border border-blue-100 p-3.5 rounded-2xl text-xs text-blue-800">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0 text-blue-600" />
                  <span>
                    Paste the <strong>Markdown</strong> generated by Claude. Tables, code blocks, callouts, and FAQs are automatically converted into visual sections.
                  </span>
                </div>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-blue-700 font-bold hover:bg-blue-50 cursor-pointer transition shrink-0 self-start sm:self-auto">
                  <Upload className="h-3.5 w-3.5" />
                  Upload .md / .json
                  <input
                    type="file"
                    accept=".md,.json,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {parseError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Raw Markdown Content
                </label>
                <textarea
                  rows={13}
                  value={rawText}
                  onChange={(e) => {
                    setRawText(e.target.value);
                    if (parseError) setParseError("");
                  }}
                  placeholder="Paste your markdown (with frontmatter ---) or JSON here..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/40 p-4 text-xs font-mono text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition resize-none"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>{rawText.length} characters</span>
                <span className="italic">Supports YAML Frontmatter, Code blocks, Tables, Callouts, and FAQs</span>
              </div>
            </div>
          )}

          {/* TAB 2: PROMPT GENERATOR STUDIO */}
          {activeTab === "prompt-generator" && (
            <div className="space-y-4">
              {/* Interactive Inputs */}
              <div className="bg-slate-50/80 border border-slate-200 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <Sliders className="h-4 w-4 text-blue-600" />
                  Step 1: Configure Your Article Prompt
                </div>

                {/* Topic / Idea */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Blog Topic or Article Idea:
                  </label>
                  <input
                    type="text"
                    value={promptTopic}
                    onChange={(e) => setPromptTopic(e.target.value)}
                    placeholder="e.g. CORS Errors Explained: Why They Happen and How to Fix Them"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Word Count Presets & Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Minimum Word Count Target:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      "1200 - 1500 words (Standard)",
                      "1800 - 2200 words (Comprehensive Guide)",
                      "2500 - 3500+ words (Complete Deep Dive)",
                    ].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setPromptWordCount(count)}
                        className={`px-3 py-2 rounded-xl text-[11px] font-bold text-left transition border cursor-pointer ${
                          promptWordCount === count
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category & Difficulty */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Category:
                    </label>
                    <select
                      value={promptCategory}
                      onChange={(e) => setPromptCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none"
                    >
                      <option value="React">React</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="Next.js">Next.js</option>
                      <option value="Node.js">Node.js</option>
                      <option value="CSS">CSS</option>
                      <option value="Python">Python</option>
                      <option value="Full Stack">Full Stack</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Career">Career</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Difficulty Level:
                    </label>
                    <select
                      value={promptDifficulty}
                      onChange={(e) => setPromptDifficulty(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Custom Instructions */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Special Angles or Custom Instructions (Optional):
                  </label>
                  <textarea
                    rows={2}
                    value={promptInstructions}
                    onChange={(e) => setPromptInstructions(e.target.value)}
                    placeholder="e.g. Include comparison table between React 18 and 19, real-world e-commerce checkout flow, and troubleshooting checklist..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Dynamic Tailored Prompt Display & Copy */}
              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-slate-300">
                      Tailored Prompt for Claude / ChatGPT
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-400">
                      {promptWordCount.split(" ")[0]} words
                    </span>
                  </div>

                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-xs self-start sm:self-auto"
                  >
                    {copiedPrompt ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedPrompt ? "Copied Tailored Prompt!" : "Copy Tailored Prompt"}
                  </button>
                </div>

                <pre className="text-[11px] font-mono leading-relaxed overflow-x-auto text-slate-300 max-h-48 whitespace-pre-wrap">
                  {currentGeneratedPrompt}
                </pre>
              </div>

              {/* Sample Markdown Format Preview */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                    Markdown Format Sample (Clean Tables, Callouts, Code Blocks)
                  </span>
                  <button
                    onClick={handleCopySample}
                    className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    {copiedSample ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    {copiedSample ? "Copied Sample" : "Copy Sample"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
          >
            Cancel
          </button>

          {activeTab === "paste" ? (
            <button
              onClick={handleExecuteImport}
              disabled={!rawText.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition disabled:opacity-40 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              Auto-Populate Editor Sections
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPrompt}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
              >
                {copiedPrompt ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                Copy Prompt
              </button>
              <button
                onClick={() => setActiveTab("paste")}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                Ready to Paste &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
