import { useContext, useEffect, useRef, useState } from "react";
import { FaBars, FaCode, FaTimes, FaCheckDouble } from "react-icons/fa";
import { FiBell, FiChevronDown, FiLogOut, FiSettings, FiInbox, FiActivity } from "react-icons/fi";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { NotificationDropdown } from "../common/NotificationDropdown";

export const DevelopNavbar = () => {
  const { userId, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [user, setUser] = useState(null);

  const profileRef = useRef(null);

  // ─── API CALLS ───
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
    if (userId) {
      getUserData();
    }
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
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ─── TOP HEADER ─── */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-[60] shadow-sm">
        
        {/* Logo Section */}
        <div 
          className="flex items-center gap-3 group cursor-pointer" 
          onClick={() => navigate(`dashboard/${userId}`)}
        >
          <div className="h-10 w-10 bg-gradient-to-br from-[#71dd37] to-[#5bbd2b] rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-green-100 transition-all group-hover:rotate-6 group-hover:scale-110">
            <FaCode />
          </div>
          <div className="hidden sm:block">
            <h4 className="text-xl font-black text-slate-800 tracking-tight leading-none">DevTrack</h4>
            <span className="text-[10px] uppercase font-bold text-[#71dd37] tracking-[0.2em]">Engineering</span>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3">
          
          {/* Notification Dropdown */}
          <NotificationDropdown role="developer" />

          <div className="h-8 w-px bg-slate-200 mx-1"></div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-all group border border-transparent hover:border-slate-200"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-200">
                {user?.image ? (
                  <img src={user.image} alt="user" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-[#71dd37] text-white font-bold text-sm">
                    {user?.name?.charAt(0) || "D"}
                  </div>
                )}
              </div>
              <div className="hidden md:block text-left mr-1">
                <p className="text-sm font-bold text-slate-700 leading-none truncate w-24">
                  {user?.name || "Developer"}
                </p>
              </div>
              <FiChevronDown className={`text-slate-400 text-xs transition-transform duration-300 ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-4 w-60 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[70] p-2 animate-in fade-in zoom-in-95">
                <div className="p-3 bg-slate-50 rounded-xl mb-2 flex items-center gap-3">
                   <div className="h-10 w-10 bg-[#71dd37] rounded-full flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0)}
                   </div>
                   <div className="overflow-hidden">
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Developer Access</p>
                   </div>
                </div>
                <Link to={`setting/${userId}`} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#71dd37] rounded-xl transition-colors" onClick={() => setProfileOpen(false)}>
                  <FiSettings size={16} /> Settings
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-500 hover:bg-rose-50 rounded-xl transition-colors mt-1" onClick={handleLogout}>
                  <FiLogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── SECONDARY NAVIGATION ─── */}
      <nav className="bg-[#191c24] border-b border-slate-800 sticky top-[65px] z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center">
          <ul className="flex items-center gap-8 h-full overflow-x-auto no-scrollbar">
            {navLinks.map((link, index) => (
              <li key={index} className="h-full flex items-center">
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `text-[11px] font-black uppercase tracking-[0.15em] transition-all h-full flex items-center px-1 border-b-[3px]
                    ${isActive 
                      ? "text-[#71dd37] border-[#71dd37]" 
                      : "text-slate-500 border-transparent hover:text-white hover:border-slate-600"}`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="p-6 lg:p-10">
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
};