const db = require("../config/db");

const createBoard = (title, createdBy, callback) => {
  const sql = "INSERT INTO boards (title, created_by) VALUES (?, ?)";
  db.query(sql, [title, createdBy], callback);
};

const getBoardsWithStats = (callback) => {
  const sql = `
    SELECT b.*, 
      u.name as creator_name,
      COUNT(DISTINCT t.id) as task_count,
      SUM(CASE WHEN t.status = 'Done' THEN 1 ELSE 0 END) as completed_tasks
    FROM boards b
    LEFT JOIN users u ON b.created_by = u.id
    LEFT JOIN tasks t ON b.id = t.board_id
    GROUP BY b.id
    ORDER BY b.created_at DESC
  `;
  db.query(sql, callback);
};

const getBoards = (callback) => {
  const sql = "SELECT * FROM boards ORDER BY created_at DESC";
  db.query(sql, callback);
};

const deleteBoard = (id, callback) => {
  const sql = "DELETE FROM boards WHERE id = ?";
  db.query(sql, [id], callback);
};

module.exports = { createBoard, getBoards, getBoardsWithStats, deleteBoard };