import { email } from "better-auth/*";
import e from "express";
import { UserRole } from "../middleware/auth";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
  try {
    const adminData = {
      name: "Arif777",
      email: "arr96777777@gmail.com",
      role: UserRole.ADMIN,
      password: "SecureP@ssw0rd!",
      emailVerified: true,
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
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );


    console.log(signUpAdmin);
    if (signUpAdmin.ok) {
        await prisma.user.update({
            where: { email: adminData.email },
            data: { emailVerified: true },
        });
      console.log("Admin user successfully created.");
    } else {
      console.error("Failed to create admin user.");
    }

  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}

seedAdmin();
