import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../../assets/putsf-logo.jpg";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const menuItems = ["Home", "Gallery", "Blog", "Contact"];

  // ✅ Scroll-to-top helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Logo click → navigate if needed, then scroll
  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      scrollToTop();
    } else {
      navigate("/");
      setTimeout(scrollToTop, 300);
    }
  };

  // ✅ Home button click → same behavior
  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      scrollToTop();
    } else {
      navigate("/");
      setTimeout(scrollToTop, 300);
    }
  };

  return (
    <nav className="sticky top-0 z-50 h-[70px] w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between bg-white text-gray-700 shadow-[0px_4px_25px_0px_#0000000D]">
      
      {/* ✅ Logo + Text */}
      <button
        onClick={handleLogoClick}
        className="flex items-center gap-3 focus:outline-none cursor-pointer"
      >
        <img
          src={Logo}
          alt="PUTSF Logo"
          className="w-8 h-8 md:w-10 md:h-10 object-contain cursor-pointer"
        />
        <span className="text-[#0033A0] font-bold text-sm md:text-lg lg:text-xl text-left cursor-pointer">
          Puducherry Union Territory Student's Federation
        </span>
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6 font-medium">
        {menuItems.map((item) => {
          const isHome = item === "Home";
          return (
            <Link
              key={item}
              to={isHome ? "/" : `/${item.toLowerCase()}`}
              onClick={(e) => {
                if (isHome) handleHomeClick(e);
              }}
              className="px-3 py-1 rounded-lg transition-all duration-300 hover:bg-[#0033A0] hover:text-white cursor-pointer"
            >
              {item}
            </Link>
          );
        })}

        {/* Join Us Button */}
        <button
          onClick={() => navigate("/license")}
          className="ml-4 bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          Join Us
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        aria-label="menu-btn"
        type="button"
        onClick={toggleMobileMenu}
        className="md:hidden p-2 rounded active:scale-90 transition cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
        >
          <path d="M 3 7 H 27 M 3 15 H 27 M 3 23 H 27" stroke="#000" strokeWidth="2" />
        </svg>
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-white p-6 shadow-md md:hidden">
          <ul className="flex flex-col space-y-4 text-base font-medium">
            {menuItems.map((item) => {
              const isHome = item === "Home";
              return (
                <li key={item}>
                  <Link
                    to={isHome ? "/" : `/${item.toLowerCase()}`}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      if (isHome) handleHomeClick(e);
                    }}
                    className="block px-3 py-2 rounded-lg transition-all duration-300 hover:bg-[#0033A0] hover:text-white text-center cursor-pointer"
                  >
                    {item}
                  </Link>
                </li>
              );
            })}

            {/* Join Us Button (Mobile) */}
            <li className="text-center mt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/license");
                }}
                className="w-full py-2 rounded-full font-semibold text-white bg-gradient-to-r from-[#0033A0] via-[#D62828] to-[#000000] shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                Join Us
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Header;
