/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { globalErrorHandler, notFound } from "./app/middlewares"; // Importing both middlewares
import routes from "./app/routes/routes";
import { scheduleArticlePublishing } from './app/cronJobs/scheduleBasedArticlePublishing';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { frontend_url, port } from './app/config/config';

const app: Application = express();
// const io = new Server(3000);
/* app default middlewares */
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

scheduleArticlePublishing();

/* application routes */
app.use(`/api/v1`, routes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome habibi' });
});

/* custom middlewares */

app.use(globalErrorHandler);

app.use('*', notFound);

export default app;
