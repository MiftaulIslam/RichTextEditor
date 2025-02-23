import { Router } from 'express';
import { isAuthenticate } from '../../middlewares/isAuthenticate';
import { commentsController } from '../../controllers/comments/comments.controller';

const router = Router();

// Create and get comments
router.post('/', isAuthenticate, commentsController.createComment);
router.get('/:articleId', commentsController.getComments);

// Like/unlike comments
router.post('/:commentId/like', isAuthenticate, commentsController.toggleCommentLike);
router.delete('/:commentId', isAuthenticate, commentsController.deleteComment);

export const CommentsRoutes = router; 