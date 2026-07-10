import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const stats = [
  {
    icon: FaFacebook,
    label: "Facebook",
    count: "2,000",
    color: "bg-[#1877F2]",
    href: "https://www.facebook.com/profile.php?id=61590879907360",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    count: "10,000",
    color: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
    href: "https://www.instagram.com/srikode.dev/",
  },
  {
    icon: FaYoutube,
    label: "YouTube",
    count: "500",
    color: "bg-[#FF0000]",
    href: "https://www.youtube.com/@srikode",
  },
];

export default function SocialStats() {
  return (
    <div className="overflow-hidden rounded-xl border border-sk-border bg-sk-bg-card shadow-sm transition-all duration-300">
      {/* Heading */}
      <div className="flex items-center gap-3 border-b border-sk-border px-4 py-3">
        <span className="h-4 w-1 rounded-full bg-sk-primary" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-sk-text">
          Join Our Journey 🚀
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
            <span className={`flex h-10 w-10 items-center justify-center rounded-full text-white text-xl ${color} shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md`}>
              <Icon />
            </span>
            {/* Hidden counts for launch phase */}
            <span className="mt-1.5 text-sm font-extrabold text-sk-text transition-colors group-hover:text-sk-primary">Support</span>
            <span className="w-full truncate px-1 text-center text-[10px] uppercase tracking-wider text-sk-text-faint">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
