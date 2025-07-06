import express from "express";
const router = express.Router();

import rateLimiter from "express-rate-limit";
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

import {
  register,
  login,
  updateUser,
  getCurrentUser,
  logout,
} from "../controllers/authController.js";
import authenticateUser from "../middleware/auth.js";
import testUser from "../middleware/testUser.js";

// Test endpoint to check server status and environment variables
router.get("/test", (req, res) => {
  res.json({
    message: "Server is running",
    environment: process.env.NODE_ENV,
    hasMongoUrl: !!process.env.MONGO_URL,
    hasJwtSecret: !!process.env.JWT_SECRET,
    cookies: req.cookies,
    headers: req.headers,
  });
});

router.route("/register").post(apiLimiter, register);
router.route("/login").post(apiLimiter, login);
router.get("/logout", logout);

router.route("/updateUser").patch(authenticateUser, testUser, updateUser);
router.route("/getCurrentUser").get(authenticateUser, getCurrentUser);

export default router;
