import axios from "axios";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import {
  FaBox,
  FaBug,
  FaCog,
  FaSignOutAlt,
  FaUsers,
} from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import { NotificationDropdown } from "../common/NotificationDropdown";
import { FaBars, FaTimes } from "react-icons/fa"; // Added icons
import { AnimatePresence } from "framer-motion"; // Added AnimatePresence

export const AdminSidebar = () => {
  const { userId, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false); // Added mobile state
  const [adminData, setAdminData] = useState(null);

  // Fetch Admin Data
  const fetchAdminDetails = async () => {
    try {
      const res = await axios.get(`/user/details/${userId}`);
      setAdminData(res.data.data);
    } catch (err) {
      console.error("Error fetching admin details:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchAdminDetails();
  }, [userId]);

  const menuItems = [
    {
      name: "Dashboard",
      path: `/admin/dashboard/${userId ?? ""}`,
      icon: <RxDashboard />,
    },
    { name: "Users", path: "/admin/user", icon: <FaUsers /> },
    { name: "Bugs", path: "/admin/bug", icon: <FaBug /> },
    { name: "Projects", path: "/admin/project", icon: <FaBox /> },
    {
      name: "Settings",
      path: `/admin/setting/${userId ?? ""}`,
      icon: <FaCog />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#060912] text-slate-300 relative">
      {/* ─── MOBILE TOGGLE BUTTON ─── */}
      <div className="lg:hidden fixed top-6 left-6 z-[200]">
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-3 bg-[#0c1020] border border-white/10 rounded-xl text-cyan-400 shadow-xl backdrop-blur-md"
        >
          {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      {/* ─── UNIFIED SIDEBAR ─── */}
      <aside
        className={`fixed lg:sticky top-0 h-screen transition-all duration-500 ease-in-out border-r border-white/[0.05] bg-[#0c1020] z-[150] 
          ${isOpen ? "w-72" : "w-20"} 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Top Header: Logo + Notifications */}
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <motion.div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <FaBug size={20} />
              </div>
              {(isOpen || mobileOpen) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h1 className="text-sm font-black text-white tracking-tighter uppercase leading-none">
                    BugTrack
                  </h1>
                  <span className="text-[9px] text-cyan-400 font-bold tracking-[0.2em] uppercase">
                    Engine v2
                  </span>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Unified Notification Area inside Sidebar
          <div className={`flex items-center gap-3 bg-white/[0.03] p-2 rounded-2xl border border-white/[0.05] ${!isOpen && "justify-center"}`}>
            <NotificationDropdown role="admin" />
            {isOpen && <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alerts</span>}
          </div> */}
        </div>
        <div className="h-px mx-6 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
          {(isOpen || mobileOpen) && (
            <p className="px-4 mb-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
              Core Access
            </p>
          )}
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 border border-transparent ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
                    : "hover:bg-white/[0.03] hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`text-lg transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                  >
                    {item.icon}
                  </span>
                  {(isOpen || mobileOpen) && (
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {item.name}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Footer: Profile & Logout */}
        <div className="p-4 mt-auto">
          <div
            className={`bg-white/[0.03] border border-white/[0.08] rounded-[24px] p-3 transition-all ${!isOpen && "flex justify-center"}`}
          >
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                {adminData?.image ? (
                  <img
                    src={adminData.image}
                    alt="User"
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-cyan-400">
                    {adminData?.name?.charAt(0) || "A"}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0c1020] rounded-full" />
              </div>

              {(isOpen || mobileOpen) && (
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-black text-white truncate uppercase tracking-tighter">
                    {adminData?.name || "Admin"}
                  </p>
                  <p className="text-[9px] text-cyan-400/60 font-bold uppercase tracking-widest">
                    Super Admin
                  </p>
                </div>
              )}
            </div>

            {(isOpen || mobileOpen) && (
              <button
                onClick={() => logout()}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-widest transition-all border border-red-500/10"
              >
                <FaSignOutAlt size={12} /> Logout System
              </button>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex w-full mt-4 py-2 justify-center text-slate-600 hover:text-cyan-400 transition-colors"
          >
            <div
              className={`h-1 w-8 bg-current rounded-full transition-all ${isOpen ? "opacity-30" : "w-4 opacity-100"}`}
            />
          </button>
        </div>
      </aside>

      {/* ─── MOBILE OVERLAY ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[140] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Dynamic Breadcrumb */}
        <div className="px-6 md:px-10 pt-10 md:pt-8 pb-4">
          {/* <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            <span>Root</span>
            <span className="text-slate-800">   /   </span>
            <span className="text-cyan-400/80">   Admin   </span>
            <span className="text-slate-800">/</span>
            <span className="text-white">Active Session</span>
            <div className="margin-left-1000">
            <div className={`flex  items-center gap-3 bg-white/[0.03] p-2 rounded-2xl border border-white/[0.05] ${!isOpen && "justify-center"}`}>
            <NotificationDropdown role="admin" />
            {isOpen && <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alerts</span>}
          </div>
          </div>
          </nav> */}

          <nav className="flex flex-col md:flex-row md:items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 w-full">
            {/* Left Side: Breadcrumbs */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Root</span>
              <span className="hidden sm:inline text-slate-800">/</span>
              <span className="text-cyan-400/80">Admin</span>
              <span className="text-slate-800">/</span>
              <span className="text-white">Active Session</span>
            </div>

            {/* FLEX SPACER: This pushes the next element to the right */}
            <div className="flex-1" />

            {/* Right Side: Alerts / Notifications */}
            <div
              className={`flex items-center gap-3 bg-white/[0.03] p-2 rounded-2xl border border-white/[0.05] ${(isOpen || mobileOpen) ? "justify-start" : "justify-center"}`}
            >
              <NotificationDropdown role="admin" />
              {(isOpen || mobileOpen) && (
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Alerts
                </span>
              )}
            </div>
          </nav>
        </div>

        <div className="flex-1 p-6 md:p-10 overflow-y-auto no-scrollbar">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
