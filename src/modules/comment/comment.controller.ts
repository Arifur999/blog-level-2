import { Request, Response } from "express";
import { CommentService } from "./comment.service";


const createComment = async (req: Request, res: Response) => {


  try {
    const user = req.user;
    req.body.authorId = user?.id;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await CommentService.createComment(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create comment" });
    return;
  }
};

const getCommentsById = async (req: Request, res: Response) => {


  try {
    const { commentId } = req.params;
    const result = await CommentService.getCommentsById(commentId as string);
    res.status(200).json(result);

    
  } catch (error) {
    res.status(500).json({ error: "Failed to create comment" });
    return;
  }
};
const getCommentsByAuthor = async (req: Request, res: Response) => {


  try {
    const { authorId } = req.params;
    const result = await CommentService.getCommentsByAuthor(authorId as string);
    res.status(200).json(result);

    
  } catch (error) {
    res.status(500).json({ error: "Failed to create comment" });
    return;
  }
};
const deleteComment = async (req: Request, res: Response) => {


  try {
    const user = req.user;
    const { commentId } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await CommentService.deleteComment(commentId as string, user?.id as string);
    res.status(200).json(result);

    
  } catch (error) {
    res.status(500).json({ error: "Failed to create comment" });
    return;
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const data = req.body;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await CommentService.updateComment(commentId as string, data, user?.id as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update comment" });
    return;
  }
};


export const CommentController = {
    createComment,
    getCommentsById,
    getCommentsByAuthor,
    deleteComment,
    updateComment
};