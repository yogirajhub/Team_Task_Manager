const { validationResult } = require("express-validator");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// POST /api/auth/signup
const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 422, "Validation failed", errors.array());
  }

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, "Email already registered.");
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    return sendSuccess(res, 201, "Account created successfully.", {
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return sendError(res, 500, "Signup failed. Please try again.");
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 422, "Validation failed", errors.array());
  }

  try {
    const { email, password } = req.body;

    // Must explicitly select password (select: false in schema)
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return sendError(res, 401, "Invalid email or password.");
    }

    const token = generateToken(user._id);

    return sendSuccess(res, 200, "Login successful.", {
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return sendError(res, 500, "Login failed. Please try again.");
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    return sendSuccess(res, 200, "User profile fetched.", { user: req.user });
  } catch (error) {
    return sendError(res, 500, "Could not fetch profile.");
  }
};

module.exports = { signup, login, getMe };