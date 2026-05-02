const Project = require("../models/Project");
const Task    = require("../models/Task");
const { sendError } = require("../utils/apiResponse");

// Smart projectId extractor — checks all possible sources
const extractProjectId = async (req) => {
  // Direct project route: /api/projects/:id or /api/projects/:projectId
  if (req.params.projectId) return req.params.projectId;
  if (req.params.id && req.baseUrl.includes("projects")) return req.params.id;

  // Task route: /api/tasks/:id — need to look up task to get project
  if (req.params.id && req.baseUrl.includes("tasks")) {
    const task = await Task.findById(req.params.id).select("project");
    if (task) return task.project.toString();
  }

  // Body fallback
  if (req.body?.projectId) return req.body.projectId;

  return null;
};

const requireAdmin = async (req, res, next) => {
  try {
    const projectId = await extractProjectId(req);
    if (!projectId) return sendError(res, 400, "Project ID missing.");

    const project = await Project.findById(projectId);
    if (!project) return sendError(res, 404, "Project not found.");

    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const member    = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    const isAdmin   = isCreator || member?.role === "admin";

    if (!isAdmin) return sendError(res, 403, "Access denied. Admins only.");

    req.project = project;
    next();
  } catch (error) {
    console.error("requireAdmin error:", error.message);
    return sendError(res, 500, "Role check failed.");
  }
};

const requireMember = async (req, res, next) => {
  try {
    const projectId = await extractProjectId(req);
    if (!projectId) return sendError(res, 400, "Project ID missing.");

    const project = await Project.findById(projectId);
    if (!project) return sendError(res, 404, "Project not found.");

    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const isMember  = project.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!isCreator && !isMember)
      return sendError(res, 403, "Access denied. Not a project member.");

    req.project = project;
    next();
  } catch (error) {
    console.error("requireMember error:", error.message);
    return sendError(res, 500, "Member check failed.");
  }
};

module.exports = { requireAdmin, requireMember };