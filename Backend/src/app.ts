/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import express, { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import { globalErrorHandler, notFound } from "./app/middlewares"; // Importing both middlewares
import routes from "./app/routes/routes";

const app: Application = express();

/* app default middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
/* application routes */
app.use(`/api/v1`, routes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome habibi' });
});

/* custom middlewares */

app.use(globalErrorHandler);

app.use('*', notFound);

export default app;
