import { Request, Response } from "express";
import { PostService } from "./post.service";
import { Post } from "../../../generated/prisma/client";

const createPost = async (req:Request, res:Response) => {
    // Logic to create a new post


    try {
        const user = req.user;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const result = await PostService.createPost(req.body, user?.id as string);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to create post" });
        return;     
    }
   
}

export const PostController = {
    createPost,
};  