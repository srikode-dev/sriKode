import { FaFacebook, FaInstagram, FaYoutube, FaGithub, FaTwitter, FaLinkedin, FaShareAlt } from "react-icons/fa";

const getSocialIcon = (platform = "") => {
  const p = (platform || "").toLowerCase();
  if (p.includes("face")) return FaFacebook;
  if (p.includes("insta")) return FaInstagram;
  if (p.includes("you") || p.includes("yt")) return FaYoutube;
  if (p.includes("git")) return FaGithub;
  if (p.includes("twit") || p.includes("x")) return FaTwitter;
  if (p.includes("link")) return FaLinkedin;
  return FaShareAlt;
};

const defaultStats = [
  {
    icon: FaFacebook,
    label: "Facebook",
    count: "2K+",
    color: "bg-[#1877F2]",
    href: "https://www.facebook.com/profile.php?id=61590879907360",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    count: "10K+",
    color: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
    href: "https://www.instagram.com/srikode.dev/",
  },
  {
    icon: FaYoutube,
    label: "YouTube",
    count: "500+",
    color: "bg-[#FF0000]",
    href: "https://www.youtube.com/@srikode",
  },
];

export default function SocialStats({ data }) {
  const title = data?.heading || data?.title || "Join Our Journey 🚀";
  const buttonText = data?.subtext || data?.buttonText || "Support";

  let items = defaultStats;
  if (data?.links && Array.isArray(data.links) && data.links.length > 0) {
    items = data.links.map((link) => ({
      icon: getSocialIcon(link.platform || link.label),
      label: link.label || link.platform,
      count: link.count || "",
      color: link.color || "bg-blue-600",
      href: link.href || "#",
    }));
  }

  return (
    <div className="overflow-hidden rounded-xl border border-sk-border bg-sk-bg-card shadow-sm transition-all duration-300">
      {/* Heading */}
      <div className="flex items-center gap-3 border-b border-sk-border px-4 py-3">
        <span className="h-4 w-1 rounded-full bg-sk-primary" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-sk-text">
          {title}
        </h3>
      </div>

      <div className={`grid ${items.length === 4 ? "grid-cols-4" : items.length === 2 ? "grid-cols-2" : "grid-cols-3"} gap-0 divide-x divide-sk-border p-3 sm:p-4`}>
        {items.map(({ icon: Icon, label, count, color, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-1.5 px-1 py-2.5 transition-opacity hover:opacity-85 text-center"
          >
            <span className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-white text-lg sm:text-xl ${color} shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md`}>
              <Icon />
            </span>
            <span className="mt-1 text-xs font-bold text-sk-text transition-colors group-hover:text-sk-primary">
              {buttonText}
            </span>
            <span className="w-full truncate px-0.5 text-[9px] sm:text-[10px] uppercase font-semibold tracking-wider text-sk-text-faint">
              {label} {count ? `(${count})` : ""}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
