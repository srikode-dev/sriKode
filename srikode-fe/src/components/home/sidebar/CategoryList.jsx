import Link from "next/link";

export default function CategoryList({ blogs = [] }) {
  const countMap = {};
  blogs.forEach((blog) => {
    const cat = blog.category;
    if (cat) {
      countMap[cat] = (countMap[cat] || 0) + 1;
    }
  });

  const categoryList = Object.entries(countMap)
    .map(([name, count]) => ({ 
      name, 
      count, 
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") 
    }))
    .sort((a, b) => b.count - a.count);

  if (categoryList.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-sk-border bg-sk-bg-card shadow-sm transition-all duration-300">
      {/* Heading */}
      <div className="flex items-center gap-3 border-b border-sk-border px-4 py-3">
        <span className="h-4 w-1 rounded-full bg-sk-primary" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-sk-text">
          Categories
        </h3>
      </div>

      <ul className="divide-y divide-sk-border px-2 py-2">
        {categoryList.map(({ name, count, slug }) => (
          <li key={slug}>
            <Link
              href={`/category/${slug}`}
              className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors duration-200 hover:bg-sk-primary-light/50"
            >
              <span className="font-semibold text-sk-text-muted transition-colors group-hover:text-sk-primary">
                {name}
              </span>
              <span className="rounded-full bg-sk-primary-light px-2.5 py-0.5 text-xs font-bold text-sk-primary-text transition-colors group-hover:bg-sk-primary group-hover:text-white">
                {count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
