const express = require("express");
const router = express.Router();
const { signup, login, getMe } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { signupValidator, loginValidator } = require("../validators/authValidator");

router.post("/signup", signupValidator, signup);
router.post("/login",  loginValidator,  login);
router.get("/me",      protect,         getMe);

module.exports = router;