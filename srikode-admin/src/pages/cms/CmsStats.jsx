import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Save, 
  Plus, 
  Trash2, 
  Loader, 
  Sparkles, 
  Radio, 
  RefreshCw,
  Zap,
  SlidersHorizontal,
  CheckCircle2
} from "lucide-react";
import useCmsStore from "../../store/cmsStore.js";
import { toast } from "sonner";

export default function CmsStats() {
  const { config, liveStats, loading, saving, fetchConfig, updateConfig } = useCmsStore();
  const [useRealtimeStats, setUseRealtimeStats] = useState(false);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (config) {
      setUseRealtimeStats(!!config.useRealtimeStats);
      if (config.stats) {
        setStats(JSON.parse(JSON.stringify(config.stats)));
      }
    }
  }, [config]);

  const handleSave = async () => {
    const res = await updateConfig({ 
      stats, 
      useRealtimeStats 
    });
    if (res.success) {
      toast.success(
        useRealtimeStats
          ? "Saved! Homepage is now showing live real-time metrics."
          : "Saved! Homepage is now showing your custom stat values."
      );
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

  const handleCopyLiveValues = () => {
    if (liveStats && liveStats.length > 0) {
      setStats(JSON.parse(JSON.stringify(liveStats)));
      toast.success("Copied real-time numbers into custom fields!");
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
              <BarChart3 className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Landing Page Stats</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Toggle between automated real-time database counts and custom highlight overrides for the homepage counter.
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

      {/* Mode Selection Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Real-time Mode Card */}
        <div 
          onClick={() => setUseRealtimeStats(true)}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
            useRealtimeStats 
              ? "bg-blue-50/50 border-blue-600 shadow-sm" 
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-2.5 rounded-xl ${useRealtimeStats ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Real-Time Dynamic Stats</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live from Database
                </span>
              </div>
            </div>
            <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
              useRealtimeStats ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"
            }`}>
              {useRealtimeStats && <CheckCircle2 className="h-3.5 w-3.5" />}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            Automatically queries published articles and total page visits from MongoDB so stats grow dynamically with your traffic.
          </p>
        </div>

        {/* Custom Override Mode Card */}
        <div 
          onClick={() => setUseRealtimeStats(false)}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
            !useRealtimeStats 
              ? "bg-blue-50/50 border-blue-600 shadow-sm" 
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-2.5 rounded-xl ${!useRealtimeStats ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Custom Manual Values</h3>
                <span className="text-[11px] font-semibold text-slate-500">
                  Custom Marketing Numbers
                </span>
              </div>
            </div>
            <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
              !useRealtimeStats ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"
            }`}>
              {!useRealtimeStats && <CheckCircle2 className="h-3.5 w-3.5" />}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            Specify marketing target numbers (e.g. 50+ Tutorials, 10K+ Readers) directly without relying on database view totals.
          </p>
        </div>
      </div>

      {/* Live Stats Preview Box if in Real-time Mode */}
      {useRealtimeStats && liveStats && (
        <div className="bg-linear-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <h3 className="font-bold text-sm">Live MongoDB Telemetry (Active on Site)</h3>
            </div>
            <button
              type="button"
              onClick={handleCopyLiveValues}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-200 font-semibold transition cursor-pointer"
            >
              Copy to Custom Fields
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {liveStats.map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10 text-center">
                <div className="text-2xl font-black text-blue-300 tracking-tight font-mono">
                  {item.value}{item.suffix}
                </div>
                <div className="text-xs text-slate-300 font-medium mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Stats List (always editable so user can tweak overrides) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              {useRealtimeStats ? "Custom Override Fallbacks" : "Active Custom Stats"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {useRealtimeStats 
                ? "These values are saved as your custom settings when you switch away from real-time mode."
                : "These exact numbers and suffixes are currently animated on the SriKode homepage."}
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
