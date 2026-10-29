import { Fragment, useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FileText, 
  Plus, 
  Eye, 
  EyeOff, 
  Edit2, 
  Trash2, 
  Loader, 
  BookOpen, 
  Star, 
  ExternalLink,
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  CalendarClock,
  ChevronDown
} from "lucide-react";
import useBlogStore from "../store/blogStore.js";
import { toast } from "sonner";
import { getClientBaseUrl } from "../utils/urlHelper.js";
import { formatScheduleDate } from "../utils/schedule.js";
import QuickScheduleModal from "../components/QuickScheduleModal.jsx";

const isScheduled = (blog) => !blog.isPublished && !!blog.scheduledAt;

export default function Blogs() {
  const { blogs, loading, error, fetchBlogs, deleteBlog } = useBlogStore();
  const navigate = useNavigate();
  const clientBaseUrl = getClientBaseUrl();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "published" | "draft"
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Page-wise Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Quick schedule modal (schedule from the list without opening the editor)
  const [scheduleTarget, setScheduleTarget] = useState(null);

  // Expandable detail rows (several can be open at once)
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const toggleExpanded = (id) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      const res = await deleteBlog(id);
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(`Deleted "${title}"`);
      }
    }
  };

  const handleTogglePublish = async (blog) => {
    const res = await useBlogStore.getState().updateBlog(blog._id, { isPublished: !blog.isPublished });
    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(blog.isPublished ? "Article is now hidden from site" : "Article is now published to site");
    }
  };

  const handleToggleFeatured = async (blog) => {
    const res = await useBlogStore.getState().updateBlog(blog._id, { isFeatured: !blog.isFeatured });
    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(blog.isFeatured ? `Unpinned "${blog.title}" from Hero` : `Pinned "${blog.title}" to Homepage Hero!`);
    }
  };

  const handleToggleAds = async (blog) => {
    const currentAdsState = blog.adsEnabled !== false;
    const res = await useBlogStore.getState().updateBlog(blog._id, { adsEnabled: !currentAdsState });
    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(!currentAdsState ? `Monetization enabled for "${blog.title}"` : `Monetization disabled for "${blog.title}"`);
    }
  };

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch = 
        !searchTerm || 
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = 
        statusFilter === "all" ||
        (statusFilter === "published" && blog.isPublished) ||
        (statusFilter === "scheduled" && isScheduled(blog)) ||
        (statusFilter === "draft" && !blog.isPublished && !isScheduled(blog));

      const matchesCategory = 
        categoryFilter === "all" || 
        blog.category?.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [blogs, searchTerm, statusFilter, categoryFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredBlogs.length / pageSize) || 1;
  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredBlogs.slice(startIndex, startIndex + pageSize);
  }, [filteredBlogs, currentPage, pageSize]);

  // Unique categories for filter dropdown
  const categories = useMemo(() => {
    const set = new Set();
    blogs.forEach(b => b.category && set.add(b.category));
    return Array.from(set);
  }, [blogs]);

  // Reset to page 1 on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter, pageSize]);

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Manage Blog Articles
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Write, review, publish, and monetize web development tutorials and articles.
          </p>
        </div>
        <Link
          to="/blogs/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-5 py-3 shadow-md shadow-blue-600/10 active:scale-[0.98] transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Write Article
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles by title or topic..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Status Filter */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 text-xs font-semibold">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === "all" ? "bg-white text-slate-800 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              All ({blogs.length})
            </button>
            <button
              onClick={() => setStatusFilter("published")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === "published" ? "bg-white text-emerald-700 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Live ({blogs.filter(b => b.isPublished).length})
            </button>
            <button
              onClick={() => setStatusFilter("draft")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === "draft" ? "bg-white text-amber-700 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Drafts ({blogs.filter(b => !b.isPublished && !isScheduled(b)).length})
            </button>
            <button
              onClick={() => setStatusFilter("scheduled")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === "scheduled" ? "bg-white text-indigo-700 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Scheduled ({blogs.filter(isScheduled).length})
            </button>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-650 outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Loading & Empty states */}
      {loading && blogs.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <Loader className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-350 bg-white text-slate-400 p-6 text-center">
          <BookOpen className="h-12 w-12 text-slate-300 mb-2" />
          <p className="font-semibold text-sm">No articles found</p>
          <p className="text-xs text-slate-400 mt-1">
            {searchTerm || statusFilter !== "all" || categoryFilter !== "all" 
              ? "Try adjusting your search query or filters."
              : "Click the Write Article button above to draft your first tutorial."}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                  <th className="w-10 py-3.5 pl-4 pr-0"><span className="sr-only">Expand</span></th>
                  <th className="px-4 py-3.5 w-full min-w-70">Article</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Read</th>
                  <th className="px-4 py-3.5 text-right">Views</th>
                  <th className="px-4 py-3.5">Date</th>
                  {/* Pinned to the right edge so actions stay visible when the table scrolls */}
                  <th className="sticky right-0 z-10 bg-slate-50 px-4 py-3.5 text-right shadow-[-8px_0_12px_-10px_rgba(15,23,42,0.25)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedBlogs.map((blog) => {
                  const isOpen = expandedIds.has(blog._id);
                  return (
                  <Fragment key={blog._id}>
                  <tr
                    className={`group border-b transition ${
                      isOpen ? "border-transparent bg-blue-50/60" : "border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    {/* Expand toggle (left accent bar when open) */}
                    <td className={`py-3.5 pl-4 pr-0 align-middle ${isOpen ? "shadow-[inset_3px_0_0_0_#2563eb]" : ""}`}>
                      <button
                        type="button"
                        onClick={() => toggleExpanded(blog._id)}
                        aria-expanded={isOpen}
                        aria-label={isOpen ? "Hide details" : "Show details"}
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-md transition cursor-pointer ${
                          isOpen ? "text-blue-600 hover:bg-blue-100" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        }`}
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ease-out ${isOpen ? "" : "-rotate-90"}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-slate-700 truncate max-w-xs sm:max-w-md" title={blog.title}>{blog.title}</p>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {/* Status badge */}
                        {isScheduled(blog) ? (
                          <span
                            className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100"
                            title="Auto-publishes at this time"
                          >
                            <CalendarClock className="h-3 w-3" />
                            Scheduled · {formatScheduleDate(blog.scheduledAt)}
                          </span>
                        ) : (
                          <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                            blog.isPublished
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}>
                            {blog.isPublished ? "Live" : "Draft"}
                          </span>
                        )}

                        {/* Featured badge */}
                        {blog.isFeatured && (
                          <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-100">
                            ★ Featured
                          </span>
                        )}

                        {/* Ads Monetization badge */}
                        {blog.adsEnabled === false ? (
                          <span className="rounded bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-200" title="Ads are disabled for this post">
                            Ads Off
                          </span>
                        ) : (
                          <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100" title="Monetization active">
                            $ Ads Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium text-slate-500">
                      {blog.readingTime}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-right text-sm font-semibold tabular-nums text-slate-700">
                      {(blog.viewCount || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium text-slate-500">
                      {new Date(blog.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className={`sticky right-0 px-4 py-3.5 whitespace-nowrap text-right shadow-[-8px_0_12px_-10px_rgba(15,23,42,0.25)] transition ${
                      isOpen ? "bg-[#f5f9ff]" : "bg-white group-hover:bg-slate-50"
                    }`}>
                      <div className="inline-flex items-center gap-1">
                        {/* Toggle Hero Pin */}
                        <button
                          onClick={() => handleToggleFeatured(blog)}
                          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition duration-200 cursor-pointer ${
                            blog.isFeatured
                              ? "bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100"
                              : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          }`}
                          title={blog.isFeatured ? "Unpin from Homepage Hero" : "Pin to Homepage Hero Bento Grid"}
                        >
                          <Star className={`h-4 w-4 ${blog.isFeatured ? "fill-purple-600" : ""}`} />
                        </button>

                        {/* Toggle Monetization / Ads */}
                        <button
                          onClick={() => handleToggleAds(blog)}
                          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition duration-200 cursor-pointer ${
                            blog.adsEnabled !== false
                              ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                              : "bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100"
                          }`}
                          title={blog.adsEnabled !== false ? "Monetization Active (Click to Disable Ads)" : "Ads Disabled (Click to Enable Monetization)"}
                        >
                          <DollarSign className="h-4 w-4" />
                        </button>

                        {/* Toggle Publish / Draft */}
                        <button
                          onClick={() => handleTogglePublish(blog)}
                          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition duration-200 cursor-pointer ${
                            blog.isPublished
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                              : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                          }`}
                          title={blog.isPublished ? "Publicly Live (Click to make Draft)" : "Draft Mode (Click to Publish Live)"}
                        >
                          {blog.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>

                        {/* Quick Schedule */}
                        <button
                          onClick={() => setScheduleTarget(blog)}
                          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition duration-200 cursor-pointer ${
                            isScheduled(blog)
                              ? "bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100"
                              : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          }`}
                          title={isScheduled(blog) ? `Scheduled for ${formatScheduleDate(blog.scheduledAt)} (Click to edit)` : "Schedule Publish"}
                        >
                          <CalendarClock className="h-4 w-4" />
                        </button>

                        {/* Divider: status toggles | open / edit / delete */}
                        <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden="true" />

                        {/* View Live or Preview on Frontend */}
                        <a
                          href={`${clientBaseUrl}/blog/${blog.slug}${!blog.isPublished ? "?preview=true" : ""}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition duration-200 cursor-pointer"
                          title={blog.isPublished ? "View Live Article on Frontend" : "Preview Draft on Frontend"}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>

                        {/* Edit Article */}
                        <Link
                          to={`/blogs/edit/${blog._id}`}
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition duration-200"
                          title="Edit Article"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>

                        {/* Delete Article */}
                        <button
                          onClick={() => handleDelete(blog._id, blog.title)}
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition duration-200 cursor-pointer"
                          title="Delete Article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Compact detail strip: always rendered, height animates via grid rows 0fr -> 1fr */}
                  <tr className={isOpen ? "border-b border-slate-200" : ""} aria-hidden={!isOpen}>
                      <td colSpan={7} className="bg-blue-50/60 p-0 shadow-[inset_3px_0_0_0_#2563eb]">
                        <div
                          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                        <div className="overflow-hidden">
                        <div className="sticky left-0 max-w-[calc(100vw-4rem)] px-14 py-3.5 lg:max-w-none">
                          <p className="text-sm font-semibold text-slate-800">{blog.title}</p>
                          {blog.excerpt && (
                            <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-2">{blog.excerpt}</p>
                          )}

                          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-6">
                            {[
                              ["Slug", <span key="s" className="font-mono text-xs">/{blog.slug}</span>],
                              [
                                "Status",
                                isScheduled(blog)
                                  ? `Scheduled · ${formatScheduleDate(blog.scheduledAt)}`
                                  : blog.isPublished ? "Live" : "Draft",
                              ],
                              ["Created", formatScheduleDate(blog.createdAt)],
                              ["Last Updated", blog.updatedAt ? formatScheduleDate(blog.updatedAt) : "—"],
                              ["Read Time · Views", `${blog.readingTime} · ${(blog.viewCount || 0).toLocaleString()} views`],
                              ["Tags", blog.tags?.length ? blog.tags.map((t) => `#${t}`).join("  ") : "—"],
                            ].map(([label, value]) => (
                              <div key={label} className="min-w-0">
                                <dt className="text-[11px] font-medium text-slate-400">{label}</dt>
                                <dd className="mt-0.5 truncate text-[13px] font-semibold text-slate-700">{value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                        </div>
                        </div>
                      </td>
                    </tr>
                  </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Page-wise Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-slate-50/50 text-xs">
            <div className="flex items-center gap-3 text-slate-500">
              <span>
                Showing <strong className="text-slate-800">{filteredBlogs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{" "}
                <strong className="text-slate-800">{Math.min(currentPage * pageSize, filteredBlogs.length)}</strong> of{" "}
                <strong className="text-slate-800">{filteredBlogs.length}</strong> articles
              </span>

              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-slate-400">Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:hover:bg-white font-medium cursor-pointer transition flex items-center gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Prev</span>
                </button>

                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) {
                        acc.push("...");
                      }
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, index) =>
                      item === "..." ? (
                        <span key={`dots-${index}`} className="px-2 text-slate-400">
                          ...
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setCurrentPage(item)}
                          className={`h-7 min-w-7 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                            currentPage === item
                              ? "bg-blue-600 text-white shadow-2xs"
                              : "bg-white border border-slate-200 text-slate-650 hover:bg-slate-100"
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:hover:bg-white font-medium cursor-pointer transition flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {scheduleTarget && (
        <QuickScheduleModal blog={scheduleTarget} onClose={() => setScheduleTarget(null)} />
      )}
    </div>
  );
}
