import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Grid,
  FileText,
  User,
  Users as UsersIcon,
  LogOut,
  Menu as MenuIcon,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar({ onCollapseChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const sidebarRef = useRef(null);

  const navItems = [
    { to: "/dashboard", icon: <Grid size={20} />, label: "Dashboard" },
    { to: "/feed", icon: <FileText size={20} />, label: "Content Feed" },
    { to: "/profile", icon: <User size={20} />, label: "Profile" },
    ...(user?.role === "admin"
      ? [{ to: "/admin", icon: <UsersIcon size={20} />, label: "Admin" }]
      : []),
  ];

  useEffect(() => {
    const onClick = (e) => {
      if (
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      onCollapseChange?.(next);
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="fixed top-0 inset-x-0 md:hidden bg-indigo-800 text-white p-4 flex justify-between items-center z-50">
        <h1 className="font-bold text-xl">CreatorHub</h1>
        <button onClick={() => setOpen(true)}>
          <MenuIcon size={24} />
        </button>
      </div>

      {/* BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          ${collapsed ? "w-20" : "w-64"}
          pt-0
        `}
      >
        {/* Collapse Button */}
        <div className="flex justify-end p-2">
          <button onClick={toggleCollapse}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 p-2 rounded hover:bg-gray-100 transition-colors ${
                  active ? "bg-indigo-100 text-indigo-600" : "text-gray-700"
                }`}
              >
                {icon}
                {!collapsed && <span className="font-medium">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2 text-gray-700 rounded hover:bg-gray-100"
          >
            <LogOut size={20} />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}
