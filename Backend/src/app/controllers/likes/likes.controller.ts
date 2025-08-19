import { likes } from "@prisma/client";
import { AuthenticatedRequest } from "../../middlewares/isAuthenticate";
import catchAsync from "../../utils/CatchAsyncError";
import { Repository } from "../../repository/implementation/Repository";
import sendResponse from "../../utils/SendResponse";
import { OK } from "../../utils/Http-Status";
import { v4 as uuidv4 } from 'uuid';
import { notifications } from "@prisma/client";
import { Request, Response, NextFunction } from 'express';
import { Repository as NotificationsRepository } from "../../repository/implementation/Repository";
import { io, userSocketMap } from "../../../socket/socketServer";
import { sendNotification } from "../../utils/notificationSender";

const _likesRepository = new Repository<likes>("likes");
const _notificationsRepository = new NotificationsRepository<notifications>("notifications");

const toggleLike = catchAsync(async (req: AuthenticatedRequest, res:Response) => {
  const { articleId } = req.params;
  const authorId = req.query.authorId as string;
  const authorDomain = req.query.authorDomain as string;
  const articleSlug = req.query.articleSlug as string;
  const userId = req.id;

  const existingLike = await _likesRepository.findOne({
    where: {
      article_id: articleId,
      user_id: userId,
    },
    include: {
      articles: {
        select: {
          id: true,
          title: true,
          slug: true,
          User: {
            select: {
              id: true,
              domain: true,
            }
          }
        },
      },
    },
  });
  if (existingLike) {
    await _likesRepository.delete({
      where: {
        id: existingLike.id
      }
    });
    
  } else {
    await _likesRepository.create({
      id: uuidv4(),
      article_id: articleId,
      user_id: userId
    });
    
  }

  sendResponse(res, {
    success: true,
    statusCode: OK,
    message: existingLike ? "Article unliked" : "Article liked",
    data: { isLiked: !existingLike }
  });
  // Send notification after response
  if (!existingLike) {
    await sendNotification(authorId, userId, `liked your article`, `/${authorDomain}/${articleSlug}`, 'like', 'New Like');
  }
});

// Add to exports
export const likesController = { toggleLike };