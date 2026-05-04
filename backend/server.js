const express   = require("express");
const dotenv    = require("dotenv");
const cors      = require("cors");
const helmet    = require("helmet");
const morgan    = require("morgan");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ── Security ──
app.use(helmet());

// ── CORS — multiple origins support karta hai ──
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean); // removes undefined/null values

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, curl, Thunder Client)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(morgan("dev"));
app.use(express.json());

// ── Root route — Railway health check + browser test ──
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Team Task Manager API is running ✅",
    version: "1.0.0",
    endpoints: {
      health:    "/api/health",
      auth:      "/api/auth",
      projects:  "/api/projects",
      tasks:     "/api/tasks",
      dashboard: "/api/dashboard",
    },
  });
});

// ── Health check ──
app.get("/api/health", (req, res) =>
  res.json({ success: true, message: "Server running ✅" })
);

// ── Route imports ──
const taskRoutes    = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");

// ── API Routes ──
app.use("/api/auth",                      require("./routes/authRoutes"));
app.use("/api/projects",                  projectRoutes);
app.use("/api/projects/:projectId/tasks", taskRoutes);   // nested
app.use("/api/tasks",                     taskRoutes);   // flat
app.use("/api/dashboard",                 require("./routes/dashboardRoutes"));

// ── 404 Handler ──
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));