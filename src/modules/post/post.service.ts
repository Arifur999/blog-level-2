import { Result } from "pg";
import {
  commentStatus,
  Post,
  postStatus,
} from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getAllPosts = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
  page,
  limit,
  skip,
  sort,
  order,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: postStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sort: string;
  order: string;
}) => {
  const andConditions: PostWhereInput[] = [];
  if (search) {
    andConditions.push({
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ],
    });
  }

  if (tags.length > 0) {
    andConditions.push({ tags: { hasEvery: tags as string[] } });
  }

  if (typeof isFeatured === "boolean") {
    andConditions.push({ isFeatured });
  }

  if (status) {
    andConditions.push({ status });
  }

  if (authorId) {
    andConditions.push({ authorId });
  }

  const result = await prisma.post.findMany({
    take: limit,
    skip: skip,
    where: {
      AND: andConditions,
    },
    orderBy: { [sort]: order },

    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  const totalCount = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    posts: result,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };

  return result;
};

const getPostById = async (postId: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id: postId },
      data: {
        viewCount: { increment: 1 },
      },
    });

    const postData = await tx.post.findUnique({
      where: { id: postId },
      include: {
        comments: {
          where: { parentId: null, status: commentStatus.APPROVED },

          orderBy: {
            createdAt: "desc",
          },
          include: {
            replies: {
              where: {
                status: commentStatus.APPROVED,
              },
              orderBy: {
                createdAt: "asc",
              },
              include: {
                replies: {
                  where: {
                    status: commentStatus.APPROVED,
                  },
                  orderBy: {
                    createdAt: "asc",
                  },
                },
              },
            },
          },
        },

        _count: {
          select: { comments: true },
        },
      },
    });
    return postData;
  });
};

const getMyPosts = async (authorId: string) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  const posts = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  //   const total = await prisma.post.count({
  //     where:{
  //         authorId
  //     }
  // });

  // -------------OR-----------------//

  const total = await prisma.post.aggregate({
    _count: {
      id: true,
    },
  });
  //---------**-------------//

  return {
    data: posts,
    total,
  };
};

const updatePost = async (
  postId: string,
  data: Partial<Post>,
  authorId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
    select: { id: true, authorId: true },
  });
  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("Unauthorized to update this post");
  }

  if (!isAdmin) {
    delete data.isFeatured;
  }

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data,
  });
  return updatedPost;
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
    select: { id: true, authorId: true },
  });

  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("Unauthorized to delete this post");
  }

  return await prisma.post.delete({
    where: { id: postId },
  });
};

const getStats = async () => {
  // const totalPosts = await prisma.post.count();
  // const featuredPosts = await prisma.post.count({
  //   where: { isFeatured: true }
  // });
  // const draftPosts = await prisma.post.count({
  //   where: { status: postStatus.DRAFT }
  // });
  // return {
  //   totalPosts,
  //   featuredPosts,
  //   draftPosts,
  // };

  //----------------------------------//

  return await prisma.$transaction(async (tx) => {
    const [
      totalPostsPromise,
      featuredPostsPromise,
      publishedPostsPromise,
      draftPostsPromise,
      totalCount,
      approvedComments,
      totalUser,
      adminCount,
      totalViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: { isFeatured: true },
      }),
      await tx.post.count({
        where: { status: postStatus.PUBLISHED },
      }),
      await tx.post.count({
        where: { status: postStatus.DRAFT },
      }),
      await tx.post.count({
        where: { status: postStatus.ARCHIVED },
      }),
      await tx.comment.count({
        where: {
          status: commentStatus.APPROVED,
        },
      }),
      await tx.user.count(),
      await tx.user.count({
        where: {
          role: "ADMIN",
        },
      }),

      await tx.post.aggregate({
        _sum: {
          viewCount: true,
        },
      }),


    ]);

    return {
      totalPostsPromise,
      featuredPostsPromise,
      publishedPostsPromise,
      draftPostsPromise,
      approvedComments,
      totalCount,
      totalUser,
      adminCount,
      totalViews: totalViews._sum.viewCount || 0,

    };
  });
};

export const PostService = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  getStats,
};
