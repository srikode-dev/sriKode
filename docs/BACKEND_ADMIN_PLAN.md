# SriKode — Backend & Admin CMS Full Plan

> **Version:** 3.0 — Separate Node.js Backend + Block-Based Rich Editor
> **Saved in:** `docs/BACKEND_ADMIN_PLAN.md`
> **Status:** Approved — ready for implementation.

---

## 1. Architecture Overview

```
+-------------------------------------------------------------------+
|                       SriKode Ecosystem                           |
|                                                                   |
|  +-------------------+         +---------------------------+      |
|  |  srikode-fe       |         |  srikode-admin            |      |
|  |  (Next.js 14)     |         |  (React + Vite)           |      |
|  |                   |         |                           |      |
|  |  Public website   |         |  Block-based blog editor  |      |
|  |  Blogs, Videos    |         |  Comment moderation       |      |
|  |  Contact page     |         |  YouTube video controls   |      |
|  +--------+----------+         +-----------+---------------+      |
|           |                                |                      |
|           +----------------+---------------+                      |
|                            | REST API (HTTP/JSON)                 |
|                            v                                      |
|           +----------------------------------------+              |
|           |       srikode-api                      |              |
|           |       Node.js + Express.js             |              |
|           |                                        |              |
|           |   /api/blogs        (public)           |              |
|           |   /api/comments     (public)           |              |
|           |   /api/videos       (public)           |              |
|           |   /api/contact      (public)           |              |
|           |   /api/admin/...    (protected by JWT) |              |
|           |   /api/analytics    (protected by JWT) |              |
|           +----------------+-----------------------+              |
|                            |                                      |
|         +------------------+------------------+                   |
|         v                  v                  v                   |
|      MongoDB            ImageKit           Resend                 |
|      (Atlas)            (Images CDN)       (Email API)            |
|                                                                   |
|              + YouTube Data API v3 (fetched server-side)          |
+-------------------------------------------------------------------+
```

### Why Each Choice?

| Decision | Reason |
|---|---|
| **Separate Node.js + Express backend** | Full independence from FE project. Easier to scale, deploy separately, add services. Future-proof — swap FE frameworks without touching the API. Cleaner separation of concerns. |
| **Express.js** | Industry-standard, lightweight, rich middleware ecosystem. Perfect for a JSON REST API. Zero vendor lock-in. |
| **Separate React Admin App (Vite)** | Admin UI never ships to the public. Total security isolation. Independent deployment and upgrades. You are the only user. |
| **MongoDB Atlas** | Blogs are documents with flexible nested block arrays (content, FAQs, related posts). MongoDB stores these naturally. Free 512 MB tier covers thousands of posts. |
| **Block-based JSON content** | Your blog-1.json already uses this — content is an array of typed blocks (paragraph, heading, code, image, callout, etc.). Portable, framework-agnostic, SEO-friendly. |
| **ImageKit** | CDN + image optimizer. Auto-converts to WebP, resizes on the fly via URL params, global CDN delivery. |
| **Resend** | Modern email API — ~10 lines of integration, 99% deliverability, 3,000 free emails/month. No SMTP config. |
| **YouTube Data API v3** | You upload to YouTube as normal. Backend syncs your public videos into MongoDB (caching) so we can add isHidden control without hitting API quota on every page load. |

---

## 2. Folder Structure

```
c:\REACT\srikode\
  srikode-fe/          (Existing Next.js public website)
  srikode-admin/       (New: React + Vite admin CMS)
  srikode-api/         (New: Node.js + Express REST API)
  docs/
      BACKEND_ADMIN_PLAN.md
```

### srikode-api/ Internal Structure

```
srikode-api/
  src/
    config/
      db.js                    MongoDB connection
    models/
      Blog.js
      Comment.js
      Video.js
      Contact.js
    routes/
      public/
        blogs.js               GET published blogs
        comments.js            GET/POST comments
        videos.js              GET visible videos
        contact.js             POST contact form
      admin/
        auth.js                POST login
        blogs.js               Full CRUD
        comments.js            Approve/delete
        videos.js              Sync + toggle isHidden
        contacts.js            View/delete messages
        analytics.js           Aggregated stats
    middleware/
      authMiddleware.js        JWT verification
      errorHandler.js
    services/
      youtubeService.js        YouTube API calls + sync logic
      imagekitService.js       ImageKit auth token generation
      resendService.js         Email sending
    app.js                     Express app setup
  .env
  package.json
  server.js                    Entry point
```

---

## 3. Database Models

### 3.1 Blog Post

Based directly on blog-1.json, extended with admin control fields.

```
Collection: blogs

CORE FIELDS
  _id            ObjectId     Auto-generated
  slug           String       URL-friendly unique ID (e.g., "html-css-guide-2026")
  title          String       "Complete HTML & CSS Guide 2026"
  excerpt        String       Short teaser shown on blog cards
  description    String       Longer meta description (for SEO)
  coverImage     String       ImageKit CDN URL

TAXONOMY
  category       String       "HTML & CSS", "React", "JavaScript", etc.
  tags           [String]     ["HTML", "Beginner", "Tutorial"]
  difficulty     String       "Beginner" | "Intermediate" | "Advanced"

AUTHOR (embedded)
  author.name    String       "Srikant Sahu"
  author.role    String       "Full Stack Developer"
  author.avatar  String       ImageKit URL for profile photo
  author.bio     String       Short bio text

SEO (embedded)
  seo.title        String     SEO page title
  seo.description  String     Meta description
  seo.keywords     [String]   SEO keyword array

RICH BLOCK CONTENT (matches blog-1.json structure exactly)
  content           [Block]   Array of typed content blocks
  tableOfContents   [{id, title}]   Auto-generated from heading blocks at save time
  faq               [{question, answer}]   FAQ section

RELATIONS
  relatedPosts   [ObjectId]   References to other blog _ids

ADMIN CONTROLS
  isPublished    Boolean      false = Draft, true = Live on FE
  isFeatured     Boolean      Pin to hero/featured section on homepage

ENGAGEMENT
  viewCount      Number       Incremented on each page view
  readingTime    String       "12 min" (auto-calculated from content word count)

TIMESTAMPS (Mongoose auto)
  createdAt      Date
  updatedAt      Date
```

### Content Block Types (matching blog-1.json exactly)

| Block Type | Fields | Description |
|---|---|---|
| heading | level (2/3/4), text | Section headings |
| paragraph | text | Body paragraph (supports inline HTML for bold/italic/links) |
| code | language, filename, code | Syntax-highlighted code block |
| image | src (ImageKit URL), alt, caption | Full-width image |
| callout | variant (info/success/warning/danger), title, text | Highlighted note box |
| tip | text | Green tip callout |
| warning | text | Yellow warning callout |
| quote | text, author | Styled blockquote |
| list | style (ordered/unordered), items ([String]) | Bullet or numbered list |
| table | headers ([String]), rows ([[String]]) | Data table |
| video | url (YouTube URL) | Embedded YouTube video |
| divider | — | Horizontal rule between sections |

---

### 3.2 Comment

```
Collection: comments

  _id          ObjectId     Auto-generated
  blogId       ObjectId     Reference -> blogs._id
  name         String       Commenter display name
  email        String       Stored privately, never exposed to public API
  text         String       Comment content
  isApproved   Boolean      Defaults false. You flip to true in Admin to publish it.
  createdAt    Date         Auto
```

### 3.3 Video (YouTube Sync Cache)

```
Collection: videos

  _id          ObjectId     Auto-generated
  youtubeId    String       YouTube video ID (e.g., "dQw4w9WgXcQ")
  title        String       Video title from YouTube API
  thumbnail    String       maxresdefault thumbnail URL
  duration     String       Formatted duration ("12:34")
  publishedAt  Date         When uploaded on YouTube
  viewCount    String       YouTube view count
  description  String       Video description
  isHidden     Boolean      false = show on FE, true = hidden
  syncedAt     Date         Last sync timestamp
```

### 3.4 Contact Message

```
Collection: contacts

  _id          ObjectId     Auto-generated
  name         String       Sender name
  email        String       Sender email
  subject      String       Message subject
  message      String       Full message body
  isRead       Boolean      false -> true when opened in Admin
  createdAt    Date         Auto
```

---

## 4. API Endpoints

### Public Routes (used by srikode-fe — no auth required)

| Method | Route | Description |
|---|---|---|
| GET | /api/blogs | All published blogs. Supports ?category=, ?tag=, ?page=, ?limit= |
| GET | /api/blogs/featured | Blogs with isFeatured=true |
| GET | /api/blogs/:slug | Single blog by slug. Auto-increments viewCount. |
| GET | /api/blogs/:slug/comments | Approved comments for a blog |
| POST | /api/blogs/:slug/comments | Submit a new comment (saved with isApproved=false) |
| GET | /api/videos | All non-hidden videos (isHidden=false) |
| POST | /api/contact | Submit a contact form message. Triggers Resend email to you. |

### Admin Routes (used by srikode-admin — JWT required on ALL)

#### Auth
| Method | Route | Description |
|---|---|---|
| POST | /api/admin/auth/login | Login with email + password. Returns JWT. |
| GET | /api/admin/auth/me | Verify token, return admin info. |

#### Blog Management (Full CRUD)
| Method | Route | Description |
|---|---|---|
| GET | /api/admin/blogs | All blogs (drafts + published) with full metadata |
| GET | /api/admin/blogs/:id | Single blog by ID (for editor pre-fill) |
| POST | /api/admin/blogs | Create a new blog draft |
| PUT | /api/admin/blogs/:id | Update blog (content, title, toggles, etc.) |
| DELETE | /api/admin/blogs/:id | Permanently delete a blog |
| POST | /api/admin/imagekit/auth | Generate ImageKit auth token for client-side upload |

#### Comment Moderation
| Method | Route | Description |
|---|---|---|
| GET | /api/admin/comments | All comments across all blogs (pending + approved) |
| PUT | /api/admin/comments/:id | Toggle isApproved true/false |
| DELETE | /api/admin/comments/:id | Delete a comment |

#### YouTube / Video Management
| Method | Route | Description |
|---|---|---|
| GET | /api/admin/videos | All videos including hidden ones |
| POST | /api/admin/videos/sync | Trigger YouTube API sync — fetches latest from your channel |
| PUT | /api/admin/videos/:id | Toggle isHidden on a video |

#### Contact Messages
| Method | Route | Description |
|---|---|---|
| GET | /api/admin/contacts | All contact messages |
| PUT | /api/admin/contacts/:id | Mark as read |
| DELETE | /api/admin/contacts/:id | Delete a message |

#### Analytics
| Method | Route | Description |
|---|---|---|
| GET | /api/admin/analytics | Total views, top posts, comment counts, contact count, recent activity |

---

## 5. Rich Block-Based Editor

The centrepiece of the admin CMS. Based on the blog-1.json content structure.

### Editor Tool: TipTap

Why TipTap?
- Built on ProseMirror — same engine as Notion, Linear, and GitHub
- Ready-made extensions for every block type: headings, code blocks, images, blockquotes, tables, YouTube embeds
- Outputs JSON — maps cleanly to our block array format
- First-class React integration
- Open source, free

### Block Editor Controls

| Block | How Admin Adds It | Stored in DB |
|---|---|---|
| Heading H2/H3/H4 | Toolbar or /heading slash command | {type:"heading", level:2, text:"..."} |
| Paragraph | Typing directly | {type:"paragraph", text:"..."} |
| Code Block | /code -> select language -> type filename | {type:"code", language:"jsx", filename:"Card.jsx", code:"..."} |
| Image | /image -> file picker -> uploads to ImageKit | {type:"image", src:"https://ik.imagekit.io/...", alt:"...", caption:"..."} |
| Callout | /callout -> pick variant (info/tip/warning/danger) | {type:"callout", variant:"info", title:"Note", text:"..."} |
| Quote | /quote -> type text + author name | {type:"quote", text:"...", author:"..."} |
| List | Toolbar buttons | {type:"list", style:"unordered", items:["...","..."]} |
| Table | /table -> set rows/cols | {type:"table", headers:[...], rows:[[...]]} |
| YouTube Embed | /video -> paste YouTube URL | {type:"video", url:"https://youtube.com/watch?v=..."} |
| Divider | /divider | {type:"divider"} |

### Auto-Generated Fields (server-side at save time)
- tableOfContents: extracted from all heading blocks in content array
- readingTime: counted from words in paragraph + heading + list blocks (avg 200 wpm)

---

## 6. YouTube Sync Flow

```
1. Upload video on YouTube Studio (as normal)
      |
2. Admin Panel -> Videos -> Click "Sync YouTube"
      |
3. Admin app calls: POST /api/admin/videos/sync
      |
4. youtubeService.js calls YouTube Data API v3:
   - Lists latest 50 PUBLIC videos from your Channel ID
   - Fetches: title, description, thumbnail, publishedAt, duration, viewCount
      |
5. For each video:
   - Already in DB? -> Update title, thumbnail, viewCount, syncedAt
   - New?           -> Insert with isHidden = false (visible by default)
      |
6. Admin sees updated list with isHidden toggle per video
      |
7. FE calls GET /api/videos -> receives only isHidden=false videos
      |
8. FE renders: <iframe src="https://www.youtube.com/embed/{youtubeId}" />
```

Why cache to MongoDB?
- YouTube API quota: 10,000 units/day. Live calls would exhaust quickly.
- isHidden is our own concept — YouTube cannot hide a video from just your site.
- DB query ~5ms vs YouTube API 300-600ms. Faster page loads.

---

## 7. ImageKit Image Upload Flow

```
Admin Blog Editor:
  1. Admin clicks "Add Image" block
  2. File picker opens
      |
  3. Admin app calls GET /api/admin/imagekit/auth
     Backend returns a short-lived ImageKit auth signature
      |
  4. Admin app sends file DIRECTLY to ImageKit (client-side upload)
     Image bytes never pass through our server
      |
  5. ImageKit stores on global CDN, returns URL:
     https://ik.imagekit.io/yourid/blog-covers/image.jpg
      |
  6. URL inserted into editor as image block src or coverImage field
     Saved in MongoDB

FE (srikode-fe):
  7. Next.js <Image> fetches from ImageKit URL
     ImageKit auto-serves WebP, resized per viewport
     e.g., ?tr=w-800,h-450 for thumbnails automatically
```

---

## 8. Resend Email — Triggered Events

| Event | Email Content | Recipient |
|---|---|---|
| Contact form submitted | Name, Email, Subject, Message body | You (admin) |
| New comment submitted (optional) | "New comment pending approval on [Blog Title]" with preview | You (admin) |

---

## 9. Security

- Admin credentials (email + hashed password) stored as environment variables ONLY — never in DB.
- Password stored as bcrypt hash in .env. Plain-text never stored anywhere.
- On login: server issues JWT signed with JWT_SECRET, 7-day expiry.
- Every admin route passes through authMiddleware.js — invalid/expired tokens return 401.
- CORS: Express configured to only accept requests from srikode-fe and srikode-admin domains.
- Rate Limiting: express-rate-limit applied to /api/admin/auth/login (brute-force protection).
- Public srikode-fe has zero access to admin routes.

---

## 10. Environment Variables

### srikode-api/.env
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...@cluster.mongodb.net/srikode
JWT_SECRET=your_super_secret_32char_key
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD_HASH=$2b$10$...
IMAGEKIT_PUBLIC_KEY=public_...
IMAGEKIT_PRIVATE_KEY=private_...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/yourid
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_TO_EMAIL=you@example.com
YOUTUBE_API_KEY=AIza...
YOUTUBE_CHANNEL_ID=UC...
ALLOWED_ORIGINS=https://srikode.com,https://admin.srikode.com
```

### srikode-fe/.env.local
```
NEXT_PUBLIC_API_URL=https://api.srikode.com
NEXT_PUBLIC_IMAGEKIT_URL=https://ik.imagekit.io/yourid
```

### srikode-admin/.env
```
VITE_API_URL=https://api.srikode.com
VITE_IMAGEKIT_PUBLIC_KEY=public_...
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/yourid
```

---

## 11. Admin CMS Pages

| Page | Route | Description |
|---|---|---|
| Login | /login | Email + password form. Stores JWT on success. |
| Dashboard | / | Analytics: total views, blog count, pending comments, contact count, top 5 posts by views, recent activity |
| Blog List | /blogs | Table of all blogs with draft/published badge, view count, edit/delete actions |
| New Blog | /blogs/new | TipTap rich editor, cover image upload, metadata fields, FAQ editor, publish/featured toggles |
| Edit Blog | /blogs/:id/edit | Same editor pre-loaded with existing blog data |
| Comments | /comments | All comments across all blogs. Filter pending/approved. One-click approve or delete. |
| Videos | /videos | YouTube-synced list. "Sync YouTube" button. isHidden toggle per video. |
| Contacts | /contacts | Inbox view of contact messages. Unread indicator. Delete action. |

---

## 12. Step-by-Step Build Order

### Phase 1 — srikode-api (Node.js Backend)

- [ ] 1.1  Scaffold srikode-api — npm init, install express, mongoose, dotenv, cors, bcryptjs, jsonwebtoken, express-rate-limit
- [ ] 1.2  Set up MongoDB Atlas cluster + connect via Mongoose (config/db.js)
- [ ] 1.3  Define all Mongoose models: Blog, Comment, Video, Contact
- [ ] 1.4  Build JWT middleware (middleware/authMiddleware.js)
- [ ] 1.5  Build Admin Auth routes — login with bcrypt verify + JWT issue
- [ ] 1.6  Build Blog CRUD routes — public GET (published only) + admin full CRUD
- [ ] 1.7  Build Comment routes — public POST submit + admin approve/delete
- [ ] 1.8  Build Contact route — POST + wire Resend email
- [ ] 1.9  Build YouTube sync service + admin video routes
- [ ] 1.10 Build ImageKit auth token endpoint
- [ ] 1.11 Build Analytics aggregation route
- [ ] 1.12 Test all routes with Postman / Thunder Client

### Phase 2 — srikode-fe Integration

- [ ] 2.1  Replace dummy blog JSON reads with real API calls
- [ ] 2.2  Wire blog detail page: fetch by slug + auto-increment view count
- [ ] 2.3  Wire comment submit form -> POST /api/blogs/:slug/comments
- [ ] 2.4  Wire contact form -> POST /api/contact
- [ ] 2.5  Replace dummy video data in LatestVideos.jsx -> GET /api/videos
- [ ] 2.6  Add ImageKit Next.js SDK for optimized image rendering

### Phase 3 — srikode-admin (React + Vite CMS)

- [ ] 3.1  Scaffold srikode-admin with Vite + React. Install React Router, Axios, TipTap.
- [ ] 3.2  Login page + JWT storage + protected route wrapper
- [ ] 3.3  Dashboard page with analytics widgets
- [ ] 3.4  Blog list page — table with status badge, sort, edit/delete actions
- [ ] 3.5  Blog editor page — TipTap with all block types, ImageKit upload, metadata, toggles
- [ ] 3.6  Comments moderation page — filter pending/approved, approve/delete per comment
- [ ] 3.7  Videos page — Sync button + isHidden toggle per video card
- [ ] 3.8  Contacts inbox — unread indicator, delete action

---

## 13. Tech Stack Summary

| Layer | Technology |
|---|---|
| Public FE | Next.js 14+ |
| Admin CMS | React + Vite (latest) |
| Backend API | Node.js + Express 4.x |
| Database | MongoDB Atlas + Mongoose 6.x |
| Auth | jsonwebtoken + bcryptjs |
| Rich Editor | TipTap 2.x |
| Image CDN | ImageKit |
| Email | Resend |
| Video Source | YouTube Data API v3 |
| Rate Limiting | express-rate-limit |
| CORS | cors (npm) |
