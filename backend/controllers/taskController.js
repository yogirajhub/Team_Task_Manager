const { validationResult } = require("express-validator");
const Task    = require("../models/Task");
const Project = require("../models/Project");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// POST /api/projects/:projectId/tasks
const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return sendError(res, 422, "Validation failed", errors.array());

  try {
    const projectId = req.params.projectId;
    const project   = await Project.findById(projectId);
    if (!project) return sendError(res, 404, "Project not found.");

    const { title, description, assignedTo, priority, dueDate, status } = req.body;

    // Validate assignedTo is a project member
    if (assignedTo) {
      const isMember = project.members.some(
        (m) => m.user.toString() === assignedTo
      );
      if (!isMember)
        return sendError(res, 400, "Assigned user is not a project member.");
    }

    const task = await Task.create({
      title,
      description,
      status:     status     || "todo",
      priority:   priority   || "medium",
      dueDate:    dueDate    || null,
      project:    project._id,
      assignedTo: assignedTo || null,
      assignedBy: req.user._id,
    });

    await task.populate([
      { path: "assignedTo", select: "name email" },
      { path: "assignedBy", select: "name email" },
    ]);

    return sendSuccess(res, 201, "Task created successfully.", { task });
  } catch (error) {
    console.error("createTask error:", error.message);
    return sendError(res, 500, "Failed to create task.");
  }
};

// GET /api/projects/:projectId/tasks
const getTasksByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { status, priority, assignedTo } = req.query;

    const filter = { project: projectId };
    if (status)     filter.status     = status;
    if (priority)   filter.priority   = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email")
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, "Tasks fetched.", { tasks });
  } catch (error) {
    console.error("getTasksByProject error:", error.message);
    return sendError(res, 500, "Failed to fetch tasks.");
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return sendError(res, 422, "Validation failed", errors.array());

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return sendError(res, 404, "Task not found.");

    const { title, description, assignedTo, priority, dueDate, status } = req.body;

    if (title)       task.title       = title;
    if (description !== undefined) task.description = description;
    if (assignedTo  !== undefined) task.assignedTo  = assignedTo || null;
    if (priority)    task.priority    = priority;
    if (dueDate     !== undefined) task.dueDate     = dueDate || null;
    if (status)      task.status      = status;

    await task.save();
    await task.populate([
      { path: "assignedTo", select: "name email" },
      { path: "assignedBy", select: "name email" },
    ]);

    return sendSuccess(res, 200, "Task updated.", { task });
  } catch (error) {
    console.error("updateTask error:", error.message);
    return sendError(res, 500, "Failed to update task.");
  }
};

// PATCH /api/tasks/:id/status
const updateTaskStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return sendError(res, 422, "Validation failed", errors.array());

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return sendError(res, 404, "Task not found.");

    const project   = await Project.findById(task.project);
    const isCreator = project?.createdBy.toString() === req.user._id.toString();
    const member    = project?.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    const isAdmin    = isCreator || member?.role === "admin";
    const isAssignee = task.assignedTo?.toString() === req.user._id.toString();

    if (!isAdmin && !isAssignee)
      return sendError(res, 403, "You can only update your own task status.");

    task.status = req.body.status;
    await task.save();

    return sendSuccess(res, 200, "Status updated.", { task });
  } catch (error) {
    console.error("updateTaskStatus error:", error.message);
    return sendError(res, 500, "Failed to update status.");
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return sendError(res, 404, "Task not found.");
    await task.deleteOne();
    return sendSuccess(res, 200, "Task deleted.");
  } catch (error) {
    console.error("deleteTask error:", error.message);
    return sendError(res, 500, "Failed to delete task.");
  }
};

module.exports = {
  createTask, getTasksByProject,
  updateTask, updateTaskStatus, deleteTask,
};