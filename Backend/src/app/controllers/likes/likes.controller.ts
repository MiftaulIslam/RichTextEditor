import { likes } from "@prisma/client";
import { AuthenticatedRequest } from "../../middlewares/isAuthenticate";
import catchAsync from "../../utils/CatchAsyncError";
import { Repository } from "../../repository/implementation/Repository";
import sendResponse from "../../utils/SendResponse";
import { OK } from "../../utils/Http-Status";
import { v4 as uuidv4 } from 'uuid';
const _likesRepository = new Repository<likes>("likes");
const toggleLike = catchAsync(async (req: AuthenticatedRequest, res, next) => {
    const { articleId } = req.params;
    const userId = req.query.userId as string;
  
    // Check if like exists
    const existingLike = await _likesRepository.findOne({
      where: {
        article_id: articleId,
        user_id: userId
      }
    });
  
    if (existingLike) {
      // Unlike
      await _likesRepository.delete({
        where: {
          id: existingLike.id
        }
      });
    } else {
      // Like
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
  });
  
  // Add to exports
  export const likesController = { toggleLike };