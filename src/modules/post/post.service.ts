import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost =async(data:Omit<Post, "id" | "createdAt" | "updatedAt">, userId:string)=>{

    const result =await prisma.post.create({
        data:{
            ...data,
            authorId:userId,
        }
    });
    return result;  
    
    
    
}   

const getAllPosts = async(payload: { search?: string | undefined })=>{
    const result = await prisma.post.findMany({
        where: payload.search ? {
            OR: [
                { title: { contains: payload.search, mode: 'insensitive' } },   
                { content: { contains: payload.search, mode: 'insensitive' } },
                {tags: { has: payload.search } }
            ]
        } : {}
    });
    return result;
}   
export const PostService = {
    createPost,
    getAllPosts
};