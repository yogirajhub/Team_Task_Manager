const { validationResult } = require("express-validator");
const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// POST /api/projects
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return sendError(res, 422, "Project name is required.");

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: "admin" }],
    });

    return sendSuccess(res, 201, "Project created successfully.", { project });
  } catch (error) {
    return sendError(res, 500, "Failed to create project.");
  }
};

// GET /api/projects
const getProjects = async (req, res) => {
  try {
    // Return only projects where user is a member or creator
    const projects = await Project.find({
      $or: [
        { createdBy: req.user._id },
        { "members.user": req.user._id },
      ],
    })
      .populate("createdBy", "name email")
      .populate("members.user", "name email")
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, "Projects fetched.", { projects });
  } catch (error) {
    return sendError(res, 500, "Failed to fetch projects.");
  }
};

// GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members.user", "name email");

    if (!project) return sendError(res, 404, "Project not found.");

    // Verify requester is a member
    const isMember = project.members.some(
      (m) => m.user._id.toString() === req.user._id.toString()
    );
    const isCreator = project.createdBy._id.toString() === req.user._id.toString();

    if (!isMember && !isCreator) {
      return sendError(res, 403, "Access denied.");
    }

    return sendSuccess(res, 200, "Project fetched.", { project });
  } catch (error) {
    return sendError(res, 500, "Failed to fetch project.");
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 404, "Project not found.");

    // Only the original creator can delete
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return sendError(res, 403, "Only the project creator can delete it.");
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    return sendSuccess(res, 200, "Project and its tasks deleted.");
  } catch (error) {
    return sendError(res, 500, "Failed to delete project.");
  }
};

// POST /api/projects/:id/members
const addMember = async (req, res) => {
  try {
    const { email, role = "member" } = req.body;
    if (!email) return sendError(res, 422, "Member email is required.");

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return sendError(res, 404, "No user found with that email.");

    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 404, "Project not found.");

    const alreadyMember = project.members.some(
      (m) => m.user.toString() === userToAdd._id.toString()
    );
    if (alreadyMember) return sendError(res, 409, "User is already a member.");

    project.members.push({ user: userToAdd._id, role });
    await project.save();

    await project.populate("members.user", "name email");
    return sendSuccess(res, 200, "Member added successfully.", { project });
  } catch (error) {
    return sendError(res, 500, "Failed to add member.");
  }
};

// DELETE /api/projects/:id/members/:userId
const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, 404, "Project not found.");

    // Cannot remove the creator
    if (project.createdBy.toString() === req.params.userId) {
      return sendError(res, 400, "Cannot remove the project creator.");
    }

    project.members = project.members.filter(
      (m) => m.user.toString() !== req.params.userId
    );
    await project.save();

    return sendSuccess(res, 200, "Member removed successfully.");
  } catch (error) {
    return sendError(res, 500, "Failed to remove member.");
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
  addMember,
  removeMember,
};