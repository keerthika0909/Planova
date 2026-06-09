const db = require("../config/db");

exports.addMember = (req, res) => {

  const { boardId, userId } = req.body;

  const sql =
    "INSERT INTO board_members(board_id,user_id) VALUES (?,?)";

  db.query(
    sql,
    [boardId, userId],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Member Added",
      });
    }
  );
};