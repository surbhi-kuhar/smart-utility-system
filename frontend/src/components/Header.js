import React, { useState, useEffect, useCallback } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import logo from "../images/logo.png";
import axios from "axios";
import { FaUser } from "react-icons/fa"; // Import an icon for the Profile button

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const fetchUserType = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      if (!token) return;

      // Check if userType is already stored
      const cachedUserType = localStorage.getItem("userType");
      if (cachedUserType) {
        setUserType(cachedUserType);
        return;
      }

      // Try fetching user data
      try {
        await axios.get("http://localhost:3300/api/v1/user/find", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserType("user");
        localStorage.setItem("userType", "user");
        return;
      } catch (error) {
        if (error.response && error.response.status !== 401) {
          console.error("Error fetching user type", error);
        }
      }

      // Try fetching provider data
      try {
        await axios.get("http://localhost:3300/api/v1/serviceprovider/find", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserType("serviceprovider");
        localStorage.setItem("userType", "serviceprovider");
      } catch (error) {
        if (error.response && error.response.status !== 401) {
          console.error("Error fetching user type", error);
        }
      }
    } catch (error) {
      console.error("Unexpected error", error);
    }
  }, []);

  const checkLoginStatus = useCallback(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
    if (token) fetchUserType();
    else {
      setUserType(null);
      localStorage.removeItem("userType");
    }
  }, [fetchUserType]);

  useEffect(() => {
    checkLoginStatus();

    // Cleanup any side effects
    return () => {
      localStorage.removeItem("userType");
    };
  }, [checkLoginStatus]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercentage =
    scrollableHeight > 0 ? scrollPosition / scrollableHeight : 0;
  const lineWidth = scrollPercentage * 100;

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
            {isLoggedIn ? (
              <>
                {/* Profile icon for large screens */}
                <Link
                  to={userType === "user" ? "/profile/user" : "/profile/provider"}
                  className="text-gray-800 hover:text-blue-500 ml-auto flex items-center"
                >
                  <FaUser size={24} className="rounded-full bg-gray-200 p-2" />
                </Link>
              </>
            ) : (
              <Link to="/login" className="text-gray-800 hover:text-blue-500">
                Login
              </Link>
            )}
          </nav>
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-800 focus:outline-none"
          >
            {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
        <div
          className="fixed top-[calc(100% - 1px)] left-0 h-1 bg-slate-500"
          style={{
            width: `${lineWidth}%`,
            transition: "width 0.3s linear",
          }}
        />
      </header>
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 absolute top-[60px] left-0 w-full z-40">
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
            {isLoggedIn ? (
              <Link
                to={userType === "user" ? "/profile/user" : "/profile/provider"}
                className="block py-2 text-gray-800 hover:bg-gray-100 text-center"
              >
                Profile
              </Link>
            ) : (
              <Link
                to="/login"
                className="block py-2 text-gray-800 hover:bg-gray-100 text-center"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      )}
    </>
  );
};

export default Header;
