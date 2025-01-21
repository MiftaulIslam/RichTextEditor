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
const getArticles = catchAsync(async (req, res, next) => {
  try {
    const articles = await _articlesRepository.findMany();
    sendResponse(res, {
      success: true,
      message: "Articles retrieved successfully",
      statusCode: OK,
      data: articles,
    });
  } catch (error) {
    return next(
      new ErrorHandler("Internal Server Error", INTERNAL_SERVER_ERROR),
    );
  }
});

const addArticle = catchAsync(async (req: AuthenticatedRequest, res, next) => {
  const { content } = req.body;
  console.log(req.body);
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



export const ArticlesControllers = { getArticles, addArticle, updateArticle };
