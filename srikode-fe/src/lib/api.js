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

  return fetchJson(`/blogs${query}`, { next: { revalidate: 60 } }); // Cache lists for 60 seconds
}

/**
 * Fetch featured blogs (shown on main hero layouts).
 */
export async function getFeaturedBlogs() {
  return fetchJson("/blogs/featured", { next: { revalidate: 60 } });
}

/**
 * Fetch single blog post by its slug (updates viewCount on backend).
 */
export async function getBlogBySlug(slug) {
  return fetchJson(`/blogs/post/${slug}`, { next: { revalidate: 60 } }); // Cache single post for 60 seconds (allows ISR pre-rendering)
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
