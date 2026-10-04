import mongoose from "mongoose";

const siteConfigSchema = new mongoose.Schema(
  {
    // Unique identifier key (e.g., "default") so we have a singleton config document
    key: {
      type: String,
      default: "default",
      unique: true,
    },

    // 1. Landing Page Stats Section
    stats: {
      type: [
        {
          label: { type: String, required: true },
          value: { type: Number, required: true },
          suffix: { type: String, default: "" },
        }
      ],
      default: [
        { value: 50, label: "Tutorials", suffix: "" },
        { value: 10, label: "Readers", suffix: "K+" },
        { value: 100, label: "Examples", suffix: "" },
        { value: 5, label: "Years Exp", suffix: "" },
      ],
    },

    // 2. Sidebar Social Card Section
    socialCard: {
      heading: { type: String, default: "Join Our Journey 🚀" },
      subtext: { type: String, default: "Support" },
      links: {
        type: [
          {
            platform: { type: String, required: true },
            label: { type: String, required: true },
            count: { type: String, default: "" },
            color: { type: String, default: "bg-blue-600" },
            href: { type: String, required: true },
          }
        ],
        default: [
          {
            platform: "Facebook",
            label: "Facebook",
            count: "2,000",
            color: "bg-[#1877F2]",
            href: "https://www.facebook.com/profile.php?id=61590879907360",
          },
          {
            platform: "Instagram",
            label: "Instagram",
            count: "10,000",
            color: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
            href: "https://www.instagram.com/srikode.dev/",
          },
          {
            platform: "YouTube",
            label: "YouTube",
            count: "500",
            color: "bg-[#FF0000]",
            href: "https://www.youtube.com/@srikode",
          },
        ],
      },
    },

    // 3. Newsletter Section Content
    newsletter: {
      badge: { type: String, default: "Weekly Digest" },
      heading: { type: String, default: "Never Miss a Tutorial" },
      subheading: {
        type: String,
        default: "Get the latest web development tutorials, projects and tips delivered straight to your inbox.",
      },
      buttonText: { type: String, default: "Subscribe" },
      disclaimer: { type: String, default: "No spam. Unsubscribe at any time." },
    },

    // 4. Complete About Section & Page
    about: {
      heading: { type: String, default: "Welcome to SriKode 👋" },
      role: { type: String, default: "Developer Community & Educational Platform" },
      avatar: { type: String, default: "/placeholder-banner.webp" },
      bio: {
        type: String,
        default: "Building practical web applications and making modern web development accessible to everyone with production-ready tutorials.",
      },
      experienceYears: { type: String, default: "5+" },
      projectsCount: { type: String, default: "20+" },
      skills: {
        type: [
          {
            name: { type: String, required: true },
            icon: { type: String, default: "⚡" },
          }
        ],
        default: [
          { name: "HTML & CSS", icon: "🎨" },
          { name: "JavaScript", icon: "⚡" },
          { name: "React", icon: "⚛️" },
          { name: "Next.js", icon: "▲" },
          { name: "Node.js", icon: "🟢" },
          { name: "Express", icon: "🚂" },
          { name: "MongoDB", icon: "🍃" },
          { name: "Tailwind CSS", icon: "💨" },
          { name: "TypeScript", icon: "🔷" },
          { name: "Git & GitHub", icon: "🐙" },
        ],
      },
      timeline: {
        type: [
          {
            year: { type: String, required: true },
            title: { type: String, required: true },
            desc: { type: String, required: true },
          }
        ],
        default: [
          { year: "2024", title: "The Idea", desc: "Decided to build a centralized platform to share practical web development knowledge." },
          { year: "2025", title: "Building in Public", desc: "Documented the entire process of building modern full-stack web applications." },
          { year: "2026", title: "Launched SriKode", desc: "Officially launched the platform to the developer community." },
        ],
      },
    },

    // 5. Contact Page Details (Except Form)
    contact: {
      heading: { type: String, default: "Get in Touch" },
      subheading: {
        type: String,
        default: "Have a question, suggestion, or want to collaborate? Drop me a message — I read every one.",
      },
      email: { type: String, default: "srikode.hq@gmail.com" },
      responseTime: { type: String, default: "I typically reply within 24–48 hours." },
      guestPostTitle: { type: String, default: "Write for SriKode" },
      guestPostDesc: {
        type: String,
        default: "Got something valuable to share with the dev community? I welcome quality guest posts on web development topics.",
      },
      socials: {
        type: [
          {
            platform: { type: String, required: true },
            handle: { type: String, default: "" },
            href: { type: String, required: true },
          }
        ],
        default: [
          { platform: "GitHub", handle: "@srikode-dev", href: "https://github.com/srikode-dev" },
          { platform: "YouTube", handle: "@srikode", href: "https://www.youtube.com/@srikode" },
          { platform: "Twitter / X", handle: "@srikode_dev", href: "https://x.com/srikode_dev" },
          { platform: "LinkedIn", handle: "@srikode", href: "https://www.linkedin.com/company/srikode" },
        ],
      },
    },

    // 6. Brand Theme Colors
    theme: {
      primaryColor: { type: String, default: "#2563eb" },
      primaryHover: { type: String, default: "#1d4ed8" },
      primaryLight: { type: String, default: "#eff6ff" },
      accentColor: { type: String, default: "#3b82f6" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("SiteConfig", siteConfigSchema);
