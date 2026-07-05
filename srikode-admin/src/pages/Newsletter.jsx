import { useEffect } from "react";
import { Send, Trash2, ShieldAlert, Loader } from "lucide-react";
import useNewsletterStore from "../store/newsletterStore.js";

export default function Newsletter() {
  const { subscribers, loading, error, fetchSubscribers, deleteSubscriber } = useNewsletterStore();

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this subscriber profile?")) {
      const res = await deleteSubscriber(id);
      if (!res.success) {
        alert(res.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Send className="h-6 w-6 text-blue-600" />
          Newsletter Subscribers
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Monitor your newsletter mailing list. Active subscribers will receive your campaign emails.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading & Empty states */}
      {loading && subscribers.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <Loader className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      ) : subscribers.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-350 bg-white text-slate-400">
          <Send className="h-12 w-12 text-slate-300 mb-2" />
          <p className="font-semibold text-sm">No subscribers yet</p>
          <p className="text-xs text-slate-400 mt-1">Mailing list is currently empty.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Subscriber Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Subscription Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      {sub.email}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        sub.isActive 
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      }`}>
                        {sub.isActive ? "Active" : "Unsubscribed"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 font-semibold">
                      {new Date(sub.subscribedAt || sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 hover:bg-red-600 border border-red-100 text-red-600 hover:text-white transition duration-200"
                        title="Delete Subscriber"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
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
