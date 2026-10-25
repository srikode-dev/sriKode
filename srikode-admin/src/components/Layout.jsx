import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  BarChart2, 
  FileText, 
  Video, 
  MessageSquare, 
  Mail, 
  Send, 
  LogOut, 
  User, 
  Menu, 
  X,
  PanelsTopLeft,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Share2,
  PhoneCall,
  Palette,
  Megaphone,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore.js";

export default function Layout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cmsOpen, setCmsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem("srikode_admin_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("srikode_admin_sidebar_collapsed", String(next));
      } catch (err) {
        // localStorage fallback
      }
      return next;
    });
  };

  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
    { name: "Blogs", href: "/blogs", icon: FileText },
    { 
      name: "CMS", 
      icon: PanelsTopLeft, 
      subItems: [
        { name: "Landing Stats", href: "/cms/stats", icon: BarChart3 },
        { name: "Sponsors & Ads", href: "/cms/sponsors", icon: Megaphone },
        { name: "Social Card", href: "/cms/social-card", icon: Share2 },
        { name: "Newsletter", href: "/cms/newsletter", icon: Mail },
        { name: "About Page", href: "/cms/about", icon: User },
        { name: "Contact Details", href: "/cms/contact", icon: PhoneCall },
        { name: "Theme Colors", href: "/cms/theme", icon: Palette },
      ]
    },
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
    if (location.pathname === "/cms/stats") return "CMS — Landing Stats";
    if (location.pathname === "/cms/sponsors") return "CMS — Sponsors & Ads";
    if (location.pathname === "/cms/social-card") return "CMS — Social Card";
    if (location.pathname === "/cms/newsletter") return "CMS — Newsletter CTA";
    if (location.pathname === "/cms/about") return "CMS — About Page";
    if (location.pathname === "/cms/contact") return "CMS — Contact Details";
    if (location.pathname === "/cms/theme") return "CMS — Theme Colors";
    if (location.pathname.startsWith("/cms")) return "CMS Management";
    const current = menuItems.find(item => item.href === location.pathname);
    if (current) return current.name;
    if (location.pathname.startsWith("/blogs/new")) return "Create New Blog";
    if (location.pathname.startsWith("/blogs/edit") || location.pathname.includes("/edit")) return "Edit Blog Post";
    return "Admin Panel";
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* ── DESKTOP SIDEBAR ─────────────────────────────────────── */}
      <aside 
        className={`hidden md:flex flex-col bg-slate-900 text-slate-300 shadow-xl border-r border-slate-800 transition-all duration-300 ease-in-out shrink-0 select-none z-20 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Brand & Collapse Toggle */}
        <div className="flex h-16 items-center border-b border-slate-800 bg-slate-950 px-4">
          {!isCollapsed ? (
            <div className="flex w-full items-center justify-between">
              <Link to="/" className="flex items-center gap-2.5 overflow-hidden hover:opacity-90 transition-opacity">
                <img src="/srikode-logo-dark.svg" alt="SriKode" className="h-8 w-auto object-contain" />
                <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-bold text-blue-400 border border-blue-500/20">
                  ADMIN
                </span>
              </Link>
              <button
                type="button"
                onClick={toggleSidebar}
                title="Collapse sidebar"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex w-full items-center justify-center">
              <button
                type="button"
                onClick={toggleSidebar}
                title="Expand sidebar"
                className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 shadow-md shadow-blue-600/10 hover:border-blue-500/50 hover:scale-105 transition cursor-pointer"
              >
                <img src="/favicon.png" alt="SriKode" className="h-7 w-7 object-contain group-hover:hidden" />
                <PanelLeftOpen className="hidden group-hover:block h-5 w-5 text-blue-400" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-1.5 px-3 py-5 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon;

            // Group: CMS Submenu
            if (item.subItems) {
              const isGroupActive = location.pathname.startsWith("/cms");
              
              if (isCollapsed) {
                // Collapsed CMS icon with hover flyout
                return (
                  <div key={item.name} className="group relative">
                    <button
                      type="button"
                      onClick={() => navigate("/cms/stats")}
                      className={`relative flex h-11 w-full items-center justify-center rounded-xl transition duration-200 cursor-pointer ${
                        isGroupActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {/* Active indicator dot */}
                      {isGroupActive && (
                        <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-white ring-2 ring-blue-600" />
                      )}
                    </button>

                    {/* Floating Flyout Submenu on Hover */}
                    <div className="absolute left-full top-0 ml-3 hidden min-w-[210px] rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-2xl z-50 group-hover:block">
                      <div className="px-3 py-1.5 border-b border-slate-800/80 mb-1">
                        <p className="text-xs font-bold text-white uppercase tracking-wider">CMS Management</p>
                      </div>
                      <div className="space-y-0.5">
                        {item.subItems.map((sub) => {
                          const isSubActive = location.pathname.startsWith(sub.href);
                          const SubIcon = sub.icon;
                          return (
                            <Link
                              key={sub.name}
                              to={sub.href}
                              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${
                                isSubActive
                                  ? "bg-blue-600 text-white font-bold"
                                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
                              }`}
                            >
                              <SubIcon className="h-4 w-4 shrink-0" />
                              <span className="truncate">{sub.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              // Expanded CMS Accordion
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setCmsOpen(!cmsOpen)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold rounded-xl transition duration-200 cursor-pointer ${
                      isGroupActive
                        ? "bg-slate-800 text-white font-bold"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 shrink-0 ${isGroupActive ? "text-blue-400" : "text-slate-400"}`} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {cmsOpen ? (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {cmsOpen && (
                    <div className="pl-6 space-y-1 pt-0.5">
                      {item.subItems.map((sub) => {
                        const isSubActive = location.pathname.startsWith(sub.href);
                        const SubIcon = sub.icon;
                        return (
                          <Link
                            key={sub.name}
                            to={sub.href}
                            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition duration-200 ${
                              isSubActive
                                ? "bg-blue-600 text-white shadow-xs font-bold"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                          >
                            <SubIcon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{sub.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Normal Top-Level Menu Items
            const isActive = location.pathname === item.href || 
                             (item.href !== "/" && location.pathname.startsWith(item.href));

            if (isCollapsed) {
              return (
                <div key={item.name} className="group relative">
                  <Link
                    to={item.href}
                    className={`flex h-11 w-full items-center justify-center rounded-xl transition duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>

                  {/* Floating tooltip on hover */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden items-center rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white shadow-2xl border border-slate-800 whitespace-nowrap z-50 group-hover:flex pointer-events-none">
                    {item.name}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/10 font-bold"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout Bottom */}
        <div className="border-t border-slate-800 p-3 bg-slate-950/40">
          {!isCollapsed ? (
            <div>
              <div className="flex items-center gap-3 mb-3 px-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700/50">
                  <User className="h-5 w-5" />
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user?.name || "Admin"}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || "admin@srikode.dev"}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 py-2.5 text-xs font-semibold text-slate-400 transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div 
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700/50"
                title={`${user?.name || "Admin"} (${user?.email || "admin@srikode.dev"})`}
              >
                <User className="h-5 w-5" />
              </div>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-slate-400 transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── MOBILE DRAWER NAVIGATION ───────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="flex w-72 flex-col bg-slate-900 shadow-xl border-r border-slate-800">
            {/* Header */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <img src="/srikode-logo-dark.svg" alt="SriKode" className="h-7 w-auto object-contain" />
                <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-bold text-blue-400 border border-blue-500/20">
                  ADMIN
                </span>
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
                const Icon = item.icon;

                if (item.subItems) {
                  const isGroupActive = location.pathname.startsWith("/cms");
                  return (
                    <div key={item.name} className="space-y-1">
                      <div
                        className={`flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl ${
                          isGroupActive
                            ? "bg-slate-800 text-white font-bold"
                            : "text-slate-400"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${isGroupActive ? "text-blue-400" : "text-slate-400"}`} />
                          <span>{item.name}</span>
                        </div>
                      </div>

                      <div className="pl-6 space-y-1 pt-0.5">
                        {item.subItems.map((sub) => {
                          const isSubActive = location.pathname.startsWith(sub.href);
                          const SubIcon = sub.icon;
                          return (
                            <Link
                              key={sub.name}
                              to={sub.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition duration-200 ${
                                isSubActive
                                  ? "bg-blue-600 text-white"
                                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
                              }`}
                            >
                              <SubIcon className="h-3.5 w-3.5" />
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                const isActive = location.pathname === item.href ||
                                 (item.href !== "/" && location.pathname.startsWith(item.href));
                
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
                  <p className="text-sm font-bold text-white">{user?.name || "Admin"}</p>
                  <p className="text-xs text-slate-500">{user?.email || "admin@srikode.dev"}</p>
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
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 shadow-xs z-10 shrink-0">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden transition cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktop Sidebar Toggle */}
            <button
              type="button"
              onClick={toggleSidebar}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden md:flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer border border-transparent hover:border-slate-200"
            >
              {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </button>

            <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight leading-none truncate">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Backend Connected
            </span>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold text-slate-700 hidden sm:inline-block">
                {user?.name || "Admin"}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold shadow-sm">
                {(user?.name || "Admin")[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Router Outlet content injection */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
