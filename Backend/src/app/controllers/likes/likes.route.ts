// likes.route.ts
import { likesController } from './likes.controller';
import { Router } from 'express';
import { isAuthenticate } from '../../middlewares/isAuthenticate';

const likes = Router();
likes.post('/article/:articleId/like', isAuthenticate, likesController.toggleLike);
export const LikesRoutes = likes;
