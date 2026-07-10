import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

// Components
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Pages
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Blogs from "./pages/Blogs.jsx";
import BlogEditor from "./pages/BlogEditor.jsx";
import Videos from "./pages/Videos.jsx";
import Comments from "./pages/Comments.jsx";
import Contacts from "./pages/Contacts.jsx";
import Newsletter from "./pages/Newsletter.jsx";

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
      <Toaster position="top-right" />
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
        </Route>

        {/* Wildcard Fallback redirection */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}
