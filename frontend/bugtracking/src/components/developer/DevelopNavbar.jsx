import { useContext, useEffect, useRef, useState } from "react";
import { FaBars, FaCode, FaTimes, FaCheckDouble } from "react-icons/fa";
import { FiBell, FiChevronDown, FiLogOut, FiSettings, FiInbox } from "react-icons/fi";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import axios from "axios";

export const DevelopNavbar = () => {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // ─── API CALLS ───
  const getUserData = async () => {
    try {
      const res = await axios.get(`/user/details/${userId}`);
      setUser(res.data.data);
    } catch (err) { console.log("User fetch error:", err); }
  };

  const getNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:2500/notification/all/${userId}`);
      setNotifications(res.data.data || []);
    } catch (err) { console.log("Notification fetch error:", err); }
  };

  const getUnreadCount = async () => {
    try {
      const res = await axios.get(`http://localhost:2500/notification/user/${userId}/unread-count`);
      setUnreadCount(res.data.count || 0);
    } catch (err) { console.log("Unread count error:", err); }
  };

  // ─── NAVIGATION & READ LOGIC ───
  const handleNotificationClick = async (notification) => {
    if (!notification) return; // Guard clause

    try {
      // 1. Mark as read
      if (!notification.isRead) {
        await axios.put(`http://localhost:2500/notification/${notification._id}/read`);
      }
      
      // 2. Refresh count and close panel
      getUnreadCount();
      setNotificationOpen(false);

      // 3. Smart Redirection (FIXED with optional chaining and fallbacks)
      const title = (notification.title || "").toLowerCase();
      const message = (notification.message || "").toLowerCase();

      if (title.includes("bug") || message.includes("bug")) {
        navigate(`bugs/${userId}`);
      } else if (title.includes("task") || message.includes("task")) {
        navigate(`task/${userId}`);
      } else if (title.includes("comment") || message.includes("comment")) {
        navigate(`task/${userId}`);
      }
    } catch (err) {
      console.log("Navigation error:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`http://localhost:2500/notification/user/${userId}/read-all`);
      getNotifications();
      setUnreadCount(0);
    } catch (err) { console.log(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    if (userId) {
      getUserData();
      getUnreadCount();
    }
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(e.target)) setNotificationOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userId]);

  const navLinks = [
    { name: "Dashboard", path: "dashboard" },
    { name: "Tasks", path: `task/${userId}` },
    { name: "Bug", path: `bugs/${userId}` },
    { name: "Reports", path: "reports" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-[60]">
        
        <div 
          className="flex items-center gap-3 group cursor-pointer" 
          onClick={() => navigate("dashboard")}
        >
          <div className="h-9 w-9 bg-gradient-to-br from-[#71dd37] to-[#5bbd2b] rounded-lg flex items-center justify-center text-white text-xl shadow-lg shadow-green-100 transition-transform group-hover:scale-105">
            <FaCode />
          </div>
          <div className="hidden sm:block">
            <h4 className="text-xl font-bold text-slate-800 leading-none">DevTrack</h4>
            <span className="text-[10px] uppercase tracking-widest text-[#71dd37] font-bold">Developer Panel</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                if (!notificationOpen) getNotifications();
              }}
              className="relative p-2 text-slate-400 hover:text-[#71dd37] hover:bg-slate-50 rounded-full transition-all duration-200"
            >
              <FiBell size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-5 w-5 bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[80] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <FiInbox className="text-[#71dd37]" /> Updates
                  </h3>
                  {notifications.length > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 uppercase"
                    >
                      <FaCheckDouble /> Clear All
                    </button>
                  )}
                </div>

                <div className="max-h-[380px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center text-slate-400">
                      <FiBell className="mx-auto mb-2 opacity-20" size={40} />
                      <p className="text-sm font-medium">No new alerts</p>
                    </div>
                  ) : (
                    notifications.map((n, i) => (
                      <div 
                        key={i} 
                        onClick={() => handleNotificationClick(n)}
                        className={`p-4 border-b border-slate-50 transition-all cursor-pointer hover:bg-slate-50 group relative
                          ${!n.isRead ? 'bg-indigo-50/40 border-l-4 border-l-[#71dd37]' : 'opacity-80'}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-sm leading-tight pr-4 ${!n.isRead ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                            {n.title || "No Title"}
                          </p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap italic">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 italic group-hover:text-slate-700">
                          {n.message || "No message content."}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-slate-200 mx-1"></div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              className="flex items-center gap-2 md:gap-3 p-1 pr-2 rounded-full hover:bg-slate-50 transition-all group"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-200">
                {user?.image ? (
                  <img src={user.image} alt="user" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-indigo-500 text-white font-bold text-sm">
                    {user?.name?.charAt(0) || "D"}
                  </div>
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-slate-700 leading-none group-hover:text-[#71dd37] transition-colors">
                  {user?.name || "Developer"}
                </p>
              </div>
              <FiChevronDown className={`text-slate-400 text-xs transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-xl shadow-xl z-[70] overflow-hidden p-1.5 animate-in fade-in zoom-in-95">
                <div className="p-3 bg-slate-50 rounded-lg mb-1">
                  <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Dev Access</p>
                </div>
                <Link to={`setting/${userId}`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors" onClick={() => setProfileOpen(false)}>
                  <FiSettings size={14} /> Settings
                </Link>
                <hr className="my-1 border-slate-100" />
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" onClick={handleLogout}>
                  <FiLogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- NAV BAR --- */}
      <nav className="bg-[#191c24] border-b border-slate-800 sticky top-[61px] z-50">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <ul className="hidden md:flex items-center gap-8 h-full">
            {navLinks.map((link, index) => (
              <li key={index} className="h-full flex items-center">
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `text-[11px] font-bold uppercase tracking-widest transition-all h-full flex items-center px-2 border-b-2
                    ${isActive 
                      ? "text-[#71dd37] border-[#71dd37]" 
                      : "text-slate-400 border-transparent hover:text-white"}`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};