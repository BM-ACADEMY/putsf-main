// src/Modules/Homepages/Layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../../assets/putsf-logo.jpg";

const Footer = () => {
  const menuItems = ["Home", "Gallery", "Blog", "Contact"];

  return (
    <footer className="bg-white border-t-4 border-[#D62828] w-full text-gray-700 px-6 md:px-16 lg:px-24 xl:px-32 py-12 shadow-inner">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        {/* 🟦 Logo + Description */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={Logo}
              alt="PUTSF Logo"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <span className="text-[#0033A0] font-bold text-base md:text-lg lg:text-xl leading-snug">
              Puducherry Union Territory Student's Federation
            </span>
          </Link>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            The Puducherry Union Territory Student's Federation (PUTSF) is an
            independent student organization focused on advocating for student
            rights and empowering youth leadership within the Union Territory.
          </p>
        </div>

        {/* 🟥 Quick Links */}
        <div className="flex flex-col md:items-center text-sm space-y-2.5">
          <h2 className="font-semibold mb-5 text-[#0033A0] uppercase tracking-wide">
            Quick Links
          </h2>
          {menuItems.map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="text-gray-700 hover:text-[#D62828] transition-all duration-300"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* 🖤 Join Us Button */}
        <div className="flex flex-col items-start md:items-end gap-4">
          <h2 className="font-semibold text-[#0033A0] mb-2 uppercase tracking-wide">
            Get Involved
          </h2>
          <Link
            to="/license"
            className="inline-block bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] text-white px-6 py-2 rounded-full font-semibold shadow-md hover:opacity-90 hover:scale-105 transition-all duration-300"
          >
            Join Us
          </Link>
        </div>
      </div>

      {/* Divider + Copyright */}
      <div className="border-t border-gray-200 mt-10 pt-5 text-center">
        <p className="text-gray-500 text-sm">
          Copyright © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-[#0033A0]">PUTSF</span>. All Rights Reserved.
          <br />
          Developed by{" "}
          <a
            href="https://bmtechx.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D62828] hover:underline"
          >
            bmtechx.in
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
