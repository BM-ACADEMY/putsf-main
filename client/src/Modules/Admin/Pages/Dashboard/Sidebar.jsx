// src/Modules/Admin/components/Sidebar.jsx

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HiMenu,
  HiX,
  HiPhotograph,
  HiNewspaper,
  HiViewGrid,
  HiClipboardList,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/admin/banner", label: "Banner", icon: <HiViewGrid /> },
    { to: "/admin/gallery", label: "Gallery", icon: <HiPhotograph /> },
    { to: "/admin/blogs", label: "Blogs", icon: <HiNewspaper /> },
    { to: "/admin/license", label: "Memberships", icon: <HiClipboardList /> },
    { to: "/admin/complaints", label: "Complaints", icon: <HiOutlineExclamationCircle /> },
  ];

  return (
    <>
      {/* 📱 Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-12 h-10 rounded-lg bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] text-white font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
        >
          {isOpen ? (
            <HiX size={22} className="text-white" />
          ) : (
            <HiMenu size={22} className="text-white" />
          )}
        </button>
      </div>

      {/* 🧭 Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0D1117] text-white flex flex-col justify-between 
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl z-[50]`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-gray-800 text-center bg-gradient-to-r from-[#0033A0]/80 via-[#D62828]/70 to-[#000000]/90 shadow-inner">
          <h1 className="text-lg font-bold tracking-wide text-white">
            PUTSF Admin
          </h1>
          <p className="text-xs text-gray-300 mt-1">Management Panel</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              onClick={() => setIsOpen(false)} // auto close on click (mobile)
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
                ${
                  isActive
                    ? "bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 text-center text-xs text-gray-500 border-t border-gray-800 bg-[#0D1117]">
          © {new Date().getFullYear()} PUTSF
        </div>
      </aside>

      {/* 📱 Overlay when sidebar open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[40] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
