import { Request, Response } from "express";
import { PostService } from "./post.service";
import { Post, postStatus } from "../../../generated/prisma/client";
import { paginationSortingHelper } from "../../helper/peginationSorting";
import { UserRole } from "../../middleware/auth";

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
      const {postId} = req.params;
      const user = req.user;
      if (!postId) {
           throw new Error("Post not found");
        }

        if (!user) {
           throw new Error("Unauthorized");
        }

    const isAdmin = user.role===UserRole.ADMIN
    const result = await PostService.updatePost(postId, req.body, user?.id as string, isAdmin);
      res.status(200).json(result);
    }
    catch (error) {
      res.status(500).json({ error: "Failed to update post" });
      return;
    }
};

const deletePost = async (req: Request, res: Response) => {
    // Logic to delete a post    
    try {
      const {postId} = req.params;
      const user = req.user;
      if (!postId) {
            throw new Error("Post not found");
        }
        if (!user) {
           throw new Error("Unauthorized");
        }
    const isAdmin = user.role===UserRole.ADMIN
    const result = await PostService.deletePost( postId, user?.id as string, isAdmin);
      res.status(200).json(result);
    }
    catch (error) {
      res.status(500).json({ error: "Failed to delete post" });
      return;
    }
};

const getStats = async (req: Request, res: Response) => {
    // Logic to get post statistics    
    try { 
    const result = await PostService.getStats();
      
      res.status(200).json(result);
    }
    catch (error) {
      res.status(500).json({ error: "Failed to get post statistics" });
      return;
    }
};

const getTotalViews = async (req: Request, res: Response) => {
    // Logic to get total views    
    try { 
    const result = await PostService.getTotalViews();
    res.status(200).json(result);
    }
    catch (error) {
      res.status(500).json({ error: "Failed to get total views" });
      return;
    }
};  


export const PostController = {
  createPost,
  getAllPosts,
    getPostById,
    getMyPosts,
    updatePost,
    deletePost,
    getStats,
    getTotalViews
};
