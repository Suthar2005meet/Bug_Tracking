import { useContext, useEffect, useRef, useState } from "react";
import { FaBars, FaBug, FaTimes, FaCheckDouble, FaInbox } from "react-icons/fa";
import { FiChevronDown, FiLogOut, FiSettings, FiBell } from "react-icons/fi";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import { AuthContext } from "../../AuthProvider";
import axios from "axios";

export const PmNavbar = () => {
    const { userId } = useContext(AuthContext);
    const navigate = useNavigate(); // ✅ Initialize navigate

    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);

    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const profileRef = useRef(null);
    const notificationRef = useRef(null);

    const navLinks = [
        { name: "Dashboard", path: "dashboard" },
        { name: "Projects", path: "projects" },
        { name: "Manage Bugs", path: "bugs" },
        { name: "User Management", path: "user" },
    ];

    // ✅ API CALLS
    const getUser = async () => {
        if (!userId) return;
        try {
            const res = await axios.get(`/user/details/${userId}`);
            setUser(res.data.data);
        } catch (err) { console.log(err); }
    };

    const getNotifications = async () => {
        if (!userId) return;
        try {
            const res = await axios.get(`http://localhost:2500/notification/all/${userId}`);
            setNotifications(res.data.data || []);
        } catch (err) { console.log(err); }
    };

    const getCount = async () => {
        if (!userId) return;
        try {
            const res = await axios.get(`http://localhost:2500/notification/user/${userId}/unread-count`);
            setUnreadCount(res.data.count || 0);
        } catch (err) { console.log(err); }
    };

    const markAllRead = async () => {
        try {
            await axios.put(`http://localhost:2500/notification/user/${userId}/read-all`);
            getNotifications();
            setUnreadCount(0);
        } catch (err) { console.log(err); }
    };

    // ✅ SMART NAVIGATION & READ LOGIC
    const handleNotificationClick = async (n) => {
        if (!n) return;
        try {
            // 1. Mark as read in DB if unread
            if (!n.isRead) {
                await axios.put(`http://localhost:2500/notification/${n._id}/read`);
            }

            // 2. UI Refresh
            setNotificationOpen(false);
            getCount();

            // 3. Navigation based on Notification Type Enum
            const type = n.type;
            const title = (n.title || "").toLowerCase();

            switch (type) {
                case "BUG_ASSIGNED":
                case "BUG_STATUS_CHANGED":
                case "BUG_COMMENTED":
                case "BUG_UPDATED":
                    navigate(`bugs`); // Path to bug management
                    break;

                case "PROJECT_ADDED":
                case "SPRINT_ADDED":
                    navigate(`projects`); // Path to project list
                    break;

                case "TASK_ASSIGNED":
                case "TASK_COMPLETED":
                case "TASK_STATUS_CHANGED":
                    navigate(`dashboard`); // General dashboard or task view
                    break;

                case "USER_ADDED":
                case "USER_UPDATED":
                    navigate(`user`); // User management
                    break;

                default:
                    // Fallback to title keywords if type is generic
                    if (title.includes("bug")) navigate(`bugs`);
                    else if (title.includes("project")) navigate(`projects`);
                    else navigate(`dashboard`);
            }
        } catch (err) {
            console.error("Navigation error:", err);
        }
    };

    useEffect(() => {
        getUser();
        getCount();
    }, [userId]);

    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
            if (notificationRef.current && !notificationRef.current.contains(e.target)) setNotificationOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* ================= HEADER ================= */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-3 flex items-center justify-between sticky top-0 z-[60]">

                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("dashboard")}>
                    <div className="h-10 w-10 bg-gradient-to-br from-[#71dd37] to-[#5bbd2b] rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-green-100 group-hover:scale-105 transition-transform">
                        <FaBug />
                    </div>
                    <div>
                        <p className="text-xl font-black text-slate-800 tracking-tight leading-none">BugTrack</p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#71dd37] font-bold mt-1">PM Control Center</p>
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    {/* 🔔 Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => {
                                setNotificationOpen(!notificationOpen);
                                getNotifications();
                            }}
                            className="relative p-2.5 text-slate-400 hover:text-[#71dd37] bg-slate-50 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-100 hover:shadow-sm"
                        >
                            <FiBell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 h-5 w-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white ring-2 ring-rose-100 animate-bounce">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {notificationOpen && (
                            <div className="absolute right-0 mt-4 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[80] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                                    <span className="font-bold text-slate-700 text-sm">Updates</span>
                                    <button onClick={markAllRead} className="text-[10px] text-indigo-600 font-bold flex items-center gap-1 hover:underline">
                                        <FaCheckDouble /> Clear All
                                    </button>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-slate-400 text-xs">No new messages</div>
                                    ) : (
                                        notifications.map((n, i) => (
                                            <div 
                                                key={i} 
                                                onClick={() => handleNotificationClick(n)} // ✅ Click handler added
                                                className={`p-4 border-b border-slate-50 transition-all cursor-pointer hover:bg-slate-50 group relative
                                                ${!n.isRead ? 'bg-indigo-50/40 border-l-4 border-l-[#71dd37]' : 'opacity-80'}`}
                                            >
                                                <p className={`text-sm leading-tight pr-4 ${!n.isRead ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                                                    {n.title || "Alert"}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 italic">{n.message}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 👤 Profile */}
                    <div className="relative" ref={profileRef}>
                        <button
                            className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                            onClick={() => setProfileOpen(!profileOpen)}
                        >
                            <div className="h-9 w-9 rounded-full p-0.5 bg-gradient-to-tr from-[#71dd37] to-blue-400 shadow-md shadow-blue-50">
                                <div className="h-full w-full rounded-full bg-white overflow-hidden">
                                    {user?.image ? (
                                        <img src={user.image} alt="profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-sm">P</div>
                                    )}
                                </div>
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-xs font-bold text-slate-800 leading-none">{user?.name || "Manager"}</p>
                                <p className="text-[9px] text-slate-400 font-medium uppercase mt-1">PM</p>
                            </div>
                            <FiChevronDown className={`text-slate-400 text-xs transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-3 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl z-[70] p-1.5 animate-in fade-in zoom-in-95">
                                <div className="px-4 py-3 mb-1 border-b border-slate-50">
                                    <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                                </div>
                                <Link to={`setting/${userId}`} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors">
                                    <FiSettings size={14} /> Settings
                                </Link>
                                <button 
                                    onClick={() => { localStorage.removeItem("token"); navigate("/"); }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 rounded-xl transition-colors mt-1"
                                >
                                    <FiLogOut size={14} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* ================= DARK NAV ================= */}
            <nav className="bg-[#191c24] border-b border-slate-800 sticky top-[65px] z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
                    <ul className="hidden md:flex items-center gap-10 h-full">
                        {navLinks.map((link, index) => (
                            <li key={index} className="h-full">
                                <NavLink
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `h-full flex items-center text-[10px] font-black uppercase tracking-[0.15em] transition-all relative
                                        ${isActive ? "text-[#71dd37]" : "text-slate-500 hover:text-white"}`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {link.name}
                                            {isActive && (
                                                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#71dd37] to-transparent rounded-full" />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    <button className="md:hidden text-slate-400 hover:text-white transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </button>
                </div>
            </nav>

            {/* ================= PAGE CONTENT ================= */}
            <main className="p-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};