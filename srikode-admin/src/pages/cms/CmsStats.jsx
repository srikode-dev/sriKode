import { useState, useEffect } from "react";
import { BarChart3, Save, Plus, Trash2, Loader, Sparkles } from "lucide-react";
import useCmsStore from "../../store/cmsStore.js";
import { toast } from "sonner";

export default function CmsStats() {
  const { config, loading, saving, fetchConfig, updateConfig } = useCmsStore();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (config?.stats) {
      setStats(JSON.parse(JSON.stringify(config.stats)));
    }
  }, [config]);

  const handleSave = async () => {
    const res = await updateConfig({ stats });
    if (res.success) {
      toast.success("Landing Stats saved successfully!");
    }
  };

  const handleAddStat = () => {
    setStats((prev) => [
      ...prev,
      { value: 10, label: "New Stat", suffix: "" },
    ]);
  };

  const handleRemoveStat = (index) => {
    setStats((prev) => prev.filter((_, i) => i !== index));
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
              <BarChart3 className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Landing Page Stats</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Configure the highlight numbers, suffixes, and labels displayed directly below the hero section.
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

      {/* Stats List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Metrics & Counters</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These counts animate smoothly when visitors view the SriKode homepage.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddStat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Stat
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Number Value</label>
                    <input
                      type="number"
                      value={stat.value}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setStats((prev) => {
                          const updated = [...prev];
                          updated[idx].value = val;
                          return updated;
                        });
                      }}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-800 bg-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Suffix (e.g. K+, +)</label>
                    <input
                      type="text"
                      value={stat.suffix || ""}
                      onChange={(e) => {
                        const suffix = e.target.value;
                        setStats((prev) => {
                          const updated = [...prev];
                          updated[idx].suffix = suffix;
                          return updated;
                        });
                      }}
                      placeholder="K+"
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Label Text</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const label = e.target.value;
                      setStats((prev) => {
                        const updated = [...prev];
                        updated[idx].label = label;
                        return updated;
                      });
                    }}
                    placeholder="e.g. Tutorials, Readers, Examples"
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium bg-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveStat(idx)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                title="Delete Stat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
