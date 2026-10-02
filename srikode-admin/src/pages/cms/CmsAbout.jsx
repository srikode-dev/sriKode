import { useState, useEffect } from "react";
import { User, Save, Plus, Trash2, Loader } from "lucide-react";
import useCmsStore from "../../store/cmsStore.js";
import { toast } from "sonner";

export default function CmsAbout() {
  const { config, loading, saving, fetchConfig, updateConfig } = useCmsStore();
  const [about, setAbout] = useState({
    heading: "",
    role: "",
    bio: "",
    experienceYears: "",
    projectsCount: "",
    skills: [],
    timeline: [],
  });

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (config?.about) {
      setAbout(JSON.parse(JSON.stringify(config.about)));
    }
  }, [config]);

  const handleSave = async () => {
    const res = await updateConfig({ about });
    if (res.success) {
      toast.success("About page details saved successfully!");
    }
  };

  const handleAddSkill = () => {
    setAbout((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), { name: "New Skill", icon: "⚡" }],
    }));
  };

  const handleRemoveSkill = (index) => {
    setAbout((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleAddMilestone = () => {
    setAbout((prev) => ({
      ...prev,
      timeline: [
        ...(prev.timeline || []),
        { year: "2026", title: "Milestone Title", desc: "Description..." },
      ],
    }));
  };

  const handleRemoveMilestone = (index) => {
    setAbout((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
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
              <User className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">About Page Details</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Customize founder bio, role, metrics, skills list, and milestone timeline on the About page.
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

      {/* Main Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Introduction & Bio</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Founder or platform headline, professional role, and primary biography.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Main Heading</label>
            <input
              type="text"
              value={about.heading || ""}
              onChange={(e) =>
                setAbout((prev) => ({ ...prev, heading: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Role / Tagline</label>
            <input
              type="text"
              value={about.role || ""}
              onChange={(e) =>
                setAbout((prev) => ({ ...prev, role: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Biography</label>
          <textarea
            rows={4}
            value={about.bio || ""}
            onChange={(e) =>
              setAbout((prev) => ({ ...prev, bio: e.target.value }))
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Years of Experience</label>
            <input
              type="text"
              value={about.experienceYears || ""}
              onChange={(e) =>
                setAbout((prev) => ({ ...prev, experienceYears: e.target.value }))
              }
              placeholder="5+"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Projects Completed Count</label>
            <input
              type="text"
              value={about.projectsCount || ""}
              onChange={(e) =>
                setAbout((prev) => ({ ...prev, projectsCount: e.target.value }))
              }
              placeholder="20+"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        </div>

        {/* Skills Management */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tech Stack & Skills</label>
              <p className="text-[11px] text-slate-400">Pills displayed in the Tech Stack section.</p>
            </div>
            <button
              type="button"
              onClick={handleAddSkill}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Skill
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {(about.skills || []).map((skill, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50/60">
                <input
                  type="text"
                  value={skill.icon}
                  onChange={(e) => {
                    const icon = e.target.value;
                    setAbout((prev) => {
                      const skills = [...prev.skills];
                      skills[idx].icon = icon;
                      return { ...prev, skills };
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
                    setAbout((prev) => {
                      const skills = [...prev.skills];
                      skills[idx].name = name;
                      return { ...prev, skills };
                    });
                  }}
                  className="flex-1 text-xs font-semibold bg-white rounded border border-slate-200 px-2 py-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
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
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Milestone Timeline</label>
              <p className="text-[11px] text-slate-400">Cards rendered in the journey timeline section.</p>
            </div>
            <button
              type="button"
              onClick={handleAddMilestone}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Milestone
            </button>
          </div>

          <div className="space-y-3">
            {(about.timeline || []).map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="w-20 shrink-0">
                  <label className="text-[10px] font-semibold text-slate-400">Year</label>
                  <input
                    type="text"
                    value={item.year}
                    onChange={(e) => {
                      const year = e.target.value;
                      setAbout((prev) => {
                        const timeline = [...prev.timeline];
                        timeline[idx].year = year;
                        return { ...prev, timeline };
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
                        setAbout((prev) => {
                          const timeline = [...prev.timeline];
                          timeline[idx].title = title;
                          return { ...prev, timeline };
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
                        setAbout((prev) => {
                          const timeline = [...prev.timeline];
                          timeline[idx].desc = desc;
                          return { ...prev, timeline };
                        });
                      }}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMilestone(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition mt-4 cursor-pointer"
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
