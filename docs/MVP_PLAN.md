# SriKode — Complete MVP Plan (Phase 1: Frontend)

> Last Updated: 2026-06-19
> Status: Planning
> Stack: Next.js 16 · React 19 · Tailwind CSS v4 · Shadcn/ui (radix-nova) · JavaScript

---

## 1. Project Overview

**SriKode** is a developer-focused blog & portfolio brand platform.
The primary goal of Phase 1 is to build a beautiful, modern, fully responsive
public frontend using **static data only** — no backend integration yet.

The site will showcase:
- Step-by-step coding tutorials (e.g. "How to build a login form")
- Full code snippets and guides in blog posts
- Projects portfolio
- About the founder / brand
- Contact page

---

## 2. What's Already Set Up

| Item | Status |
|---|---|
| Next.js 16 project (`srikode-fe`) | ✅ Created |
| Tailwind CSS v4 | ✅ Configured |
| Shadcn/ui (radix-nova style) | ✅ Installed |
| Lucide React icons | ✅ Installed |
| Base UI components: `Button`, `Input`, `ScrollArea` | ✅ Added |
| App Router with `layout.jsx` + `page.jsx` | ✅ Scaffolded |
| `globals.css` with full design token system | ✅ Done |
| `docs/PROJECT_PLAN.md` + `docs/PHASE_1_FRONTEND.md` | ✅ Done |

---

## 3. Design Direction

### Theme
- **Mode**: Dark-first, with light mode toggle
- **Feel**: Premium dev blog — think Vercel meets Hashnode meets a personal brand
- **Typography**: `Inter` (body) + `JetBrains Mono` (code blocks)
- **Color Palette**:
  - Background: deep near-black `#0a0a0f`
  - Surface cards: `#111118`
  - Primary accent: electric violet `#7c3aed` → `#a78bfa`
  - Secondary accent: cyan `#06b6d4`
  - Text: `#f1f5f9` (primary), `#94a3b8` (muted)
  - Border: `#1e1e2e`
- **Style Cues**:
  - Glassmorphism cards with `backdrop-blur`
  - Gradient hero with animated noise/mesh background
  - Subtle glow effects on cards on hover
  - Smooth page transitions
  - Code syntax highlighting with `rehype-highlight` (Phase 2 can add this)

---

## 4. Folder Structure (Final)

```
srikode-fe/
├── app/
│   ├── layout.jsx               ← Root layout (Navbar + Footer)
│   ├── page.jsx                 ← Home Page
│   ├── globals.css              ← Design tokens + global styles
│   │
│   ├── blogs/
│   │   ├── page.jsx             ← Blog listing
│   │   └── [slug]/
│   │       └── page.jsx         ← Blog detail / reader view
│   │
│   ├── projects/
│   │   ├── page.jsx             ← Projects listing
│   │   └── [slug]/
│   │       └── page.jsx         ← Project detail
│   │
│   ├── about/
│   │   └── page.jsx             ← About / brand story
│   │
│   ├── contact/
│   │   └── page.jsx             ← Contact form (UI only)
│   │
│   └── not-found.jsx            ← 404 page
│
├── components/
│   ├── ui/                      ← Shadcn primitives (button, input, etc.)
│   │
│   ├── layout/
│   │   ├── Navbar.jsx           ← Top navigation + mobile menu + dark toggle
│   │   ├── Footer.jsx           ← Footer with links, social, copyright
│   │   └── Container.jsx        ← Max-width wrapper
│   │
│   ├── common/
│   │   ├── SectionTitle.jsx     ← Reusable section heading
│   │   ├── Badge.jsx            ← Tag / category badge
│   │   ├── CodeBlock.jsx        ← Syntax-highlighted code display
│   │   └── ThemeToggle.jsx      ← Dark/light mode switcher
│   │
│   ├── blog/
│   │   ├── BlogCard.jsx         ← Card for blog listing grid
│   │   ├── FeaturedBlogCard.jsx ← Larger hero card for featured posts
│   │   └── BlogDetail.jsx       ← Full article renderer (MDX-ready)
│   │
│   ├── project/
│   │   ├── ProjectCard.jsx      ← Card for project listing grid
│   │   └── FeaturedProjectCard.jsx
│   │
│   └── home/
│       ├── Hero.jsx             ← Animated hero section
│       ├── FeaturedBlogs.jsx    ← 3-column featured blogs row
│       ├── FeaturedProjects.jsx ← Projects showcase row
│       ├── StatsBar.jsx         ← "50+ Blogs · 20+ Projects · 5K+ Readers"
│       ├── LatestVideos.jsx     ← YouTube video cards
│       └── NewsletterCTA.jsx    ← Email subscribe call-to-action
│
├── data/
│   ├── blogs.js                 ← Static blog posts array
│   ├── projects.js              ← Static projects array
│   └── categories.js            ← Blog category list
│
├── lib/
│   └── utils.js                 ← `cn()` helper + shared utilities
│
└── public/
    └── images/                  ← OG image, avatars, thumbnails
```

---

## 5. Pages — Detailed Breakdown

### 5.1 Home Page (`/`)

**Sections (top to bottom):**

| Order | Section | Description |
|---|---|---|
| 1 | **Navbar** | Logo + nav links + dark toggle + CTA button |
| 2 | **Hero** | Big headline, tagline, animated gradient BG, two CTAs |
| 3 | **Stats Bar** | Animated counters: blogs, projects, readers |
| 4 | **Featured Blogs** | 3 latest/featured blog cards in a responsive grid |
| 5 | **Featured Projects** | 2–3 featured project cards |
| 6 | **Latest Videos** | YouTube embed thumbnails (static links) |
| 7 | **Newsletter CTA** | Email input + subscribe button (UI only) |
| 8 | **Footer** | Links, social icons, copyright |

---

### 5.2 Blogs Page (`/blogs`)

**Sections:**
- Page heading + subtitle
- **Search bar** (client-side filter, no API)
- **Category filter tabs** (All, HTML/CSS, JavaScript, React, MERN, etc.)
- **Blog grid** — responsive 1/2/3 column
- Each `BlogCard` shows:
  - Cover image / thumbnail
  - Category badge
  - Title
  - Excerpt (first 120 chars)
  - Read time estimate
  - Date
  - "Read More" button

---

### 5.3 Blog Detail Page (`/blogs/[slug]`)

**This is the most important page — your tutorial reader view.**

Layout:
- Full-width hero with cover image + title overlay
- **Two-column layout**:
  - **Left (main)**: Article content
    - Blog metadata (author, date, read time, tags)
    - Article body (markdown/rich text rendered)
    - Step-by-step numbered sections
    - Inline code snippets
    - Full code blocks with syntax highlighting + copy button
    - Images with captions
  - **Right (sticky sidebar)**:
    - Table of Contents (auto-generated from headings)
    - "Share this post" buttons
    - Related posts
- Bottom: Next / Previous post navigation
- Tags section

---

### 5.4 Projects Page (`/projects`)

- Page heading
- Technology filter (React, Node, Next.js, MERN…)
- **Projects grid** — each `ProjectCard` shows:
  - Screenshot / cover image
  - Title + short description
  - Tech stack badges
  - Live demo + GitHub links
  - "View Details" button

---

### 5.5 Project Detail Page (`/projects/[slug]`)

- Hero image / cover
- Project title, overview
- Tech stack used (icon badges)
- Key features list
- Screenshots carousel
- Live demo + GitHub links

---

### 5.6 About Page (`/about`)

- **Founder section**: Photo, name, bio, role
- **Mission statement**: What SriKode is about
- **Tech stack I use**: Icon grid (React, Next, Node, MongoDB…)
- **Timeline / journey** (optional but great for brand)
- **Social links**: GitHub, LinkedIn, YouTube, Twitter

---

### 5.7 Contact Page (`/contact`)

- Intro text
- Contact form (UI only — no API):
  - Name, Email, Subject, Message fields
  - Submit button (shows success toast on click)
- Social/connect section beside the form

---

### 5.8 404 Not Found (`/not-found.jsx`)

- Fun, branded 404 page
- "Go Home" and "Browse Blogs" buttons

---

## 6. Component Specifications

### Navbar
- Logo (text or SVG)
- Links: Home | Blogs | Projects | About | Contact
- Right side: `ThemeToggle` icon + `Start Reading` CTA button
- Mobile: hamburger menu with slide-in drawer
- Behavior: transparent on hero, solid with blur on scroll

### BlogCard
```
┌────────────────────────────┐
│  [Cover Image]             │
├────────────────────────────┤
│  [Category Badge]          │
│  Blog Title (2 lines max)  │
│  Short excerpt...          │
│  📅 Jun 12  ·  ⏱ 5 min    │
│  [Read More →]             │
└────────────────────────────┘
```

### CodeBlock
- Syntax-highlighted (using `highlight.js` or `prism` via CSS)
- Language label top-right
- Copy-to-clipboard button
- Line numbers (optional)

---

## 7. Static Data Schema

### Blog Post (`data/blogs.js`)
```js
{
  id: 1,
  slug: "how-to-build-a-login-form",
  title: "How to Build a Login Form from Scratch",
  excerpt: "Step-by-step guide to building a responsive login form...",
  category: "HTML/CSS",
  tags: ["html", "css", "forms", "beginner"],
  readTime: 6,             // minutes
  publishedAt: "2026-06-10",
  featured: true,
  coverImage: "/images/blogs/login-form.png",
  content: `...`,          // Full markdown or rich text
  steps: [                 // For step-by-step tutorials
    { step: 1, title: "Create the HTML Structure", code: `...`, explanation: "..." },
    { step: 2, title: "Style with CSS", code: `...`, explanation: "..." },
  ]
}
```

### Project (`data/projects.js`)
```js
{
  id: 1,
  slug: "todo-app-react",
  title: "Todo App with React",
  description: "A clean, minimal todo app built with React and local storage.",
  techStack: ["React", "CSS", "LocalStorage"],
  tags: ["react", "beginner"],
  featured: true,
  coverImage: "/images/projects/todo-app.png",
  liveUrl: "https://...",
  githubUrl: "https://...",
  publishedAt: "2026-05-20"
}
```

---

## 8. SEO Strategy

Every page gets:
```js
export const metadata = {
  title: "Page Title | SriKode",
  description: "...",
  openGraph: {
    title: "...",
    description: "...",
    image: "/og-image.png",
    url: "https://srikode.dev/...",
  },
  twitter: { card: "summary_large_image" }
};
```

Dynamic pages (blog/project detail) use `generateMetadata()` to pull from static data.

---

## 9. Responsiveness Breakpoints

| Breakpoint | Layout |
|---|---|
| `< 640px` (mobile) | Single column, hamburger nav |
| `640–1024px` (tablet) | 2-column grids |
| `> 1024px` (desktop) | 3-column grids, sticky sidebar |

---

## 10. Performance Checklist

- [ ] Use `next/image` for all images (auto WebP + lazy load)
- [ ] Use `next/font` for fonts (zero layout shift)
- [ ] Minimize client components — use Server Components by default
- [ ] `"use client"` only for interactive parts (ThemeToggle, SearchBar, ContactForm)
- [ ] Lighthouse target: **90+ on all metrics**

---

## 11. Accessibility Checklist

- [ ] Semantic HTML (`<main>`, `<article>`, `<nav>`, `<section>`, `<header>`, `<footer>`)
- [ ] All images have `alt` text
- [ ] All interactive elements have `aria-label`
- [ ] Keyboard navigation fully functional
- [ ] Color contrast meets WCAG AA

---

## 12. Build Order (Execution Sequence)

Follow this exact order when building:

```
Step 1  → globals.css           Update design tokens (colors, fonts, radius)
Step 2  → lib/utils.js          Add cn() helper, formatDate, readTimeEstimate
Step 3  → data/                 Add static blogs.js, projects.js, categories.js
Step 4  → components/layout/    Container → Navbar → Footer
Step 5  → components/common/    SectionTitle → Badge → ThemeToggle → CodeBlock
Step 6  → app/layout.jsx        Wire Navbar + Footer, add fonts, update metadata
Step 7  → components/home/      Hero → StatsBar → FeaturedBlogs → FeaturedProjects
                                 → LatestVideos → NewsletterCTA
Step 8  → app/page.jsx          Assemble Home page using all home/ components
Step 9  → components/blog/      BlogCard → FeaturedBlogCard → BlogDetail
Step 10 → app/blogs/            Blogs listing page
Step 11 → app/blogs/[slug]/     Blog detail / reader page
Step 12 → components/project/   ProjectCard → FeaturedProjectCard
Step 13 → app/projects/         Projects listing page
Step 14 → app/projects/[slug]/  Project detail page
Step 15 → app/about/            About page
Step 16 → app/contact/          Contact page
Step 17 → app/not-found.jsx     404 page
Step 18 → SEO Pass              Add metadata to every page
Step 19 → Responsive Pass       Test and fix all breakpoints
Step 20 → Lighthouse Audit      Fix performance / a11y issues
```

---

## 13. Phase Completion Checklist

### Infrastructure
- [ ] Folder structure set up
- [ ] Design tokens updated in `globals.css`
- [ ] Fonts integrated (Inter + JetBrains Mono)
- [ ] Static data files created

### Layout
- [ ] Container component
- [ ] Navbar (desktop + mobile)
- [ ] Footer
- [ ] Root layout wired up

### Home Page
- [ ] Hero section
- [ ] Stats bar
- [ ] Featured blogs row
- [ ] Featured projects row
- [ ] Latest YouTube videos
- [ ] Newsletter CTA

### Pages
- [ ] Blogs listing page
- [ ] Blog detail page (reader view)
- [ ] Projects listing page
- [ ] Project detail page
- [ ] About page
- [ ] Contact page
- [ ] 404 page

### Quality
- [ ] All pages responsive (mobile, tablet, desktop)
- [ ] SEO metadata on every page
- [ ] Dark/light mode working
- [ ] Lighthouse audit ≥ 90
- [ ] No console errors

---

## 14. What Phase 2 Will Add

- Backend API (Node + Express + MongoDB)
- Real blog CRUD (create, edit, delete posts)
- Markdown/MDX rendering with syntax highlighting
- Image uploads via Cloudinary
- JWT authentication for admin

## 15. What Phase 3 Will Add

- Admin panel (React + Vite)
- Post editor (rich text or markdown)
- Category & project management
- Analytics dashboard

---

## Notes & Decisions

1. **JavaScript only** — no TypeScript in this project (as per existing setup)
2. **pnpm** is the package manager (pnpm-workspace.yaml exists)
3. **Shadcn** style is `radix-nova` — do NOT change this
4. **App Router** only — no pages/ directory
5. **Static data first** — no API calls in Phase 1
6. Blog content in Phase 1 can be plain text/JSX strings;
   full MDX rendering to be added in Phase 2
7. Shadcn components can be added as needed via `npx shadcn add <component>`

---

*This document is the single source of truth for Phase 1 development.*
*Update the checklist items as work progresses.*
