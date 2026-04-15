import { useContext, useEffect, useRef, useState } from "react";
import { FaBug, FaBars, FaTimes } from "react-icons/fa";
import { FiChevronDown, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { NotificationDropdown } from "../common/NotificationDropdown";
import { motion, AnimatePresence } from "framer-motion";

export const TesterNavbar = () => {
  const { userId, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef(null);

  const navLinks = [
    { name: "Dashboard", path: `dashboard/${userId}` },
    { name: "Tasks", path: `task/${userId}` },
    { name: "All Bugs", path: `bug/${userId}` },
  ];

  const getUser = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`/user/details/${userId}`);
      setUser(res.data.data);
    } catch (err) {
      console.error("User fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    navigate("/");
  };

  useEffect(() => {
    if (userId) getUser();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* ── CONSOLIDATED HEADER ── */}
      <header className="bg-[#0c1020] backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-[100] px-4 md:px-8">
        <div className="max-w-6xl mx-auto h-[70px] flex items-center justify-between gap-4">
          
          {/* LEFT: Logo */}
          <div className="flex items-center gap-3 cursor-pointer group flex-shrink-0" onClick={() => navigate(`dashboard/${userId}`)}>
            <div className="h-10 w-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-amber-500/20 transition-transform group-hover:scale-110 group-hover:rotate-6">
              <FaBug />
            </div>
            <div className="hidden lg:block">
              <h4 className="text-base font-extrabold text-white tracking-tight leading-none">BugTrack</h4>
              <span className="text-[9px] uppercase tracking-[0.2em] text-amber-400 font-bold">Quality Assurance</span>
            </div>
          </div>

          {/* CENTER: Navigation Links (Desktop Only) */}
          <nav className="hidden md:block flex-1">
            <ul className="flex items-center justify-center gap-8 lg:gap-12">
              {navLinks.map((link, index) => (
                <li key={index} className="relative py-2">
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300
                      ${isActive ? "text-amber-400" : "text-slate-500 hover:text-white"}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.name}
                        {isActive && (
                          <motion.span
                            layoutId="tester-nav-indicator"
                            className="absolute -bottom-4 left-0 w-full h-[2px] bg-gradient-to-r from-amber-400 to-orange-500 rounded-t-full"
                            transition={{ type: "spring", stiffness: 500, damping: 35 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* RIGHT: Actions & Profile */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <NotificationDropdown role="tester" />
            <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block"></div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full border border-transparent hover:border-white/10 hover:bg-white/[0.04] transition-all"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white/10 shadow-sm flex-shrink-0">
                  {user?.image ? (
                    <img src={user.image} alt="profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
                      <FiUser size={16} />
                    </div>
                  )}
                </div>
                <div className="hidden md:block text-left mr-1">
                  <p className="text-xs font-bold text-white leading-none">
                    {loading ? "..." : (user?.name || "Tester")}
                  </p>
                </div>
                <FiChevronDown className={`text-slate-500 text-xs transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 mt-3 w-60 bg-[#141a2e]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl z-[110] p-2"
                  >
                    <div className="p-3 bg-white/[0.03] rounded-xl mb-2">
                      <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-tight">QA Verified Access</p>
                    </div>
                    <Link to={`setting/${userId}`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:bg-white/[0.04] hover:text-amber-400 rounded-xl transition-colors" onClick={() => setProfileOpen(false)}>
                      <FiSettings size={16} /> Settings
                    </Link>
                    <hr className="my-1 border-white/[0.04]" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                      <FiLogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button className="md:hidden p-2 text-slate-400 hover:text-white transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden absolute top-[70px] left-0 w-full overflow-hidden bg-[#0f1424] border-b border-white/[0.06] z-50 shadow-2xl"
            >
              <div className="px-6 py-4 space-y-2">
                {navLinks.map((link, index) => (
                  <NavLink 
                    key={index} 
                    to={link.path} 
                    className={({ isActive }) => `block py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${isActive ? "text-amber-400 bg-amber-500/10" : "text-slate-500 hover:text-white hover:bg-white/[0.03]"}`} 
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

      {/* ── MAIN CONTENT ── */}
      <main className="p-4 md:p-6 lg:p-8 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};