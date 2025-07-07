#!/usr/bin/env node

/**
 * Add demo user to MongoDB Atlas database
 * Run this script to create a demo user for testing
 */

import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const addDemoUser = async () => {
  try {
    // Connect to MongoDB Atlas
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      console.log("❌ MONGO_URL not found in environment variables");
      return;
    }

    await connectDB(mongoUrl);
    console.log("✅ Connected to MongoDB Atlas");

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: "gudiya@gmail.com" });
    if (existingUser) {
      console.log("ℹ️  User gudiya@gmail.com already exists");
      return;
    }

    // Create demo user
    const hashedPassword = await bcrypt.hash("gudiya", 10);

    const demoUser = await User.create({
      name: "Gudiya",
      email: "gudiya@gmail.com",
      password: hashedPassword,
      location: "My City",
    });

    console.log("✅ User created successfully!");
    console.log("📧 Email: gudiya@gmail.com");
    console.log("🔑 Password: gudiya");
    console.log("👤 Name:", demoUser.name);

    process.exit(0);
  } catch (error) {
    console.log("❌ Error creating user:", error.message);
    process.exit(1);
  }
};

addDemoUser();
