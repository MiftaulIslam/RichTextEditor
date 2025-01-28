import { notifications } from './../../../../node_modules/.prisma/client/index.d';
import { PrismaClient } from '@prisma/client';
import { Repository } from "../../repository/implementation/Repository";
import catchAsync from '../../utils/CatchAsyncError';
import { AuthenticatedRequest } from '../../middlewares/isAuthenticate';
import { Request, Response } from 'express';
import sendResponse from '../../utils/SendResponse';
import { OK } from '../../utils/Http-Status';

const prisma = new PrismaClient();
const _notificationsRepository = new Repository<notifications>("notifications");

const getNotifications = catchAsync(async (req: AuthenticatedRequest, res:Response) => {
  const userId = req.id;

  const notifications:any = await _notificationsRepository.findMany({
    where: { recipient_id: userId },
    orderBy: { created_at: 'desc' },
    include: {
      User_notifications_sender_idToUser: {
        select: {
          name: true,
          avatar: true
        }
      }
    }
  });

  // Transform the data to match the frontend structure
  const transformedNotifications = notifications.map((n:any) => ({
    ...n,
    sender: {
      name: n.User_notifications_sender_idToUser.name,
      avatar: n.User_notifications_sender_idToUser.avatar
    }
  }));

  return sendResponse(res, {
    success: true,
    message: "Notifications retrieved successfully",
    statusCode: OK,
    data: transformedNotifications
  });
});

const markAsRead = catchAsync(async (req: AuthenticatedRequest, res:Response) => {
  const userId = req.id;
  const notificationId = req.params.id;

  await _notificationsRepository.update({
    where: {
      id: notificationId,
      recipient_id: userId
    }
  }, {
    is_read: true
  });

  return sendResponse(res, {
    success: true,
    message: "Notification marked as read",
    statusCode: OK,
    data: null
  });
});

export const NotificationsControllers = {
  getNotifications,
  markAsRead
}; 