import { Request, Response } from "express";
import { PostService } from "./post.service";
import { Post, postStatus } from "../../../generated/prisma/client";

const createPost = async (req: Request, res: Response) => {
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
};

 const getAllPosts = async (req: Request, res: Response) => {
  // Logic to get all posts
  try {
    const { search } = req.query;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const status = req.query.status as postStatus | undefined;
    const authorId = req.query.authorId as string | undefined;
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;

      const page =Number( req.query.page ?? 1) ;
      const limit = Number(req.query.limit ?? 10);
      const sort = req.query.sort as string | undefined;
      const order = req.query.order as string | undefined;

      const skip = (page - 1) * limit;

    const result = await PostService.getAllPosts({
      search: search as string | undefined,
      tags,
      isFeatured,
      status,
      authorId,
      page,
        limit,
        skip,
        sort ,
        order,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to get posts" });
    return;
  }
};

export const PostController = {
  createPost,
  getAllPosts,
};
