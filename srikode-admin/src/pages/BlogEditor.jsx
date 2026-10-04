import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Image as ImageIcon,
  Loader,
  Heading,
  AlignLeft,
  Code,
  AlertCircle,
  List,
  Crop,
  Sparkles,
  Globe,
  Bookmark,
  Star,
  Send,
  CheckCircle2,
  ExternalLink,
  Table as TableIcon,
  Minus,
  Quote,
  DollarSign
} from "lucide-react";
import useBlogStore from "../store/blogStore.js";
import ImageCropperModal from "../components/ImageCropperModal.jsx";
import BlogAiImportModal from "../components/BlogAiImportModal.jsx";
import { toast } from "sonner";
import { getClientBaseUrl, slugify } from "../utils/urlHelper.js";

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentBlog, loading, fetchBlogById, createBlog, updateBlog, uploadImage } = useBlogStore();

  const [activeBlogId, setActiveBlogId] = useState(id || null);
  const isEdit = !!(id || activeBlogId);
  const clientBaseUrl = getClientBaseUrl();

  // Taxonomy & Core states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("React");
  const [tagsInput, setTagsInput] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");

  // External Resource Links
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  
  // Cover Image
  const [coverImage, setCoverImage] = useState("");
  const [coverImagePrompt, setCoverImagePrompt] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingBlockIndex, setUploadingBlockIndex] = useState(null);

  // Content Blocks & FAQ
  const [content, setContent] = useState([]);
  const [faq, setFaq] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [adsEnabled, setAdsEnabled] = useState(true);

  // SEO details
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  // AI Import Modal state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Load blog details for edit mode
  useEffect(() => {
    if (isEdit) {
      const loadBlog = async () => {
        const res = await fetchBlogById(id);
        if (res.success && res.blog) {
          const blog = res.blog;
          setTitle(blog.title || "");
          setSlug(blog.slug || "");
          setIsCustomSlug(true);
          setExcerpt(blog.excerpt || "");
          setDescription(blog.description || "");
          setCategory(blog.category || "React");
          setTagsInput(blog.tags?.join(", ") || "");
          setDifficulty(blog.difficulty || "Beginner");
          setCoverImage(blog.coverImage || "");
          setGithubUrl(blog.githubUrl || "");
          setLiveUrl(blog.liveUrl || "");
          setVideoUrl(blog.videoUrl || "");
          setContent(blog.content || []);
          setFaq(blog.faq || []);
          setIsPublished(blog.isPublished || false);
          setIsFeatured(blog.isFeatured || false);
          setAdsEnabled(blog.adsEnabled !== undefined ? blog.adsEnabled : true);
          setSeoTitle(blog.seo?.title || "");
          setSeoDescription(blog.seo?.description || "");
          setSeoKeywords(blog.seo?.keywords?.join(", ") || "");
        }
      };
      loadBlog();
    }
  }, [id, isEdit, fetchBlogById]);

  // Image Cropper Modal State
  const [cropperState, setCropperState] = useState({
    isOpen: false,
    imageSrc: null,
    fileName: "",
    defaultAspect: 16 / 9,
    recommendedDimensions: "1200 × 630 px (16:9)",
    onCropSuccess: null,
    setLoadingState: null,
  });

  const handleSelectCoverFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setCropperState({
      isOpen: true,
      imageSrc: previewUrl,
      fileName: file.name,
      defaultAspect: 16 / 9,
      recommendedDimensions: "1200 × 630 px (16:9)",
      onCropSuccess: (url) => setCoverImage(url),
      setLoadingState: setUploadingCover,
    });
    e.target.value = "";
  };

  const handleSelectBlockFile = (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setCropperState({
      isOpen: true,
      imageSrc: previewUrl,
      fileName: file.name,
      defaultAspect: 1, // 1080x1080 square or user can switch to 16:9, 4:3, Free
      recommendedDimensions: "1080 × 1080 px (1:1) or 1200 × 800 px (3:2)",
      onCropSuccess: (url) => updateBlock(index, { src: url }),
      setLoadingState: (loading) => setUploadingBlockIndex(loading ? index : null),
    });
    e.target.value = "";
  };

  const handleCropComplete = async (webpFile) => {
    if (!cropperState.onCropSuccess) return;

    if (cropperState.setLoadingState) {
      cropperState.setLoadingState(true);
    }

    try {
      const res = await uploadImage(webpFile);
      if (res.success) {
        cropperState.onCropSuccess(res.url);
        if (cropperState.imageSrc) {
          URL.revokeObjectURL(cropperState.imageSrc);
        }
        setCropperState((prev) => ({ ...prev, isOpen: false, imageSrc: null }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(res.message || "Image upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload cropped image.");
    } finally {
      if (cropperState.setLoadingState) {
        cropperState.setLoadingState(false);
      }
    }
  };

  const handleCloseCropper = () => {
    if (cropperState.imageSrc) {
      URL.revokeObjectURL(cropperState.imageSrc);
    }
    setCropperState((prev) => ({ ...prev, isOpen: false, imageSrc: null }));
  };

  // Block Manipulation Helpers
  const addBlock = (type) => {
    const defaultBlocks = {
      heading: { type: "heading", level: 2, text: "" },
      paragraph: { type: "paragraph", text: "" },
      code: { type: "code", language: "javascript", filename: "", code: "" },
      image: { type: "image", src: "", alt: "", caption: "" },
      callout: { type: "callout", variant: "info", title: "", text: "" },
      quote: { type: "quote", text: "", author: "" },
      list: { type: "list", style: "unordered", items: [""] },
      table: {
        type: "table",
        headers: ["Feature / Item", "Description", "Status / Notes"],
        rows: [
          ["Item 1", "Detailed description of item 1", "Active"],
          ["Item 2", "Detailed description of item 2", "Supported"]
        ]
      },
      divider: { type: "divider" }
    };
    setContent([...content, defaultBlocks[type]]);
  };

  const updateBlock = (index, fields) => {
    setContent(content.map((block, idx) => idx === index ? { ...block, ...fields } : block));
  };

  const deleteBlock = (index) => {
    setContent(content.filter((_, idx) => idx !== index));
  };

  const moveBlock = (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === content.length - 1) return;

    const newContent = [...content];
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    [newContent[index], newContent[swapIdx]] = [newContent[swapIdx], newContent[index]];
    setContent(newContent);
  };

  // FAQ Helpers
  const addFaq = () => {
    setFaq([...faq, { question: "", answer: "" }]);
  };

  const updateFaq = (index, fields) => {
    setFaq(faq.map((item, idx) => idx === index ? { ...item, ...fields } : item));
  };

  const deleteFaq = (index) => {
    setFaq(faq.filter((_, idx) => idx !== index));
  };

  // AI Import Handler: maps parsed markdown / json into all states
  const handleAiImport = (parsed) => {
    if (parsed.title) {
      setTitle(parsed.title);
    }
    const resolvedSlug = slugify(parsed.slug || parsed.title || "");
    if (resolvedSlug) {
      setSlug(resolvedSlug);
      setIsCustomSlug(true);
    }
    if (parsed.excerpt) setExcerpt(parsed.excerpt);
    if (parsed.description) setDescription(parsed.description);
    if (parsed.category) setCategory(parsed.category);
    if (parsed.tags && parsed.tags.length > 0) {
      setTagsInput(parsed.tags.join(", "));
    }
    if (parsed.difficulty) setDifficulty(parsed.difficulty);
    if (parsed.coverImage) setCoverImage(parsed.coverImage);
    if (parsed.coverImagePrompt) setCoverImagePrompt(parsed.coverImagePrompt);
    if (parsed.githubUrl) setGithubUrl(parsed.githubUrl);
    if (parsed.liveUrl) setLiveUrl(parsed.liveUrl);
    if (parsed.videoUrl) setVideoUrl(parsed.videoUrl);
    if (parsed.content && parsed.content.length > 0) {
      setContent(parsed.content);
    }
    if (parsed.faq && parsed.faq.length > 0) {
      setFaq(parsed.faq);
    }
    if (typeof parsed.isPublished === "boolean") {
      setIsPublished(parsed.isPublished);
    }
    if (typeof parsed.isFeatured === "boolean") {
      setIsFeatured(parsed.isFeatured);
    }
    if (parsed.seo) {
      if (parsed.seo.title) setSeoTitle(parsed.seo.title);
      if (parsed.seo.description) setSeoDescription(parsed.seo.description);
      if (parsed.seo.keywords && parsed.seo.keywords.length > 0) {
        setSeoKeywords(parsed.seo.keywords.join(", "));
      }
    }
  };

  // Save Article Internal logic: persists to DB and updates editor state
  const saveArticleInternal = async (targetPublishState) => {
    if (!title.trim()) {
      toast.error("Please enter an Article Title.");
      return { success: false };
    }

    // Fallback excerpt if user hasn't typed one yet
    let finalExcerpt = excerpt.trim();
    if (!finalExcerpt) {
      if (description && description.trim()) {
        finalExcerpt = description.trim();
      } else {
        const firstPara = content.find(b => b.type === "paragraph");
        if (firstPara && firstPara.text) {
          finalExcerpt = firstPara.text.replace(/<[^>]+>/g, "").slice(0, 160).trim();
        }
      }
      if (!finalExcerpt) {
        finalExcerpt = `${title.trim()} - SriKode Article`;
      }
      setExcerpt(finalExcerpt);
    }

    const finalCategory = category && category.trim() ? category.trim() : "React";
    if (!category.trim()) {
      setCategory("React");
    }

    const finalPublishState = typeof targetPublishState === "boolean" ? targetPublishState : isPublished;
    setIsPublished(finalPublishState);

    const generatedSlug = slugify(slug || title);

    const payload = {
      title: title.trim(),
      slug: generatedSlug,
      excerpt: finalExcerpt,
      description: description || finalExcerpt,
      category: finalCategory,
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
      difficulty,
      coverImage,
      githubUrl,
      liveUrl,
      videoUrl,
      content,
      faq,
      isPublished: finalPublishState,
      isFeatured,
      adsEnabled,
      seo: {
        title: seoTitle || title,
        description: seoDescription || finalExcerpt,
        keywords: seoKeywords.split(",").map(k => k.trim()).filter(Boolean)
      }
    };

    let res;
    const currentId = id || activeBlogId;
    if (currentId) {
      res = await updateBlog(currentId, payload);
    } else {
      res = await createBlog(payload);
      if (res.success && res.blog?._id) {
        setActiveBlogId(res.blog._id);
        navigate(`/blogs/edit/${res.blog._id}`, { replace: true });
      }
    }

    if (res.success && res.blog?.slug) {
      setSlug(res.blog.slug);
    }

    return res;
  };

  // Save / Publish Handler
  const handleSave = async (explicitPublishState = null) => {
    const finalPublishState = typeof explicitPublishState === "boolean" ? explicitPublishState : isPublished;
    const res = await saveArticleInternal(finalPublishState);

    if (res.success) {
      toast.success(
        finalPublishState
          ? "Article published live on SriKode!"
          : "Draft saved successfully!"
      );
      if (finalPublishState) {
        navigate("/blogs");
      }
    } else if (res.message) {
      toast.error(res.message);
    }
  };

  // Live / Draft Preview Handler with Auto-Save
  const handlePreview = async () => {
    if (!title.trim()) {
      toast.error("Please enter an Article Title before previewing.");
      return;
    }

    // Open placeholder tab synchronously so browser popup blocker does not block it
    const previewWindow = typeof window !== "undefined" ? window.open("about:blank", "_blank") : null;
    if (previewWindow) {
      try {
        previewWindow.document.write(
          "<!DOCTYPE html><html><head><title>Loading Preview...</title><style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0f172a;color:#f8fafc;}</style></head><body><div style='text-align:center;'><h2 style='margin-bottom:8px;'>Opening SriKode Preview...</h2><p style='color:#94a3b8;'>Auto-saving article draft to database...</p></div></body></html>"
        );
      } catch {
        // ignore cross-origin/iframe limitations
      }
    }

    const toastId = toast.loading("Saving draft and preparing preview...");
    const res = await saveArticleInternal(isPublished ? true : false);

    if (res && res.success && res.blog) {
      toast.dismiss(toastId);
      const targetSlug = res.blog.slug || slugify(slug || title);
      const previewUrl = `${clientBaseUrl}/blog/${targetSlug}${!res.blog.isPublished ? "?preview=true" : ""}`;
      if (previewWindow && !previewWindow.closed) {
        previewWindow.location.href = previewUrl;
      } else {
        window.open(previewUrl, "_blank");
      }
      toast.success("Draft saved! Preview opened in new tab.");
    } else {
      if (previewWindow && !previewWindow.closed) {
        previewWindow.close();
      }
      toast.dismiss(toastId);
      toast.error(res?.message || "Failed to save draft for preview.");
    }
  };

  if (isEdit && loading && !title) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Sticky Top Header Banner */}
      <div className="sticky top-0 z-20 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/95 backdrop-blur-md border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => navigate("/blogs")}
            className="rounded-xl border border-slate-200 hover:bg-slate-100 p-2.5 text-slate-650 transition cursor-pointer shadow-2xs"
            title="Back to Articles"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-none">
                {isEdit ? "Edit Article" : "Draft New Article"}
              </h2>
              {/* Visual Live Status Pill */}
              {isPublished ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Published Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                  Draft Mode
                </span>
              )}
              {isFeatured && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  <Star className="h-3 w-3 fill-purple-600 text-purple-600" /> Hero Pinned
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>{content.length} {content.length === 1 ? "Section Block" : "Section Blocks"}</span>
              <span>•</span>
              <span>{faq.length} {faq.length === 1 ? "FAQ" : "FAQs"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Live / Preview Button with Auto-Save */}
          <button
            type="button"
            onClick={handlePreview}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
            title="Auto-saves current edits and opens live/draft preview on frontend"
          >
            <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
            <span>{isPublished ? "View Live" : "Preview Draft"}</span>
          </button>

          {/* AI Auto-Fill / Import button */}
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-[0.98] transition cursor-pointer"
            title="Auto-populate sections using Claude or ChatGPT Markdown"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Import / Auto-Fill</span>
          </button>

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
            title="Save without publishing to the site"
          >
            <Bookmark className="h-4 w-4 text-slate-500" />
            <span>Save Draft</span>
          </button>

          {/* Publish / Update Live Button */}
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={loading}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
            title="Make this article publicly visible on SriKode"
          >
            {isPublished ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            <span>{isPublished ? "Update Live Post" : "Publish to Site"}</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left main editor: Title and Content Blocks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!isCustomSlug && !isEdit) {
                    setSlug(slugify(e.target.value));
                  }
                }}
                placeholder="e.g. Complete Grid Layout Guide 2026"
                className="mt-2 block w-full rounded-xl border border-slate-200 py-3 px-4 text-slate-800 font-semibold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            {/* Permalink / Slug preview & editor */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1 text-xs text-slate-500">
              <span className="font-bold text-slate-600 shrink-0">Permalink:</span>
              <div className="flex items-center gap-1.5 flex-1 min-w-0 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-mono text-[11px] text-slate-600">
                <span className="text-slate-400 shrink-0">{clientBaseUrl}/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setIsCustomSlug(true);
                    setSlug(slugify(e.target.value));
                  }}
                  placeholder="url-slug"
                  className="bg-transparent border-none outline-none font-bold text-blue-600 flex-1 min-w-[80px]"
                />
                {isCustomSlug && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomSlug(false);
                      setSlug(slugify(title));
                    }}
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-sans cursor-pointer underline shrink-0"
                    title="Reset to title-based slug"
                  >
                    Reset
                  </button>
                )}
              </div>
              {slug && (
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={loading}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline shrink-0 cursor-pointer disabled:opacity-50"
                  title={isPublished ? "View Live Article on Frontend" : "Auto-save Draft & Preview on Frontend"}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>{isPublished ? "View Live" : "Preview"}</span>
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Teaser Excerpt <span className="text-red-500">*</span>
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="A short teaser summary of the post shown on blog cards..."
                className="mt-2 block w-full rounded-xl border border-slate-200 py-3 px-4 text-slate-850 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          {/* DYNAMIC CONTENT BLOCKS BUILDER */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Article Sections ({content.length} {content.length === 1 ? "block" : "blocks"})
              </h3>
            </div>

            {/* Smart Helper Banner when no blocks added yet */}
            {content.length === 0 && (
              <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-blue-900">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span>Speed up with AI Auto-Fill</span>
                  </div>
                  <p className="text-xs text-blue-700/80 max-w-lg">
                    Generate a complete tutorial with Claude or ChatGPT using our template, then import it here. All headings, code blocks, tables, and FAQs auto-populate into sections!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer shrink-0"
                >
                  Import Markdown / JSON
                </button>
              </div>
            )}
            
            {content.map((block, index) => {
              const isUploadingThisBlock = uploadingBlockIndex === index;
              
              return (
                <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm relative group">
                  {/* Block Header Info */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      {block.type === "heading" && <Heading className="h-4 w-4 text-blue-500" />}
                      {block.type === "paragraph" && <AlignLeft className="h-4 w-4 text-violet-500" />}
                      {block.type === "code" && <Code className="h-4 w-4 text-amber-500" />}
                      {block.type === "image" && <ImageIcon className="h-4 w-4 text-emerald-500" />}
                      {block.type === "callout" && <AlertCircle className="h-4 w-4 text-red-500" />}
                      {block.type === "list" && <List className="h-4 w-4 text-pink-500" />}
                      {block.type === "table" && <TableIcon className="h-4 w-4 text-teal-600" />}
                      {block.type === "divider" && <Minus className="h-4 w-4 text-slate-400" />}
                      {block.type} Block
                    </span>
                    
                    {/* Controls */}
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => moveBlock(index, "up")}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                        disabled={index === 0}
                        title="Move Up"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => moveBlock(index, "down")}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                        disabled={index === content.length - 1}
                        title="Move Down"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteBlock(index)}
                        className="p-1 rounded hover:bg-red-50 text-red-400 hover:text-red-600 transition cursor-pointer"
                        title="Delete Block"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Block Fields based on Type */}
                  <div className="space-y-4">
                    {/* 1. Heading block */}
                    {block.type === "heading" && (
                      <div className="flex gap-4">
                        <select
                          value={block.level || 2}
                          onChange={(e) => updateBlock(index, { level: Number(e.target.value) })}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-650"
                        >
                          <option value={2}>H2</option>
                          <option value={3}>H3</option>
                          <option value={4}>H4</option>
                        </select>
                        <input
                          type="text"
                          value={block.text || ""}
                          onChange={(e) => updateBlock(index, { text: e.target.value })}
                          placeholder="Heading text..."
                          className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-800 font-semibold outline-none focus:border-blue-500"
                        />
                      </div>
                    )}

                    {/* 2. Paragraph block */}
                    {block.type === "paragraph" && (
                      <textarea
                        value={block.text || ""}
                        onChange={(e) => updateBlock(index, { text: e.target.value })}
                        rows={3}
                        placeholder="Body text... (Supports standard HTML tags like <b> <i> <a href='...'>)"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
                      />
                    )}

                    {/* 3. Code block */}
                    {block.type === "code" && (
                      <div className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            type="text"
                            value={block.filename || ""}
                            onChange={(e) => updateBlock(index, { filename: e.target.value })}
                            placeholder="filename (e.g. Card.jsx)"
                            className="rounded-xl border border-slate-200 px-4 py-2 text-xs outline-none focus:border-blue-500"
                          />
                          <select
                            value={block.language || "javascript"}
                            onChange={(e) => updateBlock(index, { language: e.target.value })}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-600"
                          >
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                            <option value="javascript">JavaScript</option>
                            <option value="jsx">JSX</option>
                            <option value="bash">Bash</option>
                            <option value="json">JSON</option>
                            <option value="python">Python</option>
                            <option value="typescript">TypeScript</option>
                          </select>
                        </div>
                        <textarea
                          value={block.code || ""}
                          onChange={(e) => updateBlock(index, { code: e.target.value })}
                          rows={6}
                          placeholder="Paste code snippet..."
                          className="w-full rounded-xl border border-slate-250 bg-slate-900 px-4 py-3 text-xs text-slate-200 font-mono outline-none"
                        />
                      </div>
                    )}

                    {/* 4. Image Block */}
                    {block.type === "image" && (
                      <div className="space-y-3">
                        {/* Size Indicator Badge */}
                        <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                            📐 Recommended Size: <strong className="font-mono text-blue-700">1080 × 1080 px (1:1)</strong> or <strong className="font-mono text-blue-700">1200 × 800 px</strong>
                          </span>
                        </div>

                        {/* AI Generated Diagram / Art Direction Prompt */}
                        {block.imagePrompt && (
                          <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 text-xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-indigo-900 flex items-center gap-1.5 text-[11px]">
                                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                                AI Diagram Prompt
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(block.imagePrompt);
                                  toast.success("Diagram prompt copied to clipboard!");
                                }}
                                className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                              >
                                Copy Prompt
                              </button>
                            </div>
                            <p className="text-slate-650 font-mono text-[11px] leading-relaxed break-words bg-white/80 p-2 rounded-lg border border-indigo-100/80 select-all">
                              {block.imagePrompt}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={block.src || ""}
                            onChange={(e) => updateBlock(index, { src: e.target.value })}
                            placeholder="Image URL (from CDN) or click Upload & Crop..."
                            className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-xs outline-none focus:border-blue-500"
                          />
                          <label className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-700 px-4 py-2 cursor-pointer transition shrink-0 shadow-xs">
                            {isUploadingThisBlock ? (
                              <Loader className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Crop className="h-3.5 w-3.5" />
                            )}
                            Upload & Crop
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSelectBlockFile(e, index)}
                              className="hidden"
                              disabled={isUploadingThisBlock}
                            />
                          </label>
                        </div>

                        {/* Thumbnail preview if an image URL exists */}
                        {block.src && (
                          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-48 flex items-center justify-center group p-2">
                            <img
                              src={block.src}
                              alt={block.alt || "Block preview"}
                              className="max-h-44 w-auto object-contain rounded-lg shadow-xs"
                            />
                          </div>
                        )}

                        <input
                          type="text"
                          value={block.alt || ""}
                          onChange={(e) => updateBlock(index, { alt: e.target.value })}
                          placeholder="Alt description (for accessibility)..."
                          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-xs outline-none"
                        />
                        <input
                          type="text"
                          value={block.caption || ""}
                          onChange={(e) => updateBlock(index, { caption: e.target.value })}
                          placeholder="Caption shown below the image..."
                          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-xs outline-none"
                        />
                      </div>
                    )}

                    {/* 5. Callout Block */}
                    {block.type === "callout" && (
                      <div className="space-y-3">
                        <div className="flex gap-4">
                          <select
                            value={block.variant || "info"}
                            onChange={(e) => updateBlock(index, { variant: e.target.value })}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-650"
                          >
                            <option value="info">Info (Blue)</option>
                            <option value="success">Success (Green)</option>
                            <option value="warning">Warning (Yellow)</option>
                            <option value="danger">Danger (Red)</option>
                          </select>
                          <input
                            type="text"
                            value={block.title || ""}
                            onChange={(e) => updateBlock(index, { title: e.target.value })}
                            placeholder="Callout title (e.g. Pro Tip)..."
                            className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-xs outline-none"
                          />
                        </div>
                        <textarea
                          value={block.text || ""}
                          onChange={(e) => updateBlock(index, { text: e.target.value })}
                          rows={2}
                          placeholder="Callout description text..."
                          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-xs outline-none"
                        />
                      </div>
                    )}

                    {/* 6. Quote Block */}
                    {block.type === "quote" && (
                      <div className="space-y-3">
                        <textarea
                          value={block.text || ""}
                          onChange={(e) => updateBlock(index, { text: e.target.value })}
                          rows={2}
                          placeholder="Quote content..."
                          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-xs italic outline-none"
                        />
                        <input
                          type="text"
                          value={block.author || ""}
                          onChange={(e) => updateBlock(index, { author: e.target.value })}
                          placeholder="Quote author (e.g. Cory House)..."
                          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-xs outline-none"
                        />
                      </div>
                    )}

                    {/* 7. List Block */}
                    {block.type === "list" && (
                      <div className="space-y-3">
                        <select
                          value={block.style || "unordered"}
                          onChange={(e) => updateBlock(index, { style: e.target.value })}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-650"
                        >
                          <option value="unordered">Unordered (Bullets)</option>
                          <option value="ordered">Ordered (Numbers)</option>
                        </select>
                        <div className="space-y-2">
                          {(block.items || [""]).map((item, itemIdx) => (
                            <div key={itemIdx} className="flex gap-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const newItems = [...(block.items || [])];
                                  newItems[itemIdx] = e.target.value;
                                  updateBlock(index, { items: newItems });
                                }}
                                placeholder="List item..."
                                className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-xs outline-none focus:border-blue-500"
                              />
                              <button
                                onClick={() => {
                                  const newItems = [...(block.items || [])];
                                  newItems.splice(itemIdx, 1);
                                  updateBlock(index, { items: newItems.length ? newItems : [""] });
                                }}
                                className="px-2 text-red-500 hover:text-red-700 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            const newItems = [...(block.items || []), ""];
                            updateBlock(index, { items: newItems });
                          }}
                          className="text-xs text-blue-600 font-bold hover:text-blue-500 cursor-pointer"
                        >
                          + Add Item
                        </button>
                      </div>
                    )}

                    {/* 8. Table Block */}
                    {block.type === "table" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">
                            Table Grid ({(block.headers || []).length} cols × {(block.rows || []).length} rows)
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const newHeaders = [...(block.headers || []), `Col ${(block.headers || []).length + 1}`];
                                const newRows = (block.rows || []).map((row) => [...row, ""]);
                                updateBlock(index, { headers: newHeaders, rows: newRows });
                              }}
                              className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-2 py-1 rounded bg-blue-50 cursor-pointer"
                            >
                              + Add Column
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const newRow = new Array((block.headers || []).length).fill("");
                                updateBlock(index, { rows: [...(block.rows || []), newRow] });
                              }}
                              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 px-2 py-1 rounded bg-emerald-50 cursor-pointer"
                            >
                              + Add Row
                            </button>
                          </div>
                        </div>

                        {/* Interactive Table Grid */}
                        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/40 p-3">
                          <table className="w-full text-xs">
                            <thead>
                              <tr>
                                {(block.headers || []).map((h, colIdx) => (
                                  <th key={colIdx} className="p-1 pb-2 font-bold text-slate-700 text-left">
                                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 shadow-2xs">
                                      <input
                                        type="text"
                                        value={h}
                                        onChange={(e) => {
                                          const newH = [...(block.headers || [])];
                                          newH[colIdx] = e.target.value;
                                          updateBlock(index, { headers: newH });
                                        }}
                                        placeholder={`Header ${colIdx + 1}`}
                                        className="w-full bg-transparent font-bold text-slate-800 outline-none"
                                      />
                                      {(block.headers || []).length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newH = (block.headers || []).filter((_, c) => c !== colIdx);
                                            const newR = (block.rows || []).map((r) => r.filter((_, c) => c !== colIdx));
                                            updateBlock(index, { headers: newH, rows: newR });
                                          }}
                                          className="text-slate-350 hover:text-red-500 cursor-pointer text-xs"
                                          title="Delete Column"
                                        >
                                          ×
                                        </button>
                                      )}
                                    </div>
                                  </th>
                                ))}
                                <th className="w-8 p-1"></th>
                              </tr>
                            </thead>
                            <tbody className="space-y-1">
                              {(block.rows || []).map((row, rowIdx) => (
                                <tr key={rowIdx}>
                                  {(row || []).map((cell, colIdx) => (
                                    <td key={colIdx} className="p-1">
                                      <input
                                        type="text"
                                        value={cell}
                                        onChange={(e) => {
                                          const newRows = (block.rows || []).map((r, rIdx) => {
                                            if (rIdx !== rowIdx) return r;
                                            const updated = [...r];
                                            updated[colIdx] = e.target.value;
                                            return updated;
                                          });
                                          updateBlock(index, { rows: newRows });
                                        }}
                                        placeholder="Cell value..."
                                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500 shadow-2xs"
                                      />
                                    </td>
                                  ))}
                                  <td className="p-1 text-center">
                                    {(block.rows || []).length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newRows = (block.rows || []).filter((_, r) => r !== rowIdx);
                                          updateBlock(index, { rows: newRows });
                                        }}
                                        className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                                        title="Delete Row"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* 9. Divider Block */}
                    {block.type === "divider" && (
                      <div className="py-3 px-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-center">
                        <hr className="w-full border-t border-slate-300" />
                        <span className="absolute px-3 bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Horizontal Divider
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Modern Content Block Insert Toolbar */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Add Content Block
                </span>
                <span className="text-[11px] text-slate-400">
                  Click to insert into article
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                <button
                  type="button"
                  onClick={() => addBlock("paragraph")}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-violet-50 hover:border-violet-200 text-slate-700 hover:text-violet-700 transition cursor-pointer group shadow-2xs"
                  title="Add Body Paragraph"
                >
                  <AlignLeft className="h-4 w-4 text-violet-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold">Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("heading")}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-blue-50 hover:border-blue-200 text-slate-700 hover:text-blue-700 transition cursor-pointer group shadow-2xs"
                  title="Add Section Heading"
                >
                  <Heading className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold">Heading</span>
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("code")}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-amber-50 hover:border-amber-200 text-slate-700 hover:text-amber-700 transition cursor-pointer group shadow-2xs"
                  title="Add Code Snippet"
                >
                  <Code className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold">Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("table")}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-teal-50 hover:border-teal-200 text-slate-700 hover:text-teal-700 transition cursor-pointer group shadow-2xs"
                  title="Add Comparison / Data Table"
                >
                  <TableIcon className="h-4 w-4 text-teal-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold">Table</span>
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("callout")}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-rose-50 hover:border-rose-200 text-slate-700 hover:text-rose-700 transition cursor-pointer group shadow-2xs"
                  title="Add Callout or Warning"
                >
                  <AlertCircle className="h-4 w-4 text-rose-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold">Callout</span>
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("list")}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-pink-50 hover:border-pink-200 text-slate-700 hover:text-pink-700 transition cursor-pointer group shadow-2xs"
                  title="Add Bulleted or Numbered List"
                >
                  <List className="h-4 w-4 text-pink-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold">List</span>
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("image")}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-emerald-50 hover:border-emerald-200 text-slate-700 hover:text-emerald-700 transition cursor-pointer group shadow-2xs"
                  title="Add Image or Diagram"
                >
                  <ImageIcon className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold">Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("quote")}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-purple-50 hover:border-purple-200 text-slate-700 hover:text-purple-700 transition cursor-pointer group shadow-2xs"
                  title="Add Quote"
                >
                  <Quote className="h-4 w-4 text-purple-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold">Quote</span>
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("divider")}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition cursor-pointer group shadow-2xs"
                  title="Add Divider Line"
                >
                  <Minus className="h-4 w-4 text-slate-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold">Divider</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* FAQ SECTION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Frequently Asked Questions ({faq.length})</h3>
                <p className="text-xs text-slate-400 mt-0.5">Rendered as accordion Q&amp;A on the live article</p>
              </div>
              <button
                type="button"
                onClick={addFaq}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Add Q&amp;A
              </button>
            </div>
            
            {faq.map((item, idx) => (
              <div key={idx} className="rounded-xl border border-slate-150 p-4 bg-slate-50/30 relative space-y-3">
                <button
                  onClick={() => deleteFaq(idx)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-red-500 p-1 transition cursor-pointer"
                  title="Remove FAQ"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Question {idx + 1}</label>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => updateFaq(idx, { question: e.target.value })}
                    placeholder="e.g. Can this be used in Next.js Server Components?"
                    className="w-[92%] rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Answer</label>
                  <textarea
                    value={item.answer}
                    onChange={(e) => updateFaq(idx, { answer: e.target.value })}
                    rows={2}
                    placeholder="Clear and concise answer for the reader..."
                    className="w-[92%] rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Visibility & Placement, Cover, Taxonomy, SEO */}
        <div className="space-y-6">
          {/* 1. VISIBILITY & HERO PLACEMENT (Top Priority Card) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Status &amp; Visibility
              </h3>
              {isPublished ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live on Site
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                  Draft Only
                </span>
              )}
            </div>

            {/* Segmented Selector for Draft vs Published */}
            <div>
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setIsPublished(false)}
                  className={`py-2 px-3 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    !isPublished
                      ? "bg-white text-slate-800 shadow-xs border border-slate-200/80"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublished(true)}
                  className={`py-2 px-3 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    isPublished
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Globe className="h-3.5 w-3.5" />
                  Published Live
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {!isPublished
                  ? "Draft mode: Hidden from public listings. Only visible to admins."
                  : "Live on site: Publicly visible to all readers on SriKode."}
              </p>
            </div>

            <hr className="border-slate-100" />

            {/* Pin to Homepage Hero Toggle */}
            <div className={`p-3.5 rounded-xl border transition ${
              isFeatured 
                ? "bg-purple-50/70 border-purple-200" 
                : "bg-slate-50/60 border-slate-200"
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Star className={`h-4 w-4 ${isFeatured ? "text-purple-600 fill-purple-600" : "text-slate-400"}`} />
                    Pin to Homepage Hero
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Showcase this tutorial in the main Bento Grid on SriKode&apos;s home page.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  <div className={`block h-5 w-9 rounded-full transition-colors duration-200 ${
                    isFeatured ? "bg-purple-600" : "bg-slate-300"
                  }`}></div>
                  <div className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                    isFeatured ? "translate-x-4" : "translate-x-0"
                  }`}></div>
                </label>
              </div>

              {isFeatured && (
                <div className="mt-2.5 pt-2 border-t border-purple-200/60 flex items-center gap-1.5 text-[10px] font-bold text-purple-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-600"></span>
                  Featured in Homepage Hero Bento Grid
                </div>
              )}
            </div>

            <hr className="border-slate-100" />

            {/* Monetization / In-Article Ads Toggle */}
            <div className={`p-3.5 rounded-xl border transition ${
              adsEnabled 
                ? "bg-emerald-50/70 border-emerald-200" 
                : "bg-slate-50/60 border-slate-200"
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <DollarSign className={`h-4 w-4 ${adsEnabled ? "text-emerald-600" : "text-slate-400"}`} />
                    Article Monetization / Ads
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Display top banner, in-article, and sponsor slots for this post.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={adsEnabled}
                    onChange={(e) => setAdsEnabled(e.target.checked)}
                  />
                  <div className={`block h-5 w-9 rounded-full transition-colors duration-200 ${
                    adsEnabled ? "bg-emerald-600" : "bg-slate-300"
                  }`}></div>
                  <div className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                    adsEnabled ? "translate-x-4" : "translate-x-0"
                  }`}></div>
                </label>
              </div>

              {!adsEnabled && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                  Ads completely disabled on this article
                </div>
              )}
            </div>
          </div>

          {/* 2. Cover Image Upload Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Cover Media</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200/70">
                📐 1200 × 630 px (16:9)
              </span>
            </div>
            
            {/* AI Generated Prompt for Cover Image */}
            {coverImagePrompt && (
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-900 flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                    AI Cover Prompt
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(coverImagePrompt);
                      toast.success("Cover image prompt copied to clipboard!");
                    }}
                    className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                  >
                    Copy Prompt
                  </button>
                </div>
                <p className="text-slate-650 font-mono text-[11px] leading-relaxed break-words bg-white/80 p-2 rounded-lg border border-indigo-100/80 select-all">
                  {coverImagePrompt}
                </p>
              </div>
            )}

            {coverImage ? (
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl bg-slate-900 border border-slate-200 overflow-hidden group">
                  <img src={coverImage} alt="Cover image preview" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 py-2 text-xs font-semibold text-slate-700 cursor-pointer transition shadow-xs">
                    <Crop className="h-3.5 w-3.5 text-blue-600" />
                    Change &amp; Crop
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSelectCoverFile}
                      className="hidden"
                      disabled={uploadingCover}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="rounded-xl border border-rose-150 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-250 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-400 aspect-video rounded-xl cursor-pointer transition select-none group p-4 text-center">
                {uploadingCover ? (
                  <>
                    <Loader className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                    <span className="text-xs font-semibold text-slate-500">Uploading to ImageKit...</span>
                  </>
                ) : (
                  <>
                    <div className="p-3 rounded-full bg-blue-50 text-blue-600 group-hover:scale-110 transition mb-2">
                      <Crop className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Upload Cover Image</span>
                    <span className="inline-block mt-2 px-2.5 py-1 rounded-md bg-white border border-blue-200 text-[11px] font-mono font-bold text-blue-700 shadow-2xs">
                      1200 × 630 px (16:9)
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSelectCoverFile}
                  className="hidden"
                  disabled={uploadingCover}
                />
              </label>
            )}
          </div>

          {/* 3. Taxonomy Settings Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Taxonomy &amp; Metadata</h3>
            
            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-500">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-slate-200 py-3 px-3 text-sm text-slate-650 bg-white"
              >
                <option value="React">React</option>
                <option value="Next.js">Next.js</option>
                <option value="JavaScript">JavaScript</option>
                <option value="HTML & CSS">HTML &amp; CSS</option>
                <option value="TailwindCSS">TailwindCSS</option>
              </select>
            </div>

            {/* Difficulty Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-500">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-slate-200 py-3 px-3 text-sm text-slate-650 bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Tags Inputs */}
            <div>
              <label className="block text-xs font-semibold text-slate-500">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="React, Hooks, Beginner"
                className="mt-2 block w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-700 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* 4. Resource Links Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">External Resources</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500">GitHub Repository URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="mt-2 block w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-700 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500">Live Demo Website URL</label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://yourdemo.com"
                className="mt-2 block w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-700 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500">Walkthrough Video URL (YouTube)</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="mt-2 block w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-700 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* 5. SEO Details Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">SEO Configuration</h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500">SEO Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Optional custom title tag..."
                className="mt-2 block w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-700 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500">SEO Meta Description</label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                placeholder="Optional custom description tag..."
                className="mt-2 block w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-700 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500">Keywords (comma separated)</label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="React, CSS, HTML Tutorials"
                className="mt-2 block w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-700 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Markdown / JSON Import & Template Modal */}
      <BlogAiImportModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onImport={handleAiImport}
      />

      {/* Modern Image Cropper Modal with WebP conversion */}
      <ImageCropperModal
        isOpen={cropperState.isOpen}
        imageSrc={cropperState.imageSrc}
        fileName={cropperState.fileName}
        defaultAspect={cropperState.defaultAspect}
        recommendedDimensions={cropperState.recommendedDimensions}
        onClose={handleCloseCropper}
        onCropComplete={handleCropComplete}
        isUploading={uploadingCover || uploadingBlockIndex !== null}
      />
    </div>
  );
}
