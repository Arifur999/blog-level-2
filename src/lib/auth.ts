import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
const nodemailer = require("nodemailer");
// If your Prisma file is located elsewhere, you can change the path




const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.GM_ID,
    pass: process.env.GM_PASS,
  },
});


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL || "http://localhost:3000"],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
   
  },
   emailAndPassword: {
      enabled: true,
   
      autoSignIn: false,
      requireEmailVerification: true,
    },
emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {


        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}&email=${encodeURIComponent(user.email)}`;
      console.log(`Send verification email to ${user.email} with URL: ${url} and token: ${token}`);
    
     const info = await transporter.sendMail({
    from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
    to: "arifur.rahman.we@gmail.com",
    subject: "Hello ✔",
    text: "Hello world?", // Plain-text version of the message
    html: "<b>Hello world?</b>", // HTML version of the message
  });
    
    },
  },
});
