const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/* Middleware */
app.use(
  cors({
    origin: function (origin, callback) {
      const allowed = [
        "http://localhost:3000",
        "https://planova-nine.vercel.app",
      ];
      if (!origin || allowed.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routes */
const authRoutes = require("./routes/authRoutes");
const boardRoutes = require("./routes/boardRoutes");
const taskRoutes = require("./routes/taskRoutes");
const memberRoutes = require("./routes/memberRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/members", memberRoutes);

/* Health Check */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Planova API Running",
  });
});

/* 404 Handler */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

/* Global Error Handler */
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running On Port ${PORT}`);
});