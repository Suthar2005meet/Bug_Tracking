import { useContext, useEffect, useRef, useState } from "react";
import { FaBars, FaBug, FaTimes } from "react-icons/fa";
import { FiChevronDown, FiLogOut, FiSettings, FiUser, FiBell } from "react-icons/fi";
import { NavLink, Outlet, Link } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import axios from "axios";

export const PmNavbar = () => {
    const { userId } = useContext(AuthContext);

    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [user, setUser] = useState(null);

    const profileRef = useRef(null);

    const navLinks = [
        { name: "Dashboard", path: "dashboard" },
        { name: "Projects", path: "projects" },
        { name: "Manage Bugs", path: "bugs" },
        { name: "User Management", path: "user" },
    ];

    // ✅ Get User Details
    const getUser = async () => {
        if (!userId) return;

        try {
            const res = await axios.get(`/user/details/${userId}`);
            setUser(res.data.data);
        } catch (err) {
            console.log("User Fetch Error:", err);
        }
    };

    useEffect(() => {
        getUser();
    }, [userId]);

    // ✅ Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* --- TOP WHITE HEADER --- */}
            <header className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-[60]">
                
                {/* Logo Section */}
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-[#71dd37] rounded-lg flex items-center justify-center text-white text-xl shadow-sm">
                        <FaBug />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-slate-800 leading-none tracking-tight">BugTrack</p>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-1">PM Panel</p>
                    </div>
                </div>

                {/* Right Side Tools */}
                <div className="flex items-center gap-4">
                    
                    {/* Notification */}
                    <button className="relative p-2 text-slate-400 hover:text-[#71dd37] transition-colors">
                        <FiBell size={20} />
                        <span className="absolute top-2 right-2 h-2 w-2 bg-pink-500 rounded-full border-2 border-white"></span>
                    </button>

                    <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button 
                            className="flex items-center gap-3 focus:outline-none group"
                            onClick={() => setProfileOpen(!profileOpen)}
                        >
                            {/* ✅ Profile Image Rendering */}
                            <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                                {user?.image ? (
                                    <img
                                        src={user.image}
                                        alt="profile"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-sky-500 text-white font-bold text-sm">
                                        {user?.name?.charAt(0) || "P"}
                                    </div>
                                )}
                            </div>
                            
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-bold text-slate-700 leading-none group-hover:text-[#71dd37] transition-colors">
                                    {user?.name || "Loading..."}
                                </p>
                            </div>
                            <FiChevronDown className={`text-slate-400 text-xs transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-xl shadow-xl z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-4 bg-slate-50 border-b border-slate-100">
                                    <p className="text-sm font-bold text-slate-800">{user?.name || "PM User"}</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-medium tracking-wider">Project Manager</p>
                                </div>

                                <div className="p-1">

                                    <Link
                                        to={`setting/${userId}`}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors"
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        <FiSettings size={14} /> Settings
                                    </Link>

                                    <hr className="my-1 border-slate-100" />

                                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                        <FiLogOut size={14} /> Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* --- DARK NAVIGATION BAR --- */}
            <nav className="bg-[#191c24] sticky top-[61px] z-50">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-12">
                    
                    {/* Desktop Links */}
                    <ul className="hidden md:flex items-center gap-8 h-full">
                        {navLinks.map((link, index) => (
                            <li key={index} className="h-full">
                                <NavLink 
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `h-full flex items-center px-1 text-[11px] font-bold uppercase tracking-widest border-b-2 transition-all duration-200
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

                    {/* Mobile Toggle */}
                    <button 
                        className="md:hidden ml-auto text-slate-300 hover:text-white transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </button>
                </div>

                {/* Mobile Menu Content */}
                {menuOpen && (
                    <div className="md:hidden bg-[#191c24] border-t border-slate-800 px-6 py-4 space-y-4">
                        {navLinks.map((link, index) => (
                            <NavLink
                                key={index}
                                to={link.path}
                                className={({ isActive }) =>
                                    `block text-xs font-bold uppercase tracking-tighter transition-colors
                                    ${isActive ? "text-[#71dd37]" : "text-slate-400"}`
                                }
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>
                )}
            </nav>

            {/* --- PAGE CONTENT --- */}
            <main className="p-6">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};