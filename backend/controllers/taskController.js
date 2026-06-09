const Task = require("../models/taskModel");

const createTask = (req, res) => {
  const { title, description, status, priority, boardId, assignedUser, dueDate } = req.body;

  if (!title || !boardId) {
    return res.status(400).json({ message: "Title and boardId are required" });
  }

  Task.createTask(title, description, status || "Todo", priority || "Medium", boardId, assignedUser || null, dueDate || null, (err, result) => {
    if (err) {
      console.log("TASK INSERT ERROR:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(201).json({ message: "Task Created", id: result.insertId });
  });
};

const getTasks = (req, res) => {
  Task.getTasks((err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(result);
  });
};

const getTasksByBoard = (req, res) => {
  const { boardId } = req.params;
  Task.getTasksByBoard(boardId, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(result);
  });
};

const updateTaskStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  Task.updateTaskStatus(id, status, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Task status updated" });
  });
};

const deleteTask = (req, res) => {
  const { id } = req.params;
  Task.deleteTask(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Task deleted" });
  });
};

module.exports = { createTask, getTasks, getTasksByBoard, updateTaskStatus, deleteTask };