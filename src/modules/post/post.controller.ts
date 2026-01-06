import { Request, Response } from "express";
import { PostService } from "./post.service";
import { Post, postStatus } from "../../../generated/prisma/client";
import { paginationSortingHelper } from "../../helper/peginationSorting";

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

    

      const { page, limit, sort , order, skip } = paginationSortingHelper(req.query);

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

const getMyPosts = async (req: Request, res: Response) => {
    // Logic to get a post by ID    
    try {
      const user = req.user;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

   const result = await PostService.getMyPosts(user?.id as string);
      res.status(200).json(result);
    }
    catch (error) {
      res.status(500).json({ error: "Failed to get post" });
      return;
    }
};
const getPostById = async (req: Request, res: Response) => {
    // Logic to get a post by ID    
    try {
      const postId = req.params.id;
    //   const result = await PostService.getPostById(postId);     
        if (!postId) {
           throw new Error("Post not found");
        }
   const result = await PostService.getPostById(postId);
      res.status(200).json(result);
    }
    catch (error) {
      res.status(500).json({ error: "Failed to get post" });
      return;
    }
};

const updatePost = async (req: Request, res: Response) => {
    // Logic to update a post    
    try { 
      const postId = req.params.id;
      const user = req.user;
      if (!postId) {
           throw new Error("Post not found");
        }
    const result = await PostService.updatePost(postId, req.body, user?.id as string);
      res.status(200).json(result);
    }
    catch (error) {
      res.status(500).json({ error: "Failed to update post" });
      return;
    }
};

export const PostController = {
  createPost,
  getAllPosts,
    getPostById,
    getMyPosts,
    updatePost,
};
