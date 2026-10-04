import { useState, useEffect } from "react";
import { 
  Save, 
  BarChart3, 
  Share2, 
  Mail, 
  User, 
  PhoneCall, 
  Palette, 
  Plus, 
  Trash2, 
  Loader, 
  RefreshCw,
  ExternalLink,
  Sparkles
} from "lucide-react";
import useCmsStore from "../store/cmsStore.js";

const TABS = [
  { id: "stats", label: "Landing Stats", icon: BarChart3 },
  { id: "socialCard", label: "Sidebar Social Card", icon: Share2 },
  { id: "newsletter", label: "Newsletter Section", icon: Mail },
  { id: "about", label: "About Page", icon: User },
  { id: "contact", label: "Contact Info", icon: PhoneCall },
  { id: "theme", label: "Theme Colors", icon: Palette },
];

const PRESET_COLORS = [
  { name: "Electric Blue (Default)", primary: "#2563eb", hover: "#1d4ed8", light: "#eff6ff" },
  { name: "Royal Indigo", primary: "#4f46e5", hover: "#4338ca", light: "#eef2ff" },
  { name: "Deep Violet", primary: "#7c3aed", hover: "#6d28d9", light: "#f5f3ff" },
  { name: "Emerald Tech", primary: "#059669", hover: "#047857", light: "#ecfdf5" },
  { name: "Cyan Modern", primary: "#0891b2", hover: "#0e7490", light: "#ecfeff" },
  { name: "Ruby Crimson", primary: "#e11d48", hover: "#be123c", light: "#fff1f2" },
];

export default function CmsSections() {
  const { config, loading, saving, fetchConfig, updateConfig } = useCmsStore();
  const [activeTab, setActiveTab] = useState("stats");
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (config) {
      setFormData(JSON.parse(JSON.stringify(config)));
    }
  }, [config]);

  if (loading || !formData) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const handleSave = async () => {
    await updateConfig(formData);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">CMS & UI Sections</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage live website copy, landing metrics, social links, about biography, contact details, and brand theme colors.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer shrink-0"
        >
          {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving Changes..." : "Save All Changes"}
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-blue-600 text-blue-600 bg-white rounded-t-xl"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: LANDING STATS ─────────────────────────────────── */}
      {activeTab === "stats" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Landing Page Inline Stats</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                These numbers appear directly under the Hero grid on the public homepage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  stats: [...(prev.stats || []), { value: 10, label: "New Stat", suffix: "" }]
                }));
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Stat
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(formData.stats || []).map((stat, idx) => (
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
                          setFormData((prev) => {
                            const stats = [...prev.stats];
                            stats[idx].value = val;
                            return { ...prev, stats };
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
                          setFormData((prev) => {
                            const stats = [...prev.stats];
                            stats[idx].suffix = suffix;
                            return { ...prev, stats };
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
                        setFormData((prev) => {
                          const stats = [...prev.stats];
                          stats[idx].label = label;
                          return { ...prev, stats };
                        });
                      }}
                      placeholder="e.g. Tutorials, Readers"
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium bg-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      stats: prev.stats.filter((_, i) => i !== idx)
                    }));
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Delete Stat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: SIDEBAR SOCIAL CARD ──────────────────────────── */}
      {activeTab === "socialCard" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Sidebar Social Connect Card</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configures the sticky social card in the right column of the homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Card Header Title</label>
              <input
                type="text"
                value={formData.socialCard?.heading || ""}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  socialCard: { ...prev.socialCard, heading: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Action Button Text</label>
              <input
                type="text"
                value={formData.socialCard?.subtext || ""}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  socialCard: { ...prev.socialCard, subtext: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Social Links</label>
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    socialCard: {
                      ...prev.socialCard,
                      links: [
                        ...(prev.socialCard?.links || []),
                        { platform: "Custom", label: "Twitter", count: "1,000", color: "bg-sky-500", href: "https://" }
                      ]
                    }
                  }));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Link
              </button>
            </div>

            <div className="space-y-3">
              {(formData.socialCard?.links || []).map((link, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 flex-1 w-full">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400">Platform</label>
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => {
                            const links = [...prev.socialCard.links];
                            links[idx].label = val;
                            links[idx].platform = val;
                            return { ...prev, socialCard: { ...prev.socialCard, links } };
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
                          setFormData((prev) => {
                            const links = [...prev.socialCard.links];
                            links[idx].count = val;
                            return { ...prev, socialCard: { ...prev.socialCard, links } };
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
                          setFormData((prev) => {
                            const links = [...prev.socialCard.links];
                            links[idx].href = val;
                            return { ...prev, socialCard: { ...prev.socialCard, links } };
                          });
                        }}
                        placeholder="https://"
                        className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        socialCard: {
                          ...prev.socialCard,
                          links: prev.socialCard.links.filter((_, i) => i !== idx)
                        }
                      }));
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition self-end sm:self-center"
                    title="Remove Link"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: NEWSLETTER SECTION ───────────────────────────── */}
      {activeTab === "newsletter" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Newsletter CTA Section</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configures the full-width email newsletter call-to-action on the homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Small Badge Text</label>
              <input
                type="text"
                value={formData.newsletter?.badge || ""}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  newsletter: { ...prev.newsletter, badge: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Submit Button Label</label>
              <input
                type="text"
                value={formData.newsletter?.buttonText || ""}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  newsletter: { ...prev.newsletter, buttonText: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Headline</label>
            <input
              type="text"
              value={formData.newsletter?.heading || ""}
              onChange={(e) => setFormData((prev) => ({
                ...prev,
                newsletter: { ...prev.newsletter, heading: e.target.value }
              }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Subheading / Description</label>
            <textarea
              rows={3}
              value={formData.newsletter?.subheading || ""}
              onChange={(e) => setFormData((prev) => ({
                ...prev,
                newsletter: { ...prev.newsletter, subheading: e.target.value }
              }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Disclaimer / Privacy Note</label>
            <input
              type="text"
              value={formData.newsletter?.disclaimer || ""}
              onChange={(e) => setFormData((prev) => ({
                ...prev,
                newsletter: { ...prev.newsletter, disclaimer: e.target.value }
              }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* ── TAB 4: COMPLETE ABOUT SECTION ───────────────────────── */}
      {activeTab === "about" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Complete About Page Details</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize founder bio, role, metrics, skills list, and development milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Main Heading</label>
              <input
                type="text"
                value={formData.about?.heading || ""}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  about: { ...prev.about, heading: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Role / Tagline</label>
              <input
                type="text"
                value={formData.about?.role || ""}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  about: { ...prev.about, role: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Biography</label>
            <textarea
              rows={4}
              value={formData.about?.bio || ""}
              onChange={(e) => setFormData((prev) => ({
                ...prev,
                about: { ...prev.about, bio: e.target.value }
              }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Years of Experience</label>
              <input
                type="text"
                value={formData.about?.experienceYears || ""}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  about: { ...prev.about, experienceYears: e.target.value }
                }))}
                placeholder="5+"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Projects Completed Count</label>
              <input
                type="text"
                value={formData.about?.projectsCount || ""}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  about: { ...prev.about, projectsCount: e.target.value }
                }))}
                placeholder="20+"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          {/* Skills Management */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tech Stack & Skills</label>
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    about: {
                      ...prev.about,
                      skills: [...(prev.about?.skills || []), { name: "New Skill", icon: "⚡" }]
                    }
                  }));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Skill
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {(formData.about?.skills || []).map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50/60">
                  <input
                    type="text"
                    value={skill.icon}
                    onChange={(e) => {
                      const icon = e.target.value;
                      setFormData((prev) => {
                        const skills = [...prev.about.skills];
                        skills[idx].icon = icon;
                        return { ...prev, about: { ...prev.about, skills } };
                      });
                    }}
                    className="w-8 text-center text-base bg-white rounded border border-slate-200 py-0.5"
                    title="Emoji icon"
                  />
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData((prev) => {
                        const skills = [...prev.about.skills];
                        skills[idx].name = name;
                        return { ...prev, about: { ...prev.about, skills } };
                      });
                    }}
                    className="flex-1 text-xs font-semibold bg-white rounded border border-slate-200 px-2 py-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        about: {
                          ...prev.about,
                          skills: prev.about.skills.filter((_, i) => i !== idx)
                        }
                      }));
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Management */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Milestone Timeline</label>
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    about: {
                      ...prev.about,
                      timeline: [...(prev.about?.timeline || []), { year: "2026", title: "Milestone Title", desc: "Description..." }]
                    }
                  }));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Milestone
              </button>
            </div>

            <div className="space-y-3">
              {(formData.about?.timeline || []).map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <div className="w-20 shrink-0">
                    <label className="text-[10px] font-semibold text-slate-400">Year</label>
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => {
                        const year = e.target.value;
                        setFormData((prev) => {
                          const timeline = [...prev.about.timeline];
                          timeline[idx].year = year;
                          return { ...prev, about: { ...prev.about, timeline } };
                        });
                      }}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-blue-600 bg-white"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400">Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          setFormData((prev) => {
                            const timeline = [...prev.about.timeline];
                            timeline[idx].title = title;
                            return { ...prev, about: { ...prev.about, timeline } };
                          });
                        }}
                        className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400">Description</label>
                      <input
                        type="text"
                        value={item.desc}
                        onChange={(e) => {
                          const desc = e.target.value;
                          setFormData((prev) => {
                            const timeline = [...prev.about.timeline];
                            timeline[idx].desc = desc;
                            return { ...prev, about: { ...prev.about, timeline } };
                          });
                        }}
                        className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        about: {
                          ...prev.about,
                          timeline: prev.about.timeline.filter((_, i) => i !== idx)
                        }
                      }));
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition mt-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: CONTACT PAGE DETAILS ─────────────────────────── */}
      {activeTab === "contact" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Contact Page Information</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit the contact heading, email address, guest post invitation, and social handles (form is handled separately).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Page Heading</label>
              <input
                type="text"
                value={formData.contact?.heading || ""}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, heading: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Direct Contact Email</label>
              <input
                type="email"
                value={formData.contact?.email || ""}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, email: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Subheading / Intro</label>
              <textarea
                rows={2}
                value={formData.contact?.subheading || ""}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, subheading: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Expected Response Time Note</label>
              <input
                type="text"
                value={formData.contact?.responseTime || ""}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, responseTime: e.target.value }
                }))}
                placeholder="I typically reply within 24–48 hours."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Guest Post Invitation Box</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Box Title</label>
                <input
                  type="text"
                  value={formData.contact?.guestPostTitle || ""}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, guestPostTitle: e.target.value }
                  }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Box Description</label>
                <input
                  type="text"
                  value={formData.contact?.guestPostDesc || ""}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, guestPostDesc: e.target.value }
                  }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                />
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Contact Social Channels</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(formData.contact?.socials || []).map((soc, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{soc.platform}</span>
                    <input
                      type="text"
                      value={soc.handle}
                      onChange={(e) => {
                        const handle = e.target.value;
                        setFormData((prev) => {
                          const socials = [...prev.contact.socials];
                          socials[idx].handle = handle;
                          return { ...prev, contact: { ...prev.contact, socials } };
                        });
                      }}
                      placeholder="@handle"
                      className="text-xs font-mono text-slate-600 bg-white border border-slate-200 rounded px-2 py-0.5"
                    />
                  </div>
                  <input
                    type="url"
                    value={soc.href}
                    onChange={(e) => {
                      const href = e.target.value;
                      setFormData((prev) => {
                        const socials = [...prev.contact.socials];
                        socials[idx].href = href;
                        return { ...prev, contact: { ...prev.contact, socials } };
                      });
                    }}
                    placeholder="https://"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 text-xs bg-white font-mono"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 6: THEME COLORS ─────────────────────────────────── */}
      {activeTab === "theme" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Website Brand Theme Colors</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Change the primary color palette across SriKode frontend. All badges, buttons, accents, and links will dynamically adapt.
            </p>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Color Presets</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      theme: {
                        ...prev.theme,
                        primaryColor: preset.primary,
                        primaryHover: preset.hover,
                        primaryLight: preset.light,
                      }
                    }));
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition text-left cursor-pointer ${
                    formData.theme?.primaryColor === preset.primary
                      ? "border-slate-900 bg-slate-50 ring-2 ring-blue-500/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="h-8 w-8 rounded-full shadow-inner border border-black/10" style={{ backgroundColor: preset.primary }} />
                  <span className="text-[11px] font-bold text-slate-700 text-center">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Primary Brand Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.theme?.primaryColor || "#2563eb"}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, primaryColor: e.target.value }
                  }))}
                  className="h-10 w-12 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                />
                <input
                  type="text"
                  value={formData.theme?.primaryColor || "#2563eb"}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, primaryColor: e.target.value }
                  }))}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono uppercase font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Primary Hover Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.theme?.primaryHover || "#1d4ed8"}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, primaryHover: e.target.value }
                  }))}
                  className="h-10 w-12 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                />
                <input
                  type="text"
                  value={formData.theme?.primaryHover || "#1d4ed8"}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, primaryHover: e.target.value }
                  }))}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono uppercase font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Badge Background (Light Tint)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.theme?.primaryLight || "#eff6ff"}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, primaryLight: e.target.value }
                  }))}
                  className="h-10 w-12 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                />
                <input
                  type="text"
                  value={formData.theme?.primaryLight || "#eff6ff"}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, primaryLight: e.target.value }
                  }))}
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
                style={{ backgroundColor: formData.theme?.primaryColor || "#2563eb" }}
              >
                Sample Action Button
              </button>

              <span
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: formData.theme?.primaryLight || "#eff6ff",
                  color: formData.theme?.primaryColor || "#2563eb"
                }}
              >
                Category Badge
              </span>

              <span
                className="font-bold text-sm underline cursor-pointer"
                style={{ color: formData.theme?.primaryColor || "#2563eb" }}
              >
                Active Hyperlink &rarr;
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
