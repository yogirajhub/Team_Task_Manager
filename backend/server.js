const express   = require("express");
const dotenv    = require("dotenv");
const cors      = require("cors");
const helmet    = require("helmet");
const morgan    = require("morgan");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(morgan("dev"));
app.use(express.json());

// ── Separate routers for nested vs flat task routes ──
const taskRoutes    = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");

app.use("/api/auth",                        require("./routes/authRoutes"));
app.use("/api/projects",                    projectRoutes);
app.use("/api/projects/:projectId/tasks",   taskRoutes);   // nested
app.use("/api/tasks",                       taskRoutes);   // flat
app.use("/api/dashboard",                   require("./routes/dashboardRoutes"));

app.get("/api/health", (req, res) =>
  res.json({ success: true, message: "Server running ✅" })
);

app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));