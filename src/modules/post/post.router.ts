import express, { Request, Response, Router } from 'express';
import { PostController } from './post.controller';
import { auth } from '../../lib/auth';

const router = express.Router();

const authRole=(...role:any)=>{   
   return async(req:Request,res:Response,next:Function)=>{
        try {
           const session = await auth.api.getSession(Headers=req.headers as any);
            console.log(session); 
        } catch (error) {
            next(error);
        } 

}
};

// Example route for posts
router.post('/',authRole("ADMIN","USER"), PostController.createPost );

 



export const PostRouter = router;