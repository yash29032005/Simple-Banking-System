import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-secondary px-6 shadow-lg flex justify-between items-center border-b border-gray-800 h-[70px]">
      {/* LOGO */}
      <div className="text-white text-xl font-bold tracking-wide flex items-center gap-2">
        <div className="bg-ternary w-12 h-10 flex items-center justify-center rounded-md text-white font-bold text-lg">
          SBS
        </div>
      </div>

      {/* USER DROPDOWN */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdown(!dropdown)}
          className="text-white bg-ternary px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span className="font-medium">{user?.name || "User"}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transition-transform ${
              dropdown ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {dropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-ternary border border-ternary rounded-lg shadow-lg animate-fade-down">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
