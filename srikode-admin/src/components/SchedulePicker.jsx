import { useEffect, useState } from "react";
import { CalendarClock, Timer } from "lucide-react";
import { toLocalInputValue, formatScheduleDate, formatCountdown } from "../utils/schedule.js";

const PRESETS = [
  {
    label: "In 1 hour",
    get: () => new Date(Date.now() + 60 * 60 * 1000),
  },
  {
    label: "Tonight 7 PM",
    get: () => {
      const d = new Date();
      d.setHours(19, 0, 0, 0);
      if (d <= new Date()) d.setDate(d.getDate() + 1);
      return d;
    },
  },
  {
    label: "Tomorrow 9 AM",
    get: () => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(9, 0, 0, 0);
      return d;
    },
  },
  {
    label: "Next Monday 9 AM",
    get: () => {
      const d = new Date();
      d.setDate(d.getDate() + (((8 - d.getDay()) % 7) || 7));
      d.setHours(9, 0, 0, 0);
      return d;
    },
  },
];

/**
 * Date & time picker for scheduled publishing with quick presets and a live countdown.
 * `value` is a datetime-local string ("YYYY-MM-DDTHH:mm") in the admin's timezone.
 */
export default function SchedulePicker({ value, onChange }) {
  const [now, setNow] = useState(() => Date.now());

  // Tick every second so the countdown stays live
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const target = value ? new Date(value).getTime() : null;
  const isPast = target !== null && target <= now;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="space-y-3 rounded-xl border border-indigo-200 bg-indigo-50/60 p-3.5">
      <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700">
        <CalendarClock className="h-3.5 w-3.5" />
        Publish date &amp; time
      </label>

      <input
        type="datetime-local"
        value={value}
        min={toLocalInputValue(new Date(now))}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />

      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onChange(toLocalInputValue(preset.get()))}
            className="rounded-md border border-indigo-200 bg-white px-2 py-1 text-[11px] font-semibold text-indigo-700 transition hover:bg-indigo-100 cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Live countdown timer */}
      {target !== null && (
        <div
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
            isPast ? "bg-red-50 text-red-700 border border-red-200" : "bg-white text-slate-700 border border-indigo-100"
          }`}
        >
          <Timer className={`h-4 w-4 shrink-0 ${isPast ? "text-red-500" : "text-indigo-500"}`} />
          {isPast ? (
            <span className="font-semibold">This time has passed. Pick a future time.</span>
          ) : (
            <span>
              Goes live in{" "}
              <strong className="font-mono text-indigo-700">{formatCountdown(target - now)}</strong>
              <span className="block text-[11px] text-slate-400">{formatScheduleDate(value)}</span>
            </span>
          )}
        </div>
      )}

      <p className="text-[11px] text-slate-400">Times are in your timezone ({timeZone}).</p>
    </div>
  );
}
