# Phase 1 - Frontend Development

## Goal

Build a production-ready frontend for SriKode using:

* Next.js
* JavaScript
* Tailwind CSS
* App Router

No backend integration in this phase.

---

# Project Creation

Create project:

npx create-next-app@latest srikode-fe

Options:

* JavaScript
* Tailwind CSS
* App Router
* ESLint
* src directory
* Turbopack

---

# Folder Structure

src/

app/
components/
constants/
data/
hooks/
lib/
services/
styles/
utils/

---

# App Router Structure

app/

layout.js
page.js

blogs/
page.js

blogs/[slug]/
page.js

projects/
page.js

projects/[slug]/
page.js

about/
page.js

contact/
page.js

not-found.js

---

# Components Structure

components/

layout/
Navbar.jsx
Footer.jsx
Container.jsx

common/
Button.jsx
SectionTitle.jsx
Badge.jsx

blog/
BlogCard.jsx
FeaturedBlogCard.jsx

project/
ProjectCard.jsx
FeaturedProjectCard.jsx

home/
Hero.jsx
FeaturedBlogs.jsx
FeaturedProjects.jsx
LatestVideos.jsx

---

# SEO Requirements

Every page must include metadata.

Example:

export const metadata = {
title: "SriKode",
description: "Web Development Tutorials and Projects",
};

Use metadata for:

* Home
* Blogs
* Projects
* About
* Contact

---

# Security Requirements

Use:

rel="noopener noreferrer"

for external links.

Never expose:

* API Keys
* Secrets
* Tokens

Store secrets in:

.env.local

---

# Home Page Structure

1. Navbar
2. Hero
3. Featured Blogs
4. Featured Projects
5. Latest Videos
6. Newsletter CTA
7. Footer

---

# Blogs Page

Features:

* Blog Listing
* Search UI
* Category Filter UI

Static Data Only

---

# Projects Page

Features:

* Project Listing
* Technology Tags

Static Data Only

---

# About Page

Content:

* Founder
* Mission
* Tech Stack
* Social Links

---

# Contact Page

Fields:

* Name
* Email
* Subject
* Message

No API Integration

---

# Accessibility

Must Include:

* Semantic HTML
* alt tags
* aria labels
* keyboard navigation

---

# Performance

Use:

next/image
next/font

Optimize:

* Images
* Fonts
* Layout Shift

Target:

* Lighthouse 90+

---

# Completion Checklist

[ ] Folder Structure Ready
[ ] Layout Created
[ ] Navbar Created
[ ] Footer Created
[ ] Home Page Created
[ ] Blogs Page Created
[ ] Blog Details Page Created
[ ] Projects Page Created
[ ] Project Details Page Created
[ ] About Page Created
[ ] Contact Page Created
[ ] Responsive Design
[ ] SEO Metadata
[ ] Lighthouse Audit
