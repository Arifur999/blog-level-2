import express  from "express";
import { PostController } from "./post.controller";

import authRole, { UserRole } from "../../middleware/auth";

const router = express.Router();




// Example route for posts
router.post("/", authRole(UserRole.ADMIN, UserRole.USER), PostController.createPost);

export const PostRouter = router;
