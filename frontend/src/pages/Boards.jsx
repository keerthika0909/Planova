import React, { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { Plus, Search, CalendarDays, MoreVertical, X, LayoutGrid } from "lucide-react";
import { getBoards, createBoard as createBoardAPI, deleteBoard } from "../services/boardService";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BOARD_GRADIENTS = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-red-500",
  "from-violet-500 to-purple-500",
  "from-pink-500 to-rose-500",
];

export default function Boards() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [boardTitle, setBoardTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handler = () => setActiveMenu(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const fetchBoards = async () => {
    try {
      const data = await getBoards();
      setBoards(data);
    } catch (err) {
      toast.error("Failed to load boards");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!boardTitle.trim()) return toast.error("Board title is required");
    setCreating(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await createBoardAPI(boardTitle, user.id);
      toast.success("Board created!");
      await fetchBoards();
      setBoardTitle("");
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to create board");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this board and all its tasks?")) return;
    try {
      await deleteBoard(id);
      setBoards((prev) => prev.filter((b) => b.id !== id));
      toast.success("Board deleted");
    } catch (err) {
      toast.error("Failed to delete board");
    }
  };

  const filtered = boards.filter((b) =>
    b.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}>
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Boards</h1>
              <p className={`mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {boards.length} board{boards.length !== 1 ? "s" : ""} total
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3 rounded-xl text-white font-semibold hover:scale-105 transition shadow-lg shadow-purple-500/25"
            >
              <Plus size={20} /> Create Board
            </button>
          </div>

          {/* Search */}
          <div className={`rounded-2xl px-4 py-3 flex items-center gap-3 mb-8 border ${darkMode ? "bg-slate-900 border-white/8" : "bg-white border-slate-200"}`}>
            <Search size={18} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search boards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`bg-transparent outline-none w-full text-sm ${darkMode ? "text-white placeholder:text-slate-500" : "text-slate-900"}`}
            />
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className={`flex flex-col items-center justify-center h-64 rounded-3xl border-2 border-dashed ${darkMode ? "border-slate-700 text-slate-500" : "border-slate-300 text-slate-400"}`}>
              <LayoutGrid size={40} className="mb-3 opacity-50" />
              <p className="font-medium">No boards found</p>
              <p className="text-sm mt-1">Create your first board to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((board, i) => {
                const gradient = BOARD_GRADIENTS[i % BOARD_GRADIENTS.length];
                const completionPct = board.task_count > 0
                  ? Math.round((board.completed_tasks / board.task_count) * 100)
                  : 0;

                return (
                  <div
                    key={board.id}
                    className={`rounded-3xl overflow-hidden border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${darkMode ? "bg-slate-900 border-white/8" : "bg-white border-slate-200"}`}
                  >
                    {/* Top gradient */}
                    <div className={`h-28 bg-gradient-to-br ${gradient} p-5 flex justify-between items-start`}>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{board.title}</h2>
                        <p className="text-white/70 text-sm mt-1">
                          {board.creator_name ? `by ${board.creator_name}` : "Project Board"}
                        </p>
                      </div>
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setActiveMenu(activeMenu === board.id ? null : board.id)}
                          className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {activeMenu === board.id && (
                          <div className={`absolute right-0 top-8 w-36 rounded-xl shadow-xl z-50 border overflow-hidden ${darkMode ? "bg-slate-800 border-white/10" : "bg-white border-slate-200"}`}>
                            <button
                              onClick={() => navigate(`/dashboard?board=${board.id}`)}
                              className={`w-full text-left px-4 py-2.5 text-sm transition ${darkMode ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-50"}`}
                            >
                              Open Board
                            </button>
                            <button
                              onClick={() => handleDelete(board.id)}
                              className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className={`rounded-xl p-3 ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}>
                          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Tasks</p>
                          <p className={`text-xl font-bold mt-0.5 ${darkMode ? "text-white" : "text-slate-900"}`}>{board.task_count || 0}</p>
                        </div>
                        <div className={`rounded-xl p-3 ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}>
                          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Done</p>
                          <p className={`text-xl font-bold mt-0.5 ${darkMode ? "text-white" : "text-slate-900"}`}>{board.completed_tasks || 0}</p>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className={darkMode ? "text-slate-400" : "text-slate-500"}>Progress</span>
                          <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-700"}`}>{completionPct}%</span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}>
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                            style={{ width: `${completionPct}%` }}
                          />
                        </div>
                      </div>

                      <div className={`flex items-center gap-2 text-xs mb-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        <CalendarDays size={13} />
                        <span>{new Date(board.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>

                      <button
                        onClick={() => navigate("/dashboard")}
                        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition hover:scale-[1.02] bg-gradient-to-r ${gradient} text-white`}
                      >
                        Open Board
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-3xl border shadow-2xl ${darkMode ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"}`}>
            <div className="p-6 flex justify-between items-center border-b" style={{ borderColor: darkMode ? "rgba(255,255,255,0.08)" : "#e2e8f0" }}>
              <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Create Board</h2>
              <button onClick={() => setShowModal(false)} className={`p-2 rounded-xl transition ${darkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <input
                type="text"
                placeholder="Board name"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                autoFocus
                className={`w-full px-4 py-3 rounded-xl outline-none border text-sm mb-5 ${darkMode ? "bg-slate-800 text-white border-white/10 placeholder:text-slate-500" : "bg-slate-50 text-slate-900 border-slate-200"}`}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition ${darkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:scale-[1.02] transition disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create Board"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}