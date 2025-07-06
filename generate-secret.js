#!/usr/bin/env node

/**
 * Generate a secure JWT secret for the Jobify application
 * Run this script to generate a random secret key
 */

import crypto from "crypto";

// Generate a random 64-byte hex string
const secret = crypto.randomBytes(64).toString("hex");

console.log("🔐 Generated JWT Secret:");
console.log("=".repeat(50));
console.log(secret);
console.log("=".repeat(50));
console.log("\n📝 Copy this secret and add it to your .env file:");
console.log("JWT_SECRET=" + secret);
console.log(
  "\n⚠️  Keep this secret secure and never commit it to version control!"
);
