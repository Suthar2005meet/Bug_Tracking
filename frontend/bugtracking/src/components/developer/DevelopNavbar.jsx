import { useContext, useEffect, useRef, useState } from "react";
import { FaBars, FaCode, FaTimes, FaCheckDouble } from "react-icons/fa";
import { FiBell, FiChevronDown, FiLogOut, FiSettings, FiInbox, FiActivity } from "react-icons/fi";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";

export const DevelopNavbar = () => {
  const { userId, logout } = useContext(AuthContext);
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
    } catch (err) {
      console.error("User fetch error:", err);
    }
  };

  const getNotifications = async () => {
    try {
      const res = await axios.get(`/notification/all/${userId}`);
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  };

  const getUnreadCount = async () => {
    try {
      const res = await axios.get(`/notification/user/${userId}/unread-count`);
      setUnreadCount(res.data.count || 0);
    } catch (err) {
      console.error("Unread count error:", err);
    }
  };

  // ─── NAVIGATION & READ LOGIC ───
  const handleNotificationClick = async (notification) => {
    if (!notification) return;

    try {
      // 1. Mark as read
      if (!notification.isRead) {
        await axios.put(`/notification/${notification._id}/read`);
        getUnreadCount(); // Refresh count immediately
      }

      setNotificationOpen(false);

      // 2. Smart Redirection based on Notification Data
      if (notification.type?.includes("BUG") || notification.bug) {
        navigate(`bugs/${userId}`);
      } else if (notification.type?.includes("TASK") || notification.task) {
        navigate(`task/${userId}`);
      } else {
        // Fallback redirection logic
        const title = (notification.title || "").toLowerCase();
        const message = (notification.message || "").toLowerCase();
        if (title.includes("bug") || message.includes("bug")) navigate(`bugs/${userId}`);
        else navigate(`task/${userId}`);
      }
    } catch (err) {
      console.error("Navigation error:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`/notification/user/${userId}/read-all`);
      getNotifications();
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to clear notifications");
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
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                if (!notificationOpen) getNotifications();
              }}
              className={`relative p-2.5 rounded-full transition-all duration-300 ${notificationOpen ? 'bg-green-50 text-[#71dd37]' : 'text-slate-400 hover:bg-slate-100'}`}
            >
              <FiBell size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-5 w-5 bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-4 w-80 md:w-[420px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-[80] overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-white">
                  <h3 className="text-base font-bold text-slate-800">Notifications</h3>
                  {notifications.length > 0 && (
                    <button onClick={markAllAsRead} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded">
                      <FaCheckDouble size={10} /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-[420px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                      <FiInbox className="mx-auto mb-3 opacity-20" size={48} />
                      <p className="text-sm font-medium">Your inbox is empty</p>
                    </div>
                  ) : (
                    notifications.map((n, i) => (
                      <div 
                        key={i} 
                        onClick={() => handleNotificationClick(n)}
                        className={`p-4 border-b border-slate-50 transition-all cursor-pointer hover:bg-slate-50 flex gap-3 relative
                          ${!n.isRead ? 'bg-green-50/30 border-l-4 border-l-[#71dd37]' : 'bg-white opacity-80'}`}
                      >
                        <div className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-xs shadow-sm
                          ${n.type?.includes('BUG') ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                          {n.sender?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${n.type?.includes('BUG') ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                              {n.type?.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium italic">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className={`text-sm leading-snug ${!n.isRead ? 'font-bold text-slate-800' : 'text-slate-600'}`}>
                            {n.sender?.name} <span className="font-normal text-slate-500">{n.message}</span>
                          </p>
                          {n.bug && (
                            <div className="mt-2 text-[10px] bg-white/60 p-2 rounded border border-slate-100 text-slate-500 italic">
                              Bug: {n.bug.title}
                            </div>
                          )}
                        </div>
                        {!n.isRead && <div className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 bg-[#71dd37] rounded-full shadow-sm"></div>}
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