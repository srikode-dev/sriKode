import { getBlogs } from "@/lib/api";

export default async function sitemap() {
  const baseUrl = "https://srikode.dev";

  // Static routes
  const routes = ["", "/blogs", "/about", "/contact-us", "/videos"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Fetch blogs
  const res = await getBlogs({ limit: 100 }).catch(() => ({ blogs: [] }));
  const blogs = res.blogs || [];

  // Dynamic category routes
  const categoryMap = {};
  blogs.forEach((b) => {
    if (b.category) {
      categoryMap[b.category] = b.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
  });
  const categories = Object.values(categoryMap);

  const categoryRoutes = categories.map((catSlug) => ({
    url: `${baseUrl}/category/${catSlug}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Dynamic blog routes
  const blogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.updatedAt || blog.publishedAt || new Date().toISOString().split("T")[0],
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...routes, ...categoryRoutes, ...blogRoutes];
}
