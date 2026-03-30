import { useContext, useEffect, useRef, useState } from "react";
import { FaBars, FaCode, FaTimes } from "react-icons/fa";
import { FiBell, FiChevronDown, FiLogOut, FiSettings } from "react-icons/fi";
import { Link, NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";

export const DevelopNavbar = () => {
  const { userId } = useContext(AuthContext)
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  
  // const token = localStorage.getItem("token")
  //   const decode = jwtDecode(token)
  //   const userId = decode.userId

  const navLinks = [
    { name: "Dashboard",  path: "dashboard" },
    { name: "Project",   path: `project/${userId}` },
    { name: "Bug", path: `bugs/${userId}` },
    { name: "Reports",    path: "reports" },
  ];

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">

      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* ── LOGO ── */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500 text-white shadow-sm shadow-violet-200">
                <FaCode className="text-sm" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 leading-none">DevTrack</p>
                <p className="text-[10px] text-slate-400 tracking-wider uppercase mt-0.5">Developer Panel</p>
              </div>
            </div>

            {/* ── DESKTOP NAV ── */}
            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                      ${isActive
                        ? "bg-violet-50 text-violet-600"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.name}
                        {isActive && (
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-violet-500" />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* ── RIGHT SIDE ── */}
            <div className="hidden md:flex items-center gap-2">

              {/* Notification bell */}
              <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:border-violet-300 hover:text-violet-500 transition-all duration-150">
                <FiBell className="text-base" />
                <span className="absolute -right-1 -top-1 h-3.5 w-3.5 flex items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">5</span>
              </button>

              {/* Profile dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 hover:border-violet-300 hover:bg-violet-50 transition-all duration-150"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-purple-600 text-xs font-bold text-white">
                    D
                  </div>
                  <span className="text-xs font-semibold text-slate-700">Dev User</span>
                  <FiChevronDown className={`text-slate-400 text-xs transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-44 rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 py-1.5 overflow-hidden">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-semibold text-slate-700">Dev User</p>
                      <p className="text-[10px] text-slate-400">Developer</p>
                    </div>
                    <Link to={`/developer/profile/${userId}`}>Profile</Link>
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

            {/* ── MOBILE HAMBURGER ── */}
            <button
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FaTimes size={15} /> : <FaBars size={15} />}
            </button>

          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pb-4 pt-3">
            <ul className="space-y-1">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150
                      ${isActive
                        ? "bg-violet-50 text-violet-600"
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-purple-600 text-xs font-bold text-white">
                  D
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">Dev User</p>
                  <p className="text-[10px] text-slate-400">Developer</p>
                </div>
              </div>
              <button className="text-xs text-red-500 font-medium hover:text-red-600 transition-colors">
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── PAGE CONTENT ── */}
      <main>
        <Outlet />
      </main>

    </div>
  );
};