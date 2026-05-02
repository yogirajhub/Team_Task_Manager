const express  = require("express");
const router   = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
  addMember,
  removeMember,
} = require("../controllers/projectController");
const { protect }      = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

router.use(protect);

router.get("/",  getProjects);
router.post("/", createProject);

router.get("/:id",    getProjectById);
router.delete("/:id", requireAdmin, deleteProject);

// ✅ Member routes — exact order matters
router.post("/:id/members",           requireAdmin, addMember);
router.delete("/:id/members/:userId", requireAdmin, removeMember);

module.exports = router;