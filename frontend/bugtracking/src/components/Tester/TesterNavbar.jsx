import { useContext, useEffect, useRef, useState } from "react";
import { FaBug, FaUserCircle, FaBars, FaTimes, FaCheckDouble } from "react-icons/fa";
import { FiChevronDown, FiLogOut, FiSettings, FiUser, FiBell, FiInbox } from "react-icons/fi";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { NotificationDropdown } from "../common/NotificationDropdown";

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

  // ─── API CALLS ───
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
    if (userId) {
      getUser();
    }
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── TOP WHITE HEADER ── */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-[60] shadow-sm">
        
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(`dashboard/${userId}`)}>
          <div className="h-10 w-10 bg-gradient-to-br from-[#71dd37] to-[#5bbd2b] rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-green-100 transition-transform group-hover:scale-110">
            <FaBug />
          </div>
          <div className="hidden sm:block">
            <h4 className="text-xl font-black text-slate-800 tracking-tight leading-none">BugTrack</h4>
            <span className="text-[10px] uppercase tracking-widest text-[#71dd37] font-black">Quality Assurance</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          
          {/* 🔔 IMPROVED NOTIFICATION DROPDOWN */}
          <NotificationDropdown role="tester" />

          <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          {/* Profile Section */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 rounded-full border border-transparent hover:border-slate-200 transition-all group"
            >
              <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-200 flex-shrink-0">
                {user?.image ? (
                  <img src={user.image} alt="profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <FiUser size={18} />
                  </div>
                )}
              </div>
              <div className="hidden md:block text-left mr-1">
                <p className="text-sm font-extrabold text-slate-700 leading-none group-hover:text-[#71dd37] transition-colors">
                  {loading ? "..." : user?.name || "Tester"}
                </p>
              </div>
              <FiChevronDown className={`text-slate-400 text-xs transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-4 w-60 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[70] p-2 animate-in fade-in zoom-in-95">
                <div className="p-3 bg-slate-50 rounded-xl mb-2">
                  <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">QA Verified Access</p>
                </div>
                <Link to={`setting/${userId}`} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-sky-600 rounded-xl transition-colors" onClick={() => setProfileOpen(false)}>
                  <FiSettings size={16} /> Settings
                </Link>
                <hr className="my-1 border-slate-100" />
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                  <FiLogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── DARK NAV BAR ── */}
      <nav className="bg-[#191c24] sticky top-[65px] z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <ul className="hidden md:flex items-center gap-8 h-full">
            {navLinks.map((link, index) => (
              <li key={index} className="h-full flex items-center">
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `h-full flex items-center px-1 text-[11px] font-black uppercase tracking-[0.2em] border-b-[3px] transition-all duration-300
                    ${isActive ? "text-[#71dd37] border-[#71dd37]" : "text-slate-500 border-transparent hover:text-white"}`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
          <button className="md:hidden ml-auto p-2 text-slate-400" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
        
        {menuOpen && (
          <div className="md:hidden bg-[#1f222c] border-t border-slate-800 px-6 py-4 space-y-3 shadow-inner">
            {navLinks.map((link, index) => (
              <NavLink 
                key={index} 
                to={link.path} 
                className={({ isActive }) => `block py-2 text-xs font-black uppercase tracking-widest ${isActive ? "text-[#71dd37]" : "text-slate-400"}`} 
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <main className="min-h-[calc(100vh-113px)]">
        <Outlet />
      </main>
    </div>
  );
};