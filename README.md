# 🚀 SriKode — Full-Stack Portfolio & Blog

SriKode is a production-grade, full-stack monorepo containing a modern personal portfolio, a fully-featured blog, a RESTful API backend, and a dedicated admin dashboard for content management.

## 🏗️ Architecture

The repository is structured as a monorepo containing three distinct applications:

- **/srikode-fe** (Frontend): The public-facing portfolio and blog built with Next.js (App Router) and Tailwind CSS.
- **/srikode-api** (Backend): The RESTful API built with Node.js, Express, and MongoDB. Handles blog posts, contact submissions, and admin authentication.
- **/srikode-admin** (Admin Dashboard): A secure, client-side dashboard built with React (Vite) for managing blog posts, categories, and viewing contact messages.

## 💻 Tech Stack

### Frontend (srikode-fe)
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Deployment:** Vercel

### Backend (srikode-api)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Media Storage:** ImageKit
- **Security:** Helmet, express-rate-limit, express-mongo-sanitize, hpp, xss-sanitizer
- **Monitoring:** Sentry (Error Tracking), Winston (Logging)
- **Deployment:** Vercel (Serverless Functions)

### Admin (srikode-admin)
- **Framework:** React + Vite
- **Routing:** React Router v7
- **State Management:** Zustand
- **Deployment:** Vercel

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- pnpm (Package Manager)
- MongoDB account (Atlas or local)
- ImageKit account (for image hosting)

### 2. Installation
Clone the repository and install dependencies in all three folders:

```bash
git clone https://github.com/srikode-dev/sriKode.git
cd sriKode

# Install API dependencies
cd srikode-api && pnpm install

# Install Frontend dependencies
cd ../srikode-fe && pnpm install

# Install Admin dependencies
cd ../srikode-admin && pnpm install
```

### 3. Environment Variables
You need to set up `.env` files in each of the three directories.

**srikode-api/.env:**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URLS=http://localhost:3000,http://localhost:5173
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
SENTRY_DSN=your_sentry_dsn
```

**srikode-fe/.env:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

**srikode-admin/.env:**
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 4. Running the Applications
Run all three development servers simultaneously (in separate terminal tabs):

```bash
# Terminal 1: Run Backend API
cd srikode-api
pnpm dev

# Terminal 2: Run Frontend
cd srikode-fe
pnpm dev

# Terminal 3: Run Admin Dashboard
cd srikode-admin
pnpm dev
```

- Frontend runs at: `http://localhost:3000`
- Admin runs at: `http://localhost:5173`
- API runs at: `http://localhost:5000`

---

## 🚀 Deployment (Vercel)

This monorepo is optimized for deployment on Vercel using a **Production Branch** strategy. 

1. Push your code to the `production` branch on GitHub.
2. In Vercel, create 3 separate projects connected to the same GitHub repository.
3. For each project, configure the **Root Directory**:
   - Project 1 Root: `srikode-api` (Framework: Other)
   - Project 2 Root: `srikode-fe` (Framework: Next.js)
   - Project 3 Root: `srikode-admin` (Framework: Vite)
4. Add the respective Environment Variables to each Vercel project.
5. In Vercel Settings -> Git, set the **Production Branch** to `production`.

*Note: The API and Admin folders contain custom `vercel.json` files to automatically configure Vercel Serverless Functions and Single Page Application routing.*

---

## 🛡️ Production Security & Reliability Features

- **Graceful Shutdown:** The API correctly handles `SIGTERM` and `SIGINT` signals to close MongoDB connections gracefully outside of Vercel.
- **XSS & NoSQL Injection Protection:** Aggressive input sanitization middlewares on all API routes.
- **Rate Limiting:** Prevents brute-force and DDoS attacks.
- **Sentry Integration:** Tracks crashes and runtime errors globally.
- **Content Security Policy (CSP):** Next.js headers strictly control resource loading origins.

---

*Designed and Built by Srikant Sahu*