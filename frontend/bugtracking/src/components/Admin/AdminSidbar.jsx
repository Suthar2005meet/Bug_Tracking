import { useState } from "react";
import { FaBars, FaBox, FaCog, FaTachometerAlt, FaUsers } from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";

export const AdminSidebar = () => {

  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
    { name: "Users", path: "/admin/user", icon: <FaUsers /> },
    { name: "Bugs", path: "/admin/Bug", icon: <FaBox /> },
    { name: "Projects", path:'/admin/project', icon: <FaBox/>},
    { name: "Settings", path: "/admin/settings", icon: <FaCog /> },
  ];

  return (
    <div className="flex">

      {/* Sidebar */}
      <div className={`bg-gray-900 text-white h-screen p-5 pt-8 duration-300 ${isOpen ? "w-64" : "w-20"}`}>
        
        {/* Toggle Button */}
        <div className="flex justify-between items-center">
          <h1 className={`text-xl font-bold duration-200 ${!isOpen && "scale-0"}`}>
            Admin
          </h1>
          <FaBars 
            className="cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>

        {/* Menu Items */}
        <ul className="mt-8 space-y-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-x-4 p-2 rounded-md cursor-pointer hover:bg-gray-700 transition ${
                    isActive ? "bg-gray-700" : ""
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span className={`${!isOpen && "hidden"} origin-left duration-200`}>
                  {item.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>

      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-10">
        <Outlet/>
      </div>
          
    </div>
  );
};