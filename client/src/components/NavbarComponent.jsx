import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const NavbarComponent = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    }

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <nav className="bg-white/20 backdrop-blur-md shadow-md p-4 flex justify-between items-center border-b border-gray-300 relative">
      {/* Left Section - Branding */}
      <h1 className="text-2xl font-bold text-black tracking-wide">Admin Dashboard</h1>

      {/* Right Section - User Info */}
      <div className="flex items-center gap-6 relative">
        {/* Welcome Message */}
        <span className="font-semibold text-black text-lg">Welcome, {user?.name}</span>

        {/* Profile Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-black hover:bg-white/20 transition-all duration-300"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.121 17.804A10.978 10.978 0 0012 21a10.978 10.978 0 006.879-3.196M4.75 9a4.75 4.75 0 119.5 0 4.75 4.75 0 01-9.5 0z"
            />
          </svg>
          Profile
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-full text-white hover:bg-red-700 transition-all duration-300 shadow-lg"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m4.5-3H9m10.5 0l-3-3m3 3l-3 3"
            />
          </svg>
          Logout
        </button>

        {/* Profile Sidebar */}
        {isSidebarOpen && (
          <div
            ref={sidebarRef}
            className="absolute top-14 right-0 w-64 bg-gray-800 text-white shadow-lg rounded-lg p-4 transition-all duration-300"
          >
            <h3 className="text-lg font-bold">Profile</h3>
            <p className="text-sm">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
            <Link
              to="/profile"
              className="block mt-4 bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              View Profile
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarComponent;
