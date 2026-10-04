/**
 * Returns the base frontend website URL for viewing live articles or previews.
 * Automatically chooses localhost:3000 in dev and Vercel in production.
 */
export const getClientBaseUrl = () => {
  if (import.meta.env.VITE_CLIENT_URL) {
    return import.meta.env.VITE_CLIENT_URL.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:3000";
  }
  return "https://sri-kode-fe.vercel.app";
};

/**
 * Clean slugify helper matching backend algorithm
 */
export const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")   // remove all non-alphanumeric except space and hyphen
    .replace(/\s+/g, "-")           // replace spaces with hyphens
    .replace(/-+/g, "-")            // collapse multiple hyphens
    .replace(/^-+|-+$/g, "");       // trim leading/trailing hyphens
};
