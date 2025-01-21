import { Router } from 'express';
import { UserRoutes } from '../controllers/user/user.route';
import { ArticlesRoutes } from '../controllers/articles/articles.route';
const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },  {
    path: '/articles',
    route: ArticlesRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
