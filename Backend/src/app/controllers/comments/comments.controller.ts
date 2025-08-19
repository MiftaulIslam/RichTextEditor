// comments.controller.ts

import {
  articles,
  comment_likes,
  comments,
  notifications,
  PrismaClient,
  User,
} from "@prisma/client";
import { Repository } from "../../repository/implementation/Repository";
import catchAsync from "../../utils/CatchAsyncError";
import { v4 as uuidv4 } from "uuid";
import sendResponse from "../../utils/SendResponse";
import {
  OK,
  NOT_FOUND,
  UNAUTHORIZED,
} from "../../utils/Http-Status";
import { AuthenticatedRequest } from "../../middlewares/isAuthenticate";
import { io, userSocketMap } from "../../../socket/socketServer";
import ErrorHandler from "../../utils/ErrorHandler";
import { NextFunction, Response } from "express";
import { sendNotification } from "../../utils/notificationSender";

const _commentsRepository = new Repository<comments>("comments");
const _notificationsRepository = new Repository<notifications>("notifications");
const _articlesRepository = new Repository<articles>("articles");
const _commentLikesRepository = new Repository<comment_likes>("comment_likes");
const createComment = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    //articleId and the comment as content
    const { articleId, content } = req.body;
    //commenter id
    const authorId = req.id;
    //parent id
    const parentId = req.query.parentId;

    // Create notification for article author
    const article: any = await _articlesRepository.findUnique({
      where: { id: articleId },
      select: {
        author_id: true,
        title: true,
        slug: true,
        User: { select: { domain: true } },
      },
    });

    if (!article) return next(new ErrorHandler("Article not found", NOT_FOUND));

    const comment = await _commentsRepository.create({
      id: uuidv4(),
      article_id: articleId,
      author_id: authorId,
      content,
      parent_id: parentId || null,
    });

    sendResponse(res, {
      success: true,
      message: "Comment created successfully",
      statusCode: OK,
      data: comment,
    });

      // Send notification after response

        await sendNotification(article.author_id, authorId, `commented on your article "${article.title}"`, `/${article.User.domain}/${article.slug}`, 'comment', 'New Comment');
      
  },
);

// Fetch all comments and replies for an article
const getComments = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { articleId } = req.params;

    const comments = await _commentsRepository.findMany({
      where: {
        article_id: articleId,
        parent_id: null, // Get top-level comments
      },
      include: {
        User: {
          select: {
            name: true,
            avatar: true,
            domain: true,
          },
        },
        other_comments: {
          // This is the correct relation name from your schema
          include: {
            User: {
              select: {
                name: true,
                avatar: true,
                domain: true,
              },
            },
            comment_likes: true,
          },
          orderBy: { created_at: "asc" },
        },
        comment_likes: true,
      },
      orderBy: { created_at: "desc" },
    });

    sendResponse(res, {
      success: true,
      message: "Comments fetched successfully",
      statusCode: OK,
      data: comments,
    });
  },
);



// comment like
const toggleCommentLike = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const { commentAuthor, article: articleId } = req.query;
    const userId = req.id;

    const existingLike = await _commentLikesRepository.findOne({
      where: {
        comment_id: commentId,
        user_id: userId,
      },
    });

    if (existingLike) {
      await _commentLikesRepository.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await _commentLikesRepository.create({
        id: uuidv4(),
        comment_id: commentId,
        user_id: userId,
      });
    }

    // Send response first
    sendResponse(res, {
      success: true,
      message: existingLike ? "Comment unliked" : "Comment liked",
      statusCode: OK,
      data: { isLiked: !existingLike },
    });
    
    // sendCommentLikeNotification(commentAuthor, userId, articleId, existingLike);
    const article: any = await _articlesRepository.findUnique({
      where: { id: articleId },
      select: {
        author_id: true,
        title: true,
        slug: true,
        User: { select: { domain: true } },
      },
    });
    await sendNotification(commentAuthor, userId, `Liked your comment in "${article.title}"`, `/${article.User.domain}/${article.slug}#comments-preview`, 'other', 'Others');
  }
);

// Asynchronous notification function (runs in background)
// const sendCommentLikeNotification = async (commentAuthor: string, userId: string, articleId: string, existingLike: any) => {
//   try {
//     console.log("sending notification...");
//     if (commentAuthor !== userId && !existingLike) {
//       const article: any = await _articlesRepository.findUnique({
//         where: { id: articleId },
//         select: {
//           author_id: true,
//           title: true,
//           slug: true,
//           User: { select: { domain: true } },
//         },
//       });

//       if (!article) {
//         console.error("Article not found for notification.");
//         return;
//       }

//       const notification = await _notificationsRepository.create({
//         id: uuidv4(),
//         recipient_id: commentAuthor,
//         sender_id: userId,
//         type: "other",
//         title: "Others",
//         content: `Liked your comment in "${article.title}"`,
//         url_to: `/${article.User.domain}/${article.slug}#comments-preview`,
//         is_read: false,
//         highlight: true,
//       });

//       // Send real-time notification
//       const recipientSocketId = userSocketMap.get(commentAuthor);
//       if (recipientSocketId) {
//         io.to(recipientSocketId).emit("new-notification", notification);
//       } else {
//         console.warn("Recipient socket not found, user might be offline.");
//       }
//     }
//   } catch (error) {
//     console.error("Failed to send notification:", error);
//   }
// };
const deleteComment = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const userId = req.id;

    const comment = await _commentsRepository.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return next(new ErrorHandler("Comment not found", NOT_FOUND));
    }

    if (comment.author_id !== userId) {
      return next(
        new ErrorHandler("Not authorized to delete this comment", UNAUTHORIZED),
      );
    }

    await _commentsRepository.delete({
      where: { id: commentId },
    });

    sendResponse(res, {
      success: true,
      message: "Comment deleted successfully",
      statusCode: OK,
      data: comment,
    });
  },
);

export const commentsController = {
  createComment,
  getComments,
  toggleCommentLike,
  deleteComment,
};
