const mysql = require("mysql2");

const connection = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

connection.getConnection((err, conn) => {
  if (err) {
    console.log("Database Error:", err.message);
  } else {
    console.log("MySQL Connected");
    conn.release();
  }
});

module.exports = connection;