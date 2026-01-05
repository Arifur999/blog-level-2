import express  from "express";
import { CommentController } from "./comment.controller";
import authRole, { UserRole } from "../../middleware/auth";


const router = express.Router();

router.get("/author/:authorId",
    CommentController.getCommentsByAuthor);

router.get("/:commentId",
    CommentController.getCommentsById);

router.post("/",
    authRole(UserRole.USER, UserRole.ADMIN),
     CommentController.createComment);

router.delete("/:commentId",
    authRole(UserRole.ADMIN, UserRole.USER),
    CommentController.deleteComment);

export const commentRouter = router;
