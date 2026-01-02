import { email } from "better-auth/*";
import e from "express";
import { UserRole } from "../middleware/auth";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
  try {
    const adminData = {
      name: "Admin User",
      email: "admin@example.com",
      role: UserRole.ADMIN,
      password: "SecureP@ssw0rd!",
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("Admin user already exists");
    }

    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-in/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}
