import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatDate } from "@/data";
import { getBlogs } from "@/lib/api";
import Container from "@/components/shared/Container";
import Sidebar from "@/components/home/sidebar/Sidebar";
import BlogCard from "@/components/home/blog/BlogCard";

// Dynamic revalidation settings
export const revalidate = 60; // 60 seconds

// Build categories dynamically from listing response
function buildCategories(blogs) {
  const map = {};
  blogs.forEach((b) => {
    if (!b.category) return;
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

export async function generateStaticParams() {
  try {
    const res = await getBlogs({ limit: 100 });
    const categories = buildCategories(res.blogs || []);
    return categories.map((cat) => ({ slug: cat.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await getBlogs({ limit: 100 });
    const categories = buildCategories(res.blogs || []);
    const cat = categories.find((c) => c.slug === slug);
    if (!cat) return {};
    return {
      title: `${cat.name} Tutorials`,
      description: `Browse all ${cat.name} tutorials and articles on SriKode.`,
      alternates: {
        canonical: `/category/${slug}`,
      },
    };
  } catch {
    return {};
  }
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  
  let dbBlogs = [];
  try {
    const res = await getBlogs({ limit: 100 });
    dbBlogs = res.blogs || [];
  } catch (error) {
    console.error("Failed to load category page logs in SSR: ", error);
  }

  const categories = buildCategories(dbBlogs);
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const categoryBlogs = dbBlogs.filter(
    (b) => b.category?.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
  );

  return (
    <div className="py-10">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
          <ChevronRight size={12} />
          <Link href="/blogs" className="hover:text-blue-600 dark:hover:text-blue-400">Blogs</Link>
          <ChevronRight size={12} />
          <span className="font-semibold text-gray-700 dark:text-zinc-300">{cat.name}</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <span className="mb-2 inline-block rounded-full bg-blue-50 dark:bg-blue-950/40 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            Category
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl dark:text-white">{cat.name}</h1>
          <p className="mt-2 text-gray-500 dark:text-zinc-400">
            {categoryBlogs.length} article{categoryBlogs.length !== 1 ? "s" : ""} in {cat.name}
          </p>
        </div>

        {/* Category pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                c.slug === slug
                  ? "bg-blue-600 text-white shadow dark:bg-blue-550"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              {c.name}
              <span className="ml-1.5 opacity-70">({c.count})</span>
            </Link>
          ))}
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
          {/* Blog grid */}
          <div>
            {categoryBlogs.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {categoryBlogs.map((blog) => (
                  <BlogCard key={blog._id || blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-20 text-center dark:border-zinc-800">
                <span className="text-4xl">📂</span>
                <p className="mt-4 font-semibold text-gray-700 dark:text-zinc-300">No posts in this category yet</p>
                <Link href="/blogs" className="mt-4 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  Browse All Posts
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <Sidebar blogs={dbBlogs} />
          </div>
        </div>
      </Container>
    </div>
  );
}
