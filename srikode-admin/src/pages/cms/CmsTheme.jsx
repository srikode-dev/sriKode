import { useState, useEffect } from "react";
import { Palette, Save, Loader } from "lucide-react";
import useCmsStore from "../../store/cmsStore.js";
import { toast } from "sonner";

const PRESET_COLORS = [
  { name: "Electric Blue (Default)", primary: "#2563eb", hover: "#1d4ed8", light: "#eff6ff" },
  { name: "Royal Indigo", primary: "#4f46e5", hover: "#4338ca", light: "#eef2ff" },
  { name: "Deep Violet", primary: "#7c3aed", hover: "#6d28d9", light: "#f5f3ff" },
  { name: "Emerald Tech", primary: "#059669", hover: "#047857", light: "#ecfdf5" },
  { name: "Cyan Modern", primary: "#0891b2", hover: "#0e7490", light: "#ecfeff" },
  { name: "Ruby Crimson", primary: "#e11d48", hover: "#be123c", light: "#fff1f2" },
];

export default function CmsTheme() {
  const { config, loading, saving, fetchConfig, updateConfig } = useCmsStore();
  const [theme, setTheme] = useState({
    primaryColor: "#2563eb",
    primaryHover: "#1d4ed8",
    primaryLight: "#eff6ff",
    accentColor: "#3b82f6",
  });

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (config?.theme) {
      setTheme(JSON.parse(JSON.stringify(config.theme)));
    }
  }, [config]);

  const handleSave = async () => {
    const res = await updateConfig({ theme });
    if (res.success) {
      toast.success("Theme Colors saved successfully! Frontend is now rethemed.");
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
              <Palette className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Theme Colors & Palette</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Customize the primary color scheme dynamically applied to buttons, badges, links, and accents across the website.
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

      {/* Theme Presets & Pickers */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Brand Color Presets</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any curated preset to quickly apply an aesthetic color harmony.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                setTheme((prev) => ({
                  ...prev,
                  primaryColor: preset.primary,
                  primaryHover: preset.hover,
                  primaryLight: preset.light,
                }));
              }}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition text-left cursor-pointer ${
                theme.primaryColor === preset.primary
                  ? "border-slate-900 bg-slate-50 ring-2 ring-blue-500/20 shadow-xs"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="h-8 w-8 rounded-full shadow-inner border border-black/10" style={{ backgroundColor: preset.primary }} />
              <span className="text-[11px] font-bold text-slate-700 text-center">{preset.name}</span>
            </button>
          ))}
        </div>

        {/* Custom Color Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Primary Brand Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.primaryColor || "#2563eb"}
                onChange={(e) =>
                  setTheme((prev) => ({ ...prev, primaryColor: e.target.value }))
                }
                className="h-10 w-12 rounded-xl cursor-pointer border border-slate-200 p-0.5"
              />
              <input
                type="text"
                value={theme.primaryColor || "#2563eb"}
                onChange={(e) =>
                  setTheme((prev) => ({ ...prev, primaryColor: e.target.value }))
                }
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono uppercase font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Primary Hover Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.primaryHover || "#1d4ed8"}
                onChange={(e) =>
                  setTheme((prev) => ({ ...prev, primaryHover: e.target.value }))
                }
                className="h-10 w-12 rounded-xl cursor-pointer border border-slate-200 p-0.5"
              />
              <input
                type="text"
                value={theme.primaryHover || "#1d4ed8"}
                onChange={(e) =>
                  setTheme((prev) => ({ ...prev, primaryHover: e.target.value }))
                }
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono uppercase font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Badge Background (Light Tint)</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.primaryLight || "#eff6ff"}
                onChange={(e) =>
                  setTheme((prev) => ({ ...prev, primaryLight: e.target.value }))
                }
                className="h-10 w-12 rounded-xl cursor-pointer border border-slate-200 p-0.5"
              />
              <input
                type="text"
                value={theme.primaryLight || "#eff6ff"}
                onChange={(e) =>
                  setTheme((prev) => ({ ...prev, primaryLight: e.target.value }))
                }
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono uppercase font-bold"
              />
            </div>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Visual Preview</h4>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-sm transition"
              style={{ backgroundColor: theme.primaryColor || "#2563eb" }}
            >
              Sample Action Button
            </button>

            <span
              className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{
                backgroundColor: theme.primaryLight || "#eff6ff",
                color: theme.primaryColor || "#2563eb",
              }}
            >
              Category Badge
            </span>

            <span
              className="font-bold text-sm underline cursor-pointer"
              style={{ color: theme.primaryColor || "#2563eb" }}
            >
              Active Hyperlink &rarr;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
