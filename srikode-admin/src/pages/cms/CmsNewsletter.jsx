import { useState, useEffect } from "react";
import { Mail, Save, Loader } from "lucide-react";
import useCmsStore from "../../store/cmsStore.js";
import { toast } from "sonner";

export default function CmsNewsletter() {
  const { config, loading, saving, fetchConfig, updateConfig } = useCmsStore();
  const [newsletter, setNewsletter] = useState({
    badge: "",
    heading: "",
    subheading: "",
    buttonText: "",
    disclaimer: "",
  });

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (config?.newsletter) {
      setNewsletter(JSON.parse(JSON.stringify(config.newsletter)));
    }
  }, [config]);

  const handleSave = async () => {
    const res = await updateConfig({ newsletter });
    if (res.success) {
      toast.success("Newsletter CTA section saved successfully!");
    }
  };

  if (loading || !config) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Mail className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Newsletter CTA Section</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Configure the email subscription call-to-action block featured on the homepage.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer shrink-0"
        >
          {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Form Content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Content & Copy</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Customize the badge text, headline, subtitle, button label, and privacy disclaimer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Small Badge Text</label>
            <input
              type="text"
              value={newsletter.badge || ""}
              onChange={(e) =>
                setNewsletter((prev) => ({ ...prev, badge: e.target.value }))
              }
              placeholder="e.g. Weekly Digest"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Submit Button Label</label>
            <input
              type="text"
              value={newsletter.buttonText || ""}
              onChange={(e) =>
                setNewsletter((prev) => ({ ...prev, buttonText: e.target.value }))
              }
              placeholder="e.g. Subscribe"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Headline</label>
          <input
            type="text"
            value={newsletter.heading || ""}
            onChange={(e) =>
              setNewsletter((prev) => ({ ...prev, heading: e.target.value }))
            }
            placeholder="e.g. Never Miss a Tutorial"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Subheading / Description</label>
          <textarea
            rows={3}
            value={newsletter.subheading || ""}
            onChange={(e) =>
              setNewsletter((prev) => ({ ...prev, subheading: e.target.value }))
            }
            placeholder="e.g. Get the latest web development tutorials, projects and tips delivered straight to your inbox."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Disclaimer / Privacy Note</label>
          <input
            type="text"
            value={newsletter.disclaimer || ""}
            onChange={(e) =>
              setNewsletter((prev) => ({ ...prev, disclaimer: e.target.value }))
            }
            placeholder="e.g. Join 10,000+ developers learning with SriKode. Unsubscribe anytime."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
