const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

/**
 * Helper to execute JSON fetch queries against backend API.
 */
async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`API fetch error [${endpoint}]:`, error.message);
    throw error;
  }
}

/**
 * Fetch all published blogs, optionally filtered by category or search.
 */
export async function getBlogs({ category, search, page = 1, limit = 10 } = {}) {
  let query = `?page=${page}&limit=${limit}`;
  if (category) query += `&category=${encodeURIComponent(category)}`;
  if (search) query += `&search=${encodeURIComponent(search)}`;

  const isDev = process.env.NODE_ENV !== "production";
  return fetchJson(`/blogs${query}`, isDev ? { cache: "no-store" } : { next: { revalidate: 30 } });
}

/**
 * Fetch featured blogs (shown on main hero layouts).
 */
export async function getFeaturedBlogs() {
  const isDev = process.env.NODE_ENV !== "production";
  return fetchJson("/blogs/featured", isDev ? { cache: "no-store" } : { next: { revalidate: 30 } });
}

/**
 * Fetch single blog post by its slug (updates viewCount on backend).
 * Supports preview query for drafts
 */
export async function getBlogBySlug(slug, isPreview = false) {
  if (!slug) throw new Error("Slug is required");
  const query = isPreview ? "?preview=true" : "";
  const isDev = process.env.NODE_ENV !== "production";
  return fetchJson(`/blogs/post/${encodeURIComponent(slug)}${query}`, isDev || isPreview ? { cache: "no-store" } : { next: { revalidate: 30 } });
}

/**
 * Fetch approved guest comments for a blog post.
 */
export async function getComments(slug) {
  return fetchJson(`/comments/post/${slug}`, { cache: "no-store" });
}

/**
 * Submit a guest comment for moderation.
 */
export async function submitComment(slug, { name, email, text }) {
  return fetchJson(`/comments/post/${slug}`, {
    method: "POST",
    body: JSON.stringify({ name, email, text }),
  });
}

/**
 * Fetch visible (non-hidden) cached YouTube video entries.
 */
export async function getVideos() {
  return fetchJson("/videos", { next: { revalidate: 300 } }); // Cache videos list for 5 minutes
}

/**
 * Submit contact inquiry form details.
 */
export async function submitContact({ name, email, subject, message }) {
  return fetchJson("/contact", {
    method: "POST",
    body: JSON.stringify({ name, email, subject, message }),
  });
}

/**
 * Subscribe email address to newsletter lists.
 */
export async function subscribeNewsletter(email) {
  return fetchJson("/newsletter/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/**
 * Fetch dynamic CMS site configuration (Stats, Social Card, Newsletter, About, Contact, Theme).
 */
export async function getCmsConfig() {
  try {
    const res = await fetchJson("/cms", { cache: "no-store" });
    return res?.config || res?.data || null;
  } catch (error) {
    console.error("Failed to load CMS config:", error.message);
    return null;
  }
}

