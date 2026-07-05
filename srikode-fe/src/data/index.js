// Central data utility — derive useful collections from the raw blog data
// Format a publishedAt string nicely: "2026-07-01" → "Jul 1, 2026"
export function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}
