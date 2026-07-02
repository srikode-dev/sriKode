// Central data utility — derive useful collections from the raw blog data
import { blogs } from "./dummy-blog-data";

// All unique categories with count + url-safe slug
export function getCategories() {
  const map = {};
  blogs.forEach((b) => {
    if (!map[b.category]) {
      map[b.category] = {
        name: b.category,
        slug: b.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        count: 0,
      };
    }
    map[b.category].count++;
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
}

// Resolve a category slug → matching blog entries
export function getBlogsByCategory(slug) {
  return blogs.filter(
    (b) => b.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
  );
}

// Most popular blogs by views (descending)
export function getPopularBlogs(limit = 5) {
  return [...blogs].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, limit);
}

// Related posts for a blog — same category, excluding itself
export function getRelatedBlogs(currentId, category, limit = 3) {
  return blogs
    .filter((b) => b.id !== currentId && b.category === category)
    .slice(0, limit);
}

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

export { blogs };
