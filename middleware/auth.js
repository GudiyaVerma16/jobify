import jwt from "jsonwebtoken";
import { UnAuthenticatedError } from "../errors/index.js";

const auth = async (req, res, next) => {
  const token = req.cookies.token;

  console.log("🔐 Auth middleware - Cookies:", req.cookies);
  console.log("🔐 Auth middleware - Token:", token ? "Present" : "Missing");

  if (!token) {
    console.log("❌ No token found in cookies");
    throw new UnAuthenticatedError("Authentication Invalid");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified successfully, userId:", payload.userId);
    const testUser = payload.userId === "63628d5d178e918562ef9ce8";
    req.user = { userId: payload.userId, testUser };
    next();
  } catch (error) {
    console.log("❌ Token verification failed:", error.message);
    throw new UnAuthenticatedError("Authentication Invalid");
  }
};

export default auth;
