import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import createHttpError from "http-errors";
import { Prisma } from "@prisma/client";
import {
  postCreateSchema,
  postSearchSchema,
} from "../validations/postValidation.js";

export const getAllPosts = async (req: Request, res: Response) => {
  const {
    page = 1,
    search,
    perPage = 15,
    sortBy = "eventDate",
    sortOrder = "desc",
  } = postSearchSchema.parse(req.query);

  const skip = (+page - 1) * +perPage;

  const orderBy: Prisma.PostOrderByWithRelationInput = {
    [sortBy as string]: sortOrder,
  };

  const where: Prisma.PostWhereInput = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      skip,
      take: +perPage,
      orderBy,
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.post.count({ where }),
  ]);

  res.status(200).json({
    status: "success",
    posts,
    total,
    totalPages: Math.ceil(total / +perPage),
    hasNext: page * perPage < total,
    hasPrev: page > 1,
  });
};

export const createPost = async (req: Request, res: Response) => {
  const data = postCreateSchema.parse(req.body);

  const { title, content, published, eventDate, rating } = data;

  const post = await prisma.post.create({
    data: {
      title,
      rating,
      content,
      authorId: req.user!.id,
      published: published ?? false,
      eventDate: eventDate ?? new Date(),
    },
  });
  res.status(201).json({
    status: "success",
    post,
  });
};

export const getUserPosts = async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany({
    where: { authorId: req.user!.id },
  });

  res.status(200).json({
    status: "success",
    posts,
  });
};

export const deletePost = async (req: Request, res: Response) => {
  const { postId } = req.params;

  const post = await prisma.post.findUnique({
    where: { id: postId as string },
  });
  if (!post) {
    throw createHttpError(404, "Post not found");
  }
  if (req.user!.id !== post.authorId) {
    throw createHttpError(403, "You can only delete you own posts");
  }

  await prisma.post.delete({
    where: { id: postId as string, authorId: req.user!.id },
  });

  res.status(204).send();
};

export const updatePost = async (req: Request, res: Response) => {
  const { postId } = req.params;

  const post = await prisma.post.findUnique({
    where: { id: postId as string },
  });

  if (!post) {
    throw createHttpError(404, "Post not found");
  }

  if (req.user!.id !== post.authorId) {
    throw createHttpError(403, "You can update only your own posts");
  }

  const update = await prisma.post.update({
    where: { id: postId as string },
    data: req.body,
  });

  res.status(200).json({
    status: "success",
    post: update,
  });
};
