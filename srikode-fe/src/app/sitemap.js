import { blogs, getCategories } from "@/data";

export default function sitemap() {
  const baseUrl = "https://srikode.dev";

  // Static routes
  const routes = ["", "/blogs", "/about", "/contact-us", "/videos"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic category routes
  const categories = getCategories();
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Dynamic blog routes
  const blogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.updatedAt || blog.publishedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...routes, ...categoryRoutes, ...blogRoutes];
}
