import { prisma } from "../../lib/prisma";

const createComment=async(payload:{
    content: string;
    authorId: string;
    postId: string;
    parentId?: string | null;
})=>{

    await prisma.post.findUniqueOrThrow({
        where:{
            id:payload.postId
        }
    });

    if(payload.parentId){
    await prisma.comment.findUniqueOrThrow({
            where:{
                id:payload.parentId
            }
        });
    }
    return await prisma.comment.create({
       data:payload
    });

};

const getCommentsById=async(id:string)=>{
    return await prisma.comment.findUnique({
        where:{
            id,
            status:"APPROVED"

        },
        include:{
            post:{
                select:{
                    id:true,
                    title:true,
                    viewCount:true
                }
            }
        }
    });
};

const getCommentsByAuthor =async(authorId:string)=>{
    return await prisma.comment.findMany({
        where:{
            authorId
        },
        orderBy:{
            createdAt:"desc"
        },
        include:{
            post:{
                select:{
                    id:true,
                    title:true,
                    viewCount:true
                }
            }
        }
    });
};

const deleteComment=async(commentId:string, authorId:string)=>{
   const commentData= await prisma.comment.findFirst({
        where:{
            id:commentId,
            authorId
        },
        select:{id:true}
   })

   if (!commentData) {
    throw new Error("Comment not found or unauthorized");
   }

return await prisma.comment.delete({
    where:{
        id:commentId    
    }
});
  

}

export const CommentService={
    createComment,
    getCommentsById,
    getCommentsByAuthor,
    deleteComment

};