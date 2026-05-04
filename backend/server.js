const express   = require("express");
const dotenv    = require("dotenv");
const cors      = require("cors");
const helmet    = require("helmet");
const morgan    = require("morgan");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ✅ CORS — helmet se PEHLE aana chahiye
app.use(cors({
  origin: "*",           // sabse pehle * se test karte hain
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,    // * ke saath credentials false hona chahiye
}));

// ✅ OPTIONS preflight — har route ke liye
app.options("*", cors());

app.use(helmet({
  crossOriginResourcePolicy: false,  // helmet CORS block na kare
}));
app.use(morgan("dev"));
app.use(express.json());

// ── Root route ──
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

app.get("/api/health", (req, res) =>
  res.json({ success: true, message: "Server running ✅" })
);

// ── Route imports ──
const taskRoutes    = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");

// ── API Routes ──
app.use("/api/auth",                      require("./routes/authRoutes"));
app.use("/api/projects",                  projectRoutes);
app.use("/api/projects/:projectId/tasks", taskRoutes);
app.use("/api/tasks",                     taskRoutes);
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