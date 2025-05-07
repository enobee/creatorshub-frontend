// File: src/components/Sidebar.jsx
import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Grid,
  FileText,
  User,
  Users as UsersIcon,
  LogOut,
  X as CloseIcon,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar({ isVisible = true, onToggleVisibility }) {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const isMobile = window.innerWidth < 768;

  // Close sidebar on navigation in mobile view
  useEffect(() => {
    if (isMobile && onToggleVisibility && isVisible) {
      onToggleVisibility(false);
    }
  }, [pathname, isMobile]);

  const navItems = [
    { to: "/dashboard", icon: <Grid size={20} />, label: "Dashboard" },
    { to: "/feed", icon: <FileText size={20} />, label: "Content Feed" },
    { to: "/profile", icon: <User size={20} />, label: "Profile" },
    ...(user?.role === "admin"
      ? [{ to: "/admin", icon: <UsersIcon size={20} />, label: "Admin" }]
      : []),
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`
        ${
          isMobile
            ? isVisible
              ? "fixed left-0 top-0"
              : "fixed -left-full"
            : "relative"
        } 
        flex flex-col bg-white border-r border-gray-200 h-screen z-20
        transition-all duration-300 ease-in-out
        ${collapsed && !isMobile ? "w-20" : "w-64"}
      `}
    >
      {/* Header with mobile close button or desktop collapse toggle */}
      <div className="flex justify-end items-center p-2 border-b border-gray-100">
        {isMobile ? (
          <button
            onClick={() => onToggleVisibility && onToggleVisibility(false)}
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <CloseIcon size={20} />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded hover:bg-gray-100"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {navItems.map(({ to, icon, label }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 p-2 rounded hover:bg-gray-100 transition-colors ${
                isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-700"
              }`}
            >
              {icon}
              {(!collapsed || isMobile) && (
                <span className="font-medium">{label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="p-2 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-2 text-gray-700 rounded hover:bg-gray-100 transition-colors"
        >
          <LogOut size={20} />
          {(!collapsed || isMobile) && (
            <span className="font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
}
