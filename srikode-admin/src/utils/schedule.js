// Helpers for scheduled publishing. Dates are stored as ISO (UTC) in the API and edited
// as local "YYYY-MM-DDTHH:mm" strings in <input type="datetime-local">.

const pad = (n) => String(n).padStart(2, "0");

/** Date | ISO string -> local datetime-local input value */
export const toLocalInputValue = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** Local datetime-local input value -> ISO string (or null) */
export const localInputToIso = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

/** "Thu, Oct 30, 9:00 AM" in the admin's local timezone */
export const formatScheduleDate = (value) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

/** Milliseconds -> "2d 4h 13m", "4h 13m 05s" or "45s" */
export const formatCountdown = (ms) => {
  if (ms <= 0) return "any moment now";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${pad(minutes)}m ${pad(seconds)}s`;
  if (minutes > 0) return `${minutes}m ${pad(seconds)}s`;
  return `${seconds}s`;
};

/** Default schedule suggestion: tomorrow at 9:00 AM local */
export const defaultScheduleValue = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return toLocalInputValue(d);
};
