const Board = require("../models/boardModel");

const createBoard = (req, res) => {
  const { title, createdBy } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  Board.createBoard(title, createdBy, (err, result) => {
    if (err) return res.status(500).json({ message: "Error creating board", error: err });
    res.status(201).json({ message: "Board Created Successfully", id: result.insertId });
  });
};

const getBoards = (req, res) => {
  Board.getBoardsWithStats((err, result) => {
    if (err) return res.status(500).json({ message: "Error fetching boards", error: err });
    res.status(200).json(result);
  });
};

const deleteBoard = (req, res) => {
  const { id } = req.params;
  Board.deleteBoard(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting board" });
    res.status(200).json({ message: "Board deleted" });
  });
};

module.exports = { createBoard, getBoards, deleteBoard };