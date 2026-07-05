import { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Eye, 
  FileText, 
  MessageSquare, 
  Mail, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  User
} from "lucide-react";
import useAnalyticsStore from "../store/analyticsStore.js";

export default function Dashboard() {
  const { summary, popularPosts, categories, recentActivity, loading, fetchAnalytics } = useAnalyticsStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const cards = [
    {
      title: "Total Views",
      value: summary.totalViews.toLocaleString(),
      description: "Across all published blogs",
      icon: Eye,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50"
    },
    {
      title: "Total Blogs",
      value: summary.totalBlogs,
      description: `${summary.publishedBlogs} Live / ${summary.draftBlogs} Drafts`,
      icon: FileText,
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      bgLight: "bg-emerald-50"
    },
    {
      title: "Pending Comments",
      value: summary.pendingComments,
      description: "Awaiting your verification",
      icon: MessageSquare,
      color: "bg-amber-500",
      textColor: "text-amber-600",
      bgLight: "bg-amber-50",
      alert: summary.pendingComments > 0
    },
    {
      title: "Unread Messages",
      value: summary.unreadContacts,
      description: "From public contact page",
      icon: Mail,
      color: "bg-violet-500",
      textColor: "text-violet-600",
      bgLight: "bg-violet-50",
      alert: summary.unreadContacts > 0
    }
  ];

  if (loading && summary.totalBlogs === 0) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 rounded-2xl bg-white border border-slate-200 p-6"></div>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-96 rounded-2xl bg-white border border-slate-200 p-6"></div>
          <div className="h-96 rounded-2xl bg-white border border-slate-200 p-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── METRICS GRID ────────────────────────────────────────── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.title} 
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition duration-300"
            >
              {card.alert && (
                <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{card.title}</p>
                  <p className="mt-2 text-3xl font-black text-slate-800 tracking-tight leading-none">
                    {card.value}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${card.bgLight} ${card.textColor}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <p className="mt-4 text-xs font-medium text-slate-400">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── CENTER SECTION ──────────────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Popular Posts Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 leading-none">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Popular Articles
              </h2>
              <Link to="/blogs" className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-500">
                Manage blogs <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {popularPosts.length === 0 ? (
              <div className="flex h-48 items-center justify-center text-slate-400 text-sm">
                No blog posts created yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <th className="py-2.5">Title</th>
                      <th className="py-2.5">Category</th>
                      <th className="py-2.5 text-right">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularPosts.map((post) => (
                      <tr key={post.slug} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                        <td className="py-3">
                          <p className="font-semibold text-slate-700 truncate max-w-xs md:max-w-md">{post.title}</p>
                          <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            post.isPublished ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}>
                            {post.isPublished ? "Live" : "Draft"}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-slate-500">{post.category}</td>
                        <td className="py-3 text-right font-black text-slate-700">{post.viewCount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-4">
            Categories
          </h2>
          {categories.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-slate-400 text-sm">
              No categories mapped yet.
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div className="space-y-1 w-full mr-4">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="text-slate-600">{c.name}</span>
                      <span className="text-slate-500">{c.count}</span>
                    </div>
                    {/* Tiny visual bar indicator */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${Math.min(100, (c.count / summary.totalBlogs) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── LOWER SECTION ────────────────────────────────────────── */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Comments */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 leading-none">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Recent Comments
              </h2>
              <Link to="/comments" className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-500">
                Moderation <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {recentActivity.comments.length === 0 ? (
              <div className="flex h-48 items-center justify-center text-slate-400 text-sm">
                No comments submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.comments.map((comment) => (
                  <div key={comment._id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 bg-slate-50/30">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase border border-blue-100">
                      {comment.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-700">{comment.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 truncate font-medium">
                        On: <span className="italic">{comment.blogId?.title || "Deleted Post"}</span>
                      </p>
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        "{comment.text}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Contact Inquiries */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 leading-none">
                <Mail className="h-5 w-5 text-blue-600" />
                Recent Inquiries
              </h2>
              <Link to="/contacts" className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-500">
                Inbox <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {recentActivity.contacts.length === 0 ? (
              <div className="flex h-48 items-center justify-center text-slate-400 text-sm">
                No contact inquiries yet.
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.contacts.map((contact) => (
                  <div key={contact._id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 bg-slate-50/30">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600 font-bold text-xs border border-violet-100">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="overflow-hidden w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700">{contact.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate font-semibold">Subject: {contact.subject}</p>
                      <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        contact.isRead ? "bg-slate-100 text-slate-400" : "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}>
                        {contact.isRead ? "Read" : "New Message"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
