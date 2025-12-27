import { Request, Response } from "express";
import { PostService } from "./post.service";
import { Post } from "../../../generated/prisma/client";

const createPost = async (req:Request, res:Response) => {
    // Logic to create a new post


    try {
        const result = await PostService.createPost(req.body as Omit<Post, "id" | "createdAt" | "updatedAt">);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to create post" });
        return;     
    }
   
}

export const PostController = {
    createPost,
};  