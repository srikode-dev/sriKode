import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Plus, Eye, Edit2, Trash2, Loader, BookOpen } from "lucide-react";
import useBlogStore from "../store/blogStore.js";

export default function Blogs() {
  const { blogs, loading, error, fetchBlogs, deleteBlog } = useBlogStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      const res = await deleteBlog(id);
      if (!res.success) {
        alert(res.message);
      }
    }
  };

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
            Write, review, publish, and delete web development tutorials and articles.
          </p>
        </div>
        <Link
          to="/blogs/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-5 py-3 shadow-md shadow-blue-600/10 active:scale-[0.98] transition self-start sm:self-auto"
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

      {/* Loading & Empty states */}
      {loading && blogs.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <Loader className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-350 bg-white text-slate-400">
          <BookOpen className="h-12 w-12 text-slate-300 mb-2" />
          <p className="font-semibold text-sm">No articles written yet</p>
          <p className="text-xs text-slate-400 mt-1">Click the Write Article button above to draft your first tutorial.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Read Time</th>
                  <th className="px-6 py-4">Views</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-700 truncate max-w-xs sm:max-w-md">{blog.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                          blog.isPublished 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                        }`}>
                          {blog.isPublished ? "Live" : "Draft"}
                        </span>
                        {blog.isFeatured && (
                          <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-100">
                            ★ Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                      {blog.category}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-400">
                      {blog.readingTime}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      {blog.viewCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 font-semibold">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          to={`/blogs/edit/${blog._id}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition duration-200"
                          title="Edit Article"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id, blog.title)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition duration-200"
                          title="Delete Article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
