import { useState, useEffect } from "react";
import { 
  Megaphone, 
  Save, 
  Plus, 
  Trash2, 
  Loader, 
  ExternalLink, 
  Sparkles, 
  Eye, 
  EyeOff,
  LayoutGrid,
  CheckCircle2,
  Zap
} from "lucide-react";
import useCmsStore from "../../store/cmsStore.js";
import { toast } from "sonner";

export default function CmsSponsors() {
  const { config, loading, saving, fetchConfig, updateConfig } = useCmsStore();
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (config?.sponsors) {
      setSponsors(JSON.parse(JSON.stringify(config.sponsors)));
    } else if (config) {
      setSponsors([
        {
          title: "Build Faster with Modern Web Stack",
          description: "Explore curated templates, boilerplate kits, and verified libraries for rapid React & Next.js production delivery.",
          badge: "Featured Partner",
          ctaText: "Explore Now →",
          targetUrl: "https://srikode.com",
          imageUrl: "",
          slot: "all",
          isActive: true,
        }
      ]);
    }
  }, [config]);

  const handleSave = async () => {
    const res = await updateConfig({ sponsors });
    if (res.success) {
      toast.success("Sponsors & Custom Ads saved successfully!");
    }
  };

  const handleAddSponsor = () => {
    setSponsors((prev) => [
      ...prev,
      {
        title: "New Featured Partner",
        description: "Promote your developer tool, SaaS product, or template collection to SriKode readers.",
        badge: "Sponsor",
        ctaText: "Learn More →",
        targetUrl: "https://",
        imageUrl: "",
        slot: "all",
        isActive: true,
      }
    ]);
  };

  const handleRemoveSponsor = (index) => {
    setSponsors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateSponsor = (index, field, value) => {
    setSponsors((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
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
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Megaphone className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Sponsors &amp; Direct Ads</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage custom sponsors, affiliate campaigns, and direct ads displayed across blog header, in-article, and sidebar slots.
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

      {/* Sponsors List Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Configured Sponsors &amp; Campaigns</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These campaigns automatically render in fallback ad slots when Google AdSense is inactive or side-by-side with articles.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddSponsor}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Sponsor
          </button>
        </div>

        {sponsors.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-slate-250 text-slate-400 text-center">
            <Megaphone className="h-10 w-10 text-slate-300 mb-2" />
            <p className="font-semibold text-sm">No sponsors configured yet</p>
            <p className="text-xs text-slate-400 mt-1">Click "Add Sponsor" above to create your first partner slot.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sponsors.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-5 rounded-2xl border transition-all ${
                  item.isActive 
                    ? "border-slate-200 bg-slate-50/50" 
                    : "border-slate-200/60 bg-slate-100/40 opacity-75"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {item.title || "Untitled Sponsor"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                      {item.badge || "Sponsor"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Active toggle */}
                    <button
                      type="button"
                      onClick={() => handleUpdateSponsor(idx, "isActive", !item.isActive)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                        item.isActive
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                      }`}
                    >
                      {item.isActive ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      <span>{item.isActive ? "Active on Site" : "Inactive / Paused"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveSponsor(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete Campaign"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Campaign Title */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Campaign / Sponsor Title</label>
                    <input
                      type="text"
                      value={item.title || ""}
                      onChange={(e) => handleUpdateSponsor(idx, "title", e.target.value)}
                      placeholder="e.g. Master Modern Full-Stack"
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Badge text */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Badge Tag</label>
                    <input
                      type="text"
                      value={item.badge || ""}
                      onChange={(e) => handleUpdateSponsor(idx, "badge", e.target.value)}
                      placeholder="e.g. Featured Partner, Sponsor"
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Target Slot */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Placement Slot</label>
                    <select
                      value={item.slot || "all"}
                      onChange={(e) => handleUpdateSponsor(idx, "slot", e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white outline-none cursor-pointer"
                    >
                      <option value="all">All Placements (Auto-fill)</option>
                      <option value="header">Header Slot (Next to Article Title)</option>
                      <option value="inArticle">In-Article Mid Banner</option>
                      <option value="sidebar">Sidebar Sticky Card</option>
                      <option value="footer">Pre-Comments Wide Leaderboard</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-500">Description / Subtext</label>
                    <input
                      type="text"
                      value={item.description || ""}
                      onChange={(e) => handleUpdateSponsor(idx, "description", e.target.value)}
                      placeholder="e.g. High-performance React & Next.js starter templates built for production."
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* CTA Text */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Button CTA Text</label>
                    <input
                      type="text"
                      value={item.ctaText || ""}
                      onChange={(e) => handleUpdateSponsor(idx, "ctaText", e.target.value)}
                      placeholder="e.g. Explore Now →"
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-blue-600 bg-white outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Target URL */}
                  <div className="md:col-span-3">
                    <label className="text-[11px] font-semibold text-slate-500">Target Click URL</label>
                    <div className="relative mt-1">
                      <input
                        type="url"
                        value={item.targetUrl || ""}
                        onChange={(e) => handleUpdateSponsor(idx, "targetUrl", e.target.value)}
                        placeholder="https://example.com/partner"
                        className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 bg-white outline-none focus:border-blue-500"
                      />
                      {item.targetUrl && (
                        <a
                          href={item.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
