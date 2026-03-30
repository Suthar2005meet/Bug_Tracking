    import { useEffect, useRef, useState } from "react";
import { FaBars, FaBug, FaTimes } from "react-icons/fa";
import { FiChevronDown, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { NavLink, Outlet } from "react-router-dom";

    export const PmNavbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const navLinks = [
        { name: "Dashboard",       path: "dashboard" },
        { name: "Projects",        path: "projects" },
        { name: "Manage Bugs",     path: "bugs" },
        { name: "User Management", path: "user" },
    ];

    // Close profile dropdown on outside click
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

        <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">

                {/* Logo */}
                <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-white shadow-sm shadow-sky-200">
                    <FaBug className="text-sm" />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-800 leading-none">BugTrack</p>
                    <p className="text-[10px] text-slate-400 tracking-wider uppercase mt-0.5">PM Panel</p>
                </div>
                </div>

                {/* Desktop Nav Links */}
                <ul className="hidden md:flex items-center gap-1">
                {navLinks.map((link, index) => (
                    <li key={index}>
                    <NavLink
                        to={link.path}
                        className={({ isActive }) =>
                        `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                        ${isActive
                            ? "bg-sky-50 text-sky-600"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        }`
                        }
                    >
                        {({ isActive }) => (
                        <>
                            {link.name}
                            {isActive && (
                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-sky-500" />
                            )}
                        </>
                        )}
                    </NavLink>
                    </li>
                ))}
                </ul>

                {/* Right side — Profile */}
                <div className="hidden md:flex items-center gap-3">

                {/* Notification dot */}
                <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-sky-300 hover:text-sky-500 transition-all duration-150">
                    🔔
                    <span className="absolute -right-1 -top-1 h-3.5 w-3.5 flex items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">3</span>
                </button>

                {/* Profile dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 hover:border-sky-300 hover:bg-sky-50 transition-all duration-150"
                    >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-500 text-xs font-bold text-white">
                        P
                    </div>
                    <span className="text-xs font-semibold text-slate-700">PM User</span>
                    <FiChevronDown className={`text-slate-400 text-xs transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                    </button>

                    {profileOpen && (
                    <div className="absolute right-0 top-12 w-44 rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 py-1.5 overflow-hidden">
                        <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-semibold text-slate-700">PM User</p>
                        <p className="text-[10px] text-slate-400">Project Manager</p>
                        </div>
                        <button className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <FiUser className="text-slate-400" /> Profile
                        </button>
                        <button className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <FiSettings className="text-slate-400" /> Settings
                        </button>
                        <div className="h-px bg-slate-100 my-1" />
                        <button className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors">
                        <FiLogOut /> Logout
                        </button>
                    </div>
                    )}
                </div>
                </div>

                {/* Mobile hamburger */}
                <button
                className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                >
                {menuOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
                </button>
            </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
            <div className="md:hidden border-t border-slate-100 bg-white px-4 pb-4 pt-3">
                <ul className="space-y-1">
                {navLinks.map((link, index) => (
                    <li key={index}>
                    <NavLink
                        to={link.path}
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) =>
                        `flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150
                        ${isActive
                            ? "bg-sky-50 text-sky-600"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        }`
                        }
                    >
                        {link.name}
                    </NavLink>
                    </li>
                ))}
                </ul>

                {/* Mobile profile row */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-500 text-xs font-bold text-white">
                    P
                    </div>
                    <div>
                    <p className="text-xs font-semibold text-slate-700">PM User</p>
                    <p className="text-[10px] text-slate-400">Project Manager</p>
                    </div>
                </div>
                <button className="text-xs text-red-500 font-medium hover:text-red-600 transition-colors">
                    Logout
                </button>
                </div>
            </div>
            )}
        </nav>

        {/* Page content */}
        <main>
            <Outlet />
        </main>
        </div>
    );
    };