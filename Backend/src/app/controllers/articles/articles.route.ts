// articles.route.ts

import { Router } from 'express';
import { ArticlesControllers } from './articles.controller';
import { isAuthenticate } from '../../middlewares/isAuthenticate';
import upload from '../../utils/Multer';

const articles = Router();
articles.get("/", ArticlesControllers.getArticles);
articles.get("/:domain/:articleSlug", ArticlesControllers.getArticleBySlug);

articles.post("/p", isAuthenticate,ArticlesControllers.addArticle)
articles.put("/p/:articleId/e", isAuthenticate,upload.single("thumbnail"),ArticlesControllers.updateArticle)
articles.delete("/:articleId/d", isAuthenticate,ArticlesControllers.deleteArticle)
export const ArticlesRoutes = articles;
