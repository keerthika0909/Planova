const db = require("../config/db");

const createTask = (title, description, status, priority, boardId, assignedUser, dueDate, callback) => {
  const sql = `INSERT INTO tasks (title, description, status, priority, board_id, assigned_user, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [title, description, status, priority, boardId, assignedUser, dueDate], callback);
};

const getTasks = (callback) => {
  const sql = "SELECT * FROM tasks ORDER BY created_at DESC";
  db.query(sql, callback);
};

const getTasksByBoard = (boardId, callback) => {
  const sql = "SELECT t.*, u.name as assigned_user_name FROM tasks t LEFT JOIN users u ON t.assigned_user = u.id WHERE t.board_id = ? ORDER BY t.created_at DESC";
  db.query(sql, [boardId], callback);
};

const updateTaskStatus = (id, status, callback) => {
  const sql = "UPDATE tasks SET status = ? WHERE id = ?";
  db.query(sql, [status, id], callback);
};

const updateTask = (id, title, description, status, priority, assignedUser, dueDate, callback) => {
  const sql = "UPDATE tasks SET title=?, description=?, status=?, priority=?, assigned_user=?, due_date=? WHERE id=?";
  db.query(sql, [title, description, status, priority, assignedUser, dueDate, id], callback);
};

const deleteTask = (id, callback) => {
  const sql = "DELETE FROM tasks WHERE id = ?";
  db.query(sql, [id], callback);
};

module.exports = { createTask, getTasks, getTasksByBoard, updateTaskStatus, updateTask, deleteTask };