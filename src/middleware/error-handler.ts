import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";
import { config } from "../utils";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors(), success: false, stack: !config.__prod__ ? err.stack : {} })
  }

  res.status(400).send({
    errors: [{ message: 'Something went wrong', stack: !config.__prod__ ? err.stack : {} }]
  })
}
