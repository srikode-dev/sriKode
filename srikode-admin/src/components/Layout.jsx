import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Video, 
  MessageSquare, 
  Mail, 
  Send, 
  LogOut, 
  User, 
  Menu, 
  X 
} from "lucide-react";
import { useState } from "react";
import useAuthStore from "../store/authStore.js";

export default function Layout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Blogs", href: "/blogs", icon: FileText },
    { name: "Videos", href: "/videos", icon: Video },
    { name: "Comments", href: "/comments", icon: MessageSquare },
    { name: "Contact Inbox", href: "/contacts", icon: Mail },
    { name: "Subscribers", href: "/newsletter", icon: Send },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getPageTitle = () => {
    const current = menuItems.find(item => item.href === location.pathname);
    if (current) return current.name;
    if (location.pathname.startsWith("/blogs/new")) return "Create New Blog";
    if (location.pathname.startsWith("/blogs/edit") || location.pathname.includes("/edit")) return "Edit Blog Post";
    return "CMS Panel";
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* ── DESKTOP SIDEBAR ─────────────────────────────────────── */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-slate-900 text-slate-350 shadow-xl border-r border-slate-800">
        {/* Brand */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              SK
            </div>
            <span className="text-lg font-bold text-white tracking-wider">SRIKODE</span>
          </div>
          <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
            ADMIN
          </span>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href || 
                             (item.href !== "/" && location.pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout bottom */}
        <div className="border-t border-slate-800 p-4 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300">
              <User className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.name || "Srikant Sahu"}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || "srikantsahu.dev@gmail.com"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 py-2.5 text-xs font-semibold text-slate-400 transition"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* ── MOBILE DRAWER NAVIGATION ───────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="flex w-72 flex-col bg-slate-900 shadow-xl border-r border-slate-800">
            {/* Header */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                  SK
                </div>
                <span className="text-lg font-bold text-white tracking-wider">SRIKODE</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.href ||
                                 (item.href !== "/" && location.pathname.startsWith(item.href));
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User */}
            <div className="border-t border-slate-800 p-4 bg-slate-950/40">
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{user?.name || "Srikant Sahu"}</p>
                  <p className="text-xs text-slate-500">{user?.email || "srikantsahu.dev@gmail.com"}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 py-2.5 text-xs font-semibold text-slate-400 transition"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT WORKSPACE ─────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden transition"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-850 tracking-tight leading-none">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-100">
              ⚡ Production Live Backend Connected
            </span>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold text-slate-700 hidden sm:inline-block">
                {user?.name || "Srikant Sahu"}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-sm font-bold shadow-sm">
                S
              </div>
            </div>
          </div>
        </header>

        {/* Router Outlet content injection */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
