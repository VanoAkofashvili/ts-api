import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { config, logError } from '../utils';

interface UserPayload {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  const jwtToken = req.headers['authorization'];

  if (!jwtToken) {
    return next();
  }

  try {
    const payload = jwt.verify(
      jwtToken,
      config.JWT_KEY
    ) as UserPayload
    req.currentUser = payload;
  } catch (err) {
    logError('currentUser error block');
  }

  next();
}