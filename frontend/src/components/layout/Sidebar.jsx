import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, ClipboardList, Users, Settings, LogOut } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/boards",    label: "Boards",    icon: ClipboardList },
  { path: "/teams",     label: "Teams",     icon: Users },
  { path: "/settings",  label: "Settings",  icon: Settings },
];

export default function Sidebar() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside
      style={{
        width: "240px",
        minWidth: "240px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        borderRight: darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0",
        backgroundColor: darkMode ? "#0f172a" : "#ffffff",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            P
          </div>
          <span
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: darkMode ? "#ffffff" : "#0f172a",
            }}
          >
            Planova
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.15s",
                background: isActive
                  ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                  : "transparent",
                color: isActive
                  ? "#ffffff"
                  : darkMode ? "#94a3b8" : "#64748b",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = darkMode ? "#1e293b" : "#f8fafc";
                  e.currentTarget.style.color = darkMode ? "#ffffff" : "#0f172a";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = darkMode ? "#94a3b8" : "#64748b";
                }
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div
        style={{
          padding: "12px",
          borderTop: darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 14px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color: darkMode ? "#f87171" : "#ef4444",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = darkMode ? "rgba(239,68,68,0.1)" : "#fef2f2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}