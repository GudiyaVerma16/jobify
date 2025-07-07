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
  console.log("🧪 Test endpoint called");
  console.log("🧪 Request cookies:", req.cookies);
  console.log("🧪 Request headers:", req.headers);

  res.json({
    message: "Server is running",
    environment: process.env.NODE_ENV,
    hasMongoUrl: !!process.env.MONGO_URL,
    hasJwtSecret: !!process.env.JWT_SECRET,
    cookies: req.cookies,
    headers: req.headers,
  });
});

// Test endpoint to set a cookie
router.get("/test-cookie", (req, res) => {
  console.log("🍪 Test cookie endpoint called");

  const testToken = "test-token-123";
  res.cookie("test-cookie", testToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  console.log("🍪 Test cookie set");
  console.log("🍪 Set-Cookie header:", res.getHeader("Set-Cookie"));

  res.json({
    message: "Test cookie set",
    cookieValue: testToken,
    environment: process.env.NODE_ENV,
  });
});

// Test endpoint to check if cookies are being sent
router.get("/check-cookies", (req, res) => {
  console.log("🔍 Check cookies endpoint called");
  console.log("🔍 Request cookies:", req.cookies);
  console.log("🔍 Request headers:", req.headers);

  res.json({
    message: "Cookies check",
    cookies: req.cookies,
    hasToken: !!req.cookies.token,
    hasTestCookie: !!req.cookies["test-cookie"],
    environment: process.env.NODE_ENV,
  });
});

router.route("/register").post(apiLimiter, register);
router.route("/login").post(apiLimiter, login);
router.get("/logout", logout);

router.route("/updateUser").patch(authenticateUser, testUser, updateUser);
router.route("/getCurrentUser").get(authenticateUser, getCurrentUser);

export default router;
