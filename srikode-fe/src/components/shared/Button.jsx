import Link from "next/link";

export default function Button({ href, children, className = "" }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-white font-medium transition hover:bg-blue-700
        ${className}
      `}
    >
      {children}
    </Link>
  );
}
