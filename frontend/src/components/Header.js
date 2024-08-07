import React, { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Calculate the line's width as a percentage of scroll
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercentage =
    scrollableHeight > 0 ? scrollPosition / scrollableHeight : 0;
  const lineWidth = scrollPercentage * 100; // Convert to percentage for width

  return (
    <>
      <header className="bg-white shadow-sm fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-800">
            <Link to="/">
              <img
                src={logo}
                alt="Company Logo"
                className="w-32 h-auto object-contain"
              />
            </Link>
          </div>
          <nav className="hidden md:flex flex-1 justify-center space-x-6">
            <Link to="/" className="text-gray-800 hover:text-blue-500">
              Home
            </Link>
            <Link to="/services" className="text-gray-800 hover:text-blue-500">
              Services
            </Link>
            <Link to="/about" className="text-gray-800 hover:text-blue-500">
              About
            </Link>
            <Link to="/contact" className="text-gray-800 hover:text-blue-500">
              Contact
            </Link>
          </nav>
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-800 focus:outline-none"
          >
            {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
        {/* Scroll line */}
        <div
          className="fixed top-[calc(100% - 1px)] left-0 h-1 bg-slate-500"
          style={{
            width: `${lineWidth}%`,
            transition: "width 0.3s linear",
          }}
        />
      </header>
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-2">
            <Link
              to="/"
              className="block py-2 text-gray-800 hover:bg-gray-100 text-center"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="block py-2 text-gray-800 hover:bg-gray-100 text-center"
            >
              Services
            </Link>
            <Link
              to="/about"
              className="block py-2 text-gray-800 hover:bg-gray-100 text-center"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-gray-800 hover:bg-gray-100 text-center"
            >
              Contact
            </Link>
          </div>
        </nav>
      )}
    </>
  );
};

export default Header;
