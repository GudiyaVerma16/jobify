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
    const existingUser = await User.findOne({ email: "demo@test.com" });
    if (existingUser) {
      console.log("ℹ️  Demo user already exists");
      return;
    }

    // Create demo user
    const hashedPassword = await bcrypt.hash("demo123", 10);

    const demoUser = await User.create({
      name: "Demo User",
      email: "demo@test.com",
      password: hashedPassword,
      location: "Demo City",
    });

    console.log("✅ Demo user created successfully!");
    console.log("📧 Email: demo@test.com");
    console.log("🔑 Password: demo123");
    console.log("👤 Name:", demoUser.name);

    process.exit(0);
  } catch (error) {
    console.log("❌ Error creating demo user:", error.message);
    process.exit(1);
  }
};

addDemoUser();
