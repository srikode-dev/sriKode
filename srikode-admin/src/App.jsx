import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";

// Components
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Pages
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Analytics from "./pages/Analytics.jsx";
import Blogs from "./pages/Blogs.jsx";
import BlogEditor from "./pages/BlogEditor.jsx";
import Videos from "./pages/Videos.jsx";
import Comments from "./pages/Comments.jsx";
import Contacts from "./pages/Contacts.jsx";
import Newsletter from "./pages/Newsletter.jsx";

// CMS Individual Section Pages
import CmsStats from "./pages/cms/CmsStats.jsx";
import CmsSocialCard from "./pages/cms/CmsSocialCard.jsx";
import CmsNewsletter from "./pages/cms/CmsNewsletter.jsx";
import CmsAbout from "./pages/cms/CmsAbout.jsx";
import CmsContact from "./pages/cms/CmsContact.jsx";
import CmsTheme from "./pages/cms/CmsTheme.jsx";

// Store check auth trigger
import useAuthStore from "./store/authStore.js";

export default function App() {
  const { checkAuth } = useAuthStore();

  // Run session check on initial mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Workspace */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Main Dashboard home stats */}
          <Route index element={<Dashboard />} />
          
          <Route path="analytics" element={<Analytics />} />

          {/* Blogs CRUD routes */}
          <Route path="blogs" element={<Blogs />} />
          <Route path="blogs/new" element={<BlogEditor />} />
          <Route path="blogs/edit/:id" element={<BlogEditor />} />

          {/* Cached YouTube Video feeds */}
          <Route path="videos" element={<Videos />} />

          {/* Guest Comments moderation */}
          <Route path="comments" element={<Comments />} />

          {/* Contact inquiries inbox */}
          <Route path="contacts" element={<Contacts />} />

          {/* Newsletter subscribers */}
          <Route path="newsletter" element={<Newsletter />} />

          {/* CMS & UI Individual Section Pages */}
          <Route path="cms" element={<Navigate to="/cms/stats" replace />} />
          <Route path="cms/sections" element={<Navigate to="/cms/stats" replace />} />
          <Route path="cms/stats" element={<CmsStats />} />
          <Route path="cms/social-card" element={<CmsSocialCard />} />
          <Route path="cms/newsletter" element={<CmsNewsletter />} />
          <Route path="cms/about" element={<CmsAbout />} />
          <Route path="cms/contact" element={<CmsContact />} />
          <Route path="cms/theme" element={<CmsTheme />} />
        </Route>

        {/* Wildcard Fallback redirection */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}
