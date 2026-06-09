import React, { useEffect, useRef, useState } from "react";
import { Bell, Search, Moon, Sun, Menu, X, LayoutDashboard, ClipboardList, Users, Settings, LogOut } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/boards",    label: "Boards",    icon: ClipboardList },
  { path: "/teams",     label: "Teams",     icon: Users },
  { path: "/settings",  label: "Settings",  icon: Settings },
];

export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const notifRef = useRef(null);

  const NOTIFICATIONS = [
    { text: "Task assigned to you",     time: "2m ago", unread: true  },
    { text: "Board created successfully", time: "1h ago", unread: true  },
    { text: "New member joined team",   time: "3h ago", unread: false },
    { text: "Task deadline tomorrow",   time: "1d ago", unread: false },
  ];

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotifications(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <>
      <header
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0",
          backgroundColor: darkMode ? "#0f172a" : "#ffffff",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        {/* Mobile: hamburger */}
        <button
          onClick={() => setShowMobileMenu(true)}
          style={{
            display: "none", // shown via media query workaround below
            padding: "8px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color: darkMode ? "#cbd5e1" : "#475569",
          }}
          className="mobile-menu-btn"
        >
          <Menu size={22} />
        </button>

        {/* Search bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "12px",
            border: darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0",
            backgroundColor: darkMode ? "#1e293b" : "#f8fafc",
            width: "260px",
          }}
        >
          <Search size={16} style={{ color: "#94a3b8", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search tasks..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "14px",
              width: "100%",
              color: darkMode ? "#ffffff" : "#0f172a",
            }}
          />
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{
              padding: "10px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              background: "transparent",
              color: darkMode ? "#facc15" : "#475569",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? "#1e293b" : "#f1f5f9"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                position: "relative",
                padding: "10px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                background: "transparent",
                color: darkMode ? "#cbd5e1" : "#475569",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? "#1e293b" : "#f1f5f9"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute", top: "6px", right: "6px",
                  width: "8px", height: "8px",
                  background: "#ef4444", borderRadius: "50%",
                }} />
              )}
            </button>

            {showNotifications && (
              <div style={{
                position: "absolute", right: 0, top: "52px",
                width: "320px", borderRadius: "16px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
                backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                overflow: "hidden", zIndex: 50,
              }}>
                <div style={{
                  padding: "16px 20px",
                  borderBottom: darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ fontWeight: "700", color: darkMode ? "#fff" : "#0f172a" }}>Notifications</span>
                  <span style={{
                    fontSize: "12px", padding: "2px 8px", borderRadius: "20px",
                    background: "rgba(124,58,237,0.2)", color: "#a78bfa",
                  }}>{unreadCount} new</span>
                </div>
                {NOTIFICATIONS.map((n, i) => (
                  <div key={i} style={{
                    padding: "14px 20px",
                    borderBottom: i < NOTIFICATIONS.length - 1 ? (darkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid #f8fafc") : "none",
                    display: "flex", gap: "12px", alignItems: "flex-start",
                    background: n.unread ? (darkMode ? "rgba(124,58,237,0.05)" : "rgba(124,58,237,0.03)") : "transparent",
                    cursor: "pointer",
                  }}>
                    <div style={{
                      width: "8px", height: "8px", borderRadius: "50%", marginTop: "6px", flexShrink: 0,
                      background: n.unread ? "#7c3aed" : (darkMode ? "#334155" : "#cbd5e1"),
                    }} />
                    <div>
                      <p style={{ fontSize: "14px", color: darkMode ? "#cbd5e1" : "#374151", margin: 0 }}>{n.text}</p>
                      <p style={{ fontSize: "12px", color: "#94a3b8", margin: "2px 0 0" }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "6px 12px", borderRadius: "12px", cursor: "pointer",
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? "#1e293b" : "#f1f5f9"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: "bold", fontSize: "14px", flexShrink: 0,
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: darkMode ? "#ffffff" : "#0f172a", lineHeight: 1.2 }}>
                {user?.name || "Guest"}
              </p>
              <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
                {user?.role || "Member"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      {showMobileMenu && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
          <div
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }}
            onClick={() => setShowMobileMenu(false)}
          />
          <div style={{
            position: "absolute", left: 0, top: 0, height: "100%", width: "280px",
            backgroundColor: darkMode ? "#0f172a" : "#ffffff",
            display: "flex", flexDirection: "column", boxShadow: "4px 0 30px rgba(0,0,0,0.3)",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "20px", borderBottom: darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0",
            }}>
              <span style={{ fontSize: "20px", fontWeight: "700", color: darkMode ? "#fff" : "#0f172a" }}>Planova</span>
              <button onClick={() => setShowMobileMenu(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: darkMode ? "#94a3b8" : "#64748b" }}>
                <X size={20} />
              </button>
            </div>
            <nav style={{ flex: 1, padding: "16px 12px" }}>
              {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <button
                    key={path}
                    onClick={() => { navigate(path); setShowMobileMenu(false); }}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: "12px",
                      padding: "10px 14px", borderRadius: "12px", border: "none", cursor: "pointer",
                      marginBottom: "4px", textAlign: "left", fontSize: "14px", fontWeight: "500",
                      background: isActive ? "linear-gradient(135deg, #7c3aed, #ec4899)" : "transparent",
                      color: isActive ? "#fff" : (darkMode ? "#94a3b8" : "#64748b"),
                    }}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </nav>
            <div style={{ padding: "12px", borderTop: darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9" }}>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "12px",
                  padding: "10px 14px", borderRadius: "12px", border: "none", cursor: "pointer",
                  background: "transparent", color: darkMode ? "#f87171" : "#ef4444",
                  fontSize: "14px", fontWeight: "500",
                }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}