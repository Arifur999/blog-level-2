import express  from "express";
import { CommentController } from "./comment.controller";
import authRole, { UserRole } from "../../middleware/auth";


const router = express.Router();

router.get("/:commentId",
    CommentController.getCommentsById);

router.post("/",
    authRole(UserRole.USER, UserRole.ADMIN),
     CommentController.createComment);



export const commentRouter = router;
