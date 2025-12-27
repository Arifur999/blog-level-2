import express, { Router } from 'express';
import { PostController } from './post.controller';

const router = express.Router();

// Example route for posts
router.post('/posts', PostController.createPost );

 



export const PostRouter = router;