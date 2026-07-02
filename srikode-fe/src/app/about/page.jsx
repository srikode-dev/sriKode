import Link from "next/link";
import { ArrowRight, Code2, Globe, Database, Server } from "lucide-react";
import { FaGithub, FaYoutube, FaTwitter, FaLinkedin } from "react-icons/fa";
import Container from "@/components/shared/Container";
import { blogs, getCategories } from "@/data";

export const metadata = {
  title: "About",
  description: "Learn about Srikant Sahu — Full Stack Developer, educator, and founder of SriKode.",
  alternates: {
    canonical: "/about",
  },
};

const techStack = [
  { name: "HTML & CSS", icon: "🎨", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { name: "JavaScript", icon: "⚡", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { name: "React", icon: "⚛️", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { name: "Next.js", icon: "▲", color: "bg-gray-50 text-gray-700 border-gray-200" },
  { name: "Node.js", icon: "🟢", color: "bg-green-50 text-green-700 border-green-200" },
  { name: "Express", icon: "🚂", color: "bg-slate-50 text-slate-700 border-slate-200" },
  { name: "MongoDB", icon: "🍃", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { name: "Tailwind CSS", icon: "💨", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { name: "TypeScript", icon: "🔷", color: "bg-blue-50 text-blue-800 border-blue-200" },
  { name: "Git & GitHub", icon: "🐙", color: "bg-purple-50 text-purple-700 border-purple-200" },
];

const timeline = [
  { year: "2019", title: "Started Learning Web Dev", desc: "Picked up HTML & CSS out of curiosity. Never looked back." },
  { year: "2021", title: "Built First MERN Project", desc: "Shipped a full-stack app with React, Node.js and MongoDB." },
  { year: "2023", title: "Launched SriKode", desc: "Started documenting my journey and sharing tutorials publicly." },
  { year: "2025", title: "10K+ Monthly Readers", desc: "The community grew. Real devs were learning from my content." },
  { year: "2026", title: "Building in Public", desc: "Recording every project, blog and tutorial — transparency first." },
];

const socials = [
  { icon: FaGithub, label: "GitHub", href: "https://github.com", color: "hover:bg-gray-900 hover:text-white" },
  { icon: FaYoutube, label: "YouTube", href: "https://youtube.com", color: "hover:bg-red-600 hover:text-white" },
  { icon: FaTwitter, label: "Twitter", href: "https://twitter.com", color: "hover:bg-sky-500 hover:text-white" },
  { icon: FaLinkedin, label: "LinkedIn", href: "https://linkedin.com", color: "hover:bg-blue-700 hover:text-white" },
];

export default function AboutPage() {
  const categories = getCategories();
  const totalViews = blogs.reduce((acc, b) => acc + (b.views || 0), 0);

  return (
    <div className="py-12">
      <Container>

        {/* ── Hero: Founder Card ── */}
        <section className="mb-16 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_340px]">
            {/* Left — Bio */}
            <div className="p-8 md:p-12">
              <span className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
                About Me
              </span>
              <h1 className="text-4xl font-extrabold text-gray-900 md:text-5xl">
                Hi, I&apos;m <span className="text-blue-600">Srikant Sahu</span>
              </h1>
              <p className="mt-2 text-lg font-medium text-gray-500">Full Stack Developer & Educator</p>

              <p className="mt-5 leading-relaxed text-gray-600">
                I&apos;m a MERN & Next.js developer passionate about building practical web applications
                and making web development accessible to everyone. SriKode is my platform to share
                everything I learn — through detailed tutorials, real projects and honest writing.
              </p>
              <p className="mt-4 leading-relaxed text-gray-600">
                I believe the best way to learn is by building real things. Every tutorial on SriKode
                is hands-on, step-by-step and based on what I actually use in production.
              </p>

              {/* Social links */}
              <div className="mt-8 flex flex-wrap gap-3">
                {socials.map(({ icon: Icon, label, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition ${color}`}
                  >
                    <Icon size={16} />
                    {label}
                  </a>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  href="/blogs"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
                >
                  Read My Tutorials <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right — Stats */}
            <div className="flex flex-col justify-center gap-6 border-t border-gray-100 bg-gray-50 p-8 md:border-l md:border-t-0">
              {[
                { label: "Tutorials Published", value: `${blogs.length}+`, icon: Code2 },
                { label: "Total Reads", value: `${(totalViews / 1000).toFixed(0)}K+`, icon: Globe },
                { label: "Categories Covered", value: `${categories.length}`, icon: Database },
                { label: "Years Building", value: "7+", icon: Server },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tech Stack ── */}
        <section className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-5 w-1 rounded-full bg-blue-600" />
            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-800">Tech Stack I Use</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {techStack.map(({ name, icon, color }) => (
              <span
                key={name}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${color}`}
              >
                <span>{icon}</span>
                {name}
              </span>
            ))}
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-5 w-1 rounded-full bg-blue-600" />
            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-800">My Journey</h2>
          </div>
          <div className="relative ml-4 border-l-2 border-gray-200 pl-8">
            {timeline.map(({ year, title, desc }, i) => (
              <div key={i} className="mb-10 relative last:mb-0">
                {/* Dot */}
                <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-600 bg-white text-[10px] font-bold text-blue-600">
                  ●
                </span>
                <span className="mb-1 inline-block rounded-full bg-blue-100 px-3 py-0.5 text-xs font-bold text-blue-700">
                  {year}
                </span>
                <h3 className="mt-1 text-base font-bold text-gray-900">{title}</h3>
                <p className="mt-1 text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Mission ── */}
        <section className="rounded-2xl bg-blue-600 p-8 text-center md:p-12">
          <h2 className="text-2xl font-extrabold text-white md:text-3xl">
            What SriKode is About
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-blue-100">
            SriKode is a developer blog focused on practical, hands-on web development tutorials.
            No fluff, no gatekeeping — just real code and real explanations. The goal is simple:
            help you build things you&apos;re proud of.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/blogs" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow transition hover:bg-blue-50">
              Start Reading
            </Link>
            <Link href="/contact-us" className="rounded-full border border-blue-400 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
              Get in Touch
            </Link>
          </div>
        </section>

      </Container>
    </div>
  );
}
