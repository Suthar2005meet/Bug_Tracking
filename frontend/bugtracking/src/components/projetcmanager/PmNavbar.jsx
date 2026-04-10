import { useContext, useEffect, useRef, useState } from "react";
import { FaBars, FaBug, FaTimes, FaCheckDouble } from "react-icons/fa";
import { FiChevronDown, FiLogOut, FiSettings, FiBell, FiInbox } from "react-icons/fi";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { NotificationDropdown } from "../common/NotificationDropdown";

export const PmNavbar = () => {
    const { userId, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const [user, setUser] = useState(null);

    const profileRef = useRef(null);

    const navLinks = [
        { name: "Dashboard", path: `dashboard/${userId}` },
        { name: "Projects", path: "projects" },
        { name: "Manage Bugs", path: "bugs" },
        { name: "User Management", path: `user/${userId}` },
    ];

    // ─── API CALLS ───
    const getUser = async () => {
        if (!userId) return;
        try {
            const res = await axios.get(`/user/details/${userId}`);
            setUser(res.data.data);
        } catch (err) { console.error(err); }
    };

    // Replaced by NotificationContext

    useEffect(() => {
        getUser();
    }, [userId]);

    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        logout();
        toast.info("Logged out safely");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* ─── HEADER ─── */}
            <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 px-6 py-3 flex items-center justify-between sticky top-0 z-[60]">
                
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate(`dashboard/${userId}`)}>
                    <div className="h-10 w-10 bg-gradient-to-br from-[#71dd37] to-[#5bbd2b] rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-green-100 transition-all group-hover:rotate-6">
                        <FaBug />
                    </div>
                    <div>
                        <p className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase">BugTrack</p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#71dd37] font-black mt-1">PM Control</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* 🔔 Notifications */}
                    <NotificationDropdown role="projectmanager" />

                    <div className="h-8 w-px bg-slate-200 mx-1"></div>

                    {/* 👤 Profile */}
                    <div className="relative" ref={profileRef}>
                        <button
                            className="flex items-center gap-3 p-1 rounded-full border border-transparent hover:border-slate-200 hover:bg-white transition-all shadow-none hover:shadow-sm"
                            onClick={() => setProfileOpen(!profileOpen)}
                        >
                            <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white ring-1 ring-slate-200 shadow-sm flex-shrink-0">
                                {user?.image ? (
                                    <img src={user.image} alt="profile" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-[#191c24] text-white font-bold text-xs">PM</div>
                                )}
                            </div>
                            <div className="hidden md:block text-left mr-1">
                                <p className="text-xs font-black text-slate-800 leading-none truncate w-24">{user?.name || "Manager"}</p>
                                <p className="text-[9px] text-[#71dd37] font-black uppercase mt-1 tracking-wider">Lead PM</p>
                            </div>
                            <FiChevronDown className={`text-slate-400 text-xs transition-transform duration-300 ${profileOpen ? "rotate-180" : ""}`} />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-4 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[70] p-2 animate-in fade-in zoom-in-95">
                                <div className="px-4 py-3 mb-2 bg-slate-50 rounded-xl">
                                    <p className="text-xs font-black text-slate-800 truncate">{user?.name}</p>
                                    <p className="text-[10px] text-slate-400 truncate tracking-tight">{user?.email}</p>
                                </div>
                                <Link to={`setting/${userId}`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-[#71dd37]/10 hover:text-[#71dd37] rounded-xl transition-colors font-medium" onClick={() => setProfileOpen(false)}>
                                    <FiSettings size={16} /> Admin Settings
                                </Link>
                                <hr className="my-1 border-slate-50" />
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 rounded-xl transition-colors font-medium mt-1"
                                >
                                    <FiLogOut size={16} /> Terminate Session
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* ─── DARK NAVIGATION ─── */}
            <nav className="bg-[#191c24] border-b border-slate-800 sticky top-[65px] z-50 shadow-lg shadow-slate-900/10">
                <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
                    <ul className="hidden md:flex items-center gap-10 h-full">
                        {navLinks.map((link, index) => (
                            <li key={index} className="h-full">
                                <NavLink
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `h-full flex items-center text-[10px] font-black uppercase tracking-[0.2em] transition-all relative
                                        ${isActive ? "text-[#71dd37]" : "text-slate-500 hover:text-white"}`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {link.name}
                                            {isActive && (
                                                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#71dd37] rounded-t-full" />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                    </button>
                </div>
                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden bg-[#1f222c] px-6 py-4 border-t border-slate-800 space-y-3 animate-in fade-in slide-in-from-top-2">
                        {navLinks.map((link, index) => (
                            <NavLink 
                                key={index} 
                                to={link.path} 
                                className={({ isActive }) => `block text-[11px] font-black uppercase tracking-widest py-2 ${isActive ? "text-[#71dd37]" : "text-slate-400"}`} 
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>
                )}
            </nav>

            {/* ─── PAGE CONTENT ─── */}
            <main className="p-8">
                <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};