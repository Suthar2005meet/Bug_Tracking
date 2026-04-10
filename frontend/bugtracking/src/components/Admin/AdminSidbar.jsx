import { useContext, useState } from "react";
import { FaBars, FaBox, FaBug, FaChevronRight, FaCog, FaUsers } from "react-icons/fa";
import { FaDatabase } from "react-icons/fa6";
import { Link, NavLink, Outlet } from "react-router-dom";
import { NotificationDropdown } from "../common/NotificationDropdown";
import { AuthContext } from "../../AuthProvider";

export const AdminSidebar = () => {
  const { userId } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", path: `/admin/dashboard/${userId ?? ""}`,icon: <FaDatabase />,                badge: null },
    { name: "Users",     path: "/admin/user",     icon: <FaUsers />,         badge: null },
    { name: "Bugs",      path: "/admin/bug",      icon: <FaBug />,           badge: null },
    { name: "Projects",  path: "/admin/project",  icon: <FaBox />,           badge: null },
    { name: "Settings",  path: `/admin/setting/${userId ?? ""}`, icon: <FaCog />, badge: null },
  ];

  return (
    <div className="flex min-h-screen">

      {/* ── SIDEBAR ── */}
      <div
        className={`relative flex flex-col h-screen sticky top-0 duration-300
          bg-gradient-to-b from-blue-600 via-indigo-700 to-violet-800
          shadow-2xl shadow-indigo-900/40
          ${isOpen ? "w-64" : "w-[72px]"}`}
      >

        {/* Grid texture */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px] rounded-r-none" />

        {/* Glow blob top */}
        <div className="pointer-events-none absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl" />

        {/* ── LOGO ROW ── */}
        <div className="relative flex items-center justify-between px-5 pt-7 pb-2">
          <div className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${!isOpen ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white text-sm shadow-inner">
              <FaBug />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-white leading-none">BugTrack</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-blue-200/60 mt-0.5">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white/70 transition-all hover:bg-white/20 hover:text-white"
          >
            <FaBars className="text-sm" />
          </button>
        </div>

        {/* Divider */}
        <div className="relative mx-4 mb-3 mt-4 h-px bg-white/10" />

        {/* ── NAV LABEL ── */}
        {isOpen && (
          <p className="relative px-5 mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-blue-200/50">
            Navigation
          </p>
        )}

        {/* ── MENU ITEMS ── */}
        <ul className="relative flex-1 px-3 space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `group relative flex items-center gap-x-3 rounded-xl px-3 py-2.5 transition-all duration-200
                  ${isActive
                    ? "bg-white/20 text-white shadow-lg shadow-black/10"
                    : "text-blue-100/75 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active left bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    )}

                    {/* Icon */}
                    <span className={`shrink-0 text-sm transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                      {item.icon}
                    </span>

                    {/* Label */}
                    <span className={`flex-1 font-mono text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${!isOpen ? "hidden" : ""}`}>
                      {item.name}
                    </span>

                    {/* Badge */}
                    {item.badge && isOpen && (
                      <span className="rounded-full bg-red-500 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white shadow-md shadow-red-900/30 animate-pulse">
                        {item.badge}
                      </span>
                    )}

                    {/* Chevron */}
                    {isOpen && (
                      <FaChevronRight className={`text-[10px] transition-all duration-200 ${isActive ? "text-white/80 translate-x-0.5" : "text-white/20 group-hover:text-white/50"}`} />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* ── BOTTOM SECTION ── */}
        <div className="relative mx-3 mb-5">
          <div className="h-px bg-white/10 mb-4" />

          {/* User card */}
          <div className={`flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5 transition-all duration-300 ${!isOpen ? "justify-center" : ""}`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 font-black text-xs text-white shadow-md shadow-orange-900/30">
              A
            </div>
            {isOpen && (
              <div className="overflow-hidden">
                <p className="truncate font-mono text-xs font-bold text-white">Admin User</p>
                <p className="font-mono text-[9px] text-blue-200/60 tracking-wide">Super Admin</p>
              </div>
            )}
          </div>

          {/* Version */}
          {isOpen && (
            <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-blue-200/30">
              v2.4.1 · Bug Tracker
            </p>
          )}
        </div>

      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-100 via-blue-50/40 to-indigo-50/60">

        {/* Top navbar strip */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-8 py-3 backdrop-blur-sm shadow-sm shadow-blue-100/40">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Admin · <Link to={`/admin/dashboard/${userId ?? ""}`} >Dashboard</Link>
          </p>
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <NotificationDropdown role="admin" />
            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 font-black text-xs text-white shadow-md shadow-indigo-200">
              A
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>

      </div>

    </div>
  );
};
