// articles.controller.ts

import { article_tags, articles, PrismaClient, tags } from "@prisma/client";
import { Repository } from "../../repository/implementation/Repository";
import catchAsync from "../../utils/CatchAsyncError";
import sendResponse from "../../utils/SendResponse";
import ErrorHandler from "../../utils/ErrorHandler";
import {
  OK,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
} from "../../utils/Http-Status";
import { v4 as uuidv4 } from "uuid";
import { AuthenticatedRequest } from "../../middlewares/isAuthenticate";
import axios from "axios";
import { imgbb_api_key } from "../../config/config";
const prisma = new PrismaClient();
//User repository
const _articlesRepository = new Repository<articles>("articles");
const _tagsRepository = new Repository<tags>("tags");
const _articleTagsRepository = new Repository<article_tags>("article_tags");
const getArticles = catchAsync(async (req: AuthenticatedRequest, res, next) => {
  const { userId } = req.query; // Check for userId in the query params
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Build the query dynamically based on the presence of userId
  const query: any = userId ? { where: { author_id: userId } } : {};
  query.include = {
    User: {
      select: {
        name: true,
        avatar: true,
        domain: true
      }
    },
    likes: true,
    comments: true,
    // bookmarks: true
  };
  query.orderBy = {
    created_at: 'desc'
  };
  query.skip = skip;
  query.take = limit;

  // Fetch articles based on the query
  const articles = await _articlesRepository.findMany(query);

  // Count total articles for pagination
  const totalArticles = await _articlesRepository.count(userId ? { where: { author_id: userId } } : {});

  sendResponse(res, {
    success: true,
    statusCode: OK,
    message: userId ? "User articles retrieved successfully" : "All articles retrieved successfully",
    data: {
      articles,
      pagination: {
        total: totalArticles,
        page,
        pages: Math.ceil(totalArticles / limit),
        limit
      }
    }
  });
});


const addArticle = catchAsync(async (req: AuthenticatedRequest, res, next) => {
  const { content } = req.body;
  if (!content) return next(new ErrorHandler("Field missing", BAD_REQUEST));
  const uuId = uuidv4();
  const article = await _articlesRepository.create({
    id: uuId,
    title: "Untitled-Article",
    slug: `Untitled-Article-${uuId}`,
    author_id: req.id,
    content,
  });
  sendResponse(res, {
    success: true,
    message: "Articles saved as a draft",
    statusCode: OK,
    data: article,
  });
});

const updateArticle = catchAsync(async (req, res, next) => {
  const { articleId } = req.params;
  const body = req.body;
  const tags = JSON.parse(req.body.tags)
  let image = null;

  // Upload avatar to imgbb if provided
  if (req.file) {
    
    const formData = new FormData();
    formData.append("image", req.file.buffer.toString("base64"));
    const imgbbResponse = await axios.post(
      `https://api.imgbb.com/1/upload?key=${imgbb_api_key}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    image = imgbbResponse.data.data.url;
  }

  const updatedArticle = await _articlesRepository.update(
    { where: { id: articleId } },
    {
      title: body.title,
      slug: `${body.title.split(" ").join("-")}-${articleId}`,
      thumbnail: image,
      short_preview: body.short_preview,
      publishedAt: body.publishAt ? new Date(body.publishAt) : null,
      is_published: body.publishAt ? false : true,
      content: body.content && body.content,
    },
  );
  // Handle tags if provided
  if (tags && Array.isArray(tags)) {
    // Ensure tags are unique
    const uniqueTags = [
      ...new Set(tags.map((tag) => tag.trim().toLowerCase())),
    ];

    // Find or create tags
    const tagRecords = await Promise.all(
      uniqueTags.map(async (tagName) => {
        const existingTag = await _tagsRepository.findUnique({
          where: { name: tagName },
        });
        if (existingTag) {
          return existingTag;
        }
        return await _tagsRepository.create({
          id: uuidv4(),
          name: tagName,
        });
      }),
    );

    // Map tag IDs
    const tagIds = tagRecords.map((tag: any) => tag.id);

    // Remove existing associations in article_tags
    await _articleTagsRepository.deleteMany({
      where: { article_id: articleId },
    });

    // Add new associations in article_tags
    await Promise.all(
      tagIds.map(async (tagId: string) => {
        return await _articleTagsRepository.create({
          article_id: articleId,
          tag_id: tagId,
        });
      }),
    );
  }
  sendResponse(res, {
    success: true,
    message: "Article updated successfully",
    statusCode: OK,
    data: updatedArticle,
  });
});

// const getUserArticles = catchAsync(async (req: AuthenticatedRequest, res, next) => {
//   const { userId } = req.params;
//   const page = parseInt(req.query.page as string) || 1;
//   const limit = parseInt(req.query.limit as string) || 10;
//   const skip = (page - 1) * limit;

//   const articles = await _articlesRepository.findMany({
//     where: { user_id: userId },
//     include: {
//       user: {
//         select: {
//           name: true,
//           avatar: true,
//           domain: true
//         }
//       },
//       likes: true,
//       comments: true,
//       bookmarks: true
//     },
//     orderBy: {
//       created_at: 'desc'
//     },
//     skip,
//     take: limit
//   });

//   const totalArticles = await _articlesRepository.count({
//     where: { user_id: userId }
//   });

//   sendResponse(res, {
//     success: true,
//     statusCode: OK,
//     message: "User articles retrieved successfully",
//     data: {
//       articles,
//       pagination: {
//         total: totalArticles,
//         page,
//         pages: Math.ceil(totalArticles / limit),
//         limit
//       }
//     }
//   });
// });

export const ArticlesControllers = { getArticles, addArticle, updateArticle };
