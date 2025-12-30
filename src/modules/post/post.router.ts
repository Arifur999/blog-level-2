import express, { Request, Response, Router } from "express";
import { PostController } from "./post.controller";
import { auth } from "../../lib/auth";

const router = express.Router();


export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",    
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role?: string | undefined;
        status?: string | undefined;
        phone?: string | undefined;
        emailVerified: boolean;
      };
    }
  }
}

const authRole = (...role: UserRole[]) => {
  return async (req: Request, res: Response, next: Function) => {
    try {
      const session = await auth.api.getSession((Headers = req.headers as any));

      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!session.user.emailVerified) {
        return res.status(403).json({ message: "Email not verified" });
      }


      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role ?? undefined,
        status: session.user.status ?? undefined,
        phone: session.user.phone ?? undefined,
        emailVerified: session.user.emailVerified,
}

if (role.length && !role.includes(session.user.role as UserRole)) {
        return res.status(403).json({ message: "Forbidden" });
      }
next();


      console.log(session);
    } catch (error) {
      next(error);
    }
  };
};

// Example route for posts
router.post("/", authRole(UserRole.ADMIN, UserRole.USER), PostController.createPost);

export const PostRouter = router;
