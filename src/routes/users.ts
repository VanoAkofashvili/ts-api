import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../repos/user-repo";


const router = express.Router();

router.post('/signup', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim(),
  body('firstname').trim(),
  body('username').trim()
], async (req: Request, res: Response) => {
  const { email, password, firstname, username } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error('user already exists');
  }

  const user = await User.create({ email, password, firstname, username });

  // Generate JWT
  const userJwt = jwt.sign(
    {
      //@ts-ignore
      id: user.id,
      // @ts-ignore
      email: user.email
    },
    process.env.JWT_KEY!
  )
  //@ts-ignore
  user.jwt = userJwt;

  res.status(201).send(user);

});

export default router;