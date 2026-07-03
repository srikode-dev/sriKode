import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const stats = [
  {
    icon: FaFacebook,
    label: "Fans",
    count: "2,000",
    color: "bg-[#1877F2]",
    href: "https://facebook.com",
  },
  {
    icon: FaInstagram,
    label: "Followers",
    count: "10,000",
    color: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
    href: "https://instagram.com",
  },
  {
    icon: FaYoutube,
    label: "Subscribers",
    count: "500",
    color: "bg-[#FF0000]",
    href: "https://youtube.com",
  },
];

export default function SocialStats() {
  return (
    <div className="overflow-hidden rounded-xl border border-sk-border bg-sk-bg-card shadow-sm transition-all duration-300">
      {/* Heading */}
      <div className="flex items-center gap-3 border-b border-sk-border px-4 py-3">
        <span className="h-4 w-1 rounded-full bg-sk-primary" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-sk-text">
          Follow Us
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-0 divide-x divide-sk-border p-4">
        {stats.map(({ icon: Icon, label, count, color, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 px-2 py-3 transition-opacity hover:opacity-80"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-full text-white text-xl ${color} shadow`}>
              <Icon />
            </span>
            <span className="text-base font-bold text-sk-text">{count}</span>
            <span className="text-[11px] uppercase tracking-wide text-sk-text-faint">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
