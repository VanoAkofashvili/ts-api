import express from "express";
import { json } from "body-parser";
import morgan from "morgan";

import usersRoute from "./routes/users";
const app = express();
app.use(json());


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/users', usersRoute);

export { app };