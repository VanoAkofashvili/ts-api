import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import morgan from "morgan";
import { currentUser, errorHandler } from "./middleware";
import { NotFoundError } from "./errors";
import usersRouter from "./routes/users.route";
import postsRouter from "./routes/posts.route";

export default function () {
  const app = express();
  app.use(json());
  app.use(currentUser);

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  app.use('/api/users', usersRouter);
  app.use('/api/posts', postsRouter);

  app.all('*', async (req, res) => {
    throw new NotFoundError();
  })

  app.use(errorHandler);

  return app;
}
