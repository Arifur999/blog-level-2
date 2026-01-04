import { Post, postStatus } from "../../../generated/prisma/client";
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
    });
    return postData;
  });
};

export const PostService = {
  createPost,
  getAllPosts,
  getPostById,
};
