import { likes } from "@prisma/client";
import { AuthenticatedRequest } from "../../middlewares/isAuthenticate";
import catchAsync from "../../utils/CatchAsyncError";
import { Repository } from "../../repository/implementation/Repository";
import sendResponse from "../../utils/SendResponse";
import { OK } from "../../utils/Http-Status";
import { v4 as uuidv4 } from 'uuid';
import { notifications } from "@prisma/client";
import { Repository as NotificationsRepository } from "../../repository/implementation/Repository";
import { io, userSocketMap } from "../../../socket/socketServer";

const _likesRepository = new Repository<likes>("likes");
const _notificationsRepository = new NotificationsRepository<notifications>("notifications");

const toggleLike = catchAsync(async (req: AuthenticatedRequest, res, next) => {
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

    // Don't notify if user likes their own article
    if (userId !== authorId) {
      const notification = await _notificationsRepository.create({
        id: uuidv4(),
        recipient_id: authorId,
        sender_id: userId,
        type: 'like',
        title: 'New Like',
        content: `liked your article`,
        url_to: `/${authorDomain}/${articleSlug}`, // Gets current article URL
     
        is_read: false,
        highlight: true
      });

      // Send real-time notification
      const recipientSocketId = userSocketMap.get(authorId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('new-notification', notification);
      }
    }
  }

  sendResponse(res, {
    success: true,
    statusCode: OK,
    message: existingLike ? "Article unliked" : "Article liked",
    data: { isLiked: !existingLike }
  });
});

// Add to exports
export const likesController = { toggleLike };