import React, { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, Link, useParams, useNavigate } from "react-router-dom";
import { FaBug, FaUserCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

export const TesterNavbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const token = localStorage.getItem("token")
  const decode = jwtDecode(token)
  console.log(decode)
  const id = decode._id

  const navLinks = [
    { name: "Dashboard", path: "dashboard" },
    { name: "All Bugs", path: "bug" },
    { name: "Create Bug", path: "createbug" },
  ];

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm shadow-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="bg-indigo-100 p-2 rounded-lg border border-indigo-200 group-hover:bg-indigo-200 group-hover:border-indigo-300 transition-all duration-300">
                <FaBug size={16} className="text-indigo-600 group-hover:text-indigo-700 transition-colors" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-800">
                Tester <span className="text-indigo-600">Panel</span>
              </span>
            </div>

            {/* Nav Links */}
            <ul className="flex items-center gap-1">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "text-indigo-700 bg-indigo-50 border border-indigo-200"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Profile */}
            <div className="flex items-center" ref={profileRef}>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all duration-200"
                >
                  <FaUserCircle size={22} className="text-indigo-500" />
                  <span className="text-sm font-medium text-slate-700">Account</span>
                  <svg
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/80 overflow-hidden z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                      <p className="text-sm font-semibold text-slate-800">John Tester</p>
                      <p className="text-xs text-slate-400 truncate">john@example.com</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link to={`/tester/profile/${id}`}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all duration-150 group"
                      >
                        <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        View Profile
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-150 group"
                      >
                        <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-100 py-1">
                      <button className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-150">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Outlet />
      </main>
    </div>
  );
};