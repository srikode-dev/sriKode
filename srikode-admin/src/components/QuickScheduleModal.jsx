import { useState } from "react";
import { X, CalendarClock, CalendarX, AlertTriangle, Loader } from "lucide-react";
import { toast } from "sonner";
import useBlogStore from "../store/blogStore.js";
import SchedulePicker from "./SchedulePicker.jsx";
import { toLocalInputValue, localInputToIso, formatScheduleDate, defaultScheduleValue } from "../utils/schedule.js";

/**
 * Small modal from the articles list to schedule (or unschedule) a post without opening the editor.
 */
export default function QuickScheduleModal({ blog, onClose }) {
  const isCurrentlyScheduled = !blog.isPublished && !!blog.scheduledAt;
  const [value, setValue] = useState(
    isCurrentlyScheduled ? toLocalInputValue(blog.scheduledAt) : defaultScheduleValue()
  );
  const [saving, setSaving] = useState(null); // "schedule" | "remove" | null

  const save = async (payload, action, successMessage) => {
    setSaving(action);
    const res = await useBlogStore.getState().updateBlog(blog._id, payload);
    setSaving(null);
    if (res.success) {
      toast.success(successMessage);
      onClose();
    } else {
      toast.error(res.message || "Failed to update schedule.");
    }
  };

  const handleSchedule = () => {
    const iso = localInputToIso(value);
    if (!iso || new Date(iso).getTime() <= Date.now()) {
      toast.error("Pick a future date and time.");
      return;
    }
    save({ isPublished: false, scheduledAt: iso }, "schedule", `"${blog.title}" scheduled for ${formatScheduleDate(iso)}`);
  };

  const handleRemove = () =>
    save({ scheduledAt: null }, "remove", `Schedule removed. "${blog.title}" is now a draft.`);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={() => !saving && onClose()}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4">
          <div className="flex min-w-0 items-start gap-2.5">
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-800">
                {isCurrentlyScheduled ? "Edit Schedule" : "Schedule Publish"}
              </h3>
              <p className="truncate text-xs text-slate-500" title={blog.title}>{blog.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={!!saving}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-600 disabled:opacity-50 cursor-pointer"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 p-5">
          {blog.isPublished && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>This article is live. Scheduling hides it from the site until the time below.</span>
            </div>
          )}
          <SchedulePicker value={value} onChange={setValue} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-5 py-3.5">
          {isCurrentlyScheduled ? (
            <button
              type="button"
              onClick={handleRemove}
              disabled={!!saving}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 cursor-pointer"
            >
              {saving === "remove" ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <CalendarX className="h-3.5 w-3.5" />}
              Remove schedule
            </button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={!!saving}
              className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSchedule}
              disabled={!!saving}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
            >
              {saving === "schedule" ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <CalendarClock className="h-3.5 w-3.5" />}
              {isCurrentlyScheduled ? "Update" : "Schedule"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
