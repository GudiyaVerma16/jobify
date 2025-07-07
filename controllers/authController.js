import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import attachCookie from "../utils/attachCookie.js";
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("please provide all values");
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }
  const user = await User.create({ name, email, password });

  const token = user.createJWT();
  attachCookie({ res, token });
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },

    location: user.location,
  });
};
const login = async (req, res) => {
  console.log("🔐 Login endpoint called");
  console.log("🔐 Request body:", {
    email: req.body.email,
    password: req.body.password ? "***" : "missing",
  });
  console.log("🔐 Request headers:", req.headers);

  const { email, password } = req.body;
  if (!email || !password) {
    console.log("❌ Login failed: Missing email or password");
    throw new BadRequestError("Please provide all values");
  }

  console.log("🔐 Looking up user with email:", email);
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    console.log("❌ Login failed: User not found");
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  console.log("🔐 User found, checking password");
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    console.log("❌ Login failed: Invalid password");
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  console.log("🔐 Password correct, creating JWT token");
  const token = user.createJWT();
  console.log("🔐 Login successful for user:", user.email);
  console.log("🔐 Setting cookie with token:", token.substring(0, 20) + "...");

  attachCookie({ res, token });

  console.log("🔐 Cookie set, response headers:", res.getHeaders());
  console.log("🔐 Set-Cookie header:", res.getHeader("Set-Cookie"));

  user.password = undefined;

  console.log("🔐 Sending successful login response");
  res.status(StatusCodes.OK).json({ user, location: user.location });
};
const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  const token = user.createJWT();
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

export { register, login, updateUser, getCurrentUser, logout };
