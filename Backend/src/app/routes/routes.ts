import { Router } from 'express';
import { UserRoutes } from '../controllers/user/user.route';
import { ArticlesRoutes } from '../controllers/articles/articles.route';
import { FollowersRoutes } from '../controllers/followers/followers.route';
import { NotificationsRoutes } from '../controllers/notifications/notifications.route';
import { LikesRoutes } from '../controllers/likes/likes.route';
import { CommentsRoutes } from '../controllers/comments/comments.route';
const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },  {
    path: '/articles',
    route: ArticlesRoutes,
  },
  {
    path: '/followers',
    route: FollowersRoutes,
  },
  {
    path: '/likes',
    route: LikesRoutes,
  },
  {
    path: '/notifications',
    route: NotificationsRoutes,
  },
  {
    path: '/comments',
    route: CommentsRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
