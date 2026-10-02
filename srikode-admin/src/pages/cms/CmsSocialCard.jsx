import { useState, useEffect } from "react";
import { Share2, Save, Plus, Trash2, Loader } from "lucide-react";
import useCmsStore from "../../store/cmsStore.js";
import { toast } from "sonner";

export default function CmsSocialCard() {
  const { config, loading, saving, fetchConfig, updateConfig } = useCmsStore();
  const [socialCard, setSocialCard] = useState({
    heading: "",
    subtext: "",
    links: [],
  });

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (config?.socialCard) {
      setSocialCard(JSON.parse(JSON.stringify(config.socialCard)));
    }
  }, [config]);

  const handleSave = async () => {
    const res = await updateConfig({ socialCard });
    if (res.success) {
      toast.success("Sidebar Social Card saved successfully!");
    }
  };

  const handleAddLink = () => {
    setSocialCard((prev) => ({
      ...prev,
      links: [
        ...(prev.links || []),
        { platform: "Twitter / X", label: "Twitter", count: "1,000", color: "bg-sky-500", href: "https://" },
      ],
    }));
  };

  const handleRemoveLink = (index) => {
    setSocialCard((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
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
              <Share2 className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Sidebar Social Card</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Configure the sticky social connect widget in the right column of the homepage.
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
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Card Content & Buttons</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Set the header title and call-to-action button label.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Card Header Title</label>
            <input
              type="text"
              value={socialCard.heading || ""}
              onChange={(e) =>
                setSocialCard((prev) => ({ ...prev, heading: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Action Button Text</label>
            <input
              type="text"
              value={socialCard.subtext || ""}
              onChange={(e) =>
                setSocialCard((prev) => ({ ...prev, subtext: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Links List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Social Channels & Links</label>
            <button
              type="button"
              onClick={handleAddLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Link
            </button>
          </div>

          <div className="space-y-3">
            {(socialCard.links || []).map((link, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 flex-1 w-full">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400">Platform / Label</label>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSocialCard((prev) => {
                          const links = [...prev.links];
                          links[idx].label = val;
                          links[idx].platform = val;
                          return { ...prev, links };
                        });
                      }}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400">Follower Text / Count</label>
                    <input
                      type="text"
                      value={link.count || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSocialCard((prev) => {
                          const links = [...prev.links];
                          links[idx].count = val;
                          return { ...prev, links };
                        });
                      }}
                      placeholder="e.g. 10,000"
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-semibold text-slate-400">URL Address</label>
                    <input
                      type="url"
                      value={link.href}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSocialCard((prev) => {
                          const links = [...prev.links];
                          links[idx].href = val;
                          return { ...prev, links };
                        });
                      }}
                      placeholder="https://"
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-mono"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveLink(idx)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition self-end sm:self-center cursor-pointer"
                  title="Remove Link"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
