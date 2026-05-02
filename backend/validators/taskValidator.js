const { body } = require("express-validator");

const taskValidator = [
  body("title")
    .trim()
    .notEmpty().withMessage("Task title is required")
    .isLength({ min: 2 }).withMessage("Title must be at least 2 characters"),

  body("status")
    .optional()
    .isIn(["todo", "in-progress", "done"])
    .withMessage("Status must be todo, in-progress, or done"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),

  body("dueDate")
    .optional()
    .isISO8601().withMessage("Invalid date format"),
];

const statusValidator = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["todo", "in-progress", "done"])
    .withMessage("Status must be todo, in-progress, or done"),
];

module.exports = { taskValidator, statusValidator };