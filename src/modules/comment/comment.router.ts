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

router.patch("/:commentId",
    authRole(UserRole.ADMIN, UserRole.USER),
    CommentController.updateComment);
    
router.patch("/moderate/:commentId",
    authRole(UserRole.ADMIN),
    CommentController.moderateComment);
        

export const commentRouter = router;
