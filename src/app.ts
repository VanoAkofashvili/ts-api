import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import morgan from "morgan";
import { currentUser, errorHandler } from "./middleware";
import { NotFoundError } from "./errors";
import usersRoute from "./routes/users.route";

const app = express();
app.use(json());
app.use(currentUser);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/users', usersRoute);

app.all('*', async (req, res) => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };