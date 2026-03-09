import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

export const DevelopNavbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", path: "/developer" },
    { name: "Projects", path: "projects" },
    { name: "Manage Bug", path: "bugs" },
    { name: "Reports", path: "/reports" }
  ];

  return (
    <div>
      <nav className="bg-gray-900 text-white px-6 py-4 shadow-lg">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <h1 className="text-xl font-bold">Developer Panel</h1>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6">
            {navLinks.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `hover:text-blue-400 transition ${
                      isActive ? "text-blue-400 font-semibold" : ""
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Profile Section */}
          <div className="hidden md:flex items-center space-x-4 relative">
            <FaUserCircle
              size={28}
              className="cursor-pointer"
              onClick={() => setProfileOpen(!profileOpen)}
            />

            {profileOpen && (
              <div className="absolute right-0 top-12 bg-white text-black rounded-lg shadow-lg w-40 py-2">
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Profile
                </button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Settings
                </button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            {menuOpen ? (
              <FaTimes size={22} onClick={() => setMenuOpen(false)} />
            ) : (
              <FaBars size={22} onClick={() => setMenuOpen(true)} />
            )}
          </div>

        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <ul className="md:hidden mt-4 space-y-3">
            {navLinks.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block hover:text-blue-400 ${
                      isActive ? "text-blue-400 font-semibold" : ""
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </nav>
      <div>
        <Outlet/>
      </div>
    </div>
  );
};