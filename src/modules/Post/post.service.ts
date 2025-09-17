import { Post, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

const createPost = async (payload: Prisma.PostCreateInput): Promise<Post> => {
  const result = await prisma.post.create({
    data: payload,
    include: {
      // author: true // it will show the author name. just Author true will retrieve all the field value including password
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return result;
};

// get all posts
const getAllPosts = async ({
  page = 1,
  limit = 10,
  search,
  isFeatured,
  tags,
  sortBy,
  orderBy,
}: {
  page?: number;
  limit?: number;
  search?: string;
  isFeatured?: boolean;
  tags?: string[];
  sortBy?: string;
  orderBy?: string;
}) => {
  const skip = (page - 1) * limit;

  console.log({ isFeatured });
  const where: any = {
    AND: [
      search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      },
      typeof isFeatured === "boolean" && { isFeatured },
      tags && tags.length > 0 && { tags: { hasEvery: tags } },
    ].filter(Boolean),
  };

  const result = await prisma.post.findMany({
    skip,
    take: limit,
    where,
    orderBy: sortBy
      ? { [sortBy as string]: orderBy === "desc" ? "desc" : "asc" }
      : undefined,
  });

  const total = await prisma.post.count({ where });

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      //if per page contain 10 data and query data has 15 post (15 / 10) = 1.5[total page 2]
    },
  };
};

// get single posts
const getPostById = async (id: number) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({ //prisma -> tx
      where: { id },
      data: {
        view: {
          increment: 1,
        },
      },
    });

    return await tx.post.findUnique({
      where: {id},
      include: {
        author:{
          select: {
            id: true,
            name: true
          }
        }
      },
    });
  });
};

// update posts
const updateUser = async (id: number, payload: Partial<Post>) => {
  const result = await prisma.post.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

// delete posts
const deletePost = async (id: number) => {
  await prisma.post.delete({
    where: {
      id,
    },
  });
  return "Post deleted Successfully";
};

const getBlogStat = async () => {
    return await prisma.$transaction(async (tx) => {
        const aggregates = await tx.post.aggregate({
            _count: true,
            _sum: { view: true },
            _avg: { view: true },
            _max: { view: true },
            _min: { view: true },
        })

        const featuredCount = await tx.post.count({
            where: {
                isFeatured: true
            }
        });

        const topFeatured = await tx.post.findFirst({
            where: { isFeatured: true },
            orderBy: { view: "desc" }
        })

        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7)

        const lastWeekPostCount = await tx.post.count({
            where: {
                createdAt: {
                    gte: lastWeek
                }
            }
        })

        return {
            stats: {
                totalPosts: aggregates._count ?? 0,
                totalViews: aggregates._sum.view ?? 0,
                avgViews: aggregates._avg.view ?? 0,
                minViews: aggregates._min.view ?? 0,
                maxViews: aggregates._max.view ?? 0
            },
            featured: {
                count: featuredCount,
                topPost: topFeatured,
            },
            lastWeekPostCount
        };
    })
}

export const PostService = {
  createPost,
  getAllPosts,
  getPostById,
  updateUser,
  deletePost,
  getBlogStat
};
