const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// POST /api/auth/signup
router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("name").trim().notEmpty().withMessage("Name is required"),
  ],
  authController.signup
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  authController.login
);

// GET /api/auth/profile
router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;
