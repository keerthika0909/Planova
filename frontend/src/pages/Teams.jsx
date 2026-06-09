import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { Users, Mail, Phone, Plus, Search, MoreVertical, X, Briefcase, Activity } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

const ROLES = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "UI/UX Designer", "Product Manager", "DevOps Engineer", "QA Engineer"];

export default function Teams() {
  const { darkMode } = useTheme();

  const [members, setMembers] = useState([
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ name: "", role: "", email: "", phone: "" });

  const addMember = () => {
    if (!form.name || !form.role) return toast.error("Name and role are required");
    const newMember = {
      id: Date.now(),
      name: form.name,
      role: form.role,
      email: form.email || `${form.name.toLowerCase().replace(/\s/g, "")}@gmail.com`,
      phone: form.phone || "+91 0000000000",
      status: "Active",
    };
    setMembers([...members, newMember]);
    setForm({ name: "", role: "", email: "", phone: "" });
    setShowModal(false);
    toast.success("Member added!");
  };

  const deleteMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setActiveMenu(null);
    toast.success("Member removed");
  };

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const AVATAR_COLORS = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-red-500",
    "from-violet-500 to-indigo-500",
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}>
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Teams</h1>
              <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Manage your team and collaborators</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3 rounded-xl text-white font-semibold hover:scale-105 transition shadow-lg shadow-purple-500/25"
            >
              <Plus size={18} /> Add Member
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Members", value: members.length, icon: Users, gradient: "from-purple-500 to-pink-500" },
              { label: "Active", value: members.filter((m) => m.status === "Active").length, icon: Activity, gradient: "from-emerald-500 to-teal-500" },
              { label: "Roles", value: [...new Set(members.map((m) => m.role))].length, icon: Briefcase, gradient: "from-blue-500 to-cyan-500" },
            ].map((s) => (
              <div key={s.label} className={`rounded-2xl p-5 border flex items-center justify-between ${darkMode ? "bg-slate-900 border-white/8" : "bg-white border-slate-200"}`}>
                <div>
                  <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{s.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${darkMode ? "text-white" : "text-slate-900"}`}>{s.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white`}>
                  <s.icon size={22} />
                </div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className={`rounded-2xl px-4 py-3 flex items-center gap-3 mb-6 border ${darkMode ? "bg-slate-900 border-white/8" : "bg-white border-slate-200"}`}>
            <Search size={17} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`bg-transparent outline-none text-sm w-full ${darkMode ? "text-white placeholder:text-slate-500" : "text-slate-900"}`}
            />
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((member, i) => (
              <div
                key={member.id}
                className={`rounded-3xl p-5 border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${darkMode ? "bg-slate-900 border-white/8" : "bg-white border-slate-200"}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-lg font-bold`}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className={`font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>{member.name}</h3>
                      <p className="text-sm text-purple-400">{member.role}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === member.id ? null : member.id)}
                      className={`p-1.5 rounded-lg transition ${darkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
                    >
                      <MoreVertical size={16} />
                    </button>
                    {activeMenu === member.id && (
                      <div className={`absolute right-0 top-8 w-36 rounded-xl shadow-xl z-50 border overflow-hidden ${darkMode ? "bg-slate-800 border-white/10" : "bg-white border-slate-200"}`}>
                        <button
                          onClick={() => { setShowProfile(member); setActiveMenu(null); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition ${darkMode ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-50"}`}
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => deleteMember(member.id)}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`space-y-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    <span>{member.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: darkMode ? "rgba(255,255,255,0.06)" : "#f1f5f9" }}>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${member.status === "Active" ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"}`}>
                    ● {member.status}
                  </span>
                  <button
                    onClick={() => setShowProfile(member)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition ${darkMode ? "text-purple-400 hover:bg-purple-500/10" : "text-purple-600 hover:bg-purple-50"}`}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-3xl border shadow-2xl ${darkMode ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"}`}>
            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: darkMode ? "rgba(255,255,255,0.08)" : "#e2e8f0" }}>
              <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Add Member</h2>
              <button onClick={() => setShowModal(false)} className={`p-2 rounded-xl transition ${darkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {[
                { key: "name", placeholder: "Full Name *", type: "text" },
                { key: "email", placeholder: "Email Address", type: "email" },
                { key: "phone", placeholder: "Phone Number", type: "tel" },
              ].map((field) => (
                <input
                  key={field.key}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl outline-none border text-sm ${darkMode ? "bg-slate-800 text-white border-white/10 placeholder:text-slate-500" : "bg-slate-50 text-slate-900 border-slate-200"}`}
                />
              ))}
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl outline-none border text-sm ${darkMode ? "bg-slate-800 text-white border-white/10" : "bg-slate-50 text-slate-900 border-slate-200"}`}
              >
                <option value="">Select Role *</option>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowModal(false)} className={`flex-1 py-3 rounded-xl text-sm font-semibold transition ${darkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                Cancel
              </button>
              <button onClick={addMember} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:scale-[1.02] transition">
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden ${darkMode ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"}`}>
            <div className="h-24 bg-gradient-to-r from-purple-600 to-pink-600 relative">
              <button onClick={() => setShowProfile(null)} className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 pb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold -mt-8 mb-4 border-4" style={{ borderColor: darkMode ? "#0f172a" : "white" }}>
                {showProfile.name.charAt(0)}
              </div>
              <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>{showProfile.name}</h2>
              <p className="text-purple-400 text-sm mb-5">{showProfile.role}</p>

              <div className={`space-y-3 text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-slate-400" />
                  <span>{showProfile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-slate-400" />
                  <span>{showProfile.phone}</span>
                </div>
              </div>

              <span className="inline-block mt-4 text-xs px-3 py-1.5 rounded-full font-medium bg-emerald-500/15 text-emerald-400">
                ● {showProfile.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}