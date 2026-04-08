import { useContext, useEffect, useRef, useState } from "react";
import { FaBug, FaUserCircle, FaBars, FaTimes, FaCheckDouble } from "react-icons/fa";
import { FiChevronDown, FiLogOut, FiSettings, FiUser, FiBell, FiInbox } from "react-icons/fi";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import axios from "axios";

export const TesterNavbar = () => {
  const { userId, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false); // ✅ Notification State

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]); // ✅ Notifications List
  const [unreadCount, setUnreadCount] = useState(0); // ✅ Badge Count
  const [loading, setLoading] = useState(true);

  const profileRef = useRef(null);
  const notificationRef = useRef(null); // ✅ Ref for outside click

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
      console.log("User fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getNotifications = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`/notification/all/${userId}`);
      setNotifications(res.data.data || []);
    } catch (err) { console.log("Fetch error:", err); }
  };

  const getUnreadCount = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`/notification/user/${userId}/unread-count`);
      setUnreadCount(res.data.count || 0);
    } catch (err) { console.log("Count error:", err); }
  };

  // ─── NOTIFICATION ACTIONS ───
  const handleNotificationClick = async (n) => {
    if (!n) return;
    try {
      // 1. Mark as read in DB if unread
      if (!n.isRead) {
        await axios.put(`/notification/${n._id}/read`);
      }

      // 2. UI Refresh
      setNotificationOpen(false);
      getUnreadCount();

      // 3. Navigation based on Notification Type/Content
      const title = (n.title || "").toLowerCase();
      const type = n.type || "";

      if (type.includes("BUG") || title.includes("bug")) {
        navigate(`bug/${userId}`);
      } else if (type.includes("TASK") || title.includes("task")) {
        navigate(`task/${userId}`);
      } else {
        navigate(`dashboard/${userId}`);
      }
    } catch (err) { console.error("Nav error:", err); }
  };

  const markAllRead = async () => {
    try {
      await axios.put(`/notification/user/${userId}/read-all`);
      getNotifications();
      setUnreadCount(0);
    } catch (err) { console.log(err); }
  };

  useEffect(() => {
    if (userId) {
      getUser();
      getUnreadCount();
    }
  }, [userId]);

  // 🔹 Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(e.target)) setNotificationOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── TOP WHITE HEADER (BRANDING) ── */}
      <header className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-[60]">
        
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`dashboard/${userId}`)}>
          <div className="h-9 w-9 bg-[#71dd37] rounded-lg flex items-center justify-center text-white text-xl shadow-sm">
            <FaBug />
          </div>
          <div className="hidden sm:block">
            <h4 className="text-xl font-bold text-slate-800 leading-none tracking-tight">BugTrack</h4>
            <span className="text-[10px] uppercase tracking-widest text-[#71dd37] font-bold mt-1">Tester Panel</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          
          {/* 🔔 NOTIFICATION DROPDOWN */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                if (!notificationOpen) getNotifications();
              }}
              className="relative p-2 text-slate-400 hover:text-[#71dd37] transition-all"
            >
              <FiBell size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-rose-500 text-white text-[9px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[80] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><FiInbox className="text-[#71dd37]" /> Updates</h3>
                  {notifications.length > 0 && (
                    <button onClick={markAllRead} className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter hover:underline">
                       Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-[380px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 text-sm italic">No new notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n._id} 
                        onClick={() => handleNotificationClick(n)}
                        className={`p-4 border-b border-slate-50 transition-all cursor-pointer hover:bg-slate-50 ${!n.isRead ? 'bg-indigo-50/40 border-l-4 border-l-[#71dd37]' : 'opacity-80'}`}
                      >
                        <p className={`text-sm leading-tight pr-4 ${!n.isRead ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                          {n.title || "Alert"}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 italic">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          {/* Profile Section */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 focus:outline-none group"
            >
              <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-200 flex-shrink-0 flex items-center justify-center text-slate-400 group-hover:ring-[#71dd37] transition-all">
                {user?.image ? (
                  <img src={user.image} alt="profile" className="h-full w-full object-cover" />
                ) : (
                  <FaUserCircle size={24} />
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-slate-700 leading-none group-hover:text-[#71dd37] transition-colors">
                  {loading ? "Loading..." : user?.name || "Account"}
                </p>
              </div>
              <FiChevronDown className={`text-slate-400 text-xs transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-60 bg-white border border-slate-100 rounded-xl shadow-xl z-[70] overflow-hidden p-1.5 animate-in fade-in zoom-in-95">
                <div className="p-4 bg-slate-50 rounded-lg mb-1">
                  <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email || "Tester Access"}</p>
                </div>
                <div className="p-1">
                  <Link to={`setting/${userId}`} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-sky-50 rounded-lg transition-colors" onClick={() => setProfileOpen(false)}>
                    <FiSettings size={14} /> Settings
                  </Link>
                  <hr className="my-1 border-slate-100" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── DARK NAVIGATION BAR (LINKS) ── */}
      <nav className="bg-[#191c24] sticky top-[61px] z-50">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between h-12">
          <ul className="hidden md:flex items-center gap-8 h-full">
            {navLinks.map((link, index) => (
              <li key={index} className="h-full flex items-center">
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `h-full flex items-center px-1 text-[11px] font-bold uppercase tracking-widest border-b-2 transition-all duration-200
                    ${isActive ? "text-[#71dd37] border-[#71dd37]" : "text-slate-400 border-transparent hover:text-white"}`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
          <button className="md:hidden ml-auto p-2 text-slate-300" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-[#191c24] border-t border-slate-800 px-6 py-4 space-y-4">
            {navLinks.map((link, index) => (
              <NavLink key={index} to={link.path} className={({ isActive }) => `block text-xs font-bold uppercase tracking-tighter ${isActive ? "text-[#71dd37]" : "text-slate-400"}`} onClick={() => setMenuOpen(false)}>
                {link.name}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <main className="p-0">
        <Outlet />
      </main>
    </div>
  );
};
