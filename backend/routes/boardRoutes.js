const express = require("express");
const router = express.Router();
const { createBoard, getBoards, deleteBoard } = require("../controllers/boardController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, createBoard);
router.get("/", verifyToken, getBoards);
router.delete("/:id", verifyToken, deleteBoard);

module.exports = router;