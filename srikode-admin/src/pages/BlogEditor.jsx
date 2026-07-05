import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Upload, 
  Image as ImageIcon,
  Loader,
  Heading,
  AlignLeft,
  Code,
  AlertCircle
} from "lucide-react";
import useBlogStore from "../store/blogStore.js";

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentBlog, loading, fetchBlogById, createBlog, updateBlog, uploadImage } = useBlogStore();

  const isEdit = !!id;

  // Taxonomy states
  const [title, setTitle] = useState("");
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
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingBlockIndex, setUploadingBlockIndex] = useState(null);

  // Content Blocks
  const [content, setContent] = useState([]);
  const [faq, setFaq] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // SEO details
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  // Load blog details for edit mode
  useEffect(() => {
    if (isEdit) {
      const loadBlog = async () => {
        const res = await fetchBlogById(id);
        if (res.success && res.blog) {
          const blog = res.blog;
          setTitle(blog.title || "");
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
          setSeoTitle(blog.seo?.title || "");
          setSeoDescription(blog.seo?.description || "");
          setSeoKeywords(blog.seo?.keywords?.join(", ") || "");
        }
      };
      loadBlog();
    }
  }, [id, isEdit, fetchBlogById]);

  // Image Upload helper (ImageKit root /srikode)
  const handleImageUpload = async (e, callback, setUploadLoading) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadLoading(true);
    const res = await uploadImage(file);
    setUploadLoading(false);

    if (res.success) {
      callback(res.url);
    } else {
      alert(res.message);
    }
  };

  // Block Manipulation Helpers
  const addBlock = (type) => {
    const defaultBlocks = {
      heading: { type: "heading", level: 2, text: "" },
      paragraph: { type: "paragraph", text: "" },
      code: { type: "code", language: "javascript", filename: "", code: "" },
      image: { type: "image", src: "", alt: "", caption: "" },
      callout: { type: "callout", variant: "info", title: "", text: "" },
      quote: { type: "quote", text: "", author: "" }
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

  // Save/Submit Handler
  const handleSave = async () => {
    if (!title.trim() || !excerpt.trim() || !category.trim()) {
      alert("Please fill in the required fields: Title, Excerpt, and Category.");
      return;
    }

    const payload = {
      title,
      excerpt,
      description,
      category,
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
      difficulty,
      coverImage,
      githubUrl,
      liveUrl,
      videoUrl,
      content,
      faq,
      isPublished,
      isFeatured,
      seo: {
        title: seoTitle || title,
        description: seoDescription || excerpt,
        keywords: seoKeywords.split(",").map(k => k.trim()).filter(Boolean)
      }
    };

    let res;
    if (isEdit) {
      res = await updateBlog(id, payload);
    } else {
      res = await createBlog(payload);
    }

    if (res.success) {
      navigate("/blogs");
    } else {
      alert(res.message);
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
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Return Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/blogs")}
            className="rounded-xl border border-slate-200 hover:bg-slate-50 p-2.5 text-slate-650 transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-none">
              {isEdit ? "Edit Article Details" : "Draft New Article"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Create structured block items mapping to the blog layout.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-5 py-3 shadow-md shadow-blue-600/10 active:scale-[0.98] transition disabled:opacity-55"
        >
          <Save className="h-4 w-4" />
          {isEdit ? "Save Changes" : "Save Draft"}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
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
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Complete Grid Layout Guide 2026"
                className="mt-2 block w-full rounded-xl border border-slate-200 py-3 px-4 text-slate-800 font-semibold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
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
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 px-1">
              Content Blocks ({content.length})
            </h3>
            
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
                      {block.type} Block
                    </span>
                    
                    {/* Controls */}
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => moveBlock(index, "up")}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => moveBlock(index, "down")}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        disabled={index === content.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteBlock(index)}
                        className="p-1 rounded hover:bg-red-50 text-red-400 hover:text-red-600 transition"
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
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={block.src || ""}
                            onChange={(e) => updateBlock(index, { src: e.target.value })}
                            placeholder="Image URL (from CDN) or upload..."
                            className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-xs outline-none focus:border-blue-500"
                          />
                          <label className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-600 px-4 py-2 cursor-pointer transition shrink-0">
                            {isUploadingThisBlock ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, (url) => updateBlock(index, { src: url }), (loadingState) => setUploadingBlockIndex(loadingState ? index : null))}
                              className="hidden"
                            />
                          </label>
                        </div>
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
                  </div>
                </div>
              );
            })}

            {/* Content block insert options menu */}
            <div className="rounded-2xl border border-dashed border-slate-350 bg-slate-50/50 p-6 flex flex-wrap items-center justify-center gap-3">
              <button 
                onClick={() => addBlock("paragraph")} 
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-800 text-xs font-bold text-slate-500 px-4 py-2.5 transition"
              >
                <Plus className="h-3.5 w-3.5 text-slate-400" /> + Paragraph
              </button>
              <button 
                onClick={() => addBlock("heading")} 
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-800 text-xs font-bold text-slate-500 px-4 py-2.5 transition"
              >
                <Plus className="h-3.5 w-3.5 text-slate-400" /> + Heading
              </button>
              <button 
                onClick={() => addBlock("code")} 
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-800 text-xs font-bold text-slate-500 px-4 py-2.5 transition"
              >
                <Plus className="h-3.5 w-3.5 text-slate-400" /> + Code Block
              </button>
              <button 
                onClick={() => addBlock("image")} 
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-800 text-xs font-bold text-slate-500 px-4 py-2.5 transition"
              >
                <Plus className="h-3.5 w-3.5 text-slate-400" /> + Image
              </button>
              <button 
                onClick={() => addBlock("callout")} 
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-800 text-xs font-bold text-slate-500 px-4 py-2.5 transition"
              >
                <Plus className="h-3.5 w-3.5 text-slate-400" /> + Callout
              </button>
              <button 
                onClick={() => addBlock("quote")} 
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-800 text-xs font-bold text-slate-500 px-4 py-2.5 transition"
              >
                <Plus className="h-3.5 w-3.5 text-slate-400" /> + Quote
              </button>
            </div>
          </div>
          
          {/* FAQ SECTION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-700">FAQ Section ({faq.length})</h3>
              <button
                type="button"
                onClick={addFaq}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-500"
              >
                <Plus className="h-3.5 w-3.5" /> Add Q&A
              </button>
            </div>
            
            {faq.map((item, idx) => (
              <div key={idx} className="rounded-xl border border-slate-150 p-4 bg-slate-50/20 relative space-y-3">
                <button
                  onClick={() => deleteFaq(idx)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-red-500 p-1 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => updateFaq(idx, { question: e.target.value })}
                    placeholder="Question..."
                    className="w-[90%] rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <textarea
                    value={item.answer}
                    onChange={(e) => updateFaq(idx, { answer: e.target.value })}
                    rows={2}
                    placeholder="Answer details..."
                    className="w-[90%] rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Taxonomy, toggles, cover image uploader, and SEO */}
        <div className="space-y-6">
          {/* Cover Image Upload Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Cover Image</h3>
            
            {coverImage ? (
              <div className="relative aspect-video rounded-xl bg-slate-900 border overflow-hidden">
                <img src={coverImage} alt="Cover image preview" className="h-full w-full object-cover" />
                <button
                  onClick={() => setCoverImage("")}
                  className="absolute top-2 right-2 rounded-lg bg-red-650/80 hover:bg-red-600 text-white p-1.5 transition text-xs font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-250 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 aspect-video rounded-xl cursor-pointer transition select-none">
                {uploadingCover ? (
                  <>
                    <Loader className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                    <span className="text-xs font-semibold text-slate-500">Uploading to ImageKit...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-slate-350 mb-2" />
                    <span className="text-xs font-bold text-slate-600">Upload cover image</span>
                    <span className="text-[10px] text-slate-400 mt-1">Direct upload to /srikode</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setCoverImage, setUploadingCover)}
                  className="hidden"
                  disabled={uploadingCover}
                />
              </label>
            )}
          </div>

          {/* Taxonomy Settings Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Taxonomy & Settings</h3>
            
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
                <option value="HTML & CSS">HTML & CSS</option>
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
                className="mt-2 block w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-700 outline-none"
              />
            </div>

            <hr className="border-slate-100" />

            {/* Publish & Featured Toggles */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-bold text-slate-700">Publish immediately (Live on site)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-bold text-slate-700">Pin to homepage Hero stats</span>
              </label>
            </div>
          </div>

          {/* Resource Links Card */}
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

          {/* SEO Details Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">SEO Configuration</h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500">SEO Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Optional custom title tag..."
                className="mt-2 block w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-700 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500">SEO Meta Description</label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                placeholder="Optional custom description tag..."
                className="mt-2 block w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-700 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500">Keywords (comma separated)</label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="React, CSS, HTML Tutorials"
                className="mt-2 block w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-700 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
