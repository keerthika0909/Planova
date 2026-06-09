import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { Plus, X, Calendar, Flag, Trash2, GripVertical, CheckCircle2, Clock, Eye, AlertCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { getTasks, createTask, updateTaskStatus, deleteTask } from "../services/taskService";
import { getBoards } from "../services/boardService";
import toast from "react-hot-toast";

const COLUMNS = [
  { id: "Todo", label: "To Do", color: "from-slate-500 to-slate-600", dot: "bg-slate-400", icon: <Clock size={16} /> },
  { id: "In Progress", label: "In Progress", color: "from-blue-500 to-cyan-500", dot: "bg-blue-400", icon: <AlertCircle size={16} /> },
  { id: "Review", label: "Review", color: "from-amber-500 to-orange-500", dot: "bg-amber-400", icon: <Eye size={16} /> },
  { id: "Done", label: "Done", color: "from-emerald-500 to-green-500", dot: "bg-emerald-400", icon: <CheckCircle2 size={16} /> },
];

const PRIORITY_STYLES = {
  High: "bg-red-500/20 text-red-400 border border-red-500/30",
  Medium: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  Low: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
};

function TaskCard({ task, darkMode, onDelete, onDragStart }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "Done";

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className={`group relative p-4 rounded-2xl border cursor-grab active:cursor-grabbing hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 ${
        darkMode
          ? "bg-slate-800/80 border-white/8 hover:border-purple-500/30 hover:bg-slate-800"
          : "bg-white border-slate-200 hover:border-purple-300 hover:shadow-purple-100"
      }`}
    >
      {/* Drag Handle */}
      <div className={`absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 transition-opacity`}>
        <GripVertical size={14} className="text-slate-400" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-3 pl-2">
        <h3 className={`font-semibold text-sm leading-tight pr-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
          {task.title}
        </h3>
        <div ref={menuRef} className="relative flex-shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
          >
            <X size={14} />
          </button>
          {showMenu && (
            <div className={`absolute right-0 top-6 w-32 rounded-xl shadow-xl z-50 border overflow-hidden ${darkMode ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"}`}>
              <button
                onClick={() => { onDelete(task.id); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className={`text-xs mb-3 pl-2 line-clamp-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pl-2 mt-3">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Medium}`}>
          <Flag size={10} className="inline mr-1" />
          {task.priority}
        </span>

        {task.due_date && (
          <div className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-400" : darkMode ? "text-slate-400" : "text-slate-500"}`}>
            <Calendar size={11} />
            <span>{new Date(task.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
          </div>
        )}
      </div>

      {task.assigned_user_name && (
        <div className={`flex items-center gap-1.5 mt-2 pl-2 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
            {task.assigned_user_name.charAt(0)}
          </div>
          <span>{task.assigned_user_name}</span>
        </div>
      )}
    </div>
  );
}

function KanbanColumn({ column, tasks, darkMode, onDelete, onDragStart, onDragOver, onDrop, dragOverColumn }) {
  const isOver = dragOverColumn === column.id;

  return (
    <div
      onDragOver={(e) => onDragOver(e, column.id)}
      onDrop={(e) => onDrop(e, column.id)}
      className={`flex flex-col min-w-[280px] w-[280px] rounded-3xl transition-all duration-200 ${
        isOver
          ? darkMode ? "bg-slate-800/90 ring-2 ring-purple-500/50" : "bg-purple-50 ring-2 ring-purple-300"
          : darkMode ? "bg-slate-900/60" : "bg-slate-100/80"
      }`}
    >
      {/* Column Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${column.color} flex items-center justify-center text-white`}>
              {column.icon}
            </div>
            <h3 className={`font-bold text-sm ${darkMode ? "text-white" : "text-slate-800"}`}>
              {column.label}
            </h3>
          </div>
          <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${darkMode ? "bg-slate-700 text-slate-300" : "bg-white text-slate-600 shadow-sm"}`}>
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1 px-3 pb-3 space-y-3 min-h-[200px]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            darkMode={darkMode}
            onDelete={onDelete}
            onDragStart={onDragStart}
          />
        ))}

        {tasks.length === 0 && (
          <div className={`flex items-center justify-center h-24 rounded-2xl border-2 border-dashed text-xs ${
            darkMode ? "border-slate-700 text-slate-600" : "border-slate-300 text-slate-400"
          } ${isOver ? "border-purple-400" : ""}`}>
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { darkMode } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [dragTask, setDragTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Form state
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium", status: "Todo", dueDate: "", boardId: "" });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    Promise.all([fetchTasks(), fetchBoards()]);
  }, []);

  useEffect(() => {
    if (boards.length > 0 && !selectedBoard) {
      setSelectedBoard(boards[0].id);
    }
  }, [boards, selectedBoard]);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchBoards = async () => {
    try {
      const data = await getBoards();
      setBoards(data);
    } catch (err) {}
  };

  const handleCreateTask = async () => {
    if (!form.title.trim()) return toast.error("Task title is required");
    const boardId = form.boardId || selectedBoard || (boards[0]?.id);
    if (!boardId) return toast.error("Please create a board first");

    try {
      await createTask({ ...form, boardId, assignedUser: null });
      toast.success("Task created!");
      await fetchTasks();
      setForm({ title: "", description: "", priority: "Medium", status: "Todo", dueDate: "", boardId: "" });
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to create task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  // Drag and drop
  const handleDragStart = (e, task) => {
    setDragTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (!dragTask || dragTask.status === columnId) return;

    // Optimistic update
    setTasks((prev) => prev.map((t) => t.id === dragTask.id ? { ...t, status: columnId } : t));

    try {
      await updateTaskStatus(dragTask.id, columnId);
      toast.success(`Moved to ${columnId}`);
    } catch (err) {
      // Revert
      setTasks((prev) => prev.map((t) => t.id === dragTask.id ? { ...t, status: dragTask.status } : t));
      toast.error("Failed to update task");
    }
    setDragTask(null);
  };

  const filteredTasks = selectedBoard
    ? tasks.filter((t) => t.board_id === selectedBoard)
    : tasks;

  const tasksByColumn = COLUMNS.reduce((acc, col) => {
    acc[col.id] = filteredTasks.filter((t) => t.status === col.id);
    return acc;
  }, {});

  const stats = {
    total: filteredTasks.length,
    done: tasksByColumn["Done"]?.length || 0,
    inProgress: tasksByColumn["In Progress"]?.length || 0,
    overdue: filteredTasks.filter((t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== "Done").length,
  };

  const completionPct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}>
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        <div className="flex-1 overflow-auto">
          {/* Top Bar */}
          <div className={`px-6 py-5 border-b ${darkMode ? "border-white/5" : "border-slate-200"}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  Kanban Board
                </h1>
                <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Hey {user?.name || "there"} — {stats.total} tasks, {stats.done} done
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Board Selector */}
                <select
                  value={selectedBoard || ""}
                  onChange={(e) => setSelectedBoard(Number(e.target.value))}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium border outline-none cursor-pointer ${
                    darkMode
                      ? "bg-slate-800 border-white/10 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                  }`}
                >
                  <option value="">All Boards</option>
                  {boards.map((b) => (
                    <option key={b.id} value={b.id}>{b.title}</option>
                  ))}
                </select>

                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 rounded-xl text-white font-semibold text-sm hover:scale-105 transition shadow-lg shadow-purple-500/25"
                >
                  <Plus size={18} /> Add Task
                </button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              {[
                { label: "Total Tasks", value: stats.total, color: "from-purple-500 to-pink-500" },
                { label: "In Progress", value: stats.inProgress, color: "from-blue-500 to-cyan-500" },
                { label: "Completed", value: `${stats.done} (${completionPct}%)`, color: "from-emerald-500 to-green-500" },
                { label: "Overdue", value: stats.overdue, color: "from-red-500 to-orange-500" },
              ].map((s) => (
                <div key={s.label} className={`rounded-2xl px-4 py-3 border ${darkMode ? "bg-slate-900 border-white/5" : "bg-white border-slate-200"}`}>
                  <p className={`text-xs mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{s.label}</p>
                  <p className={`text-xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Kanban Columns */}
          <div className="p-6 overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Loading tasks...</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-4" style={{ minWidth: "fit-content" }}>
                {COLUMNS.map((col) => (
                  <KanbanColumn
                    key={col.id}
                    column={col}
                    tasks={tasksByColumn[col.id] || []}
                    darkMode={darkMode}
                    onDelete={handleDelete}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    dragOverColumn={dragOverColumn}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl ${darkMode ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"}`}>
            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: darkMode ? "rgba(255,255,255,0.08)" : "#e2e8f0" }}>
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Create Task</h2>
                <p className={`text-sm mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Add a new task to your board</p>
              </div>
              <button onClick={() => setShowModal(false)} className={`p-2 rounded-xl transition ${darkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <input
                placeholder="Task title *"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl outline-none border text-sm ${darkMode ? "bg-slate-800 text-white border-white/10 placeholder:text-slate-500" : "bg-slate-50 text-slate-900 border-slate-200"}`}
              />

              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl outline-none border text-sm resize-none ${darkMode ? "bg-slate-800 text-white border-white/10 placeholder:text-slate-500" : "bg-slate-50 text-slate-900 border-slate-200"}`}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-xl outline-none border text-sm ${darkMode ? "bg-slate-800 text-white border-white/10" : "bg-slate-50 text-slate-900 border-slate-200"}`}
                  >
                    {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-xl outline-none border text-sm ${darkMode ? "bg-slate-800 text-white border-white/10" : "bg-slate-50 text-slate-900 border-slate-200"}`}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Due Date</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-xl outline-none border text-sm ${darkMode ? "bg-slate-800 text-white border-white/10" : "bg-slate-50 text-slate-900 border-slate-200"}`}
                  />
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Board</label>
                  <select
                    value={form.boardId || selectedBoard || ""}
                    onChange={(e) => setForm({ ...form, boardId: Number(e.target.value) })}
                    className={`w-full px-3 py-2.5 rounded-xl outline-none border text-sm ${darkMode ? "bg-slate-800 text-white border-white/10" : "bg-slate-50 text-slate-900 border-slate-200"}`}
                  >
                    {boards.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition ${darkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:scale-[1.02] transition shadow-lg shadow-purple-500/25"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}