import { useContext, useEffect, useRef, useState } from "react";
import { FaBars, FaCode, FaTimes } from "react-icons/fa";
import { FiBell, FiChevronDown, FiLogOut } from "react-icons/fi";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import axios from "axios";

export const DevelopNavbar = () => {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null); 
  const profileRef = useRef(null);

  const getUserData = async () => {
    try {
      const res = await axios.get(`/user/details/${userId}`);
      setUser(res.data.data);
    } catch (err) {
      console.log("User fetch error:", err);
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "dashboard" },
    { name: "Tasks", path: `task/${userId}` },
    { name: "Bug", path: `bugs/${userId}` },
    { name: "Reports", path: "reports" },
  ];

  useEffect(() => {
    if (userId) {
      getUserData();
    }

    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* --- TOP WHITE HEADER --- */}
      <header className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-[60]">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-[#71dd37] rounded-lg flex items-center justify-center text-white text-xl shadow-sm">
            <FaCode />
          </div>
          <div className="hidden sm:block">
            <h4 className="text-xl font-bold text-slate-800 leading-none">DevTrack</h4>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">Developer Panel</span>
          </div>
        </div>

        {/* Right Section Tools */}
        <div className="flex items-center gap-4">
          
          {/* Notification */}
          <div className="relative p-2 text-slate-400 hover:text-[#71dd37] cursor-pointer transition-colors">
            <FiBell size={20} />
            <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </div>

          <div className="h-8 w-px bg-slate-200 mx-1"></div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              className="flex items-center gap-3 focus:outline-none group"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
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
              <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-xl shadow-xl z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-800">{user?.name || "Developer"}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-tight">Developer Access</p>
                </div>

                <div className="p-1">

                  <Link
                    to={`setting/${userId}`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    Settings
                  </Link>

                  <hr className="my-1 border-slate-100" />

                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    onClick={handleLogout}
                  >
                    <FiLogOut /> Logout
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
          
          {/* Desktop Nav Links */}
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

          {/* Mobile Toggle Button */}
          <button
            className="md:hidden ml-auto text-slate-300 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile Menu Content */}
        {menuOpen && (
          <div className="md:hidden bg-[#191c24] border-t border-slate-800 px-6 py-4 space-y-4 shadow-xl">
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