import { useContext, useEffect, useRef, useState } from "react";
import { FaBars, FaCode, FaTimes } from "react-icons/fa";
import { FiChevronDown, FiLogOut, FiSettings } from "react-icons/fi";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { NotificationDropdown } from "../common/NotificationDropdown";
import { motion, AnimatePresence } from "framer-motion";

export const DevelopNavbar = () => {
  const { userId, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const profileRef = useRef(null);

  const getUserData = async () => {
    try {
      const res = await axios.get(`/user/details/${userId}`);
      setUser(res.data.data);
    } catch (err) {
      console.error("User fetch error:", err);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    navigate("/");
  };

  useEffect(() => {
    if (userId) getUserData();
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userId]);

  const navLinks = [
    { name: "Dashboard", path: `dashboard/${userId}` },
    { name: "Tasks", path: `task/${userId}` },
    { name: "Bug", path: `bugs/${userId}` },
    { name: "Settings", path: `setting/${userId}` },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* ─── SINGLE HEADER BAR (Merged) ─── */}
      <header className="bg-[#0c1020] backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-[100] px-4 md:px-8">
        <div className="max-w-6xl mx-auto h-[72px] flex items-center justify-between">
          
          {/* Logo (Left side) */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate(`dashboard/${userId}`)}>
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/20 transition-all group-hover:rotate-6 group-hover:scale-110">
              <FaCode />
            </div>
            <div className="hidden sm:block">
              <h4 className="text-base font-extrabold text-white tracking-tight leading-none">DevTrack</h4>
              <span className="text-[9px] uppercase font-bold text-blue-400 tracking-[0.2em]">Engineering</span>
            </div>
          </div>

          {/* ─── CENTERED LINKS (Desktop) ─── */}
          <ul className="hidden md:flex items-center gap-8 h-full flex-1 justify-center">
            {navLinks.map((link, index) => (
              <li key={index} className="h-full flex items-center relative">
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `text-[10px] font-bold uppercase tracking-[0.18em] transition-all flex items-center px-1 py-1
                    ${isActive ? "text-blue-400" : "text-slate-500 hover:text-white"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && (
                        <motion.span
                          layoutId="dev-nav-indicator"
                          className="absolute -bottom-3 left-0 w-full h-[2px] bg-gradient-to-r from-blue-400 to-violet-500 rounded-t-full"
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Actions & Profile (Right side) */}
          <div className="flex items-center gap-3">
            <NotificationDropdown role="developer" />
            <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block"></div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center gap-2 p-1.5 rounded-full border border-transparent hover:border-white/10 hover:bg-white/[0.04] transition-all"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white/10 shadow-sm">
                  {user?.image ? (
                    <img src={user.image} alt="user" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-violet-600 text-white font-bold text-sm">
                      {user?.name?.charAt(0) || "D"}
                    </div>
                  )}
                </div>
                <div className="hidden md:block text-left mr-1">
                  <p className="text-xs font-bold text-white leading-none truncate w-24">
                    {user?.name || "Developer"}
                  </p>
                </div>
                <FiChevronDown className={`text-slate-500 text-xs transition-transform duration-300 ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 mt-3 w-60 bg-[#141a2e]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl z-[70] p-2"
                  >
                    <div className="p-3 bg-white/[0.03] rounded-xl mb-2 flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-tight">Developer Access</p>
                      </div>
                    </div>
                    <Link to={`setting/${userId}`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:bg-white/[0.04] hover:text-blue-400 rounded-xl transition-colors" onClick={() => setProfileOpen(false)}>
                      <FiSettings size={16} /> Settings
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-1" onClick={handleLogout}>
                      <FiLogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger Button (Mobile Only) */}
            <button className="md:hidden text-slate-400 hover:text-white transition-colors p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* ─── MOBILE LINKS (Dropdown Menu) ─── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden absolute top-[71px] left-0 w-full overflow-hidden bg-[#0f1424] border-b border-white/[0.06] z-40"
            >
              <div className="px-6 py-4 space-y-2">
                {navLinks.map((link, index) => (
                  <NavLink
                    key={index}
                    to={link.path}
                    className={({ isActive }) => `block text-[11px] font-bold uppercase tracking-widest py-2.5 px-3 rounded-lg transition-all ${isActive ? "text-blue-400 bg-blue-500/10" : "text-slate-500 hover:text-white hover:bg-white/[0.03]"}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="p-4 md:p-6 lg:p-8 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};