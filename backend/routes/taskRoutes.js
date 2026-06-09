const express = require("express");
const router = express.Router();
const { createTask, getTasks, updateTaskStatus, deleteTask, getTasksByBoard } = require("../controllers/taskController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, createTask);
router.get("/", verifyToken, getTasks);
router.get("/board/:boardId", verifyToken, getTasksByBoard);
router.patch("/:id/status", verifyToken, updateTaskStatus);
router.delete("/:id", verifyToken, deleteTask);

module.exports = router;