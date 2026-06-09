import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { User, Lock, Bell, Palette, Save, Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

export default function Settings() {
  const { darkMode, toggleTheme } = useTheme();

  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [notifications, setNotifications] = useState({ email: true, push: false, taskAssigned: true, deadlineReminder: true });

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setProfile({ name: user.name || "", email: user.email || "" });
    } catch {}
  }, []);

  const saveProfile = () => {
    if (!profile.name || !profile.email) return toast.error("Name and email are required");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem("user", JSON.stringify({ ...user, ...profile }));
    toast.success("Profile saved!");
  };

  const savePassword = () => {
    if (!passwords.current) return toast.error("Enter your current password");
    if (passwords.newPass.length < 6) return toast.error("New password must be at least 6 characters");
    if (passwords.newPass !== passwords.confirm) return toast.error("Passwords do not match");
    toast.success("Password updated!");
    setPasswords({ current: "", newPass: "", confirm: "" });
  };

  const inputClass = `w-full px-4 py-3 rounded-xl outline-none border text-sm ${
    darkMode ? "bg-slate-800 text-white border-white/10 placeholder:text-slate-500" : "bg-slate-50 text-slate-900 border-slate-200"
  }`;

  const cardClass = `rounded-3xl p-6 border ${darkMode ? "bg-slate-900 border-white/8" : "bg-white border-slate-200"}`;

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}>
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mb-8">
            <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Settings</h1>
            <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Manage your account preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile */}
            <div className={cardClass}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
                  <User size={18} className="text-purple-400" />
                </div>
                <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Profile Settings</h2>
              </div>
              <div className="space-y-4">
                <input
                  placeholder="Full Name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className={inputClass}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className={inputClass}
                />
                <button
                  onClick={saveProfile}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:scale-[1.02] transition"
                >
                  <Save size={15} /> Save Profile
                </button>
              </div>
            </div>

            {/* Password */}
            <div className={cardClass}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-pink-500/15 flex items-center justify-center">
                  <Lock size={18} className="text-pink-400" />
                </div>
                <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Change Password</h2>
              </div>
              <div className="space-y-4">
                {[
                  { key: "current", label: "Current Password", showKey: "current" },
                  { key: "newPass", label: "New Password", showKey: "new" },
                  { key: "confirm", label: "Confirm Password", showKey: "confirm" },
                ].map((f) => (
                  <div key={f.key} className="relative">
                    <input
                      type={showPass[f.showKey] ? "text" : "password"}
                      placeholder={f.label}
                      value={passwords[f.key]}
                      onChange={(e) => setPasswords({ ...passwords, [f.key]: e.target.value })}
                      className={inputClass + " pr-12"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass({ ...showPass, [f.showKey]: !showPass[f.showKey] })}
                      className="absolute right-3 top-3 p-1 text-slate-400"
                    >
                      {showPass[f.showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                ))}
                <button
                  onClick={savePassword}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:scale-[1.02] transition"
                >
                  <Save size={15} /> Update Password
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className={cardClass}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <Bell size={18} className="text-amber-400" />
                </div>
                <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Notifications</h2>
              </div>
              <div className="space-y-4">
                {[
                  { key: "email", label: "Email Notifications", desc: "Receive updates via email" },
                  { key: "push", label: "Push Notifications", desc: "Browser notifications" },
                  { key: "taskAssigned", label: "Task Assigned", desc: "When a task is assigned to you" },
                  { key: "deadlineReminder", label: "Deadline Reminders", desc: "24h before due date" },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-900"}`}>{n.label}</p>
                      <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{n.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [n.key]: !notifications[n.key] })}
                      className={`w-11 h-6 rounded-full transition-all duration-300 relative ${notifications[n.key] ? "bg-gradient-to-r from-purple-600 to-pink-600" : darkMode ? "bg-slate-700" : "bg-slate-300"}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${notifications[n.key] ? "left-5" : "left-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Appearance */}
            <div className={cardClass}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                  <Palette size={18} className="text-cyan-400" />
                </div>
                <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Appearance</h2>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-2xl ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}>
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon size={20} className="text-purple-400" /> : <Sun size={20} className="text-amber-400" />}
                  <div>
                    <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                      {darkMode ? "Dark Mode" : "Light Mode"}
                    </p>
                    <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Toggle theme</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${darkMode ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-slate-300"}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${darkMode ? "left-6" : "left-0.5"}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}