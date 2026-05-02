const express = require("express");
const router  = express.Router({ mergeParams: true });
const {
  createTask,
  getTasksByProject,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");
const { protect }                        = require("../middlewares/authMiddleware");
const { requireAdmin, requireMember }    = require("../middlewares/roleMiddleware");
const { taskValidator, statusValidator } = require("../validators/taskValidator");

router.use(protect);

// These handle: GET/POST /api/projects/:projectId/tasks
router.get("/",  requireMember, getTasksByProject);
router.post("/", requireAdmin,  taskValidator, createTask);

// These handle: PUT/PATCH/DELETE /api/tasks/:id
router.put("/:id",          requireAdmin,  taskValidator,   updateTask);
router.patch("/:id/status", requireMember, statusValidator, updateTaskStatus);
router.delete("/:id",       requireAdmin,  deleteTask);

module.exports = router;