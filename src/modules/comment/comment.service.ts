const createComment=async(payload:{
    content: string;
    userId: string;
    postId: string;
    parentId?: string;
})=>{
    console.log("Creating comment with payload:", payload);
};

export const CommentService={
    createComment
};