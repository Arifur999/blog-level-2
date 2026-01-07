import express  from "express";
import { PostController } from "./post.controller";
import authRole, { UserRole } from "../../middleware/auth";


const router = express.Router();


router.get("/", PostController.getAllPosts);
router.get("/:id", PostController.getPostById);
router.get("/my-posts", authRole(UserRole.USER, UserRole.ADMIN), PostController.getMyPosts);
router.get("/stats", authRole(UserRole.ADMIN), PostController.getStats);    

router.patch("/:postId", authRole(UserRole.USER, UserRole.ADMIN), PostController.updatePost);
router.delete("/:postId", authRole(UserRole.USER, UserRole.ADMIN), PostController.deletePost);  
// Example route for posts
router.post("/", authRole(UserRole.ADMIN, UserRole.USER), PostController.createPost);

export const PostRouter = router;
