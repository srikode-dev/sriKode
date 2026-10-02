import { useState, useEffect } from "react";
import { PhoneCall, Save, Loader } from "lucide-react";
import useCmsStore from "../../store/cmsStore.js";
import { toast } from "sonner";

export default function CmsContact() {
  const { config, loading, saving, fetchConfig, updateConfig } = useCmsStore();
  const [contact, setContact] = useState({
    heading: "",
    subheading: "",
    email: "",
    responseTime: "",
    guestPostTitle: "",
    guestPostDesc: "",
    socials: [],
  });

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (config?.contact) {
      setContact(JSON.parse(JSON.stringify(config.contact)));
    }
  }, [config]);

  const handleSave = async () => {
    const res = await updateConfig({ contact });
    if (res.success) {
      toast.success("Contact details saved successfully!");
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
              <PhoneCall className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Contact Page Details</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Edit contact heading, direct email address, response time, guest post card, and social handles (form is preserved).
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
          <h3 className="font-bold text-slate-800 text-base">Contact Information</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure header and direct communication channels.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Page Heading</label>
            <input
              type="text"
              value={contact.heading || ""}
              onChange={(e) =>
                setContact((prev) => ({ ...prev, heading: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Direct Contact Email</label>
            <input
              type="email"
              value={contact.email || ""}
              onChange={(e) =>
                setContact((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Subheading / Intro</label>
            <textarea
              rows={2}
              value={contact.subheading || ""}
              onChange={(e) =>
                setContact((prev) => ({ ...prev, subheading: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Expected Response Time Note</label>
            <input
              type="text"
              value={contact.responseTime || ""}
              onChange={(e) =>
                setContact((prev) => ({ ...prev, responseTime: e.target.value }))
              }
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
                value={contact.guestPostTitle || ""}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, guestPostTitle: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Box Description</label>
              <input
                type="text"
                value={contact.guestPostDesc || ""}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, guestPostDesc: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
              />
            </div>
          </div>
        </div>

        {/* Social Profiles */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Contact Social Channels</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(contact.socials || []).map((soc, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{soc.platform}</span>
                  <input
                    type="text"
                    value={soc.handle}
                    onChange={(e) => {
                      const handle = e.target.value;
                      setContact((prev) => {
                        const socials = [...prev.socials];
                        socials[idx].handle = handle;
                        return { ...prev, socials };
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
                    setContact((prev) => {
                      const socials = [...prev.socials];
                      socials[idx].href = href;
                      return { ...prev, socials };
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
    </div>
  );
}
