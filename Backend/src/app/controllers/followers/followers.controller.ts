import { follows, PrismaClient, User } from '@prisma/client';
import { Repository } from "../../repository/implementation/Repository";
import catchAsync from '../../utils/CatchAsyncError';
import { AuthenticatedRequest } from '../../middlewares/isAuthenticate';
import { v4 as uuidv4 } from 'uuid';
import { io, userSocketMap } from '../../../socket/socketServer';
import sendResponse from '../../utils/SendResponse';
import { BAD_REQUEST, OK } from '../../utils/Http-Status';
import ErrorHandler from '../../utils/ErrorHandler';

const prisma = new PrismaClient();
const _followersRepository = new Repository<follows>("follows")
const _notificationsRepository = new Repository("notifications")
const _userRepository = new Repository<User>("User")

const followUser = catchAsync(async (req: AuthenticatedRequest, res, next) => {
  const followerId = req.id;
  const followingId = req.params.id;

  // Check if already following
  const existingFollow = await _followersRepository.findUnique({
    where: {
      follower_id_following_id: {
        follower_id: followerId,
        following_id: followingId
      }
    }
  });

  if (existingFollow) {
    return next(new ErrorHandler("Already following this user", BAD_REQUEST));
  }

  // Create follow relationship
  const follow = await _followersRepository.create({
    follower_id: followerId,
    following_id: followingId
  });

  const follower = await _userRepository.findUnique({where:{id:followerId}})
  
  // Create notification
  const notification = await _notificationsRepository.create({
    id: uuidv4(),
    recipient_id: followingId,
    sender_id: followerId,
    type: 'follow',
    title: 'New Follower',
    content: `started following you`,
    url_to: `/profile/${follower?.domain}`,
    is_read: false,
    highlight: true
  });

  // Get recipient's socket ID and emit notification
  const recipientSocketId = userSocketMap.get(followingId);
  if (recipientSocketId) {
    io.to(recipientSocketId).emit('new-notification', notification);
  }

  return sendResponse(res, {
    success: true,
    message: "Successfully followed user",
    statusCode: OK,
    data: follow
  });
});

const unfollowUser = catchAsync(async (req: AuthenticatedRequest, res, next) => {
  const followerId = req.id;
  const followingId = req.params.id;

  const follow = await _followersRepository.delete({
    where: {
      follower_id_following_id: {
        follower_id: followerId,
        following_id: followingId
      }
    }
  });

  if (!follow) {
    return next(new ErrorHandler("Not following this user", BAD_REQUEST));
  }

  return sendResponse(res, {
    success: true,
    message: "Successfully unfollowed user",
    statusCode: OK,
    data: follow
  });
});

export const FollowersControllers = {
  followUser,
  unfollowUser
};
