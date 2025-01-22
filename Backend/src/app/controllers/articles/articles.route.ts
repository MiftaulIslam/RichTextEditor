// articles.route.ts

import { Router } from 'express';
import { ArticlesControllers } from './articles.controller';
import { isAuthenticate } from '../../middlewares/isAuthenticate';
import upload from '../../utils/Multer';

const articles = Router();
articles.get("/", ArticlesControllers.getArticles);

articles.post("/p", isAuthenticate,ArticlesControllers.addArticle)
articles.put("/p/:articleId/e", isAuthenticate,upload.single("thumbnail"),ArticlesControllers.updateArticle)
export const ArticlesRoutes = articles;
