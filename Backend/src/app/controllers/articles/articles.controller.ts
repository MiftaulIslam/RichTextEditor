// articles.controller.ts

import { article_tags, articles, PrismaClient, tags, User } from "@prisma/client";
import { Repository } from "../../repository/implementation/Repository";
import catchAsync from "../../utils/CatchAsyncError";
import sendResponse from "../../utils/SendResponse";
import ErrorHandler from "../../utils/ErrorHandler";
import {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
} from "../../utils/Http-Status";
import { v4 as uuidv4 } from "uuid";
import { AuthenticatedRequest } from "../../middlewares/isAuthenticate";
import axios from "axios";
import { imgbb_api_key } from "../../config/config";
import { NextFunction, Response } from "express";
const prisma = new PrismaClient();
//User repository
const _articlesRepository = new Repository<articles>("articles");
const _tagsRepository = new Repository<tags>("tags");
const _articleTagsRepository = new Repository<article_tags>("article_tags");
const _userRepository = new Repository<User>("User");

const getArticles = catchAsync(async (req: AuthenticatedRequest, res:Response, next:NextFunction) => {
  const { userId } = req.query;
  const isPublished = req.query.isPublished && JSON.parse(req.query.isPublished as string) ;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Build the query dynamically based on the presence of userId
  const query: any = userId ? { where: { author_id: userId } } : {where: {is_published: isPublished}};
  query.include = {
    User: {
      select: {
        name: true,
        avatar: true,
        domain: true
      }
    },
    likes: true,
    comments: {
      include: {
        User: {
          select: {
            name: true,
            avatar: true,
            domain:true
          },
        },
      },
    },
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

const calculateReadTime = (content: string) => {
  const wordsPerMinute = 225; // average words per minute
  const wordCount = content.split(/\s+/).length; // split content into words by spaces
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
};
const addArticle = catchAsync(async (req: AuthenticatedRequest, res:Response, next:NextFunction) => {
  const { content } = req.body;
  if (!content) return next(new ErrorHandler("Field missing", BAD_REQUEST));
  const uuId = uuidv4();
  const article = await _articlesRepository.create({
    id: uuId,
    title: "Untitled-Article",
    slug: `Untitled-Article-${uuId}`,
    author_id: req.id,
    estimate_reading_time: calculateReadTime(content),
    content,
  });
  sendResponse(res, {
    success: true,
    message: "Articles saved as a draft",
    statusCode: OK,
    data: article,
  });
});

const updateArticle = catchAsync(async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
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

const getArticleBySlug = catchAsync(async (req: AuthenticatedRequest, res:Response, next:NextFunction) => {
  
  const { domain, articleSlug } = req.params;
  const userId = req.query.u;
  // Get user with their article in a single query
  const userWithArticle = await _userRepository.findUnique({
    where: { domain },
    include: {
      follows_follows_following_idToUser: {
        include: {
            User_follows_follower_idToUser: true,
        },
      },
      articles: {
        where: {
          is_published: true
        },
        include: {
          User:true,
          likes: true,
          comments: true
        },
      }
    }
  })as any;

  if (!userWithArticle) return next(new ErrorHandler("User not found", NOT_FOUND));
  if (!userWithArticle.articles.length) return next(new ErrorHandler("Article not found", NOT_FOUND));

  const article = userWithArticle.articles.find((a:any) => a.slug === articleSlug);
  const isFollowing = userWithArticle.follows_follows_following_idToUser.some((follow:any) => 
    follow.User_follows_follower_idToUser.id == userId
  );
  const articles = userWithArticle.articles.filter((a:any) => a.slug != articleSlug)
  sendResponse(res, {
    success: true,
    statusCode: OK,
    message: "Article retrieved successfully",
    data: {
      ...article,
      isFollowing,
      User: {
        id: userWithArticle.id,
        name: userWithArticle.name,
        avatar: userWithArticle.avatar,
        domain: userWithArticle.domain,
        short_bio: userWithArticle.short_bio,
        articles: articles
      }
    }
  });
});

export const ArticlesControllers = { getArticles, addArticle, updateArticle, getArticleBySlug };
