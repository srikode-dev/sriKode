import Link from "next/link";
import { blogs } from "@/data/dummy-blog-data";

// Build category list with counts from blog data
function buildCategories() {
  const countMap = {};
  blogs.forEach((blog) => {
    const cat = blog.category;
    countMap[cat] = (countMap[cat] || 0) + 1;
  });
  return Object.entries(countMap)
    .map(([name, count]) => ({ name, count, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") }))
    .sort((a, b) => b.count - a.count);
}

const categoryList = buildCategories();

export default function CategoryList() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      {/* Heading */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
        <span className="h-4 w-1 rounded-full bg-blue-600" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800">
          Categories
        </h3>
      </div>

      <ul className="divide-y divide-gray-50 px-2 py-2">
        {categoryList.map(({ name, count, slug }) => (
          <li key={slug}>
            <Link
              href={`/category/${slug}`}
              className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition hover:bg-blue-50"
            >
              <span className="font-medium text-gray-700 transition group-hover:text-blue-600">
                {name}
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500 transition group-hover:bg-blue-100 group-hover:text-blue-600">
                {count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
