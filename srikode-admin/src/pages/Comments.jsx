import { useEffect, useState } from "react";
import { MessageSquare, Check, Trash2, ShieldAlert, Loader } from "lucide-react";
import useCommentStore from "../store/commentStore.js";

export default function Comments() {
  const { comments, loading, error, fetchComments, toggleApproval, deleteComment } = useCommentStore();
  const [filter, setFilter] = useState("pending"); // "pending", "approved", "all"

  useEffect(() => {
    const approvedFilter = filter === "all" ? undefined : filter === "approved";
    fetchComments(approvedFilter);
  }, [fetchComments, filter]);

  const handleApprove = async (id) => {
    const res = await toggleApproval(id, true);
    if (!res.success) alert(res.message);
  };

  const handleUnapprove = async (id) => {
    const res = await toggleApproval(id, false);
    if (!res.success) alert(res.message);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this comment?")) {
      const res = await deleteComment(id);
      if (!res.success) alert(res.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            Comments Moderation
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Review guest comment submissions before they appear live on your website.
          </p>
        </div>

        {/* Tab filters */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          {[
            { id: "pending", name: "Pending Review" },
            { id: "approved", name: "Approved" },
            { id: "all", name: "All Comments" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition duration-200 ${
                filter === tab.id
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table list */}
      {loading && comments.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <Loader className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-350 bg-white text-slate-400">
          <ShieldAlert className="h-12 w-12 text-slate-300 mb-2" />
          <p className="font-semibold text-sm">No comments found</p>
          <p className="text-xs text-slate-400 mt-1">There are no comments matching this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div 
              key={comment._id} 
              className={`rounded-2xl border bg-white p-6 shadow-sm transition duration-300 ${
                comment.isApproved ? "border-slate-200" : "border-amber-200 bg-amber-50/5"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-3">
                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-slate-800">{comment.name}</span>
                    <span className="text-xs font-medium text-slate-400">({comment.email})</span>
                    <span className="text-slate-300 hidden sm:inline">|</span>
                    <span className="text-xs font-semibold text-slate-500">
                      Posted: {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      comment.isApproved 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                        : "bg-amber-50 text-amber-600 border border-amber-100 animate-pulse"
                    }`}>
                      {comment.isApproved ? "Approved & Live" : "Awaiting Review"}
                    </span>
                  </div>
                  
                  {/* Comment Text */}
                  <p className="text-sm leading-relaxed text-slate-600 font-medium">
                    "{comment.text}"
                  </p>

                  {/* Associated Post */}
                  <p className="text-xs font-medium text-slate-400">
                    Article: <span className="text-slate-600 font-semibold">{comment.blogId?.title || "Deleted Post"}</span>
                  </p>
                </div>

                {/* Moderate Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-start">
                  {!comment.isApproved ? (
                    <button
                      onClick={() => handleApprove(comment._id)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white transition duration-200"
                      title="Approve Comment"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnapprove(comment._id)}
                      className="rounded-xl border border-slate-200 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 px-3 py-2 text-xs font-bold text-slate-600 transition"
                      title="Hide/Reject Comment"
                    >
                      Unapprove
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition duration-200"
                    title="Delete Comment"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
