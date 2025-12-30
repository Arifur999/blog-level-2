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


const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
const info = await transporter.sendMail({
  from: `"blog App" <${process.env.GM_ID}>`, // sender address
  to: user.email, // list of receivers
  subject: "Verify Your Email Address", // Subject line
  html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#4f46e5; padding:20px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:24px;">
                Verify Your Email
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333; font-size:16px; line-height:1.6;">
              
              <p>Hello <strong>${user.name || "User"}</strong>,</p>

              <p>
                Thank you for creating an account with us.  
                Please verify your email address by clicking the button below.
              </p>

              <!-- Button -->
              <div style="text-align:center; margin:30px 0;">
                <a href="${verificationUrl}" 
                   style="background:#4f46e5; color:#ffffff; text-decoration:none; padding:14px 30px; border-radius:6px; font-weight:bold; display:inline-block;">
                  Verify Email Address
                </a>
              </div>

              <p>
                If the button doesn’t work, copy and paste the following link into your browser:
              </p>

              <p style="word-break:break-all; background:#f1f5f9; padding:12px; border-radius:4px; font-size:14px;">
                ${verificationUrl}
              </p>

              <p>
                This verification link will expire in <strong>24 hours</strong>.
              </p>

              <p>
                If you did not create this account, please ignore this email.
              </p>

              <p style="margin-top:30px;">
                Regards,<br />
                <strong>Your App Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc; padding:15px; text-align:center; font-size:13px; color:#6b7280;">
              © ${new Date().getFullYear()} Your App Name. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`,
});



    },
  },
});
