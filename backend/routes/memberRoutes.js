const express = require("express");

const router = express.Router();

const {
  addMember,
} = require("../controllers/memberController");

router.post("/add", addMember);

module.exports = router;