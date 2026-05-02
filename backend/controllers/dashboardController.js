const Task    = require("../models/Task");
const Project = require("../models/Project");
const { sendSuccess, sendError } = require("../utils/apiResponse");

const getDashboard = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { createdBy: req.user._id },
        { "members.user": req.user._id },
      ],
    }).select("_id");

    const projectIds = projects.map((p) => p._id);

    const allTasks = await Task.find({ project: { $in: projectIds } })
      .populate("assignedTo", "name email")
      .populate("project",    "name");

    const now = new Date();

    const total      = allTasks.length;
    const completed  = allTasks.filter((t) => t.status === "done").length;
    const pending    = allTasks.filter((t) => t.status === "todo").length;
    const inProgress = allTasks.filter((t) => t.status === "in-progress").length;
    const overdue    = allTasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "done"
    );

    const myTasks = allTasks.filter(
      (t) => t.assignedTo?._id?.toString() === req.user._id.toString()
    );

    return sendSuccess(res, 200, "Dashboard data fetched.", {
      stats: { total, completed, pending, inProgress, overdue: overdue.length },
      overdueTasks:  overdue.slice(0, 5),
      myTasks:       myTasks.slice(0, 5),
      totalProjects: projectIds.length,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return sendError(res, 500, "Failed to fetch dashboard data.");
  }
};

module.exports = { getDashboard };